import React, { memo } from 'react';
import { Polygon } from 'react-native-svg';

type Props = {
  id: string;
  pointsStr: string;            // precalculado en MapViewer
  fill: string;
  selected?: boolean;
  onPress?: (id: string) => void;
  testID?: string;
};

function ZonePolygonImpl({ id, pointsStr, fill, onPress, testID }: Props) {
  return (
    <Polygon
      points={pointsStr}
      fill={fill}

      strokeLinejoin="round"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      onPress={onPress ? () => onPress(id) : undefined}
      {...(testID ? { 'data-testid': testID } : {})}
    />
  );
}

export default memo(ZonePolygonImpl);
