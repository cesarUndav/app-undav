import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomBar from '../components/BottomBar';
import CustomText from '../components/CustomText';

export default function Contacto() {
  const abrirEnNavegador = (sitio: string) => {
    Linking.openURL(sitio);
  };

  return ( // Despues lo hago lindo, con botones como los del Inicio
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style = {styles.bloque} onPress={() => abrirEnNavegador('https://undav.edu.ar/index.php')}>
            <CustomText style={styles.subtitulo}>Web UNDAV</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.bloque} onPress={() => abrirEnNavegador('https://www.youtube.com/@UNDAVOficial/featured')}>
            <CustomText style={styles.subtitulo}>Youtube</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.bloque} onPress={() => abrirEnNavegador('https://www.instagram.com/undav_oficial/?hl=es')}>
            <CustomText style={styles.subtitulo}>Instagram</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.bloque} onPress={() => abrirEnNavegador('https://www.facebook.com/UNDAV2011')}>
            <CustomText style={styles.subtitulo}>Facebook</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.bloque} onPress={() => abrirEnNavegador('https://x.com/UNDAVOFICIAL')}>
            <CustomText style={styles.subtitulo}>X / Twitter</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.bloque} onPress={() => abrirEnNavegador('https://www.linkedin.com/school/universidad-nacional-de-avellaneda-undav-/')}>
            <CustomText style={styles.subtitulo}>LinkedIn</CustomText>
          </TouchableOpacity>
          

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
    padding: 15,
    gap: 10
  },
  bloque: {
    //backgroundColor: '#e3f0fb',
    backgroundColor: '#fff',
    borderBottomRightRadius: 20,
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 15,
    elevation: 6
  },
  subtitulo: {
    fontSize: 16,
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
