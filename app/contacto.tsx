import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomBar from '../components/BottomBar';
import CustomText from '../components/CustomText';

export default function Contacto() {
  const abrirEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const llamar = (telefono: string) => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <CustomText style={styles.titulo}>Contacto</CustomText>

          <View style={styles.bloque}>
            <CustomText style={styles.subtitulo}>Secretaría Académica</CustomText>
            <TouchableOpacity onPress={() => abrirEmail('academica@undav.edu.ar')}>
              <CustomText style={styles.link}>academica@undav.edu.ar</CustomText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => llamar('01142019999')}>
              <CustomText style={styles.link}>Tel: (011) 4201-9999</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.bloque}>
            <CustomText style={styles.subtitulo}>Soporte Técnico</CustomText>
            <TouchableOpacity onPress={() => abrirEmail('soporte@undav.edu.ar')}>
              <CustomText style={styles.link}>soporte@undav.edu.ar</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.bloque}>
            <CustomText style={styles.subtitulo}>Dirección</CustomText>
            <CustomText style={styles.direccion}>
              España 350, Avellaneda, Buenos Aires, Argentina
            </CustomText>
          </View>
        </ScrollView>

        <BottomBar />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#0b254a',
    marginBottom: 20,
  },
  bloque: {
    backgroundColor: '#e3f0fb',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0b5085',
  },
  link: {
    fontSize: 15,
    color: '#0068b3',
    marginBottom: 5,
  },
  direccion: {
    fontSize: 15,
    color: '#333',
  },
});
