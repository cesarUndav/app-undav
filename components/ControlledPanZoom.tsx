import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { usePanGesture } from './gestures/usePanGesture';
import { usePinchGesture } from './gestures/usePinchGesture';
import { useTapGesture } from './gestures/useTapGesture';

type Transform = { zoom: number; x: number; y: number };

type Props = {
  width: number; height: number;
  containerW: number; containerH: number;
  zoom: number; x: number; y: number; // pre-scale
  onTransformChange?: (t: Transform) => void;
  onTapCanvas?: (pt: { cx: number; cy: number }) => void;
  minScale?: number; maxScale?: number;
  enablePan?: boolean; enablePinch?: boolean;
  onGestureStart?: () => void; onGestureEnd?: () => void;
  children: React.ReactNode;
};

const DEFAULT_MIN = 0.5;
const DEFAULT_MAX = 2.5;

function ControlledPanZoomImpl({
  width, height,
  containerW, containerH,
  zoom, x, y,
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
  // translate en px (post-scale)
  const tx = zoom * x;
  const ty = zoom * y;

  // Gestos
  const pan = usePanGesture({
    enabled: enablePan,
    zoom, x, y,
    onTransformChange, onGestureStart, onGestureEnd,
  });

  const pinch = usePinchGesture({
    enabled: enablePinch,
    zoom, x, y,
    containerW, containerH,
    minScale, maxScale,
    onTransformChange, onGestureStart, onGestureEnd,
  });

  const tap = useTapGesture({ tx, ty, zoom, onTapCanvas });

  // Tap tiene prioridad; si no hay tap, se permite pan+pinch simultáneo
  const composed = useMemo(
    () => Gesture.Race(tap, Gesture.Simultaneous(pan, pinch)),
    [tap, pan, pinch]
  );

  return (
    <View style={[styles.wrapper, { width: containerW, height: containerH }]}>
      <GestureDetector gesture={composed}>
        <View style={{ width: containerW, height: containerH }}>
          <Svg width={containerW} height={containerH} viewBox={`0 0 ${containerW} ${containerH}`}>
            <G transform={`translate(${tx}, ${ty}) scale(${zoom})`}>
              <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {children}
              </Svg>
            </G>
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
});

export default React.memo(ControlledPanZoomImpl);
