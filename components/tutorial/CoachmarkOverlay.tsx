// components/tutorial/CoachmarkOverlay.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CoachmarkStep, WindowRect } from '../../types/tutorial';

import { SpotlightMask } from './overlay/SpotlightMask';
import {
  computePaddedRect,
  computeSpotlight,
  computeTooltipMaxWidth,
  computeTooltipPosition,
  type TooltipSize,
} from './overlay/geometry';
import { TooltipCard } from './overlay/TooltipCard';

type Props = {
  visible: boolean;
  step: CoachmarkStep | null;
  index: number;
  total: number;
  rect: WindowRect | null;
  allowOverlayTap: boolean;

  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onRequestClose: () => void;
};

export function CoachmarkOverlay(props: Props) {
  const { visible, step, index, total, rect } = props;
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const [tooltipSize, setTooltipSize] = useState<TooltipSize>({ width: 280, height: 140 });

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    if (!visible) return;
    fade.setValue(0);
    scale.setValue(0.98);

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [visible, fade, scale, index]);

  const isLast = index === total - 1;

  const paddedRect = useMemo(() => computePaddedRect(rect, step, W, H), [rect, step, W, H]);

  const tooltipMaxWidth = useMemo(() => computeTooltipMaxWidth(step, W), [step, W]);

  const tooltipPosition = useMemo(
    () =>
      computeTooltipPosition({
        paddedRect,
        step,
        tooltipSize,
        W,
        H,
        insets,
      }),
    [paddedRect, step, tooltipSize, W, H, insets]
  );

  const spotlight = useMemo(() => computeSpotlight(paddedRect, step), [paddedRect, step]);

  const handleOverlayPress = () => {
    if (!visible) return;
    if (!props.allowOverlayTap) return;
    props.onNext();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.root} accessibilityViewIsModal={false}>
        {/* Overlay clickable */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleOverlayPress}
          accessible={false}
          importantForAccessibility="no"
        >
          {/* SVG overlay (sin pointer events) */}
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <SpotlightMask width={W} height={H} spotlight={spotlight} />
          </View>
        </Pressable>

        {/* Tooltip */}
        <TooltipCard
          text={step?.text ?? ''}
          index={index}
          total={total}
          isLast={isLast}
          top={tooltipPosition.top}
          left={tooltipPosition.left}
          maxWidth={tooltipMaxWidth}
          fade={fade}
          scale={scale}
          allowOverlayTap={props.allowOverlayTap}
          onPrev={props.onPrev}
          onNext={props.onNext}
          onSkip={props.onSkip}
          onMeasured={(size) => {
            // Evitar updates ruidosos
            if (
              Math.abs(size.width - tooltipSize.width) > 1 ||
              Math.abs(size.height - tooltipSize.height) > 1
            ) {
              setTooltipSize(size);
            }
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
