// app/_layout.tsx
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Stack, Slot } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function Layout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("sessionToken");
        if (token) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error en checkAuth:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, []);

  // Esperar a que se carguen las fuentes Y el estado de autenticación
  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Slot />
    </Stack>
  );
}
