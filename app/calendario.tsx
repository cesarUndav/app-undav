import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import BotonTextoLink from '@/components/BotonTextoLink';
import BarraSemanal from './BarraSemanal';
import FondoGradiente from '@/components/FondoGradiente';

import {
  JsonStringAObjeto,
  ObtenerJsonString,
  UrlObtenerAgenda,
} from '@/data/DatosUsuarioGuarani Backup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';

export type Actividad = {
  id: number;
  title: string;
  body: string;
};

function fechaSumarDias(diasASumar: number, fechaOpcional?: Date): Date {
  const base = fechaOpcional ? fechaOpcional.getTime() : Date.now();
  return new Date(base + diasASumar * 86400000);
}

function DateToISOStringNoTime(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}

function IndexToDiaString(index: number): string {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[index] ?? 'Día inválido.';
}

export default function Calendario() {
  
  const diaHoy = fechaSumarDias(0);
  const numDiaHoy = diaHoy.getDay();

  const [loading, setLoading] = useState(true);
  const [listaActividadesSemanal, setListaActividadesSemanal] = useState<Actividad[][]>([]);
  const [listaCantidadActividadesSemanal, setListaCantidadActividadesSemanal] = useState<number[]>([]);

  const [listaActividadesDiaSeleccionado, setListaActividadesDiaSeleccionado] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [numDiaSeleccionado, setNumDiaSeleccionado] = useState(numDiaHoy);

  useEffect(() => {
    //console.log("FETCH AGENDA");
    const fetchAgenda = async () => {
      setLoading(true);

      const personaIdStr = await AsyncStorage.getItem("idPersona");
      if (!personaIdStr) return;

      try {
        const fechaInicioSemana = fechaSumarDias(-numDiaHoy);
        const semana: Actividad[][] = [];

        for (let i = 0; i < 7; i++) {
          const fecha = fechaSumarDias(i, fechaInicioSemana);
          
          //const url = UrlObtenerAgenda(infoBaseUsuarioActual.idPersona, DateToISOStringNoTime(fecha));
          const url = UrlObtenerAgenda(personaIdStr, DateToISOStringNoTime(fecha));
          const json = JsonStringAObjeto(await ObtenerJsonString(url));

          const actividades: Actividad[] = (json.error ? [] : json.map((elem: any, index: number) => ({
            id: index,
            title: `${elem.tipo_actividad} de ${elem.actividad}`,
            body: `${elem.horario} hs`,
          })));

          semana[i] = actividades;
        }

        setListaActividadesSemanal(semana);
        setListaCantidadActividadesSemanal(semana.map((dia) => dia.length));
      } catch (err) {
        console.error('Error al obtener agenda:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, []);

  useEffect(() => {
    //console.log("DRAW AGENDA");

    const actividadesDelDia = listaActividadesSemanal[numDiaSeleccionado];
    if (!actividadesDelDia) return;

    const fecha = fechaSumarDias(numDiaSeleccionado - numDiaHoy);
    const nombreDia = IndexToDiaString(fecha.getDay());
    const mensajeDia = `${nombreDia} ${fecha.getDate()}`;
    const esHoy = numDiaSeleccionado === numDiaHoy;

    setTituloPagina(
      actividadesDelDia.length === 0
        ? `No hay actividades ${esHoy ? `hoy, ${mensajeDia}` : `el ${mensajeDia}`}`
        : `Actividades ${esHoy ? `de hoy, ` : `del `}${mensajeDia}`
    );

    setListaActividadesDiaSeleccionado(actividadesDelDia);
  }, [numDiaSeleccionado, listaActividadesSemanal]);

  const cambiarDia = (incremento: number) => {
    setNumDiaSeleccionado((prev) => Math.max(0, Math.min(6, prev + incremento)));
  };

  return (
    <FondoGradiente>
      <LoadingWrapper loading={loading}>
        <ScrollView contentContainerStyle={styles.container}>
          <BarraSemanal
            actividadesPorDia={listaCantidadActividadesSemanal ?? [0, 0, 0, 0, 0, 0, 0]}
            diaActual={numDiaSeleccionado}
            diaHoy={numDiaHoy}
            onSelectDay={(dayIndex) => setNumDiaSeleccionado(dayIndex)}
          />

          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => cambiarDia(-1)} style={styles.navButton}>
              <Ionicons name="arrow-back" size={24} color="#1a2b50" />
            </TouchableOpacity>

            <CustomText style={styles.title}>{tituloPagina}</CustomText>

            <TouchableOpacity onPress={() => cambiarDia(1)} style={styles.navButton}>
              <Ionicons name="arrow-forward" size={24} color="#1a2b50" />
            </TouchableOpacity>
          </View>

          {listaActividadesDiaSeleccionado.map((evento) => (
            <ListaItem key={evento.id} title={evento.title} subtitle={evento.body} />
          ))}
        </ScrollView>
      </LoadingWrapper>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <BotonTextoLink label="Calendario Académico" openInsideApp url="https://undav.edu.ar/index.php?idcateg=129" />
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    marginHorizontal: 10,
    textAlign: 'center',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 10,
  },
});
