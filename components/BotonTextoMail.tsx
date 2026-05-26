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
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white',
  color = 'rgb(63, 0, 105)',
  styleExtra,
}: BotonTextoMailProps) {
  const asuntoCodificado = encodeURIComponent(asunto);
  const cuerpoCodificado = encodeURIComponent(cuerpo);

  const mailUrl = `mailto:${mail}?subject=${asuntoCodificado}&body=${cuerpoCodificado}`;

  return (
    <BotonTexto
      label={label}
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