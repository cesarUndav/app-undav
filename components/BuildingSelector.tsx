// components/BuildingSelector.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import { edificios, BuildingKey } from '../app/mapsConfig';
import { selectorStyles } from '../theme/mapStyles';
import ChevronDown from './icons/ChevronDown';

interface Props {
  building: BuildingKey | '';
  showMenu: boolean;
  onToggle: () => void;
  onSelect: (b: BuildingKey) => void;
}

export default function BuildingSelector({
  building, showMenu, onToggle, onSelect
}: Props) {
  const label = building ? edificios[building].label : 'Seleccionar Sede';

  return (
    <View style={selectorStyles.wrapper}>
      <TouchableOpacity
        style={selectorStyles.button}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel="Seleccionar sede, abre lista"
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <CustomText style={selectorStyles.buttonText} numberOfLines={1}>
            {label}
          </CustomText>
          <ChevronDown />
        </View>
      </TouchableOpacity>

      {showMenu && (
        <View style={selectorStyles.menu}>
          {Object.entries(edificios).map(([key, info]) => (
            <TouchableOpacity
              key={key}
              style={selectorStyles.item}
              onPress={() => onSelect(key as BuildingKey)}
              accessibilityRole="button"
              accessibilityLabel={`Cambiar a ${info.label}`}
            >
              <CustomText style={selectorStyles.itemText}>{info.label}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
