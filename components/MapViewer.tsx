// components/MapViewer.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import ControlledPanZoom from './ControlledPanZoom';
import { PlanData, ZoneType } from '../app/mapsConfig';
import { hitTestZoneIdAtPoint } from '../lib/hitTest';
import InteractiveOverlay from './PlanArea/InteractiveOverlay';

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

  // Overlay de conexiones opcional
  connectionOverlay?: React.ComponentType<any> | null;
  showConnections?: boolean;

  // Coachmark ref: viewport del plano
  viewportRef?: React.Ref<any>;
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
  connectionOverlay: ConnectionOverlay,
  showConnections = false,

  // ref
  viewportRef,
}: Props) {
  // Fallback robusto
  const fallbackZoom = useMemo(() => {
    const w = Math.max(1, containerW);
    const h = Math.max(1, containerH);
    return Math.min(w / planData.width, h / planData.height);
  }, [containerW, containerH, planData.width, planData.height]);

  const { zoom, x, y } = useMemo(
    () => zoomParams ?? { zoom: fallbackZoom, x: 0, y: 0 },
    [zoomParams, fallbackZoom]
  );

  // Path (polígono) de la zona seleccionada
  const selectedPathPts = useMemo(() => {
    if (!selectedZoneId) return null;
    const sel = planData.zones.find((z) => z.id === selectedZoneId);
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
    <View
      ref={viewportRef}
      style={[styles.wrapper, { width: containerW, height: containerH }]}
      testID={testID}
    >
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
          const id = hitTestZoneIdAtPoint(planData.zones, cx, cy);
          if (id) onZonePress(id);
        }}
      >
        {/* 1) Base del plano */}
        <SvgComponent
          width={planData.width}
          height={planData.height}
          viewBox={`0 0 ${planData.width} ${planData.height}`}
          preserveAspectRatio="none"
        />

        {/* 2) Overlay de conexiones (opcional) — sobre la base, debajo de zonas */}
        {showConnections && ConnectionOverlay && (
          <ConnectionOverlay
            width={planData.width}
            height={planData.height}
            viewBox={`0 0 ${planData.width} ${planData.height}`}
            preserveAspectRatio="none"
          />
        )}

        {/* 3) Overlay interactivo (path + zonas) */}
        <InteractiveOverlay
          width={planData.width}
          height={planData.height}
          zones={planData.zones}
          selectedZoneId={selectedZoneId}
          selectedPathPts={selectedPathPts}
          onZonePress={handleZonePress}
          renderZone={renderZone}
        />
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
