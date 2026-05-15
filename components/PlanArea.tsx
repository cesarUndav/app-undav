// components/PlanArea.tsx

import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { View, LayoutChangeEvent, AccessibilityInfo } from 'react-native';

import { planAreaStyles } from '../theme/planAreaStyles';
import MapViewer from './MapViewer';
import { floorLabel } from '../lib/floors';

import { usePlanZoom } from '../hooks/usePlanZoom';
import { usePlanAreaEffects } from '../hooks/usePlanAreaEffects';
import { useTooltip } from '../hooks/useTooltip';
import { usePlanAreaAnimation } from '../hooks/usePlanAreaAnimation';
import type { ZoomParams } from '../hooks/usePlanZoom';

import PlanAreaControls from './plan-area/PlanAreaControls';
import { usePlanAreaHandlers } from './plan-area/usePlanAreaHandlers';
import type {
  PlanAreaHandle,
  PlanAreaProps,
} from './plan-area/planAreaTypes';

const PlanArea = React.forwardRef<PlanAreaHandle, PlanAreaProps>(function PlanArea(
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
    () => (id: string) => planData.zones.find((z) => z.id === id)?.name ?? id,
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

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      onLayoutBox(width, height);
    },
    [onLayoutBox]
  );

  const displayZoomParams = live ?? animatedView ?? zoomParams;

  const {
    handleZonePress,
    handleTransformChange,
    handlePrevFloor,
    handleNextFloor,
    handlePressGuidePoint,
    handlePressFitAll,
  } = usePlanAreaHandlers({
    floorIndex,
    floorsLength: floors.length,
    onChangeFloor,
    onSelectZone,
    showTip,
    zoneLabel,
    setZoomParams,
    fitAll,
    focusGuidePoint,
    animatedView,
    zoomParams,
    setLive,
  });

  return (
    <View style={planAreaStyles.box} onLayout={onLayout}>
      {box.w > 0 && box.h > 0 && (
        <>
          <MapViewer
            viewportRef={mapViewportRef}
            BaseMapComponent={floors[floorIndex].BaseMapComponent}
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

export default React.memo(PlanArea);