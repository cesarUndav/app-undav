// PlanHeader.tsx
import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import BuildingSelector from '../BuildingSelector';
import RoomSelector from '../RoomSelector';
import SearchIcon from '../../assets/icons/search.svg';
import { BuildingKey, PlanData } from '../../app/mapsConfig';
import { planHeaderStyles as styles } from '../../theme/planHeaderStyles';

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

  // NUEVO: disparar tutorial
  onOpenTutorial: () => void;

  // Coachmarks refs (opcionales)
  buildingSelectorRef?: React.Ref<any>;
  showAulasButtonRef?: React.Ref<any>;
  searchButtonRef?: React.Ref<any>;
  helpButtonRef?: React.Ref<any>;
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
  onOpenTutorial,

  // refs
  buildingSelectorRef,
  showAulasButtonRef,
  searchButtonRef,
  helpButtonRef,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Fila 1: Edificio + lupa */}
      <View style={styles.rowInline}>
        <View style={styles.buildingCol}>
          <BuildingSelector
            building={building}
            showMenu={showMenu}
            onToggle={onToggleBuildings}
            onSelect={onSelectBuilding}
            coachmarkRef={buildingSelectorRef}
          />
        </View>

        <TouchableOpacity
          ref={searchButtonRef}
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

      {/* Fila 2: Aulas + ayuda */}
      <View style={styles.rowInline}>
        <View style={styles.roomsCol}>
          <RoomSelector
            disabled={roomsDisabled}
            show={showRooms}
            onToggle={onToggleRooms}
            rooms={!roomsDisabled ? rooms : []}
            onSelect={onSelectRoom}
            coachmarkRef={showAulasButtonRef}
          />
        </View>

        <TouchableOpacity
          ref={helpButtonRef}
          accessibilityRole="button"
          accessibilityLabel="Ver tutorial de Planos"
          onPress={onOpenTutorial}
          activeOpacity={0.85}
          style={styles.helpBtn}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(PlanHeader);
