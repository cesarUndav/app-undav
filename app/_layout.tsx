// app/_layout.tsx

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

import HistoryHeader, { PathToTitle } from '@/components/NavigationHistoryHeader';
import BottomBar from '@/components/BottomBar';
import { visitante, setVisitante, ObtenerDatosBaseUsuarioConToken } from '@/data/apiAppUndav';
import { azulMedioUndav } from '@/constants/Colors';
import { AgendaProvider } from '@/src/context/AgendaContext';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';

// IMPORTACIONES PARA EL POLLING GLOBAL
import { cargarNoticias, todasLasNotificaciones, setNotificationCount } from '@/data/notificaciones';

const TIEMPO_POLLING_NOTIFICACIONES = 30000;

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [sesionVerificada, setSesionVerificada] = useState(false);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false); 
  const [fontsLoaded] = useFonts({ Montserrat_400Regular, Montserrat_700Bold });

  const pathName = usePathname();
  const router = useRouter();
  
  const refCantidadPrevia = useRef<number>(-1);

  const headerHistoryTitle = PathToTitle(pathName);
  const desactivarHistoryHeaderEnRutas = ['/', '/loginAutenticado', '/loginMail', '/home-estudiante', '/home-visitante'];
  const showHeader = !desactivarHistoryHeaderEnRutas.includes(pathName);

  const desactivarBottomBarEnRutas = ['/', '/loginAutenticado', '/loginMail'];
  const showBottomBar = !desactivarBottomBarEnRutas.includes(pathName);

  // 1. Inicialización de Sesión al abrir la app
  useEffect(() => {
    const prepararApp = async () => {
      if (Platform.OS === 'android') await setBackgroundColorAsync(azulMedioUndav);
      try {
        const token = await AsyncStorage.getItem('token');
        const personaIdStr = await AsyncStorage.getItem('idPersona');

        if (token && personaIdStr) {
          const personaId = parseInt(personaIdStr, 10);
          await ObtenerDatosBaseUsuarioConToken(token, personaId);
          setVisitante(false);
          setUsuarioAutenticado(true); 
          
          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace('/home-estudiante');
          }
        } else {
          setVisitante(true);
          setUsuarioAutenticado(false);
          if (pathName === '/') router.replace('/loginAutenticado');
        }
      } catch (error) {
        setVisitante(true);
        setUsuarioAutenticado(false);
        if (pathName === '/') router.replace('/loginAutenticado');
      } finally {
        setSesionVerificada(true);
        setIsReady(true);
      }
    };
    prepararApp();
  }, []);

  // 🛠️ CONTROL GLOBAL B: Proteger rutas privadas en tiempo real + Escuchar login exitoso dinámico
  useEffect(() => {
    if (!sesionVerificada) return;

    const rutasPublicas = ['/', '/loginAutenticado', '/loginMail', '/home-visitante'];
    const esRutaProtegida = !rutasPublicas.includes(pathName);

    // Si entra al Home Estudiante significa que se acaba de loguear de forma manual en caliente
    if (pathName === '/home-estudiante' && !visitante) {
      setUsuarioAutenticado(true);
    }

    // Si sale al Login, limpiamos estados para congelar peticiones
    if (rutasPublicas.includes(pathName) && pathName !== '/home-visitante') {
      setUsuarioAutenticado(false);
    }

    if (esRutaProtegida && visitante) {
      console.log(`🛑 [Seguridad Global] Bloqueado intento de navegación a ${pathName} sin credenciales.`);
      router.replace('/loginAutenticado');
    }
  }, [pathName, sesionVerificada]);


