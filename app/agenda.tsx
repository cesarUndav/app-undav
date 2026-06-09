// app/agenda.tsx

import React, { useState, useEffect } from 'react'; // 🎯 Importamos useEffect
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router'; // 🎯 IMPORTAMOS EL CAPTURADOR DE PARÁMETROS

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
  listaCursadasSIU,
} from '../data/agenda';

import { useAgenda } from '../src/context/AgendaContext';

import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulClaro, azulLogoUndav, azulMedioUndav, grisBorde, negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { bottomBarStyles } from '@/components/BottomBar';
import DropdownSeccion from '@/components/DropdownSeccion';
import AgendaItemEditable from '@/components/AgendaItemEditable';
import OcultadorTeclado from '@/components/OcultadorTeclado';
import DateTimePicker from '@react-native-community/datetimepicker';
import ListaItem from '@/components/ListaItem';

const filterBtnColor = azulMedioUndav;

export default function Agenda() {
  const { isLoading, error, refetchEventos } = useAgenda();
  const insets = useSafeAreaInsets(); 
  const { editId } = useLocalSearchParams<{ editId?: string }>(); // 🎯 CAPTURAMOS EL ID REMOTO SI EXISTE

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [rangoHabilitado, setRangoHabilitado] = useState(false); 
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
    setRangoHabilitado(false); 
  };

  const abrirModalAgregarEvento = () => {
    limpiarVariablesModal();
    setModoEdicion(false);
    setTituloModal('Crear Evento');
    setModalVisible(true);
  };

  const abrirModalEditarEvento = (id: string) => {
    const eventoEditado: EventoAgenda = obtenerEventoConId(id);

    // 🛡️ Guardrail: Si el contexto no terminó de cargar los datos físicos, evitamos el crash
    if (!eventoEditado) return;

    setModoEdicion(true);
    setTituloModal('Editar Evento');
    setIdEventoAbierto(id);

    setTitulo(eventoEditado.titulo);
    setDescripcion(eventoEditado.descripcion ? eventoEditado.descripcion : '');
    setFechaInicio(eventoEditado.fechaInicio);
    setFechaFin(eventoEditado.fechaFin);
    
    const esRango = eventoEditado.fechaInicio.toDateString() !== eventoEditado.fechaFin.toDateString();
    setRangoHabilitado(esRango);
    
    setModalVisible(true);
  };

  // 🎯 ESCUCHA DE PARÁMETROS EXTERNOS: Se dispara de inmediato al resolver la sincronización
  useEffect(() => {
    if (!isLoading && editId) {
      abrirModalEditarEvento(editId);
    }
  }, [editId, isLoading]);

  const confirmarAgregarEvento = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioValidar = new Date(fechaInicio);
    inicioValidar.setHours(0, 0, 0, 0);

    if (inicioValidar < hoy) {
      Alert.alert('Fecha inválida', 'No podés registrar un evento en una fecha que ya pasó.');
      return;
    }

    let fechaFinReal = new Date(fechaFin);
    if (!rangoHabilitado) {
      fechaFinReal = new Date(fechaInicio);
    } else {
      const finValidar = new Date(fechaFin);
      finValidar.setHours(0, 0, 0, 0);
      if (finValidar < inicioValidar) {
        Alert.alert('Error en las fechas', 'La fecha de finalización no puede ser anterior a la fecha de inicio.');
        return;
      }
    }

    const t = titulo.trim();
    const d = descripcion.trim();
    const fi = fechaInicio.toISOString();
    const ff = fechaFinReal.toISOString();

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
      const extraStyle = esUltimo ? { borderBottomRightRadius: 20 } : undefined;

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
              titulo="MIS MATERIAS"
              styleContenido={styles.dropdownContenido}
              inicialmenteAbierto
            >
              {listaCursadasSIU.length === 0 ? (
                <CustomText weight="bold" style={styles.title}>
                  Error al cargar cursadas del SIU Guaraní
                </CustomText>
              ) : (
                listaCursadasSIU.map((materia, index) => {
                  const esUltimo = index === listaCursadasSIU.length - 1;
                  return (
                    <ListaItem
                      key={materia.id}
                      title={materia.titulo}
                      subtitle={materia.descripcion}
                      styleExtra={esUltimo ? { borderBottomRightRadius: 20 } : undefined}
                    />
                  );
                })
              )}
            </DropdownSeccion>

            <DropdownSeccion
              titulo="EN CURSO"
              styleContenido={styles.dropdownContenido}
              inicialmenteAbierto
            >
              {mostrarLista(obtenerListaEnCurso())}
            </DropdownSeccion>

            <DropdownSeccion
              titulo="PRÓXIMO"
              styleContenido={styles.dropdownContenido}
              inicialmenteAbierto
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

      <View 
        style={[
          stylesFlotante.floatingBox, 
          { bottom: insets.bottom + 60 + 16 }
        ]}
      >
        {mostrarFiltros && (
          <View style={stylesFlotante.filterOptionsParent}>
            <CustomText weight="bold" style={stylesFlotante.filterHeader}>
              FILTRAR VISTA
            </CustomText>
            
            <TouchableOpacity
              onPress={() => setMostrarFeriados(!mostrarFeriados)}
              style={[
                stylesFlotante.filterOption,
                mostrarFeriados ? stylesFlotante.optionActive : stylesFlotante.optionInactive
              ]}
            >
              <Ionicons 
                name="calendar" 
                size={18} 
                color={mostrarFeriados ? '#fff' : '#8e8e93'} 
              />
              <CustomText weight="bold" style={[stylesFlotante.filterOptionText, { color: mostrarFeriados ? '#fff' : '#2c3e50' }]}>
                Feriados
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)}
              style={[
                stylesFlotante.filterOption,
                mostrarPersonalizados ? stylesFlotante.optionActive : stylesFlotante.optionInactive
              ]}
            >
              <Ionicons 
                name="person" 
                size={18} 
                color={mostrarPersonalizados ? '#fff' : '#8e8e93'} 
              />
              <CustomText weight="bold" style={[stylesFlotante.filterOptionText, { color: mostrarPersonalizados ? '#fff' : '#2c3e50' }]}>
                Personalizados
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMostrarAcademicos(!mostrarAcademicos)}
              style={[
                stylesFlotante.filterOption,
                mostrarAcademicos ? stylesFlotante.optionActive : stylesFlotante.optionInactive
              ]}
            >
              <Ionicons 
                name="school" 
                size={18} 
                color={mostrarAcademicos ? '#fff' : '#8e8e93'} 
              />
              <CustomText weight="bold" style={[stylesFlotante.filterOptionText, { color: mostrarAcademicos ? '#fff' : '#2c3e50' }]}>
                Académicos
              </CustomText>
            </TouchableOpacity>
          </View>
        )}

        <View style={stylesFlotante.botonesColumna}>
          <TouchableOpacity
            onPress={abrirModalAgregarEvento}
            style={[styles.openBtn, styles.addButton]}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMostrarFiltros(!mostrarFiltros)}
            style={[styles.openBtn, mostrarFiltros ? stylesFlotante.openBtnActive : null]}
          >
            <Ionicons name={mostrarFiltros ? "close" : "filter"} size={26} color="#fff" />
          </TouchableOpacity>
        </View>
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

              <TouchableOpacity
                onPress={() => setRangoHabilitado(!rangoHabilitado)}
                style={stylesP.switchContainer}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={rangoHabilitado ? "checkbox" : "square-outline"}
                  size={20}
                  color={azulLogoUndav}
                />
                <CustomText style={stylesP.switchText}>
                  ¿Dura más de un día el evento?
                </CustomText>
              </TouchableOpacity>

              <View style={stylesP.dateRow}>
                <TouchableOpacity
                  onPress={() => setShowInicioPicker(true)}
                  style={stylesP.dateButton}
                >
                  <CustomText style={stylesP.dateButtonText}>
                    {rangoHabilitado ? 'Inicio: ' : 'Fecha: '} 
                    {fechaInicio.toLocaleDateString()}
                  </CustomText>
                </TouchableOpacity>

                {showInicioPicker && (
                  <DateTimePicker
                    value={fechaInicio}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      if (date) {
                        setFechaInicio(date);
                        if (!rangoHabilitado) setFechaFin(date);
                      }
                      setShowInicioPicker(Platform.OS === 'ios');
                    }}
                  />
                )}

                {rangoHabilitado && (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowFinPicker(true)}
                      style={stylesP.dateButton}
                    >
                      <CustomText style={stylesP.dateButtonText}>
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
                  </>
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
    right: 16,   
    zIndex: 10,
    flexDirection: 'row',        
    alignItems: 'flex-end',      
    justifyContent: 'flex-end',
  },
  botonesColumna: {
    flexDirection: 'column',     
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filterOptionsParent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,             
    width: 200, 
    gap: 6,
    ...getShadowStyle(6), 
  },
  filterHeader: {
    fontSize: 11,
    color: '#8e8e93',
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
    paddingBottom: 6,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12, 
    width: '100%',
  },
  optionActive: {
    backgroundColor: filterBtnColor,
  },
  optionInactive: {
    backgroundColor: '#f2f2f7', 
  },
  filterOptionText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  openBtnActive: {},
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
    backgroundColor: azulClaro,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 6,
    gap: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#555',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#f2f2f7',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  dateButtonText: {
    fontSize: 14,
    color: negroAzulado,
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