import React from 'react';
import { StyleSheet } from 'react-native';

import BotonTexto from '../components/BotonTexto';
import ListaItem from '@/components/ListaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';
import BotonTextoSIU from '@/components/BotonTextoSIU';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoMail from '@/components/BotonTextoMail';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';

export default function Certificados() {
  return (
    <FondoScrollGradiente>
      <DropdownSeccion titulo="Autogestión">
        <>
          <BotonTexto label="Certificado de Exámen" url="https://docs.google.com/document/d/13UR2aI0F-2viHtZ1qHCPw-UZnlQvcLbl/edit?usp=sharing&ouid=105277120237883468075&rtpof=true&sd=true" />
          <BotonTexto label="Solicitud de Sello Institucional" url="https://docs.google.com/forms/d/e/1FAIpQLSe4hgptWLsprQocC75YEdXzeT9CNiLhd1SH-tawXbMpY4dxGQ/viewform" />
          <BotonTextoSIU label="Certificado de Alumno Regular" url="https://academica.undav.edu.ar/g3w/solicitudes" />
          <BotonTextoSIU label="Certificado de Actividades Aprobadas" url="https://academica.undav.edu.ar/g3w/solicitudes"/>
          <BotonTextoSIU label="Boleto Estudiantil" url="https://academica.undav.edu.ar/g3w/boleto_estudiantil" />
        </>
      </DropdownSeccion>
      
      <DropdownSeccion titulo="Atención al Estudiante" >
      <>
        <BotonTextoMail label="eMail: Consultas Generales" mail="tramitesestudiantes@undav.edu.ar"/>
        <BotonTextoMail label="eMail: Prórrogas de Cursadas Vencidas" mail="finales@undav.edu.ar"/>
        <BotonTextoTelefono label="Teléfono: 5436-7521" tel="54367521"/>
      </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Atención Presencial" >
      <>
        <ListaItem title={`Lunes a viernes, 8 a 20 hs.`} titleColor={negroAzulado}/>
        <BotonTexto label={`Oficina Sede Piñeyro (Mario Bravo 1460).`} url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"/>
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
