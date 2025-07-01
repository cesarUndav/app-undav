// components/UndavHeader.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText'; // Asegúrate que el path es correcto
import { infoBaseUsuarioActual, UsuarioEsAutenticado } from '@/data/DatosUsuarioGuarani';
import { azulClaro, azulLogoUndav, negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';
import UndavIcon from '../assets/icons/ico-svg/undav-letra.svg';


export default function UndavEstudianteHeader() {
  const router = useRouter();

  const nombreLegajo:string = !UsuarioEsAutenticado() ? "Nombre Nombre Apellido\nLegajo: 12345" 
  : infoBaseUsuarioActual.nombreCompleto+"\nLegajo: "+infoBaseUsuarioActual.legajo;
  
  return (
    <View style={styles.header}>

      {/* <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} /> */}
      <View style={styles.logoUndav}>
        <UndavIcon/>
      </View>

      <View style={styles.userInfo}>
        <CustomText style={styles.userText}>{nombreLegajo}</CustomText>
      </View>

      <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.profileIcon}>
        <Ionicons name="person" size={38} color={azulLogoUndav} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 60,
    //marginVertical: 10,
    //backgroundColor: "red"
  },
  logoUndav: {
    marginLeft: 10,
    width: "auto",
    height: "135%",
    aspectRatio: "1",
    resizeMode: "contain",
    alignSelf: "center",
    //backgroundColor: "green",
  },
  userInfo: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    //backgroundColor: "lightblue",
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    fontWeight: "bold",
    color: negroAzulado,    
    textAlign: 'right',
    paddingRight: 6,
    alignContent: "flex-end",
    //backgroundColor: "red"
  },
  profileIcon: {
    height: "100%",
    aspectRatio: 1, // CUADRADO
    borderRadius: "100%",
    //backgroundColor: azulClaro,
    //...getShadowStyle(2),
    justifyContent: "center",
    alignItems: "center",
    //marginRight: 5
    //borderBottomRightRadius: 16,
    // borderWidth: 6,
    // borderColor: azulLogoUndav,
  }

});
