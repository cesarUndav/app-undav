// app/trayectoria-academica.tsx

import React from 'react';

import BotonTexto from '../components/BotonTexto';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

export default function TrayectoriaAcademica() {
  return (
    <FondoScrollGradiente>
      <BotonTexto label="Plan de Estudio" route="/plan-de-estudio" />
      {/* <BotonTexto label="Historia Académica" route="/historia-academica" /> */}
    </FondoScrollGradiente>
  );
}