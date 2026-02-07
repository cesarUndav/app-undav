// components/tutorial/overlay/SpotlightMask.tsx
import React from 'react';
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg';
import type { Spotlight } from './geometry';

type Props = {
  width: number;
  height: number;
  spotlight: Spotlight | null;

  overlayColor?: string;
  strokeColor?: string;
  strokeWidth?: number;

  maskId?: string;
};

const DEFAULTS = {
  overlayColor: 'rgba(0,0,0,0.65)',
  strokeColor: 'rgba(255,255,255,0.55)',
  strokeWidth: 2,
};

export function SpotlightMask({
  width,
  height,
  spotlight,
  overlayColor = DEFAULTS.overlayColor,
  strokeColor = DEFAULTS.strokeColor,
  strokeWidth = DEFAULTS.strokeWidth,
  maskId = 'spotlightMask',
}: Props) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <Mask id={maskId}>
          <Rect x={0} y={0} width={width} height={height} fill="white" />

          {spotlight?.kind === 'circle' ? (
            <Circle cx={spotlight.cx} cy={spotlight.cy} r={spotlight.r} fill="black" />
          ) : spotlight?.kind === 'rect' ? (
            <Rect
              x={spotlight.x}
              y={spotlight.y}
              width={spotlight.width}
              height={spotlight.height}
              rx={spotlight.rx}
              ry={spotlight.ry}
              fill="black"
            />
          ) : null}
        </Mask>
      </Defs>

      <Rect x={0} y={0} width={width} height={height} fill={overlayColor} mask={`url(#${maskId})`} />

      {/* Contorno suave */}
      {spotlight?.kind === 'circle' ? (
        <Circle
          cx={spotlight.cx}
          cy={spotlight.cy}
          r={spotlight.r}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      ) : spotlight?.kind === 'rect' ? (
        <Rect
          x={spotlight.x}
          y={spotlight.y}
          width={spotlight.width}
          height={spotlight.height}
          rx={spotlight.rx}
          ry={spotlight.ry}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </Svg>
  );
}
