import React from 'react';

import BotonTexto from '../components/BotonTexto';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulMedioUndav } from '@/constants/Colors';

const verticalPadding = 16;
const fontSize = 16;

export default function Contacto() {

  return (
    <FondoScrollGradiente gap={4}>
      <BotonTexto label="Web UNDAV" openInsideApp url="https://undav.edu.ar/index.php" color={azulMedioUndav} verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTexto label="Youtube" url="https://www.youtube.com/@UNDAVOficial/featured" color="#c4302b" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTexto label="Instagram" url="https://www.instagram.com/undav_oficial/?hl=es" color="#C13584" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTexto label="Facebook" url="https://www.facebook.com/UNDAV2011" color="#3b5998" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTexto label="X / Twitter" url="https://x.com/UNDAVOFICIAL" color="#000" verticalPadding={verticalPadding} fontSize={fontSize}/>
      <BotonTexto label="LinkedIn" url="https://www.linkedin.com/school/universidad-nacional-de-avellaneda-undav-/" color="#0e76a8" styleExtra={{borderBottomRightRadius: 20}}verticalPadding={verticalPadding} fontSize={fontSize}/>
    </FondoScrollGradiente>
  );
}