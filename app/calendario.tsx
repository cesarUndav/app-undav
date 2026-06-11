// app/calendario.tsx

import React, { act, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import FondoGradiente from '@/components/FondoGradiente';
import LoadingWrapper from '@/components/LoadingWrapper';

import { negroAzulado, azulLogoUndav, azulMedioUndav, celesteSIU, azulClaro } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { eventoAgendaToFechaString, listaCompleta, cargarEventosAcademicos, EventoAgenda } from '@/data/agenda';
import { useAgenda } from '../src/context/AgendaContext'; 
import ModalEvento from '@/components/ModalEvento';

const filterBtnColor = azulMedioUndav;

// 🎯 Extendemos el tipo Actividad para llevar también la referencia al evento original
export type Actividad = {
  id: string;
  body: string;
  title: string;
  esFeriado?: boolean;
  descripcion?: string; 
  eventoOriginal: EventoAgenda; // 🎯 Necesario para alimentar al modal en modo edición
};

interface CalendarioMensualProps {
  actividadesPorDia: { [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } };
  diaSeleccionadoActualmente: Date;
  diaHoy: Date;
  onSelectDay: (fecha: Date) => void;
  onSelectMonthChange?: (mes: number, anio: number) => void;
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

function getDiasDelMes(mes: number, anio: number): Date[] {
  const dias: Date[] = [];
  const fecha = new Date(anio, mes, 1);
  while (fecha.getMonth() === mes) {
    dias.push(new Date(fecha));
    fecha.setDate(fecha.getDate() + 1);
  }
  return dias;
}

function obtenerPrimerDiaSemana(mes: number, anio: number): number {
  return new Date(anio, mes, 1).getDay();
}

const diasSemana = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];
const nombreMes = (mes: number) =>
  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][mes];

const CalendarioMensual: React.FC<CalendarioMensualProps> = ({
  actividadesPorDia,
  diaSeleccionadoActualmente,
  diaHoy,
  onSelectDay,
  onSelectMonthChange,
}) => {
  const fechaSegura = diaSeleccionadoActualmente instanceof Date ? diaSeleccionadoActualmente : (diaHoy || new Date());
  const mesActual = fechaSegura.getMonth();
  const anioActual = fechaSegura.getFullYear();

  const diasDelMes = getDiasDelMes(mesActual, anioActual);
  const primerDiaSemana = obtenerPrimerDiaSemana(mesActual, anioActual);
  const celdasVacias = Array.from({ length: primerDiaSemana }, (_, i) => (
    <View key={`empty-${i}`} style={styles.diaCelda} />
  ));

  const cambiarMes = (delta: number) => {
    let nuevoMes = mesActual + delta;
    let nuevoAnio = anioActual;
    if (nuevoMes < 0) { nuevoMes = 11; nuevoAnio -= 1; }
    else if (nuevoMes > 11) { nuevoMes = 0; nuevoAnio += 1; }
    onSelectMonthChange?.(nuevoMes, nuevoAnio);
  };

  return (
    <View style={styles.contenedorCalendario}>
      <View style={styles.encabezadoMes}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}><Text style={styles.flecha}>{'←'}</Text></TouchableOpacity>
        <Text style={styles.textoMes}>{`${nombreMes(mesActual)} ${anioActual}`}</Text>
        <TouchableOpacity onPress={() => cambiarMes(1)}><Text style={styles.flecha}>{'→'}</Text></TouchableOpacity>
      </View>

      <View style={styles.filaDiasSemana}>
        {diasSemana.map((dia, index) => <Text key={index} style={styles.textoDiaSemana}>{dia}</Text>)}
      </View>

      <View style={styles.gridDias}>
        {celdasVacias}
        {diasDelMes.map((fecha, idx) => {
          const fechaStr = DateToISOStringNoTime(fecha);
          const datosDia = actividadesPorDia[fechaStr];
          const cantidadActividades = datosDia ? datosDia.cantidad : 0;
          const tipoColor = datosDia ? datosDia.color : 'azul';

          const esHoy = DateToISOStringNoTime(fecha) === DateToISOStringNoTime(diaHoy);
          const esSeleccionado = DateToISOStringNoTime(fecha) === DateToISOStringNoTime(diaSeleccionadoActualmente);

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.diaCelda, esHoy && styles.hoy, esSeleccionado && styles.seleccionado]}
              onPress={() => onSelectDay(fecha)}
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
  );
};

