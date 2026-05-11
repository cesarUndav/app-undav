// components/plan-area/MapViewerContent.tsx

import React, { memo, useCallback, useEffect, useState } from 'react';

import InteractiveOverlay from './InteractiveOverlay';
import type { MapViewerContentProps } from './mapViewerTypes';

function MapViewerContent({
  BaseMapComponent,
  planData,
  selectedZoneId,
  selectedPathPts,
  renderZone,
  connectionOverlay: ConnectionOverlay,
  showConnections = false,
}: MapViewerContentProps) {
  const [baseMapLoaded, setBaseMapLoaded] = useState(false);

  useEffect(() => {
    setBaseMapLoaded(false);

    /**
     * Fallback de seguridad:
     * si por alguna razón react-native-svg/Image no dispara onLoad en algún entorno,
     * evitamos que los overlays queden ocultos para siempre.
     */
    const fallbackTimer = setTimeout(() => {
      setBaseMapLoaded(true);
    }, 700);

    return () => clearTimeout(fallbackTimer);
  }, [BaseMapComponent, planData.width, planData.height]);

  const handleBaseMapLoad = useCallback(() => {
    setBaseMapLoaded(true);
  }, []);

  const handleBaseMapError = useCallback(() => {
    setBaseMapLoaded(true);
  }, []);

  return (
    <>
      <BaseMapComponent
        width={planData.width}
        height={planData.height}
        viewBox={`0 0 ${planData.width} ${planData.height}`}
        preserveAspectRatio="none"
        onLoad={handleBaseMapLoad}
        onError={handleBaseMapError}
      />

      {baseMapLoaded && showConnections && ConnectionOverlay && (
        <ConnectionOverlay
          width={planData.width}
          height={planData.height}
          viewBox={`0 0 ${planData.width} ${planData.height}`}
          preserveAspectRatio="none"
        />
      )}

      {baseMapLoaded && (
        <InteractiveOverlay
          zones={planData.zones}
          selectedZoneId={selectedZoneId}
          selectedPathPts={selectedPathPts}
          renderZone={renderZone}
        />
      )}
    </>
  );
}

export default memo(MapViewerContent);