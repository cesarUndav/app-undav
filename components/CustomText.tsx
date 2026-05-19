// components/CustomText.tsx
import React from 'react';
import {
  Text as RNText,
  TextProps,
  TextStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';

type NumericWeight = '400' | '500' | '600' | '700' | '800' | '900';
type NamedWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
type WeightProp = NumericWeight | NamedWeight;

interface CustomTextProps extends TextProps {
  weight?: WeightProp;
  style?: StyleProp<TextStyle>;
}

function normalizeWeight(w?: WeightProp): NumericWeight {
  switch (w) {
    case '500': case 'medium': return '500';
    case '600': case 'semibold': return '600';
    case '700': case 'bold': return '700';
    case '800': case 'extrabold': return '800';
    case '900': case 'black': return '900';
    case '400': case 'regular': default: return '400';
  }
}

export default function CustomText({
  children,
  weight,
  style,
  ...rest
}: CustomTextProps) {
  const flattenedStyle = StyleSheet.flatten(style) || {};
  
  // Detectamos el peso por prop o por el estilo que viene de afuera
  const incomingWeight = weight || (flattenedStyle.fontWeight as WeightProp) || 'regular';
  const w = normalizeWeight(incomingWeight);

  const systemTextStyle: TextStyle = {
    fontWeight: w as TextStyle['fontWeight'], // El sistema nativo maneja los pesos impecable
  };

  return (
    <RNText {...rest} style={[style, systemTextStyle]}>
      {children}
    </RNText>
  );
}