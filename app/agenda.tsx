// app/agenda.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../components/CustomText';
import { EventoAgenda, obtenerEventoConId } from '../data/agenda';
import { useAgenda } from '../src/context/AgendaContext';

import SubVistaLista from '@/components/agenda/SubVistaLista';
import SubVistaCalendario from '@/components/agenda/SubVistaCalendario';
import ModalEvento from '@/components/ModalEvento';

import { azulLogoUndav, azulMedioUndav, azulClaro } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

import { listaCompleta, cargarEventosAcademicos, eventoAgendaToFechaString } from '../data/agenda';

type TipoVista = 'lista' | 'calendario';

export default function AgendaMaestra() {
  const { isLoading, error, refetchEventos } = useAgenda();
  const insets = useSafeAreaInsets(); 
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  // 🌟 Control de la Vista Activa (Alternador Local sin Router Historial)
  const [vistaActiva, setVistaActiva] = useState<TipoVista>('lista');

  // Filtros globales unificados
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);

  // Estados del Modal Compartido
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoAgenda | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());

  const [actividadesPorFecha, setActividadesPorFecha] = useState<{[fecha: string]: any[]}>({});
  const [loadingCalendario, setLoadingCalendario] = useState(true);

  // Función evaluadora compartida (Se pasa memorizada como prop)
  const puedeMostrarEvento = useCallback((evento: EventoAgenda): boolean => {
    if (evento.esFeriado) return mostrarFeriados;
    if (evento.id.startsWith('p')) return mostrarPersonalizados;
    return mostrarAcademicos;
  }, [mostrarFeriados, mostrarPersonalizados, mostrarAcademicos]);

  const abrirModalAgregar = () => {
    setEventoSeleccionado(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (idOrEvento: string | EventoAgenda) => {
    if (typeof idOrEvento === 'string') {
      const ev = obtenerEventoConId(idOrEvento);
      if (!ev) return;
      setEventoSeleccionado(ev);
    } else {
      setEventoSeleccionado(idOrEvento);
    }
    setModalVisible(true);
  };

  useEffect(() => {
    if (!isLoading && editId) {
      abrirModalEditar(editId);
    }
  }, [editId, isLoading]);

  useEffect(() => {
  const prepararDatosCalendario = async () => {
    try {
      await cargarEventosAcademicos();
      const todosLosEventos = listaCompleta();
      const actividadesTemp: { [fecha: string]: any[] } = {};

      todosLosEventos.forEach((evento, idx) => {
        if (!evento.fechaInicio || !evento.fechaFin) return;
        const fIni = `${new Date(evento.fechaInicio).getFullYear()}-${String(new Date(evento.fechaInicio).getMonth() + 1).padStart(2, '0')}-${String(new Date(evento.fechaInicio).getDate()).padStart(2, '0')}`;
        const fFin = `${new Date(evento.fechaFin).getFullYear()}-${String(new Date(evento.fechaFin).getMonth() + 1).padStart(2, '0')}-${String(new Date(evento.fechaFin).getDate()).padStart(2, '0')}`;
        const sufijo = evento.id.startsWith('p') ? `-p-${idx}` : `-${idx}`;

        if (fIni === fFin) {
          if (!actividadesTemp[fIni]) actividadesTemp[fIni] = [];
          actividadesTemp[fIni].push({ id: `e${sufijo}`, title: evento.titulo, body: eventoAgendaToFechaString(evento), esFeriado: evento.esFeriado, descripcion: evento.descripcion, eventoOriginal: evento });
        } else {
          if (!actividadesTemp[fIni]) actividadesTemp[fIni] = [];
          actividadesTemp[fIni].push({ id: `e${sufijo}-ini`, title: `[Inicio] ${evento.titulo}`, body: eventoAgendaToFechaString(evento), esFeriado: evento.esFeriado, descripcion: evento.descripcion, eventoOriginal: evento });
          if (!actividadesTemp[fFin]) actividadesTemp[fFin] = [];
          actividadesTemp[fFin].push({ id: `e${sufijo}-fin`, title: `[Fin] ${evento.titulo}`, body: eventoAgendaToFechaString(evento), esFeriado: evento.esFeriado, descripcion: evento.descripcion, eventoOriginal: evento });
        }
      });
      setActividadesPorFecha(actividadesTemp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCalendario(false);
    }
  };

  prepararDatosCalendario();
}, [isLoading]); // Reacciona cuando el contexto termina su carga inicial

  return (
    <>
      {/* RENDERIZADO CONDICIONAL DE SUB-VISTAS*/}
        {vistaActiva === 'lista' ? (
          <SubVistaLista 
            isLoading={isLoading}
            error={error}
            puedeMostrarEvento={puedeMostrarEvento}
            onAbrirEditar={abrirModalEditar}
          />
        ) : (
          <SubVistaCalendario 
            puedeMostrarEvento={puedeMostrarEvento}
            onAbrirEditar={abrirModalEditar}
            fechaSeleccionada={fechaSeleccionada}
            setFechaSeleccionada={setFechaSeleccionada}
            actividadesPrecargadas={actividadesPorFecha}
            loadingPrecargado={isLoading}
          />
        )}

      {/* BOTONERA FLOTANTE */}
      <View style={[stylesFlotante.floatingBox, { bottom: insets.bottom + 76 }]}>
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
          {/* Botón Añadir */}
          <TouchableOpacity onPress={abrirModalAgregar} style={[stylesFlotante.openBtn, stylesFlotante.addButton]}>
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Botón Filtros */}
          <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)} style={[stylesFlotante.openBtn, mostrarFiltros ? { backgroundColor: '#e74c3c' } : null]}>
            <Ionicons name={mostrarFiltros ? "close" : "filter"} size={26} color="#fff" />
          </TouchableOpacity>

          {/* 🌟 BOTÓN DE CONMUTACIÓN DE VISTA (Reemplaza router.push) */}
          <TouchableOpacity 
            onPress={() => setVistaActiva(vistaActiva === 'lista' ? 'calendario' : 'lista')} 
            style={[stylesFlotante.openBtn, { backgroundColor: azulLogoUndav }]}
          >
            <Ionicons name={vistaActiva === 'lista' ? "calendar" : "list"} size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL COMPARTIDO ÚNICO */}
      <ModalEvento 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefresh={() => {
          refetchEventos();
        }}
        fechaPorDefecto={fechaSeleccionada}
        eventoAEditar={eventoSeleccionado}
      />
    </>
  );
}

const stylesFlotante = StyleSheet.create({
  floatingBox: { position: 'absolute', right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' },
  botonesColumna: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  filterOptionsParent: { backgroundColor: '#ffffff', borderRadius: 20, padding: 8, marginRight: 12, width: 200, gap: 6, ...getShadowStyle(6) },
  filterHeader: { fontSize: 11, color: '#8e8e93', letterSpacing: 1, marginBottom: 6, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#f2f2f7', paddingBottom: 6 },
  filterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, width: '100%' },
  optionActive: { backgroundColor: azulMedioUndav },
  optionInactive: { backgroundColor: '#f2f2f7' },
  filterOptionText: { fontSize: 14, marginLeft: 10, flex: 1 },
  openBtn: { backgroundColor: azulClaro, borderRadius: 30, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', ...getShadowStyle(4) },
  addButton: { backgroundColor: 'green' },
});