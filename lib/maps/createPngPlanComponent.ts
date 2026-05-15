// lib/maps/createPngPlanComponent.ts

import React from 'react';
import { Image as SvgImage } from 'react-native-svg';

type PngPlanComponentProps = {
  width: number;
  height: number;
  onLoad?: () => void;
  onError?: () => void;
};

export function createPngPlanComponent(source: any): React.FC<PngPlanComponentProps> {
  return function PngPlanComponent({
    width,
    height,
    onLoad,
    onError,
  }: PngPlanComponentProps) {
    const SvgImageComponent = SvgImage as any;

    return React.createElement(SvgImageComponent, {
      x: 0,
      y: 0,
      width,
      height,
      href: source,
      preserveAspectRatio: 'none',
      onLoad,
      onError,
    });
  };
}