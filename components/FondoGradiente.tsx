import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colorFondo } from '@/data/DatosUsuarioGuarani';

interface FondoGradienteProps {
  children: ReactNode;
  colorTop?: ColorValue;
  colorBottom?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

const FondoGradiente: React.FC<FondoGradienteProps> = ({
  children,
  colorTop = "#fff",
  colorBottom = colorFondo,
  style,
}) => {
  return (
    <LinearGradient colors={[colorTop, colorBottom]} style={[{flex: 1}, style ? style : styles.container]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
});

export default FondoGradiente;
