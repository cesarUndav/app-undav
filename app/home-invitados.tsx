// app/home-invitados.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '../components/CustomText';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeInvitados() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Bienvenido a la UNDAV</CustomText>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/oferta-academica')}>
          <Ionicons name="school-outline" size={32} color="#2E86AB" />
          <CustomText style={styles.cardText}>Oferta Académica</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/sedes')}>
          <MaterialCommunityIcons name="office-building-marker-outline" size={32} color="#2E86AB" />
          <CustomText style={styles.cardText}>Sedes</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/preguntas-frecuentes')}>
          <Ionicons name="help-circle-outline" size={32} color="#2E86AB" />
          <CustomText style={styles.cardText}>Preguntas Frecuentes</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/contacto')}>
          <FontAwesome5 name="envelope" size={28} color="#2E86AB" />
          <CustomText style={styles.cardText}>Contacto</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2E86AB',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: '45%',
    height: 120,
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
