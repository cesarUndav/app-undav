import React from 'react';
import BotonTexto from './BotonTexto';
import { StyleProp, ViewStyle } from 'react-native';

type BotonTextoProps = {
  label: string;
  tel: string;
  centered?: boolean;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  color?:string;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function BotonTextoTelefono({
  label,
  centered = false,
  tel,
  verticalPadding = 12,
  fontSize,
  fontColor = 'white',
  color = "#556",
  styleExtra
}: BotonTextoProps) {
  return (
    <BotonTexto label={"Teléfono: "+label} styleExtra={styleExtra} url={"tel:"+tel} openInsideApp={false} color={color} verticalPadding={verticalPadding} fontSize={fontSize} fontColor={fontColor} centered={centered}/>
  );
}
