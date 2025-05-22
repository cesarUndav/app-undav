import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomBar from '../components/BottomBar';
import CustomText from '../components/CustomText';
import AgendaPreview from '../components/AgendaPreview';

import LinksIcon from '../assets/icons/links.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';
import ReportesIcon from '../assets/icons/reportes.svg';

import { Tabs } from 'expo-router';

import { usuarioActual, UsuarioAutenticado } from '../data/DatosUsuarioGuarani';
import BotonIconoTexto from '@/components/BotonIconoTexto';

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
            <CustomText style={styles.userText}>{"Bienvenido de vuelta,\n" + (UsuarioAutenticado() ? usuarioActual.nombreCompleto : "Nombre Nombre Apellido")}</CustomText>
            <CustomText style={[styles.userText, {color: '#444', lineHeight:20}]}>{"ID: " + (UsuarioAutenticado() ? usuarioActual.idPersona : "12345")}</CustomText>
          </View>
          <Image source={require('../assets/images/logo_undav.png')} style={styles.logoUndav} />
          </View>
          
        <AgendaPreview />

        <View style={styles.buttonsRowParent}> 
          <View style={styles.buttonsRow}>

            <BotonIconoTexto
              label={"CERTIFICADOS\nY REPORTES"}
              funcionOnPress={() => router.push('/certificados')}
              Icon={ReportesIcon}
              iconSize={iconSize}
              iconColor="white"
            />
            <BotonIconoTexto
              label={"INSCRIPCIONES"}
              funcionOnPress={() => router.push('/inscripciones')}
              Icon={InscripcionesIcon}
              iconSize={iconSize}
              iconColor="white"
            />
          </View>
          <View style={styles.buttonsRow}>
            
            <BotonIconoTexto
              label={"REDES"}
              funcionOnPress={() => router.push('/vinculos')}
              Icon={LinksIcon}
              iconSize={iconSize}
              iconColor="white"
            />

            <BotonIconoTexto
              label={"SIU GUARANÍ"}
              funcionOnPress={() => Linking.openURL('https://academica.undav.edu.ar/g3w/')}
              Icon={LinksIcon}
              iconSize={iconSize}
              iconColor="white"
            />

            <BotonIconoTexto
              label={"CAMPUS\nVIRTUAL"}
              funcionOnPress={() => Linking.openURL('https://ead.undav.edu.ar/')}
              Icon={LinksIcon}
              iconSize={iconSize}
              iconColor="white"
            />
          </View>
        </View>

      </LinearGradient>
    
    <BottomBar />
    </SafeAreaView>
  );
}

const iconSize = 44;
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
    textAlign: 'left',
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
    backgroundColor: '#1c2f4a',
    //marginVertical: 12,
    elevation: 4
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  }
});
