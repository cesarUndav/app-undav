// app/_layout.tsx

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
import { visitante, setVisitante, ObtenerDatosUsuarioConToken } from "@/data/DatosUsuarioGuarani";

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
  const desactivarHistoryHeaderEnRutas = ['/', '/loginFalso','/loginAutenticado','/loginMail','/home-estudiante', '/home-visitante'];
  const showHeader = !desactivarHistoryHeaderEnRutas.includes(pathName);

  const desactivarBottomBarEnRutas = ['/', '/loginFalso', '/loginAutenticado', '/loginMail'];
  const showBottomBar = !desactivarBottomBarEnRutas.includes(pathName);

  useEffect(() => {
    const prepararApp = async () => {
      if (Platform.OS === "android") {
        await setBackgroundColorAsync("#173c68");
      }

      // Verificar sesión
      try {
        const token = await AsyncStorage.getItem("token");
        const personaIdStr = await AsyncStorage.getItem("persona_id");

        if (token && personaIdStr) {
          const personaId = parseInt(personaIdStr, 10);
          await ObtenerDatosUsuarioConToken(personaId, token);
          setVisitante(false);

          if (pathName === '/' || pathName.startsWith('/login')) {
            router.replace("/home-estudiante");
          }
        } else {
          setVisitante(true);
          if (pathName === '/') {
            router.replace("/loginAutenticado");
          }
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

  if (usandoStackNavigator) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <Stack screenOptions={{ animation: Platform.OS === "android" ? "none" : "default" }}>
          <Slot />
        </Stack>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        {showHeader && <HistoryHeader title={headerHistoryTitle} />}
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <Slot />
        {showBottomBar && (visitante ? <BottomBarVisitante /> : <BottomBar />)}
      </SafeAreaView>
    );
  }
}
