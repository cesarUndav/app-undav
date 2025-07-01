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
import CustomText from "@/components/CustomText";
import OcultadorTeclado from "@/components/OcultadorTeclado";
import NavigationHeader from "@/components/NavigationHeader";
import FondoGradiente from "@/components/FondoGradiente";
import { Ionicons } from '@expo/vector-icons';

import {
  ObtenerDatosBaseUsuarioConToken,
  validarPersona,
} from "@/data/DatosUsuarioGuarani";
import { azulLogoUndav } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setNotificationCount } from "@/data/notificaciones";

export default function LoginScreen() {

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

  // OPCION 1: INTENTAR SIN CERO; LUEGO CON CERO.
  // OPCION 2: teclado alfanumerico hasta que se ingresa "-", luego es solo numerico
  // OPCION 3: boton "0-"

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
          
          <View style={{gap: 10, flex: 1, justifyContent:"flex-start"}}>
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
                id="contraseña"
                style={[styles.inlineInputField, {paddingRight: 48}]}
                value={contrasenaIngresada}
                placeholder="Contraseña"
                onChangeText={setContrasenaIngresada}
                secureTextEntry={!contrasenaVisible}
                autoCapitalize="none"
                autoComplete="off"
                editable={!esperandoRespuesta}/>
              <TouchableOpacity onPress={() => setContrasenaVisible(prev => !prev)} style={styles.eyeIcon}>
                <Ionicons name={contrasenaVisible ? 'eye' : 'eye-off'} size={24} color="gray"/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={botonIngresar}
              disabled={botonDesactivado()}
              style={[styles.button, { backgroundColor: botonDesactivado() ? "gray" : azulLogoUndav, marginTop: 6}]}>
              <CustomText weight="bold" style={styles.buttonText}>
                {esperandoRespuesta ? "CARGANDO..." : "INGRESAR"}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL("https://academica.undav.edu.ar/g3w/acceso/recuperar")}
              disabled={esperandoRespuesta}>
              <CustomText style={styles.forgotPassword}>
                Olvidé mi contraseña
              </CustomText>
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
    transform: [{ translateY: -23 }],
    zIndex: 1,
    padding: 10,
    //backgroundColor: "red"
  }
});
