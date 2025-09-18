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

import BotonIconoTexto from '@/components/BotonIconoTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { azulClaro, azulLogoUndav, azulMedioUndav, grisTexto, grisUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import UndavEstudianteHeader from '@/components/UndavUsuarioHeader';

const buttonsInternalGap = 15;
// tema actual
const iconParentColor = "#fff";
// tema viejo
// const iconColor = "#fff";
// const iconBgColor = azulClaro;
// const iconParentColor = azulLogoUndav;


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
          />
          <BotonIconoTexto
            label={"INSCRIPCIONES"}
            funcionOnPress={() => router.push('/inscripciones')}
            Icon={InscripcionesIcon}
          />
          <BotonIconoTexto
            label={"TRAYECTORIA\nACADÉMICA"}
            funcionOnPress={() => router.push('/trayectoria-academica')}
            Icon={TrayectoriaIcon}
          />
        </View>
        <View style={styles.buttonsRow}>
          
          <BotonIconoTexto
            label={"REDES"}
            funcionOnPress={() => router.push('/redes')}
            Icon={LinksIcon}
          />

          <BotonIconoTexto
            label={"SIU GUARANÍ"}
            //funcionOnPress={() => Linking.openURL('https://academica.undav.edu.ar/g3w/')}
            funcionOnPress={() => router.push('/web-SIU-Guarani')}
            Icon={SIU_Gua_Icon}
          />

          <BotonIconoTexto
            label={"CAMPUS\nVIRTUAL"}
            //funcionOnPress={() => Linking.openURL('https://ead.undav.edu.ar/')}
            funcionOnPress={() => router.push('/web-Campus-Virtual')}
            Icon={CampusVirtualIcon}
            styleExtra={{borderBottomRightRadius: 20}}
          />
        </View>
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  containerGradient: {
    gap: 15,
    padding: 15,
    paddingTop: 10
  },
  buttonsRowParent: { //buttons
    flex: 0.53, // tamaño de botones con respecto a lista
    gap: buttonsInternalGap,
    padding: buttonsInternalGap,
    borderBottomRightRadius: 28,
    backgroundColor: iconParentColor,
    ...getShadowStyle(4)
  },
  buttonsRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: buttonsInternalGap
  }
});
