// lib/zoomMath.ts

export type Pt = [number, number];
export type Rect = { minX: number; minY: number; maxX: number; maxY: number };
export type Size = { w: number; h: number };

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const clamp01 = (v: number) => clamp(v, 0, 1);

/** Convierte [[x,y], ...] a "x,y x,y ..." para react-native-svg Polygon */
export function toPointsStr(pts: Pt[]): string {
  return pts.map((p) => p.join(',')).join(' ');
}

/** BBox de un conjunto de puntos (asume al menos 1 punto). */
export function bboxFromPoints(pts: Pt[]): Rect {
  let minX = pts[0][0], maxX = pts[0][0];
  let minY = pts[0][1], maxY = pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

/** BBox de varios polígonos (arrays de puntos). Ignora vacíos. */
export function bboxFromPolygons(polys: Pt[][]): Rect | null {
  const all: Pt[] = [];
  for (const p of polys) if (Array.isArray(p) && p.length) all.push(...p);
  return all.length ? bboxFromPoints(all) : null;
}

/** Unión de dos rectángulos. */
export function unionRects(a: Rect, b: Rect): Rect {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

export function rectSize(r: Rect): Size {
  return { w: Math.max(0, r.maxX - r.minX), h: Math.max(0, r.maxY - r.minY) };
}

export function rectCenter(r: Rect): Pt {
  return [r.minX + (r.maxX - r.minX) / 2, r.minY + (r.maxY - r.minY) / 2];
}

/**
 * Escala que ajusta rect dentro del viewport (box) con padding relativo 0..1,
 * limitado por minScale/maxScale.
 */
export function fitRectScale(
  rect: Rect,
  box: Size,
  padding: number,
  minScale: number,
  maxScale: number
): number {
  const pad = clamp01(padding);
  const effW = box.w * (1 - pad * 2);
  const effH = box.h * (1 - pad * 2);
  const { w, h } = rectSize(rect);
  const raw = Math.min(effW / Math.max(1, w), effH / Math.max(1, h));
  return clamp(raw, minScale, maxScale);
}

/** Pan pre-scale para centrar (cx, cy) en el viewport con scale dada. */
export function panForCenter(cx: number, cy: number, box: Size, scale: number): { x: number; y: number } {
  return {
    x: box.w / (2 * scale) - cx,
    y: box.h / (2 * scale) - cy,
  };
}

/** Hit-test punto dentro de polígono (odd-even rule). */
export function pointInPolygon(x: number, y: number, pts: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    const intersect = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Convierte number[][] genérico a Pt[] tipado (valida largo=2). */
export function asPtList(arr: unknown): Pt[] {
  if (!Array.isArray(arr)) return [];
  const out: Pt[] = [];
  for (const v of arr) {
    if (Array.isArray(v) && v.length >= 2 && Number.isFinite(v[0]) && Number.isFinite(v[1])) {
      out.push([Number(v[0]), Number(v[1])]);
    }
  }
  return out;
}
