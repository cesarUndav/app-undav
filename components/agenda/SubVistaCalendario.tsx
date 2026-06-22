// components/agenda/SubVistaCalendario.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import AgendaItem from '@/components/AgendaItem';
import AgendaItemEditable from '@/components/AgendaItemEditable';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado, azulLogoUndav, azulMedioUndav, celesteSIU } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { EventoAgenda } from '@/data/agenda';
import FondoGradiente from '../FondoGradiente';

export type Actividad = {
  id: string;
  body: string;
  title: string;
  esFeriado?: boolean;
  descripcion?: string; 
  eventoOriginal: EventoAgenda;
};

interface SubVistaCalendarioProps {
  puedeMostrarEvento: (evento: EventoAgenda) => boolean;
  onAbrirEditar: (evento: EventoAgenda) => void;
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
  actividadesPrecargadas: { [fecha: string]: Actividad[] };
  loadingPrecargado: boolean;
}

function fechaSumarDias(diasASumar: number, fechaOpcional?: Date): Date {
  const base = fechaOpcional ? fechaOpcional.getTime() : Date.now();
  return new Date(base + diasASumar * 86400000);
}

function DateToISOStringNoTime(fecha: Date): string {
  if (!fecha || !(fecha instanceof Date)) fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function IndexToDiaString(index: number): string {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[index] || '';
}

const diasSemana = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];
const nombreMes = (mes: number) =>
  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][mes];

