// ==============================
// File: components/RoomSelector.tsx
// ==============================
import React, { useMemo } from 'react';
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
  // 1) Orden alfabético natural (insensible a mayúsculas, con soporte numérico)
  const sortedRooms = useMemo(
    () =>
      [...rooms].sort(
        (a, b) =>
          a.name.localeCompare(b.name, 'es', { numeric: true, sensitivity: 'base' }) ||
          a.id.localeCompare(b.id, 'es', { numeric: true, sensitivity: 'base' })
      ),
    [rooms]
  );

  // 2) Deshabilitar si no hay aulas
  const isDisabled = disabled || sortedRooms.length === 0;

  const label = isDisabled
    ? 'Mostrar Aulas'
    : show
    ? 'Seleccionar Aula'
    : 'Mostrar Aulas';

  return (
    <View style={[s.wrapper, extra.roomWrapper]}>
      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => {
          if (!isDisabled) onToggle();
        }}
        style={[s.button, isDisabled && s.buttonDisabled]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          isDisabled
            ? 'Aulas no disponibles'
            : label
        }
      >
        <CustomText style={[s.text, isDisabled && s.textDisabled]}>
          {label}
        </CustomText>
      </TouchableOpacity>

      {/* 3) Scrollbar visible para indicar que hay más opciones */}
      {!isDisabled && show && (
        <ScrollView
          style={[s.menu, extra.menu, { top: BTN_H + MENU_OFFSET }]}
          contentContainerStyle={s.menuContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          indicatorStyle="black"
        >
          {sortedRooms.map((zone) => (
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

// Ajustes locales (z-index y separación). Estilos base en theme/planHeaderStyles.
const extra = StyleSheet.create({
  roomWrapper: {
    marginTop: 8,
    zIndex: 20, // debajo del selector de edificios (que usa 30)
  },
  menu: {
    zIndex: 20,
  },
});
