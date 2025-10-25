// ==============================
// File: components/MapViewer.tsx
// ==============================
import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import ControlledPanZoom from './ControlledPanZoom';
import { PlanData, ZoneType } from '../app/mapsConfig';
import { zoneStyleById } from '../theme/mapStyles';

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

  /** Permite renderizar contenido SVG custom por zona. Si retorna algo, se usa en vez del <Polygon> por defecto. */
  renderZone?: (zone: ZoneType, selected: boolean) => React.ReactNode;

  /** Límites opcionales del zoom (se pasan a ControlledPanZoom). */
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
  // Fallback robusto (evita división por 0)
  const fallbackZoom = useMemo(() => {
    const w = Math.max(1, containerW);
    const h = Math.max(1, containerH);
    return Math.min(w / planData.width, h / planData.height);
  }, [containerW, containerH, planData.width, planData.height]);

  const { zoom, x, y } = useMemo(
    () => zoomParams ?? { zoom: fallbackZoom, x: 0, y: 0 },
    [zoomParams, fallbackZoom]
  );

  // Prepara datos por zona para render
  const zones = useMemo(
    () =>
      planData.zones.map((z) => {
        const selected = z.id === selectedZoneId;
        const style = zoneStyleById(z.id, selected);
        const pointsStr = z.points.map((p) => p.join(',')).join(' ');
        return { z, selected, style, pointsStr };
      }),
    [planData.zones, selectedZoneId]
  );

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
          // hit-test desde la última zona a la primera (si solapan)
          for (let i = planData.zones.length - 1; i >= 0; i--) {
            const z = planData.zones[i];
            if (pointInPolygon(cx, cy, z.points)) {
              onZonePress(z.id);
              break;
            }
          }
        }}
      >
        {/* Dibujo base del plano */}
        <SvgComponent
          width={planData.width}
          height={planData.height}
          viewBox={`0 0 ${planData.width} ${planData.height}`}
          preserveAspectRatio="none"
        />

        {/* Overlay interactivo de zonas */}
        <Svg width={planData.width} height={planData.height} style={StyleSheet.absoluteFill}>
          {zones.map(({ z, selected, style, pointsStr }) => {
            if (renderZone) {
              // Render custom (debe devolver elementos SVG válidos)
              return <React.Fragment key={z.id}>{renderZone(z, selected)}</React.Fragment>;
            }
            // Render por defecto
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
function pointInPolygon(x: number, y: number, pts: number[][]) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1];
    const xj = pts[j][0], yj = pts[j][1];
    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
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
