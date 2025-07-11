import React from 'react';
import { StyleSheet } from 'react-native';

import CustomText from '../components/CustomText';
import BotonTexto from '../components/BotonTexto';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { negroAzulado } from '@/constants/Colors';
import BotonTextoSIU from '@/components/BotonTextoSIU';
import BotonTextoMail from '@/components/BotonTextoMail';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';

export default function Inscripciones() {
  return (
    <FondoScrollGradiente>
    
      <BotonTexto label="Tutorial de Inscripcion a Carreras" openInsideApp url="https://undav.edu.ar/index.php?idcateg=5" styleExtra={{borderBottomRightRadius: 20}}/>
      
      <DropdownSeccion titulo="Autogestión" inicialmenteAbierto={true}>
      <>
        <BotonTextoSIU label="Oferta de Comisiones" url="https://academica.undav.edu.ar/g3w/oferta_comisiones"/>
        <BotonTextoSIU label="Inscripción a Materias" url="https://academica.undav.edu.ar/g3w/cursada"/>
        <BotonTextoSIU label="Inscripción a Exámen" url="https://academica.undav.edu.ar/g3w/examen" />
        <BotonTextoSIU label="Fechas de Exámen" url="https://academica.undav.edu.ar/g3w/fecha_examen" />
        <BotonTextoSIU label="Horarios de Cursada" styleExtra={{borderBottomRightRadius: 20}} url="https://academica.undav.edu.ar/g3w/horarios_cursadas"/>
      </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Consultas" inicialmenteAbierto={true}>
      <>
        <BotonTextoMail label="eMail Inscripciones" mail="inscripciones@undav.edu.ar"/>
        <BotonTextoTelefono label="Teléfono: 5436-7545" tel="54367545" styleExtra={{borderBottomRightRadius: 20}}/>
      </>
      </DropdownSeccion>   
      
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