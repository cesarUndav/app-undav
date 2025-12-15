// components/SearchModal.tsx
import React, { useMemo, useState } from 'react';
import {
  Modal, View, SectionList, Pressable, TextInput
} from 'react-native';
import CustomText from './CustomText';
import { BuildingKey, FloorKey } from '../app/mapsConfig';
import { floorLabel } from '../lib/floors';

// lógica modularizada
import {
  makeBaseSections,
  filterSections,
  Section,
  FloorGroup,
} from '../lib/searchRooms';

// estilos centralizados
import { searchModalStyles as s } from '../theme/mapStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (building: BuildingKey, floorKey: FloorKey, zoneId: string) => void;
}

export default function SearchModal({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');

  /** Secciones completas (sin filtrar) */
  const baseSections: Section[] = useMemo(() => makeBaseSections(), []);

  /** Filtrado por query (sólo NAME + alias) */
  const filteredSections: Section[] = useMemo(
    () => filterSections(baseSections, query),
    [baseSections, query]
  );

  const hasResults = filteredSections.some((sct) => sct.data.length > 0);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.container}>
        {/* Barra de búsqueda */}
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
            keyboardAppearance="light"           // o "dark" si usas tema oscuro
            textContentType="none"               // evita autocompletado raro de iOS
            clearButtonMode="while-editing"      // nativo de iOS dentro del campo
            enablesReturnKeyAutomatically={true} // desactiva “Buscar” si está vacío
            style={s.searchInput}
          />

          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} style={s.clearBtn} hitSlop={8}>
              <CustomText weight="700" style={s.clearBtnTxt}>✕</CustomText>
            </Pressable>
          )}
        </View>

        {/* Listado por edificio → pisos → chips de aulas */}
        {hasResults ? (
          <SectionList
            sections={filteredSections}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item: FloorGroup) => item.floorKey}
            renderSectionHeader={({ section }) => (
              <CustomText weight="700" style={s.title}>{section.title}</CustomText>
            )}
            renderItem={({ item }) => (
              <View style={s.card}>
                <CustomText weight="700" style={s.cardHeader}>
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
                      <CustomText weight="700" style={s.chipText}>
                        {room.name}
                      </CustomText>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        ) : (
          <View style={s.emptyWrap}>
            <CustomText style={s.emptyTitle}>Sin resultados</CustomText>
            <CustomText style={s.emptySub}>Probá con otro término de búsqueda.</CustomText>
          </View>
        )}

        <Pressable onPress={onClose} style={s.closeBtn}>
          <CustomText style={s.closeText}>Cerrar</CustomText>
        </Pressable>
      </View>
    </Modal>
  );
}
