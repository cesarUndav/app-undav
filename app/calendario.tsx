import React, { act, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';
import BottomBar from '../components/BottomBar';

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
function hoyMasDias(dias:number) { return new Date(Date.now() + 86400000 * dias); }

export type Actividad = {
  id:number,
  title:string,
  body:string
}

export default function Calendario() {
  const [loading, setLoading] = useState(true);
  const [listaActividades, setListaActividades] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState("");

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const url = UrlObtenerAgenda(usuarioActual.idPersona, DateToISOStringNoTime(hoyMasDias(0)));
        const json = JsonStringAObjeto(await ObtenerJsonString(url));
        
        const listaActividad: Actividad[] = [];
        if (json.error != null) { // si hay error, es decir, no hay actividades en la fecha:
          setTituloPagina("No hay Actividades HOY");
          setListaActividades([]);
        }
        else { // transformar actividades JSON a actividades Actividad:
          setTituloPagina("Actividades de HOY");
          json.forEach((elem: any, index: number) => {
            const nuevaActividad:Actividad = {
              id: index,
              title: `${elem.tipo_actividad} de ${elem.actividad}`,
              body: `${elem.horario} hs`
            };
            listaActividad.push(nuevaActividad);
          });
          setListaActividades(listaActividad);
        }
      }
      catch (error) {
        console.error('Error al obtener agenda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, []);

  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={{ flex: 1 }}>
      <View style={styles.container}>
      {loading && (<CustomText style={styles.title} >{"Cargando..."}</CustomText>)}
      <CustomText style={styles.title} >{tituloPagina}</CustomText>
        {listaActividades.map((evento) => (
        <View key={evento.id} style={eventoAgendaStyles.agendaItem}>
          <CustomText style={[eventoAgendaStyles.eventTitle, {color: '#000'} ]}> 
            {evento.title}
          </CustomText>
          <CustomText style={[eventoAgendaStyles.eventDate, {color: "#000"} ]}>{evento.body}</CustomText>
        </View>
      ))}
      </View>
    <BottomBar />
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
    alignSelf: 'center',
    marginVertical: 0
  }
});