// 🎯 Variable de control externa al ciclo de renderizado para evitar parpadeos
  const refControlLectura = useRef<{ leido: boolean; cantidadAlLeer: number }>({ leido: false, cantidadAlLeer: 0 });

  // 2. 🔔 POLLING ACTIVO DE NOTIFICACIONES (Blindado contra borrados en el Servidor)
  useEffect(() => {
    if (!sesionVerificada || visitante || !usuarioAutenticado) {
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

        // 🎯 DETECCIÓN DE BORRADOS: Si el servidor tiene MENOS o IGUAL número de notas que antes,
        // pero el usuario no ha entrado a leer, significa que limpiaste el backend. Sincronizamos la base física.
        if (refCantidadPrevia.current !== -1 && cantidadServidor <= refCantidadPrevia.current) {
          console.log(`🧹 [Polling] Se detectó una limpieza o consistencia en el servidor (${cantidadServidor}). Actualizando referencias.`);
          refCantidadPrevia.current = cantidadServidor;
          
          // Si por el borrado ahora coincide con lo que el usuario ya leyó, apagamos el globo
          if (refControlLectura.current.leido && cantidadServidor <= refControlLectura.current.cantidadAlLeer) {
            setNotificationCount(0);
            refControlLectura.current.cantidadAlLeer = cantidadServidor;
          }
          return; 
        }

        // 3. CARGA INICIAL COMPLETA (Arranque limpio de la App)
        if (refCantidadPrevia.current === -1) {
          refCantidadPrevia.current = cantidadServidor;
          
          if (cantidadServidor > 0 && !refControlLectura.current.leido) {
            setNotificationCount(cantidadServidor);
            
            // Forzamos un pequeño delay para que el hilo nativo de la UI esté libre para dibujar la alerta
            setTimeout(() => {
              const listaTotal = todasLasNotificaciones();
              const ultimaNoticia = listaTotal[0];

              Alert.alert(
                "🔔 Notificaciones Pendientes",
                `${ultimaNoticia && ultimaNoticia.titulo ? ultimaNoticia.titulo : "Tienes novedades en tu cartelera."}\n\nHay ${cantidadServidor} avisos académicos esperando tu lectura.`,
                [
                  { text: "Ignorar", style: "cancel" },
                  { text: "Ver", onPress: () => router.push('/notificaciones') }
                ]
              );
            }, 500);
          }
          return;
        }

        // 4. CONTROL ANTIFANTASMA (Navegación estándar post-lectura)
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

        // 5. NUEVAS PUBLICACIONES (En tiempo real mientras usa la App)
        if (cantidadServidor > refCantidadPrevia.current) {
          const diferencia = cantidadServidor - refCantidadPrevia.current;
          setNotificationCount(diferencia);

          setTimeout(() => {
            const listaTotal = todasLasNotificaciones();
            const ultimaNoticia = listaTotal[0];

            Alert.alert(
              "🔔 Nueva Notificación",
              `${ultimaNoticia && ultimaNoticia.titulo ? ultimaNoticia.titulo : "Se ha publicado un nuevo aviso."}\n\nTienes novedades académicas pendientes de revisión.`,
              [
                { text: "Ignorar", style: "cancel" },
                { text: "Ver", onPress: () => router.push('/notificaciones') }
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
  }, [sesionVerificada, visitante, usuarioAutenticado, pathName]);

  // Loader inicial de protección
  if (!isReady || !fontsLoaded || !sesionVerificada) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
          <ActivityIndicator size="large" color={azulMedioUndav} />
        </View>
      </GestureHandlerRootView>
    );
  }

  // 🎯 ESTRUCTURA TOTALMENTE ASEGURADA:
  // El Provider envuelve permanentemente al <Slot />, solucionando el error 'useAgenda debe usarse dentro de un AgendaProvider'
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TutorialProvider>
        <AgendaProvider usuarioAutenticado={usuarioAutenticado}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            
            {showHeader && <HistoryHeader title={headerHistoryTitle} />}
            
            <Slot />
            
            {showBottomBar && !visitante && <BottomBar />}
          </SafeAreaView>
        </AgendaProvider>
      </TutorialProvider>
    </GestureHandlerRootView>
  );
}