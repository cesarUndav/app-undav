import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText'; // Asegúrate que el path es correcto
import { infoBaseUsuarioActual, modoOscuro, UsuarioEsAutenticado } from '@/data/DatosUsuarioGuarani';
import { azulClaro, azulLogoUndav, grisBorde } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';


export default function UndavEstudianteHeader() {
  const router = useRouter();

  const nombreLegajo:string = !UsuarioEsAutenticado() ? "Nombre Nombre Apellido\nLegajo: 12345" 
  : infoBaseUsuarioActual.nombreCompleto+"\nLegajo: "+infoBaseUsuarioActual.legajo;
  
  // se puede mostrar la carrera elegida, usando esta línea:
  // infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.indicePropuestaSeleccionada].nombre

  return (
    <View style={undavHeaderStyles.header}>

      <Image source={require('../assets/images/logo_undav.png')} style={undavHeaderStyles.logoUndav} />

      <View style={undavHeaderStyles.userInfo}>
        <CustomText style={undavHeaderStyles.userText}>{nombreLegajo}</CustomText>
      </View>

      <TouchableOpacity onPress={() => router.push('/perfil')} style={undavHeaderStyles.profileIcon}>
          <Ionicons name="person" size={36} color={modoOscuro ? "#fff":azulClaro} />
      </TouchableOpacity>
    </View>
  );
}

export const undavHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 56,
    //marginVertical: 4,
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
    justifyContent: "center"
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    fontWeight: "bold",
    color: modoOscuro ? "#fff":azulLogoUndav,    
    textAlign: 'right',
    paddingRight: 4,
    alignContent: "flex-end",
    //backgroundColor: "red"
  },
  profileIcon: {
    height: "105%", // altura respecto al logo undav
    marginLeft: 8,
    aspectRatio: 1, // CUADRADO
    borderRadius: 999,
    //...getShadowStyle(2),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: grisBorde,
  },
});
