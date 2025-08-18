// screens/Planos.tsx
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import BuildingSelector from '../components/BuildingSelector';
import RoomSelector from '../components/RoomSelector';
import FloorBadgeControls from '../components/FloorBadgeControls';
import MapViewer from '../components/MapViewer';
import Tooltip from '../components/Tooltip';
import SearchModal from '../components/SearchModal';
import SearchIcon from '../assets/icons/search.svg';
import {
  edificios,
  coordsMap,
  BuildingKey,
  PlanData,
} from '../app/mapsConfig';

export default function Planos() {
  // --- Estados básicos ---
  const [building, setBuilding] = useState<'' | BuildingKey>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);

  // Tooltip
  const [tooltip, setTooltip] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Zoom & selección de aula
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoomParams, setZoomParams] = useState<{
    key: string;
    zoom: number;
    x: number;
    y: number;
  } | null>(null);

  // Nuevo estado: modal de búsqueda
  const [showSearchModal, setShowSearchModal] = useState(false);

  const panZoomRef = useRef<any>(null);
  const { width: winW, height: winH } = Dimensions.get('window');
  const containerW = winW - 32;
  const containerH = winH - 300;

  // Datos del plano actual
  const planData = useMemo<PlanData | null>(() => {
    if (!building) return null;
    const key = edificios[building].floors[floorIndex].key;
    return coordsMap[building][key] || null;
  }, [building, floorIndex]);

  const currentFloors = building ? edificios[building].floors : [];

  const roomsList = useMemo(() => {
    if (!planData) return [];
    return planData.zones.filter(z =>
      z.id.toLowerCase().startsWith('aula')
    );
  }, [planData]);

  // Tooltip
  const showTip = (text: string) => {
    setTooltip(text);
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setTooltip(null));
  };

  // Selección de aula
  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    calculateZoomToZone(zoneId);
    setShowRooms(false);
  };

  const calculateZoomToZone = (zoneId: string) => {
    if (!planData) return;
    const zone = planData.zones.find(z => z.id === zoneId)!;
    const xs = zone.points.map(p => p[0]);
    const ys = zone.points.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const zoneW = maxX - minX, zoneH = maxY - minY;
    const centerX = minX + zoneW / 2, centerY = minY + zoneH / 2;

    const scaleX = containerW / zoneW;
    const scaleY = containerH / zoneH;
    const newZoom = Math.min(scaleX, scaleY) * 0.8;

    const newX = containerW / 2 - centerX * newZoom;
    const newY = containerH / 2 - centerY * newZoom;

    setZoomParams({
      key: `${building}-${floorIndex}-${zoneId}`,
      zoom: newZoom,
      x: newX,
      y: newY,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header con selectores (75%) + lupa (25% aprox) */}
      <View style={styles.topControls}>
        {/* Columna izquierda */}
        <View style={styles.selectorsContainer}>
          <BuildingSelector
            building={building}
            showMenu={showMenu}
            onToggle={() => setShowMenu(v => !v)}
            onSelect={(bk) => {
              setBuilding(bk);
              setFloorIndex(0);
              setSelectedZoneId(null);
              setZoomParams(null);
              setShowMenu(false);
            }}
          />

          {(
            <RoomSelector
              disabled={!building}    
              show={showRooms}
              onToggle={() => setShowRooms(v => !v)}
              rooms={building ? roomsList : []} 
              onSelect={handleSelectZone}
            />
          )}
        </View>

        {/* Columna derecha: botón lupa cuadrado */}
        <View style={styles.searchButtonContainer}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowSearchModal(true)}
            activeOpacity={0.8}
          >
            <SearchIcon width={28} height={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAP + CONTROLES */}
      {planData && (
  <>
    <MapViewer
      SvgComponent={currentFloors[floorIndex].SvgComponent}
      planData={planData}
      containerW={containerW}
      containerH={containerH}
      selectedZoneId={selectedZoneId}
      onZonePress={handleSelectZone}
      zoomParams={zoomParams}
    />

    {/* Nuevo control de plantas en esquina inferior derecha */}
    <FloorBadgeControls
      floorIndex={floorIndex}
      maxFloors={currentFloors.length}
      onPrev={() => {
        if (floorIndex > 0) {
          setFloorIndex(i => i - 1);
          setSelectedZoneId(null);
          setZoomParams(null);
        }
      }}
      onNext={() => {
        if (floorIndex < currentFloors.length - 1) {
          setFloorIndex(i => i + 1);
          setSelectedZoneId(null);
          setZoomParams(null);
        }
      }}
    />

    {tooltip && <Tooltip text={tooltip} opacity={fadeAnim} />}
  </>
)}

      {/* SEARCH MODAL */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelect={(bk, floorKey, zoneId) => {
          // actualizar edificio, piso y aula
          setBuilding(bk);
          const fi = edificios[bk].floors.findIndex(f => f.key === floorKey);
          setFloorIndex(fi >= 0 ? fi : 0);
          handleSelectZone(zoneId);
          setShowSearchModal(false);
        }}
      />
    </View>
  );
}

const PAD_X = 16;
const PAD_TOP = 16;
const GAP = 12;
const DROPDOWN_H = 44;                 // altura de cada dropdown
const SEARCH_BOX = DROPDOWN_H * 2 + GAP; // lado del botón cuadrado

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },

  topControls: {
    flexDirection: 'row',
    paddingHorizontal: PAD_X,
    paddingTop: PAD_TOP,
    alignItems: 'flex-start',
  },
  selectorsContainer: {
    flex: 1,                  // ocupa ~75%
    marginRight: GAP,         // separa de la lupa
  },

  // columna derecha (contenedor cuadrado con borde/fondo)
  searchButtonContainer: {
    width: SEARCH_BOX,
    height: SEARCH_BOX,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
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