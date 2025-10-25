// ==============================
// File: components/FloorBadgeControls.tsx
// ==============================
import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import CustomText from './CustomText';
import { colors, floorBadgeStyles } from '../theme/mapStyles';

type Props = {
  floorIndex: number;    // 0 = PB, 1 = Piso 1, ...
  maxFloors: number;     // total de plantas (1..4)
  onPrev: () => void;    // bajar piso
  onNext: () => void;    // subir piso
};

const HIT = { top: 10, right: 10, bottom: 10, left: 10 };

// --- Iconos chevron ---
const ArrowUp = ({ disabled }: { disabled?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Polyline
      points="6,14 12,8 18,14"
      fill="none"
      stroke={disabled ? colors.inactive : colors.active}
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
      stroke={disabled ? colors.inactive : colors.active}
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
}: Props) {
  const canDown = floorIndex > 0;
  const canUp = floorIndex < maxFloors - 1;

  // Cantidad de chevrons (máx 3 → 4 plantas soportadas)
  const chevrons = Math.max(0, Math.min(3, maxFloors - 1));

  // y de cada chevron (de abajo hacia arriba)
  const bottomY = 78;
  const step = 8;
  const yForChevron = (idxFromBottom: number) => bottomY - idxFromBottom * step;

  // Qué resaltar
  const highlightTop = floorIndex === maxFloors - 1;
  const highlightChevronIndexFromBottom = floorIndex;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {/* Subir */}
      <TouchableOpacity
        onPress={onNext}
        disabled={!canUp}
        style={[
          floorBadgeStyles.circleBtnBase,
          styles.circleBtnPos,
          !canUp && floorBadgeStyles.circleBtnDisabled,
        ]}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="Subir piso"
      >
        <ArrowUp disabled={!canUp} />
      </TouchableOpacity>

      {/* Icono + etiqueta */}
      <View style={styles.badgeBlock} pointerEvents="none">
        <Svg width={56} height={56} viewBox="0 0 100 100">
          {/* Rombo (planta superior) */}
          <Polygon
            points="50,32 80,52 50,72 20,52"
            fill="none"
            stroke={highlightTop ? colors.active : colors.inactive}
            strokeWidth={highlightTop ? 5 : 3}
          />
          {/* Chevrons (plantas inferiores) */}
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
        <CustomText style={floorBadgeStyles.label}>{`Piso ${floorIndex + 1}`}</CustomText>
      </View>

      {/* Bajar */}
      <TouchableOpacity
        onPress={onPrev}
        disabled={!canDown}
        style={[
          floorBadgeStyles.circleBtnBase,
          !canDown && floorBadgeStyles.circleBtnDisabled,
        ]}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="Bajar piso"
      >
        <ArrowDown disabled={!canDown} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'center',
    gap: 10, // separa subir / badge / bajar
  },
  circleBtnPos: {
    // si querés que "subir" se vea un poco separado del badge:
    marginBottom: 0,
  },
  badgeBlock: {
    alignItems: 'center',
  },
});

export default memo(FloorBadgeControls);
