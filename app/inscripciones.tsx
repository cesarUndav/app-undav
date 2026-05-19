// app/inscripciones.tsx

import React from 'react';

import BotonTexto from '../components/BotonTexto';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import BotonTextoSIU from '@/components/BotonTextoSIU';
import BotonTextoMail from '@/components/BotonTextoMail';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';

export default function Inscripciones() {
  return (
    <FondoScrollGradiente>
      <BotonTexto
        label="Tutorial de Inscripción a Carreras"
        openInsideApp
        url="https://undav.edu.ar/index.php?idcateg=5"
        styleExtra={{ borderBottomRightRadius: 20 }}
      />

      <DropdownSeccion titulo="Autogestión" inicialmenteAbierto={true}>
        <>
          <BotonTextoSIU
            label="Oferta de Comisiones"
            url="https://academica.undav.edu.ar/g3w/oferta_comisiones"
          />

          <BotonTextoSIU
            label="Inscripción a Materias"
            url="https://academica.undav.edu.ar/g3w/cursada"
          />

          <BotonTextoSIU
            label="Inscripción a Examen"
            url="https://academica.undav.edu.ar/g3w/examen"
          />

          <BotonTextoSIU
            label="Fechas de Examen"
            url="https://academica.undav.edu.ar/g3w/fecha_examen"
          />

          <BotonTextoSIU
            label="Horarios de Cursada"
            url="https://academica.undav.edu.ar/g3w/horarios_cursadas"
            styleExtra={{ borderBottomRightRadius: 20 }}
          />
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Consultas" inicialmenteAbierto={true}>
        <>
          <BotonTextoMail
            label="eMail Inscripciones"
            mail="inscripciones@undav.edu.ar"
          />

          <BotonTextoTelefono
            label="Teléfono: 5436-7545"
            tel="54367545"
            styleExtra={{ borderBottomRightRadius: 20 }}
          />
        </>
      </DropdownSeccion>
    </FondoScrollGradiente>
  );
}