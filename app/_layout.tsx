// app/_layout.tsx
// Layout raíz de Expo Router. Inicializa la app, verifica la sesión, aplica providers globales y renderiza la pantalla actual.

import 'fast-text-encoding';
import 'react-native-gesture-handler';

import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Platform, StatusBar, ActivityIndicator, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { setBackgroundColorAsync } from 'expo-system-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  visitante as visitanteGlobal,
  setVisitante,
  ObtenerDatosBaseUsuarioConToken,
} from '@/data/apiAppUndav';
import { azulMedioUndav } from '@/constants/Colors';
import { AgendaProvider } from '@/src/context/AgendaContext';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';
import AppShell from '@/components/AppShell';

import {
  esRutaPrivada,
  esRutaLogin,
} from '@/constants/routeConfig';

// IMPORTACIONES PARA EL POLLING GLOBAL
import { cargarNoticias, todasLasNotificaciones, setNotificationCount } from '@/data/notificaciones';

const TIEMPO_POLLING_NOTIFICACIONES = 30000;

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [sesionVerificada, setSesionVerificada] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [esVisitante, setEsVisitante] = useState(true);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const pathName = usePathname();
  const router = useRouter();

  const refCantidadPrevia = useRef<number>(-1);

  // Variable de control externa al ciclo de renderizado para evitar parpadeos
  const refControlLectura = useRef<{ leido: boolean; cantidadAlLeer: number }>({
    leido: false,
    cantidadAlLeer: 0,
  });

  // 1. Inicialización de sesión al abrir la app
  useEffect(() => {
    const prepararApp = async () => {
      if (Platform.OS === 'android') {
        await setBackgroundColorAsync(azulMedioUndav);
      }

      try {
        const token = await AsyncStorage.getItem('token');
        const personaIdStr = await AsyncStorage.getItem('idPersona');

        if (token && personaIdStr) {
          const personaId = parseInt(personaIdStr, 10);

          await ObtenerDatosBaseUsuarioConToken(token, personaId);

          setVisitante(false);
          setEsVisitante(false);
          setUsuarioAutenticado(true);

          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace('/home-estudiante');
          }
        } else {
          setVisitante(true);
          setEsVisitante(true);
          setUsuarioAutenticado(false);

          if (pathName === '/') {
            router.replace('/loginAutenticado');
          }
        }
      } catch (error) {
        console.error('❌ [Sesión] Error al verificar sesión:', error);

        setVisitante(true);
        setEsVisitante(true);
        setUsuarioAutenticado(false);

        if (pathName === '/') {
          router.replace('/loginAutenticado');
        }
      } finally {
        setSesionVerificada(true);
        setIsReady(true);
      }
    };

    prepararApp();
  }, []);

  // 2. Protección global de rutas privadas
  useEffect(() => {
    if (!sesionVerificada) return;

    let visitanteActual = esVisitante;

    /**
     * Caso especial:
     * Si el usuario acaba de loguearse y fue enviado a home-estudiante,
     * sincronizamos el estado local del layout con la variable global existente.
     *
     * Esto mantiene compatibilidad con el flujo actual sin hacer todavía
     * un refactor profundo hacia SessionContext.
     */
    if (pathName === '/home-estudiante' && !visitanteGlobal) {
      setEsVisitante(false);
      setUsuarioAutenticado(true);
      visitanteActual = false;
    }

    /**
     * Si el usuario vuelve al flujo de login, apagamos el estado autenticado.
     */
    if (esRutaLogin(pathName)) {
      setUsuarioAutenticado(false);
    }

    /**
     * Solo bloqueamos rutas explícitamente declaradas como privadas.
     * Las pantallas públicas para visitantes no necesitan token.
     */
    if (esRutaPrivada(pathName) && visitanteActual) {
      console.log(`🛑 [Seguridad Global] Bloqueado intento de navegación a ${pathName} sin credenciales.`);
      router.replace('/loginAutenticado');
    }
  }, [pathName, sesionVerificada, esVisitante, router]);

  // 3. Polling activo de notificaciones
  useEffect(() => {
    if (!sesionVerificada || esVisitante || !usuarioAutenticado) {
      refCantidadPrevia.current = -1;
      refControlLectura.current = { leido: false, cantidadAlLeer: 0 };
      return;
    }

    const ejecutarSincronizacion = async () => {
      try {
        console.log('🔄 [Polling] Consultando novedades en el servidor Flask...');

        // 1. Descargamos la realidad actual del servidor
        const noticiasServidor = await cargarNoticias();
        const cantidadServidor = noticiasServidor.length;

        // 2. Si está en la pantalla de notificaciones, asimilamos la lectura y matamos globos
        if (pathName === '/notificaciones') {
          refCantidadPrevia.current = cantidadServidor;
          refControlLectura.current = { leido: true, cantidadAlLeer: cantidadServidor };
          setNotificationCount(0);
          return;
        }

        /**
         * Detección de borrados:
         * Si el servidor tiene menos o igual cantidad de notas que antes,
         * pero el usuario no entró a leer, significa que se limpió o sincronizó el backend.
         */
        if (refCantidadPrevia.current !== -1 && cantidadServidor <= refCantidadPrevia.current) {
          console.log(
            `🧹 [Polling] Se detectó limpieza o consistencia en el servidor (${cantidadServidor}). Actualizando referencias.`
          );

          refCantidadPrevia.current = cantidadServidor;

          if (
            refControlLectura.current.leido &&
            cantidadServidor <= refControlLectura.current.cantidadAlLeer
          ) {
            setNotificationCount(0);
            refControlLectura.current.cantidadAlLeer = cantidadServidor;
          }

          return;
        }

        // 3. Carga inicial completa
        if (refCantidadPrevia.current === -1) {
          refCantidadPrevia.current = cantidadServidor;

          if (cantidadServidor > 0 && !refControlLectura.current.leido) {
            setNotificationCount(cantidadServidor);

            setTimeout(() => {
              const listaTotal = todasLasNotificaciones();
              const ultimaNoticia = listaTotal[0];

              Alert.alert(
                '🔔 Notificaciones Pendientes',
                `${ultimaNoticia && ultimaNoticia.titulo ? ultimaNoticia.titulo : 'Tienes novedades en tu cartelera.'}\n\nHay ${cantidadServidor} avisos académicos esperando tu lectura.`,
                [
                  { text: 'Ignorar', style: 'cancel' },
                  { text: 'Ver', onPress: () => router.push('/notificaciones') },
                ]
              );
            }, 500);
          }

          return;
        }

        // 4. Control antifantasma después de lectura
        if (refControlLectura.current.leido) {
          if (cantidadServidor > refControlLectura.current.cantidadAlLeer) {
            const nuevasReales = cantidadServidor - refControlLectura.current.cantidadAlLeer;
            setNotificationCount(nuevasReales);
          } else {
            setNotificationCount(0);
          }

          refCantidadPrevia.current = cantidadServidor;
          return;
        }

        // 5. Nuevas publicaciones en tiempo real
        if (cantidadServidor > refCantidadPrevia.current) {
          const diferencia = cantidadServidor - refCantidadPrevia.current;
          setNotificationCount(diferencia);

          setTimeout(() => {
            const listaTotal = todasLasNotificaciones();
            const ultimaNoticia = listaTotal[0];

            Alert.alert(
              '🔔 Nueva Notificación',
              `${ultimaNoticia && ultimaNoticia.titulo ? ultimaNoticia.titulo : 'Se ha publicado un nuevo aviso.'}\n\nTienes novedades académicas pendientes de revisión.`,
              [
                { text: 'Ignorar', style: 'cancel' },
                { text: 'Ver', onPress: () => router.push('/notificaciones') },
              ]
            );
          }, 300);
        }

        refCantidadPrevia.current = cantidadServidor;
      } catch (e) {
        console.error('❌ [Polling] Error en el ciclo:', e);
      }
    };

    if (pathName === '/notificaciones') {
      ejecutarSincronizacion();
    }

    const timeoutInicial = setTimeout(ejecutarSincronizacion, 1000);
    const idIntervalo = setInterval(ejecutarSincronizacion, TIEMPO_POLLING_NOTIFICACIONES);

    return () => {
      clearTimeout(timeoutInicial);
      clearInterval(idIntervalo);
    };
  }, [sesionVerificada, esVisitante, usuarioAutenticado, pathName, router]);

  // Loader inicial de protección
  if (!isReady || !fontsLoaded || !sesionVerificada) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}
        >
          <ActivityIndicator size="large" color={azulMedioUndav} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TutorialProvider>
        <AgendaProvider usuarioAutenticado={usuarioAutenticado}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <AppShell esVisitante={esVisitante}>
              <Slot />
            </AppShell>
          </SafeAreaView>
        </AgendaProvider>
      </TutorialProvider>
    </GestureHandlerRootView>
  );
}