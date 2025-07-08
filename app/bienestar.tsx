import React from 'react';
import { StyleSheet } from 'react-native';

import BotonTexto from '../components/BotonTexto';
import ListaItem from '@/components/ListaItem';
import { negroAzulado } from '@/constants/Colors';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';
import BotonTextoMail from '@/components/BotonTextoMail';

export default function Bienestar() {
  return (
    <FondoScrollGradiente>
      <DropdownSeccion titulo={'Redes'}>
      <>
        <BotonTexto label="Instagram" url="https://www.instagram.com/bienestarundav" color="#C13584" />
        <BotonTexto label="Facebook" url="https://www.facebook.com/bienestarundav" color="#3b5998" />
        <BotonTexto label="Aula Virtual" openInsideApp url="https://ead.undav.edu.ar/course/view.php?id=8889" />
        <BotonTextoMail label="eMail" mail="bienestaruniversitario@undav.edu.ar"/>
      </>
      </DropdownSeccion>

      <DropdownSeccion titulo={'Atención Telefónica'}>
      <>
        <BotonTextoTelefono label="Teléfono: (011) 4229-2480" tel="tel:1142292480" />
        <BotonTextoTelefono label="Teléfono: (011) 5436-7530" tel="tel:1154367530" />
        <BotonTextoTelefono label="Teléfono: (011) 5436-7531" tel="tel:1154367531" />
      </>
      </DropdownSeccion>

      <DropdownSeccion titulo={'Atención Presencial'}>
      <>
        <ListaItem
          title={`Lunes a viernes, 9 a 20 hs.`}
          titleColor={negroAzulado}
        />
        <BotonTexto
          label={`Oficina Sede España (España 350)`}
          url="https://maps.app.goo.gl/DhdRoZ6zAWa7kuzw7"
        />
        <BotonTexto
          label={`Oficina Sede Piñeyro (Mario Bravo 1460)`}
          url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"
        />
      </>
      </DropdownSeccion>
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
