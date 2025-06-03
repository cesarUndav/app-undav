import React, { ReactNode } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  ColorValue,
  ImageBackground,
  View,
} from 'react-native';

interface FondoImagenTinteProps {
  children: ReactNode;
  imagen: string; // URI string
  tinte?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

const FondoImagenTinte: React.FC<FondoImagenTinteProps> = ({
  children,
  imagen,
  tinte = 'rgba(200, 200, 200, 0.7)',
  style,
}) => {
  return (
    <ImageBackground
      source={{ uri: imagen }}
      resizeMode="cover"
      style={[styles.imagenFondo, style]}
      >
      <View style={[styles.container, { backgroundColor: tinte }]}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imagenFondo: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default FondoImagenTinte;
