import React, { useEffect, useState } from "react";
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
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { ObtenerDatosUsuarioActual } from '@/data/DatosUsuarioGuarani';

//import imagenFondo from '../assets/images/sedes/espana.png';
const imagenFondo = {uri: 'https://infocielo.com/wp-content/uploads/2024/11/undav-1jpg-4.jpg'};

// funcion principal:
export default function LoginScreen() {

// login
const [esperandoRespuesta, setEsperandoRespuesta] = useState(false); // Habría que poner un límite de tiempo de espera también.
const [documentoLogin, setDocumentoLogin] = useState("");
const [contrasena, setContrasena] = useState("");

const botonIngresar = async (documentoUsuario:string) => {
  setEsperandoRespuesta(true);
  await ObtenerDatosUsuarioActual(documentoUsuario);
  setEsperandoRespuesta(false);
  router.push('/home-estudiante')
};
function botonDesactivado():Boolean {
  if (esperandoRespuesta || documentoLogin.trim().length === 0) return true;
  else return false;
}

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
          value={documentoLogin}
          placeholder={"DNI"}
          onChangeText={setDocumentoLogin}
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
      <TouchableOpacity onPress={() => botonIngresar(documentoLogin)}
        disabled={botonDesactivado() as boolean} style={[styles.button, { backgroundColor: botonDesactivado() ? "gray" : "#1c2f4a" }]}>
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