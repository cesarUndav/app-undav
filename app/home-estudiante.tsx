import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Pressable, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomBar from '../components/BottomBar';
import CustomText from '../components/CustomText';
import AgendaPreview from '../components/AgendaPreview';

import PreguntasIcon from '../assets/icons/preguntas.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';
import ReportesIcon from '../assets/icons/reportes.svg';
import ContactoIcon from '../assets/icons/contacto.svg';
import SedesIcon from '../assets/icons/sedes.svg';

export default function HomeEstudiante() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#ffffff', '#989797']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* CABECERA CON DATOS Y LOGO */}
          <View style={styles.header}>
            <Image source={require('../assets/images/logo_undav.png')} style={styles.logo} />
            <View style={styles.userInfo}>
              <CustomText style={styles.userName}>Deniz Undav</CustomText>
              <CustomText style={styles.userLegajo}>Leg: 11978</CustomText>
            </View>
            <Image source={require('../assets/icons/undav.png')} style={styles.profileIcon} />
          </View>

          {/* AGENDA */}
          <AgendaPreview />

          {/* BOTONES */}
          <View style={styles.buttonsGrid}>
            <Pressable accessible accessibilityLabel="Ir a preguntas frecuentes" style={styles.buttonBox} onPress={() => router.push('/preguntas-frecuentes')}>
              <PreguntasIcon width={40} height={40} fill="white" />
              <CustomText style={styles.buttonText}>PREGUNTAS{"\n"}FRECUENTES</CustomText>
            </Pressable>

            <Pressable accessible accessibilityLabel="Ir a inscripciones" style={[styles.buttonBox, { backgroundColor: '#04764c' }]} onPress={() => router.push('/inscripciones')}>
              <InscripcionesIcon width={40} height={40} fill="white" />
              <CustomText style={styles.buttonText}>INSCRIPCIONES</CustomText>
            </Pressable>

            <Pressable accessible accessibilityLabel="Ir a certificados y reportes" style={[styles.buttonBox, { backgroundColor: '#0b254a' }]} onPress={() => router.push('/certificados')}>
              <ReportesIcon width={40} height={40} fill="white" />
              <CustomText style={styles.buttonText}>CERTIFICADOS{"\n"}Y REPORTES</CustomText>
            </Pressable>

            <Pressable accessible accessibilityLabel="Ir a contacto" style={[styles.buttonBox, { backgroundColor: '#2396dd' }]} onPress={() => router.push('/contacto')}>
              <ContactoIcon width={40} height={40} fill="white" />
              <CustomText style={styles.buttonText}>CONTACTO</CustomText>
            </Pressable>

            <Pressable accessible accessibilityLabel="Ir a sedes" style={[styles.buttonBox, { backgroundColor: '#a56dd0' }]} onPress={() => router.push('/sedes')}>
              <SedesIcon width={40} height={40} fill="white" />
              <CustomText style={styles.buttonText}>SEDES</CustomText>
            </Pressable>
          </View>
        </ScrollView>

        {/* BARRA INFERIOR */}
        <BottomBar />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 70,
    resizeMode: 'contain',
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  userLegajo: {
    fontSize: 14,
    color: '#444',
    textAlign: 'right',
  },
  profileIcon: {
    width: 40,
    height: 40,
    tintColor: '#0b254a',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 10,
  },
  buttonBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#444',
    borderBottomRightRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
