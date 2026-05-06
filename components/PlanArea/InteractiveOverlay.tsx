// components/planArea/InteractiveOverlay.tsx
import React, { memo } from 'react';
import { G, Polygon } from 'react-native-svg';
import { ZoneType } from '../../lib/mapsConfig';
import { toPointsStr } from '../../lib/zoomMath';
import { route_style, zoneStyleById } from '../../theme/mapStyles';

type Props = {
  width: number;
  height: number;
  zones: ZoneType[];
  selectedZoneId: string | null;
  selectedPathPts: number[][] | null;
  onZonePress: (id: string) => void;
  renderZone?: (zone: ZoneType, selected: boolean) => React.ReactNode;
};

function InteractiveOverlay({
  width: _width,
  height: _height,
  zones,
  selectedZoneId,
  selectedPathPts,
  onZonePress: _onZonePress,
  renderZone,
}: Props) {
  return (
    <G pointerEvents="none">
      {selectedPathPts && selectedPathPts.length >= 3 && (
        <Polygon
          points={toPointsStr(selectedPathPts as any)}
          fill={route_style.fill}
          stroke={route_style.stroke}
          strokeWidth={route_style.strokeWidth}
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}

      {zones.map((z) => {
        const selected = z.id === selectedZoneId;

        if (renderZone) {
          const node = renderZone(z, selected);
          if (node) return <React.Fragment key={z.id}>{node}</React.Fragment>;
        }

        const style = zoneStyleById(z.id, selected);

        return (
          <Polygon
            key={z.id}
            points={toPointsStr(z.points as any)}
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