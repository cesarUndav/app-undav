import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";

import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomText from "@/components/CustomText";
import OcultadorTeclado from "@/components/OcultadorTeclado";
import NavigationHeader from "@/components/NavigationHeader";
import FondoGradiente from "@/components/FondoGradiente";

import {
  validarPersonaYTraerData,
  setVisitante,
  ObtenerDatosUsuarioConToken,
  infoBaseUsuarioActual,
} from "@/data/DatosUsuarioGuarani";

export default function LoginScreen() {
  const router = useRouter();
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [documentoLogin, setDocumentoLogin] = useState("");
  const [contrasena, setContrasena] = useState("");

  const botonDesactivado = (): boolean => {
    return (
      esperandoRespuesta ||
      documentoLogin.trim().length === 0 ||
      contrasena.trim().length === 0
    );
  };

  const guardarSesion = async (token: string, personaId: number) => {
    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("idPersona", personaId.toString());
    } catch (err) {
      console.error("Error guardando sesión:", err);
    }
  };

const botonIngresar = async () => {
  setEsperandoRespuesta(true);
  try {
    console.log("Intentando login con", documentoLogin, contrasena);
    const { token, idPersona } = await validarPersonaYTraerData(documentoLogin, contrasena);
    console.log("Login exitoso, token y personaId recibidos", token, idPersona);

    await guardarSesion(token, idPersona);

    await ObtenerDatosUsuarioConToken(idPersona, token);
    console.log("Datos usuario cargados:", infoBaseUsuarioActual.idPersona);

    setVisitante(false);
    router.replace("/home-estudiante");
  } catch (error: any) {
    console.error("Error login:", error);
    Alert.alert("Error", error.message || "Error al iniciar sesión");
  } finally {
    setEsperandoRespuesta(false);
  }
};

  return (
    <>
      <NavigationHeader title="Iniciar Sesión" onBackPress={() => router.replace("/")} />
      <OcultadorTeclado>
        <FondoGradiente style={styles.container}>
          <Image
            source={require("../assets/icons/undav.png")}
            style={styles.logo}
          />

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.inlineInputField}
              value={documentoLogin}
              placeholder="DNI"
              onChangeText={setDocumentoLogin}
              keyboardType="numeric"
              autoCapitalize="none"
              autoComplete="off"
              editable={!esperandoRespuesta}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.inlineInputField}
              value={contrasena}
              placeholder="Contraseña"
              onChangeText={setContrasena}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="off"
              editable={!esperandoRespuesta}
            />
          </View>

          <TouchableOpacity
            onPress={botonIngresar}
            disabled={botonDesactivado()}
            style={[
              styles.button,
              { backgroundColor: botonDesactivado() ? "gray" : "#1c2f4a" },
            ]}
          >
            <CustomText weight="bold" style={styles.buttonText}>
              {esperandoRespuesta ? "CARGANDO..." : "INGRESAR"}
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://academica.undav.edu.ar/g3w/acceso/recuperar"
              )
            }
            disabled={esperandoRespuesta}
          >
            <CustomText style={styles.forgotPassword}>
              Olvidé mi contraseña
            </CustomText>
          </TouchableOpacity>
        </FondoGradiente>
      </OcultadorTeclado>
    </>
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
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
    marginTop: 22,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: 240,
    marginBottom: 12,
  },
  inlineInputField: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderBottomRightRadius: 12,
    fontSize: 18,
    width: 240,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderBottomRightRadius: 12,
    marginTop: 28,
    width: 240,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#1a2b50",
    fontSize: 17,
    marginTop: 16,
    textDecorationLine: "underline",
  },
});
