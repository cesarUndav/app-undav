// components/RoomSelector.tsx
import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { ZoneType } from '../app/mapsConfig';

interface Props {
  disabled?:boolean;
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
  const label = disabled
    ? 'Mostrar Aulas'                 // Desactivado: solo texto
    : show
    ? 'Seleccionar Aula'              // Desplegado
    : 'Mostrar Aulas';                // Cerrado

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={disabled}           // 👈 desactiva press feedback
        onPress={() => { if (!disabled) onToggle(); }}  // 👈 no abre menú si disabled
        style={[styles.button, disabled && styles.buttonDisabled]}
        activeOpacity={0.8}
      >
        <CustomText style={[styles.text, disabled && styles.textDisabled]}>
          {label}
        </CustomText>
      </TouchableOpacity>

      {/* Menú solo si NO está desactivado */}
      {!disabled &&  show && (
        <ScrollView style={styles.menu} keyboardShouldPersistTaps="handled">
          {rooms.map(zone => (
            <TouchableOpacity
              key={zone.id}
              style={styles.item}
              onPress={() => onSelect(zone.id)}
            >
              <CustomText style={styles.itemText}>{zone.name}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}


const BTN_H = 44;
const MENU_OFFSET = 4;

const styles =  StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: BTN_H,
    marginTop: 8,      // separación entre dropdowns
    zIndex: 20,        // por debajo del de edificio
  },
  roomWrapper: {
    paddingHorizontal: 0,
    zIndex: 20 ,
    elevation: 4,
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
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  text: { 
    fontSize: 16, 
    color: '#333'
  },
  textDisabled: {
    color: '#aaa',
  },
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
      zIndex: 20,
      elevation: 5,
    },
  item: { paddingVertical: 10, paddingHorizontal: 12 },
  itemText: { fontSize: 16, color: '#333' },
});