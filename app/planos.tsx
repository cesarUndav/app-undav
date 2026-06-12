
// planos.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Escucha de parámetros

import PlanHeader from '../components/plan-area/PlanHeader';
import SearchModal from '../components/SearchModal';
import PlanArea from '../components/PlanArea';

import {
  edificios,
  BuildingKey,
  FloorKey,
} from '../lib/mapsConfig';

import { hasLinkTo } from '../lib/planos/linkTo';
import { usePlanosDerived } from '../hooks/planos/usePlanosDerived';
import { usePlanosTutorial } from '../hooks/planos/usePlanosTutorial';

export default function Planos() {
  // 🔄 Capturamos los parámetros de navegación si es que existen
  const { building: paramBuilding, floor: paramFloor, zoneId: paramZoneId } = useLocalSearchParams();

  // --- Estados básicos ---
  const [building, setBuilding] = useState<'' | BuildingKey>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  // Conexiones
  const [showConnections, setShowConnections] = useState(false);

  // Derivados del plano
  const {
    planData,
    currentFloors,
    mapId,
    roomsList,
    roomsDisabled,
    floorBadgeBottomY,
    connectionOverlay,
  } = usePlanosDerived({
    building,
    floorIndex,
    showRooms,
    setShowRooms,
    showConnections,
    setShowConnections,
  });

  // ✅ Tutorial (solo manual con “?”)
  const { refs, handleOpenTutorial } = usePlanosTutorial({
    building,
    planData,
    setShowMenu,
    setShowRooms,
  });

  // Selección de zona (aula normal o link a otro edificio/piso)
  const handleSelectZone = (id: string) => {
    const z = planData?.zones.find(zz => zz.id === id);
    if (!z) return;

    if (hasLinkTo(z)) {
      const { building: bk, floor } = z.linkTo;
      setBuilding(bk);
      const idx = edificios[bk].floors.findIndex(f => f.key === String(floor));
      setFloorIndex(idx >= 0 ? idx : 0);
      setSelectedZoneId(null);
      setShowRooms(false);
      return;
    }

    setSelectedZoneId(id);
    setShowRooms(false);
  };

// NUEVO EFECTO: Intercepta el redireccionamiento externo de oficinas/aulas
  useEffect(() => {
    if (paramBuilding && paramFloor && paramZoneId) {
      const bk = paramBuilding as BuildingKey;
      const floorKey = paramFloor as FloorKey;
      const zoneId = paramZoneId as string;

      if (!edificios || !edificios[bk]) return;

      // 1. Seteamos edificio y piso de inmediato para que el SVG empiece a cargar
      setBuilding(bk);
      const fi = edificios[bk].floors.findIndex(f => f.key === floorKey);
      setFloorIndex(fi >= 0 ? fi : 0);
      
      // Limpiamos selección previa temporalmente para forzar el re-enfoque
      setSelectedZoneId(null); 
      setShowRooms(false);
      setShowMenu(false);

      // 2. ⚡ ESPERAMOS al siguiente "tick" de React para clavar el ID de la zona
      // Esto hace que PlanArea detecte un cambio de zona REAL sobre el mapa ya montado y dispare su auto-zoom
      setTimeout(() => {
        setSelectedZoneId(zoneId);
      }, 50); 
    }
  }, [paramBuilding, paramFloor, paramZoneId]);
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
          if (roomsDisabled) return;
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
        onOpenTutorial={handleOpenTutorial}
        buildingSelectorRef={refs.buildingSelectorRef}
        showAulasButtonRef={refs.showAulasButtonRef}
        searchButtonRef={refs.searchButtonRef}
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
            showConnections={showConnections}
            onToggleConnections={() => setShowConnections(v => !v)}
            connectionOverlay={connectionOverlay}
            mapViewportRef={refs.mapViewportRef}
            guidePointButtonRef={refs.guidePointButtonRef}
            fitAllButtonRef={refs.fitAllButtonRef}
            floorControlsRef={refs.floorControlsRef}
          />
        )}
      </View>

      {/* Modal búsqueda */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelect={(bk: BuildingKey, floorKey: FloorKey, zoneId: string) => {
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
