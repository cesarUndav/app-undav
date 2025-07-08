import React from 'react';
import BotonTexto from './BotonTexto';

type BotonTextoProps = {
  label: string;
  tel: string;
  centered?: boolean;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  color?:string;
};

export default function BotonTextoTelefono({
  label,
  centered = false,
  tel,
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white',
  color = "#556"
}: BotonTextoProps) {
  return (
    <BotonTexto label={label}  url={"tel:"+tel} openInsideApp={false} color={color} verticalPadding={verticalPadding} fontSize={fontSize} fontColor={fontColor} centered={centered}/>
  );
}
