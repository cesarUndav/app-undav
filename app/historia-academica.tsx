import React, { act, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';

import {
  JsonStringAObjeto,
  ObtenerJsonString,
  usuarioActual
} from '@/data/DatosUsuarioGuarani';
import ListaItem from '@/components/ListaItem';

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
  nota:number,
  fecha:string
}

export default function HistoriaAcademica() {
  const [loading, setLoading] = useState(true);
  const [listaActividades, setListaActividades] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState("");
  const [cantMaterias, setCantMaterias] = useState(0);
  const [promedio, setPromedio] = useState(0);

  useEffect(() => {

    const fetchAgenda = async () => {
      try {
        const url = "http://172.16.1.43/guarani/3.17/rest/v2/personas/"+usuarioActual.idPersona+"/datosanalitico";
        const json = JsonStringAObjeto(await ObtenerJsonString(url));
        
        const listaActividad: Actividad[] = [];
        const listaActividadAprobadas: Actividad[] = [];

        if (json.error != null) { // si hay error, es decir, no hay actividades en la fecha:
          setTituloPagina("No hay Historia Académica");
          setListaActividades([]);
        }
        else { // transformar actividades JSON a actividades Actividad:
          setTituloPagina("Historia Académica");

          let cantMateriasAprobadas:number = 0;
          let sumaNotasAprobadas:number = 0;

          json.forEach((elem: any, index: number) => {
            const nota:number = Number(elem.nota);
            const nuevaActividad:Actividad = {
              id: index,
              title: `${elem.actividad_nombre}`,
              body: `Nota: ${nota}\n${elem.resultado}: ${elem.fecha}`,
              fecha: convertToISODateFormat(elem.fecha),
              nota: nota
            };
            listaActividad.push(nuevaActividad);
            if (nota >= 4) listaActividadAprobadas.push(nuevaActividad);
          });

          cantMateriasAprobadas = listaActividadAprobadas.length;
          sumaNotasAprobadas = listaActividadAprobadas.reduce((acc, curr) => acc + curr.nota, 0);
          
          setCantMaterias(cantMateriasAprobadas);
          cantMateriasAprobadas == 0 ? setPromedio(0) : setPromedio(sumaNotasAprobadas/cantMateriasAprobadas);
          
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

      <ScrollView contentContainerStyle={styles.container}>

        {loading && (<CustomText style={styles.title} >{"Cargando..."}</CustomText>)}
        {!loading && <CustomText style={styles.estadisticas}> 
          {"Materias aprobadas: "+cantMaterias+"\nPromedio: "+promedio.toFixed(2)}
        </CustomText>
        }
        
        {listaActividades.map((actividad) => (
          <ListaItem
            key={actividad.id}
            title={actividad.title}
            subtitle={actividad.body}
          />
        ))}

      </ScrollView>
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
  },
  estadisticas: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#0b254a',
    marginVertical: 8,
    marginHorizontal: 20
  }
});
