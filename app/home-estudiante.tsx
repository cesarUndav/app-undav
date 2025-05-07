import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, Pressable, AccessibilityInfo } from 'react-native';
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

import { Tabs } from 'expo-router';

const iconSize = 64;

export default function HomeEstudiante() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Tabs.Screen
        options ={{
          title: 'inicio',
          headerShown: false
        }}
      />

      <LinearGradient colors={['#ffffff', '#989797']} style={styles.container}>
        <View style={styles.container}>

          {/* CABECERA CON DATOS Y LOGO */}
          <View style={styles.header}>
            <Image source={require('../assets/images/logo_undav.png')} style={styles.logo} />
            <View style={styles.userInfo}>
              <CustomText style={styles.userName}>Gonzalo Gerardo{"\n"}García Gutierrez</CustomText>
              <CustomText style={styles.userLegajo}>Legajo: 12345</CustomText>
            </View>
            <Image source={require('../assets/icons/undav.png')} style={styles.profileIcon} />
          </View>

          {/* AGENDA */}
          <AgendaPreview />

          {/* BOTONES */}
          <View style={styles.buttonsRowParent}> {/*CAJA DE BOTONES*/}

            <View style={styles.buttonsRow}> {/*FILA 1 DE BOTONES*/}

              <Pressable accessible accessibilityLabel="Ir a certificados y reportes" style={styles.buttonBox } onPress={() => router.push('/certificados')}>
                <ReportesIcon width={iconSize} height={iconSize} fill="white" />
                <CustomText style={styles.buttonText}>CERTIFICADOS{"\n"}Y REPORTES</CustomText>
              </Pressable>

              <Pressable accessible accessibilityLabel="Ir a inscripciones" style={[styles.buttonBox, { backgroundColor: '#04764c' }]} onPress={() => router.push('/inscripciones')}>
                <InscripcionesIcon width={iconSize} height={iconSize} fill="white" />
                <CustomText style={styles.buttonText}>INSCRIPCIONES</CustomText>
              </Pressable>

            </View>
            
            <View style={styles.buttonsRow}> {/*FILA 2 DE BOTONES*/}

            <Pressable accessible accessibilityLabel="Ir a preguntas frecuentes" style={[styles.buttonBox, { backgroundColor: '#0b254a' }]} onPress={() => router.push('/preguntas-frecuentes')}>
                <PreguntasIcon width={iconSize} height={iconSize} fill="white" />
                <CustomText style={styles.buttonText}>PREGUNTAS{"\n"}FRECUENTES</CustomText>
              </Pressable>
              
              <Pressable accessible accessibilityLabel="Ir a sedes" style={[styles.buttonBox, { backgroundColor: '#a56dd0' }]} onPress={() => router.push('/sedes')}>
                <SedesIcon width={iconSize} height={iconSize} fill="white" />
                <CustomText style={styles.buttonText}>SEDES</CustomText>
              </Pressable>

              <Pressable accessible accessibilityLabel="Ir a contacto" style={[styles.buttonBox, { backgroundColor: '#2396dd' }]} onPress={() => router.push('/contacto')}>
                <ContactoIcon width={iconSize} height={iconSize} fill="white" />
                <CustomText style={styles.buttonText}>CONTACTO</CustomText>
              </Pressable>

            </View>
            
          </View>
        </View>

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
  header: { //header
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 0,
    paddingBottom: 0,
    height: 80
  },
  logo: {
    width: 58,
    height: 70,
    resizeMode: 'contain'
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
    paddingTop: -2
  },
  userLegajo: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
    textAlign: 'right',
    margin: 0,
    //position: 'relative'
  },
  profileIcon: {
    width: 70,
    height: 70,
    tintColor: '#444',
    borderBottomRightRadius: 12
  },
  buttonsRowParent: { //buttons
    flex: 0.7, // tamaño de botones con respecto a lista
    padding: 10,
    gap: 10
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  buttonBox: {
    //height: "calc((40vh - 50px) / 2)", /* altura del celu - altura de demás elementos de la pantalla = espacio disponible */
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 20,
    backgroundColor: '#444'
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: "bold",
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic'
  },
});
