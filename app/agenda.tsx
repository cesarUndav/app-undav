// app/agenda.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import CustomText from '../components/CustomText';
import {
  agregarEventoPersonalizado,
  editarEventoPersonalizado,
  EventoAgenda,
  listaEnCurso as obtenerListaEnCurso,
  listaFuturo as obtenerListaFuturo,
  listaPasado as obtenerListaPasado,
  obtenerEventoConId,
  quitarEventoPersonalizado,
} from '../data/agenda';

import { useAgenda } from '../src/context/AgendaContext';

import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulLogoUndav, grisBorde, negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { bottomBarStyles } from '@/components/BottomBar';
import DropdownSeccion from '@/components/DropdownSeccion';
import AgendaItemEditable from '@/components/AgendaItemEditable';
import OcultadorTeclado from '@/components/OcultadorTeclado';
import DateTimePicker from '@react-native-community/datetimepicker';

const filterBtnColor = azulLogoUndav;

export default function Agenda() {
  const { isLoading, error, refetchEventos } = useAgenda();

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tituloModal, setTituloModal] = useState('Título Modal');
  const [idEventoAbierto, setIdEventoAbierto] = useState('');

  function puedeMostrarEvento(evento: EventoAgenda): boolean {
    if (evento.esFeriado) return mostrarFeriados;
    if (evento.id.startsWith('p')) return mostrarPersonalizados;
    return mostrarAcademicos;
  }

  const limpiarVariablesModal = () => {
    setTitulo('');
    setDescripcion('');
    setFechaInicio(new Date());
    setFechaFin(new Date());
  };

  const abrirModalAgregarEvento = () => {
    limpiarVariablesModal();
    setModoEdicion(false);
    setTituloModal('Crear Evento');
    setModalVisible(true);
  };

  const abrirModalEditarEvento = (id: string) => {
    setModoEdicion(true);
    setTituloModal('Editar Evento');
    setIdEventoAbierto(id);

    const eventoEditado: EventoAgenda = obtenerEventoConId(id);

    setTitulo(eventoEditado.titulo);
    setDescripcion(eventoEditado.descripcion ? eventoEditado.descripcion : '');
    setFechaInicio(eventoEditado.fechaInicio);
    setFechaFin(eventoEditado.fechaFin);
    setModalVisible(true);
  };

  const confirmarAgregarEvento = () => {
    const t = titulo.trim();
    const d = descripcion.trim();
    const fi = fechaInicio.toISOString();
    const ff = fechaFin.toISOString();

    if (modoEdicion) {
      editarEventoPersonalizado(idEventoAbierto, t, d, fi, ff);
    } else {
      agregarEventoPersonalizado(t, d, fi, ff);
    }

    refetchEventos();

    setModalVisible(false);
    limpiarVariablesModal();
  };

  const eliminarEventoAbiertoYRedibujar = () => {
    Alert.alert('¿Eliminar Evento?', 'Esta acción no se puede deshacer', [
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          quitarEventoPersonalizado(idEventoAbierto);
          refetchEventos();
          setModalVisible(false);
          limpiarVariablesModal();
        },
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  function mostrarLista(lista: EventoAgenda[]) {
    const listaFiltrada = lista.filter(puedeMostrarEvento);

    if (listaFiltrada.length === 0) {
      return (
        <CustomText weight="bold" style={styles.title}>
          No hay eventos de este tipo
        </CustomText>
      );
    }

    return listaFiltrada.map((evento, index) => {
      const esUltimo = index === listaFiltrada.length - 1;
      const extraStyle = esUltimo
        ? { borderBottomRightRadius: 20 }
        : undefined;

      if (evento.id.startsWith('p')) {
        return (
          <AgendaItemEditable
            key={evento.id}
            evento={evento}
            onPressEdit={abrirModalEditarEvento}
            styleExtra={extraStyle}
          />
        );
      }

      return (
        <AgendaItem
          key={evento.id}
          evento={evento}
          styleExtra={extraStyle}
        />
      );
    });
  }

  return (
    <>
      <FondoScrollGradiente>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={azulLogoUndav}
            style={styles.loading}
          />
        ) : error ? (
          <CustomText weight="bold" style={styles.title}>
            Error al cargar los eventos: {error}
          </CustomText>
        ) : mostrarAcademicos || mostrarPersonalizados || mostrarFeriados ? (
          <>
            <DropdownSeccion
              titulo="EN CURSO"
              styleContenido={styles.dropdownContenido}
            >
              {mostrarLista(obtenerListaEnCurso())}
            </DropdownSeccion>

            <DropdownSeccion
              titulo="PRÓXIMO"
              styleContenido={styles.dropdownContenido}
            >
              {mostrarLista(
                obtenerListaFuturo().filter(
                  (e) => !obtenerListaEnCurso().includes(e)
                )
              )}
            </DropdownSeccion>

            <DropdownSeccion
              titulo="FINALIZADO"
              styleContenido={styles.dropdownContenido}
              inicialmenteAbierto={false}
            >
              {mostrarLista(obtenerListaPasado())}
            </DropdownSeccion>
          </>
        ) : (
          <CustomText weight="bold" style={styles.title}>
            No hay ningún tipo de evento seleccionado en los filtros.
          </CustomText>
        )}
      </FondoScrollGradiente>

      <View style={stylesFlotante.floatingBox}>
        {mostrarFiltros && (
          <View style={stylesFlotante.filterOptionsParent}>
            <TouchableOpacity
              onPress={() => setMostrarFeriados(!mostrarFeriados)}
              style={[
                stylesFlotante.filterOption,
                {
                  backgroundColor: mostrarFeriados
                    ? filterBtnColor
                    : 'gray',
                },
              ]}
            >
              <CustomText
                weight="bold"
                style={stylesFlotante.filterOptionText}
              >
                Feriados
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)}
              style={[
                stylesFlotante.filterOption,
                {
                  backgroundColor: mostrarPersonalizados
                    ? filterBtnColor
                    : 'gray',
                },
              ]}
            >
              <CustomText
                weight="bold"
                style={stylesFlotante.filterOptionText}
              >
                Personalizados
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarAcademicos(!mostrarAcademicos)}
              style={[
                stylesFlotante.filterOption,
                {
                  backgroundColor: mostrarAcademicos
                    ? filterBtnColor
                    : 'gray',
                },
                stylesFlotante.lastFilterOption,
              ]}
            >
              <CustomText
                weight="bold"
                style={stylesFlotante.filterOptionText}
              >
                Académicos
              </CustomText>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={abrirModalAgregarEvento}
          style={[styles.openBtn, styles.addButton]}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMostrarFiltros(!mostrarFiltros)}
          style={styles.openBtn}
        >
          {mostrarFiltros ? (
            <Ionicons name="close" size={28} color="#f00" />
          ) : (
            <Ionicons name="filter" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <OcultadorTeclado>
          <View style={stylesP.modalOverlay}>
            <View style={stylesP.modalContainer}>
              <CustomText weight="bold" style={stylesP.modalTitle}>
                {tituloModal}
              </CustomText>

              <TextInput
                style={stylesP.input}
                multiline
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
              />

              <TextInput
                style={stylesP.input}
                multiline
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
              />

              <View style={stylesP.dateRow}>
                <TouchableOpacity
                  onPress={() => setShowInicioPicker(true)}
                  style={stylesP.dateButton}
                >
                  <CustomText>
                    {'Inicio: ' + fechaInicio.toLocaleDateString()}
                  </CustomText>
                </TouchableOpacity>

                {showInicioPicker && (
                  <DateTimePicker
                    value={fechaInicio}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      if (date) setFechaInicio(date);
                      setShowInicioPicker(Platform.OS === 'ios');
                    }}
                  />
                )}

                <TouchableOpacity
                  onPress={() => setShowFinPicker(true)}
                  style={stylesP.dateButton}
                >
                  <CustomText>
                    {'Fin: ' + fechaFin.toLocaleDateString()}
                  </CustomText>
                </TouchableOpacity>

                {showFinPicker && (
                  <DateTimePicker
                    value={fechaFin}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      if (date) setFechaFin(date);
                      setShowFinPicker(Platform.OS === 'ios');
                    }}
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={confirmarAgregarEvento}
                disabled={titulo.trim().length === 0}
                style={[
                  stylesP.modalBtn,
                  {
                    backgroundColor:
                      titulo.trim().length > 0 ? azulLogoUndav : 'gray',
                  },
                ]}
              >
                <CustomText weight="bold" style={stylesP.modalBtnText}>
                  GUARDAR CAMBIOS
                </CustomText>
              </TouchableOpacity>

              {modoEdicion && (
                <TouchableOpacity
                  onPress={eliminarEventoAbiertoYRedibujar}
                  style={[stylesP.modalBtn, stylesP.deleteButton]}
                >
                  <CustomText weight="bold" style={stylesP.modalBtnText}>
                    ELIMINAR EVENTO
                  </CustomText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[stylesP.modalBtn, stylesP.cancelButton]}
              >
                <CustomText
                  weight="bold"
                  style={[stylesP.modalBtnText, stylesP.cancelButtonText]}
                >
                  SALIR SIN GUARDAR
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </OcultadorTeclado>
      </Modal>
    </>
  );
}

