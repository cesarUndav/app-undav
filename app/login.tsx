import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

import * as SecureStore from "expo-secure-store";
import CustomText from "@/components/CustomText";

const api = axios.create({
  baseURL: 'https://academica.undav.edu.ar/g3w',
  withCredentials: true,
});

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  const handleLogin = async () => {
    if (!usuario || !contrasena) {
      Alert.alert("Error", "Por favor, ingresa usuario y contraseña.");
      return;
    }
    try {
      const response = await api.post("/acceso?auth=form", {
        usuario,
        contrasena,
      });

      const inicioResponse = await api.get("/inicio_alumno");
      Alert.alert("Inicio de sesión exitoso", "Bienvenido a la app");
      router.replace("/home-estudiante");
    } catch (error) {
      console.error("Error en el login:", error);
      Alert.alert("Error", "Usuario o contraseña incorrectos.");
    }
  };

  

  return (
    <LinearGradient colors={["#ffffff", "#989797"]} style={styles.container}>
      <Image source={require("../assets/icons/undav.png")} style={styles.logo} />
      <CustomText style={styles.title}>Iniciar sesión</CustomText>

      <View style={styles.inputGroup}>
        <CustomText style={styles.inlineLabel}>Usuario</CustomText>
        <TextInput
          style={styles.inlineInput}
          value={usuario}
          onChangeText={setUsuario}
        />
      </View>

      <View style={styles.inputGroup}>
        <CustomText style={styles.inlineLabel}>Contraseña</CustomText>
        <TextInput
          style={styles.inlineInput}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/home-estudiante')}>
      {/* <TouchableOpacity style={styles.button} onPress={handleLogin}> */}

        <CustomText style={styles.buttonText}>INGRESAR</CustomText>
      </TouchableOpacity>

      <TouchableOpacity>
        <CustomText style={styles.forgotPassword}>Olvidé mi contraseña</CustomText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a2b50",
    marginBottom: 32,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  inlineLabel: {
    color: "#1a2b50",
    fontSize: 16,
    fontWeight: "bold",
    width: 100,
    marginRight: 8,
    textAlign: "right",
  },
  inlineInput: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderBottomRightRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1a2b50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderBottomRightRadius: 10,
    marginTop: 16,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#1a2b50",
    fontSize: 14,
    marginTop: 20,
  },
});
