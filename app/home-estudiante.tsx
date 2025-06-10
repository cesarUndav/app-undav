import React from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';

import { useRouter } from 'expo-router';
import CustomText from '../components/CustomText';
import AgendaPreview from '../components/AgendaPreview';

import LinksIcon from '../assets/icons/links.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';
import ReportesIcon from '../assets/icons/reportes.svg';


import { infoBaseUsuarioActual, UsuarioEsAutenticado } from '../data/DatosUsuarioGuarani';
import BotonIconoTexto from '@/components/BotonFlexIconoTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { azulClaro, azulLogoUndav } from '@/constants/Colors';

export default function HomeEstudiante() {

  const router = useRouter();

  const nombreLegajo:string = !UsuarioEsAutenticado() ? "Nombre Nombre Apellido\nLegajo: 12345" 
  : infoBaseUsuarioActual.nombreCompleto+"\nLegajo: "+infoBaseUsuarioActual.legajo;

  return (
    <FondoGradiente style={styles.containerGradient}>

      <View style={styles.header}>
        <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />
        <View style={styles.userInfo}>
          <CustomText style={styles.userText}>{nombreLegajo}</CustomText>
          {/* <CustomText style={[styles.userText, {color: '#444', lineHeight:20}]}>{}</CustomText> */}
          <CustomText style={styles.userText}>{(UsuarioEsAutenticado() ? infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.propuestas.length-1].nombre : "Nombre de Propuesta")}</CustomText>
        </View>
        <Image source={require('../assets/icons/undav.png')} style={styles.profileIcon} />
      </View>
        
      <AgendaPreview />

      <View style={styles.buttonsRowParent}> 
        <View style={styles.buttonsRow}>

          <BotonIconoTexto
            label={"CERTIFICADOS\nY REPORTES"}
            funcionOnPress={() => router.push('/certificados')}
            Icon={ReportesIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />
          <BotonIconoTexto
            label={"INSCRIPCIONES"}
            funcionOnPress={() => router.push('/inscripciones')}
            Icon={InscripcionesIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />
        </View>
        <View style={styles.buttonsRow}>
          
          <BotonIconoTexto
            label={"REDES"}
            funcionOnPress={() => router.push('/redes')}
            Icon={LinksIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />

          <BotonIconoTexto
            label={"SIU GUARANÍ"}
            funcionOnPress={() => Linking.openURL('https://academica.undav.edu.ar/g3w/')}
            Icon={LinksIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />

          <BotonIconoTexto
            label={"CAMPUS\nVIRTUAL"}
            funcionOnPress={() => Linking.openURL('https://ead.undav.edu.ar/')}
            Icon={LinksIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />
        </View>
      </View>
    </FondoGradiente>
  );
}

const iconSize = 44;
const iconColor = "#fff";
const iconBgColor = azulClaro;

const styles = StyleSheet.create({
  containerGradient: {
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10
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
    flex: 1
  },
  userText: {
    lineHeight: 18,
    fontSize: 14,
    fontWeight: '600',    
    textAlign: 'right',
    paddingRight: 12,
    alignContent: "flex-end"
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
    backgroundColor: azulLogoUndav,
    elevation: 4, // Android sombra
    shadowColor: '#000' // IOS sombra
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  }
});
