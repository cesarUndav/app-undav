// app/trayectoria-academica.tsx

import React from 'react';

import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import BotonTextoSIU from '@/components/BotonTextoSIU';

export default function TrayectoriaAcademica() {
  return (
    <FondoScrollGradiente>
      <BotonTextoSIU
        label="Historia Académica"
        url="https://academica.undav.edu.ar/g3w/historia_academica"
      />
      <BotonTextoSIU
        label="Plan de Estudio"
        url="https://academica.undav.edu.ar/g3w/plan_estudio"
      />
    </FondoScrollGradiente>
  );
}