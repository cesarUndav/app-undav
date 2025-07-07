import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomText from '../components/CustomText';
import {
  JsonStringAObjeto,
  ObtenerJsonString
} from '@/data/DatosUsuarioGuarani_VIEJO';
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
  id: number,
  title: string,
  body: string,
  nota: number,
  fecha: string
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
  const [materiasPorCuatrimestre, setMateriasPorCuatrimestre] = useState(0);

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

  useEffect(() => {
    const fetchHistoria = async () => {
      try {
        const url = "http://172.16.1.43/guarani/3.17/rest/v2/personas/" + infoBaseUsuarioActual.idPersona + "/datosanalitico";
        const json = JsonStringAObjeto(await ObtenerJsonString(url));

        const listaActividad: Actividad[] = [];
        const listaActividadAprobadas: Actividad[] = [];

        if (json.error != null) {
          setListaActividades([]);
          setListaActividadesAprobadas([]);
        } else {
          let sumaNotasAprobadas = 0;
          let sumaNotasTotal = 0;
          const fechas = new Set<string>();

          json.forEach((elem: any, index: number) => {
            const nota = Number(elem.nota);
            const fechaISO = convertToISODateFormat(elem.fecha);
            const nuevaActividad: Actividad = {
              id: index,
              title: `${elem.actividad_nombre}`,
              body: `Nota: ${nota}\n${elem.resultado}: ${elem.fecha}`,
              fecha: fechaISO,
              nota: nota
            };
            listaActividad.push(nuevaActividad);
            sumaNotasTotal += nota;
            fechas.add(fechaISO.slice(0, 7)); // año-mes
            if (nota >= 4) {
              listaActividadAprobadas.push(nuevaActividad);
              sumaNotasAprobadas += nota;
            }
          });

          const cantMateriasAprobadas = listaActividadAprobadas.length;
          const cantMateriasTotal = listaActividad.length;

          setCantMaterias(cantMateriasAprobadas);
          setPromedio(cantMateriasAprobadas === 0 ? 0 : sumaNotasAprobadas / cantMateriasAprobadas);
          setPromedioConAplazos(cantMateriasTotal === 0 ? 0 : sumaNotasTotal / cantMateriasTotal);

          const cuatrimestres = fechas.size / 2 || 1;
          setMateriasPorCuatrimestre(cantMateriasAprobadas / cuatrimestres);

          listaActividad.sort((b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
          listaActividadAprobadas.sort((b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

          setListaActividades(listaActividad);
          setListaActividadesAprobadas(listaActividadAprobadas);
          setHayHistoria(true);
        }
      } catch (error) {
        console.error('Error al obtener historia académica:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoria();
  }, [conAplazos]);

  return (
    <FondoGradiente style={{ gap: 10, paddingBottom: 15 }}>
      <LoadingWrapper loading={loading}>
        <View>
          <CustomText style={styles.estadisticas}>
            {hayHistoria ?
              "Materias aprobadas: " + cantMaterias +
              (conAplazos ?
                "\nNota promedio con aplazos: " + promedioConAplazos.toFixed(2)
                : "\nNota promedio: " + promedio.toFixed(2)) +
              "\nMaterias por cuatrimestre promedio: " + materiasPorCuatrimestre.toFixed(2)
              : "No hay historia académica."}
          </CustomText>

          <TouchableOpacity onPress={() => setConAplazos(!conAplazos)}>
            <CustomText style={[styles.estadisticas, { color: azulClaro }]}>
              {conAplazos ? "Ocultar Aplazos" : "Mostrar Aplazos"}
            </CustomText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ gap: 8, paddingHorizontal: 15 }}>
          {mostrarListaActividad()}
        </ScrollView>

        <View style={{ paddingHorizontal: 15 }}>
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
    marginBottom: 10
  },
  estadisticas: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: negroAzulado,
    marginHorizontal: 15
  }
});