export default function Calendario() {
  const insets = useSafeAreaInsets();
  const { refetchEventos } = useAgenda(); 
  const [loading, setLoading] = useState(true);

  const diaHoy = new Date();
  const hoyStr = DateToISOStringNoTime(diaHoy);

  const [actividadesPorFecha, setActividadesPorFecha] = useState<{ [fecha: string]: Actividad[] }>({});
  const [cantidadActividadesPorFecha, setCantidadActividadesPorFecha] = useState<{ [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } }>({});
  const [listaActividadesDiaSeleccionado, setListaActividadesDiaSeleccionado] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(diaHoy);

  const [mesAnioActual, setMesAnioActual] = useState({ mes: diaHoy.getMonth(), anio: diaHoy.getFullYear() });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoParaEditar, setEventoParaEditar] = useState<EventoAgenda | undefined>(undefined); // 🎯 Estado de edición

  function puedeMostrarActividad(act: Actividad): boolean {
    if (act.esFeriado) return mostrarFeriados;
    if (act.id.includes('-p')) return mostrarPersonalizados;
    return mostrarAcademicos;
  }

  const cargarTodoElMes = async () => {
    setLoading(true);
    try {
      await cargarEventosAcademicos();
      const todosLosEventos = listaCompleta();
      const actividadesTemp: { [fecha: string]: Actividad[] } = {};

      todosLosEventos.forEach((evento, idx) => {
        if (!evento.fechaInicio || !evento.fechaFin) return;

        const fechaIniStr = DateToISOStringNoTime(new Date(evento.fechaInicio));
        const fechaFinStr = DateToISOStringNoTime(new Date(evento.fechaFin));
        
        const idSufijo = evento.id.startsWith('p') ? `-p-${idx}` : `-${idx}`;

        if (fechaIniStr === fechaFinStr) {
          if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];
          actividadesTemp[fechaIniStr].push({
            id: `e${idSufijo}`,
            title: evento.titulo,
            body: eventoAgendaToFechaString(evento),
            esFeriado: evento.esFeriado,
            descripcion: evento.descripcion,
            eventoOriginal: evento // 🎯
          });
        } else {
          if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];
          actividadesTemp[fechaIniStr].push({ 
            id: `e${idSufijo}-ini`, 
            title: `[Inicio] ${evento.titulo}`, 
            body: eventoAgendaToFechaString(evento), 
            esFeriado: evento.esFeriado,
            descripcion: evento.descripcion,
            eventoOriginal: evento // 🎯
          });

          if (!actividadesTemp[fechaFinStr]) actividadesTemp[fechaFinStr] = [];
          actividadesTemp[fechaFinStr].push({ 
            id: `e${idSufijo}-fin`, 
            title: `[Fin] ${evento.titulo}`, 
            body: eventoAgendaToFechaString(evento), 
            esFeriado: evento.esFeriado,
            descripcion: evento.descripcion,
            eventoOriginal: evento // 🎯
          });
        }
      });

      setActividadesPorFecha(actividadesTemp);
    } catch (err) {
      console.error("❌ Error en la estructura del calendario:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodoElMes();
  }, [mesAnioActual.mes, mesAnioActual.anio]);

  useEffect(() => {
    const nuevasCantidades: { [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } } = {};
    for (const f in actividadesPorFecha) {
      const listaDelDia = (actividadesPorFecha[f] || []).filter(puedeMostrarActividad);
      if (listaDelDia.length > 0) {
        nuevasCantidades[f] = { cantidad: listaDelDia.length, color: 'rojo' };
      }
    }
    setCantidadActividadesPorFecha(nuevasCantidades);
  }, [actividadesPorFecha, mostrarFeriados, mostrarPersonalizados, mostrarAcademicos]);

  useEffect(() => {
    const fSeleccionadaSegura = fechaSeleccionada instanceof Date ? fechaSeleccionada : new Date();
    const fechaStr = DateToISOStringNoTime(fSeleccionadaSegura);
    
    const actividadesDelDia = (actividadesPorFecha[fechaStr] ?? []).filter(puedeMostrarActividad);

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
  }, [fechaSeleccionada, actividadesPorFecha, mesAnioActual.mes, mesAnioActual.anio, mostrarFeriados, mostrarPersonalizados, mostrarAcademicos]);

  const alActualizarEvento = () => {
    refetchEventos();     
    cargarTodoElMes();    
  };

  // 🎯 Ejecuta la apertura en modo edición
  const abrirEdicionEvento = (evento: EventoAgenda) => {
    setEventoParaEditar(evento);
    setModalVisible(true);
  };

  // 🎯 Limpia el estado al cerrar
  const cerrarModal = () => {
    setModalVisible(false);
    setEventoParaEditar(undefined);
  };

  return (
    <>
      <FondoGradiente>
        <LoadingWrapper loading={loading}>
          <CalendarioMensual
            actividadesPorDia={cantidadActividadesPorFecha}
            diaSeleccionadoActualmente={fechaSeleccionada}
            diaHoy={diaHoy}
            onSelectDay={setFechaSeleccionada}
            onSelectMonthChange={(nuevoMes, nuevoAnio) => {
              setMesAnioActual({ mes: nuevoMes, anio: nuevoAnio });
              setFechaSeleccionada(new Date(nuevoAnio, nuevoMes, 1));
            }} 
          />

          <View style={styles.titleContainer}>
            <CustomText weight="bold" style={styles.title}>
              {tituloPagina}
            </CustomText>
          </View>
        </LoadingWrapper>

        <View style={styles.contentContainer}>
          <ScrollView contentContainerStyle={styles.listaContainer}>
            {listaActividadesDiaSeleccionado.length === 0 && !loading ? (
              <CustomText weight="bold" style={styles.noEventsTitle}>
                No hay eventos que coincidan con los filtros
              </CustomText>
            ) : (
              listaActividadesDiaSeleccionado.map((actividad, index) => {
                const esUltimo = index === listaActividadesDiaSeleccionado.length - 1;
                const estiloExtra = esUltimo ? { borderBottomRightRadius: 20 } : undefined;
                const colorTitulo = actividad.esFeriado ? "#6CACE4" : undefined;
                
                const subtituloFormateado = actividad.descripcion 
                  ? `${actividad.descripcion}\n${actividad.body}`
                  : actividad.body;

                return (
                  <ListaItem
                    key={actividad.id}
                    title={actividad.title}
                    subtitle={subtituloFormateado}
                    titleColor={colorTitulo}
                    styleExtra={estiloExtra}
                    editable={actividad.id.startsWith('e-p')} // 🎯 Habilitado solo si ES PERSONALIZADO
                    onPress={() => abrirEdicionEvento(actividad.eventoOriginal)} // 🎯
                  />
                );
              })
            )}
          </ScrollView>
        </View>
      </FondoGradiente>

      <View style={[stylesFlotante.floatingBox, { bottom: insets.bottom + 60 + 16 }]}>
        {mostrarFiltros && (
          <View style={stylesFlotante.filterOptionsParent}>
            <CustomText weight="bold" style={stylesFlotante.filterHeader}>FILTRAR VISTA</CustomText>
            
            <TouchableOpacity
              onPress={() => setMostrarFeriados(!mostrarFeriados)}
              style={[stylesFlotante.filterOption, mostrarFeriados ? stylesFlotante.optionActive : stylesFlotante.optionInactive]}
            >
              <Ionicons name="calendar" size={18} color={mostrarFeriados ? '#fff' : '#8e8e93'} />
              <CustomText weight="bold" style={[stylesFlotante.filterOptionText, { color: mostrarFeriados ? '#fff' : '#2c3e50' }]}>Feriados</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)}
              style={[stylesFlotante.filterOption, mostrarPersonalizados ? stylesFlotante.optionActive : stylesFlotante.optionInactive]}
            >
              <Ionicons name="person" size={18} color={mostrarPersonalizados ? '#fff' : '#8e8e93'} />
              <CustomText weight="bold" style={[stylesFlotante.filterOptionText, { color: mostrarPersonalizados ? '#fff' : '#2c3e50' }]}>Personalizados</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarAcademicos(!mostrarAcademicos)}
              style={[stylesFlotante.filterOption, mostrarAcademicos ? stylesFlotante.optionActive : stylesFlotante.optionInactive]}
            >
              <Ionicons name="school" size={18} color={mostrarAcademicos ? '#fff' : '#8e8e93'} />
              <CustomText weight="bold" style={[stylesFlotante.filterOptionText, { color: mostrarAcademicos ? '#fff' : '#2c3e50' }]}>Académicos</CustomText>
            </TouchableOpacity>
          </View>
        )}

        <View style={stylesFlotante.botonesColumna}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.openBtn, styles.addButton]}>
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)} style={[styles.openBtn, mostrarFiltros ? stylesFlotante.openBtnActive : null]}>
            <Ionicons name={mostrarFiltros ? "close" : "filter"} size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/agenda')} style={stylesFlotante.openBtn}>
            <Ionicons name="list" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ModalEvento 
        visible={modalVisible}
        onClose={cerrarModal}
        onRefresh={alActualizarEvento}
        fechaPorDefecto={fechaSeleccionada}
        eventoAEditar={eventoParaEditar} // 🎯 Se pasa el objeto al modal (si tu prop es 'itemToEdit', cambialo aquí)
      />
    </>
  );
}

