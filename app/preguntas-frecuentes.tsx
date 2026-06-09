// app/preguntas-frecuentes.tsx

import React, { useState } from 'react';
// 🌟 IMPORTANTE: Agregamos KeyboardAvoidingView y Platform
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '@/components/CustomText';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';
import BarraBusqueda, { coincideBusqueda } from '@/components/BarraBusqueda';
import FondoGradiente from '@/components/FondoGradiente';

type SegmentoRespuesta =
  | {
      tipo: 'texto';
      texto: string;
    }
  | {
      tipo: 'link';
      texto: string;
      ruta: string;
    };

type ParrafoRespuesta = SegmentoRespuesta[];

type Faq = {
  pregunta: string;
  respuesta: ParrafoRespuesta[];
};

const grisTexto = '#444';
const grisBorde = '#ccc';
const azulClaro = '#005BA4';

const faqs: Faq[] = [
  {
    pregunta: '¿Qué carreras se pueden estudiar en la UNDAV?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Podés consultar las carreras disponibles desde la sección ',
        },
        {
          tipo: 'link',
          texto: 'Oferta académica.',
          ruta: '/oferta-academica',
        },
        {
          tipo: 'texto',
          texto: 'Allí vas a encontrar las propuestas organizadas por departamento, con información de cada carrera.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Dónde puedo ver información de una carrera en particular?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Ingresá a ',
        },
        {
          tipo: 'link',
          texto: 'Oferta académica,',
          ruta: '/oferta-academica',
        },
        {
          tipo: 'texto',
          texto: 'seleccioná el departamento correspondiente y luego tocá la carrera que te interese para ver más información.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Cuándo comienza el próximo período de inscripción?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Los períodos de inscripción pueden cambiar según el año y el cuatrimestre. Para conocer las fechas vigentes, consultá nuestro ',
        },
        {
          tipo: 'link',
          texto: 'Calendario académico',
          ruta: '/calendario-academico-visitante',
        },
        {
          tipo: 'texto',
          texto: '.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Cómo me preinscribo a una carrera?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Para iniciar el proceso de inscripción, primero tenés que completar el formulario de preinscripción. También podés revisar la sección ',
        },
        {
          tipo: 'link',
          texto: 'Autogestión',
          ruta: '/autogestion',
        },
        {
          tipo: 'texto',
          texto: ' para conocer la documentación necesaria y los pasos generales del trámite.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Qué documentación necesito para inscribirme?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'La documentación puede variar según la modalidad de la carrera y tu situación académica. En general, se solicita formulario de preinscripción, DNI y título secundario o constancia de título en trámite.',
        },
      ],
      [
        {
          tipo: 'texto',
          texto: 'Para más información, consultá la sección ',
        },
        {
          tipo: 'link',
          texto: 'Autogestión',
          ruta: '/autogestion',
        },
        {
          tipo: 'texto',
          texto: '.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Puedo inscribirme si todavía no tengo el título secundario?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'En muchos casos se puede iniciar el trámite con una constancia de título en trámite, pero la documentación válida y los plazos dependen de las condiciones vigentes de inscripción.',
        },
      ],
      [
        {
          tipo: 'texto',
          texto: 'Te recomendamos revisar ',
        },
        {
          tipo: 'link',
          texto: 'Autogestión',
          ruta: '/autogestion',
        },
        {
          tipo: 'texto',
          texto: ' y comunicarte con el área correspondiente si tenés dudas sobre tu caso particular.',
        },
      ],
    ],
  },
  {
    pregunta: '¿La UNDAV tiene carreras a distancia?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'La UNDAV cuenta con propuestas académicas en modalidad presencial y también con propuestas a distancia. Para ver la información disponible, podés ingresar a ',
        },
        {
          tipo: 'link',
          texto: 'Oferta académica',
          ruta: '/oferta-academica',
        },
        {
          tipo: 'texto',
          texto: ' o revisar la sección ',
        },
        {
          tipo: 'link',
          texto: 'Autogestión',
          ruta: '/autogestion',
        },
        {
          tipo: 'texto',
          texto: '.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Dónde se cursan las carreras?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'La universidad cuenta con distintas sedes. Podés consultar fotos, direcciones e integración con mapas desde la sección ',
        },
        {
          tipo: 'link',
          texto: 'Sedes',
          ruta: '/sedes',
        },
        {
          tipo: 'texto',
          texto: '.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Cómo llego a una sede de la UNDAV?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Desde la sección ',
        },
        {
          tipo: 'link',
          texto: 'Sedes',
          ruta: '/sedes',
        },
        {
          tipo: 'texto',
          texto: ' podés ver la ubicación de cada sede y abrir el recorrido en Google Maps.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Dónde puedo ver fechas importantes del año académico?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Las fechas importantes, como períodos de inscripción, inicio de cursadas y otras actividades académicas, se pueden consultar en el ',
        },
        {
          tipo: 'link',
          texto: 'Calendario académico',
          ruta: '/calendario-academico-visitante',
        },
        {
          tipo: 'texto',
          texto: '.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Dónde puedo seguir las novedades de la universidad?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Podés seguir las novedades institucionales desde la sección ',
        },
        {
          tipo: 'link',
          texto: 'Redes',
          ruta: '/redes',
        },
        {
          tipo: 'texto',
          texto: ', donde vas a encontrar los canales oficiales de comunicación de la universidad.',
        },
      ],
    ],
  },
  {
    pregunta: '¿La UNDAV es una universidad pública?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'Sí, la Universidad Nacional de Avellaneda es una universidad pública. Sus carreras cuentan con titulaciones de alcance nacional.',
        },
      ],
    ],
  },
  {
    pregunta: '¿Necesito ser estudiante para usar esta app?',
    respuesta: [
      [
        {
          tipo: 'texto',
          texto: 'No. Esta app también incluye información útil para visitantes y futuros estudiantes, como oferta académica, sedes, calendario académico, inscripciones y redes oficiales.',
        },
      ],
    ],
  },
];

