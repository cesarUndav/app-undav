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
import BotoneraFlotante from '@/components/BotoneraFlotante';

type TipoVista = 'lista' | 'calendario';

export default function AgendaMaestra() {
  const { isLoading, error, refetchEventos, eventosFuturos } = useAgenda();
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
  const prepararDatosCalendario = () => {
    try {
      console.log("📅 [AgendaMaestra] Re-calculando matriz del calendario...");
      
      // 🌟 CAMBIO CLAVE: Usamos 'eventosFuturos' del contexto en lugar de 'listaCompleta()'
      // Esto garantiza que el calendario lea los mismos datos en tiempo real que la lista.
      const todosLosEventos = eventosFuturos; 
      
      const actividadesTemp: { [fecha: string]: any[] } = {};

      todosLosEventos.forEach((evento, idx) => {
        if (!evento.fechaInicio || !evento.fechaFin) return;
        
        // Formateamos las fechas de manera segura sin desfase de zona horaria
        const dIni = new Date(evento.fechaInicio);
        const dFin = new Date(evento.fechaFin);
        
        const fIni = `${dIni.getFullYear()}-${String(dIni.getMonth() + 1).padStart(2, '0')}-${String(dIni.getDate()).padStart(2, '0')}`;
        const fFin = `${dFin.getFullYear()}-${String(dFin.getMonth() + 1).padStart(2, '0')}-${String(dFin.getDate()).padStart(2, '0')}`;
        
        const sufijo = evento.id.startsWith('p') ? `-p-${idx}` : `-${idx}`;

        if (fIni === fFin) {
          if (!actividadesTemp[fIni]) actividadesTemp[fIni] = [];
          actividadesTemp[fIni].push({ 
            id: `e${sufijo}`, 
            title: evento.titulo, 
            body: eventoAgendaToFechaString(evento), 
            esFeriado: evento.esFeriado, 
            descripcion: evento.descripcion, 
            eventoOriginal: evento 
          });
        } else {
          if (!actividadesTemp[fIni]) actividadesTemp[fIni] = [];
          actividadesTemp[fIni].push({ 
            id: `e${sufijo}-ini`, 
            title: `[Inicio] ${evento.titulo}`, 
            body: eventoAgendaToFechaString(evento), 
            esFeriado: evento.esFeriado, 
            descripcion: evento.descripcion, 
            eventoOriginal: evento 
          });
          
          if (!actividadesTemp[fFin]) actividadesTemp[fFin] = [];
          actividadesTemp[fFin].push({ 
            id: `e${sufijo}-fin`, 
            title: `[Fin] ${evento.titulo}`, 
            body: eventoAgendaToFechaString(evento), 
            esFeriado: evento.esFeriado, 
            descripcion: evento.descripcion, 
            eventoOriginal: evento 
          });
        }
      });
      
      setActividadesPorFecha(actividadesTemp);
    } catch (e) {
      console.error("❌ Error al preparar calendario:", e);
    } finally {
      setLoadingCalendario(false);
    }
  };

  prepararDatosCalendario();
}, [eventosFuturos]); // 🔄 Sincronizado pura y exclusivamente con el estado global del Contexto
  return (
    <>
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

      <BotoneraFlotante
        bottomOffset={insets.bottom + 76}
        mostrarFiltros={mostrarFiltros}
        setMostrarFiltros={setMostrarFiltros}
        mostrarFeriados={mostrarFeriados}
        setMostrarFeriados={setMostrarFeriados}
        mostrarPersonalizados={mostrarPersonalizados}
        setMostrarPersonalizados={setMostrarPersonalizados}
        mostrarAcademicos={mostrarAcademicos}
        setMostrarAcademicos={setMostrarAcademicos}
        onAgregarPress={abrirModalAgregar}
        iconToggleVista={vistaActiva === 'lista' ? "calendar" : "list"}
        onToggleVistaPress={() => setVistaActiva(vistaActiva === 'lista' ? 'calendario' : 'lista')}
      />

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