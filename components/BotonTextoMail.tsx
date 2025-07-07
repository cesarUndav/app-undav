import React from 'react';
import BotonTexto from './BotonTexto';
import { celesteSIU } from '@/constants/Colors';
import { StyleProp, ViewStyle } from 'react-native';

type BotonTextoProps = {
  label: string;
  mail: string;
  centered?: boolean;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  color?:string;
  styleExtra?: StyleProp<ViewStyle>
};

export default function BotonTextoMail({
  label,
  centered = false,
  mail,
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white',
  color = "#a00",
  styleExtra

}: BotonTextoProps) {
  return (
    <BotonTexto label={label} styleExtra={styleExtra} url={"mailto:"+mail} openInsideApp={false} color={color} verticalPadding={verticalPadding} fontSize={fontSize} fontColor={fontColor} centered={centered}/>
  );
}
