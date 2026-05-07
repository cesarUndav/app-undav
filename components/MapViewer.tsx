// components/MapViewer.tsx

import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import ControlledPanZoom from './plan-area/ControlledPanZoom';

import { PlanData, ZoneType } from '../lib/mapsConfig';
import { hitTestZoneIdAtPoint } from '../lib/hitTest';
import InteractiveOverlay from './plan-area/InteractiveOverlay';

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
  connectionOverlay?: React.ComponentType<any> | null;
  showConnections?: boolean;
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
  viewportRef,
}: Props) {
  const isExpoGo = Constants.appOwnership === 'expo';

  const fallbackZoom = useMemo(() => {
    const w = Math.max(1, containerW);
    const h = Math.max(1, containerH);
    return Math.min(w / planData.width, h / planData.height);
  }, [containerW, containerH, planData.width, planData.height]);

  const { zoom, x, y } = useMemo(
    () => zoomParams ?? { zoom: fallbackZoom, x: 0, y: 0 },
    [zoomParams, fallbackZoom]
  );

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

  const handleTapCanvas = useCallback(
    ({ cx, cy }: { cx: number; cy: number }) => {
      const id = hitTestZoneIdAtPoint(planData.zones, cx, cy);
      if (id) onZonePress(id);
    },
    [planData.zones, onZonePress]
  );

  const content = (
    <>
      <SvgComponent
        width={planData.width}
        height={planData.height}
        viewBox={`0 0 ${planData.width} ${planData.height}`}
        preserveAspectRatio="none"
      />

      {showConnections && ConnectionOverlay && (
        <ConnectionOverlay
          width={planData.width}
          height={planData.height}
          viewBox={`0 0 ${planData.width} ${planData.height}`}
          preserveAspectRatio="none"
        />
      )}

      <InteractiveOverlay
        width={planData.width}
        height={planData.height}
        zones={planData.zones}
        selectedZoneId={selectedZoneId}
        selectedPathPts={selectedPathPts}
        onZonePress={handleZonePress}
        renderZone={renderZone}
      />
    </>
  );

  const renderPanZoom = () => {
    if (isExpoGo) {
      return (
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
          onTapCanvas={handleTapCanvas}
        >
          {content}
        </ControlledPanZoom>
      );
    }

    const ControlledPanZoomReanimated =
      require('./plan-area/ControlledPanZoomReanimated').default;

    return (
      <ControlledPanZoomReanimated
        width={planData.width}
        height={planData.height}
        containerW={containerW}
        containerH={containerH}
        zoom={zoom}
        x={x}
        y={y}
        minScale={minScale}
        maxScale={maxScale}
        onTransformEnd={onTransformChange}
        onTapCanvas={handleTapCanvas}
      >
        {content}
      </ControlledPanZoomReanimated>
    );
  };

  return (
    <View
      ref={viewportRef as any}
      style={[styles.wrapper, { width: containerW, height: containerH }]}
      testID={testID}
    >
      {renderPanZoom()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default memo(MapViewer);