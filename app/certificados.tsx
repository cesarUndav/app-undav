// screens/Contacto.tsx

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';
import BotonTexto from '../components/BotonTexto'; // ✅ renamed import

export default function Contacto() {
  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <CustomText style={styles.title}>Autogestión</CustomText>

        <BotonTexto label="Certificado de Exámen" url="https://docs.google.com/document/d/1NGOoRhWOAubZEhG0EzOjhquI1bIKpYwE/edit?tab=t.0#heading=h.gjdgxs" />
        <BotonTexto label="Solicitud de Sello Institucional" url="https://docs.google.com/forms/d/e/1FAIpQLSe4hgptWLsprQocC75YEdXzeT9CNiLhd1SH-tawXbMpY4dxGQ/viewform" />
        <BotonTexto label="Certificado de Alumno Regular" url="https://academica.undav.edu.ar/g3w/solicitudes" />
        <BotonTexto label="Certificado de Actividades Aprobadas" url="https://academica.undav.edu.ar/g3w/solicitudes" />
        <BotonTexto label="Boleto Estudiantil" url="https://academica.undav.edu.ar/g3w/boleto_estudiantil" />

        <CustomText style={styles.title}>Correos de Atención al Estudiante</CustomText>

        <BotonTexto label="Consultas Generales" url="mailto:tramitesestudiantes@undav.edu.ar" />
        <BotonTexto label="Prórrogas de Cursadas Vencidas" url="mailto:finales@undav.edu.ar" />
        <BotonTexto label="Solicitud y Entrega de Libretas" url="mailto:libretas@undav.edu.ar" />

        <CustomText style={styles.title}>Atención Presencial</CustomText>

        <BotonTexto label="Teléfono: 5436-7521" url="tel:54367521" />
        <BotonTexto
          label={`Atención Presencial:\nLunes a viernes, 8 a 20 hs.\nOficina Sede Piñeyro (Mario Bravo 1460).`}
          url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"
        />

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 15,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b254a',
    alignSelf: 'center',
    marginVertical: 0,
  },
});
