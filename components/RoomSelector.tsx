// ==============================
// File: components/RoomSelector.tsx
// ==============================
import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { ZoneType } from '../app/mapsConfig';
import { dropdownStyles as s, BTN_H, MENU_OFFSET } from '../theme/planHeaderStyles';

interface Props {
  disabled?: boolean;
  show: boolean;
  onToggle: () => void;
  rooms: ZoneType[];
  onSelect: (zoneId: string) => void;
}

export default function RoomSelector({
  disabled = false,
  show,
  onToggle,
  rooms,
  onSelect,
}: Props) {
  // 👇 MISMA LÓGICA QUE TENÍAS
  const label = disabled
    ? 'Mostrar Aulas'
    : show
    ? 'Seleccionar Aula'
    : 'Mostrar Aulas';

  return (
    <View style={[s.wrapper, extra.roomWrapper]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => { if (!disabled) onToggle(); }}
        style={[s.button, disabled && s.buttonDisabled]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <CustomText style={[s.text, disabled && s.textDisabled]}>
          {label}
        </CustomText>
      </TouchableOpacity>

      {!disabled && show && (
        <ScrollView
          style={[s.menu, extra.menu, { top: BTN_H + MENU_OFFSET }]}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.menuContent}
        >
          {rooms.map((zone) => (
            <TouchableOpacity
              key={zone.id}
              style={s.item}
              onPress={() => onSelect(zone.id)}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar ${zone.name}`}
            >
              <CustomText style={s.itemText}>{zone.name}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// Pequeños ajustes locales para diferenciar del selector de edificios
// (z-index y separación vertical). El resto vive en theme/planHeaderStyles.
const extra = StyleSheet.create({
  roomWrapper: {
    marginTop: 8,
    zIndex: 20, // por debajo del selector de edificios (que usa 30)
  },
  menu: {
    zIndex: 20,
  },
});
