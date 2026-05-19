import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import OcultadorTeclado from "@/components/OcultadorTeclado";
import NavigationHeader from "@/components/NavigationHeader";
import FondoGradiente from "@/components/FondoGradiente";
import { Ionicons } from '@expo/vector-icons';

import {
  validarPersona,
} from "@/data/DatosUsuarioGuarani";
import { azulLogoUndav } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNotificationCount } from "@/data/notificaciones";

export default function LoginScreen() {

  const URL_BASE = process.env.EXPO_PUBLIC_API_APPUNDAV_URL; 
  const router = useRouter();
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [documentoIngresado, setDocumentoIngresado] = useState("");
  const [contrasenaIngresada, setContrasenaIngresada] = useState("");
  const [contrasenaVisible, setContrasenaVisible] = useState(false);

  const botonDesactivado = (): boolean => {
    return (
      esperandoRespuesta ||
      documentoIngresado.trim().length === 0 ||
      contrasenaIngresada.trim().length === 0
    );
  };

  const botonIngresar = async () => {
    setEsperandoRespuesta(true);

    try
    {
      const {token, idPersona} = await validarPersona(documentoIngresado, contrasenaIngresada);

      await AsyncStorage.setItem("username", documentoIngresado.toString());
      await AsyncStorage.setItem("password", contrasenaIngresada.toString());
      setNotificationCount(10);
      router.replace("/home-estudiante");
    }
    catch (error: any) {
      console.error("Error login:", error);
      //Alert.alert("Error", error.message || "Error al iniciar sesión");
      Alert.alert("Error al iniciar sesión", "Asegurate de ingresar el formato correcto de tu usuario. Este puede ser:\n\"0-DNI\" o \"DNI\".");
    } finally {
      setEsperandoRespuesta(false);
    }
  };

useEffect(() => {

  const timeoutFetch = async (
    url: string,
    options: RequestInit = {},
    timeout = 15000
  ) => {
    const controller = new AbortController();

    const id = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(id);

      return response;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  };

  const logResponse = async (name: string, response: Response) => {
    console.log(`\n========== ${name} ==========`);

    console.log("URL FINAL:", response.url);
    console.log("STATUS:", response.status);
    console.log("OK:", response.ok);
    console.log("REDIRECTED:", response.redirected);

    try {
      const text = await response.text();

      console.log(
        "BODY:",
        text.substring(0, 300)
      );
    } catch (e) {
      console.log("NO SE PUDO LEER BODY");
    }

    console.log("=============================\n");
  };

  const logError = (name: string, e: any) => {
    console.log(`\n========== ERROR ${name} ==========`);

    console.log("MESSAGE:", e?.message);
    console.log("NAME:", e?.name);

    if (e?.stack) {
      console.log("STACK:", e.stack);
    }

    if (e?.response) {
      console.log("RESPONSE:", e.response);
    }

    if (e?.request) {
      console.log("REQUEST:", e.request);
    }

    console.log("FULL ERROR:", JSON.stringify(e, null, 2));

    console.log("===================================\n");
  };

  const realizarPruebaDeRed = async () => {

    console.log("\n\n🚀 INICIANDO DIAGNÓSTICO COMPLETO 🚀\n");

    console.log("URL_BASE:", URL_BASE);

    //
    // TEST 1
    //
    try {

      console.log("TEST 1 -> INTERNET HTTPS");

      const r = await timeoutFetch(
        "https://jsonplaceholder.typicode.com/todos/1",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Connection: "close",
            "Accept-Encoding": "identity",
            "User-Agent": "Mozilla/5.0",
          },
        }
      );

      await logResponse("TEST 1 HTTPS PUBLICO", r);

    } catch (e) {
      logError("TEST 1 HTTPS PUBLICO", e);
    }

    //
    // TEST 2
    //
    try {

      console.log("TEST 2 -> HTTP");

      const r = await timeoutFetch(
        "http://google.com",
        {
          method: "GET",
          headers: {
            Connection: "close",
          },
        }
      );

      await logResponse("TEST 2 HTTP", r);

    } catch (e) {
      logError("TEST 2 HTTP", e);
    }

    //
    // TEST 3
    //
    try {

      console.log("TEST 3 -> API UNDAV HTTPS");

      const url = `${URL_BASE}/persona/validuser`;

      console.log("URL:", url);

      const r = await timeoutFetch(
        url,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Connection: "close",
            "Accept-Encoding": "identity",
            "User-Agent": "Mozilla/5.0",
          },
          body: JSON.stringify({
            usuario: "43877860",
            clave: "Undav13",
          }),
        },
        20000
      );

      await logResponse("TEST 3 API UNDAV HTTPS", r);

    } catch (e) {
      logError("TEST 3 API UNDAV HTTPS", e);
    }

    //
    // TEST 4
    //
    try {

      console.log("TEST 4 -> API UNDAV POR DOMINIO SIMPLE");

      const r = await timeoutFetch(
        "https://appapi.undav.edu.ar",
        {
          method: "GET",
          headers: {
            Connection: "close",
            "Accept-Encoding": "identity",
            "User-Agent": "Mozilla/5.0",
          },
        },
        20000
      );

      await logResponse("TEST 4 DOMINIO SIMPLE", r);

    } catch (e) {
      logError("TEST 4 DOMINIO SIMPLE", e);
    }

    //
    // TEST 5
    //
    try {

      console.log("TEST 5 -> IP DIRECTA HTTP");

      const r = await timeoutFetch(
        "http://170.210.71.25/persona/validuser",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Connection: "close",
            "Accept-Encoding": "identity",
            "User-Agent": "Mozilla/5.0",
          },
          body: JSON.stringify({
            usuario: "43877860",
            clave: "Undav13",
          }),
        },
        20000
      );

      await logResponse("TEST 5 IP DIRECTA HTTP", r);

    } catch (e) {
      logError("TEST 5 IP DIRECTA HTTP", e);
    }

    //
    // TEST 6 AXIOS
    //
    try {

      console.log("TEST 6 -> AXIOS HTTPS");

      const axios = require("axios").default;

      const r = await axios({
        url: `${URL_BASE}/persona/validuser`,
        method: "POST",
        timeout: 20000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Connection: "close",
          "Accept-Encoding": "identity",
          "User-Agent": "Mozilla/5.0",
        },
        data: {
          usuario: "43877860",
          clave: "Undav13",
        },
      });

      console.log("\n========== TEST 6 AXIOS ==========");
      console.log("STATUS:", r.status);
      console.log("DATA:", r.data);
      console.log("==================================\n");

    } catch (e) {
      logError("TEST 6 AXIOS", e);
    }

    console.log("\n🏁 FIN DEL DIAGNÓSTICO 🏁\n");
  };

  realizarPruebaDeRed();

}, []);

  return (
  <OcultadorTeclado>
    <View style={{flex:1}}>
      <NavigationHeader title="Iniciar Sesión" onBackPress={() => router.replace("/")} />
        <FondoGradiente style={styles.container}>

          <View style={{flex: 1, justifyContent:"flex-end"}}>
            <Image
              source={require("../assets/icons/undav.png")}
              style={styles.logo}
            />
          </View>
          
          <Image
            // source={require('@/assets/images/siu-guarani_logo-transparente.png')}
            //style={{ resizeMode: "contain", height: 50, marginRight: 5, marginBottom: 20 }}
            source={require('@/assets/images/Logo_guarani.png')}
            style={{ resizeMode: "contain", height: 80, width:400, marginRight:-4, marginTop:-10,marginBottom: 20 }}
            resizeMode="contain"
          />

          <View style={{gap: 10, flex: 1.1, justifyContent:"flex-start"}}>
            <TextInput
              id="usuario"
              style={styles.inlineInputField}
              value={documentoIngresado}
              placeholder="DNI"
              onChangeText={setDocumentoIngresado}
              //keyboardType={documentoIngresado.length < 2 ? "default" : "numeric"}
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="off"
              editable={!esperandoRespuesta}
            />

            <View>
              <TextInput
                id="password"
                style={[styles.inlineInputField, {paddingRight: 48}]}
                value={contrasenaIngresada}
                placeholder="Contraseña"
                onChangeText={setContrasenaIngresada}
                secureTextEntry={!contrasenaVisible}
                autoCapitalize="none"
                autoComplete="off"
                editable={!esperandoRespuesta}/>
              <TouchableOpacity onPress={() => setContrasenaVisible(prev => !prev)} style={styles.eyeIcon}>
                <Ionicons name={contrasenaVisible ? 'eye' : 'eye-off'} size={26} color="gray"/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={botonIngresar}
              disabled={botonDesactivado()}
              style={[styles.button, { backgroundColor: botonDesactivado() ? "gray" : azulLogoUndav, marginTop: 0}]}>
              <CustomText weight="bold" style={styles.buttonText}>
                {esperandoRespuesta ? "CARGANDO..." : "INGRESAR"}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={{paddingTop: 8}}
              onPress={() => router.push(`/webview/${encodeURIComponent("https://academica.undav.edu.ar/g3w/acceso/recuperar")}?tryLogin=${false}`)}
              disabled={esperandoRespuesta}>
              <CustomText style={styles.forgotPassword}> Olvidé mi contraseña </CustomText>
            </TouchableOpacity>
          </View>

        </FondoGradiente>
    </View>
  </OcultadorTeclado>
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
  inlineInputField: {
    width: 240,
    backgroundColor: "#fff",
    borderBottomRightRadius: 12,
    fontSize: 18,
    padding: 10
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderBottomRightRadius: 12,
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
    alignSelf: "center"
    //textDecorationLine: "underline",
  },
  eyeIcon: {
    position: 'absolute',
    right: 4,
    top: '50%',
    transform: [{ translateY: -24 }],
    zIndex: 10,
    padding: 10,
    //backgroundColor: "red"
  }
});
