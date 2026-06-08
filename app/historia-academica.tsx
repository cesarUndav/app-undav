import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CustomText from '../components/CustomText';
import {
  ObtenerAnalitico,
  ObtenerJsonString, // Quitamos JsonStringAObjeto de acá
  infoBaseUsuarioActual
} from '@/data/apiAppUndav';
import ListaItem from '@/components/ListaItem';
import LoadingWrapper from '@/components/LoadingWrapper';
import { azulClaro, negroAzulado } from '@/constants/Colors';
import BarraBusqueda, { coincideBusqueda } from '@/components/BarraBusqueda';
import FondoGradiente from '@/components/FondoGradiente';
import React from 'react';

function convertToISODateFormat(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
  const [listaActividadesAprobadas, setListaActividadesAprobadas] = useState<
    Actividad[]
  >([]);
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
    ));
  }

useEffect(() => {
  const fetchHistoria = async () => {
    setLoading(true);
    try {
      // 1. Llamamos a la API
      const json = await ObtenerAnalitico();

      const listaActividad: Actividad[] = [];
      const listaActividadAprobadas: Actividad[] = [];
      
      let sumaNotasAprobadas = 0;
      let sumaNotasTotal = 0;
      const fechas = new Set<string>();

      // 🛠️ CORRECCIÓN 1: Accedemos de manera segura a json.data porque es la nueva raíz del array
      const registros = json && Array.isArray(json.data) ? json.data : [];

      registros.forEach((elem: any, index: number) => {
        const nota = Number(elem.nota);
        
        // 🛠️ CORRECCIÓN 2: Parseo seguro de fecha "DD/MM/YYYY" a formato ordenable "YYYY-MM-DD"
        let fechaISO = '';
        if (elem.fecha && elem.fecha.includes('/')) {
          const [dia, mes, anio] = elem.fecha.split('/');
          fechaISO = `${anio}-${mes}-${dia}`; // Queda "2025-02-24"
        } else {
          // Por si las dudas la función vieja aún sirve para algún caso alternativo
          fechaISO = convertToISODateFormat(elem.fecha);
        }

        const nuevaActividad: Actividad = {
          id: index,
          title: `${elem.actividad_nombre}`,
          body: `Nota: ${nota}\n${elem.resultado}: ${elem.fecha}`,
          fecha: fechaISO,
          nota: nota,
        };

        listaActividad.push(nuevaActividad);
        sumaNotasTotal += nota;
        
        if (fechaISO && fechaISO.length >= 7) {
          fechas.add(fechaISO.slice(0, 7)); // Guarda "YYYY-MM"
        }

        // Validación de aprobación (notas del 4 al 10)
        if (nota >= 4) {
          listaActividadAprobadas.push(nuevaActividad);
          sumaNotasAprobadas += nota;
        }
      });

      const cantMateriasAprobadas = listaActividadAprobadas.length;
      const cantMateriasTotal = listaActividad.length;

      // Cálculos estadísticos
      setCantMaterias(cantMateriasAprobadas);
      setPromedio(
        cantMateriasAprobadas === 0
          ? 0
          : sumaNotasAprobadas / cantMateriasAprobadas
      );
      setPromedioConAplazos(
        cantMateriasTotal === 0 ? 0 : sumaNotasTotal / cantMateriasTotal
      );

      const cuatrimestres = fechas.size / 2 || 1;
      setMateriasPorCuatrimestre(cantMateriasAprobadas / cuatrimestres);

      // Ordenar de más reciente a más antigua
      listaActividad.sort(
        (b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
      listaActividadAprobadas.sort(
        (b, a) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

      // Guardar en estados
      setListaActividades(listaActividad);
      setListaActividadesAprobadas(listaActividadAprobadas);
      setHayHistoria(listaActividad.length > 0);

    } catch (error) {
      console.error('Error al obtener historia académica:', error);
      setListaActividades([]);
      setListaActividadesAprobadas([]);
      setHayHistoria(false);
    } finally {
      setLoading(false);
    }
  };

  fetchHistoria();
}, [conAplazos]);
  return (
    <FondoGradiente style={styles.fondo}>
      <LoadingWrapper loading={loading}>
        <View>
          
          <CustomText weight="bold" style={styles.estadisticas}>
            {hayHistoria
              ? 'Materias aprobadas: ' +
                cantMaterias +
                (conAplazos
                  ? '\nNota promedio con aplazos: ' +
                    promedioConAplazos.toFixed(2)
                  : '\nNota promedio: ' + promedio.toFixed(2)) +
                '\nMaterias por cuatrimestre promedio: ' +
                materiasPorCuatrimestre.toFixed(2)
              : 'No hay historia académica.'}
          </CustomText>

          <TouchableOpacity onPress={() => setConAplazos(!conAplazos)}>
            <CustomText
              weight="bold"
              style={[styles.estadisticas, styles.toggleAplazos]}
            >
              {conAplazos ? 'Ocultar Aplazos' : 'Mostrar Aplazos'}
            </CustomText>
          </TouchableOpacity>

          <View style={{padding: 10, paddingBottom: 0}}>
            <BarraBusqueda value={search} onChangeText={setSearch} />
          </View>

        </View>

        <ScrollView contentContainerStyle={styles.listaContainer}>
          {mostrarListaActividad()}
        </ScrollView>


      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  fondo: {
    gap: 10,
    paddingBottom: 15,
  },
  listaContainer: {
    gap: 8,
    paddingHorizontal: 15,
  },
  busquedaContainer: {
    paddingHorizontal: 15,
  },
  estadisticas: {
    fontSize: 16,
    lineHeight: 22,
    color: negroAzulado,
    marginHorizontal: 15,
  },
  toggleAplazos: {
    color: azulClaro,
  },
});