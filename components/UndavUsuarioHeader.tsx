// components/UndavHeader.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText'; // Asegúrate que el path es correcto
import { infoBaseUsuarioActual, UsuarioEsAutenticado } from '@/data/DatosUsuarioGuarani';
import { azulClaro, azulLogoUndav, azulMedioUndav, negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';


export default function UndavEstudianteHeader() {
  const router = useRouter();

  const nombreLegajo:string = !UsuarioEsAutenticado() ? "Nombre Nombre Apellido\nLegajo: 12345" 
  : infoBaseUsuarioActual.nombreCompleto+"\nLegajo: "+infoBaseUsuarioActual.legajo;
  
  return (
    <View style={styles.header}>
      <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />

      <View style={styles.userInfo}>
        <CustomText style={styles.userText}>{nombreLegajo}</CustomText>
        <CustomText style={styles.userText}>
          {UsuarioEsAutenticado()
            ? infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.propuestas.length - 1].nombre
            : 'Nombre de Propuesta'}
        </CustomText>
      </View>

      <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.profileIcon}>
        <Ionicons name="person-outline" size={32} color={"#fff"} />
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
    height: "100%",
    aspectRatio: "1 / 1.22",
    width: "auto",
    resizeMode: "contain"
  },
  userInfo: {
    //backgroundColor: "green",
    flex: 1,
    flexDirection: "column",
    height: "100%",
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    fontWeight: "bold",
    color: negroAzulado,    
    textAlign: 'right',
    paddingRight: 10,
    alignContent: "flex-end"
  },
  profileIcon: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: azulClaro,
    borderRadius: "100%",
    //borderBottomRightRadius: 16,
    ...getShadowStyle(2),
    // borderWidth: 6,
    // borderColor: azulLogoUndav,
    justifyContent: "center", // <- centra verticalmente
    alignItems: "center",     // <- centra horizontalmente
  }

});
