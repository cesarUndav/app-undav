import { useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';

type Transform = { zoom: number; x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

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
    zoom, x, y,
    containerW, containerH,
    minScale = 0.5, maxScale = 2.5,
    onTransformChange,
    onGestureStart, onGestureEnd,
  } = opts;

  // refs anclados al comienzo del gesto
  const z0Ref = useRef(zoom);
  const x0Ref = useRef(x);
  const y0Ref = useRef(y);
  const pivotPxRef = useRef<{ x: number; y: number } | null>(null);

  const pinch = useMemo(() => {
    if (!enabled) return Gesture.Pinch().enabled(false);

    return Gesture.Pinch()
      .onBegin((e) => {
        z0Ref.current = zoom;
        x0Ref.current = x;
        y0Ref.current = y;
        pivotPxRef.current = { x: e.focalX, y: e.focalY };
        onGestureStart?.();
      })
      .onUpdate((e) => {
        if (!onTransformChange) return;

        const z0 = z0Ref.current;
        const x0 = x0Ref.current;
        const y0 = y0Ref.current;

        // nueva escala (clamp)
        const z1 = clamp(z0 * (e.scale ?? 1), minScale, maxScale);

        const anchor = pivotPxRef.current ?? { x: containerW / 2, y: containerH / 2 };
        // punto del canvas bajo el ancla al iniciar
        const c0x = anchor.x / z0 - x0;
        const c0y = anchor.y / z0 - y0;

        // nuevo pan para mantener c0 bajo el ancla
        const nx = anchor.x / z1 - c0x;
        const ny = anchor.y / z1 - c0y;

        onTransformChange({ zoom: z1, x: nx, y: ny });
      })
      .onFinalize(() => {
        pivotPxRef.current = null;
        onGestureEnd?.();
      });
  }, [
    enabled,
    zoom, x, y,
    containerW, containerH,
    minScale, maxScale,
    onTransformChange,
    onGestureStart, onGestureEnd,
  ]);

  return pinch;
}
