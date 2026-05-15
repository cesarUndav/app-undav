// ==============================
// File: hooks/usePlanAreaAnimation.ts
// ==============================
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ZoomParams } from './usePlanZoom';

/**
 * Interpola pan/zoom en pre-scale units (mismo contrato que usePlanZoom).
 * - Pasa valores intermedios en `view` para que el viewer los aplique cuadro a cuadro.
 * - Idempotente: si el target no cambia, no reinicia.
 * - Si llega un nuevo target durante la animación, encadena desde el estado actual.
 */
export function usePlanAreaAnimation(
  initialTarget: ZoomParams,
  options?: {
    durationMs?: number;        // default 200
    easing?: (t: number) => number; // default easeInOutCubic
  }
) {
  const durationMs = options?.durationMs ?? 600;
  const ease = options?.easing ?? easeInOutCubic;

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Estado animado visible por el componente
  const [view, setView] = useState<ZoomParams>(initialTarget ?? null);
  const [isAnimating, setAnimating] = useState(false);

  // “Desde” y “hacia” para interpolar
  const fromRef = useRef<ZoomParams>(initialTarget ?? null);
  const toRef = useRef<ZoomParams>(initialTarget ?? null);

  // Firma para evitar reinicios innecesarios
  const sigOf = (z: ZoomParams) => (z ? `${z.key}|${num(z.x)}|${num(z.y)}|${num(z.zoom)}` : 'null');
  const lastAppliedSigRef = useRef<string>(sigOf(initialTarget ?? null));

  // Setter público para nuevo target
  const setTarget = useCallback((target: ZoomParams) => {
    const newSig = sigOf(target);
    if (newSig === lastAppliedSigRef.current) return; // no-op

    // Si hay animación en curso, partimos desde el estado actual (view)
    fromRef.current = view ?? target;
    toRef.current = target;

    lastAppliedSigRef.current = newSig;
    startTimeRef.current = performance.now();
    setAnimating(!!target);

    // Cancela RAF anterior y arranca uno nuevo
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Si el hook se monta con un target inicial
  useEffect(() => {
    if (initialTarget) setTarget(initialTarget);
    // no añadimos setTarget a deps para no reiniciar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Limpieza
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tick = (now: number) => {
    const from = fromRef.current;
    const to = toRef.current;

    // Si no hay target, finalizamos
    if (!to) {
      setAnimating(false);
      rafRef.current = null;
      return;
    }

    const start = startTimeRef.current;
    const t = clamp01((now - start) / durationMs);
    const k = ease(t);

    const next = lerpZoom(from ?? to, to, k);

    setView(next);

    if (t < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Final exacto: asegurar key del destino
      setView(to);
      setAnimating(false);
      rafRef.current = null;
    }
  };

  return { view, setTarget, isAnimating };
}

/* ---------- helpers ---------- */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpZoom(from: NonNullable<ZoomParams>, to: NonNullable<ZoomParams>, t: number): NonNullable<ZoomParams> {
  // Mantener la key del destino durante la animación para que el viewer no remountee
  return {
    key: to.key,
    zoom: lerp(from.zoom, to.zoom, t),
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
  };
}

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function num(n: unknown) {
  return typeof n === 'number' ? Number(n.toFixed(4)) : String(n);
}
