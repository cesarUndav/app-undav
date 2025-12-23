// ==============================
// File: app/mapsConfig.ts
// ==============================
import React from 'react';

// SVGs (pisos)
import Espana0 from '../assets/maps/Espana/espana0.svg';

import Arenales0 from '../assets/maps/Arenales/arenales0.svg';
import Arenales1 from '../assets/maps/Arenales/arenales1.svg';
import Arenales2 from '../assets/maps/Arenales/arenales2.svg';
import Arenales3 from '../assets/maps/Arenales/arenales3.svg';
import Arenales4 from '../assets/maps/Arenales/arenales4.svg';
import Arenales5 from '../assets/maps/Arenales/arenales5.svg';

import PineyroA0 from '../assets/maps/PineyroA/pineyroA0.svg';
import PineyroA1 from '../assets/maps/PineyroA/pineyroA1.svg';
import PineyroA2 from '../assets/maps/PineyroA/pineyroA2.svg';
import PineyroA3 from '../assets/maps/PineyroA/pineyroA3.svg';

import PineyroB0 from '../assets/maps/PineyroB/pineyroB0.svg';
import PineyroB1 from '../assets/maps/PineyroB/pineyroB1.svg';
import PineyroB2 from '../assets/maps/PineyroB/pineyroB2.svg';

import PineyroC0 from '../assets/maps/PineyroC/pineyroC0.svg';
import PineyroC1 from '../assets/maps/PineyroC/pineyroC1.svg';
import PineyroC2 from '../assets/maps/PineyroC/pineyroC2.svg';

// JSON PlanData
import espana0Data from '../assets/maps/Espana/espana0.json';

import arenales0Data from '../assets/maps/Arenales/arenales0.json';
import arenales1Data from '../assets/maps/Arenales/arenales1.json';
import arenales2Data from '../assets/maps/Arenales/arenales2.json';
import arenales3Data from '../assets/maps/Arenales/arenales3.json';
import arenales4Data from '../assets/maps/Arenales/arenales4.json';
import arenales5Data from '../assets/maps/Arenales/arenales5.json';

import pineyroA0Data from '../assets/maps/PineyroA/pineyroA0.json';
import pineyroA1Data from '../assets/maps/PineyroA/pineyroA1.json';
import pineyroA2Data from '../assets/maps/PineyroA/pineyroA2.json';
import pineyroA3Data from '../assets/maps/PineyroA/pineyroA3.json';

import pineyroB0Data from '../assets/maps/PineyroB/pineyroB0.json';
import pineyroB1Data from '../assets/maps/PineyroB/pineyroB1.json';
import pineyroB2Data from '../assets/maps/PineyroB/pineyroB2.json';

import pineyroC0Data from '../assets/maps/PineyroC/pineyroC0.json';
import pineyroC1Data from '../assets/maps/PineyroC/pineyroC1.json';
import pineyroC2Data from '../assets/maps/PineyroC/pineyroC2.json';

// ====== Tipos ======
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

// Claves de piso tipadas como literales (0..5 para cubrir Arenales)
export type FloorKey = '0' | '1' | '2' | '3' | '4' | '5';

export interface FloorEntry {
  key: FloorKey;
  SvgComponent: React.FC<any>;
}

// Helper: normaliza JSON → PlanData “estricto”
function toPlanData(d: any): PlanData {
  const po =
    Array.isArray(d?.pathOrigin) && d.pathOrigin.length >= 2
      ? [Number(d.pathOrigin[0]), Number(d.pathOrigin[1])] as [number, number]
      : undefined;

  return {
    width: Number(d?.width ?? 0),
    height: Number(d?.height ?? 0),
    zones: Array.isArray(d?.zones) ? d.zones : [],
    pathOrigin: po,
  };
}

