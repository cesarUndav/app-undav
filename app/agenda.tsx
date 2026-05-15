import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';

import CustomText from '../components/CustomText';
// ❌ ELIMINAMOS las importaciones de listaEnCurso, listaFuturo, listaPasado, listaCompleta
//    porque vamos a usar las funciones locales del contexto para mantener la reactividad.
// ⚠️ Mantenemos las funciones de manejo de eventos personalizados (porque aún son locales)
import { agregarEventoPersonalizado, editarEventoPersonalizado, EventoAgenda, listaEnCurso as obtenerListaEnCurso, listaFuturo as obtenerListaFuturo, listaPasado as obtenerListaPasado, obtenerEventoConId, quitarEventoPersonalizado} from '../data/agenda';
import { useFocusEffect } from 'expo-router';

// 🚀 IMPORTAMOS EL HOOK Y LA LÓGICA DE CONTEXTO
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

import { useCategoriasPersistentes, Categoria } from '@/hooks/useCategoriasPersistentes';


const filterBtnColor = azulLogoUndav
export default function Agenda() {
  

  const { eventosFuturos, isLoading, error, refetchEventos } = useAgenda(); 

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);

  // categorias
  const {
    categorias,
    agregar: agregarCategoria,
    eliminar: eliminarCategoria,
    cargando: cargandoCategorias
  } = useCategoriasPersistentes();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  // fin categorias

  function puedeMostrarEvento(evento:EventoAgenda):Boolean {
    if (evento.esFeriado) {return mostrarFeriados;}
    else if (evento.id.startsWith("p")) {return mostrarPersonalizados;}
    else {return mostrarAcademicos;}
  }
  // EVENTOS CUSTOM
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tituloModal, setTituloModal] = useState("Titulo Modal");
  const [idEventoAbierto, setIdEventoAbierto] = useState("");

  const abrirModalAgregarEvento = () => {
    limpiarVariablesModal();
    setModoEdicion(false);
    setTituloModal("Crear Evento");
    setModalVisible(true);
  };
  const abrirModalEditarEvento = (id:string) => {
    setModoEdicion(true);
    setTituloModal("Editar Evento");
    setIdEventoAbierto(id);
    // cargar datos de evento desde id:
    const eventoEditado:EventoAgenda = obtenerEventoConId(id);
    setTitulo(eventoEditado.titulo);
    if (eventoEditado.descripcion) setDescripcion(eventoEditado.descripcion);
    else setDescripcion("");
    setFechaInicio(eventoEditado.fechaInicio);
    setFechaFin(eventoEditado.fechaFin);
    
    setModalVisible(true);
  };

  const confirmarAgregarEvento = () => {
    const t = titulo.trim();
    const d = descripcion.trim();
    const fi = fechaInicio.toISOString();
    const ff = fechaFin.toISOString();

    if (modoEdicion) editarEventoPersonalizado(idEventoAbierto, t, d, fi, ff);
    else agregarEventoPersonalizado(t, d, fi, ff);
    
    refetchEventos();
    
    setModalVisible(false);
    limpiarVariablesModal();
  };
  
  const eliminarEventoAbiertoYRedibujar = () => {
    Alert.alert("¿Eliminar Evento?", "Esta acción no se puede deshacer", [
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          quitarEventoPersonalizado(idEventoAbierto);
          refetchEventos();
          setModalVisible(false);
          limpiarVariablesModal();
        },
      },
      { text: "No", style: "cancel" },
    ]);
    
  };

  const limpiarVariablesModal = () => {
    setTitulo('');
    setDescripcion("");
    setFechaInicio(new Date());
    setFechaFin(new Date());
  }
  // FIN EVENTOS CUSTOM
  
  function mostrarLista(lista: EventoAgenda[]) {
  const listaFiltrada = lista.filter(puedeMostrarEvento);

  if (listaFiltrada.length === 0) {
    return <CustomText style={styles.title}>No hay eventos de este tipo</CustomText>;
  }

  return listaFiltrada.map((evento, index) => {
    const esUltimo = index === listaFiltrada.length - 1;
    const extraStyle = esUltimo ? { borderBottomRightRadius: 20 } : undefined;

    if (evento.id.startsWith("p")) {
      return (
        <AgendaItemEditable
          key={evento.id}
          evento={evento}
          onPressEdit={abrirModalEditarEvento}
          styleExtra={extraStyle}
        />
      );
    } else {
      return (
        <AgendaItem
          key={evento.id}
          evento={evento}
          styleExtra={extraStyle}
        />
      );
    }
  });
}

  function mostrarListaViejo(lista:EventoAgenda[]) {
    const listaFiltrada = lista.filter(puedeMostrarEvento);

    if (listaFiltrada.length > 0) return lista.map((evento) => ( puedeMostrarEvento(evento) &&
      (
      evento.id.startsWith("p") ?
        <AgendaItemEditable key={evento.id} evento={evento} onPressEdit={abrirModalEditarEvento}/>
      :
        <AgendaItem key={evento.id} evento={evento} />
      )
    ))
    else return <CustomText style={styles.title}>No hay eventos de este tipo</CustomText>
  }
  
  return (
    <>
    <FondoScrollGradiente>
  {
    // 🚀 4. MOSTRAR ESTADO DE CARGA/ERROR
    isLoading ? (
      <ActivityIndicator size="large" color={azulLogoUndav} style={{marginTop: 50}} />
    ) : error ? (
      <CustomText style={styles.title}>Error al cargar los eventos: {error}</CustomText>
    ) : (
      // Si no hay error ni carga pendiente, mostramos las secciones:
      mostrarAcademicos || mostrarPersonalizados || mostrarFeriados ? (
      <>
      {/* 🚀 5. USAR LAS FUNCIONES ACTUALIZADAS */}
      {/* Aunque usemos las funciones de data/agenda, el contexto garantiza 
              que la lista global se actualizó, forzando la re-ejecución de este return. */}
      <DropdownSeccion titulo="EN CURSO" styleContenido={styles.dropdownContenido} >
        {mostrarLista(obtenerListaEnCurso())}
      </DropdownSeccion>

      <DropdownSeccion titulo="PRÓXIMO" styleContenido={styles.dropdownContenido}>
        {mostrarLista(obtenerListaFuturo().filter((e) => !obtenerListaEnCurso().includes(e)))}
      </DropdownSeccion>

      <DropdownSeccion titulo="FINALIZADO" styleContenido={styles.dropdownContenido} inicialmenteAbierto={false}>
        {mostrarLista(obtenerListaPasado())}
      </DropdownSeccion>
    </>
      ) : (
        <CustomText style={styles.title}>
          No hay ningún tipo de evento seleccionado en los filtros.
        </CustomText>
      )
    )
    }
    </FondoScrollGradiente>

    {/* botones FLOTANTES */}
    <View style={stylesFlotante.floatingBox}>

      {mostrarFiltros && 
        <View style={stylesFlotante.filterOptionsParent}>
          <TouchableOpacity onPress={() => setMostrarFeriados(!mostrarFeriados)} style={[stylesFlotante.filterOption, { backgroundColor: mostrarFeriados ? filterBtnColor : "gray" }]}>
            <CustomText style={stylesFlotante.filterOptionText}>Feriados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)} style={[stylesFlotante.filterOption, { backgroundColor: mostrarPersonalizados ? filterBtnColor : "gray" }]}>
            <CustomText style={stylesFlotante.filterOptionText}>Personalizados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarAcademicos(!mostrarAcademicos)} style={[stylesFlotante.filterOption, { backgroundColor: mostrarAcademicos ? filterBtnColor : "gray" }, {borderBottomRightRadius: 10}]}>
            <CustomText style={stylesFlotante.filterOptionText}>Académicos</CustomText>
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

    {/* MODAL */}
    <Modal visible={modalVisible} animationType="fade" transparent>
      <OcultadorTeclado>
        <View style={stylesP.modalOverlay}>
          <View style={stylesP.modalContainer}>
            <CustomText style={stylesP.modalTitle}>{tituloModal}</CustomText>
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

            {/* {!cargandoCategorias && (
              <DropdownCategorias
                categorias={categorias}
                seleccionada={categoriaSeleccionada}
                onSeleccionar={setCategoriaSeleccionada}
                onEliminar={eliminarCategoria}
                onAgregar={agregarCategoria}
              />
            )} */}

            <View style={{flexDirection:"row", gap: 8}}>
              <TouchableOpacity onPress={() => setShowInicioPicker(true)} style={stylesP.dateButton}>
                <CustomText>{"Inicio: "+fechaInicio.toLocaleDateString()}</CustomText>
              </TouchableOpacity>
              {showInicioPicker && (
                <DateTimePicker
                  value={fechaInicio}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    if (date) {setFechaInicio(date); }
                    setShowInicioPicker(Platform.OS === 'ios');
                  }}
                />
              )}

              <TouchableOpacity onPress={() => setShowFinPicker(true)} style={stylesP.dateButton}>
                <CustomText>{"Fin: "+fechaFin.toLocaleDateString()}</CustomText>
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
          
            <TouchableOpacity onPress={confirmarAgregarEvento}
              disabled={titulo.trim().length === 0}
              style={[stylesP.modalBtn, { backgroundColor: titulo.trim().length > 0 ? azulLogoUndav : "gray" }]}>
              <CustomText style={stylesP.modalBtnText}>GUARDAR CAMBIOS</CustomText>
            </TouchableOpacity>
            
            { modoEdicion && (
                <TouchableOpacity onPress={() => eliminarEventoAbiertoYRedibujar()} style={[stylesP.modalBtn, { backgroundColor: "#c91800" }]}>
                  <CustomText style={stylesP.modalBtnText}>ELIMINAR EVENTO</CustomText>
                </TouchableOpacity>
              )
            }

            <TouchableOpacity onPress={() => setModalVisible(false)} style={[stylesP.modalBtn, { backgroundColor: "white" }]}>
              <CustomText style={[stylesP.modalBtnText,{color: "gray"}]}>SALIR SIN GUARDAR</CustomText>
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

const stylesP = StyleSheet.create({
  scrollContainer: {
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
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
    gap: 8
  },
  modalTitle: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#000",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: grisBorde,
    padding: 6,
    fontSize: 16,
    flexWrap: "wrap"
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    flex: 1
  },
    modalBtn: {
    backgroundColor: "gray",
    //flex: 1,
    //height: "100%",
    textAlign: "center",
    alignItems: "center",
    borderBottomRightRadius: 16,
    ...getShadowStyle(2)
    //marginHorizontal: 10
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 12
  },
});

