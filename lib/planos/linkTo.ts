// lib/planos/linkTo.ts
import type { BuildingKey, FloorKey } from '../../app/mapsConfig';

export type LinkTo = { building: BuildingKey; floor: FloorKey | string | number };

export function hasLinkTo(z: any): z is { linkTo: LinkTo } {
  return z && typeof z === 'object' && 'linkTo' in z && z.linkTo;
}
