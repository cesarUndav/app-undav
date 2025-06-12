import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, ViewStyle, TextStyle } from 'react-native';
import CustomText from './CustomText';
import { azulMedioUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

type BotonTextoProps = {
  label: string;
  url: string;
  color?: string;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
};

export default function BotonTextoLink({
  label,
  url,
  color = azulMedioUndav,
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white',
}: BotonTextoProps) {
  const openLink = () => {
    Linking.openURL(url).catch(() =>
      console.warn('No se pudo abrir el enlace:', url)
    );
  };

  const dynamicContainerStyle: ViewStyle = {
    backgroundColor: color,
    paddingTop: verticalPadding + 2,
    paddingBottom: verticalPadding,
  };

  const dynamicTextStyle: TextStyle = {
    fontSize,
    color: fontColor,
  };

  return (
    <TouchableOpacity style={[styles.bloque, dynamicContainerStyle]} onPress={openLink}>
      <CustomText style={[styles.texto, dynamicTextStyle]}>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bloque: {
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    ...getShadowStyle( 6)
  },
  texto: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
