// app-undav/app/agenda.tsx
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Touchable, TouchableOpacity, registerCallableModule } from 'react-native';

import CustomText from '../components/CustomText';
import { EventoAgenda, listaEventosCalendarioAcademico, listaFuturo, listaPasado} from '../data/agenda';
import { useFocusEffect } from 'expo-router';
import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulClaro, azulLogoUndav,  negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';

const filterBtnColor = azulLogoUndav
export default function Agenda() {

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFeriados, setMostrarFeriados] = useState(true);
  const [mostrarPersonalizados, setMostrarPersonalizados] = useState(true);
  const [mostrarAcademicos, setMostrarAcademicos] = useState(true);


  function puedeMostrarEvento(evento:EventoAgenda):Boolean {
    if (evento.esFeriado) {return mostrarFeriados;}
    else if (evento.id.startsWith("p")) {return mostrarPersonalizados;}
    else {return mostrarAcademicos;}
  }
  function mostrarLista(lista:EventoAgenda[]) {
    if (lista.length > 0) {
      return lista.map((evento) => ( puedeMostrarEvento(evento) &&
        <AgendaItem key={evento.id} evento={evento} />
      ))
    }
    else return <CustomText>No hay</CustomText>
  }

  useFocusEffect( // cada vez que entramos a esta pantalla
    useCallback(() => {
      //setListaEventos(listaEventosCalendarioAcademico);
    }, []) // no hay variable de actualizacion especificada [var]
  );
  
  return (
    <>
    <FondoScrollGradiente>
    {
      mostrarAcademicos || mostrarPersonalizados || mostrarFeriados ? (
      <>
        <CustomText style={styles.title}>PRÓXIMO</CustomText>
        {mostrarLista(listaFuturo)}
        <CustomText style={styles.title}>FINALIZADO</CustomText>
        {mostrarLista(listaPasado)}
      </>
    ):(
      <CustomText style={[styles.title,{}]}>
        No hay ningún tipo de evento seleccionado en los filtros.
      </CustomText>
    )
    }
    </FondoScrollGradiente>

    <View style={styles.floatingBox}>
      {mostrarFiltros ? (
        <View style={styles.filterBtnParent}>
          <TouchableOpacity onPress={() => setMostrarFeriados(!mostrarFeriados)} style={[styles.filterBtn, { backgroundColor: mostrarFeriados ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterBtnText}>Feriados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)} style={[styles.filterBtn, { backgroundColor: mostrarPersonalizados ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterBtnText}>Personalizados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarAcademicos(!mostrarAcademicos)} style={[styles.filterBtn, { backgroundColor: mostrarAcademicos ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterBtnText}>Académicos</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarFiltros(false)} style={styles.closeBtn}>
            <CustomText style={styles.closeBtnText}>×</CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setMostrarFiltros(true)} style={styles.openBtn}>
          <Ionicons name="filter" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center',
    textAlign:"center",
    marginVertical: 0
  },
  agendaBtnContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  filterBtn: {
    flex: 1,
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: filterBtnColor,
    borderRadius: 0,
    borderBottomRightRadius: 0,
    ...getShadowStyle(2)
  },
  filterBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8
  },
  floatingBox: {
    position: 'absolute',
    bottom: 10+56,
    right: 10,
    zIndex: 10, // encima de otras Views
  },
  filterBtnParent: {
    backgroundColor: "#fff",
    padding: 8,
    gap:4,
    borderBottomRightRadius: 16,

    ...getShadowStyle(4)
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
    backgroundColor: "lightgray", //lightgray
    borderBottomRightRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c91800', // #333
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
});
