import { DigestClient } from './DigestClient';
import '../data/datosDeUsuario';

import React, { useActionState, useEffect, useState } from "react";
import {
  View,
  //Text,
  TextInput,
  TouchableOpacity,
  //Alert,
  Image,
  StyleSheet,
} from "react-native";

import { useRouter, Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import CustomText from "@/components/CustomText";

import {ImageBackground} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import '../data/datosDeUsuario';
import { UrlObtenerIdPersona, usuarioActual, UrlObtenerMailTel, JsonACampo, UrlObtenerDatosPersona, JsonStringAObjeto } from '../data/datosDeUsuario';

//import imagenFondo from '../assets/images/sedes/espana.png';
const imagenFondo = {uri: 'https://infocielo.com/wp-content/uploads/2024/11/undav-1jpg-4.jpg'};

// auth y requests

const client = new DigestClient("app_undav", "app123456");
export async function ObtenerJsonString(url:string) {
  const res = await client.fetchWithDigest(url);
  const data = await res.json();
  return JSON.stringify(data);
}
// function capitalizeWords(str: string): string {
//   return str.replace(/\b\w/g, char => char.toUpperCase());
// }
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// funcion principal:
export default function LoginScreen() {

// AUTH:
const getAuthData = async (documentoUsuario:string) => {
  console.log("iniciando auth:");
  // obtener id "persona" a partir de DNI:
  const jsonPersona = JsonStringAObjeto(await ObtenerJsonString(UrlObtenerIdPersona(documentoUsuario, 0, 0)));
  usuarioActual.idPersona = jsonPersona.persona;
  // obtener datos personales a partir de id Persona:
  const jsonDatosPersonales = JsonStringAObjeto(await ObtenerJsonString(UrlObtenerDatosPersona(usuarioActual.idPersona)));
  //aplicar datos:
  usuarioActual.nombreCompleto = capitalizeWords((jsonDatosPersonales.nombres+" "+jsonDatosPersonales.apellido).toLowerCase());
  usuarioActual.legajo = jsonDatosPersonales.legajo;
  usuarioActual.email = jsonDatosPersonales.mail;
  usuarioActual.tel = jsonDatosPersonales.telefono_celular;
  usuarioActual.documento = (jsonDatosPersonales.documento).slice(4);
  // DEBUG LOG
  console.log("USUARIO:");
  console.log(usuarioActual);
  //console.log("Datos personales:\n" + JSON.stringify(jsonDatosPersonales));
};
// login
const [usuarioLogin, setUsuarioLogin] = useState("");
const [contrasena, setContrasena] = useState("");

const botonIngresar = async (documentoUsuario:string) => {
  console.log(getAuthData(documentoUsuario)); // QUITAR
  await getAuthData(documentoUsuario);
  router.push('/home-estudiante')
};

// declaraciones de Expo
const router = useRouter();
const navigation = useNavigation();
useLayoutEffect(() => {
navigation.setOptions({ headerShown: true });
}, [navigation]);

return (

<SafeAreaProvider>
<SafeAreaView style={styles.containerImagenFondo} edges={['left', 'right']}>
<ImageBackground source={imagenFondo} resizeMode="cover" style={styles.imagenFondo}>
<View style={styles.container}>
      <Tabs.Screen
        options ={{
          title: 'Iniciar sesión',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTransparent: true,
          headerTintColor: '#1a2b50'
        }}
      />

      <Image source={require("../assets/icons/undav.png")} style={styles.logo} />
      {/* <CustomText style={styles.title}>Iniciar sesión</CustomText> */}

      <View style={styles.inputGroup}>
        {/* <CustomText style={styles.inlineLabel}>Usuario</CustomText> */}
        <TextInput
          id={"user"}
          style={styles.inlineInputField}
          value={usuarioLogin}
          placeholder={"DNI"}
          onChangeText={setUsuarioLogin}
        />
      </View>

      <View style={styles.inputGroup}>
        {/* <CustomText style={styles.inlineLabel}>Contraseña</CustomText> */}
        <TextInput
          id={"password"}
          style={styles.inlineInputField}
          value={contrasena}
          placeholder={"Contraseña"}
          onChangeText={setContrasena}
          secureTextEntry
        />
      </View>
      
      {/* <TouchableOpacity style={styles.button} onPress={() => router.push('/home-estudiante')}> */}
      <TouchableOpacity style={styles.button} onPress={() => botonIngresar(usuarioLogin)}>
        <CustomText weight="bold" style={styles.buttonText}>INGRESAR</CustomText>
      </TouchableOpacity>

      <TouchableOpacity>
        <CustomText style={styles.forgotPassword}>Olvidé mi contraseña</CustomText>
      </TouchableOpacity>

      {/* <TouchableOpacity>
        <CustomText style={styles.forgotPassword}>Ingresar sin iniciar sesión</CustomText>
      </TouchableOpacity> */}

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
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 40,
    marginTop: 70
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
    marginBottom: 12
  },
  inlineInputField: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderBottomRightRadius: 12,
    fontSize: 18,
    width: 240
  },
  button: {
    backgroundColor: "#1a2b50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderBottomRightRadius: 12,
    marginTop: 28, //16
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
  },
});