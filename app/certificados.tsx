import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import BotonTextoLink from '../components/BotonTextoLink';
import ListaItem from '@/components/ListaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

export default function Certificados() {
  return (
    <FondoScrollGradiente>
      <CustomText style={styles.title}>Autogestión</CustomText>

      <BotonTextoLink label="Certificado de Exámen" url="https://docs.google.com/document/d/1NGOoRhWOAubZEhG0EzOjhquI1bIKpYwE/edit?tab=t.0#heading=h.gjdgxs" />
      <BotonTextoLink label="Solicitud de Sello Institucional" url="https://docs.google.com/forms/d/e/1FAIpQLSe4hgptWLsprQocC75YEdXzeT9CNiLhd1SH-tawXbMpY4dxGQ/viewform" />
      <BotonTextoLink label="Certificado de Alumno Regular" url="https://academica.undav.edu.ar/g3w/solicitudes" color="#4b9ec9"/>
      <BotonTextoLink label="Certificado de Actividades Aprobadas" url="https://academica.undav.edu.ar/g3w/solicitudes" color="#4b9ec9"/>
      <BotonTextoLink label="Boleto Estudiantil" url="https://academica.undav.edu.ar/g3w/boleto_estudiantil" color="#4b9ec9"/>

      <CustomText style={styles.title}>Atención al Estudiante</CustomText>

      <BotonTextoLink label="eMail: Consultas Generales" url="mailto:tramitesestudiantes@undav.edu.ar" color="#a00"/>
      <BotonTextoLink label="eMail: Prórrogas de Cursadas Vencidas" url="mailto:finales@undav.edu.ar" color="#a00"/>
      <BotonTextoLink label="eMail: Solicitud y Entrega de Libretas" url="mailto:libretas@undav.edu.ar" color="#a00"/>


      <BotonTextoLink label="Teléfono: 5436-7521" url="tel:54367521"  color="#556"/>
      <CustomText style={styles.title}>Atención Presencial</CustomText>
      <ListaItem
        title={`Lunes a viernes, 8 a 20 hs.`}
        titleColor='#0b254a'
      />
      <BotonTextoLink
        label={`Oficina Sede Piñeyro (Mario Bravo 1460).`}
        url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"
      />
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b254a',
    alignSelf: 'center',
    marginVertical: 0,
  },
});
