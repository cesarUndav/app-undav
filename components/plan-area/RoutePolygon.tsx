import React, { memo } from 'react';
import { Polygon } from 'react-native-svg';
import { route_style } from '../../theme/mapStyles';

type Props = {
  pointsStr: string; // precalculado
};

function RoutePolygonImpl({ pointsStr }: Props) {
  return (
    <Polygon
      points={pointsStr}
      fill={route_style.fill}
      stroke={route_style.stroke}
      strokeWidth={route_style.strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

export default memo(RoutePolygonImpl);
