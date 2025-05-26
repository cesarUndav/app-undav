// components/BotonTexto.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, ViewStyle } from 'react-native';
import CustomText from './CustomText';

type BotonTextoProps = {
  label: string;
  url: string;
  color?: string;
  verticalPadding?: number;
};

export default function BotonTexto({
  label,
  url,
  color = '#173c68',
  verticalPadding = 15,
}: BotonTextoProps) {
  const openLink = () => {
    Linking.openURL(url).catch(() =>
      console.warn('No se pudo abrir el enlace:', url)
    );
  };

  const dynamicStyle: ViewStyle = {
    backgroundColor: color,
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
  };

  return (
    <TouchableOpacity style={[styles.bloque, dynamicStyle]} onPress={openLink}>
      <CustomText style={styles.subtitulo}>{label}</CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bloque: {
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    elevation: 6,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
});
