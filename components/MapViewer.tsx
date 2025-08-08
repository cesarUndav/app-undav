// components/MapViewer.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import SvgPanZoom from 'react-native-svg-pan-zoom';
import { ZoneType } from '../app/mapsConfig';

const PanZoom: React.ComponentType<any> = SvgPanZoom;

interface Props {
  SvgComponent: React.FC<any>;
  planData: { width: number; height: number; zones: ZoneType[] };
  containerW: number;
  containerH: number;
  selectedZoneId: string | null;
  onZonePress: (zoneId: string) => void;
  zoomParams: {
    key: string;
    zoom: number;
    x: number;
    y: number;
  } | null;
}

export default function MapViewer({
  SvgComponent, planData,
  containerW, containerH,
  selectedZoneId, onZonePress, zoomParams
}: Props) {
  return (
    <View style={[styles.wrapper, { width: containerW, height: containerH }]}>
      <PanZoom
        key={zoomParams?.key ?? 'map'}
        canvasWidth={planData.height}
        canvasHeight={planData.width}
        minScale={0.5}
        maxScale={2.5}
        initialZoom={zoomParams?.zoom ?? Math.min(containerW/planData.width, containerH/planData.height)}
        initialX={zoomParams?.x ?? 0}
        initialY={zoomParams?.y ?? 0}
      >
        <SvgComponent width={planData.width} height={planData.height} />
        <Svg width={planData.width} height={planData.height} style={StyleSheet.absoluteFill}>
          {planData.zones.map(z => (
            <Polygon
              key={z.id}
              points={z.points.map(p=>p.join(',')).join(' ')}
              fill={z.id === selectedZoneId ? 'rgba(255,200,0,0.3)' : 'transparent'}
              stroke={z.id === selectedZoneId ? '#FFA000' : 'none'}
              strokeWidth={2}
              onPress={() => onZonePress(z.id)}
            />
          ))}
        </Svg>
      </PanZoom>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 136,
    marginBottom: 10,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
