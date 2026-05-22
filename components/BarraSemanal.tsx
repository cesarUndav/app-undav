// components/BarraSemanal.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import { azulMedioUndav } from '@/constants/Colors';

type BarraSemanalProps = {
  actividadesPorDia: number[];
  diaActual: number;
  diaHoy: number;
  onSelectDay?: (dayIndex: number) => void;
};

const hoyColor = '#2280ba';
const selectedColor = '#c62a2b';
const actividadesColor = azulMedioUndav;
const noActividadesColor = '#b1b2b1';

const dias = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

export default function BarraSemanal({
  actividadesPorDia,
  diaActual,
  diaHoy,
  onSelectDay,
}: BarraSemanalProps) {
  return (
    <View style={styles.container}>
      {dias.map((dia, index) => {
        const count = actividadesPorDia[index] || 0;
        const isSelected = index === diaActual;
        const isToday = index === diaHoy;

        let backgroundColor = noActividadesColor;

        if (isSelected) {
          backgroundColor = selectedColor;
        } else if (isToday) {
          backgroundColor = hoyColor;
        } else if (count > 0) {
          backgroundColor = actividadesColor;
        }

        let textColor = '#333';

        if (isToday) {
          textColor = hoyColor;
        }

        if (isSelected) {
          textColor = selectedColor;
        }

        return (
          <TouchableOpacity
            key={index}
            style={styles.segmentWrapper}
            onPress={() => onSelectDay && onSelectDay(index)}
            activeOpacity={0.7}
          >
            <CustomText
              weight="bold"
              style={[styles.diaText, { color: textColor }]}
            >
              {dia}
            </CustomText>

            <View style={[styles.segment, { backgroundColor }]}>
              <CustomText weight="bold" style={styles.countText}>
                {count}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
  },
  segmentWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: 0,
  },
  diaText: {
    fontSize: 14,
    marginBottom: 4,
  },
  segment: {
    width: '90%',
    aspectRatio: 1,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 13,
    color: 'white',
  },
});