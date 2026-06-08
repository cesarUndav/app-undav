// app/autogestion.tsx

import React from 'react';

import BotonTexto from '../components/BotonTexto';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import BotonTextoSIU from '@/components/BotonTextoSIU';
import BotonTextoMail from '@/components/BotonTextoMail';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';

const linkSelloInstitucional = "https://docs.google.com/forms/d/e/1FAIpQLSc2InEWA3-Xzr0ixrTwDpDIopLAzpYr4D8u2UcEr3PJpeJE3g/viewform";

export default function Autogestion() {
  return (
    <FondoScrollGradiente>

      <DropdownSeccion titulo="Certificados: Autogestión" inicialmenteAbierto>
      <>
        <BotonTexto
          label="Certificado de Examen"
          route="/certificado-examen"
        />

        {linkSelloInstitucional && (
          <BotonTexto
            label="Solicitud de Sello Institucional"
            url={linkSelloInstitucional}
          />
        )}

        <BotonTextoSIU
          label="Certificado de Alumno Regular"
          url="https://academica.undav.edu.ar/g3w/solicitudes"
        />

        <BotonTextoSIU
          label="Certificado de Actividades Aprobadas"
          url="https://academica.undav.edu.ar/g3w/solicitudes"
        />

        <BotonTextoSIU
          label="Boleto Estudiantil"
          url="https://academica.undav.edu.ar/g3w/boleto_estudiantil"
          styleExtra={{ borderBottomRightRadius: 20 }}
        />
      </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Inscripciones: Autogestión" inicialmenteAbierto>
        <>
          <BotonTexto
            label="Tutorial de Inscripción a Carreras"
            openInsideApp
            url="https://undav.edu.ar/index.php?idcateg=5"
          />
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

    </FondoScrollGradiente>
  );
}