// components/BotonTexto.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, ViewStyle, TextStyle, StyleProp, Platform } from 'react-native';
import CustomText from './CustomText';
import { azulMedioUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { useRouter } from 'expo-router';
import { scaleFont } from '@/utils/scaling';

type BotonTextoProps = {
  label: string;
  centered?: boolean;
  route?: string;
  url?: string;
  openInsideApp?: boolean;
  openInsideAppForced?: boolean;
  tryLogin?: boolean;
  color?: string;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  styleExtra?: StyleProp<ViewStyle>;
  noBackground?: boolean;
  bold?: boolean;
  onPressFunction?: () => void | Promise<void>;
};

export default function BotonTexto({
  label,
  centered = false,
  route,
  url,
  openInsideApp = true,
  openInsideAppForced = false,
  tryLogin = false,
  color = azulMedioUndav,
  verticalPadding = scaleFont(9),
  fontSize = scaleFont(13),
  fontColor = 'white',
  noBackground = false,
  bold = true,
  onPressFunction,
  styleExtra,
}: BotonTextoProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPressFunction) {
      onPressFunction();
    } else if (route) {
      router.push(route as any);
      return;
    }
    else if (url) {
      if ( (openInsideApp && Platform.OS !== 'android') || openInsideAppForced) {
        router.push(`/webview/${encodeURIComponent(url)}?tryLogin=${tryLogin}`);
      } else {
        Linking.openURL(url).catch(() => console.warn('No se pudo abrir el enlace:', url));
      }
    }
  };

  // Corrección de estilos dinámicos basados en noBackground
  const dynamicContainerStyle: ViewStyle = {
    backgroundColor: noBackground ? 'transparent' : color,
    paddingTop: verticalPadding + 2,
    paddingBottom: verticalPadding - 3,
    // Si NO tiene fondo, usualmente no lleva sombra. Si tiene fondo, se le aplica la sombra.
    ...(!noBackground ? getShadowStyle(6) : {}), 
  };

  const dynamicTextStyle: TextStyle = {
    fontSize,
    // Si no hay fondo y el fontColor por defecto es blanco, no se vería. 
    // Ajustamos para que use el color principal si es noBackground y sigue en 'white'.
    color: noBackground && fontColor === 'white' ? color : fontColor,
    textAlign: centered ? 'center' : 'left',
  };

  return (
    <TouchableOpacity
      style={[styles.bloque, dynamicContainerStyle, styleExtra]}
      onPress={handlePress}
    >
      <CustomText weight={bold ? "bold" : "regular"} style={[styles.texto, dynamicTextStyle]}>
        {label}
      </CustomText>
    </TouchableOpacity>
  );
}

// Estilos estáticos limpios
const styles = StyleSheet.create({
  bloque: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  texto: {
    marginBottom: 5,
    textAlign: 'center',
  },
});