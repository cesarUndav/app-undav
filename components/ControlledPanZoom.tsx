// ControlledPanZoom.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { usePanGesture } from './gestures/usePanGesture';
import { usePinchGesture } from './gestures/usePinchGesture';
import { useTapGesture } from './gestures/useTapGesture';

type Transform = { zoom: number; x: number; y: number };

type Props = {
  /** Tamaño lógico del plano (en unidades del plano). Se mantiene por compatibilidad. */
  width: number;
  height: number;

  /** Tamaño del viewport (en px) */
  containerW: number;
  containerH: number;

  /** Transformación en unidades del plano (x,y pre-scale) */
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

  /**
   * Capas SVG del plano.
   * Recomendación: que sean <G>/<Path>/<Polygon> (evitar <Svg> anidados con estilos absolute).
   */
  children: React.ReactNode;
};

const DEFAULT_MIN = 0.5;
const DEFAULT_MAX = 2.5;

function ControlledPanZoomImpl({
  // width/height se mantienen por API; no son necesarios para render
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
  // x/y están en unidades del plano (pre-scale)
  // Para aplicar la traslación como "post-scale" (en px del viewport), multiplicamos por zoom.
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

  // Tap tiene prioridad; si no hay tap, se permite pan+pinch simultáneo
  const composed = useMemo(
    () => Gesture.Race(tap, Gesture.Simultaneous(pan, pinch)),
    [tap, pan, pinch]
  );

  // matrix(a b c d e f) => (x',y') = (a*x + c*y + e, b*x + d*y + f)
  // Queremos scale(zoom) + translate(tx,ty) en coordenadas del viewport.
  const transform = useMemo(
    () => `matrix(${zoom} 0 0 ${zoom} ${tx} ${ty})`,
    [zoom, tx, ty]
  );

  return (
    <View style={[styles.wrapper, { width: containerW, height: containerH }]}>
      <GestureDetector gesture={composed}>
        <Svg width={containerW} height={containerH} viewBox={`0 0 ${containerW} ${containerH}`}>
          {/* 
            Importante (Android): mantener TODAS las capas dentro del MISMO <G transform>.
            Evitar overlays como <Svg style={absoluteFill}> porque pueden “salirse” del transform.
          */}
          <G transform={transform}>{children}</G>
        </Svg>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
});

export default React.memo(ControlledPanZoomImpl);
