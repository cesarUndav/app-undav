// components/MapViewer.tsx

import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import ControlledPanZoom from './plan-area/ControlledPanZoom';
import MapViewerContent from './plan-area/MapViewerContent';

import { hitTestZoneIdAtPoint } from '../lib/hitTest';

import type {
  MapViewerProps,
} from './plan-area/mapViewerTypes';

function MapViewer({
  BaseMapComponent,
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
  connectionOverlay,
  showConnections = false,
  viewportRef,
}: MapViewerProps) {
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

    const selectedZone = planData.zones.find((zone) => zone.id === selectedZoneId);

    if (
      !selectedZone?.path ||
      !Array.isArray(selectedZone.path) ||
      selectedZone.path.length < 3
    ) {
      return null;
    }

    return selectedZone.path as number[][];
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

      if (id) {
        onZonePress(id);
      }
    },
    [planData.zones, onZonePress]
  );

  const content = (
    <MapViewerContent
      BaseMapComponent={BaseMapComponent}
      planData={planData}
      selectedZoneId={selectedZoneId}
      selectedPathPts={selectedPathPts}
      onZonePress={handleZonePress}
      renderZone={renderZone}
      connectionOverlay={connectionOverlay}
      showConnections={showConnections}
    />
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