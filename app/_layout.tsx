import { Stack, Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import React from "react";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Platform, StatusBar } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";

export default function Layout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      // cambia barra inferior del sistema a azul.
      setBackgroundColorAsync('#173c68');
    }
    setIsReady(true);
  }, []);

  // Esperar a que se carguen las fuentes Y el estado de autenticación
  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <>
      {/* GLOBAL: barra superior blanca */}
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <Stack screenOptions={{animation: "none"}}>
        <Slot />
      </Stack>
    </>
  );
}