export default function PreguntasFrecuentes() {
  const [search, setSearch] = useState('');
  const [expandedPregunta, setExpandedPregunta] = useState<string | null>(null);

  const toggleCollapse = (pregunta: string) => {
    setExpandedPregunta((prev) => (prev === pregunta ? null : pregunta));
  };

  const navegar = (ruta: string) => {
    router.push(ruta as never);
  };

  const faqsFiltradas = faqs.filter((faq) => {
    if (!search.trim()) return true;
    if (coincideBusqueda(faq.pregunta, search)) return true;
    return faq.respuesta.some((parrafo) =>
      parrafo.some((segmento) => coincideBusqueda(segmento.texto, search))
    );
  });

  return (
    <FondoGradiente>
      {/* La barra queda abajo del scroll, pero empujada dinámicamente por el KeyboardAvoidingView */}
      <View style={styles.busquedaContainer}>
        <BarraBusqueda value={search} onChangeText={setSearch} />
      </View>
      <ScrollView contentContainerStyle={{gap: 10}}>
        <CustomText style={styles.descripcion} weight='bold'>
          Información útil para visitantes, aspirantes y personas interesadas en
          estudiar en la Universidad Nacional de Avellaneda.
        </CustomText>
        {faqsFiltradas.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={grisBorde} />
            <CustomText weight="bold" style={styles.noResultsText}>
              No se encontraron preguntas que coincidan con tu búsqueda.
            </CustomText>
          </View>
        ) : (
          faqsFiltradas.map((faq) => {
            const estaAbierto = expandedPregunta === faq.pregunta;

            return (
              <View key={faq.pregunta} style={styles.faqContainer}>
                <TouchableOpacity
                  onPress={() => toggleCollapse(faq.pregunta)}
                  activeOpacity={0.85}
                  style={[
                    styles.preguntaHeader,
                    {
                      borderBottomRightRadius: estaAbierto ? 0 : 28,
                    },
                  ]}
                >
                  <CustomText weight="bold" style={styles.preguntaText}>
                    {faq.pregunta}
                  </CustomText>

                  <Ionicons
                    name={estaAbierto ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>

                <Collapsible collapsed={!estaAbierto}>
                  <View style={styles.respuestaContainer}>
                    {faq.respuesta.map((parrafo, parrafoIndex) => (
                      <View key={parrafoIndex} style={styles.parrafo}>
                        {parrafo.map((segmento, segmentoIndex) => {
                          if (segmento.tipo === 'link') {
                            return (
                              <TouchableOpacity
                                key={`${segmento.texto}-${segmentoIndex}`}
                                onPress={() => navegar(segmento.ruta)}
                                activeOpacity={0.7}
                              >
                                <CustomText style={styles.linkText}>
                                  {segmento.texto}{' '}
                                </CustomText>
                              </TouchableOpacity>
                            );
                          }

                          return (
                            <CustomText
                              key={`${segmento.texto}-${segmentoIndex}`}
                              style={styles.respuestaText}
                            >
                              {segmento.texto}
                            </CustomText>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </Collapsible>
              </View>
            );
          })
        )}
      </ScrollView>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  // 🌟 AGREGAMOS ESTE ESTILO BASE
  container: {
    flex: 1,
    backgroundColor: '#fff', // O el color de fondo de tu app
  },
  descripcion: {
    fontSize: 14,
    //lineHeight: 20,
    color: grisTexto,
  },
  faqContainer: {
  },
  preguntaHeader: {
    backgroundColor: azulLogoUndav,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomRightRadius: 28,
  },
  preguntaText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginRight: 12,
  },
  respuestaContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 4,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: grisBorde,
    borderBottomRightRadius: 28,
  },
  parrafo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  respuestaText: {
    fontSize: 15,
    lineHeight: 22,
    color: negroAzulado,
  },
  linkText: {
    fontSize: 15,
    lineHeight: 22,
    color: azulClaro,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  busquedaContainer: {
    paddingHorizontal: 0,
    paddingBottom: 0, // Aire adaptado al sistema operativo
    paddingTop: 0,
    backgroundColor: '#fff', // Evita que se transparente el scroll por detrás al subir
    gap: 10,
    marginBottom: 10
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10
  },
  noResultsText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 12,
    fontSize: 15,
    paddingHorizontal: 20,
  },
});