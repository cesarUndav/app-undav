// components/SearchModal.tsx

import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  SectionList,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import CustomText from './CustomText';
import { BuildingKey, FloorKey } from '../lib/mapsConfig';
import { floorLabel } from '../lib/floors';

import {
  makeBaseSections,
  filterSections,
  Section,
  FloorGroup,
} from '../lib/searchRooms';

import { searchModalStyles as s } from '../theme/mapStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (
    building: BuildingKey,
    floorKey: FloorKey,
    zoneId: string
  ) => void;
}

export default function SearchModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState('');

  const baseSections: Section[] = useMemo(() => makeBaseSections(), []);

  const filteredSections: Section[] = useMemo(
    () => filterSections(baseSections, query),
    [baseSections, query]
  );

  const hasResults = filteredSections.some((sct) => sct.data.length > 0);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.container}>
        <View style={s.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar (ej: Aula 101, Laboratorio, Departamento)"
            placeholderTextColor="#94a3b8"
            autoCorrect={true}
            autoCapitalize="none"
            spellCheck={true}
            keyboardType="default"
            returnKeyType="search"
            keyboardAppearance="light"
            textContentType="none"
            clearButtonMode="while-editing"
            enablesReturnKeyAutomatically={true}
            style={s.searchInput}
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              style={s.clearBtn}
              hitSlop={8}
            >
              <CustomText weight="bold" style={s.clearBtnTxt}>
                ✕
              </CustomText>
            </Pressable>
          )}
        </View>

        {hasResults ? (
          <SectionList
            sections={filteredSections}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item: FloorGroup) => item.floorKey}
            renderSectionHeader={({ section }) => (
              <CustomText weight="bold" style={s.title}>
                {section.title}
              </CustomText>
            )}
            renderItem={({ item }) => (
              <View style={s.card}>
                <CustomText weight="bold" style={s.cardHeader}>
                  {floorLabel(parseInt(item.floorKey, 10))}
                </CustomText>

                <View style={s.chipsRow}>
                  {item.rooms.map((room) => (
                    <Pressable
                      key={`${room.buildingKey}-${room.floorKey}-${room.id}`}
                      onPress={() => {
                        onSelect(room.buildingKey, room.floorKey, room.id);
                        onClose();
                      }}
                      style={({ pressed }) => [
                        s.chip,
                        pressed && s.chipPressed,
                      ]}
                      android_ripple={{ color: 'rgba(59,91,253,0.15)' }}
                    >
                      <CustomText weight="bold" style={s.chipText}>
                        {room.name}
                      </CustomText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.itemSeparator} />
            )}
            SectionSeparatorComponent={() => (
              <View style={styles.sectionSeparator} />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={s.emptyWrap}>
            <CustomText style={s.emptyTitle}>
              Sin resultados
            </CustomText>

            <CustomText style={s.emptySub}>
              Probá con otro término de búsqueda.
            </CustomText>
          </View>
        )}

        <Pressable onPress={onClose} style={s.closeBtn}>
          <CustomText style={s.closeText}>
            Cerrar
          </CustomText>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  itemSeparator: {
    height: 12,
  },
  sectionSeparator: {
    height: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
});