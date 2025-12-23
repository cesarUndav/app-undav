import { useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';

type Transform = { zoom: number; x: number; y: number };

export function usePanGesture(opts: {
  enabled?: boolean;
  zoom: number;
  x: number;
  y: number;
  onTransformChange?: (t: Transform) => void;
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
}) {
  const {
    enabled = true,
    zoom, x, y,
    onTransformChange,
    onGestureStart, onGestureEnd,
  } = opts;

  // refs anclados al comienzo del gesto
  const z0Ref = useRef(zoom);
  const x0Ref = useRef(x);
  const y0Ref = useRef(y);

  const pan = useMemo(() => {
    if (!enabled) return Gesture.Pan().enabled(false);

    return Gesture.Pan()
      .minDistance(8) // no robe taps
      .onBegin(() => {
        z0Ref.current = zoom;
        x0Ref.current = x;
        y0Ref.current = y;
        onGestureStart?.();
      })
      .onUpdate((e) => {
        if (!onTransformChange) return;
        const z0 = z0Ref.current;
        const nx = x0Ref.current + e.translationX / z0;
        const ny = y0Ref.current + e.translationY / z0;
        onTransformChange({ zoom, x: nx, y: ny });
      })
      .onFinalize(() => {
        onGestureEnd?.();
      });
  }, [enabled, zoom, x, y, onTransformChange, onGestureStart, onGestureEnd]);

  return pan;
}
