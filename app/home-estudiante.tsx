import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import CustomText from '../components/CustomText';
import AgendaPreview from '../components/AgendaPreview';

import LinksIcon from '../assets/icons/links.svg';
import InscripcionesIcon from '../assets/icons/inscripciones.svg';
import ReportesIcon from '../assets/icons/reportes.svg';

import BotonIconoTexto from '@/components/BotonFlexIconoTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { azulClaro, azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import UndavEstudianteHeader from '@/components/UndavUsuarioHeader';

export default function HomeEstudiante() {

  const router = useRouter();

  return (
    <FondoGradiente style={styles.containerGradient}>

      <UndavEstudianteHeader/>
        
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
            //funcionOnPress={() => Linking.openURL('https://academica.undav.edu.ar/g3w/')}
            funcionOnPress={() => router.push('/web-SIU-Guarani')}
            Icon={LinksIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />

          <BotonIconoTexto
            label={"CAMPUS\nVIRTUAL"}
            //funcionOnPress={() => Linking.openURL('https://ead.undav.edu.ar/')}
            funcionOnPress={() => router.push('/web-Campus-Virtual')}
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
  buttonsRowParent: { //buttons
    flex: 0.6, // tamaño de botones con respecto a lista
    gap: 10,
    padding: 10,
    borderBottomRightRadius: 24,
    backgroundColor: azulLogoUndav,
    ...getShadowStyle(4)
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  }
});
