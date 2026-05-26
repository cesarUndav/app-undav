// app/contacto-para-estudiantes.tsx

import React from 'react';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoMail from '@/components/BotonTextoMail';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';
import BotonTexto from '@/components/BotonTexto';
import ListaItem from '@/components/ListaItem';
import { negroAzulado } from '@/constants/Colors';

type ItemMail = {
  tipo: 'mail';
  label: string;
  mail: string;
  asunto: string;
  cuerpo: string;
};

type ItemTelefono = {
  tipo: 'telefono';
  label: string;
  tel: string;
};

type ItemMapa = {
  tipo: 'mapa';
  label: string;
  url: string;
};

type ItemTexto = {
  tipo: 'texto';
  label: string;
};

type ItemContacto = ItemMail | ItemTelefono | ItemMapa | ItemTexto;

type SeccionContacto = {
  titulo: string;
  items: ItemContacto[];
};

const seccionesContacto: SeccionContacto[] = [
  {
    titulo: 'Trámites estudiantiles',
    items: [
      {
        tipo: 'mail',
        label: 'Consultas generales a estudiantes UNDAV',
        mail: 'tramitesestudiantes@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Prórrogas de cursadas vencidas',
        mail: 'finales@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Cambios de planes de estudio',
        mail: 'cambiosdeplan@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Documentación de estudiantes',
        mail: 'legajosestudiantes@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Movilidad estudiantil',
        mail: 'movilidadacademica@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Tutorías de apoyo al estudiante',
        mail: 'tutoriasacademica@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Equivalencias',
        mail: 'equivalencias@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Talleres para estudiantes ingresantes',
        mail: 'ingresantes@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Secretaría Académica',
        mail: 'academica@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono Secretaría Académica: 5436-7597',
        tel: '54367597',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono Atención al Estudiante: 5436-7521',
        tel: '54367521',
      },
    ],
  },
  {
    titulo: 'Inscripciones',
    items: [
      {
        tipo: 'mail',
        label: 'Consultas generales',
        mail: 'inscripciones@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Cambios de carrera',
        mail: 'cambiosdecarrera@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Readmisiones',
        mail: 'readmisiones@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Mayores de 25 Sin Título Secundario',
        mail: 'mayoresde25@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono: 5436-7545',
        tel: '54367545',
      },
    ],
  },
  {
    titulo: 'Educación a Distancia',
    items: [
      {
        tipo: 'mail',
        label: 'Trámites académico-administrativos',
        mail: 'tramitesestudiantes@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Consultas Formulario A',
        mail: 'administracionead@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Consultas Formulario B / Becas',
        mail: 'becas@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Soporte técnico campus',
        mail: 'campusestudiantes@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
    ],
  },
  {
    titulo: 'Bienestar Universitario',
    items: [
      {
        tipo: 'mail',
        label: 'Bienestar Universitario',
        mail: 'bienestaruniversitario@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'texto',
        label: 'Sede España | España 350 esq. Colón, Avellaneda.',
      },
      {
        tipo: 'texto',
        label:
          'Sede Piñeyro | Mario Bravo 1460 esq. Isleta, Piñeyro, Avellaneda.',
      },
      {
        tipo: 'texto',
        label: 'Horario de atención: lunes a viernes de 9 a 20 hs.',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono: 4229-2480',
        tel: '01142292480',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono: 5436-7530',
        tel: '01154367530',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono: 5436-7531',
        tel: '01154367531',
      },
      {
        tipo: 'mapa',
        label: 'Ver Sede España en el mapa',
        url: 'https://maps.google.com/?q=España 350, Avellaneda',
      },
      {
        tipo: 'mapa',
        label: 'Ver Sede Piñeyro en el mapa',
        url: 'https://maps.google.com/?q=Mario Bravo 1460, Piñeyro, Avellaneda',
      },
    ],
  },
  {
    titulo: 'Títulos, certificaciones y tesis',
    items: [
      {
        tipo: 'mail',
        label: 'Títulos',
        mail: 'titulos@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Certificaciones',
        mail: 'certificaciones@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Tesis',
        mail: 'tesis@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
    ],
  },
  {
    titulo: 'Departamentos académicos',
    items: [
      {
        tipo: 'mail',
        label: 'Departamento de Ambiente y Turismo',
        mail: 'ambienteyturismo@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'telefono',
        label: 'Teléfono Ambiente y Turismo: 4229-2471',
        tel: '01142292471',
      },
      {
        tipo: 'mail',
        label: 'Departamento de Arquitectura, Diseño y Urbanismo',
        mail: 'arquitecturaydiseno@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Departamento de Ciencias Sociales',
        mail: 'sociales@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Departamento de Cultura, Arte y Comunicación',
        mail: 'cac@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Departamento de Salud y Actividad Física',
        mail: 'deptosalud@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
      {
        tipo: 'mail',
        label: 'Departamento de Tecnología y Administración',
        mail: 'dtya@undav.edu.ar',
        asunto: '',
        cuerpo: '',
      },
    ],
  },
];

export default function ContactoParaEstudiantes() {
  return (
    <FondoScrollGradiente>
      {seccionesContacto.map((seccion) => (
        <DropdownSeccion key={seccion.titulo} titulo={seccion.titulo}>
          <>
            {seccion.items.map((item) => {
              if (item.tipo === 'mail') {
                return (
                  <BotonTextoMail
                    key={`${item.label}-${item.mail}`}
                    label={item.label}
                    mail={item.mail}
                    asunto={item.asunto}
                    cuerpo={item.cuerpo}
                  />
                );
              }

              if (item.tipo === 'telefono') {
                return (
                  <BotonTextoTelefono
                    key={`${item.label}-${item.tel}`}
                    label={item.label}
                    tel={item.tel}
                  />
                );
              }

              if (item.tipo === 'mapa') {
                return (
                  <BotonTexto
                    key={`${item.label}-${item.url}`}
                    label={item.label}
                    url={item.url}
                  />
                );
              }

              return (
                <ListaItem
                  key={item.label}
                  title={item.label}
                  titleColor={negroAzulado}
                />
              );
            })}
          </>
        </DropdownSeccion>
      ))}
    </FondoScrollGradiente>
  );
}