import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useRouter } from 'expo-router';
import AgendaPreview from '../components/AgendaPreviewHibrida';

// import LinksIcon from '../assets/icons/links.svg';
import LinksIcon from '../assets/icons/ico-svg/redes-arroba.svg';
import SIU_Gua_Icon from '../assets/icons/ico-svg/siu-original.svg';
import CampusVirtualIcon from '../assets/icons/ico-svg/campus-virtual.svg';
import InscripcionesIcon from '../assets/icons/ico-svg/inscripciones.svg';
import ReportesIcon from '../assets/icons/ico-svg/certificados.svg';
import TrayectoriaIcon from '../assets/icons/ico-svg/historial-aca.svg';

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
          <BotonIconoTexto
            label={"TRAYECTORIA\nACADÉMICA"}
            funcionOnPress={() => router.push('/trayectoria-academica')}
            Icon={TrayectoriaIcon}
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
            Icon={SIU_Gua_Icon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
          />

          <BotonIconoTexto
            label={"CAMPUS\nVIRTUAL"}
            //funcionOnPress={() => Linking.openURL('https://ead.undav.edu.ar/')}
            funcionOnPress={() => router.push('/web-Campus-Virtual')}
            Icon={CampusVirtualIcon}
            iconSize={iconSize}
            iconColor={iconColor}
            backgroundColor={iconBgColor}
            styleExtra={{borderBottomRightRadius: 20}}
          />
        </View>
      </View>
    </FondoGradiente>
  );
}

const iconSize = 55;
const iconColor = "#fff";
const iconBgColor = azulClaro;

const styles = StyleSheet.create({
  containerGradient: {
    gap: 12,
    padding: 15,
    paddingTop: 10
  },
  buttonsRowParent: { //buttons
    flex: 0.53, // tamaño de botones con respecto a lista
    gap: 10,
    padding: 10,
    borderBottomRightRadius: 28,
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
