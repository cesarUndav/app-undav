// hooks/usePlanZoom.ts
import { useCallback, useState, useRef } from 'react';
import { PlanData } from '../app/mapsConfig';
import { clamp01, bboxFromPoints, unionRects, rectCenter, fitRectScale, panForCenter } from '../lib/zoomMath';


export type ZoomParams = { key: string; zoom: number; x: number; y: number } | null;

type UsePlanZoomArgs = {
  planData: PlanData;
  floors: { key: string; SvgComponent: React.ComponentType<any> }[];
  floorIndex: number;
  mapId: string;
  /** Padding del encuadre general (Ver todo) */
  fitPadding?: number;
  /** Padding para foco de aula / guía (0..1) */
  focusPadding?: number;
  /** “Radio” en unidades de canvas para enfocar el punto guía (mitad de ancho/alto en canvas) */
  guideRadius?: number;                  
  fitMode?: 'canvas' | 'content';
  minScale?: number;
  maxScale?: number;
};

const DEFAULT_MIN = 0.3;
const DEFAULT_MAX = 7.5;

export function usePlanZoom({
  planData,
  floors,
  floorIndex,
  mapId,
  fitPadding = 0.1,
  focusPadding = 0.18,
  guideRadius = 90,                      
  fitMode = 'canvas',
  minScale = DEFAULT_MIN,
  maxScale = DEFAULT_MAX,
}: UsePlanZoomArgs) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [zoomParams, setZoomParams] = useState<ZoomParams>(null);

  const revRef = useRef(0);
  const focusRevRef = useRef(0);

  const onLayoutBox = useCallback((w: number, h: number) => {
    setBox((prev) => (prev.w !== w || prev.h !== h ? { w, h } : prev));
  }, []);

  const clamp = (v: number) => Math.max(minScale, Math.min(maxScale, v));
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const computeZoom = useCallback((zoneId: string) => {
    const zone: any = planData.zones.find((z) => z.id === zoneId);
    if (!zone || !box.w || !box.h) return null;

    // Si hay path válido, usar su bbox y unir con el del aula
    const hasPath = Array.isArray(zone.path) && zone.path.length >= 3;
    let rect = hasPath
      ? bboxFromPoints(zone.path)
      : bboxFromPoints(zone.points);

    if (hasPath && Array.isArray(zone.points) && zone.points.length >= 3) {
      rect = unionRects(rect, bboxFromPoints(zone.points));
    }

    // Si NO hay path, respetar center/radius si existen (como antes)
    if (!hasPath && Array.isArray(zone.center) && typeof zone.radius === 'number') {
      const [cx, cy] = zone.center;
      const r = Math.max(0, Number(zone.radius) || 0);
      const rectCenterRadius = {
        minX: cx - (r || (rect.maxX - rect.minX) / 2),
        maxX: cx + (r || (rect.maxX - rect.minX) / 2),
        minY: cy - (r || (rect.maxY - rect.minY) / 2),
        maxY: cy + (r || (rect.maxY - rect.minY) / 2),
      };
      rect = rectCenterRadius;
    }

    const [cx, cy] = rectCenter(rect);
    const scale = fitRectScale(rect, box, focusPadding, minScale, maxScale);
    const { x, y } = panForCenter(cx, cy, box, scale);

    const modeTag = hasPath ? 'route' : 'zone';
    return { key: `${mapId}-${floors[floorIndex]?.key}-${zoneId}-${modeTag}`, zoom: scale, x, y };
  }, [planData, box, mapId, floors, floorIndex, focusPadding, minScale, maxScale]);



  const computePlanFit = useCallback(() => {
    if (!box.w || !box.h) return null;

    let minX = 0,
      minY = 0,
      maxX = planData.width,
      maxY = planData.height;

    if (fitMode === 'content') {
      if (!planData?.zones?.length) return null;
      const allX: number[] = [];
      const allY: number[] = [];
      for (const z of planData.zones) {
        for (const p of z.points) {
          allX.push(p[0]);
          allY.push(p[1]);
        }
      }
      if (!allX.length || !allY.length) return null;
      minX = Math.min(...allX);
      maxX = Math.max(...allX);
      minY = Math.min(...allY);
      maxY = Math.max(...allY);
    }

    const planW = Math.max(1, maxX - minX);
    const planH = Math.max(1, maxY - minY);

    const pad = clamp01(fitPadding);
    const effW = box.w * (1 - pad * 2);
    const effH = box.h * (1 - pad * 2);

    let scale = Math.min(effW / planW, effH / planH);
    scale = clamp(scale);

    const cx = minX + planW / 2;
    const cy = minY + planH / 2;

    const x = box.w / (2 * scale) - cx;
    const y = box.h / (2 * scale) - cy;

    return { key: `${mapId}-${floors[floorIndex]?.key}-plan-fit`, zoom: scale, x, y };
  }, [box, planData, fitMode, fitPadding, minScale, maxScale, mapId, floors, floorIndex]);

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

  /** NUEVO: foco en el punto guía del plano (planData.pathOrigin) */
  const focusGuidePoint = useCallback(() => {
    if (!box.w || !box.h) return;
    const origin = (planData as any).pathOrigin as [number, number] | undefined;
    if (!origin) return;

    const [cx, cy] = origin;

    const pad = clamp01(focusPadding);
    const effW = box.w * (1 - pad * 2);
    const effH = box.h * (1 - pad * 2);

    const halfW = Math.max(1, guideRadius);
    const halfH = Math.max(1, guideRadius);

    let scale = Math.min(effW / (2 * halfW), effH / (2 * halfH));
    scale = clamp(scale);

    const x = box.w / (2 * scale) - cx;
    const y = box.h / (2 * scale) - cy;

    const key = `${mapId}-${floors[floorIndex]?.key}-guide`;
    focusRevRef.current += 1;
    setZoomParams({ key: `${key}-g${focusRevRef.current}`, zoom: scale, x, y });
  }, [box, planData, focusPadding, guideRadius, minScale, maxScale, mapId, floors, floorIndex]);

  return { box, onLayoutBox, zoomParams, setZoomParams, fitAll, focusZone, focusGuidePoint };
}
