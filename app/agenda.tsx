// app/agenda.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../components/CustomText';
import {
  EventoAgenda,
  listaEnCurso as obtenerListaEnCurso,
  listaFuturo as obtenerListaFuturo,
  listaPasado as obtenerListaPasado,
  obtenerEventoConId,
} from '../data/agenda';

import { useAgenda } from '../src/context/AgendaContext';

import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulClaro, azulLogoUndav, azulMedioUndav, negroAzulado } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import DropdownSeccion from '@/components/DropdownSeccion';
import AgendaItemEditable from '@/components/AgendaItemEditable';
import ModalEvento from '@/components/ModalEvento'; // 🎯 IMPORTE MODULAR

const filterBtnColor = azulMedioUndav;

export default function Agenda() {
  const { isLoading, error, refetchEventos } = useAgenda();
  const insets = useSafeAreaInsets(); 
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);

  // Estados del nuevo Modal compartido
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoAgenda | null>(null);

  function puedeMostrarEvento(evento: EventoAgenda): boolean {
    if (evento.esFeriado) return mostrarFeriados;
    if (evento.id.startsWith('p')) return mostrarPersonalizados;
    return mostrarAcademicos;
  }

  const abrirModalAgregar = () => {
    setEventoSeleccionado(null);
    setModalVisible(true);
  };

  const abrirModalEditar = (id: string) => {
    const ev = obtenerEventoConId(id);
    if (!ev) return;
    setEventoSeleccionado(ev);
    setModalVisible(true);
  };

  useEffect(() => {
    if (!isLoading && editId) {
      abrirModalEditar(editId);
    }
  }, [editId, isLoading]);

  function mostrarLista(lista: EventoAgenda[]) {
    const listaFiltrada = lista.filter(puedeMostrarEvento);

    if (listaFiltrada.length === 0) {
      return <CustomText weight="bold" style={styles.title}>No hay eventos de este tipo</CustomText>;
    }

    return listaFiltrada.map((evento, index) => {
      const esUltimo = index === listaFiltrada.length - 1;
      const extraStyle = esUltimo ? { borderBottomRightRadius: 20 } : undefined;

      if (evento.id.startsWith('p')) {
        return (
          <AgendaItemEditable
            key={evento.id}
            evento={evento}
            onPressEdit={abrirModalEditar}
            styleExtra={extraStyle}
          />
        );
      }
      return <AgendaItem key={evento.id} evento={evento} styleExtra={extraStyle} />;
    });
  }

  return (
    <>
      <FondoScrollGradiente>
        {isLoading ? (
          <ActivityIndicator size="large" color={azulLogoUndav} style={styles.loading} />
        ) : error ? (
          <CustomText weight="bold" style={styles.title}>Error al cargar los eventos: {error}</CustomText>
        ) : mostrarAcademicos || mostrarPersonalizados || mostrarFeriados ? (
          <>
            <DropdownSeccion titulo="EN CURSO" styleContenido={styles.dropdownContenido} inicialmenteAbierto>
              {mostrarLista(obtenerListaEnCurso())}
            </DropdownSeccion>

            <DropdownSeccion titulo="PRÓXIMO" styleContenido={styles.dropdownContenido} inicialmenteAbierto>
              {mostrarLista(obtenerListaFuturo().filter((e) => !obtenerListaEnCurso().includes(e)))}
            </DropdownSeccion>

            <DropdownSeccion titulo="FINALIZADO" styleContenido={styles.dropdownContenido} inicialmenteAbierto={false}>
              {mostrarLista(obtenerListaPasado())}
            </DropdownSeccion>
          </>
        ) : (
          <CustomText weight="bold" style={styles.title}>No hay ningún tipo de evento seleccionado en los filtros.</CustomText>
        )}
      </FondoScrollGradiente>

      {/* BOTONERA FLOTANTE COMPLETA */}
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
          <TouchableOpacity onPress={abrirModalAgregar} style={[styles.openBtn, styles.addButton]}>
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)} style={[styles.openBtn, mostrarFiltros ? stylesFlotante.openBtnActive : null]}>
            <Ionicons name={mostrarFiltros ? "close" : "filter"} size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/calendario')} style={[styles.openBtn, { backgroundColor: azulLogoUndav }]}>
            <Ionicons name="calendar" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL COMPARTIDO */}
      <ModalEvento 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRefresh={refetchEventos}
        eventoAEditar={eventoSeleccionado}
      />
    </>
  );
}

// Se mantienen idénticos tus estilos originales de agenda...
const stylesFlotante = StyleSheet.create({
  floatingBox: { position: 'absolute', right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' },
  botonesColumna: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  filterOptionsParent: { backgroundColor: '#ffffff', borderRadius: 20, padding: 8, marginRight: 12, width: 200, gap: 6, ...getShadowStyle(6) },
  filterHeader: { fontSize: 11, color: '#8e8e93', letterSpacing: 1, marginBottom: 6, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#f2f2f7', paddingBottom: 6 },
  filterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, width: '100%' },
  optionActive: { backgroundColor: filterBtnColor },
  optionInactive: { backgroundColor: '#f2f2f7' },
  filterOptionText: { fontSize: 14, marginLeft: 10, flex: 1 },
  openBtnActive: {},
});
const styles = StyleSheet.create({
  loading: { marginTop: 50 },
  title: { fontSize: 16, color: negroAzulado, alignSelf: 'center', textAlign: 'center' },
  dropdownContenido: { gap: 4 },
  openBtn: { backgroundColor: azulClaro, borderRadius: 30, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', ...getShadowStyle(4) },
  addButton: { backgroundColor: 'green' },
});