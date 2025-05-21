import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomBar from '../components/BottomBar';
import CustomText from '../components/CustomText';
import AgendaPreview from '../components/AgendaPreview';

import LinksIcon from '../assets/icons/links.svg';
import PreguntasIcon from '../assets/icons/preguntas.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';
import ReportesIcon from '../assets/icons/reportes.svg';
import ContactoIcon from '../assets/icons/contacto.svg';
import SedesIcon from '../assets/icons/sedes.svg';

import { Tabs } from 'expo-router';

import { usuarioActual } from '../data/DatosUsuarioGuarani';

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

      <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.containerGradient}>

        <View style={styles.header}>
          <Image source={require('../assets/icons/undav.png')} style={styles.profileIcon} />
          <View style={styles.userInfo}>
            <CustomText style={[styles.userText, {alignContent: "flex-end"}]}>{"Bienvenido de vuelta,"}</CustomText>
            <CustomText style={[styles.userText, {alignContent: "flex-end"}]}>{usuarioActual.nombreCompleto}</CustomText>
            {/* <CustomText style={[styles.userText, {alignContent: "flex-end"}]}>Gonzalo Gerardo{"\n"}García Gutierrez</CustomText> */}
            <CustomText style={[styles.userText, {color: '#444'}]}>{"ID: "+usuarioActual.idPersona}</CustomText>
          </View>
          <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />
          </View>
          
        <AgendaPreview />

        <View style={styles.buttonsRowParent}> 
          <View style={styles.buttonsRow}>
            <TouchableOpacity accessible accessibilityLabel="Ir a certificados y reportes" style={styles.buttonBox } onPress={() => router.push('/certificados')}>
              <ReportesIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>CERTIFICADOS{"\n"}Y REPORTES</CustomText>
            </TouchableOpacity>

            <TouchableOpacity accessible accessibilityLabel="Ir a inscripciones" style={styles.buttonBox} onPress={() => router.push('/inscripciones')}>
              <InscripcionesIcon width={iconSize} height={iconSize} fill={iconColor} />
              <CustomText style={styles.buttonText}>INSCRIPCIONES</CustomText>
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
    
    <BottomBar />
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
  userInfo: {
    //backgroundColor: "green",
    flexDirection: "column",
    height: "100%",
    flex: 1,
    paddingLeft: 10
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    fontWeight: '600',    
    textAlign: 'left'
  },
  profileIcon: {
    height: "100%",
    aspectRatio: "1 / 1",
    width: "auto",
    tintColor: '#444',
    borderBottomRightRadius: 12
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
