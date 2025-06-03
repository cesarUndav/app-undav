import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import FondoImagenTinte from "@/components/FondoImagenTinte";

//import imagenFondo from '../assets/images/sedes/espana.png';
//const imagenFondo = 'assets/images/sedes/espana.png';

export default function HomeScreen()
{
  const router = useRouter();
  return (
    <FondoImagenTinte tinte={'rgba(200, 200, 200, 0.7)'}
      imagen={'https://infocielo.com/wp-content/uploads/2024/11/undav-1jpg-4.jpg'}>
      
      <Image
        source={require("@/assets/images/logoundav.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.estudianteBtn} onPress={() => router.push("../loginAutenticado")}>
          <CustomText weight="bold" style={styles.buttonText}>SOY ESTUDIANTE</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.visitanteBtn} onPress={() => router.push("../home-visitante")}>
          <CustomText weight="bold" style={styles.buttonText}>SOY VISITANTE</CustomText>
        </TouchableOpacity>
      </View>
    </FondoImagenTinte>
  );
}

const styles = StyleSheet.create({

  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
    marginTop: -50
  },
  buttonsContainer: {
    gap: 12,
  },
  estudianteBtn: {
    backgroundColor: "#1D3557",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 0,
    borderBottomRightRadius: 12,
    alignItems: "center",
  },
  visitanteBtn: {
    backgroundColor: "#005BA4",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 0,
    borderBottomRightRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    letterSpacing: 1,
  },
});
