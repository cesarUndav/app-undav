{/*planos.tsx*/}
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import SvgPanZoom from 'react-native-svg-pan-zoom';
import CustomText from "../components/CustomText";
{/*Alias para permitir children en TS*/}
const PanZoom: React.ComponentType<any> = SvgPanZoom;

{/*Importa config centralizada*/}
import {
  edificios,
  coordsMap,
  BuildingKey,
  PlanData,
  ZoneType
} from './mapsConfig';

export default function Planos() {
  const [building, setBuilding] = useState<"" | BuildingKey>("");
  const [showMenu, setShowMenu] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panZoomRef = useRef<any>(null);

  const { width: winW, height: winH } = Dimensions.get('window');
  const containerW = winW -32;
  const containerH = winH - 300;

  const toggleMenu = () => setShowMenu(v => !v);
  const toggleRooms = () => setShowRooms(v => !v);

  {/*Obtiene datos del plano seleccionado*/}
  const planData = useMemo<PlanData | null>(() => {
    if (!building) return null;
    const key = edificios[building].floors[floorIndex].key;
    return coordsMap[building][key] || null;
  }, [building, floorIndex]);

  {/*Obtiene pisos actuales para evitar acceso con clave indefinida*/}
  const currentFloors = building ? edificios[building].floors : [];

  {/*Lista de aulas actuales*/}
  const roomsList = useMemo(() => {
    if (!planData) return [];
    return planData.zones.filter(z => z.id.toLowerCase().startsWith('aula'));
  }, [planData]);

  {/*Muestra tooltip*/}
  const showTip = (text: string) => {
    setTooltip(text);
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setTooltip(null));
  };

  {/*Dibuja zonas interactivas*/}
  const renderZones = () => {
    if (!planData) return null;
    return planData.zones.map((zone: ZoneType) => (
      <Polygon
        key={zone.id}
        points={zone.points.map(p => p.join(',')).join(' ')}
        fill="transparent"
        onPress={() => showTip(zone.name)}
      />
    ));
  };

  {/* SVG componente de la planta actual*/}
  const SelectedSvg = building && planData
    ? currentFloors[floorIndex].SvgComponent
    : null;

  return (
    <View style={styles.container}>
      {/* Selector de edificio */}
      <View style={styles.dropdownWrapper}>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleMenu}>
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
                  panZoomRef.current?.reset();
                  setShowMenu(false);
                }}>
                <CustomText style={styles.dropdownItemText}>{info.label}</CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Selector de aulas */}
      {building && (
        <View style={[styles.dropdownWrapper, styles.roomDropdownWrapper]}>
          <TouchableOpacity style={styles.dropdownButton} onPress={toggleRooms}>
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
                  onPress={() => { setShowRooms(false); showTip(zone.name); }}>
                  <CustomText style={styles.dropdownItemText}>{zone.name}</CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Visualización del plano */}
      {SelectedSvg && planData && (
        <View style={[styles.mapWrapper, { width: containerW, height: containerH}]}> 
          <PanZoom
            ref={panZoomRef}
            canvasWidth={planData.width}
            canvasHeight={planData.height}
            minScale={0.5}
            maxScale={2.5}
            initialZoom={Math.min(containerW/planData.width, containerH/planData.height)}
            initialX={0}
            initialY={0}
          >
            <SelectedSvg width={planData.width} height={planData.height} />
            <Svg width={planData.width} height={planData.height} style={StyleSheet.absoluteFill}>
              {renderZones()}
            </Svg>
          </PanZoom>

          {currentFloors.length > 1 && (
            <View style={styles.floorControls}>
              <TouchableOpacity
                onPress={() => floorIndex > 0 && (setFloorIndex(i => i-1), panZoomRef.current?.reset())}
                disabled={floorIndex === 0}>
                <CustomText style={styles.floorButton}>Anterior</CustomText>
              </TouchableOpacity>
              <CustomText style={styles.floorLabel}>{`Planta ${floorIndex+1}`}</CustomText>
              <TouchableOpacity
                onPress={() => floorIndex < currentFloors.length-1 && (setFloorIndex(i => i+1), panZoomRef.current?.reset())}
                disabled={floorIndex === currentFloors.length-1}>
                <CustomText style={styles.floorButton}>Siguiente</CustomText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Tooltip */}
      {tooltip && (
        <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>  
          <CustomText style={styles.tooltipText}>{tooltip}</CustomText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  dropdownWrapper: { position: 'absolute', top: 16, left: 0, right: 0, paddingHorizontal: 16, zIndex:30, elevation:5 },
  roomDropdownWrapper: { position:'absolute', top:72, left:0, right:0, paddingHorizontal:16, zIndex:20, elevation:4 },
  dropdownButton: { height:40, borderWidth:1, borderColor:'#ccc', borderRadius:6, justifyContent:'center', paddingHorizontal:12, backgroundColor:'#fff' },
  dropdownButtonText: { fontSize:16, color:'#333' },
  dropdownMenu: { marginTop:4, backgroundColor:'#fff', borderWidth:1, borderColor:'#ccc', borderRadius:6, maxHeight:200 },
  dropdownItem: { paddingVertical:10, paddingHorizontal:12 },
  dropdownItemText: { fontSize:16, color:'#333' },
  mapWrapper: { marginTop:136, marginBottom:10, marginHorizontal:16, backgroundColor:'#fff', borderRadius:12, overflow:'hidden', shadowColor:'#000', shadowOffset:{ width:0, height:2 }, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
  floorControls: { position:'absolute', bottom:16, left:0, right:0, flexDirection:'row', justifyContent:'space-around' },
  floorButton: { padding:8, backgroundColor:'#2196F3', color:'#fff', borderRadius:4 },
  floorLabel: { alignSelf:'center', fontWeight:'600' },
  tooltip: { position:'absolute', top:60, left:20, right:20, backgroundColor:'rgba(0,0,0,0.7)', padding:8, borderRadius:4 },
  tooltipText: { color:'#fff', textAlign:'center' },
});
