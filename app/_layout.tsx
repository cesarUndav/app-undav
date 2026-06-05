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
  const [fontsLoaded] = useFonts({ Montserrat_400Regular, Montserrat_700Bold });

  const pathName = usePathname();
  const router = useRouter();
  
  // 🔔 Referencia persistente exclusiva del backend de Flask
  const refCantidadPrevia = useRef<number>(-1);

  const headerHistoryTitle = PathToTitle(pathName);
  const desactivarHistoryHeaderEnRutas = ['/', '/loginAutenticado', '/loginMail', '/home-estudiante', '/home-visitante'];
  const showHeader = !desactivarHistoryHeaderEnRutas.includes(pathName);

  const desactivarBottomBarEnRutas = ['/', '/loginAutenticado', '/loginMail'];
  const showBottomBar = !desactivarBottomBarEnRutas.includes(pathName);

  // 1. Inicialización de Sesión
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
          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace('/home-estudiante');
          }
        } else {
          setVisitante(true);
        }
      } catch (error) {
        setVisitante(true);
        if (pathName === '/') router.replace('/loginAutenticado');
      } finally {
        setSesionVerificada(true);
        setIsReady(true);
      }
    };
    prepararApp();
  }, []);

  // 2. 🔔 POLING ACTIVO DE NOTIFICACIONES (Con Alertas Reactivas Garantizadas)
  useEffect(() => {
    if (!sesionVerificada || visitante) return;

    const ejecutarSincronizacion = async () => {
      try {
        console.log('🔄 [Polling] Consultando novedades en el servidor Flask...');
        const noticiasServidor = await cargarNoticias();
        const cantidadServidor = noticiasServidor.length;

        // Si es el primer arranque, inicializamos la referencia base
        if (refCantidadPrevia.current === -1) {
          refCantidadPrevia.current = cantidadServidor;
          return;
        }

        // 🔔 DETECCIÓN DE ALTAS: Hay más noticias que antes en Flask
        if (cantidadServidor > refCantidadPrevia.current) {
          const diferencia = cantidadServidor - refCantidadPrevia.current;
          
          // Modificamos el contador global (Esto forzará el redibujado de la campana)
          setNotificationCount(diferencia);

          const noticiasCombinadas = todasLasNotificaciones();
          const ultimaNoticia = noticiasCombinadas[0];

          // Lanzamos el modal de alerta nativa
          Alert.alert(
            "🔔 Nueva Notificación",
            `${ultimaNoticia ? ultimaNoticia.titulo : "Tenés novedades pendientes."}\n\n${ultimaNoticia?.contenido ? ultimaNoticia.contenido : ""}`,
            [
              { text: "Ignorar", style: "cancel" },
              { text: "Ver", onPress: () => router.push('/notificaciones') }
            ]
          );
        } 
        // DETECCIÓN DE BAJAS: Se eliminaron noticias en el servidor
        else if (cantidadServidor < refCantidadPrevia.current) {
          console.log('🗑️ [Polling] Se detectaron eliminaciones en el backend de Flask.');
        }

        refCantidadPrevia.current = cantidadServidor;
      } catch (e) {
        console.error('❌ [Polling] Error en el ciclo:', e);
      }
    };

    ejecutarSincronizacion();

    const idIntervalo = setInterval(ejecutarSincronizacion, TIEMPO_POLLING_NOTIFICACIONES);
    return () => clearInterval(idIntervalo);
  }, [sesionVerificada, visitante]);

  // 3. Limpieza de globos al ingresar a la pantalla
  useEffect(() => {
    if (pathName === '/notificaciones') {
      setNotificationCount(0);
    }
  }, [pathName]);

  if (!isReady || !fontsLoaded || !sesionVerificada) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
          <ActivityIndicator size="large" color={azulMedioUndav} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TutorialProvider>
        <AgendaProvider>
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