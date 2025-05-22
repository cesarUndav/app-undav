import React, { act, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { Tabs } from 'expo-router';

export function DateToISOStringNoTime(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}
function convertToISODateFormat(dateStr: string): string {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export type Actividad = {
  id:number,
  title:string,
  body:string,
  fecha:string
}

export default function HistoriaAcademica() {
  const [loading, setLoading] = useState(true);
  const [listaActividades, setListaActividades] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState("");

  useEffect(() => {

    const fetchAgenda = async () => {
      try {
        const url = "http://172.16.1.43/guarani/3.17/rest/v2/personas/"+usuarioActual.idPersona+"/datosanalitico";
        const json = JsonStringAObjeto(await ObtenerJsonString(url));
        
        const listaActividad: Actividad[] = [];
        if (json.error != null) { // si hay error, es decir, no hay actividades en la fecha:
          setTituloPagina("No hay Historia Académica");
          setListaActividades([]);
        }
        else { // transformar actividades JSON a actividades Actividad:
          setTituloPagina("Historia Académica");
          json.forEach((elem: any, index: number) => {
            if (elem.nota > 3) { // FILTROS!!!!!!!!!!!!!!!!!!!!!
              const nuevaActividad:Actividad = {
                id: index,
                title: `${elem.actividad_nombre}`,
                body: `Nota: ${elem.nota}\n${elem.resultado}: ${elem.fecha}`,
                fecha: convertToISODateFormat(elem.fecha)
              };
              listaActividad.push(nuevaActividad);
            }
          });
          listaActividad.sort((b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
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
      <Tabs.Screen
        options ={{
          title: 'Historia Académica',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          
          headerTransparent: false,
          headerTintColor: '#1a2b50'
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
      
        {loading && (<CustomText style={styles.title} >{"Cargando..."}</CustomText>)}

        {listaActividades.map((evento) => (
        <View key={evento.id} style={eventoAgendaStyles.agendaItem}>
          <CustomText style={[eventoAgendaStyles.eventTitle, {color: '#000'} ]}> 
            {evento.title}
          </CustomText>
          <CustomText style={[eventoAgendaStyles.eventDate, {color: "#000"} ]}>{evento.body}</CustomText>
        </View>
      ))}
      </ScrollView>
    <BottomBar />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginVertical: 0,
    marginBottom: 10
  }
});
