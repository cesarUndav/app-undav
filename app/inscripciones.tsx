import React from 'react';
import { StyleSheet } from 'react-native';

import CustomText from '../components/CustomText';
import BotonTextoLink from '../components/BotonTextoLink';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { celesteSIU, negroAzulado } from '@/constants/Colors';

export default function Inscripciones() {
  return (
    <FondoScrollGradiente>
    
      <BotonTextoLink label="Tutorial de Inscripcion a Carreras" openInsideApp url="https://undav.edu.ar/index.php?idcateg=5" />
      <CustomText style={styles.title}>Autogestión</CustomText>
      <BotonTextoLink label="Oferta de Comisiones" openInsideApp url="https://academica.undav.edu.ar/g3w/oferta_comisiones" color={celesteSIU}/>
      <BotonTextoLink label="Inscripción a Materias" openInsideApp url="https://academica.undav.edu.ar/g3w/cursada" color={celesteSIU}/>
      <BotonTextoLink label="Inscripción a Exámen" openInsideApp url="https://academica.undav.edu.ar/g3w/examen" color={celesteSIU}/>
      <BotonTextoLink label="Fechas de Exámen" openInsideApp url="https://academica.undav.edu.ar/g3w/fecha_examen" color={celesteSIU}/>
      <BotonTextoLink label="Horarios de Cursada" openInsideApp url="https://academica.undav.edu.ar/g3w/horarios_cursadas" color={celesteSIU}/>

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