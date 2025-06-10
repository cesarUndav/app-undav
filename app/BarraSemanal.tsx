import { azulMedioUndav } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type BarraSemanalProps = {
  actividadesPorDia: number[];
  diaActual: number;
  diaHoy: number;
  onSelectDay?: (dayIndex: number) => void;
};
const hoyColor = "#2280ba";
const selectedColor = "#c62a2b";
const actividadesColor = azulMedioUndav;
const noActividadesColor = "#b1b2b1";

const dias = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

export default function BarraSemanal({ actividadesPorDia, diaActual, diaHoy, onSelectDay }: BarraSemanalProps) {
  return (
    <View style={styles.container}>
      {dias.map((dia, index) => {
        const count = actividadesPorDia[index] || 0;
        const isSelected = index === diaActual;
        const isToday = index === diaHoy;

        // Determine background color
        let backgroundColor = noActividadesColor;

        if (isSelected) {
          backgroundColor = selectedColor;
        } else if (isToday) {
          backgroundColor = hoyColor;
        } else if (count > 0) {
          backgroundColor = actividadesColor;
        }

        let textColor = '#333';
        if (isToday) textColor = hoyColor;

        return (
          <TouchableOpacity
            key={index}
            style={styles.segmentWrapper}
            onPress={() => onSelectDay && onSelectDay(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.diaText, {color: textColor} ,isSelected && styles.selectedDiaText]}>{dia}</Text>
            <View style={[styles.segment, { backgroundColor }]}>
              <Text style={styles.countText}>{count}</Text>
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
    gap: 2,
  },
  diaText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
    selectedDiaText: {
    color: selectedColor,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: 'white',
  },
});
