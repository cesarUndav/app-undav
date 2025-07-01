import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import CustomText from '../components/CustomText';

import {
  JsonStringAObjeto,
  ObtenerJsonString
} from '@/data/DatosUsuarioGuarani Backup'

import {
  infoBaseUsuarioActual
} from '@/data/DatosUsuarioGuarani';
import ListaItem from '@/components/ListaItem';
import LoadingWrapper from '@/components/LoadingWrapper';
import { azulClaro, negroAzulado } from '@/constants/Colors';
import BarraBusqueda, { coincideBusqueda } from '@/components/BarraBusqueda';
import FondoGradiente from '@/components/FondoGradiente';

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
  const [listaActividadesAprobadas, setListaActividadesAprobadas] = useState<Actividad[]>([]);
  const [hayHistoria, setHayHistoria] = useState(false);
  const [cantMaterias, setCantMaterias] = useState(0);
  const [promedio, setPromedio] = useState(0);
  const [promedioConAplazos, setPromedioConAplazos] = useState(0);
  const [conAplazos, setConAplazos] = useState(false);

  // BARRA DE BÚSQUEDA
  const [search, setSearch] = useState('');
  const actividadesMostradas = (conAplazos ? listaActividades : listaActividadesAprobadas)
  .filter((actividad) =>
    coincideBusqueda(actividad.title, search)
  );
  function mostrarListaActividad() {
    return actividadesMostradas.map((actividad) => (
      <ListaItem
        key={actividad.id}
        title={actividad.title}
        subtitle={actividad.body}
      />
    ))
  }
  //

  useEffect(() => {
    const fetchHistoria = async () => {
      try {
        const url = "http://172.16.1.43/guarani/3.17/rest/v2/personas/"+infoBaseUsuarioActual.idPersona+"/datosanalitico";
        const json = JsonStringAObjeto(await ObtenerJsonString(url));
        
        const listaActividad: Actividad[] = [];
        const listaActividadAprobadas: Actividad[] = [];

        if (json.error != null) { // si hay error, es decir, no hay actividades en la fecha: 
          setListaActividades([]);
          setListaActividadesAprobadas([]);
        }
        else { // transformar actividades JSON a actividades Actividad:
          let cantMateriasAprobadas:number = 0;
          let sumaNotasAprobadas:number = 0;

          let cantMateriasTotal:number = 0;
          let sumaNotasTotal:number = 0;

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
          cantMateriasAprobadas == 0 ? setPromedio(0) : setPromedio(sumaNotasAprobadas/cantMateriasAprobadas);
          setCantMaterias(cantMateriasAprobadas);

          cantMateriasTotal = listaActividad.length;
          sumaNotasTotal = listaActividad.reduce((acc, curr) => acc + curr.nota, 0);
          cantMaterias == 0 ? setPromedioConAplazos(0) : setPromedioConAplazos(sumaNotasTotal/cantMateriasTotal);

          
          listaActividad.sort((b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
          setListaActividades(listaActividad);

          listaActividadAprobadas.sort((b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
          setListaActividadesAprobadas(listaActividadAprobadas);
          setHayHistoria(true);
        }
      }
      catch (error) {
        console.error('Error al obtener agenda:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoria();
  }, [conAplazos]);


  return (

    <FondoGradiente style={{gap: 10, paddingBottom: 15}}>
      <LoadingWrapper loading={loading}>
        <View>
          <CustomText style={styles.estadisticas}> 
            {hayHistoria ? 
            "Materias Aprobadas: "+cantMaterias+
            (conAplazos ?
              "\nPromedio con Aplazos: "+promedioConAplazos.toFixed(2)
              : "\nPromedio: "+promedio.toFixed(2))
            : "No hay historia académica."}
          </CustomText>
          
          <TouchableOpacity onPress={() => setConAplazos(!conAplazos)}>
            <CustomText style={[styles.estadisticas, {color: azulClaro}]}>{conAplazos ? "Ocultar Aplazos" : "Mostrar Aplazos" }</CustomText>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{gap: 8, paddingHorizontal: 15}}>
            {mostrarListaActividad()}
        </ScrollView>
        <View style={{paddingHorizontal: 15}}>
          <BarraBusqueda value={search} onChangeText={setSearch} />
        </View>

      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center',
    marginVertical: 0,
    marginBottom: 10
  },
  estadisticas: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: negroAzulado,
    marginVertical: 0,
    marginHorizontal: 15
  }
});

