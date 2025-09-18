import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle, ColorValue, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colorFondoBottom, colorFondoTop } from '@/data/DatosUsuarioGuarani';

interface FondoScrollGradienteProps {
  children: ReactNode;
  colorTop?: ColorValue;
  colorBottom?: ColorValue;
  style?: StyleProp<ViewStyle>;
  gap?: number;
}

const FondoScrollGradiente: React.FC<FondoScrollGradienteProps> = ({
  children,
  colorTop = colorFondoTop,
  colorBottom = colorFondoBottom,
  style,
  gap = 10
}) => {
  return (
    <LinearGradient colors={[colorTop, colorBottom]} style={{flex: 1}}>
      <ScrollView contentContainerStyle={[style ? style : styles.container, {gap: gap}]}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 10
  },
});

export default FondoScrollGradiente;