// components/FloorControls.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from './CustomText';

interface Props {
  floorIndex: number;
  maxFloors: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function FloorControls({
  floorIndex, maxFloors, onPrev, onNext
}: Props) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPrev}
        disabled={floorIndex === 0}
        style={[
          styles.button,
          floorIndex === 0 && styles.disabledButton
        ]}
      >
        <CustomText style={[
          styles.buttonText,
          floorIndex === 0 && styles.disabledText
        ]}>Bajar</CustomText>
      </TouchableOpacity>
      <CustomText style={styles.label}>{`Piso ${floorIndex + 1}`}</CustomText>
      <TouchableOpacity
        onPress={onNext}
        disabled={floorIndex === maxFloors - 1}
        style={[
          styles.button,
          floorIndex === maxFloors - 1 && styles.disabledButton
        ]}
      >
        <CustomText style={[
          styles.buttonText,
          floorIndex === maxFloors - 1 && styles.disabledText
        ]}>Subir</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledText: {
    color: '#888',
  },
  label: {
    alignSelf: 'center',
    fontWeight: '900',
    fontSize: 24,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(161, 161, 161, 0.7)',
    color: '#fff',
  },
});
