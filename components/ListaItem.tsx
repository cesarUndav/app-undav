// components/ListaItem.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  StyleProp,
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
  styleExtra,
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
    fontSize: fontSize - 1,
    marginTop: 1,
    paddingBottom: 1,
  };

  return (
    <View style={[styles.itemContainer, containerStyle, styleExtra]}>
      <CustomText weight="bold" style={titleStyle}>
        {title}
      </CustomText>

      {subtitle && (
        <CustomText weight="bold" style={subtitleStyle}>
          {subtitle}
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    ...getShadowStyle(4),
  },
});