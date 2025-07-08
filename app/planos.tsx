// import React, { useState, useRef } from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { Svg, Polygon } from 'react-native-svg';
// import SvgPanZoom from 'react-native-svg-pan-zoom';
// // Alias para permitir children en TS
// const PanZoom: React.ComponentType<any> = SvgPanZoom;

// // SVG Imports
// import Espana0 from '../assets/maps/Espana/espana0.svg';
// import Arenales0 from '../assets/maps/Arenales/arenales0.svg';
// import Arenales1 from '../assets/maps/Arenales/arenales1.svg';
// import Arenales2 from '../assets/maps/Arenales/arenales2.svg';
// import Arenales3 from '../assets/maps/Arenales/arenales3.svg';
// import PineyroA0 from '../assets/maps/PineyroA/pineyroA0.svg';
// import PineyroA1 from '../assets/maps/PineyroA/pineyroA1.svg';
// import PineyroA2 from '../assets/maps/PineyroA/pineyroA2.svg';
// import PineyroA3 from '../assets/maps/PineyroA/pineyroA3.svg';
// import PineyroB0 from '../assets/maps/PineyroB/pineyroB0.svg';
// import PineyroB1 from '../assets/maps/PineyroB/pineyroB1.svg';
// import PineyroB2 from '../assets/maps/PineyroB/pineyroB2.svg';
// import PineyroB3 from '../assets/maps/PineyroB/pineyroB3.svg';
// import PineyroC0 from '../assets/maps/PineyroC/pineyroC0.svg';
// import PineyroC1 from '../assets/maps/PineyroC/pineyroC1.svg';
// import PineyroC2 from '../assets/maps/PineyroC/pineyroC2.svg';
// import PineyroC3 from '../assets/maps/PineyroC/pineyroC3.svg';

// // JSON Imports
// import espana0Coords from '../assets/maps/Espana/espana0.json';
// import arenales0Coords from '../assets/maps/Arenales/arenales0.json';
// import arenales1Coords from '../assets/maps/Arenales/arenales1.json';
// import arenales2Coords from '../assets/maps/Arenales/arenales2.json';
// import arenales3Coords from '../assets/maps/Arenales/arenales3.json';
// import pineyroA0Coords from '../assets/maps/PineyroA/pineyroA0.json';
// import pineyroA1Coords from '../assets/maps/PineyroA/pineyroA1.json';
// import pineyroA2Coords from '../assets/maps/PineyroA/pineyroA2.json';
// import pineyroA3Coords from '../assets/maps/PineyroA/pineyroA3.json';
// import pineyroB0Coords from '../assets/maps/PineyroB/pineyroB0.json';
// import pineyroB1Coords from '../assets/maps/PineyroB/pineyroB1.json';
// import pineyroB2Coords from '../assets/maps/PineyroB/pineyroB2.json';
// import pineyroB3Coords from '../assets/maps/PineyroB/pineyroB3.json';
// import pineyroC0Coords from '../assets/maps/PineyroC/pineyroC0.json';
// import pineyroC1Coords from '../assets/maps/PineyroC/pineyroC1.json';
// import pineyroC2Coords from '../assets/maps/PineyroC/pineyroC2.json';
// import pineyroC3Coords from '../assets/maps/PineyroC/pineyroC3.json';

// // Types
// interface ZoneType { id: string; name: string; points: number[][] }
// type BuildingKey = 'Espana' | 'Arenales' | 'PineyroA' | 'PineyroB' | 'PineyroC';
// type FloorEntry = { key: string; SvgComponent: React.FC<any> };

// // Building definitions
// const edificios: Record<BuildingKey, { label: string; floors: FloorEntry[] }> = {
//   Espana: { label: 'España', floors: [{ key: '0', SvgComponent: Espana0 }] },
//   Arenales: {
//     label: 'Arenales',
//     floors: [
//       { key: '0', SvgComponent: Arenales0 },
//       { key: '1', SvgComponent: Arenales1 },
//       { key: '2', SvgComponent: Arenales2 },
//       { key: '3', SvgComponent: Arenales3 },
//     ],
//   },
//   PineyroA: {
//     label: 'Piñeyro A',
//     floors: [
//       { key: '0', SvgComponent: PineyroA0 },
//       { key: '1', SvgComponent: PineyroA1 },
//       { key: '2', SvgComponent: PineyroA2 },
//       { key: '3', SvgComponent: PineyroA3 },
//     ],
//   },
//   PineyroB: {
//     label: 'Piñeyro B',
//     floors: [
//       { key: '0', SvgComponent: PineyroB0 },
//       { key: '1', SvgComponent: PineyroB1 },
//       { key: '2', SvgComponent: PineyroB2 },
//       { key: '3', SvgComponent: PineyroB3 },
//     ],
//   },
//   PineyroC: {
//     label: 'Piñeyro C',
//     floors: [
//       { key: '0', SvgComponent: PineyroC0 },
//       { key: '1', SvgComponent: PineyroC1 },
//       { key: '2', SvgComponent: PineyroC2 },
//       { key: '3', SvgComponent: PineyroC3 },
//     ],
//   },
// };

