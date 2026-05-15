// components/plan-area/ControlledPanZoomReanimated.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Svg, G } from 'react-native-svg';

import { panZoomStyles } from '../../theme/panZoomStyles';
import type { PanZoomBaseProps, Transform } from './panZoomTypes';
import {
  DEFAULT_MAX_SCALE,
  DEFAULT_MIN_SCALE,
  PAN_MIN_DISTANCE,
  SINGLE_POINTER,
  TAP_MAX_DISTANCE,
} from './panZoomConstants';

type Props = PanZoomBaseProps & {
  onTransformEnd?: (t: Transform) => void;
};

const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.max(min, Math.min(max, value));
};

export default function ControlledPanZoomReanimated({
  width,
  height,
  containerW,
  containerH,
  zoom,
  x,
  y,
  minScale = DEFAULT_MIN_SCALE,
  maxScale = DEFAULT_MAX_SCALE,
  onTransformEnd,
  onTapCanvas,
  children,
}: Props) {
  const z = useSharedValue(zoom);
  const px = useSharedValue(x);
  const py = useSharedValue(y);

  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const panStartZoom = useSharedValue(1);

  const pinchStartZoom = useSharedValue(1);
  const pinchBaseCx = useSharedValue(0);
  const pinchBaseCy = useSharedValue(0);

  React.useEffect(() => {
    z.value = zoom;
    px.value = x;
    py.value = y;
  }, [zoom, x, y, z, px, py]);

  const animatedStyle = useAnimatedStyle(() => {
    const tx = z.value * px.value;
    const ty = z.value * py.value;

    return {
      transformOrigin: '0px 0px',
      transform: [
        { translateX: tx },
        { translateY: ty },
        { scale: z.value },
      ],
    } as any;
  });

  const notifyTransformEnd = () => {
    'worklet';

    if (onTransformEnd) {
      runOnJS(onTransformEnd)({
        zoom: z.value,
        x: px.value,
        y: py.value,
      });
    }
  };

  const panGesture = Gesture.Pan()
    .maxPointers(SINGLE_POINTER)
    .minDistance(PAN_MIN_DISTANCE)
    .onBegin(() => {
      'worklet';

      panStartX.value = px.value;
      panStartY.value = py.value;
      panStartZoom.value = z.value || 1;
    })
    .onUpdate((e) => {
      'worklet';

      const currentZoom = panStartZoom.value || 1;

      px.value = panStartX.value + e.translationX / currentZoom;
      py.value = panStartY.value + e.translationY / currentZoom;
    })
    .onFinalize(() => {
      'worklet';
      notifyTransformEnd();
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin((e) => {
      'worklet';

      const currentZoom = z.value || 1;
      pinchStartZoom.value = currentZoom;

      const focalX =
        typeof e.focalX === 'number' && isFinite(e.focalX)
          ? e.focalX
          : containerW / 2;

      const focalY =
        typeof e.focalY === 'number' && isFinite(e.focalY)
          ? e.focalY
          : containerH / 2;

      pinchBaseCx.value = focalX / currentZoom - px.value;
      pinchBaseCy.value = focalY / currentZoom - py.value;
    })
    .onUpdate((e) => {
      'worklet';

      const scale =
        typeof e.scale === 'number' && isFinite(e.scale)
          ? e.scale
          : 1;

      const nextZoom = clamp(
        pinchStartZoom.value * scale,
        minScale,
        maxScale
      );

      const focalX =
        typeof e.focalX === 'number' && isFinite(e.focalX)
          ? e.focalX
          : containerW / 2;

      const focalY =
        typeof e.focalY === 'number' && isFinite(e.focalY)
          ? e.focalY
          : containerH / 2;

      z.value = nextZoom;
      px.value = focalX / nextZoom - pinchBaseCx.value;
      py.value = focalY / nextZoom - pinchBaseCy.value;
    })
    .onFinalize(() => {
      'worklet';
      notifyTransformEnd();
    });

  const tapGesture = Gesture.Tap()
    .maxDistance(TAP_MAX_DISTANCE)
    .onEnd((e, success) => {
      'worklet';

      if (!success || !onTapCanvas) return;

      const currentZoom = z.value || 1;

      const cx = e.x / currentZoom - px.value;
      const cy = e.y / currentZoom - py.value;

      runOnJS(onTapCanvas)({ cx, cy });
    });

  const composed = Gesture.Exclusive(
    Gesture.Simultaneous(panGesture, pinchGesture),
    tapGesture
  );

  return (
    <View
      style={[
        panZoomStyles.clippedWrapper,
        {
          width: containerW,
          height: containerH,
        },
      ]}
    >
      <GestureDetector gesture={composed}>
        <View style={StyleSheet.absoluteFill} collapsable={false}>
          <Animated.View
            style={[
              panZoomStyles.animatedLayer,
              {
                width,
                height,
              },
              animatedStyle,
            ]}
            collapsable={false}
          >
            <Svg
              pointerEvents="none"
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
            >
              <G>{children}</G>
            </Svg>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}