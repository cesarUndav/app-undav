// components/UndavHeader.tsx
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { azulClaro } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { undavHeaderStyles } from './UndavUsuarioHeader';
import { modoOscuro } from '@/data/DatosUsuarioGuarani';

export default function UndavEstudianteHeader() {
  const router = useRouter();

  const textoUserVisitante:string = "Iniciar Sesión\nComo Estudiante";
  
  return (
    <View style={undavHeaderStyles.header}>

      <Image source={require('../assets/images/logo_undav.png')} style={undavHeaderStyles.logoUndav} />

      <View style={undavHeaderStyles.userInfo}>
        <CustomText style={undavHeaderStyles.userText}>{textoUserVisitante}</CustomText>
      </View>

      <TouchableOpacity onPress={() => router.push('/loginAutenticado')} style={undavHeaderStyles.profileIcon}>
          <Ionicons name="person" size={36} color={modoOscuro ? "#fff":azulClaro} />
      </TouchableOpacity>
      
    </View>
  );
}