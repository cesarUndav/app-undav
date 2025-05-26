import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';
import { Ionicons } from '@expo/vector-icons';

import {
  JsonStringAObjeto,
  ObtenerJsonString,
  UrlObtenerAgenda,
  usuarioActual
} from '@/data/DatosUsuarioGuarani';
import { eventoAgendaStyles } from './agenda';

export function DateToISOStringNoTime(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}
function hoyMasDias(dias: number) {
  return new Date(Date.now() + 86400000 * dias);
}

export type Actividad = {
  id: number,
  title: string,
  body: string
};

export function IndexToDiaString(index: number): string {
  switch (index) {
    case 0: return "domingo";
    case 1: return "lunes";
    case 2: return "martes";
    case 3: return "miércoles";
    case 4: return "jueves";
    case 5: return "viernes";
    case 6: return "sábado";
    default: return "Día inválido.";
  }
}

export default function Calendario() {
  const [loading, setLoading] = useState(true);
  const [listaActividades, setListaActividades] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState("");
  const [numDias, setNumDias] = useState(0);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setLoading(true);
        const hoy = hoyMasDias(0);
        const fecha = hoyMasDias(numDias);
        const diaString = IndexToDiaString(fecha.getDay());
        const url = UrlObtenerAgenda(usuarioActual.idPersona, DateToISOStringNoTime(fecha));
        const json = JsonStringAObjeto(await ObtenerJsonString(url));

        const listaActividad: Actividad[] = [];
        if (json.error != null) {
          setTituloPagina("No hay actividades " + (numDias === 0 ? `hoy, ${diaString}` : `el ${diaString}`));
          setListaActividades([]);
        } else {
          const esHoy = fecha.toDateString() === hoy.toDateString();
          setTituloPagina("Actividades " + (esHoy ? "de hoy, " : "del ") + diaString);
          json.forEach((elem: any, index: number) => {
            const nuevaActividad: Actividad = {
              id: index,
              title: `${elem.tipo_actividad} de ${elem.actividad}`,
              body: `${elem.horario} hs`
            };
            listaActividad.push(nuevaActividad);
          });
          setListaActividades(listaActividad);
        }
      } catch (error) {
        console.error('Error al obtener agenda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [numDias]);

  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <View style={styles.headerButtons}>
        <TouchableOpacity onPress={() => setNumDias(numDias - 1)} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#1a2b50" />
        </TouchableOpacity>

        <CustomText style={styles.title}>
          {loading ? "Cargando..." : tituloPagina}
        </CustomText>

        <TouchableOpacity onPress={() => setNumDias(numDias + 1)} style={styles.navButton}>
          <Ionicons name="arrow-forward" size={24} color="#1a2b50" />
        </TouchableOpacity>
      </View>

      {listaActividades.map((evento) => (
        <View key={evento.id} style={eventoAgendaStyles.agendaItem}>
          <CustomText style={[eventoAgendaStyles.eventTitle, { color: '#000' }]}>
            {evento.title}
          </CustomText>
          <CustomText style={[eventoAgendaStyles.eventDate, { color: "#000" }]}>
            {evento.body}
          </CustomText>
        </View>
      ))}

      <TouchableOpacity style = {styles.bloque} onPress={() => Linking.openURL("https://undav.edu.ar/index.php?idcateg=129")}>
        <CustomText style={styles.subtitulo} >Calendario Académico</CustomText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b254a',
    marginHorizontal: 10,
    textAlign: 'center',
    flex: 1
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  navButton: {
    padding: 10
  },
  navText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b254a'
  },
    bloque: {
    //backgroundColor: '#e3f0fb',
    backgroundColor: '#173c68',
    borderBottomRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
    elevation: 6
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
    //color: '#0b5085',
  }
});
