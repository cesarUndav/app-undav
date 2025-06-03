import React, { use, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking
} from "react-native";

import { useRouter, Tabs } from "expo-router";
import CustomText from "@/components/CustomText";

import { Ionicons } from '@expo/vector-icons';
import {ImageBackground} from 'react-native';
import { SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { ObtenerCorreoConDocumento } from '@/data/DatosUsuarioGuarani';
import OcultadorTeclado from "@/components/OcultadorTeclado";
import FondoGradiente from "@/components/FondoGradiente";
import NavigationHeader from "@/components/NavigationHeader";

//import imagenFondo from '../assets/images/sedes/espana.png';
const imagenFondo = {uri: 'https://infocielo.com/wp-content/uploads/2024/11/undav-1jpg-4.jpg'};

// funcion principal:
export default function LoginScreen() {

// login
const router = useRouter();
const [esperandoRespuesta, setEsperandoRespuesta] = useState(false); // Habría que poner un límite de tiempo de espera también.
const [correoEncontrado, setCorreoEncontrado] = useState("");

const [documentoLogin, setDocumentoLogin] = useState("");

const botonDNI = async (documentoUsuario:string) => {
  setEsperandoRespuesta(true);
  setCorreoEncontrado(await ObtenerCorreoConDocumento(documentoUsuario));
  setEsperandoRespuesta(false);
  //router.replace('/home-estudiante')
};
function botonDesactivado():Boolean {
  if (esperandoRespuesta || documentoLogin.trim().length === 0) return true;
  else return false;
}
function enviarCorreo(documentoLogin: string):void {
  console.log("Correo Enviado a",correoEncontrado,"DNI:",documentoLogin);
}

return (
<View style={{flex:1}}>

<NavigationHeader
    title="Verificación con correo"
    onBackPress={() => router.replace('/')}
/>
<FondoGradiente style={{}}>
<OcultadorTeclado>
    <View style={styles.container}>
        <View style={{flex: 0.95, justifyContent:"flex-end"}}>
            <Image source={require("../assets/icons/undav.png")} style={styles.logo} />
        </View>
        <View style={{flex: 1, gap: 15, justifyContent:"flex-start"}}>
            {correoEncontrado == "" || correoEncontrado == "undefined" ?
                <>
                    <TextInput
                        id={"user"}
                        style={styles.inputField}
                        value={documentoLogin}
                        placeholder={"DNI"}
                        onChangeText={setDocumentoLogin}
                    />
                    <TouchableOpacity onPress={() => botonDNI(documentoLogin)}
                        disabled={botonDesactivado() as boolean} style={[styles.button, { backgroundColor: botonDesactivado() ? "gray" : "#1c2f4a" }]}>
                        <CustomText weight="bold" style={styles.buttonText}>BUSCAR DNI</CustomText>
                    </TouchableOpacity>
                </>
                :
                <View style={{flex: 1, gap: 15}}>
                    {/* <CustomText style={styles.siuCambiarMail}>{"El DNI ingresado\nestá asociado al correo:"}</CustomText> */}
                    <CustomText style={styles.emailField}>{correoEncontrado}</CustomText>

                    <TouchableOpacity onPress={() => enviarCorreo(documentoLogin)}
                        style={[styles.button, { backgroundColor: "#1c2f4a", alignSelf: "center" }]}>
                        <CustomText weight="bold" style={styles.buttonText}>ENVIAR CORREO</CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL("https://academica.undav.edu.ar/g3w/datos_censales/datos_contacto")}>
                        <CustomText style={styles.siuCambiarMail}>
                            {"Si no usas este correo,\ncambialo tocando acá."}
                        </CustomText>
                    </TouchableOpacity>
                </View>
            }
        </View>
    </View>
</OcultadorTeclado>
</FondoGradiente>
</View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 22
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 18,
    width: 240
  },
    emailField: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: "#fff",
    fontSize: 18,
    color: "#0b254a",
    textAlign: "center"
    //width: 240
  },
  button: {
    backgroundColor: "#1a2b50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderBottomRightRadius: 16,
    width: 240,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  siuCambiarMail: {
    //color: "#0b254a",
    color: "#005BA4",
    fontSize: 18,
    textAlign: "center",
  },
});