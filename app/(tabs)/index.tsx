import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#ffffff", "#989797"]} style={styles.container}>
      <Image
        source={require("@/assets/images/logoundav.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.estudianteBtn} onPress={() => router.push("../login")}>
          <CustomText weight="bold" style={styles.buttonText}>SOY ESTUDIANTE</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.visitanteBtn} onPress={() => router.push("../visitante")}>
          <CustomText weight="bold" style={styles.buttonText}>SOY VISITANTE</CustomText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 80,
  },
  buttonsContainer: {
    gap: 16,
  },
  estudianteBtn: {
    backgroundColor: "#1D3557",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  visitanteBtn: {
    backgroundColor: "#005BA4",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    letterSpacing: 1,
  },
});
