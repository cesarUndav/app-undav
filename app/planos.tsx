// ==============================
// File: app/.../Planos.tsx
// ==============================
import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PlanHeader from '../components/PlanArea/PlanHeader';
import SearchModal from '../components/SearchModal';
import PlanArea from '../components/PlanArea';

import {
  edificios,
  coordsMap,
  BuildingKey,
  FloorKey,
  PlanData,
} from '../app/mapsConfig';

// Helper: ancla inferior de chevrons por edificio
function bottomYForBuilding(b: '' | BuildingKey): number {
  switch (b) {
    case 'Arenales':  return 92;
    case 'PineyroA':  return 78;
    case 'PineyroB':  return 68;
    case 'PineyroC':  return 68;
    default:          return 78; // valor por defecto razonable
  }
}

// Type guard simple por si el JSON incluye enlaces inter-plano
type LinkTo = { building: BuildingKey; floor: FloorKey | string | number };
function hasLinkTo(z: any): z is { linkTo: LinkTo } {
  return z && typeof z === 'object' && 'linkTo' in z && z.linkTo;
}

export default function Planos() {
  // --- Estados básicos ---
  const [building, setBuilding] = useState<'' | BuildingKey>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Datos del plano actual (con FloorKey)
  const planData = useMemo<PlanData | null>(() => {
    if (!building) return null;
    const floors = edificios[building]?.floors ?? [];
    const safeIndex = Math.min(Math.max(floorIndex, 0), Math.max(floors.length - 1, 0));
    const floorKey: FloorKey | undefined = floors[safeIndex]?.key;
    return floorKey ? coordsMap[building]?.[floorKey] ?? null : null;
  }, [building, floorIndex]);

  const currentFloors = useMemo(
    () => (building ? edificios[building].floors : []),
    [building]
  );

  // firma única edificio+piso
  const mapId = useMemo(() => {
    const floorKey = currentFloors[floorIndex]?.key ?? 'nofloor';
    const b = building || 'nobuilding';
    return `${b}-${floorKey}`;
  }, [building, currentFloors, floorIndex]);

  // Lista de aulas
  const roomsList = useMemo(() => {
    if (!planData) return [] as NonNullable<PlanData>['zones'];
    return planData.zones.filter(z => z.id.toLowerCase().startsWith('aula'));
  }, [planData]);

  // Y de chevrón para este edificio
  const floorBadgeBottomY = bottomYForBuilding(building);

  // Selección de zona (aula normal o link a otro edificio/piso)
  const handleSelectZone = (id: string) => {
    const z = planData?.zones.find(zz => zz.id === id);
    if (!z) return;

    if (hasLinkTo(z)) {
      const { building: bk, floor } = z.linkTo;
      // cambiar edificio
      setBuilding(bk);
      // ir al índice de piso correcto
      const idx = edificios[bk].floors.findIndex(f => f.key === String(floor));
      setFloorIndex(idx >= 0 ? idx : 0);
      // limpiar selección para que el nuevo plano haga fit inicial
      setSelectedZoneId(null);
      setShowRooms(false);
      return;
    }

    // aula “normal”: seleccionar (PlanArea hará foco)
    setSelectedZoneId(id);
    setShowRooms(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <PlanHeader
        building={building}
        showMenu={showMenu}
        onToggleBuildings={() => {
          setShowMenu(prev => {
            const next = !prev;
            if (next) setShowRooms(false);
            return next;
          });
        }}
        onSelectBuilding={(bk) => {
          setBuilding(bk);
          setFloorIndex(0);
          setSelectedZoneId(null);
          setShowMenu(false);
        }}
        showRooms={showRooms}
        roomsDisabled={!building || !planData}
        onToggleRooms={() => {
          setShowRooms(prev => {
            const next = !prev;
            if (next) setShowMenu(false);
            return next;
          });
        }}
        rooms={building ? roomsList : []}
        onSelectRoom={(id) => {
          setSelectedZoneId(id);
          setShowRooms(false);
        }}
        onOpenSearch={() => setShowSearchModal(true)}
      />

      {/* Backdrop global para cerrar menús tocando fuera */}
      {(showMenu || showRooms) && (
        <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 15 }} pointerEvents="auto">
          <View
            style={{ flex: 1 }}
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => {
              if (showMenu) setShowMenu(false);
              if (showRooms) setShowRooms(false);
            }}
          />
        </View>
      )}

      {/* Área del plano */}
      <View style={{ flex: 1 }}>
        {planData && (
          <PlanArea
            onSelectZone={handleSelectZone}   
            planData={planData}
            floors={currentFloors}
            floorIndex={floorIndex}
            mapId={mapId}
            onChangeFloor={(i) => {
              setFloorIndex(i);
              setSelectedZoneId(null);
            }}
            selectedZoneId={selectedZoneId}
            fitPadding={0.10}
            focusPadding={0.18}
            fitMode="canvas"
            floorBadgeBottomY={floorBadgeBottomY}
          />
        )}
      </View>

      {/* Modal búsqueda */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelect={(bk, floorKey, zoneId) => {
          setBuilding(bk);
          const fi = edificios[bk].floors.findIndex(f => f.key === floorKey);
          setFloorIndex(fi >= 0 ? fi : 0);
          setSelectedZoneId(zoneId);
          setShowSearchModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', position: 'relative' },
});
