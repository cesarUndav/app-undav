import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import CustomText from '../components/CustomText';

import {Ionicons} from '@expo/vector-icons';
import RedesIcon from '../assets/icons/ico-svg/redes-arroba.svg';
import PreguntasIcon from '../assets/icons/ico-svg/preguntas-frecuentes.svg';
import InscripcionesIcon from '../assets/icons/ico-svg/inscripciones.svg';
import CalendarioIcon from '../assets/icons/ico-svg/calendario.svg';
import SedesIcon from '../assets/icons/ico-svg/sedes.svg';

import NotificacionesIcon from '../assets/icons/notifications.svg';
import ContactoIcon from '../assets/icons/mail.svg';

import BotonIconoTexto from '@/components/BotonIconoTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { azulClaro } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import UndavVisitanteHeader from '@/components/UndavVisitanteHeader';

const iconSize = 55;
const iconColor = azulClaro;

// function ContactoIcon() {
//   return (<Ionicons name={"mail"!} size={iconSize} color={iconColor} />);
// }
// function NoticiasIcon() {
//   return (<Ionicons name={"notifications"!} size={iconSize} color={iconColor} />);
// }

export default function HomeEstudiante() {
  const router = useRouter();

  return (
      <FondoGradiente style={styles.containerGradient}>

        <UndavVisitanteHeader/>

        <View style={[styles.buttonsRowParent,{flex: 1, backgroundColor: azulClaro}]}>
          <TouchableOpacity style={styles.buttonBox} onPress={() => router.push('/oferta-academica')} accessible accessibilityLabel="Ir a oferta académica" >
            <Ionicons name="school" size={iconSize+0} color={"#fff"} />
            <CustomText style={styles.buttonText}>OFERTA ACADÉMICA</CustomText>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.buttonsRowParent, {paddingBottom: 20}]}> 
          
          <View style={styles.buttonsRow}>
            <BotonIconoTexto
              label={"TUTORIAL DE\nPREINSCRIPCIÓN"}
              funcionOnPress={() => router.push('/preinscripcion')}
              Icon={InscripcionesIcon}
            />
            <BotonIconoTexto
              label={"CALENDARIO\nACADÉMICO"}
              funcionOnPress={() => router.push('/calendario-academico-visitante')}
              Icon={CalendarioIcon}
            />
          </View>
          <View style={styles.buttonsRow}>

            <BotonIconoTexto
              label={"REDES"}
              funcionOnPress={() => router.push('/redes')}
              Icon={RedesIcon}
            />
            <BotonIconoTexto
              label={"SEDES"}
              funcionOnPress={() => router.push('/sedes')}
              Icon={SedesIcon}
            />
          </View>
          <View style={styles.buttonsRow}>

            <BotonIconoTexto
              label={"CONTACTO"}
              funcionOnPress={() => router.push('/contacto')}
              Icon={ContactoIcon}
            />
            <BotonIconoTexto
              label={"PREGUNTAS\nFRECUENTES"}
              funcionOnPress={() => router.push('/preguntas-frecuentes')}
              Icon={PreguntasIcon}
            />
            <BotonIconoTexto
              label={"NOTICIAS"}
              funcionOnPress={() => router.push('/notificaciones')}
              Icon={NotificacionesIcon}
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
    backgroundColor: "#fff",
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
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    //fontStyle: 'italic'
  },
});
