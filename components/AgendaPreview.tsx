// components/AgendaPreview.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { agendaMock } from '../data/agenda';

export default function AgendaPreview() {
  const router = useRouter();

  // Tomamos los primeros 3 eventos del mock
  const primerosEventos = agendaMock.slice(0, 3);

  return (
    <View style={styles.agendaContainer}>
      <CustomText style ={styles.agendaTitle}>AGENDA</CustomText>

      {primerosEventos.map((evento) => (
        <View key={evento.id} style={styles.agendaItem}>
          <CustomText
            style ={[
              styles.agendaLabel,
              { color: evento.color || 'black' },
            ]}
          >
            {evento.titulo}
          </CustomText>
          <CustomText style={styles.agendaDate}>{evento.fecha}</CustomText>
        </View>
      ))}

      <TouchableOpacity onPress={() => router.push('/agenda')}>
        <CustomText style={styles.verMas}>VER MÁS EVENTOS</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  agendaContainer: {
    backgroundColor: '#1c2f4a',
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 0,
    borderBottomRightRadius: 24,
  },
  agendaTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 5
  },
  agendaItem: {
    backgroundColor: '#ccc',
    padding: 8,
    marginVertical: 5,
    borderBottomRightRadius: 12
  },
  agendaLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  agendaDate: {
    fontSize: 15,
    fontWeight: '600',
  },
  verMas: {
    color: '#00d3ff',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 6,
    textDecorationLine: 'none',
  },
});
