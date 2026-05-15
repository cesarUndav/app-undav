// components/gestures/usePinchGesture.ts

import { useEffect, useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';

type Transform = { zoom: number; x: number; y: number };

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export function usePinchGesture(opts: {
  enabled?: boolean;
  zoom: number;
  x: number;
  y: number;
  containerW: number;
  containerH: number;
  minScale?: number;
  maxScale?: number;
  onTransformChange?: (t: Transform) => void;
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}) {
  const {
    enabled = true,
    zoom,
    x,
    y,
    containerW,
    containerH,
    minScale = 0.5,
    maxScale = 2.5,
    onTransformChange,
    onGestureStart,
    onGestureEnd,
  } = opts;

  const zoomRef = useRef(zoom);
  const xRef = useRef(x);
  const yRef = useRef(y);
  const onTransformChangeRef = useRef(onTransformChange);
  const onGestureStartRef = useRef(onGestureStart);
  const onGestureEndRef = useRef(onGestureEnd);
  const wRef = useRef(containerW);
  const hRef = useRef(containerH);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    xRef.current = x;
  }, [x]);

  useEffect(() => {
    yRef.current = y;
  }, [y]);

  useEffect(() => {
    onTransformChangeRef.current = onTransformChange;
  }, [onTransformChange]);

  useEffect(() => {
    onGestureStartRef.current = onGestureStart;
  }, [onGestureStart]);

  useEffect(() => {
    onGestureEndRef.current = onGestureEnd;
  }, [onGestureEnd]);

  useEffect(() => {
    wRef.current = containerW;
  }, [containerW]);

  useEffect(() => {
    hRef.current = containerH;
  }, [containerH]);

  const z0Ref = useRef(zoom);
  const c0Ref = useRef<{ cx: number; cy: number } | null>(null);

  const pinch = useMemo(() => {
    const g = Gesture.Pinch()
      .runOnJS(true)
      .enabled(enabled);

    if (!enabled) return g;

    return g
      .onBegin((e) => {
        const z0 = zoomRef.current || 1;
        const x0 = xRef.current;
        const y0 = yRef.current;

        const fx = Number.isFinite(e.focalX) ? e.focalX : wRef.current / 2;
        const fy = Number.isFinite(e.focalY) ? e.focalY : hRef.current / 2;

        z0Ref.current = z0;

        c0Ref.current = {
          cx: fx / z0 - x0,
          cy: fy / z0 - y0,
        };

        onGestureStartRef.current?.();
      })
      .onUpdate((e) => {
        const cb = onTransformChangeRef.current;
        const base = c0Ref.current;

        if (!cb || !base) return;

        const z0 = z0Ref.current || 1;
        const scale = Number.isFinite(e.scale) ? e.scale : 1;
        const z1 = clamp(z0 * scale, minScale, maxScale);

        const fx = Number.isFinite(e.focalX) ? e.focalX : wRef.current / 2;
        const fy = Number.isFinite(e.focalY) ? e.focalY : hRef.current / 2;

        const nx = fx / z1 - base.cx;
        const ny = fy / z1 - base.cy;

        cb({
          zoom: z1,
          x: nx,
          y: ny,
        });
      })
      .onFinalize(() => {
        c0Ref.current = null;
        onGestureEndRef.current?.();
      });
  }, [enabled, minScale, maxScale]);

  return pinch;
}