// app/calendario.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import BotonTexto from '@/components/BotonTexto';
import CalendarioMensual from '../components/CalendarioMensual';
import FondoGradiente from '@/components/FondoGradiente';

import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import {
  eventoAgendaToFechaString,
  listaCompleta,
} from '@/data/agenda';

export type Actividad = {
  id: string;
  body: string;
  title: string;
  esFeriado?: boolean;
};

function fechaSumarDias(diasASumar: number, fechaOpcional?: Date): Date {
  const base = fechaOpcional ? fechaOpcional.getTime() : Date.now();
  return new Date(base + diasASumar * 86400000);
}

function DateToISOStringNoTime(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}

function IndexToDiaString(index: number): string {
  const dias = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];

  return dias[index] ?? 'Día inválido.';
}

export default function Calendario() {
  const diaHoy = new Date();
  const hoyStr = DateToISOStringNoTime(diaHoy);

  const [loading, setLoading] = useState(true);
  const [actividadesPorFecha, setActividadesPorFecha] = useState<{
    [fecha: string]: Actividad[];
  }>({});
  const [cantidadActividadesPorFecha, setCantidadActividadesPorFecha] =
    useState<{ [fecha: string]: number }>({});
  const [
    listaActividadesDiaSeleccionado,
    setListaActividadesDiaSeleccionado,
  ] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(diaHoy);

  useEffect(() => {
    const cargarTodosLosEventos = async () => {
      setLoading(true);

      const { cargarEventosAcademicos } = await import('@/data/agenda');
      await cargarEventosAcademicos();

      const todosLosEventos = listaCompleta();
      const actividadesTemp: { [fecha: string]: Actividad[] } = {};

      todosLosEventos.forEach((evento, idx) => {
        if (!evento.fechaInicio || !evento.fechaFin) return;

        const fechaIniStr = DateToISOStringNoTime(new Date(evento.fechaInicio));
        const fechaFinStr = DateToISOStringNoTime(new Date(evento.fechaFin));

        if (fechaIniStr === fechaFinStr) {
          if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];

          actividadesTemp[fechaIniStr].push({
            id: `e-${idx}`,
            title: evento.titulo,
            body: eventoAgendaToFechaString(evento),
            esFeriado: evento.esFeriado,
          });
        } else {
          if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];

          actividadesTemp[fechaIniStr].push({
            id: `e-${idx}-ini`,
            title: `[Inicio] ${evento.titulo}`,
            body: eventoAgendaToFechaString(evento),
            esFeriado: evento.esFeriado,
          });

          if (!actividadesTemp[fechaFinStr]) actividadesTemp[fechaFinStr] = [];

          actividadesTemp[fechaFinStr].push({
            id: `e-${idx}-fin`,
            title: `[Fin] ${evento.titulo}`,
            body: eventoAgendaToFechaString(evento),
            esFeriado: evento.esFeriado,
          });
        }
      });

      setActividadesPorFecha(actividadesTemp);

      const nuevasCantidades: { [fecha: string]: number } = {};

      for (const fecha in actividadesTemp) {
        nuevasCantidades[fecha] = actividadesTemp[fecha].length;
      }

      setCantidadActividadesPorFecha(nuevasCantidades);
      setLoading(false);
    };

    cargarTodosLosEventos();
  }, []);

  useEffect(() => {
    const fechaStr = DateToISOStringNoTime(fechaSeleccionada);
    const actividadesDelDia = actividadesPorFecha[fechaStr] ?? [];

    const nombreDia = IndexToDiaString(fechaSeleccionada.getDay());
    const mensajeDia = `${nombreDia} ${fechaSeleccionada.getDate()}`;

    let tituloPaginaDia = '';

    if (actividadesDelDia.length === 0) {
      tituloPaginaDia = `No hay actividades ${
        fechaStr === hoyStr ? `hoy, ${mensajeDia}` : `el ${mensajeDia}`
      }`;
    } else {
      if (fechaStr === hoyStr) {
        tituloPaginaDia = 'hoy, ';
      } else {
        const fechaAyer = DateToISOStringNoTime(fechaSumarDias(-1));
        const fechaManiana = DateToISOStringNoTime(fechaSumarDias(1));

        if (fechaStr === fechaManiana) {
          tituloPaginaDia = 'mañana, ';
        } else if (fechaStr === fechaAyer) {
          tituloPaginaDia = 'ayer, ';
        }
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
          onSelectMonthChange={() => {}}
        />

        <View style={styles.titleContainer}>
          <CustomText weight="bold" style={styles.title}>
            {tituloPagina}
          </CustomText>
        </View>
      </LoadingWrapper>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.listaContainer}>
          {listaActividadesDiaSeleccionado.map((actividad, index) => {
            const esUltimo = index === listaActividadesDiaSeleccionado.length - 1;
            const estiloExtra = esUltimo
              ? { borderBottomRightRadius: 20 }
              : undefined;

            const colorTitulo = actividad.esFeriado ? '#6CACE4' : undefined;

            return (
              <ListaItem
                key={actividad.id}
                title={actividad.title}
                subtitle={actividad.body.toString()}
                styleExtra={estiloExtra}
                titleColor={colorTitulo}
              />
            );
          })}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <BotonTexto
            route="/calend.-academico-resoluciones"
            label="Resoluciones Calendario Académico"
            styleExtra={{ borderBottomRightRadius: 20 }}
          />
        </View>
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  listaContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
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
  buttonContainer: {
    marginTop: 10,
  },
});