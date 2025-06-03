import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, ViewStyle, ColorValue, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colorFondo } from '@/data/DatosUsuarioGuarani';

interface FondoScrollGradienteProps {
  children: ReactNode;
  colorTop?: ColorValue;
  colorBottom?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

const FondoScrollGradiente: React.FC<FondoScrollGradienteProps> = ({
  children,
  colorTop = "#fff",
  colorBottom = colorFondo,
  style,
}) => {
  return (
    <LinearGradient colors={[colorTop, colorBottom]} style={{flex: 1}}>
      <ScrollView contentContainerStyle={style ? style : styles.container}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 8
  },
});

export default FondoScrollGradiente;