// // Lookup for coords
// const coordsMap: Record<BuildingKey, Record<string, ZoneType[]>> = {
//   Espana: { '0': espana0Coords },
//   Arenales: {
//     '0': arenales0Coords,
//     '1': arenales1Coords,
//     '2': arenales2Coords,
//     '3': arenales3Coords,
//   },
//   PineyroA: {
//     '0': pineyroA0Coords,
//     '1': pineyroA1Coords,
//     '2': pineyroA2Coords,
//     '3': pineyroA3Coords,
//   },
//   PineyroB: {
//     '0': pineyroB0Coords,
//     '1': pineyroB1Coords,
//     '2': pineyroB2Coords,
//     '3': pineyroB3Coords,
//   },
//   PineyroC: {
//     '0': pineyroC0Coords,
//     '1': pineyroC1Coords,
//     '2': pineyroC2Coords,
//     '3': pineyroC3Coords,
//   },
// };

// export default function Planos() {
//   const [building, setBuilding] = useState<"" | BuildingKey>("");
//   const [floorIndex, setFloorIndex] = useState(0);
//   const [tooltip, setTooltip] = useState<string | null>(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const panZoomRef = useRef<any>(null);
//   const { width, height } = Dimensions.get('window');

//   const showTooltip = (text: string) => {
//     setTooltip(text);
//     fadeAnim.setValue(0);
//     Animated.sequence([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
//       Animated.delay(2000),
//       Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
//     ]).start(() => setTooltip(null));
//   };

//   const renderZones = () => {
//     if (!building) return null;
//     const key = edificios[building].floors[floorIndex].key;
//     const coords = coordsMap[building][key] || [];
//     return coords.map((zone) => (
//       <Polygon
//         key={zone.id}
//         points={zone.points.map((p) => p.join(',')).join(' ')}
//         fill="black"
//         fillOpacity={0.01}
//         onPress={() => showTooltip(zone.name)}
//       />
//     ));
//   };

//   const SelectedSvg = building
//     ? edificios[building].floors[floorIndex].SvgComponent
//     : null;

//   return (
//     <View style={styles.container}>
//       <View style={styles.pickerContainer}>
//         <Picker
//           mode="dropdown"
//           prompt="Seleccionar Edificio"
//           selectedValue={building}
//           onValueChange={(value: "" | BuildingKey) => {
//             setBuilding(value);
//             setFloorIndex(0);
//             panZoomRef.current?.reset();
//           }}
//           style={styles.picker}
//           itemStyle={styles.pickerItem}
//           dropdownIconColor="#000"
//         >
//           <Picker.Item label="Seleccionar Edificio" value="" />
//           {Object.entries(edificios).map(([key, info]) => (
//             <Picker.Item key={key} label={info.label} value={key as BuildingKey} />
//           ))}
//         </Picker>
//       </View>

//       {building !== "" && SelectedSvg && (
//         <View style={styles.mapWrapper}>
//           <PanZoom
//             ref={panZoomRef}
//             canvasWidth={width - 32}
//             canvasHeight={height - 150}
//             minScale={1}
//             maxScale={2}
//             initialZoom={1}
//             initialX={0}
//             initialY={0}
//           >
//             <SelectedSvg width={width - 32} height={height - 150} />
//             <Svg width={width - 32} height={height - 150} style={StyleSheet.absoluteFill}>
//               {renderZones()}
//             </Svg>
//           </PanZoom>

//           {edificios[building].floors.length > 1 && (
//             <View style={styles.floorControls}>
//               <TouchableOpacity
//                 onPress={() => {
//                   if (floorIndex > 0) {
//                     setFloorIndex((i) => i - 1);
//                     panZoomRef.current?.reset();
//                   }
//                 }}
//                 disabled={floorIndex === 0}
//               >
//                 <Text style={styles.floorButton}>Anterior</Text>
//               </TouchableOpacity>
//               <Text style={styles.floorLabel}>{`Planta ${floorIndex + 1}`}</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   if (floorIndex < edificios[building].floors.length - 1) {
//                     setFloorIndex((i) => i + 1);
//                     panZoomRef.current?.reset();
//                   }
//                 }}
//                 disabled={floorIndex === edificios[building].floors.length - 1}
//               >
//                 <Text style={styles.floorButton}>Siguiente</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       )}

//       {tooltip && (
//         <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>  
//           <Text style={styles.tooltipText}>{tooltip}</Text>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f2f2f2' },
//   pickerContainer: {
//     width: '100%',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//     zIndex: 10,
//   },
//   picker: { height: 50, color: '#000' },
//   pickerItem: { color: '#000' },
//   mapWrapper: {
//     flex: 1,
//     margin: 16,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   floorControls: {
//     position: 'absolute',
//     bottom: 16,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   floorButton: {
//     padding: 8,
//     backgroundColor: '#2196F3',
//     color: '#fff',
//     borderRadius: 4,
//   },
//   floorLabel: { alignSelf: 'center', fontWeight: '600' },
//   tooltip: {
//     position: 'absolute',
//     top: 60,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     padding: 8,
//     borderRadius: 4,
//   },
//   tooltipText: { color: '#fff', textAlign: 'center' },
// });