export default function SubVistaCalendario({
  puedeMostrarEvento,
  onAbrirEditar,
  fechaSeleccionada,
  setFechaSeleccionada,
  actividadesPrecargadas,
  loadingPrecargado,
}: SubVistaCalendarioProps) {
  const diaHoy = new Date();
  const hoyStr = DateToISOStringNoTime(diaHoy);

  const [cantidadActividadesPorFecha, setCantidadActividadesPorFecha] = useState<{ [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } }>({});
  const [listaActividadesDiaSeleccionado, setListaActividadesDiaSeleccionado] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [mesAnioActual, setMesAnioActual] = useState({ mes: diaHoy.getMonth(), anio: diaHoy.getFullYear() });

  useEffect(() => {
    const nuevasCantidades: { [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } } = {};
    for (const f in actividadesPrecargadas) {
      const listaDelDia = (actividadesPrecargadas[f] || []).filter(act => puedeMostrarEvento(act.eventoOriginal));
      if (listaDelDia.length > 0) {
        nuevasCantidades[f] = { cantidad: listaDelDia.length, color: 'rojo' };
      }
    }
    setCantidadActividadesPorFecha(nuevasCantidades);
  }, [actividadesPrecargadas, puedeMostrarEvento]);

  useEffect(() => {
    const fSeleccionadaSegura = fechaSeleccionada instanceof Date ? fechaSeleccionada : new Date();
    const fechaStr = DateToISOStringNoTime(fSeleccionadaSegura);
    
    const actividadesDelDia = (actividadesPrecargadas[fechaStr] ?? []).filter(act => puedeMostrarEvento(act.eventoOriginal));

    const nombreDia = IndexToDiaString(fSeleccionadaSegura.getDay());
    const mensajeDia = `${nombreDia} ${fSeleccionadaSegura.getDate()}`;
    let tituloPaginaDia = '';

    if (actividadesDelDia.length === 0) {
      tituloPaginaDia = `No hay actividades ${fechaStr === hoyStr ? `hoy, ${mensajeDia}` : `el ${mensajeDia}`}`;
    } else {
      if (fechaStr === hoyStr) tituloPaginaDia = 'hoy, ';
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
  }, [fechaSeleccionada, actividadesPrecargadas, mesAnioActual.mes, mesAnioActual.anio, puedeMostrarEvento]);

  const cambiarMes = (delta: number) => {
    let nuevoMes = mesAnioActual.mes + delta;
    let nuevoAnio = mesAnioActual.anio;
    if (nuevoMes < 0) { nuevoMes = 11; nuevoAnio -= 1; }
    else if (nuevoMes > 11) { nuevoMes = 0; nuevoAnio += 1; }
    setMesAnioActual({ mes: nuevoMes, anio: nuevoAnio });
    setFechaSeleccionada(new Date(nuevoAnio, nuevoMes, 1));
  };

  const diasDelMes = (() => {
    const dias: Date[] = [];
    const fecha = new Date(mesAnioActual.anio, mesAnioActual.mes, 1);
    while (fecha.getMonth() === mesAnioActual.mes) {
      dias.push(new Date(fecha));
      fecha.setDate(fecha.getDate() + 1);
    }
    return dias;
  })();

  const primerDiaSemana = new Date(mesAnioActual.anio, mesAnioActual.mes, 1).getDay();
  const celdasVacias = Array.from({ length: primerDiaSemana }, (_, i) => (
    <View key={`empty-${i}`} style={styles.diaCelda} />
  ));

  return (
    <FondoGradiente>
      <View style={styles.flexMaestro}>
        <LoadingWrapper loading={loadingPrecargado}>
          <View style={styles.contenedorCalendario}>
            <View style={styles.encabezadoMes}>
              <TouchableOpacity onPress={() => cambiarMes(-1)}><Text style={styles.flecha}>{'←'}</Text></TouchableOpacity>
              <Text style={styles.textoMes}>{`${nombreMes(mesAnioActual.mes)} ${mesAnioActual.anio}`}</Text>
              <TouchableOpacity onPress={() => cambiarMes(1)}><Text style={styles.flecha}>{'→'}</Text></TouchableOpacity>
            </View>

            <View style={styles.filaDiasSemana}>
              {diasSemana.map((dia, index) => <Text key={index} style={styles.textoDiaSemana}>{dia}</Text>)}
            </View>

            <View style={styles.gridDias}>
              {celdasVacias}
              {diasDelMes.map((fecha, idx) => {
                const fechaStr = DateToISOStringNoTime(fecha);
                const datosDia = cantidadActividadesPorFecha[fechaStr];
                const cantidadActividades = datosDia ? datosDia.cantidad : 0;
                const tipoColor = datosDia ? datosDia.color : 'azul';

                const esHoy = DateToISOStringNoTime(fecha) === hoyStr;
                const esSeleccionado = DateToISOStringNoTime(fecha) === DateToISOStringNoTime(fechaSeleccionada);

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.diaCelda, esHoy && styles.hoy, esSeleccionado && styles.seleccionado]}
                    onPress={() => setFechaSeleccionada(fecha)}
                  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', aspectRatio: 1, position: 'relative' }}>
                      <Text style={[styles.textoDiaNumero, (esSeleccionado || esHoy) && { color: colorTextoSeleccionado }]}>
                        {fecha.getDate()}
                      </Text>
                      {cantidadActividades > 0 && (
                        <View style={[styles.indicador, { backgroundColor: tipoColor === 'azul' ? azulMedioUndav : colorRojoAlerta }]}>
                          <Text style={styles.textoIndicador}>{cantidadActividades}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.titleContainer}>
            <CustomText weight="bold" style={styles.title}>
              {tituloPagina}
            </CustomText>
          </View>
        </LoadingWrapper>

        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.listaContainer} showsVerticalScrollIndicator={false}>
            {listaActividadesDiaSeleccionado.length === 0 && !loadingPrecargado ? (
              <CustomText weight="bold" style={styles.noEventsTitle}>
                No hay eventos que coincidan con los filtros
              </CustomText>
            ) : (
              listaActividadesDiaSeleccionado.map((actividad, index) => {
                const esUltimo = index === listaActividadesDiaSeleccionado.length - 1;
                const extraStyle = esUltimo ? { borderBottomRightRadius: 20 } : undefined;

                // Combinamos el evento original con el título formateado de inicio/fin del calendario
                const eventoParaRenderizar: EventoAgenda = {
                  ...actividad.eventoOriginal,
                  titulo: actividad.title,
                  descripcion: actividad.descripcion,
                };

                // Evaluamos si el ID original indica que es un evento personalizado
                if (actividad.eventoOriginal?.id?.startsWith('p')) {
                  return (
                    <AgendaItemEditable
                      key={actividad.id}
                      evento={eventoParaRenderizar}
                      onPressEdit={() => onAbrirEditar(actividad.eventoOriginal)}
                      styleExtra={extraStyle}
                    />
                  );
                }

                return (
                  <AgendaItem
                    key={actividad.id}
                    evento={eventoParaRenderizar}
                    styleExtra={extraStyle}
                  />
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </FondoGradiente>
  );
}

const colorTextoSeleccionado = "#fff";
const colorRojoAlerta = "#c31700"; 

const styles = StyleSheet.create({
  flexMaestro: { 
    flex: 1,
    paddingTop: 10 
  },
  contenedorCalendario: { borderRadius: 10, backgroundColor: "#fff", ...getShadowStyle(4) },
  encabezadoMes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: azulMedioUndav, padding: 8, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  textoMes: { fontSize: 16, fontWeight: 'bold', color: "#fff", textAlign: "center" },
  flecha: { fontSize: 20, color: "#fff", paddingHorizontal: 10 },
  filaDiasSemana: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 6, backgroundColor: azulMedioUndav },
  textoDiaSemana: { flex: 1, textAlign: 'center', color: "#fff", fontWeight: 'bold' },
  gridDias: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 4 },
  diaCelda: { width: `${(100 / 7)-0.01}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  textoDiaNumero: { fontSize: 16, fontWeight:"bold", color: negroAzulado },
  hoy: { backgroundColor: azulLogoUndav, borderRadius: 999 },
  seleccionado: { backgroundColor: celesteSIU, borderRadius: 999, borderWidth: 3, borderColor: azulLogoUndav, zIndex: 2 },
  indicador: { position: 'absolute', bottom: 0, right: 0, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1 },
  textoIndicador: { color: "#fff", fontSize: 11, fontWeight: 'bold' },
  listaContainer: { gap: 4, paddingBottom: 100 }, 
  title: { fontSize: 16, color: negroAzulado, marginHorizontal: 10, textAlign: 'center', flex: 1 },
  noEventsTitle: { fontSize: 14, color: '#8e8e93', textAlign: 'center', marginVertical: 20 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  contentContainer: { flex: 1, marginTop: 10 },
});