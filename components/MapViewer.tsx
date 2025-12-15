// MapViewer.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import ControlledPanZoom from './ControlledPanZoom';
import { PlanData, ZoneType } from '../app/mapsConfig';
import { zoneStyleById, route_style } from '../theme/mapStyles';
import { pointInPolygon, toPointsStr } from '../lib/zoomMath';

type ZoomTarget = { key: string; zoom: number; x: number; y: number } | null;

type Props = {
  SvgComponent: React.ComponentType<any>;
  planData: PlanData;
  containerW: number;
  containerH: number;
  selectedZoneId: string | null;
  onZonePress: (zoneId: string) => void;
  zoomParams: ZoomTarget;
  onTransformChange?: (t: { zoom: number; x: number; y: number }) => void;
  renderZone?: (zone: ZoneType, selected: boolean) => React.ReactNode;
  minScale?: number;
  maxScale?: number;
  testID?: string;
};

function MapViewer({
  SvgComponent,
  planData,
  containerW,
  containerH,
  selectedZoneId,
  onZonePress,
  zoomParams,
  onTransformChange,
  renderZone,
  minScale,
  maxScale,
  testID,
}: Props) {
  const fallbackZoom = useMemo(() => {
    const w = Math.max(1, containerW);
    const h = Math.max(1, containerH);
    return Math.min(w / planData.width, h / planData.height);
  }, [containerW, containerH, planData.width, planData.height]);

  const { zoom, x, y } = useMemo(
    () => zoomParams ?? { zoom: fallbackZoom, x: 0, y: 0 },
    [zoomParams, fallbackZoom]
  );

  const zones = useMemo(
    () =>
      planData.zones.map((z) => {
        const selected = z.id === selectedZoneId;
        const style = zoneStyleById(z.id, selected);
        const pointsStr = toPointsStr(z.points as any);
        return { z, selected, style, pointsStr };
      }),
    [planData.zones, selectedZoneId]
  );

  // Path (polígono) de la zona seleccionada
  const selectedPathPts = useMemo(() => {
    if (!selectedZoneId) return null;
    const sel = planData.zones.find(z => z.id === selectedZoneId);
    if (!sel?.path || !Array.isArray(sel.path) || sel.path.length < 3) return null;
    return sel.path as number[][];
  }, [planData.zones, selectedZoneId]);

  const handleZonePress = useCallback(
    (id: string) => {
      onZonePress(id);
    },
    [onZonePress]
  );

  return (
    <View style={[styles.wrapper, { width: containerW, height: containerH }]} testID={testID}>
      <ControlledPanZoom
        width={planData.width}
        height={planData.height}
        containerW={containerW}
        containerH={containerH}
        zoom={zoom}
        x={x}
        y={y}
        minScale={minScale}
        maxScale={maxScale}
        onTransformChange={onTransformChange}
        onTapCanvas={({ cx, cy }) => {
          // hit-test desde la última zona a la primera
          for (let i = planData.zones.length - 1; i >= 0; i--) {
            const z = planData.zones[i];
            if (pointInPolygon(cx, cy, z.points as any)) {
              onZonePress(z.id);
              break;
            }
          }
        }}
      >
        {/* Base del plano */}
        <SvgComponent
          width={planData.width}
          height={planData.height}
          viewBox={`0 0 ${planData.width} ${planData.height}`}
          preserveAspectRatio="none"
        />

        {/* Overlay interactivo */}
        <Svg width={planData.width} height={planData.height} style={StyleSheet.absoluteFill}>
          {/* 1) Ruta (path) debajo de las zonas */}
          {selectedPathPts && (
            <Polygon
              points={toPointsStr(selectedPathPts as any)}
              fill={route_style.fill}
              stroke={route_style.stroke}
              strokeWidth={route_style.strokeWidth}
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* 2) Zonas (aulas, etc.) */}
          {zones.map(({ z, selected, style, pointsStr }) => {
            if (renderZone) {
              return <React.Fragment key={z.id}>{renderZone(z, selected)}</React.Fragment>;
            }
            return (
              <Polygon
                key={z.id}
                points={pointsStr}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                onPress={() => handleZonePress(z.id)}
              />
            );
          })}
        </Svg>
      </ControlledPanZoom>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default memo(MapViewer);
