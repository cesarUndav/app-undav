// components/AgendaPreview.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { listaFuturo, eventoAgendaProximidadColor, eventoAgendaToFechaString } from '../data/agenda';
import { eventoAgendaStyles } from '@/app/agenda';

export default function AgendaPreview() {
  const router = useRouter();

  //const primerosEventos = listaFuturo.slice(0, 3); // los primeros N elementos
  const primerosEventos = listaFuturo;

  return (
    <View style={styles.agendaContainer}>
      <CustomText style ={styles.agendaTitle}>AGENDA</CustomText>
      
      <ScrollView contentContainerStyle={styles.listaScrollContainer}>
        {primerosEventos.map((evento) => (
          <View key={evento.id} style={eventoAgendaStyles.agendaItem}>
            <CustomText style={[eventoAgendaStyles.eventTitle, {color: '#000'} ]}> 
                  {evento.titulo}
                </CustomText>
                <CustomText style={[eventoAgendaStyles.eventDate, {color: eventoAgendaProximidadColor(evento)} ]}>{eventoAgendaToFechaString(evento)}</CustomText>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => router.push('/agenda')}>
        <CustomText style={styles.verMasBtn}>VER MÁS</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listaScrollContainer: {
    padding: 0
  },
  agendaContainer: {
    // height: "calc(60vh - 120px)"
    flex: 1,
    backgroundColor: '#1c2f4a',
    paddingHorizontal: 10,
    paddingVertical: 10,

    marginHorizontal: 10,
    marginVertical: 0,
    borderBottomRightRadius: 24,
  },
  agendaTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 5
  },
  verMasBtn: {
    backgroundColor: "#005BA4",
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 0,
    borderBottomRightRadius: 12,
    alignItems: "center",
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: -2,
    textDecorationLine: 'none',
  }
});
