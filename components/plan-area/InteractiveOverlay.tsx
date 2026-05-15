// components/plan-area/InteractiveOverlay.tsx

import React, { memo } from 'react';
import { G, Polygon } from 'react-native-svg';

import { Pt, ZoneType } from '../../lib/mapsConfig';
import { toPointsStr } from '../../lib/zoomMath';
import { route_style, zoneStyleById } from '../../theme/mapStyles';

type Props = {
  zones: ZoneType[];
  selectedZoneId: string | null;
  selectedPathPts: number[][] | null;
  renderZone?: (zone: ZoneType, selected: boolean) => React.ReactNode;
};

function InteractiveOverlay({
  zones,
  selectedZoneId,
  selectedPathPts,
  renderZone,
}: Props) {
  return (
    <G pointerEvents="none">
      {selectedPathPts && selectedPathPts.length >= 3 && (
        <Polygon
          points={toPointsStr(selectedPathPts as Pt[])}
          fill={route_style.fill}
          stroke={route_style.stroke}
          strokeWidth={route_style.strokeWidth}
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}

      {zones.map((zone) => {
        const selected = zone.id === selectedZoneId;

        if (renderZone) {
          const customNode = renderZone(zone, selected);

          if (customNode) {
            return <React.Fragment key={zone.id}>{customNode}</React.Fragment>;
          }
        }

        const style = zoneStyleById(zone.id, selected);

        return (
          <Polygon
            key={zone.id}
            points={toPointsStr(zone.points as Pt[])}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        );
      })}
    </G>
  );
}

export default memo(InteractiveOverlay);