// app/redes.tsx

import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import CustomText from '@/components/CustomText';

import {
  azulLogoUndav,
  azulMedioUndav,
  grisTexto,
} from '@/constants/Colors';

type Canal = {
  nombre: string;
  descripcion: string;
  url?: string;
  color: string;
  icono: keyof typeof Ionicons.glyphMap;
  tipo: 'externo' | 'interno';
  ruta?: string;
  iconoDerecha: keyof typeof Ionicons.glyphMap;
};

const radioBorde = 22;
const iconSize = 22;

const canales: Canal[] = [
  {
    nombre: 'Sitio web UNDAV',
    descripcion: 'Sitio institucional de la universidad.',
    url: 'https://undav.edu.ar/index.php',
    color: azulMedioUndav,
    icono: 'globe-outline',
    tipo: 'externo',
    iconoDerecha: 'open-outline',
  },
  {
    nombre: 'Radio UNDAV',
    descripcion: 'Escuchá la radio en vivo.',
    color: azulLogoUndav,
    icono: 'radio-outline',
    tipo: 'interno',
    ruta: '/radio-undav',
    iconoDerecha: 'chevron-forward',
  },
  {
    nombre: 'YouTube',
    descripcion: 'Videos, entrevistas y transmisiones.',
    url: 'https://www.youtube.com/@UNDAVOficial/featured',
    color: '#c4302b',
    icono: 'logo-youtube',
    tipo: 'externo',
    iconoDerecha: 'chevron-forward',
  },
  {
    nombre: 'Instagram',
    descripcion: 'Novedades y contenidos visuales.',
    url: 'https://www.instagram.com/undav_oficial/?hl=es',
    color: '#C13584',
    icono: 'logo-instagram',
    tipo: 'externo',
    iconoDerecha: 'chevron-forward',
  },
  {
    nombre: 'Facebook',
    descripcion: 'Publicaciones y actividades.',
    url: 'https://www.facebook.com/UNDAV2011',
    color: '#3b5998',
    icono: 'logo-facebook',
    tipo: 'externo',
    iconoDerecha: 'chevron-forward',
  },
  {
    nombre: 'X / Twitter',
    descripcion: 'Anuncios y novedades breves.',
    url: 'https://x.com/UNDAVOFICIAL',
    color: '#000000',
    icono: 'logo-twitter',
    tipo: 'externo',
    iconoDerecha: 'chevron-forward',
  },
  {
    nombre: 'LinkedIn',
    descripcion: 'Perfil institucional y profesional.',
    url: 'https://www.linkedin.com/school/universidad-nacional-de-avellaneda-undav-/',
    color: '#0e76a8',
    icono: 'logo-linkedin',
    tipo: 'externo',
    iconoDerecha: 'chevron-forward',
  },
];

export default function Redes() {
  const abrirCanal = (canal: Canal) => {
    if (canal.tipo === 'interno' && canal.ruta) {
      router.push(canal.ruta as never);
      return;
    }

    if (canal.url) {
      Linking.openURL(canal.url);
    }
  };

  return (
    <FondoScrollGradiente gap={6}>
      {canales.map((canal) => (
        <TouchableOpacity
          key={canal.nombre}
          activeOpacity={0.85}
          style={styles.card}
          onPress={() => abrirCanal(canal)}
        >
          <View style={[styles.iconContainer, { backgroundColor: canal.color }]}>
            <Ionicons name={canal.icono} size={iconSize} color="white" />
          </View>

          <View style={styles.textContainer}>
            <CustomText weight="bold" style={styles.nombre}>
              {canal.nombre}
            </CustomText>

            <CustomText style={styles.descripcion}>
              {canal.descripcion}
            </CustomText>
          </View>

          <Ionicons
            name={canal.iconoDerecha}
            size={20}
            color={azulLogoUndav}
          />
        </TouchableOpacity>
      ))}
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: radioBorde,
  },
  iconContainer: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 12,
  },
  textContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    color: azulLogoUndav,
    marginBottom: 1,
  },
  descripcion: {
    fontSize: 12,
    lineHeight: 16,
    color: grisTexto,
  },
});