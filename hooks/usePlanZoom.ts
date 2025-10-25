// ==============================
// File: hooks/usePlanZoom.ts
// ==============================
import { useCallback, useRef, useState } from 'react';
import { PlanData } from '../app/mapsConfig';

export type ZoomParams = { key: string; zoom: number; x: number; y: number } | null;

type UsePlanZoomArgs = {
  planData: PlanData;
  floors: { key: string; SvgComponent: React.ComponentType<any> }[];
  floorIndex: number;
  mapId: string;

  /** Padding del encuadre general (Ver todo). 0..1 */
  fitPadding?: number;          // default: 0.10
  /** Padding del foco de aula (margen alrededor). 0..1  */
  focusPadding?: number;        // default: 0.18
  /** Qué encuadrar en "Ver todo": canvas completo o contenido (zonas). */
  fitMode?: 'canvas' | 'content'; // default: 'canvas'

  /** Límites del zoom. */
  minScale?: number;            // default: 0.5
  maxScale?: number;            // default: 2.5
};

const DEFAULT_MIN = 0.5;
const DEFAULT_MAX = 2.5;

export function usePlanZoom({
  planData,
  floors,
  floorIndex,
  mapId,
  fitPadding = 0.10,
  focusPadding = 0.18,
  fitMode = 'canvas',
  minScale = DEFAULT_MIN,
  maxScale = DEFAULT_MAX,
}: UsePlanZoomArgs) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [zoomParams, setZoomParams] = useState<ZoomParams>(null);

  // Refs para remounts intencionales (cambios de key)
  const revRef = useRef(0);       // "Ver todo"
  const focusRevRef = useRef(0);  // Foco de aula

  // --------------------------
  // Helpers
  // --------------------------
  const clamp = (v: number) => Math.max(minScale, Math.min(maxScale, v));
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const safeBox = () => ({ w: Math.max(1, box.w), h: Math.max(1, box.h) });

  const bboxOfPoints = (points: [number, number][]) => {
    const xs = points.map(p => p[0]);
    const ys = points.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { minX, minY, maxX, maxY, w: Math.max(1, maxX - minX), h: Math.max(1, maxY - minY) };
  };

  // --------------------------
  // Layout box
  // --------------------------
  const onLayoutBox = useCallback((w: number, h: number) => {
    setBox(prev => (prev.w !== w || prev.h !== h ? { w, h } : prev));
  }, []);

  // --------------------------
  // Foco de zona (aula)
  // --------------------------
  const computeZoom = useCallback((zoneId: string) => {
    const zone: any = planData.zones.find(z => z.id === zoneId);
    const { w: cw, h: ch } = safeBox();
    if (!zone || !cw || !ch) return null;

    // bbox de zona (fallback)
    const bb = bboxOfPoints(zone.points as [number, number][]);

    // centro/radio (si existen, los usamos; si no, bbox)
    const hasCenter = Array.isArray(zone.center) && typeof zone.radius === 'number';
    const cx = hasCenter ? zone.center[0] : bb.minX + bb.w / 2;
    const cy = hasCenter ? zone.center[1] : bb.minY + bb.h / 2;
    const r = hasCenter ? Math.max(0, Number(zone.radius) || 0) : 0;
    const halfW = r > 0 ? r : bb.w / 2;
    const halfH = r > 0 ? r : bb.h / 2;

    // padding de foco (margen alrededor)
    const pad = clamp01(focusPadding);
    const effW = cw * (1 - pad * 2);
    const effH = ch * (1 - pad * 2);

    let scale = Math.min(effW / (2 * halfW), effH / (2 * halfH));
    scale = clamp(scale);

    // pan en unidades del canvas (pre-scale)
    const x = cw / (2 * scale) - cx;
    const y = ch / (2 * scale) - cy;

    return { key: `${mapId}-${floors[floorIndex]?.key}-${zoneId}`, zoom: scale, x, y };
  }, [planData, box, mapId, floors, floorIndex, focusPadding, minScale, maxScale]);

  // --------------------------
  // Encadre general (Ver todo)
  // --------------------------
  const computePlanFit = useCallback(() => {
    const { w: cw, h: ch } = safeBox();

    // Elegir bbox en base a fitMode
    let minX = 0, minY = 0, maxX = planData.width, maxY = planData.height;

    if (fitMode === 'content') {
      if (!planData?.zones?.length) return null;
      const all: [number, number][] = [];
      for (const z of planData.zones) {
        for (const p of z.points) all.push([p[0], p[1]]);
      }
      if (!all.length) return null;
      const bb = bboxOfPoints(all);
      minX = bb.minX; maxX = bb.maxX;
      minY = bb.minY; maxY = bb.maxY;
    }

    const planW = Math.max(1, maxX - minX);
    const planH = Math.max(1, maxY - minY);

    const pad = clamp01(fitPadding);
    const effW = cw * (1 - pad * 2);
    const effH = ch * (1 - pad * 2);

    let scale = Math.min(effW / planW, effH / planH);
    scale = clamp(scale);

    const cx = minX + planW / 2;
    const cy = minY + planH / 2;

    const x = cw / (2 * scale) - cx;
    const y = ch / (2 * scale) - cy;

    return { key: `${mapId}-${floors[floorIndex]?.key}-plan-fit`, zoom: scale, x, y };
  }, [box, planData, fitMode, fitPadding, minScale, maxScale, mapId, floors, floorIndex]);

  // --------------------------
  // Acciones públicas
  // --------------------------
  const fitAll = useCallback(() => {
    const fit = computePlanFit();
    if (fit) {
      revRef.current += 1;
      setZoomParams({ ...fit, key: `${fit.key}-r${revRef.current}` });
    }
  }, [computePlanFit]);

  const focusZone = useCallback((zoneId: string) => {
    const zp = computeZoom(zoneId);
    if (zp) {
      focusRevRef.current += 1;
      setZoomParams({ ...zp, key: `${zp.key}-f${focusRevRef.current}` });
    }
  }, [computeZoom]);

  return { box, onLayoutBox, zoomParams, setZoomParams, fitAll, focusZone };
}
