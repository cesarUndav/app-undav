import React from 'react';
import { StyleSheet } from 'react-native';


import BotonTexto from '../components/BotonTexto';
import { negroAzulado } from '@/constants/Colors';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

export default function TrayectoriaAcademica() {
  return (
    <FondoScrollGradiente>
      <BotonTexto label={'Historia Académica'} route='/historia-academica'/>
      <BotonTexto label={'Plan de Estudio'} route='/plan-de-estudio'/>
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center'
  },
});
