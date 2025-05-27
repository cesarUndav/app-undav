import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BarraSemanalProps = {
  actividadesPorDia: number[]; // e.g. [0, 2, 1, 0, 3, 1, 0]
};

const dias = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export default function BarraSemanal({ actividadesPorDia }: BarraSemanalProps) {
  return (
    <View style={styles.container}>
      {dias.map((dia, index) => {
        const count = actividadesPorDia[index] || 0;
        const isActive = count > 0;

        return (
          <View key={index} style={styles.segmentWrapper}>
            <Text style={styles.diaText}>{dia}</Text>
            <View style={[styles.segment, isActive && styles.activeSegment]}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10
  },
  segmentWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: 2
  },
  diaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  segment: {
    width: '90%',
    aspectRatio: 1, // makes it a square
    borderRadius: 4,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#1c3fa8',
  },
  countText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
});
