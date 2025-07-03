import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import CustomText from './CustomText';
import { EventoAgenda, eventoAgendaProximidadColor, listaCompleta, listaFuturo, listaPasado } from '../data/agenda';
import AgendaItem from './AgendaItem';
import { azulLogoUndav, celesteSIU } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

export default function AgendaPreview() {
  const router = useRouter();

  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);

  useFocusEffect(
    useCallback(() => {
      setListaEventos(listaFuturo());
    }, [])
  );

  return (
    <View style={styles.agendaContainer}>

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => router.push('/agenda')}
          style={{ paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between" }}
        >
          <CustomText style={styles.agendaBtnText}>AGENDA ACADÉMICA</CustomText>
          <CustomText style={[styles.agendaBtnText, { color: celesteSIU }]}>+ DETALLES</CustomText>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.listaScrollContainer}>
          {listaEventos.map((evento) => (
            !evento.id.startsWith("p") && !evento.esFeriado && (
              <AgendaItem key={evento.id} evento={evento} />
            )
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: .85 }}>
        <TouchableOpacity
          onPress={() => router.push('/eventos-personalizados')}
          style={{ paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between" }}
        >
          <CustomText style={styles.agendaBtnText}>AGENDA PERSONAL</CustomText>
          <CustomText style={[styles.agendaBtnText, { color: celesteSIU }]}>+ DETALLES</CustomText>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.listaScrollContainer}>
          {listaCompleta().map((evento) => (
            evento.id.startsWith("p") && (
              <AgendaItem key={evento.id} evento={evento} />
            )
          ))}
        </ScrollView>
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
    flex: 1,
    backgroundColor: azulLogoUndav,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginVertical: 0,
    borderBottomRightRadius: 24,
    ...getShadowStyle(4)
  },
  agendaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 8
  }
});
