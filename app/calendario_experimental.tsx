import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import BotonTexto from '@/components/BotonTexto';
import CalendarioMensual from '../components/CalendarioMensual';
import FondoGradiente from '@/components/FondoGradiente';
// FILTROS
import { Ionicons } from '@expo/vector-icons';

import {
  JsonStringAObjeto,
  ObtenerJsonString,
  UrlObtenerAgenda,
} from '@/data/DatosUsuarioGuarani_VIEJO';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingWrapper from '@/components/LoadingWrapper';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';
import { eventoAgendaToFechaString, listaCompleta } from '@/data/agenda';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { bottomBarStyles } from '@/components/BottomBar';

export type Actividad = {
  id: string;
  body: string;
  title: string;
};

const filterBtnColor = azulLogoUndav

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

  // FILTROS
        const [mostrarFiltros, setMostrarFiltros] = useState(false);
      const [mostrarFeriados, setMostrarFeriados] = useState(true);
      const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
      const [mostrarAcademicos, setMostrarAcademicos] = useState(true);


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
          title: `[Inicio] ${evento.titulo}`,
          body: eventoAgendaToFechaString(evento),
        });
      }
      if (fechaFinStr === fechaStr) {
        actividadesEvento.push({
          id: `e-${index * 1000 + idx}-fin`,
          title: `[Fin] ${evento.titulo}`,
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
    <>
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

        <View style={stylesOg.titleContainer}>
          <CustomText style={stylesOg.title}>{tituloPagina}</CustomText>
        </View>
        </LoadingWrapper>

      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <ScrollView contentContainerStyle={stylesOg.listaContainer}>
          {listaActividadesDiaSeleccionado.map((evento, index) => {
            const esUltimo = index === listaActividadesDiaSeleccionado.length - 1;
            const estiloExtra = esUltimo ? { borderBottomRightRadius: 20 } : undefined;
            return (
              <ListaItem
                key={evento.id}
                title={evento.title}
                subtitle={evento.body.toString()}
                styleExtra={estiloExtra}
              />
            );
          })}
        </ScrollView>
        <View style={{marginTop: 8}}>
          <BotonTexto route='/calend.-academico-resoluciones' label={"Resoluciones Calendario Académico"} styleExtra={{borderBottomRightRadius: 20}}/>
        </View>
      </View>

    </FondoGradiente>
    
    {/* botones FLOTANTES */}
    <View style={styles.floatingBox}>

      {mostrarFiltros && 
        <View style={styles.filterOptionsParent}>
          <TouchableOpacity onPress={() => setMostrarFeriados(!mostrarFeriados)} style={[styles.filterOption, { backgroundColor: mostrarFeriados ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterOptionText}>Feriados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)} style={[styles.filterOption, { backgroundColor: mostrarPersonalizados ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterOptionText}>Personalizados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarAcademicos(!mostrarAcademicos)} style={[styles.filterOption, { backgroundColor: mostrarAcademicos ? filterBtnColor : "gray" }, {borderBottomRightRadius: 10}]}>
            <CustomText style={styles.filterOptionText}>Académicos</CustomText>
          </TouchableOpacity>
        </View>
      }

      <TouchableOpacity onPress={() => abrirModalAgregarEvento()} style={[styles.openBtn, {backgroundColor: "green", marginBottom: 10}]}>
        <Ionicons name={"add"} size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)} style={styles.openBtn}>
        {mostrarFiltros ?
          (<Ionicons name={"close"} size={28} color="#f00" />)
        : (<Ionicons name={"filter"} size={28} color="#fff" />)
        }
      </TouchableOpacity>

    </View>
    </>
  );
}

const stylesOg = StyleSheet.create({
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


const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "negroAzulado",
    alignSelf: 'center',
    textAlign:"center",
    marginVertical: 0
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: azulLogoUndav,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 0,
    borderBottomEndRadius: 20
  },
  dropdownContenido: {
    gap: 4
  },
  agendaBtnContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  floatingBox: {
    position: 'absolute',
    bottom: 15 + 66 + bottomBarStyles.container.height,
    right: 15,
    zIndex: 10, // encima de otras Views
    flexDirection: "column",
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  filterOptionsParent: {
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 10,
    gap:4,
    borderBottomRightRadius: 16,
    flex: 1,
    ...getShadowStyle(4)
  },
  filterOption: {
    flex: 1,
    height: "100%",
    alignItems: "flex-start",
    backgroundColor: filterBtnColor,
    borderRadius: 0,
    borderBottomRightRadius: 0,
    ...getShadowStyle(2)
  },
  filterOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  openBtn: {
    backgroundColor: azulLogoUndav,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(4)
  },
  closeBtn: {
    backgroundColor: "lightgray",
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(4)
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c91800', // #333
    paddingBottom: 4,
    //paddingHorizontal: 8,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
