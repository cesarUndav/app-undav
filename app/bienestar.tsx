import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import BotonTextoLink from '../components/BotonTextoLink';
import ListaItem from '@/components/ListaItem';
import { negroAzulado } from '@/constants/Colors';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

export default function Bienestar() {
  return (
    <FondoScrollGradiente>
      <BotonTextoLink label="Instagram" url="https://www.instagram.com/bienestarundav" color="#C13584" />
      <BotonTextoLink label="Facebook" url="https://www.facebook.com/bienestarundav" color="#3b5998" />
      <BotonTextoLink label="Aula Virtual" openInsideApp url="https://ead.undav.edu.ar/course/view.php?id=8889" />
      <BotonTextoLink label="eMail" url="mailto:bienestaruniversitario@undav.edu.ar" color="#a00" fontColor='#fff'/>

      <CustomText style={styles.title}>Atención Telefónica</CustomText>

      <BotonTextoLink label="Teléfono: (011) 4229-2480" url="tel:1142292480" color="#556"/>
      <BotonTextoLink label="Teléfono: (011) 5436-7530" url="tel:1154367530" color="#556"/>
      <BotonTextoLink label="Teléfono: (011) 5436-7531" url="tel:1154367531" color="#556"/>

      <CustomText style={styles.title}>{"Atención Presencial"}</CustomText>
      <ListaItem
        title={`Lunes a viernes, 9 a 20 hs.`}
        titleColor={negroAzulado}
      />
      <BotonTextoLink
        label={`Oficina Sede España (España 350)`}
        url="https://maps.app.goo.gl/DhdRoZ6zAWa7kuzw7"
      />
      <BotonTextoLink
        label={`Oficina Sede Piñeyro (Mario Bravo 1460)`}
        url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"
      />
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
