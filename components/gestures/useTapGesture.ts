// components/gestures/useTapGesture.ts

import { useEffect, useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';

export function useTapGesture(opts: {
  tx: number;
  ty: number;
  zoom: number;
  onTapCanvas?: (pt: { cx: number; cy: number }) => void;
}) {
  const { tx, ty, zoom, onTapCanvas } = opts;

  const txRef = useRef(tx);
  const tyRef = useRef(ty);
  const zoomRef = useRef(zoom);
  const onTapCanvasRef = useRef(onTapCanvas);

  useEffect(() => {
    txRef.current = tx;
  }, [tx]);

  useEffect(() => {
    tyRef.current = ty;
  }, [ty]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    onTapCanvasRef.current = onTapCanvas;
  }, [onTapCanvas]);

  const tap = useMemo(() => {
    return Gesture.Tap()
      .runOnJS(true)
      .maxDistance(8)
      .numberOfTaps(1)
      .onEnd((e, success) => {
        if (!success) return;

        const cb = onTapCanvasRef.current;
        if (!cb) return;

        const z = zoomRef.current;
        const cx = (e.x - txRef.current) / z;
        const cy = (e.y - tyRef.current) / z;

        cb({ cx, cy });
      });
  }, []);

  return tap;
}