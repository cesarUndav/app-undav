import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import FondoGradiente from "@/components/FondoGradiente";
import NavigationHeader from "@/components/NavigationHeader";
import { azulClaro } from "@/constants/Colors";
import { useBloquearBotonAtras } from "@/hooks/useBloquearBotonAtras";

export default function HomeScreen()
{
  useBloquearBotonAtras();
  
  const router = useRouter();
  return (
    <View style={{flex:1}}>
      <NavigationHeader title="" hideBackButton onBackPress={() => router.replace("/")} />
        <FondoGradiente style={styles.container}>

          <View style={{flex: 1, justifyContent:"flex-end"}}>
            <Image
              source={require("../assets/icons/undav.png")}
              style={styles.logo}
            />
          </View>

          <View style={{gap: 10, flex: 1, justifyContent:"flex-start"}}>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#1D3557"}]} onPress={() => router.push("../loginAutenticado")}>
              <CustomText weight="bold" style={styles.buttonText}>SOY ESTUDIANTE</CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, {backgroundColor: azulClaro}]} onPress={() => router.push("../home-visitante")}>
              <CustomText weight="bold" style={styles.buttonText}>SOY VISITANTE</CustomText>
            </TouchableOpacity>
          </View>         

        </FondoGradiente>
    </View>
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
    resizeMode: "contain",
    marginBottom: 32
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomRightRadius: 12,
    width: 240,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  }
});
