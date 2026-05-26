// app/preinscripcion.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import CustomText from '@/components/CustomText';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTexto from '@/components/BotonTexto';
import BotonTextoMail from '@/components/BotonTextoMail';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';
import ListaItem from '@/components/ListaItem';

import {
  azulLogoUndav,
  azulMedioUndav,
  azulClaro,
  grisTexto,
  negroAzulado,
} from '@/constants/Colors';

const PREINSCRIPCION_URL = 'https://academica.undav.edu.ar/preinscripcion/';
const CONVALIDACION_URL =
  'https://www.argentina.gob.ar/educacion/tramites/convalidar-titulo-secundario-de-paises-con-convenio';

const MAPA_SEDE_PINEYRO =
  'https://www.google.com/maps/search/?api=1&query=Isleta%201940%2C%20Pi%C3%B1eyro%2C%20Avellaneda';

const documentacionPresencial = [
  'Formulario de preinscripción completo y firmado.',
  'DNI original y fotocopia.',
  'Título secundario original y fotocopia.',
  'Título definitivo o título en trámite con fecha del año y mes en curso.',
  'En caso de estudiantes extranjeros sin DNI argentino: pasaporte y residencia precaria vigentes.',
  'Para títulos emitidos en el exterior: convalidación emitida por la Secretaría de Educación de la Nación.',
  'Para Ciclos de Complementación Curricular: revisar los requisitos específicos de cada carrera.',
];

const documentacionDistancia = [
  'Formulario de preinscripción.',
  'DNI.',
  'Título secundario.',
];

export default function Inscripciones() {
  const irAlCalendarioAcademico = () => {
    router.push('/calendario-academico-visitante');
  };

  return (
    <FondoScrollGradiente>
      <View style={styles.header}>
        <CustomText weight="bold" style={styles.titulo}>
          Inscripciones
        </CustomText>

        <CustomText style={styles.descripcion}>
          Información para ingresar a carreras de grado, pregrado y propuestas a
          distancia de la Universidad Nacional de Avellaneda.
        </CustomText>
      </View>

      <View style={styles.cardDestacada}>
        <CustomText weight="bold" style={styles.cardDestacadaEtiqueta}>
          Fechas de inscripción
        </CustomText>

        <CustomText weight="bold" style={styles.cardDestacadaTitulo}>
          Consultá el Calendario Académico
        </CustomText>

        <CustomText style={styles.cardDestacadaTexto}>
          Los períodos de inscripción pueden cambiar según el año y el
          cuatrimestre. Para conocer las fechas vigentes, revisá el Calendario
          Académico de la UNDAV.
        </CustomText>

        <TouchableOpacity
          style={styles.botonCalendario}
          onPress={irAlCalendarioAcademico}
          activeOpacity={0.85}
        >
          <CustomText weight="bold" style={styles.botonCalendarioTexto}>
            Ver Calendario Académico
          </CustomText>
        </TouchableOpacity>
      </View>

      <DropdownSeccion titulo="Modalidad presencial">
        <>
          <ListaItem
            title="Para completar la inscripción a carreras presenciales tenés que presentar la documentación correspondiente en la Oficina de Inscripciones de la Sede Piñeyro."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="Lugar: Sede Piñeyro, Isleta 1940, entre Mario Bravo y Paso de la Patria, Piñeyro, Avellaneda."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="Horario de atención: días hábiles, de 9 a 19 hs."
            titleColor={negroAzulado}
          />

          <BotonTexto
            label="Completar preinscripción"
            url={PREINSCRIPCION_URL}
          />

          <BotonTexto
            label="Ver ubicación de Sede Piñeyro"
            url={MAPA_SEDE_PINEYRO}
          />

          <BotonTexto
            label="Ver trámite de convalidación de título extranjero"
            url={CONVALIDACION_URL}
          />
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Documentación presencial">
        <>
          {documentacionPresencial.map((item) => (
            <ListaItem key={item} title={item} titleColor={negroAzulado} />
          ))}
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Modalidad distancia">
        <>
          <ListaItem
            title="Para las propuestas académicas a distancia, la documentación debe enviarse en un solo archivo en formato PDF."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="Las carreras a distancia están sujetas al Régimen Administrativo EaD. Para más información, comunicate con el área correspondiente."
            titleColor={negroAzulado}
          />

          <BotonTextoMail
            label="Enviar documentación a Inscripciones"
            mail="inscripciones@undav.edu.ar"
            asunto=""
            cuerpo=""
          />

          <BotonTextoMail
            label="Consultar sobre Educación a Distancia"
            mail="administracionead@undav.edu.ar"
            asunto=""
            cuerpo=""
          />
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Documentación modalidad distancia">
        <>
          {documentacionDistancia.map((item) => (
            <ListaItem key={item} title={item} titleColor={negroAzulado} />
          ))}
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Si sos o fuiste estudiante UNDAV">
        <>
          <ListaItem
            title="Si ya tenés legajo en una carrera UNDAV, no hace falta que realices el proceso de preinscripción."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="Para volver a cursar tu carrera, comunicate con el área de readmisiones."
            titleColor={negroAzulado}
          />

          <ListaItem
            title="Si querés comenzar otra carrera, consultá con el área de cambios de carrera."
            titleColor={negroAzulado}
          />

          <BotonTextoMail
            label="Consultar por readmisión"
            mail="readmisiones@undav.edu.ar"
            asunto=""
            cuerpo=""
          />

          <BotonTextoMail
            label="Consultar por cambio de carrera"
            mail="cambiosdecarreras@undav.edu.ar"
            asunto=""
            cuerpo=""
          />
        </>
      </DropdownSeccion>

      <DropdownSeccion titulo="Consultas">
        <>
          <BotonTextoMail
            label="Inscripciones"
            mail="inscripciones@undav.edu.ar"
            asunto=""
            cuerpo=""
          />

          <BotonTextoTelefono label="Teléfono: 5436-7545" tel="54367545" />
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
  cardDestacadaEtiqueta: {
    fontSize: 13,
    color: '#b1b2b1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardDestacadaTitulo: {
    fontSize: 22,
    color: 'white',
    marginBottom: 8,
  },
  cardDestacadaTexto: {
    fontSize: 15,
    lineHeight: 22,
    color: 'white',
    marginBottom: 14,
  },
  botonCalendario: {
    backgroundColor: azulClaro,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 28,
  },
  botonCalendarioTexto: {
    fontSize: 15,
    color: 'white',
  },
});