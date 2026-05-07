// components/plan-area/usePlanAreaHandlers.ts

import { useCallback } from 'react';
import { floorLabel } from '../../lib/floors';
import type { ZoomParams } from '../../hooks/usePlanZoom';

type Transform = {
  zoom: number;
  x: number;
  y: number;
};

type Params = {
  floorIndex: number;
  floorsLength: number;

  onChangeFloor: (i: number) => void;
  onSelectZone: (zoneId: string) => void;

  showTip: (message: string) => void;
  zoneLabel: (id: string) => string;

  setZoomParams: (value: ZoomParams) => void;
  fitAll: () => void;
  focusGuidePoint: () => void;

  animatedView: ZoomParams;
  zoomParams: ZoomParams;
  setLive: React.Dispatch<React.SetStateAction<ZoomParams>>;
};

export function usePlanAreaHandlers({
  floorIndex,
  floorsLength,
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
}: Params) {
  const handleZonePress = useCallback(
    (id: string) => {
      onSelectZone(id);
      showTip(`${zoneLabel(id)}`);
    },
    [onSelectZone, showTip, zoneLabel]
  );

  const handleTransformChange = useCallback(
    (t: Transform) => {
      setLive((prev) =>
        prev
          ? { ...prev, ...t }
          : animatedView ?? zoomParams
            ? { ...(animatedView ?? zoomParams)!, ...t }
            : { key: 'live', ...t }
      );
    },
    [animatedView, zoomParams, setLive]
  );

  const handlePrevFloor = useCallback(() => {
    if (floorIndex > 0) {
      const next = floorIndex - 1;
      onChangeFloor(next);
      setZoomParams(null);
      showTip(floorLabel(next));
    }
  }, [floorIndex, onChangeFloor, setZoomParams, showTip]);

  const handleNextFloor = useCallback(() => {
    if (floorIndex < floorsLength - 1) {
      const next = floorIndex + 1;
      onChangeFloor(next);
      setZoomParams(null);
      showTip(floorLabel(next));
    }
  }, [floorIndex, floorsLength, onChangeFloor, setZoomParams, showTip]);

  const handlePressGuidePoint = useCallback(() => {
    focusGuidePoint();
    showTip('Punto guía');
  }, [focusGuidePoint, showTip]);

  const handlePressFitAll = useCallback(() => {
    fitAll();
    showTip('Vista general');
  }, [fitAll, showTip]);

  return {
    handleZonePress,
    handleTransformChange,
    handlePrevFloor,
    handleNextFloor,
    handlePressGuidePoint,
    handlePressFitAll,
  };
}