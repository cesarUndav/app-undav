// components/RoomSelector.tsx
import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { ZoneType } from '../app/mapsConfig';

interface Props {
  showRooms: boolean;
  onToggle: () => void;
  rooms: ZoneType[];
  onSelect: (zoneId: string) => void;
}

export default function RoomSelector({
   showRooms, onToggle, rooms, onSelect
}: Props) {
  return (
    <View style={[styles.wrapper, styles.roomWrapper]}>
      <TouchableOpacity style={styles.button} onPress={onToggle}>
        <CustomText style={styles.text}>
          { showRooms ? 'Seleccionar Aula' : 'Mostrar Aulas'}
        </CustomText>
      </TouchableOpacity>
      { showRooms && (
        <ScrollView style={styles.menu}>
          {rooms.map(z => (
            <TouchableOpacity
              key={z.id}
              style={styles.item}
              onPress={() => onSelect(z.id)}
            >
              <CustomText style={styles.itemText}>{z.name}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles =  StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 20,
    elevation: 4,
  },
    roomWrapper: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 20,
    elevation: 4,
  },
  button: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 0,
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