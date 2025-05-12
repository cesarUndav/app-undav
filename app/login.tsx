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

import { useRouter, Tabs } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import CustomText from "@/components/CustomText";

import {ImageBackground} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

//import imagenFondo from '../assets/images/sedes/espana.png';
const imagenFondo = {uri: 'https://infocielo.com/wp-content/uploads/2024/11/undav-1jpg-4.jpg'};


export default function LoginScreen() {

const router = useRouter();
const navigation = useNavigation();

useLayoutEffect(() => {
  navigation.setOptions({ headerShown: true });
}, [navigation]);

// login  
const [usuario, setUsuario] = useState("");
const [contrasena, setContrasena] = useState("");
const urlDocumentoBase = "http://172.16.1.43/guarani/3.17/rest/v2/alumnos?tipo_documento=0&numero_documento="

const [resultadoPeticion, setResultadoPeticion] = useState(null);
//console.log(resultado);


const login = async (usuarioX, contrasenaX) => {
  try {
    const response = await fetch('http://172.16.1.43/guarani/3.17/rest/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usuarioX,
        password: contrasenaX,
      }),
    });

    if (!response.ok) throw new Error("Error al autenticar");

    const data = await response.json();
    return data.access_token; // Ajustar según la estructura real de respuesta
  } catch (error) {
    console.error("Error en login:", error);
    return null;
  }
};
const obtenerDatos = async (token, numeroDocumento) => {
  try {
    const url = `http://172.16.1.43/guarani/3.17/rest/v2/alumnos?tipo_documento=0&numero_documento=${numeroDocumento}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error("Error al obtener datos");

    const data = await response.json();
    setResultadoPeticion(data);
    console.log("Respuesta JSON:", data);
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

const ingresar = async () => {
  // const token = await login('app_undav', 'app123456');
  // if (token) {
  //   await obtenerDatos(token, '43877860');
  // }
  router.push('/home-estudiante')
};

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
          value={usuario}
          placeholder={"DNI"}
          onChangeText={setUsuario}
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
      <TouchableOpacity style={styles.button} onPress={ingresar}>
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