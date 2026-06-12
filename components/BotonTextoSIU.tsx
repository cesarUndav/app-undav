import React from 'react';
import BotonTexto from './BotonTexto';
import { celesteSIU } from '@/constants/Colors';
import { StyleProp, ViewStyle } from 'react-native';

type BotonTextoProps = {
  label: string;
  url: string;
  tryLogin?: boolean;
  openInsideApp?: boolean;
  centered?: boolean;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function BotonTextoSIU({
  label,
  centered = false,
  url,
  tryLogin = true,
  openInsideApp=true,
  verticalPadding,
  fontSize,
  fontColor = 'white',
  styleExtra
}: BotonTextoProps) {
  return (
    <BotonTexto label={label} url={url} tryLogin={tryLogin} openInsideApp={openInsideApp} styleExtra={styleExtra} color={celesteSIU} verticalPadding={verticalPadding} fontSize={fontSize} fontColor={fontColor} centered={centered}/>
  );
}
