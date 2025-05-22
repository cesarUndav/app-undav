// app-undav/app/agenda.tsx
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';
import BottomBar from '../components/BottomBar';
import { listaPasado, listaFuturo, eventoAgendaToFechaString, eventoAgendaProximidadColor, EventoAgenda, listaCompleta} from '../data/agenda';
import { useFocusEffect } from 'expo-router';

export default function Agenda() {
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);

  useFocusEffect(
    // This runs every time the screen is focused (entered)
    useCallback(() => {
      setListaEventos(listaCompleta);
    }, [])
  );
  
  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <CustomText style={styles.title}>PRÓXIMO</CustomText>
          {listaEventos.map((evento) => (
            <View key={evento.id} style={eventoAgendaStyles.agendaItem}>
              <CustomText style={[eventoAgendaStyles.eventTitle, {color: '#000'} ]}> 
                {evento.titulo}
              </CustomText>
              <CustomText style={[eventoAgendaStyles.eventDate, {color: eventoAgendaProximidadColor(evento)} ]}>{eventoAgendaToFechaString(evento)}</CustomText>
            </View>
          ))}

          <CustomText style={styles.title}>FINALIZADO</CustomText>
          {listaPasado.map((evento) => (
            <View key={evento.id} style={eventoAgendaStyles.agendaItem}>
              <CustomText style={[eventoAgendaStyles.eventTitle, {color: '#000'} ]}>
                {evento.titulo}
              </CustomText>
              <CustomText style={[eventoAgendaStyles.eventDate, {color: eventoAgendaProximidadColor(evento)} ]}>{eventoAgendaToFechaString(evento)}</CustomText>
            </View>
          ))}

        </ScrollView>
        <BottomBar />
    </LinearGradient>
  );
}

export const eventoAgendaStyles = StyleSheet.create({
  agendaItem: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomRightRadius: 16,
    elevation: 4 // verificar esto
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b254a',
    alignSelf: 'center',
    marginVertical: 0
  }
});