const blanco = "#fff";
const colorTextoSeleccionado = blanco;
const colorRojoAlerta = "#c31700"; 

const stylesFlotante = StyleSheet.create({
  floatingBox: { position: 'absolute', right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' },
  botonesColumna: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  openBtn: { backgroundColor: azulLogoUndav, borderRadius: 30, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', ...getShadowStyle(4) },
  filterOptionsParent: { backgroundColor: '#ffffff', borderRadius: 20, padding: 8, marginRight: 12, width: 200, gap: 6, ...getShadowStyle(6) },
  filterHeader: { fontSize: 11, color: '#8e8e93', letterSpacing: 1, marginBottom: 6, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#f2f2f7', paddingBottom: 6 },
  filterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, width: '100%' },
  optionActive: { backgroundColor: filterBtnColor },
  optionInactive: { backgroundColor: '#f2f2f7' },
  filterOptionText: { fontSize: 14, marginLeft: 10, flex: 1 },
  openBtnActive: {},
});

const styles = StyleSheet.create({
  contenedorCalendario: { borderRadius: 10, backgroundColor: blanco, ...getShadowStyle(4) },
  encabezadoMes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: azulMedioUndav, padding: 8, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  textoMes: { fontSize: 16, fontWeight: 'bold', color: blanco, textAlign: "center" },
  flecha: { fontSize: 20, color: blanco, paddingHorizontal: 10 },
  filaDiasSemana: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 6, backgroundColor: azulMedioUndav },
  textoDiaSemana: { flex: 1, textAlign: 'center', color: blanco, fontWeight: 'bold' },
  gridDias: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 4 },
  diaCelda: { width: `${(100 / 7)-0.01}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  textoDiaNumero: { fontSize: 16, fontWeight:"bold", color: negroAzulado },
  hoy: { backgroundColor: azulLogoUndav, borderRadius: 999 },
  seleccionado: { backgroundColor: celesteSIU, borderRadius: 999, borderWidth: 3, borderColor: azulLogoUndav, zIndex: 2 },
  indicador: { position: 'absolute', bottom: 0, right: 0, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1 },
  textoIndicador: { color: blanco, fontSize: 11, fontWeight: 'bold' },
  listaContainer: { gap: 4 },
  title: { fontSize: 16, color: negroAzulado, marginHorizontal: 10, textAlign: 'center', flex: 1 },
  noEventsTitle: { fontSize: 14, color: '#8e8e93', textAlign: 'center', marginVertical: 20 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  contentContainer: { flex: 1, marginTop: 10 },
  openBtn: { backgroundColor: azulClaro, borderRadius: 30, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', ...getShadowStyle(4) },
  addButton: { backgroundColor: 'green' },
});