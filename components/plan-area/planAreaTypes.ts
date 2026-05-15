// components/plan-area/planAreaTypes.ts

import React from 'react';
import { PlanData } from '../../lib/mapsConfig';

export type PlanAreaHandle = {
  zoomToZone: (zoneId: string) => void;
};

export type PlanAreaProps = {
  planData: PlanData;
  floors: { key: string; BaseMapComponent: React.ComponentType<any> }[];
  floorIndex: number;
  onChangeFloor: (i: number) => void;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  mapId: string;

  initialFit?: boolean;
  fitPadding?: number;
  focusPadding?: number;
  fitMode?: 'canvas' | 'content';
  guideRadius?: number;
  floorBadgeBottomY?: number;

  showConnections?: boolean;
  onToggleConnections?: () => void;
  connectionOverlay?: React.ComponentType<any> | null;

  mapViewportRef?: React.Ref<any>;
  guidePointButtonRef?: React.Ref<any>;
  fitAllButtonRef?: React.Ref<any>;
  floorControlsRef?: React.Ref<any>;
};