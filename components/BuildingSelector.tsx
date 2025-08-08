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

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 30,
    elevation: 5,
  },
  button: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  menu: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 200,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});