import React from 'react';
import BotonTexto from './BotonTexto';
import { celesteSIU } from '@/constants/Colors';

type BotonTextoProps = {
  label: string;
  url: string;
  tryLogin?: boolean;
  openInsideApp?: boolean;
  centered?: boolean;
  verticalPadding?: number;
  fontSize?: number;
  fontColor?: string;
};

export default function BotonTextoSIU({
  label,
  centered = false,
  url,
  tryLogin = true,
  openInsideApp=true,
  verticalPadding = 12,
  fontSize = 16,
  fontColor = 'white'
}: BotonTextoProps) {
  return (
    <BotonTexto label={label} url={url} tryLogin={tryLogin} openInsideApp={openInsideApp} color={celesteSIU} verticalPadding={verticalPadding} fontSize={fontSize} fontColor={fontColor} centered={centered}/>
  );
}
