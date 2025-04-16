// app-undav/app/agenda.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../components/CustomText';
import BottomBar from '../components/BottomBar';
import { agendaMock } from '../data/agenda';

export default function Agenda() {
  return (
    <LinearGradient colors={['#ffffff', '#989797']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <CustomText style={styles.title}>AGENDA COMPLETA</CustomText>

          {agendaMock.map((evento) => (
            <View key={evento.id} style={styles.eventItem}>
              <CustomText style={[styles.eventTitle, { color: evento.color || '#000' }]}>
                {evento.titulo}
              </CustomText>
              <CustomText style={styles.eventDate}>{evento.fecha}</CustomText>
            </View>
          ))}
        </ScrollView>
        <BottomBar />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b254a',
    alignSelf: 'center',
    marginBottom: 20,
  },
  eventItem: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    marginBottom: 10,
    borderBottomRightRadius: 10,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
});
