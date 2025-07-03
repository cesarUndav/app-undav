import React from 'react';
import { StyleSheet } from 'react-native';

import CustomText from '../components/CustomText';
import BotonTextoLink from '../components/BotonTextoLink';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { negroAzulado } from '@/constants/Colors';
import BotonTextoSIU from '@/components/BotonTextoSIU';

export default function Inscripciones() {
  return (
    <FondoScrollGradiente>
    
      <BotonTextoLink label="Tutorial de Inscripcion a Carreras" openInsideApp url="https://undav.edu.ar/index.php?idcateg=5" />
      <CustomText style={styles.title}>Autogestión</CustomText>
      <BotonTextoSIU label="Oferta de Comisiones" url="https://academica.undav.edu.ar/g3w/oferta_comisiones"/>
      <BotonTextoSIU label="Inscripción a Materias" url="https://academica.undav.edu.ar/g3w/cursada"/>
      <BotonTextoSIU label="Inscripción a Exámen" url="https://academica.undav.edu.ar/g3w/examen" />
      <BotonTextoSIU label="Fechas de Exámen" url="https://academica.undav.edu.ar/g3w/fecha_examen" />
      <BotonTextoSIU label="Horarios de Cursada" url="https://academica.undav.edu.ar/g3w/horarios_cursadas"/>

      <CustomText style={styles.title}>Consultas</CustomText>
    
      <BotonTextoLink label="eMail" url="mailto:inscripciones@undav.edu.ar" color="#a00"/>
      <BotonTextoLink label="Teléfono: 5436-7545" url="tel:54367545"  color="#556"/>
      
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center',
    marginVertical: 0,
  },
});