// components/BuildingSelector.tsx
import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { edificios, BuildingKey } from '../app/mapsConfig'


interface Props {
  building: BuildingKey | '';
  showMenu: boolean;
  onToggle: () => void;
  onSelect: (b: BuildingKey) => void;
}

export default function BuildingSelector({
  building, showMenu, onToggle, onSelect
}: Props) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={onToggle}>
        <CustomText style={styles.text}>
          {building ? edificios[building].label : 'Seleccionar Edificio'}
        </CustomText>
      </TouchableOpacity>
      {showMenu && (
        <ScrollView style={styles.menu}>
          {Object.entries(edificios).map(([key, info]) => (
            <TouchableOpacity
              key={key}
              style={styles.item}
              onPress={() => onSelect(key as BuildingKey)}
            >
              <CustomText style={styles.itemText}>{info.label}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const BTN_H = 44;  // alto de cada dropdown
const MENU_OFFSET = 4;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: BTN_H,     // reserva el alto del botón
    zIndex: 30,        // por encima del de aulas
  },
  button: {
    height: BTN_H,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  text: { fontSize: 16, color: '#333' },

  // el menú se superpone y NO empuja el layout
  menu: {
    position: 'absolute',
    top: BTN_H + MENU_OFFSET,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 200,
    zIndex: 30,
    elevation: 5,
  },
  item: { paddingVertical: 10, paddingHorizontal: 12 },
  itemText: { fontSize: 16, color: '#333' },
});