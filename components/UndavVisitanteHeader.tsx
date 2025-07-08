// components/UndavHeader.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';

export default function UndavEstudianteHeader() {
  const router = useRouter();

  const textoUserVisitante:string = "Iniciar Sesión\nComo Estudiante";
  
  return (
    <View style={styles.header}>

      <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />

      <View style={styles.userInfo}>
        <CustomText style={styles.userText}>{textoUserVisitante}</CustomText>
      </View>

      <TouchableOpacity onPress={() => router.push('/loginAutenticado')} style={styles.profileIcon}>
        <Ionicons name="person" size={42} color={azulLogoUndav} />
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
    justifyContent: "center"
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    fontWeight: "bold",
    color: negroAzulado,    
    textAlign: 'right',
    paddingRight: 10,
    alignContent: "flex-end",
    //backgroundColor: "red"
  },
  profileIcon: {
    paddingLeft: 20-15,
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
