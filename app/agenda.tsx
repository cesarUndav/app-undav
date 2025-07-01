// app-undav/app/agenda.tsx
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from '../components/CustomText';
import { EventoAgenda, listaFuturo, listaPasado} from '../data/agenda';
import { useFocusEffect } from 'expo-router';
import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { azulClaro, azulLogoUndav,  negroAzulado } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { bottomBarStyles } from '@/components/BottomBar';

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
    const listaFiltrada = lista.filter(puedeMostrarEvento);

    if (listaFiltrada.length > 0) return lista.map((evento) => ( puedeMostrarEvento(evento) &&
      <AgendaItem key={evento.id} evento={evento} />
    ))
    else return <CustomText style={styles.title}>No hay eventos de este tipo</CustomText>
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
        
        {<CustomText style={styles.title}>FINALIZADO</CustomText>}
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
      {mostrarFiltros && 
        <View style={styles.filterOptionsParent}>
          <TouchableOpacity onPress={() => setMostrarFeriados(!mostrarFeriados)} style={[styles.filterOption, { backgroundColor: mostrarFeriados ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterOptionText}>Feriados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarPersonalizados(!mostrarPersonalizados)} style={[styles.filterOption, { backgroundColor: mostrarPersonalizados ? filterBtnColor : "gray" }]}>
            <CustomText style={styles.filterOptionText}>Personalizados</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarAcademicos(!mostrarAcademicos)} style={[styles.filterOption, { backgroundColor: mostrarAcademicos ? filterBtnColor : "gray" }, {borderBottomRightRadius: 10}]}>
            <CustomText style={styles.filterOptionText}>Académicos</CustomText>
          </TouchableOpacity>
        </View>
      }

      <TouchableOpacity onPress={() => setMostrarFiltros(!mostrarFiltros)} style={mostrarFiltros ? styles.closeBtn : styles.openBtn}>
        {mostrarFiltros ? (<CustomText style={styles.closeBtnText}>x</CustomText>) 
        : (<Ionicons name={"filter"} size={28} color="#fff" />)
        }
      </TouchableOpacity>
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
