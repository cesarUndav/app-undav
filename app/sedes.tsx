import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import CustomText from '../components/CustomText';
import { useRouter } from 'expo-router';
import BottomBar from '../components/BottomBar';


const sedes = [
  {
    nombre: 'Sede España, Rectorado',
    direccion: 'España 350 esq. Colón, Avellaneda',
    telefono: '5436-7553',
    imagen: require('../assets/images/sedes/espana.png'),
    maps: 'https://maps.google.com/?q=España+350+Avellaneda',
  },
  {
    nombre: 'Sede Piñeyro',
    direccion: 'Mario Bravo 1460 esq. Isleta, Piñeyro',
    imagen: require('../assets/images/sedes/pineyro.png'),
    maps: 'https://maps.google.com/?q=Mario+Bravo+1460+Piñeyro',
  },
  {
    nombre: 'Sede 12 de Octubre',
    direccion: '12 de Octubre 463, Avellaneda',
    imagen: require('../assets/images/sedes/12octubre.png'),
    maps: 'https://maps.google.com/?q=12+de+Octubre+463+Avellaneda',
  },
  {
    nombre: 'Sede Arenales',
    direccion: 'Arenales 320, Avellaneda',
    imagen: require('../assets/images/sedes/arenales.png'),
    maps: 'https://maps.google.com/?q=Arenales+320+Avellaneda',
  },
  {
    nombre: 'Sede Constitución',
    direccion: 'Constitución 627, Avellaneda',
    imagen: require('../assets/images/sedes/constitucion.png'),
    maps: 'https://maps.google.com/?q=Constitución+627+Avellaneda',
  },
  {
    nombre: 'Escuela Secundaria Técnica UNDAV',
    direccion: 'Av. Ramón Franco 6475, Wilde',
    telefono: '(54 11) 2142-4477',
    imagen: require('../assets/images/sedes/escuela.png'),
    maps: 'https://maps.google.com/?q=Av+Ramón+Franco+6475+Wilde',
  },
];

export default function Sedes() {
  const router = useRouter();

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        {sedes.map((sede, index) => (
          <View key={index} style={styles.card}>
            <Image source={sede.imagen} style={styles.image} />
            <View style={styles.info}>
              <CustomText style={styles.title}>{sede.nombre}</CustomText>
              <CustomText style={styles.text}>{sede.direccion}</CustomText>
              {sede.telefono && (
                <CustomText style={styles.text}>Tel: {sede.telefono}</CustomText>
              )}
              <TouchableOpacity onPress={() => Linking.openURL(sede.maps)}>
                <CustomText style={styles.link}>Ver en mapa</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomBar />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    elevation: 2,
    borderColor: '#0b5085',
    borderWidth: 4
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#0b254a',
  },
  text: {
    fontSize: 14,
    color: '#444',
  },
  link: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0b5085',
    textDecorationLine: 'underline',
  },
  page: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
