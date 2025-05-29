// app-undav/app/agenda.tsx
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import { listaPasado, listaFuturo, eventoAgendaToFechaString, eventoAgendaProximidadColor, EventoAgenda, listaCompleta} from '../data/agenda';
import { useFocusEffect } from 'expo-router';
import AgendaItem from '@/components/AgendaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

export default function Agenda() {
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);

  useFocusEffect(
    // This runs every time the screen is focused (entered)
    useCallback(() => {
      setListaEventos(listaCompleta);
    }, [])
  );
  
  return (
    <FondoScrollGradiente>
      <CustomText style={styles.title}>PRÓXIMO</CustomText>
      {listaEventos.map((evento) => (
        <AgendaItem key={evento.id} evento={evento} />
      ))}

      <CustomText style={styles.title}>FINALIZADO</CustomText>
      {listaPasado.map((evento) => (
        <AgendaItem key={evento.id} evento={evento} />
      ))}
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b254a',
    alignSelf: 'center',
    marginVertical: 0
  }
});
