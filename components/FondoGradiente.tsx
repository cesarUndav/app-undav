import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colorFondoTop, colorFondoBottom } from '@/data/DatosUsuarioGuarani';

interface FondoGradienteProps {
  children: ReactNode;
  colorTop?: ColorValue;
  colorBottom?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

const FondoGradiente: React.FC<FondoGradienteProps> = ({
  children,
  colorTop = colorFondoTop,
  colorBottom = colorFondoBottom,
  style,
}) => {
  return (
    // colorTop, colorBottom
    <LinearGradient colors={[colorTop, colorBottom]} style={[{flex: 1}, style ? style : styles.container]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    padding: 15
  },
});

export default FondoGradiente;