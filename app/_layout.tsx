// 1. POLIFILLS Y LIMPIEZA DE MOTOR DE RED (DEBEN IR PRIMERO)
import 'fast-text-encoding'; 

// Verificamos y eliminamos polyfills que interfieren con el SSL Nativo de Android
if (typeof global.fetch !== 'undefined' && (global.fetch as any).polyfill) {
  const _global = global as any;
  delete _global.fetch;
  delete _global.Headers;
  delete _global.Request;
  delete _global.Response;
  console.log("⚠️ Polyfill whatwg-fetch eliminado. Usando motor nativo de Android.");
} else {
  console.log("✅ Usando motor de red nativo.");
}

// 2. IMPORTS DE LIBRERÍAS
import 'react-native-gesture-handler';
import { Slot, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { setBackgroundColorAsync } from 'expo-system-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 3. IMPORTS DEL PROYECTO
import HistoryHeader, { PathToTitle } from '@/components/NavigationHistoryHeader';
import BottomBar from '@/components/BottomBar';
import { visitante, setVisitante, ObtenerDatosBaseUsuarioConToken } from '@/data/DatosUsuarioGuarani';
import { azulMedioUndav } from '@/constants/Colors';
import { AgendaProvider } from '@/src/context/AgendaContext';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [sesionVerificada, setSesionVerificada] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const pathName = usePathname();
  const router = useRouter();

  const headerHistoryTitle = PathToTitle(pathName);
  const desactivarHistoryHeaderEnRutas = ['/', '/loginAutenticado', '/loginMail', '/home-estudiante', '/home-visitante'];
  const showHeader = !desactivarHistoryHeaderEnRutas.includes(pathName);

  const desactivarBottomBarEnRutas = ['/', '/loginAutenticado', '/loginMail'];
  const showBottomBar = !desactivarBottomBarEnRutas.includes(pathName);

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
          // Si ya tiene sesión, lo mandamos al home si está en el index o login
          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace('/home-estudiante');
          }
        } else {
          setVisitante(true);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setVisitante(true);
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

  // Pantalla de carga
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
            
            {/* El Slot renderiza la página actual */}
            <Slot />
            
            {showBottomBar && !visitante && <BottomBar />}
          </SafeAreaView>
        </AgendaProvider>
      </TutorialProvider>
    </GestureHandlerRootView>
  );
}