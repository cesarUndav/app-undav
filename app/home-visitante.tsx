import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { Route, useRouter } from 'expo-router';
import CustomText from '../components/CustomText';

import {Ionicons} from '@expo/vector-icons';
import RedesIcon from '../assets/icons/ico-svg/redes-arroba.svg';
import PreguntasIcon from '../assets/icons/ico-svg/preguntas-frecuentes.svg';
import InscripcionesIcon from '../assets/icons/ico-svg/inscripciones.svg';
import CalendarioIcon from '../assets/icons/ico-svg/calendario.svg';

import SedesIcon from '../assets/icons/ico-svg/sedes.svg';

import BotonIconoTexto from '@/components/BotonFlexIconoTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { azulClaro, azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import UndavVisitanteHeader from '@/components/UndavVisitanteHeader';

const iconSize = 55;
const iconColor = "#fff";

function ContactoIcon() {
  return (<Ionicons name={"mail"!} size={iconSize-8} color={iconColor} />);
}
function NoticiasIcon() {
  return (<Ionicons name={"notifications"!} size={iconSize-12} color={iconColor} />);
}

export default function HomeEstudiante() {
  const router = useRouter();

  return (
      <FondoGradiente style={styles.containerGradient}>

        <UndavVisitanteHeader/>

        <View style={[styles.buttonsRowParent,{flex: 1}]}>
          <TouchableOpacity style={styles.buttonBox} onPress={() => router.push('/oferta-academica')} accessible accessibilityLabel="Ir a oferta académica" >
            <Ionicons name="school" size={iconSize+0} color={iconColor} />
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
              label={"CALENDARIO\nACADÉMICO"}
              funcionOnPress={() => router.push('/calendario-academico-visitante')}
              Icon={CalendarioIcon}
              iconSize={iconSize}
              iconColor="white"
            />
          </View>
          <View style={styles.buttonsRow}>

            <BotonIconoTexto
              label={"REDES"}
              funcionOnPress={() => router.push('/redes')}
              Icon={RedesIcon}
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
          </View>
          <View style={styles.buttonsRow}>

            <BotonIconoTexto
              label={"CONTACTO"}
              funcionOnPress={() => router.push('/contacto')}
              Icon={ContactoIcon}
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
            <BotonIconoTexto
              label={"NOTICIAS"}
              funcionOnPress={() => router.push('/notificaciones')}
              Icon={NoticiasIcon}
              iconSize={iconSize}
              iconColor="white"
            />
          </View>
        </View>

      </FondoGradiente>
  );
}



const styles = StyleSheet.create({
  containerGradient: {
    gap: 12,
    padding: 15,
    paddingTop: 10
  },
  buttonsRowParent: {
    flex: 1.5, // tamaño de botones con respecto a lista
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
