// app/_layout.tsx
import 'fast-text-encoding';
import 'react-native-gesture-handler';

import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { setBackgroundColorAsync } from 'expo-system-ui';
import * as SecureStore from 'expo-secure-store'; 

import {
  visitante as visitanteGlobal,
  setVisitante,
  ObtenerDatosBaseUsuarioConToken,
} from '@/data/apiAppUndav';

import { azulMedioUndav } from '@/constants/Colors';
import { AgendaProvider } from '@/src/context/AgendaContext';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';
import AppShell from '@/components/AppShell';
import useNotificationPolling from '@/hooks/useNotificationPolling';

import {
  esRutaPrivada,
  esRutaLogin,
} from '@/constants/routeConfig';

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

  useNotificationPolling({
    sesionVerificada,
    esVisitante,
    usuarioAutenticado,
  });

  // 1. Inicialización de sesión al abrir la app.
  useEffect(() => {
    const prepararApp = async () => {
      if (Platform.OS === 'android') {
        await setBackgroundColorAsync(azulMedioUndav);
      }

      try {
        const token = await SecureStore.getItemAsync('token');
        const personaIdStr = await SecureStore.getItemAsync('idPersona');

        if (token && personaIdStr) {
          const personaId = parseInt(personaIdStr, 10);

          // 1. Hidratamos primero la API global
          await ObtenerDatosBaseUsuarioConToken(token, personaId);
          setVisitante(false);
          
          // 2. Modificamos los estados locales de acceso en la misma tanda
          setEsVisitante(false);
          setUsuarioAutenticado(true);

          // 3. Dejamos que los estados se asienten antes de apagar el Loader
          setTimeout(() => {
            setSesionVerificada(true);
            setIsReady(true);
            
            // Redirección controlada post-asentamiento
            if (pathName === '/' || pathName.startsWith('/login')) {
              router.replace('/home-estudiante');
            }
          }, 0);

        } else {
          setVisitante(true);
          setEsVisitante(true);
          setUsuarioAutenticado(false);
          setSesionVerificada(true);
          setIsReady(true);

          if (pathName === '/') {
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error('❌ [Sesión] Error al verificar sesión en SecureStore:', error);

        setVisitante(true);
        setEsVisitante(true);
        setUsuarioAutenticado(false);
        setSesionVerificada(true);
        setIsReady(true);

        if (pathName === '/') {
          router.replace('/login');
        }
      }
    };

    prepararApp();
  }, []);

  // 2. Protección global de rutas privadas (Sincronizada con variables globales inmediatas)
  useEffect(() => {
    // Si todavía está leyendo SecureStore, congelamos cualquier redirección automática
    if (!sesionVerificada || !isReady) return;

    // 🎯 Clave de la corrección: En lugar de confiar en el estado local atrasado (esVisitante),
    // usamos la verdad absoluta e inmediata de la API (visitanteGlobal).
    let visitanteActual = visitanteGlobal;

    // Sincronización en caliente si el cambio vino desde la pantalla de Login manual
    if (pathName === '/home-estudiante' && !visitanteGlobal) {
      if (esVisitante) setEsVisitante(false);
      if (!usuarioAutenticado) setUsuarioAutenticado(true);
      visitanteActual = false;
    }

    if (esRutaLogin(pathName)) {
      if (usuarioAutenticado) setUsuarioAutenticado(false);
    }

    if (esRutaPrivada(pathName) && visitanteActual) {
      console.log(`🛑 [Seguridad Global] Bloqueado intento de navegación a ${pathName}. (Visitante: ${visitanteActual})`);
      router.replace('/login');
    }
  }, [pathName, sesionVerificada, esVisitante, usuarioAutenticado, isReady]);

  // Loader inicial de protección.
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
        {/* Usamos el estado local sincronizado */}
        <AgendaProvider usuarioAutenticado={usuarioAutenticado}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            {/* 🎯 Pasamos la verdad directa de la API para evitar desajustes en el primer render */}
            <AppShell esVisitante={visitanteGlobal}>
              <Slot />
            </AppShell>
          </SafeAreaView>
        </AgendaProvider>
      </TutorialProvider>
    </GestureHandlerRootView>
  );
}