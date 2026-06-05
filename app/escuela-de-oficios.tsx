// app/escuela-de-oficios.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';

import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import CustomText from '@/components/CustomText';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoMail from '@/components/BotonTextoMail';
import BotonTexto from '@/components/BotonTexto';
import ListaItem from '@/components/ListaItem';

import {
  azulLogoUndav,
  azulClaro,
  grisTexto,
  negroAzulado,
} from '@/constants/Colors';

const MAIL_ESCUELA_OFICIOS = 'escueladeoficio@undav.edu.ar';

const MAPA_ESCUELA_OFICIOS =
  'https://www.google.com/maps/search/?api=1&query=Constituci%C3%B3n%20627%2C%20Avellaneda';

const objetivos = [
  'Crear trayectos formativos que puedan continuar en una tecnicatura universitaria preuniversitaria, tomando como base la formación en sectores como alimentos, administración y servicios e informática.',
  'Crear trayectos formativos flexibles, articulados entre diferentes módulos, que permitan distintas orientaciones.',
  'Generar vínculos institucionales con empresas, sindicatos y organizaciones sociales basados en la capacitación, asesoramiento y transferencia.',
  'Articular con centros de formación profesional sindicales, municipales, provinciales y nacionales para generar una propuesta complementaria y superadora de oficios.',
];

const cursosDisponibles = [
  'Carpintería en madera reciclada',
  'Reparación de PC y redes',
  'Instalación de fibra óptica',
  'Introducción al abordaje comunitario de los consumos problemáticos',
  'Tapicería',
  'Community manager',
  'Seguridad informática básica',
  'Testing de aplicaciones',
  'Pensamiento Computacional y Python 1',
  'Modelado de impresión 3D',
  'Asistente de estudio jurídico y notarial',
  'Inglés',
  'Auxiliar de carpintería en madera reciclada',
  'Manicuría',
  'Reparación de celulares',
];

export default function EscuelaDeOficios() {
  return (
    <FondoScrollGradiente>
      <View style={styles.header}>
        <CustomText style={styles.descripcion} weight='bold'>
          Propuesta de formación profesional orientada al trabajo, la producción
          y las necesidades del territorio.
        </CustomText>
      </View>

      <View style={styles.cardDestacada}>
        <CustomText weight="bold" style={styles.cardTitulo}>
          Formación profesional
        </CustomText>

        <CustomText style={styles.cardTexto}>
          La Escuela de Oficios ofrece trayectos formativos vinculados al mundo
          del trabajo, con propuestas flexibles y articuladas con distintos
          sectores productivos, sociales e institucionales.
        </CustomText>
      </View>

      <DropdownSeccion titulo="Fundamentos">
        <>
          <ListaItem
            title="Abordar la formación profesional en el siglo XXI implica pensar y actuar sobre un universo amplio y diverso del mundo del trabajo."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="La formación profesional adquiere características específicas según el sector de la economía, la rama de actividad y la región del país."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="Su eje central está vinculado a acompañar políticas y proyectos que generen trabajo asociado a la producción y fortalezcan las capacidades organizativas del trabajo."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="La formación profesional no apunta solo a brindar una herramienta individual, sino también a fortalecer procesos de organización del trabajo, adaptándose a las necesidades del territorio."
            titleColor={negroAzulado}
          />
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Objetivos">
        <>
          {objetivos.map((objetivo) => (
            <ListaItem
              key={objetivo}
              title={objetivo}
              titleColor={negroAzulado}
            />
          ))}
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Cursos disponibles">
        <>
          <ListaItem
            title="En la Escuela se dictan distintos cursos. Para consultar la disponibilidad de cada uno, se debe enviar un correo electrónico."
            titleColor={negroAzulado}
          />

          <BotonTextoMail
            label="Consultar disponibilidad de cursos"
            mail={MAIL_ESCUELA_OFICIOS}
            asunto=""
            cuerpo=""
          />

          {cursosDisponibles.map((curso) => (
            <ListaItem key={curso} title={curso} titleColor={negroAzulado} />
          ))}
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Información de contacto">
        <>
          <BotonTextoMail
            label="Enviar consulta por correo"
            mail={MAIL_ESCUELA_OFICIOS}
            asunto=""
            cuerpo=""
          />

          <ListaItem
            title="Constitución 627, Avellaneda."
            titleColor={negroAzulado}
          />

          <BotonTexto
            label="Ver ubicación en Google Maps"
            url={MAPA_ESCUELA_OFICIOS}
          />
        </>
      </DropdownSeccion>
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 28,
    color: azulLogoUndav,
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    lineHeight: 22,
    color: grisTexto,
  },
  cardDestacada: {
    backgroundColor: azulLogoUndav,
    padding: 18,
    marginBottom: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 28,
  },
  cardTitulo: {
    fontSize: 22,
    color: 'white',
    marginBottom: 8,
  },
  cardTexto: {
    fontSize: 15,
    lineHeight: 22,
    color: 'white',
  },
});