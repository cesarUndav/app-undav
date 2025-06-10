import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';

import { useRouter } from 'expo-router';
import CustomText from '../components/CustomText';

import {Ionicons } from '@expo/vector-icons';
import LinksIcon from '../assets/icons/links.svg';
import PreguntasIcon from '../assets/icons/preguntas.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';

import ContactoIcon from '../assets/icons/contacto.svg';
import SedesIcon from '../assets/icons/sedes.svg';

import BotonIconoTexto from '@/components/BotonFlexIconoTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { azulClaro, azulLogoUndav } from '@/constants/Colors';

const iconSize = 44;
const iconColor = "#fff";

export default function HomeEstudiante() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <FondoGradiente>

        <View style={styles.header}>
          <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />
          <CustomText style={styles.bannerText}>{"Ingreso 2do Cuatrimestre 2025:\n31/3/25 - 30/5/2025"}</CustomText>
        </View>

        <View style={[styles.buttonsRowParent,{flex: 1}]}>
          <TouchableOpacity style={styles.buttonBox} onPress={() => router.push('/oferta-academica')} accessible accessibilityLabel="Ir a oferta académica" >
            <Ionicons name="school-outline" size={80} color={iconColor} />
            <CustomText style={styles.buttonText}>OFERTA ACADÉMICA</CustomText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonsRowParent}> 
          <View style={styles.buttonsRow}>
            
            <BotonIconoTexto
              label={"TUTORIAL DE\nPREINSCRIPCIÓN"}
              funcionOnPress={() => router.push('/preinscripcion')}
              Icon={InscripcionesIcon}
              iconSize={iconSize}
              iconColor="white"
            />
            <BotonIconoTexto
              label={"PREGUNTAS\nFRECUENTES"}
              funcionOnPress={() => router.push('/preguntas-frecuentes')}
              Icon={PreguntasIcon}
              iconSize={iconSize}
              iconColor="white"
            />
          </View>
          <View style={styles.buttonsRow}>

            <BotonIconoTexto
              label={"REDES"}
              funcionOnPress={() => router.push('/redes')}
              Icon={LinksIcon}
              iconSize={iconSize}
              iconColor="white"
            />
            <BotonIconoTexto
              label={"SEDES"}
              funcionOnPress={() => router.push('/sedes')}
              Icon={SedesIcon}
              iconSize={iconSize}
              iconColor="white"
            />
            <BotonIconoTexto
              label={"CONTACTO"}
              funcionOnPress={() => router.push('/contacto')}
              Icon={ContactoIcon}
              iconSize={iconSize}
              iconColor="white"
            />
          </View>
        </View>

      </FondoGradiente>
    </SafeAreaView>
  );
}



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
    height: 60
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
    backgroundColor: azulLogoUndav,
    //marginVertical: 12,
    elevation: 4, // Android sombra
    shadowColor: '#000' // IOS sombra
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
    backgroundColor: azulClaro
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: "bold",
    color: iconColor,
    fontSize: 12,
    //fontStyle: 'italic'
  },
});
