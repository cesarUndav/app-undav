// app-undav/app/agenda.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../components/CustomText';
import BottomBar from '../components/BottomBar';
import { listaPasado, listaFuturo, eventoAgendaToFechaString, eventoAgendaProximidadColor} from '../data/agenda';

export default function Agenda() {
  return (
    <LinearGradient colors={['#ffffff', '#989797']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <CustomText style={styles.title}>PRÓXIMO</CustomText>
          {listaFuturo.map((evento) => (
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
      </SafeAreaView>
    </LinearGradient>
  );
}

export const eventoAgendaStyles = StyleSheet.create({
  agendaItem: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 8,
    borderBottomRightRadius: 16
  },
  eventTitle: {
    fontSize: 17, 
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b254a',
    alignSelf: 'center',
    marginVertical: 12
  }
});
