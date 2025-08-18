// planos.tsx

import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import SvgPanZoom from 'react-native-svg-pan-zoom';
import CustomText from '../components/CustomText';
// Alias para permitir children en TS
const PanZoom: React.ComponentType<any> = SvgPanZoom;

import {
  edificios,
  coordsMap,
  BuildingKey,
  PlanData,
  ZoneType,
} from './mapsConfig';

export default function Planos() {
  // Estados básicos
  const [building, setBuilding] = useState<'' | BuildingKey>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);
  const [tooltip, setTooltip] = useState<string | null>(null);

  // NUEVOS estados para zoom a zona
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoomParams, setZoomParams] = useState<{
    key: string;
    zoom: number;
    x: number;
    y: number;
  } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panZoomRef = useRef<any>(null);

  // Dimensiones de pantalla y contenedor fijo
  const { width: winW, height: winH } = Dimensions.get('window');
  const containerW = winW - 32;
  const containerH = winH - 300;

  // Datos del plano actual
  const planData = useMemo<PlanData | null>(() => {
    if (!building) return null;
    const key = edificios[building].floors[floorIndex].key;
    return coordsMap[building][key] || null;
  }, [building, floorIndex]);

  const currentFloors = building
    ? edificios[building].floors
    : [];

  // Lista de aulas (zonas que empiezan por "aula")
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
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setTooltip(null));
  };

  // Renderiza polígonos, resaltando la zona seleccionada
  const renderZones = () => {
    if (!planData) return null;
    return planData.zones.map((zone: ZoneType) => {
      const isSelected = zone.id === selectedZoneId;
      return (
        <Polygon
          key={zone.id}
          points={zone.points.map(p => p.join(',')).join(' ')}
          fill={isSelected ? 'rgba(255,200,0,0.3)' : 'transparent'}
          stroke={isSelected ? '#FFA000' : 'none'}
          strokeWidth={isSelected ? 2 : 0}
          onPress={() => handleSelectZone(zone.id)}
        />
      );
    });
  };

  // SVG de la planta actual
  const SelectedSvg = building && planData
    ? currentFloors[floorIndex].SvgComponent
    : null;

  // 1) Maneja selección de aula y cierra menú
  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    calculateZoomToZone(zoneId);
    setShowRooms(false);
  };

  // 2) Calcula zoom y offset para centrar la zona
  const calculateZoomToZone = (zoneId: string) => {
    if (!planData) return;
    const zone = planData.zones.find(z => z.id === zoneId)!;
    const xs = zone.points.map(p => p[0]);
    const ys = zone.points.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const zoneW = maxX - minX, zoneH = maxY - minY;
    const centerX = minX + zoneW / 2, centerY = minY + zoneH / 2;

    // 3) Zoom que encaje la zona (80% del viewport)
    const scaleX = containerW / zoneW;
    const scaleY = containerH / zoneH;
    const newZoom = Math.min(scaleX, scaleY) * 0.8;

    // 4) Offset para centrar esa zona
    const newX = containerW / 2 - centerX * newZoom;
    const newY = containerH / 2 - centerY * newZoom;

    // 5) Fuerza remonte con key único
    setZoomParams({
      key: `${building}-${floorIndex}-${zoneId}`,
      zoom: newZoom,
      x: newX,
      y: newY,
    });
  };

  return (
    <View style={styles.container}>
      {/* Selector de edificio */}
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowMenu(v => !v)}
        >
          <CustomText style={styles.dropdownButtonText}>
            {building ? edificios[building].label : 'Seleccionar Edificio'}
          </CustomText>
        </TouchableOpacity>
        {showMenu && (
          <ScrollView style={styles.dropdownMenu}>
            {Object.entries(edificios).map(([key, info]) => (
              <TouchableOpacity
                key={key}
                style={styles.dropdownItem}
                onPress={() => {
                  setBuilding(key as BuildingKey);
                  setFloorIndex(0);
                  setSelectedZoneId(null);
                  setZoomParams(null);
                  setShowMenu(false);
                }}
              >
                <CustomText style={styles.dropdownItemText}>
                  {info.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Selector de aulas */}
      {building && (
        <View style={[styles.dropdownWrapper, styles.roomDropdownWrapper]}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowRooms(v => !v)}
          >
            <CustomText style={styles.dropdownButtonText}>
              {showRooms ? 'Seleccionar Aula' : 'Mostrar Aulas'}
            </CustomText>
          </TouchableOpacity>
          {showRooms && (
            <ScrollView style={styles.dropdownMenu}>
              {roomsList.map(zone => (
                <TouchableOpacity
                  key={zone.id}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectZone(zone.id)}
                >
                  <CustomText style={styles.dropdownItemText}>
                    {zone.name}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Visualización del plano */}
      {SelectedSvg && planData && (
        <View
          style={[
            styles.mapWrapper,
            { width: containerW, height: containerH },
          ]}
        >
          <PanZoom
            key={zoomParams?.key ?? `${building}-${floorIndex}`}
            ref={panZoomRef}
            canvasWidth={planData.width}
            canvasHeight={planData.height}
            minScale={0.5}
            maxScale={2.5}
            initialZoom={
              zoomParams?.zoom ??
              Math.min(containerW / planData.width, containerH / planData.height)
            }
            initialX={zoomParams?.x ?? 0}
            initialY={zoomParams?.y ?? 0}
          >
            <SelectedSvg
              width={planData.width}
              height={planData.height}
            />
            <Svg
              width={planData.width}
              height={planData.height}
              style={StyleSheet.absoluteFill}
            >
              {renderZones()}
            </Svg>
          </PanZoom>

          {/* Controles de planta */}
        {currentFloors.length > 1 && (
        <View style={styles.floorControls}>
            <TouchableOpacity
            onPress={() => {
                if (floorIndex > 0) {
                setFloorIndex(i => i - 1);
                setSelectedZoneId(null);
                setZoomParams(null);
                }
            }}
            disabled={floorIndex === 0}
            style={[
                styles.floorButton,
                floorIndex === 0 && styles.floorButtonDisabled,
            ]}
            >
            <CustomText
                style={[
                styles.floorButtonText,
                floorIndex === 0 && styles.floorButtonTextDisabled,
                ]}
            >
                Bajar
            </CustomText>
            </TouchableOpacity>

            <CustomText style={styles.floorLabel}>
            {`Piso ${floorIndex + 1}`}
            </CustomText>

            <TouchableOpacity
            onPress={() => {
                if (floorIndex < currentFloors.length - 1) {
                setFloorIndex(i => i + 1);
                setSelectedZoneId(null);
                setZoomParams(null);
                }
            }}
            disabled={floorIndex === currentFloors.length - 1}
            style={[
                styles.floorButton,
                floorIndex === currentFloors.length - 1 &&
                styles.floorButtonDisabled,
            ]}
            >
            <CustomText
                style={[
                styles.floorButtonText,
                floorIndex === currentFloors.length - 1 &&
                    styles.floorButtonTextDisabled,
                ]}
            >
                Subir
            </CustomText>
            </TouchableOpacity>
        </View>
        )}

        </View>
      )}

      {/* Tooltip */}
      {tooltip && (
        <Animated.View
          style={[styles.tooltip, { opacity: fadeAnim }]}
        >
          <CustomText style={styles.tooltipText}>
            {tooltip}
          </CustomText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  dropdownWrapper: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 20,
    elevation: 5,
  },
  roomDropdownWrapper: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 20,
    elevation: 4,
  },
  dropdownButton: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: { fontSize: 16, color: '#333' },
  dropdownMenu: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 200,
  },
  dropdownItem: { 
    paddingVertical: 10, 
    paddingHorizontal: 12 
  },
  dropdownItemText: { 
    fontSize: 16, 
    color: '#333' 
  },
  mapWrapper: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floorControls: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  floorButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',    // azul activo
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorButtonDisabled: {
    backgroundColor: '#ccc',       // gris desactivado
  },
  floorButtonText: {
    color: '#fff',                 // blanco en activo
    fontWeight: '600',
  },
  floorButtonTextDisabled: {
    color: '#888',                 // gris oscuro en desactivado
  },
  floorLabel: {
    alignSelf: 'center',
    fontWeight: '900',
    fontSize: 24,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(161, 161, 161, 0.7)',    // azul activo
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  tooltip: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
  },
  tooltipText: { color: '#fff', textAlign: 'center' },
});
