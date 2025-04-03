import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
console.log("Login - Métodos disponibles en SecureStore:", SecureStore);


import { useRouter } from "expo-router";
import React from "react";

// Crear una instancia de axios con soporte para cookies
const api = axios.create({
  
  baseURL: 'https://academica.undav.edu.ar/g3w', // URL base de SIU-Guaraní
  withCredentials: true, // Esto habilita el manejo de cookies automáticamente
});

export default function LoginScreen() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!usuario || !contrasena) {
      Alert.alert("Error", "Por favor, ingresa usuario y contraseña.");
      return;
    }

    try {
      // Enviar la solicitud POST a la URL de login de SIU-Guaraní
      const response = await api.post("/acceso?auth=form", {
        usuario,
        contrasena, // Enviar la contraseña
      });

      console.log("Respuesta del login:", response.data);

      // Si la sesión se establece correctamente, recibirás cookies de sesión
      const inicioResponse = await api.get("/inicio_alumno"); // Solicitar la página del alumno para verificar sesión

      console.log("Datos del alumno:", inicioResponse.data);

      // Si llegamos aquí, significa que la sesión fue exitosa
      Alert.alert("Inicio de sesión exitoso", "Bienvenido a la app");
      
      // Redirigir a la pantalla principal después del login exitoso
      router.replace("/home");
    } catch (error) {
      console.error("Error en el login:", error);
      Alert.alert("Error", "Usuario o contraseña incorrectos.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Usuario:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={usuario}
        onChangeText={setUsuario}
      />
      <Text>Contraseña:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}
