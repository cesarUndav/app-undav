import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Platform, TextInput, ScrollView } from 'react-native';
import CustomText from '../components/CustomText';
import { EventoAgenda, listaEventosPersonalizados, obtenerEventoConId, editarEventoPersonalizado} from '../data/agenda';

import {agregarEventoPersonalizado, quitarEventoPersonalizado} from '../data/agenda';
import DateTimePicker from '@react-native-community/datetimepicker';
import AgendaItemEditable from '@/components/AgendaItemEditable';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import OcultadorTeclado from '@/components/OcultadorTeclado';
import { azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import FondoGradiente from '@/components/FondoGradiente';
import BotonTextoLink from '@/components/BotonTextoLink';

export default function EventosPersonalizados() {
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tituloModal, setTituloModal] = useState("Titulo Modal");
  const [idEventoAbierto, setIdEventoAbierto] = useState("");

  useEffect(() => {
    setListaEventos(listaEventosPersonalizados);
  }, [listaEventosPersonalizados]);

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
    setFechaInicio(eventoEditado.fechaInicio);
    setFechaFin(eventoEditado.fechaFin);
    
    setModalVisible(true);
  };

  const confirmarAgregarEvento = () => {
    if (modoEdicion) editarEventoPersonalizado(idEventoAbierto, titulo.trim(), fechaInicio.toISOString(), fechaFin.toISOString());
    else agregarEventoPersonalizado(titulo.trim(), fechaInicio.toISOString(), fechaFin.toISOString());
    setListaEventos([...listaEventosPersonalizados]);
    setModalVisible(false);
    limpiarVariablesModal();
  };

  const eliminarEventoAbiertoYRedibujar = () => {
    quitarEventoPersonalizado(idEventoAbierto);
    setListaEventos([...listaEventosPersonalizados]);
    setModalVisible(false);
    limpiarVariablesModal();
  };

  const limpiarVariablesModal = () => {
    setTitulo('');
    setFechaInicio(new Date());
    setFechaFin(new Date());
  }

  return (
    <FondoGradiente>
    
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {listaEventos.map((evento) => (
          <AgendaItemEditable
            key={evento.id}
            evento={evento}
            onPressEdit={abrirModalEditarEvento}
          />
        ))}
      </ScrollView>
      
      <View style={{marginTop: 15}}>
        <BotonTextoLink onPressFunction={() => abrirModalAgregarEvento()} label='CREAR EVENTO' centered/>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <OcultadorTeclado>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <CustomText style={styles.modalTitle}>{tituloModal}</CustomText>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
              />

              <View style={{flexDirection:"row", gap: 10}}>
                <TouchableOpacity onPress={() => setShowInicioPicker(true)} style={styles.dateButton}>
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

                <TouchableOpacity onPress={() => setShowFinPicker(true)} style={styles.dateButton}>
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
              <View style={[{gap: 10}]}>
                <TouchableOpacity onPress={confirmarAgregarEvento}
                  disabled={titulo.trim().length === 0}
                  style={[styles.modalBtn, { backgroundColor: titulo.trim().length > 0 ? azulLogoUndav : "gray" }]}>
                  <CustomText style={styles.modalBtnText}>GUARDAR CAMBIOS</CustomText>
                </TouchableOpacity>
                
                { modoEdicion && (
                    <TouchableOpacity onPress={() => eliminarEventoAbiertoYRedibujar()} style={[styles.modalBtn, { backgroundColor: "#c91800" }]}>
                      <CustomText style={styles.modalBtnText}>ELIMINAR EVENTO</CustomText>
                    </TouchableOpacity>
                  )
                }

                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalBtn, { backgroundColor: "white" }]}>
                  <CustomText style={[styles.modalBtnText,{color: "gray"}]}>SALIR</CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </OcultadorTeclado>
      </Modal>
    
    </FondoGradiente>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    gap: 8
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
    borderBottomColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    fontSize: 16,
    flexWrap: "wrap"
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
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
