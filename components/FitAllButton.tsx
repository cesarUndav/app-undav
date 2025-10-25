import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { mapButtonStyles, mapTokens } from '../theme/mapStyles';

type Props = {
  onPress: (e: GestureResponderEvent) => void;
  label?: string;
  disabled?: boolean;
};

export default function FitAllButton({ onPress, label = 'Ver todo', disabled }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Ver todo el plano"
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[styles.floatingPos, mapButtonStyles.base, disabled && styles.disabled]}
    >
      <Text style={mapButtonStyles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Layout contextual:
  floatingPos: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    paddingHorizontal: 14,
    zIndex: mapTokens.zFloating,
  },
  disabled: { opacity: 0.6 },
});
