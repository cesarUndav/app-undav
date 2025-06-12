import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
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
    fontWeight: 'bold',
    color: titleColor,
    fontSize,
  };

  const subtitleStyle: TextStyle = {
    fontWeight: 'bold',
    color: subtitleColor,
    fontSize: fontSize - 1,
    marginTop: 3,
  };

  return (
    <View style={[styles.itemContainer, containerStyle]}>
      <CustomText style={titleStyle}>{title}</CustomText>
      {subtitle && <CustomText style={subtitleStyle}>{subtitle}</CustomText>}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomRightRadius: 16,
    ...getShadowStyle( 4)
  }
});
