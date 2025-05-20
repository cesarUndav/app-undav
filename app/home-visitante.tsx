import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, Pressable, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomBarVisitante from '../components/BottomBarVisitante';
import CustomText from '../components/CustomText';

import {Ionicons } from '@expo/vector-icons';
import LinksIcon from '../assets/icons/links.svg';
import PreguntasIcon from '../assets/icons/preguntas.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';
import ReportesIcon from '../assets/icons/reportes.svg';
import ContactoIcon from '../assets/icons/contacto.svg';
import SedesIcon from '../assets/icons/sedes.svg';

import { Tabs } from 'expo-router';

export default function HomeEstudiante() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Tabs.Screen
        options ={{
          title: 'visitante',
          headerShown: false,
          animation: "none"
        }}
      />

      <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.containerGradient}>

        <View style={styles.header}>
          <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />
          <CustomText style={styles.bannerText}>{"Ingreso 2do Cuatrimestre 2025:\n31/3/25 - 30/5/2025"}</CustomText>
        </View>

        <View style={styles.buttonsRowParent}> 
          <TouchableOpacity accessible accessibilityLabel="Ir a oferta académica" style={styles.buttonBox} onPress={() => router.push('/vinculos')}>
            <Ionicons name="school-outline" size={80} color={iconColor} />
            <CustomText style={styles.buttonText}>OFERTA ACADÉMICA</CustomText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonsRowParent}> 
          <View style={styles.buttonsRow}>
            <TouchableOpacity accessible accessibilityLabel="Ir a inscripciones" style={styles.buttonBox} onPress={() => router.push('/inscripciones')}>
              <InscripcionesIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>TUTORIAL DE{"\n"}PREINSCRIPCIÓN</CustomText>
            </TouchableOpacity>
            <TouchableOpacity accessible accessibilityLabel="Ir a certificados y reportes" style={styles.buttonBox } onPress={() => router.push('/preguntas-frecuentes')}>
              <PreguntasIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>PREGUNTAS{"\n"}FRECUENTES</CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity accessible accessibilityLabel="Ir a vínculos" style={styles.buttonBox} onPress={() => router.push('/vinculos')}>
              <LinksIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>VÍNCULOS</CustomText>
            </TouchableOpacity>

            <TouchableOpacity accessible accessibilityLabel="Ir a sedes" style={styles.buttonBox} onPress={() => router.push('/sedes')}>
              <SedesIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>SEDES</CustomText>
            </TouchableOpacity>

            <TouchableOpacity accessible accessibilityLabel="Ir a contacto" style={styles.buttonBox} onPress={() => router.push('/contacto')}>
              <ContactoIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>CONTACTO</CustomText>
            </TouchableOpacity>
          </View>
        </View>

      </LinearGradient>
    
    <BottomBarVisitante />
    </SafeAreaView>
  );
}

const iconSize = "40%";
const iconColor = "#fff";
//const iconColor = "#1c2f4a";

const styles = StyleSheet.create({
  containerGradient: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 12,
    paddingVertical: 12
  },
  header: { //header
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 60,
    //marginVertical: 10,
    //backgroundColor: "red"
  },
  logoUndav: {
    height: "100%",
    aspectRatio: "1 / 1.22",
    width: "auto",
    resizeMode: "contain"
  },
  bannerText: {
    flex: 1,
    paddingLeft: 15,
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    color: "black",
    fontWeight: "bold",
    fontSize: 15
    //backgroundColor: "red"
  },
  buttonsRowParent: { //buttons
    flex: 0.6, // tamaño de botones con respecto a lista
    gap: 10,
    padding: 10,
    borderBottomRightRadius: 24,
    backgroundColor: '#1c2f4a',
    //marginVertical: 12,
    elevation: 4
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  buttonBox: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 20,
    //backgroundColor: 'white'
    //backgroundColor: #005BA4'#1c2f4a'
    backgroundColor:"#005BA4"
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: "bold",
    color: iconColor,
    fontSize: 12,
    //fontStyle: 'italic'
  },
});
