import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, ViewStyle, TextStyle } from 'react-native';
import CustomText from './CustomText';
import { azulMedioUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { useRouter } from 'expo-router';

type BotonTextoProps = {
  label: string;
  route?: string;
  url?: string;
  openInsideApp?: boolean;
  tryLogin?: boolean;
  color?: string;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
};

export default function BotonTextoLink({
  label,
  route,
  url,
  openInsideApp = false,
  tryLogin = false,
  color = azulMedioUndav,
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white',
}: BotonTextoProps) {
  const openLink = () => {
    const router = useRouter();

    if (route) {
      router.push(route as any);
      return;
    }
    if (url) {
      if (openInsideApp) {
        const encodedURL = encodeURIComponent(url);
        router.push(`/webview/${encodedURL}?tryLogin=${tryLogin}`);
      }
      else {
        Linking.openURL(url).catch(() => console.warn('No se pudo abrir el enlace:', url));
      }
    }
  };

  const dynamicContainerStyle: ViewStyle = {
    backgroundColor: color,
    paddingTop: verticalPadding + 3,
    paddingBottom: verticalPadding -1,
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
