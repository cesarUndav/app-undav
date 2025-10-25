// components/BuildingSelector.tsx
import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import CustomText from './CustomText';
import { edificios, BuildingKey } from '../app/mapsConfig';
import { selectorStyles as styles } from '../theme/mapStyles';

interface Props {
  building: '' | BuildingKey;
  showMenu: boolean;
  onToggle: () => void;
  onSelect: (b: BuildingKey) => void;
}

export default function BuildingSelector({
  building,
  showMenu,
  onToggle,
  onSelect,
}: Props) {
  const label = building ? edificios[building].label : 'Seleccionar Sede';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel="Seleccionar edificio"
      >
        <CustomText style={styles.buttonText}>{label}</CustomText>
      </TouchableOpacity>

      {showMenu && (
        <ScrollView
          style={styles.menu}
          keyboardShouldPersistTaps="handled"
        >
          {Object.entries(edificios).map(([key, info]) => (
            <TouchableOpacity
              key={key}
              style={styles.item}
              onPress={() => onSelect(key as BuildingKey)}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar ${info.label}`}
            >
              <CustomText style={styles.itemText}>{info.label}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
