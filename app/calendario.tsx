import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import BotonTextoLink from '@/components/BotonTextoLink';
import CalendarioMensual from '../components/CalendarioMensual';
import FondoGradiente from '@/components/FondoGradiente';

import {
  JsonStringAObjeto,
  ObtenerJsonString,
  UrlObtenerAgenda,
} from '@/data/DatosUsuarioGuarani Backup';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import { EventoAgenda, eventoAgendaToFechaString, listaCompleta } from '@/data/agenda';

export type Actividad = {
  id: string;
  body: string;
  title: string;
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

function obtenerFechasDelMes(mes: number, anio: number): string[] {
  const fechas: string[] = [];
  const fecha = new Date(anio, mes, 1);
  while (fecha.getMonth() === mes) {
    fechas.push(DateToISOStringNoTime(new Date(fecha)));
    fecha.setDate(fecha.getDate() + 1);
  }
  return fechas;
}

export default function Calendario() {
  const diaHoy = new Date(); // el día actual
  //const diaHoy = new Date("2025-10-10");
  const hoyStr = DateToISOStringNoTime(diaHoy);

  const [loading, setLoading] = useState(true);
  const [actividadesPorFecha, setActividadesPorFecha] = useState<{ [fecha: string]: Actividad[] }>({});
  const [cantidadActividadesPorFecha, setCantidadActividadesPorFecha] = useState<{ [fecha: string]: number }>({});
  const [listaActividadesDiaSeleccionado, setListaActividadesDiaSeleccionado] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(diaHoy);

  // Para evitar recargar el mismo mes más de una vez
  const mesesCargadosRef = useRef<Set<string>>(new Set());

  const fetchActividadesDelMes = useCallback(async (mes: number, anio: number) => {
    const claveMes = `${anio}-${mes}`;
    if (mesesCargadosRef.current.has(claveMes)) return;

    setLoading(true);

    const personaIdStr = await AsyncStorage.getItem("idPersona");
    if (!personaIdStr) {
      console.warn("No se encontró ID de persona");
      setLoading(false);
      return;
    }

    const fechasDelMes = obtenerFechasDelMes(mes, anio);
    const actividadesTemp: { [fecha: string]: Actividad[] } = {};

    try {
await Promise.all(fechasDelMes.map(async (fechaStr, index) => {
  const url = UrlObtenerAgenda(personaIdStr, fechaStr);
  const json = JsonStringAObjeto(await ObtenerJsonString(url));

  // Actividades SIU
  const actividadesSIU: Actividad[] = json.error
    ? []
    : json.map((elem: any, idx: number) => ({
        id: `${index * 1000 + idx}`,
        title: `${elem.tipo_actividad} de ${elem.actividad}`,
        body: `${elem.horario} hs`,
      }));

  // Eventos del calendario local que coincidan con la fecha
  const eventosCalendario = listaCompleta().filter(evento => {
    return evento.fechaInicio && DateToISOStringNoTime(new Date(evento.fechaInicio)) === fechaStr;
  });

  // EVENTOS
  const actividadesEvento: Actividad[] = [];

  listaCompleta().forEach((evento, idx) => {
    const fechaIniStr = DateToISOStringNoTime(new Date(evento.fechaInicio));
    const fechaFinStr = DateToISOStringNoTime(new Date(evento.fechaFin));

    if (fechaIniStr === fechaFinStr && fechaIniStr === fechaStr) {
      actividadesEvento.push({
        id: `e-${index * 1000 + idx}`,
        title: evento.titulo,
        body: `Evento - ${eventoAgendaToFechaString(evento)}`,
      });
    }

    if (fechaIniStr !== fechaFinStr) {
      if (fechaIniStr === fechaStr) {
        actividadesEvento.push({
          id: `e-${index * 1000 + idx}-ini`,
          title: `Inicio - ${evento.titulo}`,
          body: eventoAgendaToFechaString(evento),
        });
      }
      if (fechaFinStr === fechaStr) {
        actividadesEvento.push({
          id: `e-${index * 1000 + idx}-fin`,
          title: `Fin - ${evento.titulo}`,
          body: eventoAgendaToFechaString(evento),
        });
      }
    }
  });



  // Combinar ambas
  const todasLasActividades = [...actividadesSIU, ...actividadesEvento];

  actividadesTemp[fechaStr] = todasLasActividades;
}));


      setActividadesPorFecha(prev => ({ ...prev, ...actividadesTemp }));

      const nuevasCantidades: { [fecha: string]: number } = {};
      for (const fecha in actividadesTemp) {
        nuevasCantidades[fecha] = actividadesTemp[fecha].length;
      }
      setCantidadActividadesPorFecha(prev => ({ ...prev, ...nuevasCantidades }));

      mesesCargadosRef.current.add(claveMes);
    } catch (err) {
      console.error("Error al cargar actividades del mes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar mes inicial
  useEffect(() => {
    const mes = diaHoy.getMonth();
    const anio = diaHoy.getFullYear();
    fetchActividadesDelMes(mes, anio);
  }, [fetchActividadesDelMes]);

  // Cargar actividades del día seleccionado
  useEffect(() => {
    const fechaStr = DateToISOStringNoTime(fechaSeleccionada);
    const actividadesDelDia = actividadesPorFecha[fechaStr] ?? [];

    const nombreDia = IndexToDiaString(fechaSeleccionada.getDay());
    const mensajeDia = `${nombreDia} ${fechaSeleccionada.getDate()}`;

    let tituloPaginaDia: string = "";
    if (actividadesDelDia.length === 0)
      tituloPaginaDia = `No hay actividades ${fechaStr === hoyStr ? `hoy, ${mensajeDia}` : `el ${mensajeDia}`}`;
    else {
      if (fechaStr === hoyStr) tituloPaginaDia = "hoy, ";
      else {
        const fechaAyer = DateToISOStringNoTime(fechaSumarDias(-1));
        const fechaManiana = DateToISOStringNoTime(fechaSumarDias(1));

        if (fechaStr === fechaManiana) tituloPaginaDia = "mañana, ";
        else if (fechaStr === fechaAyer) tituloPaginaDia = "ayer, ";
      }
      tituloPaginaDia += mensajeDia;
    }

    setTituloPagina(tituloPaginaDia);
    setListaActividadesDiaSeleccionado(actividadesDelDia);
  }, [fechaSeleccionada, actividadesPorFecha]);

  return (
    <FondoGradiente>
      <LoadingWrapper loading={loading}>

        <CalendarioMensual
          actividadesPorDia={cantidadActividadesPorFecha}
          diaSeleccionadoActualmente={fechaSeleccionada}
          diaHoy={diaHoy}
          onSelectDay={setFechaSeleccionada}
          onSelectMonthChange={(nuevoMes, nuevoAnio) => {
            fetchActividadesDelMes(nuevoMes, nuevoAnio);
          }}
        />

        <View style={styles.titleContainer}>
          <CustomText style={styles.title}>{tituloPagina}</CustomText>
        </View>
        </LoadingWrapper>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <ScrollView contentContainerStyle={styles.listaContainer}>
          {listaActividadesDiaSeleccionado.map((evento) => (
            <ListaItem key={evento.id} title={evento.title} subtitle={evento.body.toString()} />
          ))}
        </ScrollView>
        <View style={{marginTop: 10}}>
          <BotonTextoLink route='/calend.-academico-resoluciones' label={"Resoluciones Calendario Académico"} />
        </View>
      </View>

    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  listaContainer: {
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    marginHorizontal: 10,
    textAlign: 'center',
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
