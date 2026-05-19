import React from 'react';
import {
  Platform,
  Text as RNText,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native';

type WeightProp = 'regular' | 'bold' | '400' | '700';

interface CustomTextProps extends TextProps {
  weight?: WeightProp;
  style?: StyleProp<TextStyle>;
}

function getNativeFontFamily(weight?: WeightProp) {
  if (weight === 'bold' || weight === '700') {
    return 'Montserrat_700Bold';
  }

  return 'Montserrat_400Regular';
}

function getWebFontWeight(weight?: WeightProp): TextStyle['fontWeight'] {
  if (weight === 'bold' || weight === '700') {
    return '700';
  }

  return '400';
}

const webFallbackStack =
  "Montserrat, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

const CustomText: React.FC<CustomTextProps> = ({
  children,
  weight = 'regular',
  style,
  ...rest
}) => {
  if (Platform.OS === 'web') {
    return (
      <RNText
        {...rest}
        style={[
          {
            fontFamily: webFallbackStack,
            fontWeight: getWebFontWeight(weight),
          },
          style,
        ]}
      >
        {children}
      </RNText>
    );
  }

  return (
    <RNText
      {...rest}
      style={[
        style,
        {
          fontFamily: getNativeFontFamily(weight),
        },
      ]}
    >
      {children}
    </RNText>
  );
};

export default CustomText;