// components/gestures/usePanGesture.ts

import { useEffect, useMemo, useRef } from 'react';
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
    zoom,
    x,
    y,
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

  const z0Ref = useRef(zoom);
  const x0Ref = useRef(x);
  const y0Ref = useRef(y);

  const pan = useMemo(() => {
    const g = Gesture.Pan()
      .runOnJS(true)
      .enabled(enabled);

    if (!enabled) return g;

    return g
      .maxPointers(1)
      .minDistance(8)
      .onBegin(() => {
        z0Ref.current = zoomRef.current;
        x0Ref.current = xRef.current;
        y0Ref.current = yRef.current;
        onGestureStartRef.current?.();
      })
      .onUpdate((e) => {
        const cb = onTransformChangeRef.current;
        if (!cb) return;

        const z0 = z0Ref.current || 1;
        const nx = x0Ref.current + e.translationX / z0;
        const ny = y0Ref.current + e.translationY / z0;

        cb({
          zoom: zoomRef.current,
          x: nx,
          y: ny,
        });
      })
      .onFinalize(() => {
        onGestureEndRef.current?.();
      });
  }, [enabled]);

  return pan;
}