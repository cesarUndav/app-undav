// components/RoomSelector.tsx
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import CustomText from './CustomText';
import { ZoneType } from '../app/mapsConfig';
import { selectorStyles } from '../theme/mapStyles';
import ChevronDown from './icons/ChevronDown';

interface Props {
  disabled?: boolean;
  show: boolean;
  onToggle: () => void;
  rooms: ZoneType[];
  onSelect: (zoneId: string) => void;

  // Coachmark ref (opcional)
  coachmarkRef?: React.Ref<any>;
}

export default function RoomSelector({
  disabled = false,
  show,
  onToggle,
  rooms,
  onSelect,
  coachmarkRef,
}: Props) {
  const label = disabled
    ? 'Mostrar Aulas'
    : show
    ? 'Seleccionar Aula'
    : 'Mostrar Aulas';

  return (
    <View style={[selectorStyles.wrapper, { zIndex: 20 }]}>
      <TouchableOpacity
        ref={coachmarkRef}
        disabled={disabled}
        onPress={() => { if (!disabled) onToggle(); }}
        style={selectorStyles.button}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Abrir selector de aulas"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: disabled ? 0.6 : 1 }}>
          <CustomText style={selectorStyles.buttonText} numberOfLines={1}>
            {label}
          </CustomText>
          <ChevronDown />
        </View>
      </TouchableOpacity>

      {!disabled && show && (
        <ScrollView style={selectorStyles.menu} keyboardShouldPersistTaps="handled">
          {rooms.map(zone => (
            <TouchableOpacity
              key={zone.id}
              style={selectorStyles.item}
              onPress={() => onSelect(zone.id)}
              accessibilityRole="button"
              accessibilityLabel={`Ir a ${zone.name}`}
            >
              <CustomText style={selectorStyles.itemText}>{zone.name}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
