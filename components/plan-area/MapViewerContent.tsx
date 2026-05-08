// components/plan-area/MapViewerContent.tsx

import React, { memo } from 'react';

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
  return (
    <>
      <BaseMapComponent
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
        zones={planData.zones}
        selectedZoneId={selectedZoneId}
        selectedPathPts={selectedPathPts}
        renderZone={renderZone}
      />
    </>
  );
}

export default memo(MapViewerContent);