// app/sede-mapa.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import CustomText from '@/components/CustomText';
import { azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

export default function SedeMapa() {
  const { nombre, direccion, maps, lat, lng } = useLocalSearchParams();

  const latitude = Number(lat);
  const longitude = Number(lng);

  const abrirGoogleMaps = () => {
    if (maps) {
      Linking.openURL(String(maps));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <CustomText weight="bold" style={styles.title}>
          {String(nombre)}
        </CustomText>

        <CustomText style={styles.address}>
          {String(direccion)}
        </CustomText>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={String(nombre)}
          description={String(direccion)}
        />
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={abrirGoogleMaps}
        >
          <CustomText weight="bold" style={styles.buttonText}>
            Abrir en Google Maps
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  info: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: azulLogoUndav,
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  address: {
    color: '#fff',
    fontSize: 15,
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: azulLogoUndav,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomRightRadius: 18,
    ...getShadowStyle(4),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});