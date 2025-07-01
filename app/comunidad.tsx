import CustomText from '@/components/CustomText';
import FondoGradiente from '@/components/FondoGradiente';
import { negroAzulado } from '@/constants/Colors';
import React from 'react';
import { StyleSheet } from 'react-native';


export default function Comunidad() {  
  return (
    <FondoGradiente>
      <CustomText style={styles.leyenda}>La "Comunidad" será un espacio en donde los alumnos 
        podrán contactarse para formar grupos de estudio, o de deportes, 
        entre otras actividades en conjunto.</CustomText>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  leyenda: {
    fontSize: 18,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center'
  }
});
