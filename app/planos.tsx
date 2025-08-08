// screens/Planos.tsx
import React, { useState, useRef, useMemo } from 'react';
import { View, Dimensions, StyleSheet, Animated } from 'react-native';
import BuildingSelector from '../components/BuildingSelector';
import RoomSelector from '../components/RoomSelector';
import FloorControls from '../components/FloorControls';
import MapViewer from '../components/MapViewer';
import Tooltip from '../components/Tooltip';
import {
  edificios,
  coordsMap,
  BuildingKey,
  PlanData,
} from '../app/mapsConfig';

export default function Planos() {
  const [building, setBuilding] = useState<'' | BuildingKey>('');
  const [showMenu, setShowMenu] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zoomParams, setZoomParams] = useState<{
    key: string;
    zoom: number;
    x: number;
    y: number;
  } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panZoomRef = useRef<any>(null);

  const { width: winW, height: winH } = Dimensions.get('window');
  const containerW = winW - 32;
  const containerH = winH - 300;

  const planData = useMemo<PlanData | null>(() => {
    if (!building) return null;
    const key = edificios[building].floors[floorIndex].key;
    return coordsMap[building][key] || null;
  }, [building, floorIndex]);

  const currentFloors = building
    ? edificios[building].floors
    : [];

  const roomsList = useMemo(() => {
    if (!planData) return [];
    return planData.zones.filter(z =>
      z.id.toLowerCase().startsWith('aula')
    );
  }, [planData]);

  const showTip = (text: string) => {
    setTooltip(text);
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 200, useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }),
    ]).start(() => setTooltip(null));
  };

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
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <BuildingSelector
        building={building}
        showMenu={showMenu}
        onToggle={() => setShowMenu(v => !v)}
        onSelect={bk => {
          setBuilding(bk);
          setFloorIndex(0);
          setSelectedZoneId(null);
          setZoomParams(null);
          setShowMenu(false);
        }}
      />

      <RoomSelector
        showRooms={showRooms}
        onToggle={() => setShowRooms(v => !v)}
        rooms={roomsList}
        onSelect={handleSelectZone}
      />

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

          {currentFloors.length > 1 && (
            <FloorControls
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
          )}

          {tooltip && <Tooltip text={tooltip} opacity={fadeAnim} />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
});
