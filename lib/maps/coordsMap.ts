import { BuildingKey, FloorKey, PlanData } from './types';

// JSON PlanData
import espana0Data from '../../assets/maps/Espana/espana0.json';

import arenales0Data from '../../assets/maps/Arenales/arenales0.json';
import arenales1Data from '../../assets/maps/Arenales/arenales1.json';
import arenales2Data from '../../assets/maps/Arenales/arenales2.json';
import arenales3Data from '../../assets/maps/Arenales/arenales3.json';
import arenales4Data from '../../assets/maps/Arenales/arenales4.json';
import arenales5Data from '../../assets/maps/Arenales/arenales5.json';

import pineyroA0Data from '../../assets/maps/PineyroA/pineyroA0.json';
import pineyroA1Data from '../../assets/maps/PineyroA/pineyroA1.json';
import pineyroA2Data from '../../assets/maps/PineyroA/pineyroA2.json';
import pineyroA3Data from '../../assets/maps/PineyroA/pineyroA3.json';

import pineyroB0Data from '../../assets/maps/PineyroB/pineyroB0.json';
import pineyroB1Data from '../../assets/maps/PineyroB/pineyroB1.json';
import pineyroB2Data from '../../assets/maps/PineyroB/pineyroB2.json';

import pineyroC0Data from '../../assets/maps/PineyroC/pineyroC0.json';
import pineyroC1Data from '../../assets/maps/PineyroC/pineyroC1.json';
import pineyroC2Data from '../../assets/maps/PineyroC/pineyroC2.json';

function toPlanData(d: any): PlanData {
  const pathOrigin =
    Array.isArray(d?.pathOrigin) && d.pathOrigin.length >= 2
      ? ([Number(d.pathOrigin[0]), Number(d.pathOrigin[1])] as [number, number])
      : undefined;

  return {
    width: Number(d?.width ?? 0),
    height: Number(d?.height ?? 0),
    zones: Array.isArray(d?.zones) ? d.zones : [],
    pathOrigin,
  };
}

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