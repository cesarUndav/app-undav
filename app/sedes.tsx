import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView } from 'react-native';
import CustomText from '../components/CustomText';
import { useRouter } from 'expo-router';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulClaro, azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';



const sedes = [
  {
    nombre: 'Sede España, Rectorado',
    direccion: 'España 350 esq. Colón, Avellaneda',
    telefono: '5436-7553',
    imagen: require('../assets/images/sedes/espana.png'),
    maps: 'https://maps.app.goo.gl/DhdRoZ6zAWa7kuzw7',
  },
  {
    nombre: 'Sede Piñeyro',
    direccion: 'Mario Bravo 1460 esq. Isleta, Piñeyro',
    imagen: require('../assets/images/sedes/pineyro.png'),
    maps: 'https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6',
  },
  {
    nombre: 'Sede 12 de Octubre',
    direccion: '12 de Octubre 463, Avellaneda',
    imagen: require('../assets/images/sedes/12octubre.png'),
    maps: 'https://maps.app.goo.gl/vMXto5voyPzwVtiv9',
  },
  {
    nombre: 'Sede Arenales',
    direccion: 'Arenales 320, Avellaneda',
    imagen: require('../assets/images/sedes/arenales.png'),
    maps: 'https://maps.app.goo.gl/K1xMeRZacUcayq368',
  },
  {
    nombre: 'Sede Constitución',
    direccion: 'Constitución 627, Avellaneda',
    imagen: require('../assets/images/sedes/constitucion.png'),
    maps: 'https://maps.app.goo.gl/ggNC4GSgoZVsQuX29',
  },
  {
    nombre: 'Escuela Secundaria Técnica UNDAV',
    direccion: 'Av. Ramón Franco 6475, Wilde',
    telefono: '(54 11) 2142-4477',
    imagen: require('../assets/images/sedes/escuela.png'),
    maps: 'https://maps.app.goo.gl/TAxU7qpSueUMzTNZ9',
  },
];

export default function Sedes() {
  const router = useRouter();

  return (
    <FondoScrollGradiente gap={15} style={{padding:15}}>
            <TouchableOpacity style={[styles.button, {backgroundColor: azulClaro}]} onPress={() => router.push("../planos")}>
              <CustomText weight="bold" style={styles.buttonText}>planos</CustomText>
            </TouchableOpacity>

        {sedes.map((sede, index) => (
          <View key={index} style={styles.card}>
              <TouchableOpacity onPress={() => Linking.openURL(sede.maps)}>
            <Image source={sede.imagen} style={styles.image} />
            <View style={styles.info}>
              <CustomText style={styles.title}>{sede.nombre}</CustomText>
              <CustomText style={styles.text}>{sede.direccion}</CustomText>
              {sede.telefono && (
                <CustomText style={styles.text}>Tel: {sede.telefono}</CustomText>
              )}
                <CustomText style={styles.link}>Toca para ver en Google Maps</CustomText>
            </View>
              </TouchableOpacity>
          </View>
        ))}
    </FondoScrollGradiente>
  );
  
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 15
    //backgroundColor: azulLogoUndav
    //color = azulMedioUndav,
  },
  card: {
    backgroundColor: azulLogoUndav,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    ...getShadowStyle(6)
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: "#fff" //negroAzulado,
  },
  text: {
    fontSize: 16,
    color: "#fff" //'#444',
  },
  link: {
    marginTop: 6,
    fontSize: 14,
    color: "#fff" //'#0b5085',
    //fontWeight: 'bold',
    // textDecorationLine: 'underline',
  },
  page: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
    button: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomRightRadius: 12,
    width: 240,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  }
});
