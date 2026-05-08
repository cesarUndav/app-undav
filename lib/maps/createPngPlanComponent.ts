import React from 'react';
import { Image as SvgImage } from 'react-native-svg';

export function createPngPlanComponent(source: any): React.FC<any> {
  return function PngPlanComponent({ width, height }: { width: number; height: number }) {
    return React.createElement(SvgImage, {
      x: 0,
      y: 0,
      width,
      height,
      href: source,
      preserveAspectRatio: 'none',
    });
  };
}