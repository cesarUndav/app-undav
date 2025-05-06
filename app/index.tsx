import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import { Tabs } from 'expo-router';

import {ImageBackground} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

//import imagenFondo from '../assets/images/sedes/espana.png';
//const imagenFondo = 'assets/images/sedes/espana.png';
const imagenFondo = {uri: 'https://infocielo.com/wp-content/uploads/2024/11/undav-1jpg-4.jpg'};

export default function HomeScreen()
{
  const router = useRouter();
  return (
   
    <SafeAreaProvider>
    <SafeAreaView style={styles.containerImagenFondo} edges={['left', 'right']}>
      <ImageBackground source={imagenFondo} resizeMode="cover" style={styles.imagenFondo}>
        <View style={styles.container}>

          {/* esto es para ocultar barra de titulo "index" */}
          <Tabs.Screen
            name = "index"
            options ={{
              title: '',
              headerShown: false
            }}
          />
          {/* LOGO UNDAV */}
          <Image
            source={require("@/assets/images/logoundav.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* BOTONES */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.estudianteBtn} onPress={() => router.push("../login")}>
              <CustomText weight="bold" style={styles.buttonText}>SOY ESTUDIANTE</CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.visitanteBtn} onPress={() => router.push("../home-invitados")}>
              <CustomText weight="bold" style={styles.buttonText}>SOY VISITANTE</CustomText>
            </TouchableOpacity>
          </View>

        </View>
        
      </ImageBackground>
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

  containerImagenFondo: {
    flex: 1
  },
  imagenFondo: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'rgba(200, 200, 200, 0.7)', // NECESARIO PARA IMG FONDO (MARCA DE AGUA)
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
    marginTop: 0
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
