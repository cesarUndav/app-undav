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
    const floorKey: FloorKey | undefined = floors[safeIndex]?.key; // 👈 tipado correcto
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <PlanHeader
        building={building}
        showMenu={showMenu}
        onToggleBuildings={() => {
          setShowMenu((prev) => {
            const next = !prev;
            if (next) setShowRooms(false);   // Cierra aulas si abro edificios
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
          setShowRooms((prev) => {
            const next = !prev;
            if (next) setShowMenu(false);    // Cierra edificios si abro aulas
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

      {/* 👇 Backdrop global (toca fuera = cierra menús) */}
      {(showMenu || showRooms) && (
        <View
          // capa por encima del contenido, por debajo de los menús
          style={{ ...StyleSheet.absoluteFillObject, zIndex: 15 }}
          pointerEvents="auto"
        >
          <View
            // si querés oscurecer levemente: backgroundColor:'rgba(0,0,0,0.05)'
            style={{ flex: 1 }}
            // usar Pressable si preferís feedback; aquí View + onStartShouldSetResponder es suficiente
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
            planData={planData}
            floors={currentFloors}
            floorIndex={floorIndex}
            mapId={mapId}
            onChangeFloor={(i) => {
              setFloorIndex(i);
              setSelectedZoneId(null);
            }}
            selectedZoneId={selectedZoneId}
            onSelectZone={(id) => {
              setSelectedZoneId(id);
              setShowRooms(false);
            }}
            fitPadding={0.10}
            focusPadding={0.18}
            fitMode="canvas"
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
