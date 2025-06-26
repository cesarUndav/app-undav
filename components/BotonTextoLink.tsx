import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, ViewStyle, TextStyle } from 'react-native';
import CustomText from './CustomText';
import { azulMedioUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { useRouter } from 'expo-router';

type BotonTextoProps = {
  label: string;
  centered?: boolean;
  route?: string;
  url?: string;
  openInsideApp?: boolean;
  tryLogin?: boolean;
  color?: string;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  onPressFunction?: () => void;
};

export default function BotonTextoLink({
  label,
  centered = false,
  route,
  url,
  openInsideApp = false,
  tryLogin = false,
  color = azulMedioUndav,
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white',
  onPressFunction,
}: BotonTextoProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPressFunction) {
      onPressFunction();
    }
    else if (route) {
      router.push(route as any);
      return;
    }
    else if (url) {
      if (openInsideApp) {
        const encodedURL = encodeURIComponent(url);
        router.push(`/webview/${encodedURL}?tryLogin=${tryLogin}`);
      } else {
        Linking.openURL(url).catch(() => console.warn('No se pudo abrir el enlace:', url));
      }
    }
  };

  const dynamicContainerStyle: ViewStyle = {
    backgroundColor: color,
    paddingTop: verticalPadding + 3,
    paddingBottom: verticalPadding - 1,
  };

  const dynamicTextStyle: TextStyle = {
    fontSize,
    color: fontColor,
    textAlign: centered ? "center" : "left"
  };

  return (
    <TouchableOpacity style={[styles.bloque, dynamicContainerStyle]} onPress={handlePress}>
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
    ...getShadowStyle(6),
  },
  texto: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center"
  },
});
