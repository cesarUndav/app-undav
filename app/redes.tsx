import React from 'react';
import { StyleSheet, ScrollView, Touchable, TouchableOpacity } from 'react-native';

import BotonTextoLink from '../components/BotonTextoLink';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulMedioUndav } from '@/constants/Colors';

const verticalPadding = 18;
const fontSize = 16;

export default function Contacto() {

  return (
    <FondoScrollGradiente>
      <BotonTextoLink label="Web UNDAV" openInsideApp url="https://undav.edu.ar/index.php" color={azulMedioUndav} verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTextoLink label="Youtube" url="https://www.youtube.com/@UNDAVOficial/featured" color="#c4302b" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTextoLink label="Instagram" url="https://www.instagram.com/undav_oficial/?hl=es" color="#C13584" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTextoLink label="Facebook" url="https://www.facebook.com/UNDAV2011" color="#3b5998" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTextoLink label="X / Twitter" url="https://x.com/UNDAVOFICIAL" color="#000" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTextoLink label="LinkedIn" url="https://www.linkedin.com/school/universidad-nacional-de-avellaneda-undav-/" color="#0e76a8" verticalPadding={verticalPadding} fontSize={fontSize}/>
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
});
