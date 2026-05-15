// components/FloorBadgeControls.tsx
import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import CustomText from './CustomText';
import { colors, floorBadgeStyles } from '../theme/mapStyles';

type Props = {
  floorIndex: number;
  maxFloors: number;
  onPrev: () => void;
  onNext: () => void;
  bottomY?: number;

  // Coachmark ref (wrapper completo)
  coachmarkRef?: React.Ref<any>;
};

const HIT = { top: 10, right: 10, bottom: 10, left: 10 };

// Iconos
const ArrowUp = ({ disabled }: { disabled?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Polyline
      points="6,14 12,8 18,14"
      fill="none"
      stroke={disabled ? colors.inactive : colors.arrowActive}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowDown = ({ disabled }: { disabled?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Polyline
      points="6,10 12,16 18,10"
      fill="none"
      stroke={disabled ? colors.inactive : colors.arrowActive}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

function FloorBadgeControls({
  floorIndex,
  maxFloors,
  onPrev,
  onNext,
  bottomY,
  coachmarkRef,
}: Props) {
  const canDown = floorIndex > 0;
  const canUp = floorIndex < maxFloors - 1;

  // === chevrons de tamaño y separación constantes ===
  const CHEVRON_STEP = 8;
  const CHEVRON_BOTTOM_Y = bottomY ?? 78;
  const chevrons = Math.max(0, maxFloors - 1);

  // idxFromBottom: 0 = abajo … (chevrons - 1) = arriba
  const yForChevron = (idxFromBottom: number) =>
    CHEVRON_BOTTOM_Y - idxFromBottom * CHEVRON_STEP;

  const highlightTop = floorIndex === maxFloors - 1;
  const highlightChevronIndexFromBottom = floorIndex;

  return (
    <View ref={coachmarkRef} style={styles.wrap} pointerEvents="box-none">
      {/* CÁPSULA TRANSLÚCIDA */}
      <View style={floorBadgeStyles.capsule} pointerEvents="box-none">
        {/* Subir */}
        <Pressable
          onPress={onNext}
          disabled={!canUp}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Subir piso"
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          style={({ pressed }) => [
            floorBadgeStyles.circleBtnBase,
            styles.circleBtnPos,
            !canUp && floorBadgeStyles.circleBtnDisabled,
            pressed && canUp && floorBadgeStyles.circleBtnPressed,
          ]}
        >
          <ArrowUp disabled={!canUp} />
        </Pressable>

        {/* Icono + etiqueta */}
        <View style={styles.badgeBlock} pointerEvents="none">
          <Svg width={56} height={76} viewBox="0 0 100 100">
            {/* Rombo (piso superior) */}
            <Polygon
              points="50,32 80,52 50,72 20,52"
              fill="none"
              stroke={highlightTop ? colors.active : colors.inactive}
              strokeWidth={highlightTop ? 5 : 3}
            />
            {/* Chevrons con paso fijo */}
            {Array.from({ length: chevrons }).map((_, i) => {
              const y = yForChevron(i);
              const active = !highlightTop && i === highlightChevronIndexFromBottom;
              return (
                <Polyline
                  key={`ch-${i}`}
                  points={`20,${y} 50,${y + 20} 80,${y}`}
                  fill="none"
                  stroke={active ? colors.active : colors.inactive}
                  strokeWidth={active ? 5 : 3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}
          </Svg>
          <CustomText style={floorBadgeStyles.label}>
            {floorIndex === 0 ? 'P.B.' : `Piso ${floorIndex}`}
          </CustomText>
        </View>

        {/* Bajar */}
        <Pressable
          onPress={onPrev}
          disabled={!canDown}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Bajar piso"
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
          style={({ pressed }) => [
            floorBadgeStyles.circleBtnBase,
            !canDown && floorBadgeStyles.circleBtnDisabled,
            pressed && canDown && floorBadgeStyles.circleBtnPressed,
          ]}
        >
          <ArrowDown disabled={!canDown} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'center',
  },
  circleBtnPos: {
    marginBottom: -20,
  },
  badgeBlock: {
    alignItems: 'center',
    marginVertical: 6,
  },
});

export default memo(FloorBadgeControls);
