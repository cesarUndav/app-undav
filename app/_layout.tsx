// app/_layout.tsx

import { Slot } from "expo-router";
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

export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      setBackgroundColorAsync("#173c68");
    }
    setIsReady(true);
  }, []);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar barStyle="dark-content" />
      <Slot />
    </SafeAreaView>
  );
}
