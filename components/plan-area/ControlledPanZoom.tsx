// components/plan-area/ControlledPanZoom.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, G } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { panZoomStyles } from '../../theme/panZoomStyles';

import { usePanGesture } from '../gestures/usePanGesture';
import { usePinchGesture } from '../gestures/usePinchGesture';
import { useTapGesture } from '../gestures/useTapGesture';

import type { CanvasPoint, PanZoomBaseProps, Transform } from './panZoomTypes';
import {
  DEFAULT_MAX_SCALE,
  DEFAULT_MIN_SCALE,
} from './panZoomConstants';

type Props = PanZoomBaseProps & {
  onTransformChange?: (t: Transform) => void;

  enablePan?: boolean;
  enablePinch?: boolean;

  onGestureStart?: () => void;
  onGestureEnd?: () => void;
};

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
  minScale = DEFAULT_MIN_SCALE,
  maxScale = DEFAULT_MAX_SCALE,
  enablePan = true,
  enablePinch = true,
  onGestureStart,
  onGestureEnd,
  children,
}: Props) {
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

  const tap = useTapGesture({
    tx,
    ty,
    zoom,
    onTapCanvas: onTapCanvas as ((pt: CanvasPoint) => void) | undefined,
  });

  const composed = useMemo(
    () => Gesture.Exclusive(Gesture.Simultaneous(pan, pinch), tap),
    [tap, pan, pinch]
  );

  const transform = useMemo(
    () => `matrix(${zoom} 0 0 ${zoom} ${tx} ${ty})`,
    [zoom, tx, ty]
  );

  return (
    <View
      style={[panZoomStyles.wrapper, { width: containerW, height: containerH }]}
      renderToHardwareTextureAndroid
    >
      <GestureDetector gesture={composed}>
        <View style={StyleSheet.absoluteFill} collapsable={false}>
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

export default React.memo(ControlledPanZoomImpl);