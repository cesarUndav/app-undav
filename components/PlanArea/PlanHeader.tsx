// ==============================
// File: components/PlanHeader.tsx
// ==============================
import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import BuildingSelector from '../BuildingSelector';
import RoomSelector from '../RoomSelector';
import SearchIcon from '../../assets/icons/search.svg';
import { BuildingKey, PlanData } from '../../app/mapsConfig';
import { floorLabel } from '../../lib/floors';

type Props = {
  building: '' | BuildingKey;

  // Buildings
  showMenu: boolean;
  onToggleBuildings: () => void;
  onSelectBuilding: (bk: BuildingKey) => void;

  // Rooms
  showRooms: boolean;
  onToggleRooms: () => void;
  rooms: NonNullable<PlanData>['zones'];
  roomsDisabled: boolean;
  onSelectRoom: (id: string) => void;

  // Search
  onOpenSearch: () => void;
};

const PAD_X = 16;
const PAD_TOP = 16;
const GAP = 12;
const DROPDOWN_H = 44;                   // altura de cada dropdown
const SEARCH_BOX = DROPDOWN_H * 2 + GAP; // lado del botón cuadrado

function PlanHeader({
  building,
  showMenu,
  onToggleBuildings,
  onSelectBuilding,

  showRooms,
  onToggleRooms,
  rooms,
  roomsDisabled,
  onSelectRoom,

  onOpenSearch,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Columna izquierda: selectores */}
      <View style={styles.selectorsContainer}>
        <BuildingSelector
          building={building}
          showMenu={showMenu}
          onToggle={onToggleBuildings}
          onSelect={onSelectBuilding}
        />

        <RoomSelector
          disabled={roomsDisabled}
          show={showRooms}
          onToggle={onToggleRooms}
          rooms={!roomsDisabled ? rooms : []}
          onSelect={onSelectRoom}
        />
      </View>

      {/* Columna derecha: botón de búsqueda */}
      <View style={styles.searchButtonContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Abrir búsqueda de aulas"
          style={styles.searchButton}
          onPress={onOpenSearch}
          activeOpacity={0.8}
        >
          <SearchIcon width={28} height={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: PAD_X,
    paddingTop: PAD_TOP,
    alignItems: 'flex-start',
  },
  selectorsContainer: {
    gap: 3,
    flex: 1,
    marginRight: GAP,
  },
  searchButtonContainer: {
    width: SEARCH_BOX,
    height: SEARCH_BOX,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cacaca',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(PlanHeader);
