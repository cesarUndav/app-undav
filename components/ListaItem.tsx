import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import CustomText from './CustomText';

type ListaItemProps = {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  fontSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
};

export default function ListaItem({
  title,
  subtitle,
  backgroundColor = '#fff',
  titleColor = '#000',
  subtitleColor = '#000',
  fontSize = 16,
  paddingVertical = 8,
  paddingHorizontal = 15,
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
    fontSize: fontSize - 2,
    marginTop: 2,
  };

  return (
    <View style={[styles.itemContainer, containerStyle]}>
      <CustomText style={[styles.title, titleStyle]}>{title}</CustomText>
      <CustomText style={[styles.subtitle, subtitleStyle]}>{subtitle}</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomRightRadius: 16,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontWeight: 'bold',
  },
});
