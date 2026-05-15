// components/CustomText.tsx
import React from 'react';
import {
  Platform,
  Text as RNText,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native';

type NumericWeight = '400' | '500' | '600' | '700' | '800' | '900';
type NamedWeight =
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';
type WeightProp = NumericWeight | NamedWeight;

interface CustomTextProps extends TextProps {
  /** Acepta 'regular'|'medium'|'semibold'|'bold'|'extrabold'|'black' o '400'..'900' */
  weight?: WeightProp;
  style?: StyleProp<TextStyle>;
}

/** Normaliza el prop `weight` a un valor numérico ('400'..'900'). */
function normalizeWeight(w?: WeightProp): NumericWeight {
  switch (w) {
    case '500':
    case 'medium':
      return '500';
    case '600':
    case 'semibold':
      return '600';
    case '700':
    case 'bold':
      return '700';
    case '800':
    case 'extrabold':
      return '800';
    case '900':
    case 'black':
      return '900';
    case '400':
    case 'regular':
    default:
      return '400';
  }
}

/**
 * Mapa para iOS/Android con **Expo Google Fonts Montserrat**.
 * Si usas archivos locales, cambia estos nombres por los de tus fuentes
 * (p.ej. 'Montserrat-Regular', 'Montserrat-SemiBold', etc.).
 */
const expoMontserratFamilies: Record<NumericWeight, string> = {
  '400': 'Montserrat_400Regular',
  '500': 'Montserrat_500Medium',
  '600': 'Montserrat_600SemiBold',
  '700': 'Montserrat_700Bold',
  '800': 'Montserrat_800ExtraBold',
  '900': 'Montserrat_900Black',
};

const webFallbackStack =
  "Montserrat, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

const CustomText: React.FC<CustomTextProps> = ({
  children,
  weight = 'regular',
  style,
  ...rest
}) => {
  const w = normalizeWeight(weight);

  // Web: Montserrat variable/estática con font-weight funciona bien
  if (Platform.OS === 'web') {
    const webStyle: TextStyle = {
      fontFamily: webFallbackStack,
      fontWeight: w as TextStyle['fontWeight'],
    };
    return (
      <RNText {...rest} style={[webStyle, style]}>
        {children}
      </RNText>
    );
  }

  // iOS / Android: seleccionar la familia concreta por peso
  const nativeStyle: TextStyle = {
    fontFamily: expoMontserratFamilies[w] || expoMontserratFamilies['400'],
  };

  return (
    <RNText {...rest} style={[nativeStyle, style]}>
      {children}
    </RNText>
  );
};

export default CustomText;
