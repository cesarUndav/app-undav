// components/SearchModal.tsx
import React from 'react';
import {
  Modal, View, SectionList, TouchableOpacity, StyleSheet
} from 'react-native';
import CustomText from './CustomText';
import { edificios, coordsMap, BuildingKey, ZoneType } from '../app/mapsConfig';

interface AulaItem extends ZoneType {
  buildingKey: BuildingKey;
  floorKey: string;
}
type Section = { title: string; data: AulaItem[] };

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (building: BuildingKey, floorKey: string, zoneId: string) => void;
}

export default function SearchModal({ visible, onClose, onSelect }: Props) {
  const sections: Section[] = (Object.keys(edificios) as BuildingKey[]).map(bk => ({
    title: edificios[bk].label,
    data: edificios[bk].floors.flatMap(f =>
      coordsMap[bk][f.key].zones
        .filter(z => z.id.startsWith('aula'))
        .map(z => ({ ...z, buildingKey: bk, floorKey: f.key }))
    )
  }));

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex:1, padding:16 }}>
        <SectionList
          sections={sections}
          keyExtractor={item => `${item.buildingKey}-${item.floorKey}-${item.id}`}
          renderSectionHeader={({ section }) => (
            <CustomText style={styles.header}>{section.title}</CustomText>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelect(item.buildingKey, item.floorKey, item.id);
                onClose();
              }}
            >
              <CustomText style={styles.itemText}>
                {item.name} (Piso {parseInt(item.floorKey,10)+1})
              </CustomText>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <CustomText style={styles.closeText}>Cerrar</CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  item: {
    paddingVertical: 8,
    
  },
  itemText: {
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeText: {
    color: '#007AFF',
  },
});
