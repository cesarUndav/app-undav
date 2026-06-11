// components/ModalEvento.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomText from './CustomText';
import OcultadorTeclado from './OcultadorTeclado';
import { azulLogoUndav, grisBorde, negroAzulado } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { 
  agregarEventoPersonalizado, 
  editarEventoPersonalizado, 
  quitarEventoPersonalizado, 
  EventoAgenda 
} from '../data/agenda';

interface ModalEventoProps {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  eventoAEditar?: EventoAgenda | null; // Si viene, se activa el modo edición
  fechaPorDefecto?: Date;               // Usado para heredar el día seleccionado del calendario
}

export default function ModalEvento({ visible, onClose, onRefresh, eventoAEditar, fechaPorDefecto }: ModalEventoProps) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
  const [fechaFin, setFechaFin] = useState<Date>(new Date());
  const [rangoHabilitado, setRangoHabilitado] = useState(false);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);

  const modoEdicion = !!eventoAEditar;

  // Sincronizar estados al abrir/cambiar el modal
  useEffect(() => {
    if (visible) {
      if (eventoAEditar) {
        setTitulo(eventoAEditar.titulo);
        setDescripcion(eventoAEditar.descripcion || '');
        setFechaInicio(eventoAEditar.fechaInicio);
        setFechaFin(eventoAEditar.fechaFin);
        const esRango = eventoAEditar.fechaInicio.toDateString() !== eventoAEditar.fechaFin.toDateString();
        setRangoHabilitado(esRango);
      } else {
        setTitulo('');
        setDescripcion('');
        const baseFecha = fechaPorDefecto ? new Date(fechaPorDefecto) : new Date();
        setFechaInicio(baseFecha);
        setFechaFin(baseFecha);
        setRangoHabilitado(false);
      }
    }
  }, [visible, eventoAEditar, fechaPorDefecto]);

  const guardarCambios = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicioValidar = new Date(fechaInicio);
    inicioValidar.setHours(0, 0, 0, 0);

    // Guardrail solo si es un evento nuevo (permitimos editar eventos viejos)
    if (!modoEdicion && inicioValidar < hoy) {
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

    if (modoEdicion && eventoAEditar) {
      editarEventoPersonalizado(eventoAEditar.id, t, d, fi, ff);
    } else {
      agregarEventoPersonalizado(t, d, fi, ff);
    }

    onRefresh();
    onClose();
  };

  const eliminarEvento = () => {
    if (!eventoAEditar) return;
    Alert.alert('¿Eliminar Evento?', 'Esta acción no se puede deshacer', [
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          quitarEventoPersonalizado(eventoAEditar.id);
          onRefresh();
          onClose();
        },
      },
      { text: 'No', style: 'cancel' },
    ]);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <OcultadorTeclado>
        <View style={stylesP.modalOverlay}>
          <View style={stylesP.modalContainer}>
            <CustomText weight="bold" style={stylesP.modalTitle}>
              {modoEdicion ? 'Editar Evento' : 'Crear Evento'}
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
              <TouchableOpacity onPress={() => setShowInicioPicker(true)} style={stylesP.dateButton}>
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
                  <TouchableOpacity onPress={() => setShowFinPicker(true)} style={stylesP.dateButton}>
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
              onPress={guardarCambios}
              disabled={titulo.trim().length === 0}
              style={[
                stylesP.modalBtn,
                { backgroundColor: titulo.trim().length > 0 ? azulLogoUndav : 'gray' },
              ]}
            >
              <CustomText weight="bold" style={stylesP.modalBtnText}>
                GUARDAR CAMBIOS
              </CustomText>
            </TouchableOpacity>

            {modoEdicion && (
              <TouchableOpacity onPress={eliminarEvento} style={[stylesP.modalBtn, stylesP.deleteButton]}>
                <CustomText weight="bold" style={stylesP.modalBtnText}>
                  ELIMINAR EVENTO
                </CustomText>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onClose} style={[stylesP.modalBtn, stylesP.cancelButton]}>
              <CustomText weight="bold" style={[stylesP.modalBtnText, stylesP.cancelButtonText]}>
                SALIR SIN GUARDAR
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </OcultadorTeclado>
    </Modal>
  );
}

const stylesP = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 15 },
  modalContainer: { backgroundColor: '#fff', borderBottomRightRadius: 24, padding: 15, gap: 8 },
  modalTitle: { alignSelf: 'center', fontSize: 18, marginBottom: 10, color: '#000' },
  input: { borderBottomWidth: 1, borderBottomColor: grisBorde, padding: 6, fontSize: 16, flexWrap: 'wrap', fontFamily: 'Montserrat_400Regular' },
  switchContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, marginTop: 6, gap: 8 },
  switchText: { fontSize: 14, color: '#555' },
  dateRow: { flexDirection: 'row', gap: 8, marginVertical: 4 },
  dateButton: { padding: 12, backgroundColor: '#f2f2f7', borderRadius: 10, flex: 1, alignItems: 'center', borderWidth: 1, borderColor: '#e5e5ea' },
  dateButtonText: { fontSize: 14, color: negroAzulado },
  modalBtn: { backgroundColor: 'gray', alignItems: 'center', borderBottomRightRadius: 16, ...getShadowStyle(2) },
  modalBtnText: { color: '#fff', fontSize: 15, paddingVertical: 12 },
  deleteButton: { backgroundColor: '#c91800' },
  cancelButton: { backgroundColor: 'white' },
  cancelButtonText: { color: 'gray' },
});