// app/_layout.tsx

import { Slot, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import React from "react";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Platform, StatusBar } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryHeader, { PathToTitle } from "@/components/HistoryHeader";
import BottomBar from "@/components/BottomBar";
import BottomBarVisitante from "@/components/BottomBarVisitante";
import { visitante } from "@/data/DatosUsuarioGuarani";


  export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  const pathName = usePathname();
  const headerHistoryTitle = PathToTitle(pathName);
  
  const desactivarHistoryHeaderEnRutas = ['/', '/loginAutenticado','/home-estudiante', '/home-visitante'];
  const showHeader = !desactivarHistoryHeaderEnRutas.includes(pathName);

  const desactivarBottomBarEnRutas = ['/', '/loginAutenticado'];
  const showBottomBar = !desactivarBottomBarEnRutas.includes(pathName);


  useEffect(() => {
    if (Platform.OS === "android") {
      setBackgroundColorAsync("#173c68");
    }
    setIsReady(true);
  }, []);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  // POR AHORA, MIENTRAS NO SE TERMINE DE IMPLEMENTAR STACK-LESS, TENEMOS UN TOGGLE DEV.
  const usandoStackNavigator:Boolean = false;

  if (usandoStackNavigator)
  {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        {/* GLOBAL: barra superior blanca */}
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <Stack screenOptions={{ animation: Platform.OS === "android" ? "none" : "default" }}>
          <Slot />
        </Stack>
      </SafeAreaView>
    );
  }
  else
  {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {showHeader && <HistoryHeader title={headerHistoryTitle} />}
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <Slot />
      { showBottomBar && (visitante ? <BottomBarVisitante /> : <BottomBar />) }
    </SafeAreaView>
    );
  }
}
