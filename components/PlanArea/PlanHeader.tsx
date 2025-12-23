import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';

import BuildingSelector from '../BuildingSelector';
import RoomSelector from '../RoomSelector';
import SearchIcon from '../../assets/icons/search.svg';
import { BuildingKey, PlanData } from '../../app/mapsConfig';
import { planHeaderV2Styles as styles } from '../../theme/mapStyles';

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

  // Search modal
  onOpenSearch: () => void;
};

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
      {/* Fila 1: Edificio a ancho completo */}
      <View style={styles.row}>
        <View style={styles.buildingCol}>
          <BuildingSelector
            building={building}
            showMenu={showMenu}
            onToggle={onToggleBuildings}
            onSelect={onSelectBuilding}
          />
        </View>
      </View>

      {/* Fila 2: Aulas + botón azul */}
      <View style={styles.rowInline}>
        <View style={styles.roomsCol}>
          <RoomSelector
            disabled={roomsDisabled}
            show={showRooms}
            onToggle={onToggleRooms}
            rooms={!roomsDisabled ? rooms : []}
            onSelect={onSelectRoom}
          />
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Abrir búsqueda de aulas"
          onPress={onOpenSearch}
          activeOpacity={0.9}
          style={styles.searchBlueBtn}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <SearchIcon width={22} height={22} fill="#fff" stroke="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(PlanHeader);