// Definición de edificios y pisos disponibles
export const edificios: Record<BuildingKey, { label: string; floors: FloorEntry[] }> = {
  Espana: {
    label: 'Sede España',
    floors: [{ key: '0', SvgComponent: Espana0 }],
  },
  Arenales: {
    label: 'Sede Arenales',
    floors: [
      { key: '0', SvgComponent: Arenales0 },
      { key: '1', SvgComponent: Arenales1 },
      { key: '2', SvgComponent: Arenales2 },
      { key: '3', SvgComponent: Arenales3 },
      { key: '4', SvgComponent: Arenales4 },
      { key: '5', SvgComponent: Arenales5 },
    ],
  },
  PineyroA: {
    label: 'Sede Piñeyro Cuerpo A',
    floors: [
      { key: '0', SvgComponent: PineyroA0 },
      { key: '1', SvgComponent: PineyroA1 },
      { key: '2', SvgComponent: PineyroA2 },
      { key: '3', SvgComponent: PineyroA3 }, 
    ],
  },
  PineyroB: {
    label: 'Sede Piñeyro Cuerpo B',
    floors: [
      { key: '0', SvgComponent: PineyroB0 },
      { key: '1', SvgComponent: PineyroB1 },
      { key: '2', SvgComponent: PineyroB2 },
    ],
  },
  PineyroC: {
    label: 'Sede Piñeyro Cuerpo C',
    floors: [
      { key: '0', SvgComponent: PineyroC0 },
      { key: '1', SvgComponent: PineyroC1 },
      { key: '2', SvgComponent: PineyroC2 },
    ],
  },
};

// Mapping de datos por edificio/piso
export const coordsMap: Record<BuildingKey, Partial<Record<FloorKey, PlanData>>> = {
  Espana: {
    '0': toPlanData(espana0Data),
  },
  Arenales: {
    '0': toPlanData(arenales0Data),
    '1': toPlanData(arenales1Data),
    '2': toPlanData(arenales2Data),
    '3': toPlanData(arenales3Data),
    '4': toPlanData(arenales4Data),
    '5': toPlanData(arenales5Data),
  },
  PineyroA: {
    '0': toPlanData(pineyroA0Data),
    '1': toPlanData(pineyroA1Data),
    '2': toPlanData(pineyroA2Data),
    '3': toPlanData(pineyroA3Data),
  },
  PineyroB: {
    '0': toPlanData(pineyroB0Data),
    '1': toPlanData(pineyroB1Data),
    '2': toPlanData(pineyroB2Data),
  },
  PineyroC: {
    '0': toPlanData(pineyroC0Data),
    '1': toPlanData(pineyroC1Data),
    '2': toPlanData(pineyroC2Data),
  },
};

/* =========================
   OVERLAYS DE CONEXIONES
   ========================= */
// Imports de overlays (solo PB/1/2 para A/B/C; el piso 3 de A NO tiene)
import PineyroA0Conn from '../assets/maps/PineyroA/pineyroA0connections.svg';
import PineyroA1Conn from '../assets/maps/PineyroA/pineyroA1connections.svg';
import PineyroA2Conn from '../assets/maps/PineyroA/pineyroA2connections.svg';

import PineyroB0Conn from '../assets/maps/PineyroB/pineyroB0connections.svg';
import PineyroB1Conn from '../assets/maps/PineyroB/pineyroB1connections.svg';
import PineyroB2Conn from '../assets/maps/PineyroB/pineyroB2connections.svg';

import PineyroC0Conn from '../assets/maps/PineyroC/pineyroC0connections.svg';
import PineyroC1Conn from '../assets/maps/PineyroC/pineyroC1connections.svg';
import PineyroC2Conn from '../assets/maps/PineyroC/pineyroC2connections.svg';

// Registry: solo Pineyro (A/B/C), pisos 0-2
export const connectionOverlays: Partial<Record<BuildingKey, Partial<Record<FloorKey, React.FC<any>>>>> = {
  PineyroA: {
    '0': PineyroA0Conn,
    '1': PineyroA1Conn,
    '2': PineyroA2Conn,
    // '3': (intencionalmente sin overlay)
  },
  PineyroB: {
    '0': PineyroB0Conn,
    '1': PineyroB1Conn,
    '2': PineyroB2Conn,
  },
  PineyroC: {
    '0': PineyroC0Conn,
    '1': PineyroC1Conn,
    '2': PineyroC2Conn,
  },
  // Espana / Arenales: sin overlays
};
