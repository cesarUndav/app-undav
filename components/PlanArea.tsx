// ==============================
// File: components/PlanArea.tsx
// ==============================
import React, { useEffect, useImperativeHandle, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, LayoutChangeEvent, AccessibilityInfo } from 'react-native';

import MapViewer from './MapViewer';
import { floorLabel } from '../lib/floors';
import { PlanData } from '../app/mapsConfig';
import { usePlanZoom } from '../hooks/usePlanZoom';
import { usePlanAreaEffects } from '../hooks/usePlanAreaEffects';
import { useTooltip } from '../hooks/useTooltip';
import { usePlanAreaAnimation } from '../hooks/usePlanAreaAnimation';
import type { ZoomParams } from '../hooks/usePlanZoom';

import PlanAreaControls from './PlanArea/PlanAreaControls';

export type PlanAreaHandle = {
  zoomToZone: (zoneId: string) => void;
};

type Props = {
  planData: PlanData;
  floors: { key: string; SvgComponent: React.ComponentType<any> }[];
  floorIndex: number;
  onChangeFloor: (i: number) => void;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  mapId: string;

  initialFit?: boolean; // default: true
  fitPadding?: number; // default: 0.1
  focusPadding?: number; // default: 0.18
  fitMode?: 'canvas' | 'content'; // default: 'canvas'
  guideRadius?: number; // default: 90
  floorBadgeBottomY?: number;

  showConnections?: boolean;
  onToggleConnections?: () => void;
  connectionOverlay?: React.ComponentType<any> | null;

  // Coachmarks refs (opcionales)
  mapViewportRef?: React.Ref<any>;
  guidePointButtonRef?: React.Ref<any>;
  fitAllButtonRef?: React.Ref<any>;
  floorControlsRef?: React.Ref<any>;
};

const PlanArea = React.forwardRef<PlanAreaHandle, Props>(function PlanArea(
  {
    planData,
    floors,
    floorIndex,
    onChangeFloor,
    selectedZoneId,
    onSelectZone,
    mapId,
    initialFit = true,
    fitPadding = 0.1,
    focusPadding = 0.18,
    fitMode = 'canvas',
    guideRadius = 90,
    floorBadgeBottomY,

    showConnections = false,
    onToggleConnections,
    connectionOverlay,

    mapViewportRef,
    guidePointButtonRef,
    fitAllButtonRef,
    floorControlsRef,
  },
  ref
) {
  const { tooltip, fade, showTip } = useTooltip();

  const zoneLabel = useMemo(
    () => (id: string) => planData.zones.find(z => z.id === id)?.name ?? id,
    [planData.zones]
  );

  const {
    box,
    onLayoutBox,
    zoomParams,
    setZoomParams,
    fitAll,
    focusZone,
    focusGuidePoint,
  } = usePlanZoom({
    planData,
    floors,
    floorIndex,
    mapId,
    fitPadding,
    focusPadding,
    fitMode,
    guideRadius,
  });

  usePlanAreaEffects({
    mapId,
    box,
    selectedZoneId,
    initialFit,
    focusZone,
    fitAll,
  });

  const { view: animatedView, setTarget } =
    usePlanAreaAnimation?.(zoomParams) ?? { view: null, setTarget: () => {} };

  const [live, setLive] = useState<ZoomParams>(null);

  useEffect(() => {
    setLive(null);
    setTarget?.(zoomParams);
  }, [zoomParams?.key, setTarget]);

  useImperativeHandle(
    ref,
    () => ({ zoomToZone: (zoneId: string) => focusZone(zoneId) }),
    [focusZone]
  );

  useEffect(() => {
    if (floors[floorIndex]) {
      AccessibilityInfo.announceForAccessibility?.(
        `${floorLabel(floorIndex)} de ${floors.length}`
      );
    }
  }, [floorIndex, floors]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    onLayoutBox(width, height);
  }, [onLayoutBox]);

  const displayZoomParams = live ?? animatedView ?? zoomParams;

  const handleZonePress = useCallback((id: string) => {
    onSelectZone(id);
    showTip(`${zoneLabel(id)}`);
  }, [onSelectZone, showTip, zoneLabel]);

  const handleTransformChange = useCallback((t: { zoom: number; x: number; y: number }) => {
    setLive(prev =>
      prev
        ? { ...prev, ...t }
        : (animatedView ?? zoomParams)
        ? { ...(animatedView ?? zoomParams)!, ...t }
        : { key: 'live', ...t }
    );
  }, [animatedView, zoomParams]);

  const handlePrevFloor = useCallback(() => {
    if (floorIndex > 0) {
      const next = floorIndex - 1;
      onChangeFloor(next);
      setZoomParams(null);
      showTip(floorLabel(next));
    }
  }, [floorIndex, onChangeFloor, setZoomParams, showTip]);

  const handleNextFloor = useCallback(() => {
    if (floorIndex < floors.length - 1) {
      const next = floorIndex + 1;
      onChangeFloor(next);
      setZoomParams(null);
      showTip(floorLabel(next));
    }
  }, [floorIndex, floors.length, onChangeFloor, setZoomParams, showTip]);

  const handlePressGuidePoint = useCallback(() => {
    focusGuidePoint();
    showTip('Punto guía');
  }, [focusGuidePoint, showTip]);

  const handlePressFitAll = useCallback(() => {
    fitAll();
    showTip('Vista general');
  }, [fitAll, showTip]);

  return (
    <View style={styles.box} onLayout={onLayout}>
      {box.w > 0 && box.h > 0 && (
        <>
          <MapViewer
            viewportRef={mapViewportRef}
            SvgComponent={floors[floorIndex].SvgComponent}
            planData={planData}
            containerW={box.w}
            containerH={box.h}
            selectedZoneId={selectedZoneId}
            onZonePress={handleZonePress}
            zoomParams={displayZoomParams}
            onTransformChange={handleTransformChange}
            connectionOverlay={connectionOverlay}
            showConnections={showConnections}
          />

          <PlanAreaControls
            floorIndex={floorIndex}
            maxFloors={floors.length}
            onPrevFloor={handlePrevFloor}
            onNextFloor={handleNextFloor}
            floorBadgeBottomY={floorBadgeBottomY}
            floorControlsRef={floorControlsRef}
            onPressGuidePoint={handlePressGuidePoint}
            onPressFitAll={handlePressFitAll}
            guidePointButtonRef={guidePointButtonRef}
            fitAllButtonRef={fitAllButtonRef}
            connectionOverlay={connectionOverlay}
            showConnections={showConnections}
            onToggleConnections={onToggleConnections}
            tooltip={tooltip}
            fade={fade}
          />
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default React.memo(PlanArea);
