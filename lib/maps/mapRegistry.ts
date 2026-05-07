// lib/maps/mapRegistry.ts

import { BuildingKey, FloorEntry } from './types';

import {
  Espana0,
  Arenales0,
  Arenales1,
  Arenales2,
  Arenales3,
  Arenales4,
  Arenales5,
  PineyroA0,
  PineyroA1,
  PineyroA2,
  PineyroA3,
  PineyroB0,
  PineyroB1,
  PineyroB2,
  PineyroC0,
  PineyroC1,
  PineyroC2,
} from './basePlans';

export const edificios: Record<BuildingKey, { label: string; floors: FloorEntry[] }> = {
  Espana: {
    label: 'Sede España',
    floors: [{ key: '0', BaseMapComponent: Espana0 }],
  },
  Arenales: {
    label: 'Sede Arenales',
    floors: [
      { key: '0', BaseMapComponent: Arenales0 },
      { key: '1', BaseMapComponent: Arenales1 },
      { key: '2', BaseMapComponent: Arenales2 },
      { key: '3', BaseMapComponent: Arenales3 },
      { key: '4', BaseMapComponent: Arenales4 },
      { key: '5', BaseMapComponent: Arenales5 },
    ],
  },
  PineyroA: {
    label: 'Sede Piñeyro Cuerpo A',
    floors: [
      { key: '0', BaseMapComponent: PineyroA0 },
      { key: '1', BaseMapComponent: PineyroA1 },
      { key: '2', BaseMapComponent: PineyroA2 },
      { key: '3', BaseMapComponent: PineyroA3 },
    ],
  },
  PineyroB: {
    label: 'Sede Piñeyro Cuerpo B',
    floors: [
      { key: '0', BaseMapComponent: PineyroB0 },
      { key: '1', BaseMapComponent: PineyroB1 },
      { key: '2', BaseMapComponent: PineyroB2 },
    ],
  },
  PineyroC: {
    label: 'Sede Piñeyro Cuerpo C',
    floors: [
      { key: '0', BaseMapComponent: PineyroC0 },
      { key: '1', BaseMapComponent: PineyroC1 },
      { key: '2', BaseMapComponent: PineyroC2 },
    ],
  },
};