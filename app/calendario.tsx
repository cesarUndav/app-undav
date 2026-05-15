import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import BotonTexto from '@/components/BotonTexto';
import CalendarioMensual from '../components/CalendarioMensual';
import FondoGradiente from '@/components/FondoGradiente';

import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import { eventoAgendaToFechaString, eventoAgendaTituloColor, listaCompleta } from '@/data/agenda';

export type Actividad = {
  id: string;
  body: string;
  title: string;
  esFeriado?: boolean; // AGREGADO
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
  const diaHoy = new Date();
  const hoyStr = DateToISOStringNoTime(diaHoy);

  const [loading, setLoading] = useState(true);
  const [actividadesPorFecha, setActividadesPorFecha] = useState<{ [fecha: string]: Actividad[] }>({});
  const [cantidadActividadesPorFecha, setCantidadActividadesPorFecha] = useState<{ [fecha: string]: number }>({});
  const [listaActividadesDiaSeleccionado, setListaActividadesDiaSeleccionado] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(diaHoy);

  const mesesCargadosRef = useRef<Set<string>>(new Set());

  // Cargar eventos académicos y procesar TODOS los meses del año
  useEffect(() => {
    const cargarTodosLosEventos = async () => {
      setLoading(true);
      
      // Cargar eventos de la API
      const { cargarEventosAcademicos } = await import('@/data/agenda');
      await cargarEventosAcademicos();
      console.log('Eventos académicos cargados');

      // Obtener todos los eventos
      const todosLosEventos = listaCompleta();
      console.log('Total eventos disponibles:', todosLosEventos.length);

      // Procesar todos los eventos y organizarlos por fecha
      const actividadesTemp: { [fecha: string]: Actividad[] } = {};

      todosLosEventos.forEach((evento, idx) => {
        if (!evento.fechaInicio || !evento.fechaFin) return;

        const fechaIniStr = DateToISOStringNoTime(new Date(evento.fechaInicio));
        const fechaFinStr = DateToISOStringNoTime(new Date(evento.fechaFin));

        //console.log(evento.titulo,"->", fechaIniStr, fechaFinStr)

        // Si el evento dura un solo día
        if (fechaIniStr === fechaFinStr) {
          if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];
          actividadesTemp[fechaIniStr].push({
            id: `e-${idx}`,
            title: evento.titulo,
            body: eventoAgendaToFechaString(evento),
            esFeriado: evento.esFeriado,
          });
        } 
        // Si el evento dura múltiples días
        else {
          // Agregar marcador de inicio
          if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];
          actividadesTemp[fechaIniStr].push({
            id: `e-${idx}-ini`,
            title: `[Inicio] ${evento.titulo}`,
            body: eventoAgendaToFechaString(evento),
            esFeriado: evento.esFeriado,
          });

          // Agregar marcador de fin
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

      // Calcular cantidades por fecha
      const nuevasCantidades: { [fecha: string]: number } = {};
      for (const fecha in actividadesTemp) {
        nuevasCantidades[fecha] = actividadesTemp[fecha].length;
      }
      setCantidadActividadesPorFecha(nuevasCantidades);

      setLoading(false);
    };

    cargarTodosLosEventos();
  }, []);

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
          onSelectMonthChange={() => {}} // Ya no necesitamos cargar por mes
        />

        <View style={styles.titleContainer}>
          <CustomText style={styles.title}>{tituloPagina}</CustomText>
        </View>
      </LoadingWrapper>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <ScrollView contentContainerStyle={styles.listaContainer}>
          {listaActividadesDiaSeleccionado.map((actividad, index) => {
            const esUltimo = index === listaActividadesDiaSeleccionado.length - 1;
            const estiloExtra = esUltimo ? { borderBottomRightRadius: 20 } : undefined;
            
            // Determinar el color del título basado en si es feriado
            const colorTitulo = actividad.esFeriado ? "#6CACE4" : undefined;
            
            return (
              <ListaItem
                key={actividad.id}
                title={actividad.title}
                subtitle={actividad.body.toString()}
                styleExtra={estiloExtra}
                titleColor={colorTitulo} // NECESITAS AGREGAR ESTE PROP A ListaItem
              />
            );
          })}
        </ScrollView>
        <View style={{marginTop: 10}}>
          <BotonTexto 
            route='/calend.-academico-resoluciones' 
            label={"Resoluciones Calendario Académico"} 
            styleExtra={{borderBottomRightRadius: 20}}
          />
        </View>
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  listaContainer: {
    gap: 4
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