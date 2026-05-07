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