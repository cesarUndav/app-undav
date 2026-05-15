// lib/hitTest.ts
import { pointInPolygon, Pt } from '../lib/zoomMath';

type ZoneLite = { id: string; points: number[][] };

/** Devuelve el id de la zona que contiene (x,y) o null si no hay hit.
 *  Recorre de atrás hacia adelante por si hay superposiciones.
 */
export function hitTestZoneIdAtPoint(
  zones: ZoneLite[],
  x: number,
  y: number
): string | null {
  for (let i = zones.length - 1; i >= 0; i--) {
    const z = zones[i];
    const pts = (z.points || []) as Pt[];
    if (pts.length >= 3 && pointInPolygon(x, y, pts)) {
      return z.id;
    }
  }
  return null;
}

/** Devuelve la zona (objeto) que contiene (x,y) o null si no hay hit. */
export function hitTestZoneAtPoint<T extends ZoneLite>(
  zones: T[],
  x: number,
  y: number
): T | null {
  for (let i = zones.length - 1; i >= 0; i--) {
    const z = zones[i];
    const pts = (z.points || []) as Pt[];
    if (pts.length >= 3 && pointInPolygon(x, y, pts)) {
      return z;
    }
  }
  return null;
}
