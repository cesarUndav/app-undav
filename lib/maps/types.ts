import React from 'react';

export type Pt = [number, number];

export interface ZoneType {
  id: string;
  name: string;
  points: number[][];
  center?: [number, number];
  radius?: number;
  path?: number[][];
  linkTo?: ZoneLinkTo;
}

export interface PlanData {
  width: number;
  height: number;
  zones: ZoneType[];
  pathOrigin?: Pt;
}

export interface ZoneLinkTo {
  building: BuildingKey;
  floor: FloorKey;
}

export type BuildingKey = 'Espana' | 'Arenales' | 'PineyroA' | 'PineyroB' | 'PineyroC';

export type FloorKey = '0' | '1' | '2' | '3' | '4' | '5';

export interface FloorEntry {
  key: FloorKey;
  SvgComponent: React.FC<any>;
}