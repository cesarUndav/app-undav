// components/BotonTextoMail.tsx

import React from 'react';
import BotonTexto from './BotonTexto';
import { StyleProp, ViewStyle } from 'react-native';

type BotonTextoMailProps = {
  label: string;
  mail: string;
  asunto?: string;
  cuerpo?: string;
  centered?: boolean;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  color?: string;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function BotonTextoMail({
  label,
  centered = false,
  mail,
  asunto = '',
  cuerpo = '',
  verticalPadding,
  fontSize,
  fontColor = 'white',
  color = '#6a6c9c',
  styleExtra,
}: BotonTextoMailProps) {
  const asuntoCodificado = encodeURIComponent(asunto);
  const cuerpoCodificado = encodeURIComponent(cuerpo);

  const mailUrl = `mailto:${mail}?subject=${asuntoCodificado}&body=${cuerpoCodificado}`;

  return (
    <BotonTexto
      label={"eMail: "+label}
      styleExtra={styleExtra}
      url={mailUrl}
      openInsideApp={false}
      color={color}
      verticalPadding={verticalPadding}
      fontSize={fontSize}
      fontColor={fontColor}
      centered={centered}
    />
  );
}