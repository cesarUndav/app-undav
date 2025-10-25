import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';

export function useTapGesture(opts: {
  tx: number;     // translateX en px (post-scale)
  ty: number;     // translateY en px
  zoom: number;   // escala actual
  onTapCanvas?: (pt: { cx: number; cy: number }) => void;
}) {
  const { tx, ty, zoom, onTapCanvas } = opts;

  const tap = useMemo(() => {
    return Gesture.Tap()
      .maxDistance(8)
      .numberOfTaps(1)
      .onEnd((e, success) => {
        if (!success || !onTapCanvas) return;
        // pantalla → canvas (invertir translate+scale)
        const cx = (e.x - tx) / zoom;
        const cy = (e.y - ty) / zoom;
        onTapCanvas({ cx, cy });
      });
  }, [tx, ty, zoom, onTapCanvas]);

  return tap;
}
