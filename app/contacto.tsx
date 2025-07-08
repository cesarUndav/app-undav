import React from 'react';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import BotonTextoMail from '@/components/BotonTextoMail';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTexto from '@/components/BotonTexto';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';
import ListaItem from '@/components/ListaItem';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';

export default function Contacto() {

  return (
    <FondoScrollGradiente>
      <DropdownSeccion titulo={'Secretaría Académica'}>
      <>
        <BotonTextoMail label='eMail' mail={'academica@undav.edu.ar'}/>
        <BotonTextoTelefono label={'Teléfono: (011) 4201-9999'} tel='01142019999'/>
      </>
      </DropdownSeccion>

      <DropdownSeccion titulo={'Soporte Técnico'}>
      <>
        <BotonTextoMail label='eMail' mail={'soporte@undav.edu.ar'}/>
      </>
      </DropdownSeccion>
      
      <DropdownSeccion titulo="Atención Presencial">
      <>
        <ListaItem title={`Lunes a viernes, 8 a 20 hs.`} titleColor={negroAzulado}/>
        <BotonTexto label={`Oficina Sede Piñeyro (Mario Bravo 1460).`} url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"/>
      </>
      </DropdownSeccion>
    </FondoScrollGradiente>
  );
}