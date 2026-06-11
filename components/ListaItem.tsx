// components/ListaItem.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
  TouchableOpacity, // 🎯 Importamos para la interacción
} from 'react-native';
import CustomText from './CustomText';
import { getShadowStyle } from '@/constants/ShadowStyle';

type ListaItemProps = {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  fontSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  styleExtra?: StyleProp<ViewStyle>;
  editable?: boolean;    // 🎯 Prop opcional para habilitar el modo interactivo
  onPress?: () => void;  // 🎯 Callback para disparar la edición
};

export default function ListaItem({
  title,
  subtitle,
  backgroundColor = '#fff',
  titleColor = '#000',
  subtitleColor = '#000',
  fontSize = 13,
  paddingVertical = 8,
  paddingHorizontal = 15,
  styleExtra,
  editable = false,      // Por defecto no es presionable
  onPress,
}: ListaItemProps) {
  const containerStyle: ViewStyle = {
    backgroundColor,
    paddingVertical,
    paddingHorizontal,
  };

  const titleStyle: TextStyle = {
    color: titleColor,
    fontSize,
  };

  const subtitleStyle: TextStyle = {
    color: subtitleColor,
    fontSize: fontSize,
    marginTop: 1,
    paddingBottom: 1,
  };

  // El contenido interno se mantiene idéntico para no romper la UI original
  const Contenido = (
    <>
      <CustomText weight="bold" style={titleStyle}>
        {title}
      </CustomText>

      {subtitle && (
        <CustomText weight="bold" style={subtitleStyle}>
          {subtitle}
        </CustomText>
      )}
    </>
  );

  // 🎯 Si es editable, envolvemos en un elemento presionable, sino, queda estático en un View
  if (editable) {
    return (
      <TouchableOpacity 
        style={[styles.itemContainer, containerStyle, styleExtra]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {Contenido}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.itemContainer, containerStyle, styleExtra]}>
      {Contenido}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    ...getShadowStyle(4),
  },
});