import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../components/CustomText';
import { useRouter } from 'expo-router';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

const sedes = [
  {
    nombre: 'Sede España, Rectorado',
    direccion: 'España 350 esq. Colón, Avellaneda',
    telefono: '5436-7553',
    imagen: require('../assets/images/sedes/espana.png'),
    maps: 'https://maps.app.goo.gl/DhdRoZ6zAWa7kuzw7',
    latitud: -34.6629898,
    longitud: -58.3722513,
  },
  {
    nombre: 'Sede Piñeyro',
    direccion: 'Mario Bravo 1460 esq. Isleta, Piñeyro',
    imagen: require('../assets/images/sedes/pineyro.png'),
    maps: 'https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6',
    latitud: -34.6687001,
    longitud: -58.3986248,
  },
  {
    nombre: 'Sede 12 de Octubre',
    direccion: '12 de Octubre 463, Avellaneda',
    imagen: require('../assets/images/sedes/12octubre.png'),
    maps: 'https://maps.app.goo.gl/vMXto5voyPzwVtiv9',
    latitud: -34.6606684,
    longitud: -58.3557164,
  },
  {
    nombre: 'Sede Arenales',
    direccion: 'Arenales 320, Avellaneda',
    imagen: require('../assets/images/sedes/arenales.png'),
    maps: 'https://maps.app.goo.gl/K1xMeRZacUcayq368',
    latitud: -34.6678391,
    longitud: -58.3630914,
  },
  {
    nombre: 'Sede Constitución',
    direccion: 'Constitución 627, Avellaneda',
    imagen: require('../assets/images/sedes/constitucion.png'),
    maps: 'https://maps.app.goo.gl/ggNC4GSgoZVsQuX29',
    latitud: -34.6663623,
    longitud: -58.3707415,
  },
  {
    nombre: 'Escuela Secundaria Técnica UNDAV',
    direccion: 'Av. Ramón Franco 6475, Wilde',
    telefono: '(54 11) 2142-4477',
    imagen: require('../assets/images/sedes/escuela.png'),
    maps: 'https://maps.app.goo.gl/TAxU7qpSueUMzTNZ9',
    latitud: -34.7001353,
    longitud: -58.3065872,
  },
];

export default function Sedes() {
  const router = useRouter();

  return (
    <FondoScrollGradiente gap={15} style={{ padding: 15 }}>
      {sedes.map((sede, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/sede-mapa',
                params: {
                  nombre: sede.nombre,
                  direccion: sede.direccion,
                  maps: sede.maps,
                  lat: sede.latitud,
                  lng: sede.longitud,
                },
              })
            }
          >
            <Image source={sede.imagen} style={styles.image} />

            <View style={styles.info}>
              <CustomText weight="bold" style={styles.title}>
                {sede.nombre}
              </CustomText>

              <CustomText style={styles.text}>
                {sede.direccion}
              </CustomText>

              {sede.telefono && (
                <CustomText style={styles.text}>
                  Tel: {sede.telefono}
                </CustomText>
              )}

              <CustomText style={styles.link}>
                Toca para ver el mapa
              </CustomText>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: azulLogoUndav,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    ...getShadowStyle(6),
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    color: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  link: {
    marginTop: 6,
    fontSize: 14,
    color: '#fff',
  },
});