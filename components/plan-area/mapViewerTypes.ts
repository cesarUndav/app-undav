// components/plan-area/mapViewerTypes.ts

import React from 'react';
import type { PlanData, ZoneType } from '../../lib/mapsConfig';

export type ZoomTarget = {
  key: string;
  zoom: number;
  x: number;
  y: number;
} | null;

export type Transform = {
  zoom: number;
  x: number;
  y: number;
};

export type BaseMapComponentProps = {
  width: number;
  height: number;
  viewBox?: string;
  preserveAspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
};

export type MapViewerProps = {
  BaseMapComponent: React.ComponentType<BaseMapComponentProps>;
  planData: PlanData;
  containerW: number;
  containerH: number;
  selectedZoneId: string | null;
  onZonePress: (zoneId: string) => void;
  zoomParams: ZoomTarget;
  onTransformChange?: (t: Transform) => void;
  renderZone?: (zone: ZoneType, selected: boolean) => React.ReactNode;
  minScale?: number;
  maxScale?: number;
  testID?: string;
  connectionOverlay?: React.ComponentType<any> | null;
  showConnections?: boolean;
  viewportRef?: React.Ref<any>;
};

export type MapViewerContentProps = {
  BaseMapComponent: React.ComponentType<BaseMapComponentProps>;
  planData: PlanData;
  selectedZoneId: string | null;
  selectedPathPts: number[][] | null;
  renderZone?: (zone: ZoneType, selected: boolean) => React.ReactNode;
  connectionOverlay?: React.ComponentType<any> | null;
  showConnections?: boolean;
};