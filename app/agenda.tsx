// app-undav/app/agenda.tsx
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Touchable, TouchableOpacity, registerCallableModule } from 'react-native';

import CustomText from '../components/CustomText';
import { listaPasado, EventoAgenda, listaCompleta} from '../data/agenda';
import { useFocusEffect } from 'expo-router';
import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulLogoUndav, azulMedioUndav, negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';


export default function Agenda() {
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);
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
    return lista.map((evento) => ( puedeMostrarEvento(evento) &&
      <AgendaItem key={evento.id} evento={evento} />
    ))
  }

  useFocusEffect( // cada vez que entramos a esta pantalla
    useCallback(() => {
      setListaEventos(listaCompleta);
    }, []) // no hay variable de actualizacion especificada [var]
  );
  
  return (
    <>
    <FondoScrollGradiente>
      <CustomText style={styles.title}>PRÓXIMO</CustomText>
      {mostrarLista(listaEventos)}
      <CustomText style={styles.title}>FINALIZADO</CustomText>
      {mostrarLista(listaPasado)}
    </FondoScrollGradiente>

    <View style={styles.floatingBox}>
      {mostrarFiltros ? (
        <View style={styles.filterBtnParent}>
          <TouchableOpacity onPress={() => setMostrarFeriados(!mostrarFeriados)} style={[styles.agendaBtn, { backgroundColor: mostrarFeriados ? azulLogoUndav : "gray" }]}>
            <CustomText style={styles.agendaBtnText}>Feriados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)} style={[styles.agendaBtn, { backgroundColor: mostrarPersonalizados ? azulLogoUndav : "gray" }]}>
            <CustomText style={styles.agendaBtnText}>Personalizados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarAcademicos(!mostrarAcademicos)} style={[styles.agendaBtn, { backgroundColor: mostrarAcademicos ? azulLogoUndav : "gray" }]}>
            <CustomText style={styles.agendaBtnText}>Académicos</CustomText>
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
    marginVertical: 0
  },
  agendaBtnContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  agendaBtn: {
    flex: 1,
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: azulLogoUndav,
    borderRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 2, // Android sombra
    shadowColor: '#000' // IOS sombra
  },
  agendaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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
    backgroundColor: 'white',
    padding: 8,
    gap:4,
    borderBottomRightRadius: 16,

    elevation: 4, // Android sombra
    shadowColor: '#000', // iOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  openBtn: {
    backgroundColor: azulLogoUndav,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  openBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: "#c91800", //lightgray
    borderBottomRightRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // #333
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
