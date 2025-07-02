import { Slot, Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import React from "react";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Platform, StatusBar, ActivityIndicator, View } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HistoryHeader, { PathToTitle } from "@/components/NavigationHistoryHeader";
import BottomBar from "@/components/BottomBar";
import BottomBarVisitante from "@/components/BottomBarVisitante";
import { visitante, setVisitante, ObtenerDatosBaseUsuarioConToken } from "@/data/DatosUsuarioGuarani";
import { azulMedioUndav } from "@/constants/Colors";

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  const [sesionVerificada, setSesionVerificada] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const headerHistoryTitle = PathToTitle(pathName);
  const desactivarHistoryHeaderEnRutas = ['/', '/loginAutenticado','/loginMail','/home-estudiante', '/home-visitante'];
  const showHeader = !desactivarHistoryHeaderEnRutas.includes(pathName);

  const desactivarBottomBarEnRutas = ['/', '/loginAutenticado', '/loginMail'];
  const showBottomBar = !desactivarBottomBarEnRutas.includes(pathName);

  useEffect(() => {
    const prepararApp = async () => {
      if (Platform.OS === "android") {
        await setBackgroundColorAsync(azulMedioUndav);
      }

      // Verificar sesión
      try {
        const token = await AsyncStorage.getItem("token");
        const personaIdStr = await AsyncStorage.getItem("persona_id");

        if (token && personaIdStr) {
          const personaId = parseInt(personaIdStr, 10);
          await ObtenerDatosBaseUsuarioConToken(token, personaId);
          setVisitante(false);

          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace("/home-estudiante");
          }
        } else {
          setVisitante(true);
          // if (pathName === '/') { router.replace("/loginAutenticado"); }
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        setVisitante(true);
        if (pathName === '/') {
          router.replace("/loginAutenticado");
        }
      } finally {
        setSesionVerificada(true);
        setIsReady(true);
      }
    };

    prepararApp();
  }, []);

  if (!isReady || !fontsLoaded || !sesionVerificada) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1a2b50" />
      </View>
    );
  }

  const usandoStackNavigator: boolean = false;

  if (!usandoStackNavigator)
  {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {showHeader && <HistoryHeader title={headerHistoryTitle} />}
        <StatusBar backgroundColor='#FFFFFF' barStyle="dark-content" />
        <Slot />
        {/* {showBottomBar && (visitante ? <BottomBarVisitante /> : <BottomBar />)} */}
        {showBottomBar && (!visitante && <BottomBar/>)}
      </SafeAreaView>
    );
  }
  else
  {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar backgroundColor='#FFFFFF' barStyle="dark-content" />
        <Stack screenOptions={{ animation: Platform.OS === "android" ? "none" : "default" }}>
          <Slot />
        </Stack>
      </SafeAreaView>
    );
  }
}
