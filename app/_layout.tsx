import 'react-native-gesture-handler'; // <-- PRIMERA línea siempre
import { Slot, Stack, usePathname, useRouter } from 'expo-router';
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

import HistoryHeader, { PathToTitle } from '@/components/NavigationHistoryHeader';
import BottomBar from '@/components/BottomBar';
import { visitante, setVisitante, ObtenerDatosBaseUsuarioConToken } from '@/data/DatosUsuarioGuarani';
import { azulMedioUndav } from '@/constants/Colors';

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
  const desactivarHistoryHeaderEnRutas = ['/', '/loginAutenticado','/loginMail','/home-estudiante', '/home-visitante'];
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
        const personaIdStr = await AsyncStorage.getItem('persona_id');

        if (token && personaIdStr) {
          const personaId = parseInt(personaIdStr, 10);
          await ObtenerDatosBaseUsuarioConToken(token, personaId);
          setVisitante(false);
          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace('/home-estudiante');
          }
        } else {
          setVisitante(true);
          // if (pathName === '/') { router.replace('/loginAutenticado'); }
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

  // Pantalla de carga también debe estar dentro del RootView:
  if (!isReady || !fontsLoaded || !sesionVerificada) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1a2b50" />
        </View>
      </GestureHandlerRootView>
    );
  }

  const usandoStackNavigator = false;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {usandoStackNavigator ? (
          <>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Stack screenOptions={{ animation: Platform.OS === 'android' ? 'none' : 'default' }}>
              <Slot />
            </Stack>
          </>
        ) : (
          <>
            {showHeader && <HistoryHeader title={headerHistoryTitle} />}
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <Slot />
            {showBottomBar && (!visitante && <BottomBar />)}
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
