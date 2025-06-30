import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import CustomText from './CustomText';
import { EventoAgenda, listaFuturo } from '../data/agenda';
import AgendaItem from './AgendaItem';
import { azulClaro, azulLogoUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';


export default function AgendaPreview() {
  const router = useRouter();
  //const primerosEventos = listaFuturo.slice(0, 3); // los primeros N elementos
  //const primerosEventos = listaFuturo; 
  
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);

  useFocusEffect(
    // This runs every time the screen is focused (entered)
    useCallback(() => {
      setListaEventos(listaFuturo);
    }, [])
  );

  return (
    <View style={styles.agendaContainer}>
      <CustomText style ={styles.agendaTitle}>AGENDA</CustomText>
      
        {/* <TouchableWithoutFeedback onPress={() => router.push('/agenda')}> */}
          <ScrollView contentContainerStyle={styles.listaScrollContainer}>
          {listaEventos.map((evento) => (
            <AgendaItem key={evento.id} evento={evento} />
          ))}
          </ScrollView>
        {/* </TouchableWithoutFeedback> */}

      <View style={styles.agendaBtnContainer}>
      
      {/*Boton invisible, para que el flex quede bien*/}
       
      <TouchableOpacity onPress={() => router.push('/agenda')} style={[styles.agendaBtn, {flex: 3.3}]}>
        <CustomText style={styles.agendaBtnText}>DETALLES</CustomText>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/agenda-eventos-personalizados')}style={[styles.agendaBtn, {backgroundColor: "green"}]}>
        <CustomText style={styles.agendaBtnText}>+</CustomText>
      </TouchableOpacity>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listaScrollContainer: {
    gap: 6,
    paddingTop: -4
  },
  agendaContainer: {
    // height: "calc(60vh - 120px)"
    flex: 1,
    backgroundColor: azulLogoUndav,
    paddingHorizontal: 10,
    paddingTop: 10,

    marginVertical: 0,
    borderBottomRightRadius: 24,
    ...getShadowStyle(4)
  },
  agendaTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 8
  },
  agendaBtnContainer: {
    paddingVertical: 10,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  agendaBtn: {
    flex: 1,
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: azulClaro,
    borderRadius: 0,
    borderBottomRightRadius: 16,
    ...getShadowStyle( 2)
  },
  agendaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 8
  }
});
