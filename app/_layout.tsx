// app/_layout.tsx
// Layout raíz de Expo Router. Inicializa la app, verifica la sesión, aplica providers globales y renderiza la pantalla actual.

import 'fast-text-encoding';
import 'react-native-gesture-handler';

import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, ActivityIndicator, View } from 'react-native';
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

  // 2. Protección global de rutas privadas.
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

  // Loader inicial de protección.
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