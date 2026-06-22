import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { azulLogoUndav, azulMedioUndav, azulClaro } from '@/constants/Colors';
import { scaleFont } from '@/utils/scaling';

interface BotoneraFlotanteProps {
  bottomOffset: number;
  mostrarFiltros: boolean;
  setMostrarFiltros: (visible: boolean) => void;
  mostrarFeriados: boolean;
  setMostrarFeriados: (active: boolean) => void;
  mostrarPersonalizados: boolean;
  setMostrarPersonalizados: (active: boolean) => void;
  mostrarAcademicos: boolean;
  setMostrarAcademicos: (active: boolean) => void;
  onAgregarPress: () => void;
  onToggleVistaPress: () => void;
  iconToggleVista: "calendar" | "list"; // Permite cambiar el icono dinámicamente
}

export default function BotoneraFlotante({
  bottomOffset,
  mostrarFiltros,
  setMostrarFiltros,
  mostrarFeriados,
  setMostrarFeriados,
  mostrarPersonalizados,
  setMostrarPersonalizados,
  mostrarAcademicos,
  setMostrarAcademicos,
  onAgregarPress,
  onToggleVistaPress,
  iconToggleVista,
}: BotoneraFlotanteProps) {
  return (
    <View style={[stylesFlotante.floatingBox, { bottom: bottomOffset }]}>
      {/* MENÚ DE FILTROS */}
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

      {/* COLUMNA DE ACCIONES */}
      <View style={stylesFlotante.botonesColumna}>
        {/* Botón Añadir */}
        <TouchableOpacity onPress={onAgregarPress} style={[stylesFlotante.openBtn, stylesFlotante.addButton]}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Botón Filtros */}
        <TouchableOpacity 
          onPress={() => setMostrarFiltros(!mostrarFiltros)} 
          style={[stylesFlotante.openBtn, mostrarFiltros ? { backgroundColor: '#e74c3c' } : null]}
        >
          <Ionicons name={mostrarFiltros ? "close" : "filter"} size={26} color="#fff" />
        </TouchableOpacity>

        {/* Botón Conmutador / Navegador */}
        <TouchableOpacity 
          onPress={onToggleVistaPress} 
          style={[stylesFlotante.openBtn, { backgroundColor: azulLogoUndav }]}
        >
          <Ionicons name={iconToggleVista} size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylesFlotante = StyleSheet.create({
  floatingBox: { position: 'absolute', right: 16, zIndex: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' },
  botonesColumna: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  filterOptionsParent: { backgroundColor: '#ffffff', borderRadius: 20, padding: 8, marginRight: 12, width: 200, gap: 6, ...getShadowStyle(6) },
  filterHeader: { fontSize: scaleFont(10), color: '#8e8e93', letterSpacing: 1, marginBottom: 6, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#f2f2f7', paddingBottom: 6 },
  filterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, width: '100%' },
  optionActive: { backgroundColor: azulMedioUndav },
  optionInactive: { backgroundColor: '#f2f2f7' },
  filterOptionText: { fontSize: scaleFont(13), marginLeft: 10, flex: 1 },
  openBtn: { backgroundColor: azulClaro, borderRadius: 30, width: 56, height: 56, justifyContent: 'center', alignItems: 'center', ...getShadowStyle(4) },
  addButton: { backgroundColor: 'green' },
});