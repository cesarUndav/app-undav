// components/FloorBadgeControls.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import CustomText from './CustomText';

type Props = {
  floorIndex: number;         // 0 = Planta baja, 1 = Piso 1, ...
  maxFloors: number;          // total de plantas (1..4)
  onPrev: () => void;         // bajar piso
  onNext: () => void;         // subir piso
};

const ACTIVE = '#1e1ee5';     // azul activo
const INACTIVE = '#9E9E9E';   // gris
const DISABLED = '#CCCCCC';

// --- NUEVO: iconos flecha (chevron) ---
const ArrowUp = ({ disabled }: { disabled?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    {/* chevron up */}
    <Polyline
      points="6,14 12,8 18,14"
      fill="none"
      stroke={disabled ? INACTIVE : ACTIVE}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ArrowDown = ({ disabled }: { disabled?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    {/* chevron down */}
    <Polyline
      points="6,10 12,16 18,10"
      fill="none"
      stroke={disabled ? INACTIVE : ACTIVE}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function FloorBadgeControls({
  floorIndex,
  maxFloors,
  onPrev,
  onNext,
}: Props) {
  const canDown = floorIndex > 0;
  const canUp = floorIndex < maxFloors - 1;

  // Icono: viewBox 100x100
  // - Rombo superior fijo
  // - Chevrones inferiores: cantidad = maxFloors - 1
  const chevrons = Math.max(0, Math.min(3, maxFloors - 1)); // soporta hasta 4 plantas

  // Y de cada chevrón (de abajo hacia arriba)
  // Ej.: 3 chevrons => y = 78, 70, 62
  const bottomY = 78;
  const step = 8;
  const yForChevron = (idxFromBottom: number) => bottomY - idxFromBottom * step;

  // Qué resaltar:
  // - Si floorIndex === maxFloors - 1 -> resaltar ROMBO
  // - Si no, resaltar chevron floorIndex (contado desde abajo)
  const highlightTop = floorIndex === maxFloors - 1;
  const highlightChevronIndexFromBottom = floorIndex; // 0 = abajo

  return (
    <View style={styles.wrap}>
      {/* Botón subir */}
<TouchableOpacity
        onPress={onNext}
        disabled={!canUp}
        style={[styles.circleBtn, !canUp && styles.disabledBtn, styles.subir]}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Subir piso"
      >
        <ArrowUp disabled={!canUp} />
      </TouchableOpacity>

      {/* Icono + etiqueta */}
      <View style={styles.badgeBlock}>
        <Svg width={56} height={56} viewBox="0 0 100 100">
          {/* Rombo (techo / planta superior) */}
          <Polygon
            points="50,32 80,52 50,72 20,52"
            fill="none"
            stroke={highlightTop ? ACTIVE : INACTIVE}
            strokeWidth={highlightTop ? 5 : 3}
          />
          {/* Chevrones (plantas inferiores) */}
          {Array.from({ length: chevrons }).map((_, i) => {
            const y = yForChevron(i); // i = 0 (abajo) … n-1 (arriba)
            const active = !highlightTop && i === highlightChevronIndexFromBottom;
            return (
              <Polyline
                key={`ch-${i}`}
                points={`20,${y} 50,${y + 20} 80,${y}`}
                fill="none"
                stroke={active ? ACTIVE : INACTIVE}
                strokeWidth={active ? 5 : 3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        <CustomText style={styles.label}>{`Piso ${floorIndex + 1}`}</CustomText>
      </View>

      {/* Botón bajar */}
      <TouchableOpacity
        onPress={onPrev}
        disabled={!canDown}
        style={[styles.circleBtn, !canDown && styles.disabledBtn]}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
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
    gap: 8,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADADA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subir:{
    top: 15,
  },
  disabledBtn: {
    backgroundColor: '#F2F2F2',
    borderColor: '#E6E6E6',
  },
  sign: {
    fontSize: 22,
    color: '#1E88E5',
    fontWeight: '700',
  },
  signDisabled: {
    color: '#9E9E9E',
  },
  badgeBlock: {
    alignItems: 'center',
  },
  label: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(161,161,161,0.7)',
    color: '#fff',
    fontWeight: '900',
  },
});
