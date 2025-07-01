import React from 'react';
import { StyleSheet } from 'react-native';


import BotonTextoLink from '../components/BotonTextoLink';
import { negroAzulado } from '@/constants/Colors';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

export default function TrayectoriaAcademica() {
  return (
    <FondoScrollGradiente>
      <BotonTextoLink label={'Historia Académica'} route='/historia-academica'/>
      <BotonTextoLink label={'Plan de Estudio'} route='/plan-de-estudio'/>
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
