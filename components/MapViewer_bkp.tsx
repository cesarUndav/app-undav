// ==============================
// File: components/MapViewer.tsx
// ==============================
import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg } from 'react-native-svg';
import ControlledPanZoom from './ControlledPanZoom';
import { PlanData, ZoneType } from '../app/mapsConfig';
import ZonePolygon from './PlanArea/ZonePolygon';
import RoutePolygon from './PlanArea/RoutePolygon';
import { zoneStyleById } from '../theme/mapStyles';
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

  /** Permite renderizar contenido SVG custom por zona. Si retorna algo, se usa en vez del <ZonePolygon> por defecto. */
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

  // Prepara datos por zona
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

  // Polígono de ruta (path) del aula seleccionada
  const selectedPathStr = useMemo(() => {
    if (!selectedZoneId) return null;
    const sel = planData.zones.find(z => z.id === selectedZoneId) as any;
    const path: number[][] | undefined = sel?.path;
    if (!Array.isArray(path) || path.length < 3) return null;
    return path.map(p => p.join(',')).join(' ');
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
          // hit-test desde la última zona a la primera (por si solapan)
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

        {/* Overlay interactivo */}
        <Svg width={planData.width} height={planData.height} style={StyleSheet.absoluteFill}>
          {/* Ruta (path) del aula seleccionada, debajo de las zonas */}
          {selectedPathStr && <RoutePolygon pointsStr={selectedPathStr} />}

          {/* Zonas (aulas, etc.) */}
          {zones.map(({ z, selected, style, pointsStr }) => {
            if (renderZone) {
              // Render custom (debe devolver elementos SVG válidos)
              return <React.Fragment key={z.id}>{renderZone(z, selected)}</React.Fragment>;
            }
            return (
              <ZonePolygon
                key={z.id}
                id={z.id}
                pointsStr={pointsStr}
                fill={style.fill}
                onPress={handleZonePress}
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
