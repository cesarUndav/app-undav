// components/UndavUsuarioHeader.tsx

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import {
  infoBaseUsuarioActual,
  modoOscuro,
  UsuarioEsAutenticado,
} from '@/data/apiAppUndav';
import { azulClaro, azulLogoUndav, azulMedioUndav, grisBorde } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🎯 Importamos AsyncStorage

const STORAGE_KEY = '@preferencia_info_oculta';

export default function UndavEstudianteHeader() {
  const router = useRouter();
  const [infoOculta, setInfoOculta] = useState(false);

  const nombreLegajo: string = !UsuarioEsAutenticado()
    ? 'Nombre Nombre Apellido\nLegajo: 12345'
    : infoBaseUsuarioActual.nombreCompleto +
      '\nLegajo: ' +
      infoBaseUsuarioActual.legajo;

  // 🔄 1. Cargar la preferencia del disco cuando se monta el componente
  useEffect(() => {
    const cargarPreferencia = async () => {
      try {
        const valorGuardado = await AsyncStorage.getItem(STORAGE_KEY);
        if (valorGuardado !== null) {
          // AsyncStorage solo guarda strings, así que parseamos el booleano
          setInfoOculta(JSON.parse(valorGuardado));
        }
      } catch (e) {
        console.error('Error al cargar preferencia de privacidad:', e);
      }
    };
    cargarPreferencia();
  }, []);

  // 💾 2. Función para alternar el estado y persistirlo en el almacenamiento local
  const togglePrivacidad = async () => {
    try {
      const nuevoEstado = !infoOculta;
      setInfoOculta(nuevoEstado);
      // Guardamos el nuevo estado serializado como string
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoEstado));
    } catch (e) {
      console.error('Error al guardar preferencia de privacidad:', e);
    }
  };

  return (
    <View style={undavHeaderStyles.header}>
      <Image
        source={require('../assets/images/logo_undav.png')}
        style={undavHeaderStyles.logoUndav}
      />

      <TouchableOpacity 
        style={undavHeaderStyles.userInfo}
        onPress={togglePrivacidad} // 🎯 Ejecuta la persistencia y el cambio de estado
        activeOpacity={0.7}
      >
        {infoOculta ? (
          <View style={undavHeaderStyles.textReplacementContainer}>
            <Ionicons 
              name="eye" 
              size={32} 
              color={modoOscuro ? '#fff' : azulClaro} 
            />
          </View>
        ) : (
          <View style={undavHeaderStyles.textReplacementContainer}>
            <CustomText weight="bold" style={undavHeaderStyles.userText}>
              {nombreLegajo}
            </CustomText>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/perfil')}
        style={undavHeaderStyles.profileIcon}
      >
        <Ionicons
          name="person"
          size={36}
          color={modoOscuro ? '#fff' : azulClaro}
        />
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
  },
  logoUndav: {
    height: '100%',
    aspectRatio: '1 / 1.22',
    width: 'auto',
    resizeMode: 'contain',
  },
  userInfo: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  textReplacementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12,
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    color: modoOscuro ? '#fff' : azulLogoUndav,
    textAlign: 'right',
  },
  profileIcon: {
    height: '105%',
    marginLeft: 8,
    aspectRatio: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: grisBorde,
  },
});