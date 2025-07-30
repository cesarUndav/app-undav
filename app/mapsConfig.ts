// mapsConfig.ts

import React from 'react';

// SVG Imports
import Espana0 from '../assets/maps/Espana/espana0.svg';
import Arenales0 from '../assets/maps/Arenales/arenales0.svg';
import Arenales1 from '../assets/maps/Arenales/arenales1.svg';
import Arenales2 from '../assets/maps/Arenales/arenales2.svg';
import Arenales3 from '../assets/maps/Arenales/arenales3.svg';
import PineyroA0 from '../assets/maps/PineyroA/pineyroA0.svg';
import PineyroA1 from '../assets/maps/PineyroA/pineyroA1.svg';
import PineyroA2 from '../assets/maps/PineyroA/pineyroA2.svg';
import PineyroA3 from '../assets/maps/PineyroA/pineyroA3.svg';
import PineyroB0 from '../assets/maps/PineyroB/pineyroB0.svg';
import PineyroB1 from '../assets/maps/PineyroB/pineyroB1.svg';
import PineyroB2 from '../assets/maps/PineyroB/pineyroB2.svg';
import PineyroB3 from '../assets/maps/PineyroB/pineyroB3.svg';
import PineyroC0 from '../assets/maps/PineyroC/pineyroC0.svg';
import PineyroC1 from '../assets/maps/PineyroC/pineyroC1.svg';
import PineyroC2 from '../assets/maps/PineyroC/pineyroC2.svg';
import PineyroC3 from '../assets/maps/PineyroC/pineyroC3.svg';

// JSON PlanData Imports
import espana0Data from '../assets/maps/Espana/espana0.json';
import arenales0Data from '../assets/maps/Arenales/arenales0.json';
import arenales1Data from '../assets/maps/Arenales/arenales1.json';
import arenales2Data from '../assets/maps/Arenales/arenales2.json';
import arenales3Data from '../assets/maps/Arenales/arenales3.json';
import pineyroA0Data from '../assets/maps/PineyroA/pineyroA0.json';
import pineyroA1Data from '../assets/maps/PineyroA/pineyroA1.json';
import pineyroA2Data from '../assets/maps/PineyroA/pineyroA2.json';
import pineyroA3Data from '../assets/maps/PineyroA/pineyroA3.json';
import pineyroB0Data from '../assets/maps/PineyroB/pineyroB0.json';
import pineyroB1Data from '../assets/maps/PineyroB/pineyroB1.json';
import pineyroB2Data from '../assets/maps/PineyroB/pineyroB2.json';
import pineyroB3Data from '../assets/maps/PineyroB/pineyroB3.json';
import pineyroC0Data from '../assets/maps/PineyroC/pineyroC0.json';
import pineyroC1Data from '../assets/maps/PineyroC/pineyroC1.json';
import pineyroC2Data from '../assets/maps/PineyroC/pineyroC2.json';
import pineyroC3Data from '../assets/maps/PineyroC/pineyroC3.json';

// Types
export interface ZoneType {
  id: string;
  name: string;
  points: number[][];
}

export interface PlanData {
  width: number;
  height: number;
  zones: ZoneType[];
}

export type BuildingKey = 'Espana' | 'Arenales' | 'PineyroA' | 'PineyroB' | 'PineyroC';

export interface FloorEntry {
  key: string;
  SvgComponent: React.FC<any>;
}

// Building definitions: label and available floors
export const edificios: Record<BuildingKey, { label: string; floors: FloorEntry[] }> = {
  Espana: {
    label: 'España',
    floors: [
      { key: '0', SvgComponent: Espana0 }
    ]
  },
  Arenales: {
    label: 'Arenales',
    floors: [
      { key: '0', SvgComponent: Arenales0 },
      { key: '1', SvgComponent: Arenales1 },
      { key: '2', SvgComponent: Arenales2 },
      { key: '3', SvgComponent: Arenales3 }
    ]
  },
  PineyroA: {
    label: 'Piñeyro A',
    floors: [
      { key: '0', SvgComponent: PineyroA0 },
      { key: '1', SvgComponent: PineyroA1 },
      { key: '2', SvgComponent: PineyroA2 },
      { key: '3', SvgComponent: PineyroA3 }
    ]
  },
  PineyroB: {
    label: 'Piñeyro B',
    floors: [
      { key: '0', SvgComponent: PineyroB0 },
      { key: '1', SvgComponent: PineyroB1 },
      { key: '2', SvgComponent: PineyroB2 },
      { key: '3', SvgComponent: PineyroB3 }
    ]
  },
  PineyroC: {
    label: 'Piñeyro C',
    floors: [
      { key: '0', SvgComponent: PineyroC0 },
      { key: '1', SvgComponent: PineyroC1 },
      { key: '2', SvgComponent: PineyroC2 },
      { key: '3', SvgComponent: PineyroC3 }
    ]
  }
};

// Mapping of plan data (dimensions + zones) for each building/floor
export const coordsMap: Record<BuildingKey, Record<string, PlanData>> = {
  Espana: {
    '0': espana0Data as PlanData
  },
  Arenales: {
    '0': arenales0Data as PlanData,
    '1': arenales1Data as PlanData,
    '2': arenales2Data as PlanData,
    '3': arenales3Data as PlanData
  },
  PineyroA: {
    '0': pineyroA0Data as PlanData,
    '1': pineyroA1Data as PlanData,
    '2': pineyroA2Data as PlanData,
    '3': pineyroA3Data as PlanData
  },
  PineyroB: {
    '0': pineyroB0Data as PlanData,
    '1': pineyroB1Data as PlanData,
    '2': pineyroB2Data as PlanData,
    '3': pineyroB3Data as PlanData
  },
  PineyroC: {
    '0': pineyroC0Data as PlanData,
    '1': pineyroC1Data as PlanData,
    '2': pineyroC2Data as PlanData,
    '3': pineyroC3Data as PlanData
  }
};
