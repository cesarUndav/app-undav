// ControlledPanZoom.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { usePanGesture } from '../gestures/usePanGesture';
import { usePinchGesture } from '../gestures/usePinchGesture';
import { useTapGesture } from '../gestures/useTapGesture';

type Transform = { zoom: number; x: number; y: number };

type Props = {
  width: number;
  height: number;
  containerW: number;
  containerH: number;

  zoom: number;
  x: number;
  y: number;

  onTransformChange?: (t: Transform) => void;
  onTapCanvas?: (pt: { cx: number; cy: number }) => void;

  minScale?: number;
  maxScale?: number;
  enablePan?: boolean;
  enablePinch?: boolean;

  onGestureStart?: () => void;
  onGestureEnd?: () => void;

  children: React.ReactNode;
};

const DEFAULT_MIN = 0.5;
const DEFAULT_MAX = 2.5;

function ControlledPanZoomImpl({
  width: _width,
  height: _height,
  containerW,
  containerH,
  zoom,
  x,
  y,
  onTransformChange,
  onTapCanvas,
  minScale = DEFAULT_MIN,
  maxScale = DEFAULT_MAX,
  enablePan = true,
  enablePinch = true,
  onGestureStart,
  onGestureEnd,
  children,
}: Props) {
  // x/y están en unidades del plano. Traslación final en px: zoom * x/y.
  const tx = zoom * x;
  const ty = zoom * y;

  const pan = usePanGesture({
    enabled: enablePan,
    zoom,
    x,
    y,
    onTransformChange,
    onGestureStart,
    onGestureEnd,
  });

  const pinch = usePinchGesture({
    enabled: enablePinch,
    zoom,
    x,
    y,
    containerW,
    containerH,
    minScale,
    maxScale,
    onTransformChange,
    onGestureStart,
    onGestureEnd,
  });

  const tap = useTapGesture({ tx, ty, zoom, onTapCanvas });

  // En Android: Exclusive(Simultaneous(pan,pinch), tap) suele evitar que el tap “gane” antes que el pinch.
  const composed = useMemo(
    () => Gesture.Exclusive(Gesture.Simultaneous(pan, pinch), tap),
    [tap, pan, pinch]
  );

  // Transform determinista (sin ambigüedad de orden): scale + translate.
  const transform = useMemo(
    () => `matrix(${zoom} 0 0 ${zoom} ${tx} ${ty})`,
    [zoom, tx, ty]
  );

  return (
    <View
      style={[styles.wrapper, { width: containerW, height: containerH }]}
      renderToHardwareTextureAndroid
    >
      <GestureDetector gesture={composed}>
        {/* Hijo View real para mejorar consistencia en Android */}
        <View style={StyleSheet.absoluteFill} collapsable={false}>
          {/* Evita que SVG/Polygons intercepten el pinch; los taps se manejan con onTapCanvas + hitTest */}
          <Svg
            pointerEvents="none"
            width={containerW}
            height={containerH}
            viewBox={`0 0 ${containerW} ${containerH}`}
          >
            <G transform={transform}>{children}</G>
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  // Para depuración en Android: evitar clip redondeado/overflow oculto aquí.
  wrapper: { backgroundColor: '#fff' },
});

export default React.memo(ControlledPanZoomImpl);
