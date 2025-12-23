import * as React from 'react';
import Svg, { Polyline } from 'react-native-svg';

type Props = { size?: number; color?: string; style?: any };

export default function ChevronDown({ size = 18, color = '#4B5563', style }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Polyline
        points="6,9 12,15 18,9"
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