const stylesFlotante = StyleSheet.create({
  floatingBox: {
    position: 'absolute',
    bottom: 15 + bottomBarStyles.container.height,
    right: 15,
    zIndex: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  filterOptionsParent: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
    gap: 4,
    borderBottomRightRadius: 16,
    flex: 1,
    ...getShadowStyle(4),
  },
  filterOption: {
    flex: 1,
    height: '100%',
    alignItems: 'flex-start',
    backgroundColor: filterBtnColor,
    borderRadius: 0,
    borderBottomRightRadius: 0,
    ...getShadowStyle(2),
  },
  lastFilterOption: {
    borderBottomRightRadius: 10,
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

const styles = StyleSheet.create({
  loading: {
    marginTop: 50,
  },
  title: {
    fontSize: 16,
    color: negroAzulado,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 0,
  },
  dropdownContenido: {
    gap: 4,
  },
  openBtn: {
    backgroundColor: azulLogoUndav,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(4),
  },
  addButton: {
    backgroundColor: 'green',
    marginBottom: 10,
  },
});

const stylesP = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 0,
    borderBottomRightRadius: 24,
    padding: 15,
    gap: 8,
  },
  modalTitle: {
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: grisBorde,
    padding: 6,
    fontSize: 16,
    flexWrap: 'wrap',
    fontFamily: 'Montserrat_400Regular',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    flex: 1,
  },
  modalBtn: {
    backgroundColor: 'gray',
    textAlign: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 16,
    ...getShadowStyle(2),
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 15,
    paddingVertical: 12,
  },
  deleteButton: {
    backgroundColor: '#c91800',
  },
  cancelButton: {
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: 'gray',
  },
});