import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomBar from '../components/BottomBar';

export default function HomeEstudiante() {
  return (
    <LinearGradient colors={['#ffffff', '#989797']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* CABECERA CON DATOS Y LOGO */}
        <View style={styles.header}>
          <Image source={require('../assets/images/logo_undav.png')} style={styles.logo} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Deniz Undav</Text>
            <Text style={styles.userLegajo}>Leg: 11978</Text>
          </View>
          <Image source={require('../assets/icons/undav.png')} style={styles.profileIcon} />
        </View>

        {/* AGENDA */}
        <View style={styles.agendaContainer}>
          <Text style={styles.agendaTitle}>AGENDA</Text>
          <View style={styles.agendaItem}>
            <Text style={[styles.agendaLabel, { color: '#0b5085' }]}>Inscripción a materias</Text>
            <Text style={styles.agendaDate}>10 al 14 de Marzo</Text>
          </View>
          <View style={styles.agendaItem}>
            <Text style={styles.agendaLabel}>Desarrollo 1° Cuatrimestre</Text>
            <Text style={styles.agendaDate}>17 de Marzo a 5 de Junio</Text>
          </View>
          <View style={styles.agendaItem}>
            <Text style={[styles.agendaLabel, { color: '#c90000' }]}>Inscripción Finales Mayo</Text>
            <Text style={styles.agendaDate}>21 al 25 de Mayo</Text>
          </View>
          <Text style={styles.verMas}>Ver más</Text>
        </View>

        {/* BOTONES */}
        <View style={styles.buttonsGrid}>
          <TouchableOpacity style={styles.buttonBox}>
            <Image source={require('../assets/icons/undav.png')} style={styles.icon} />
            <Text style={styles.buttonText}>PREGUNTAS{"\n"}FRECUENTES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBox, { backgroundColor: '#04764c' }]}>
            <Image source={require('../assets/icons/undav.png')} style={styles.icon} />
            <Text style={styles.buttonText}>INSCRIPCIONES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBox, { backgroundColor: '#0b254a' }]}>
            <Image source={require('../assets/icons/undav.png')} style={styles.icon} />
            <Text style={styles.buttonText}>CERTIFICADOS{"\n"}Y REPORTES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBox, { backgroundColor: '#28adfd' }]}>
            <Image source={require('../assets/icons/undav.png')} style={styles.icon} />
            <Text style={styles.buttonText}>CONTACTO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonBox, { backgroundColor: '#a56dd0' }]}>
            <Image source={require('../assets/icons/undav.png')} style={styles.icon} />
            <Text style={styles.buttonText}>SEDES</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BARRA INFERIOR */}
      <BottomBar />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 70,
    resizeMode: 'contain',
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  userLegajo: {
    fontSize: 14,
    color: '#444',
    textAlign: 'right',
  },
  profileIcon: {
    width: 40,
    height: 40,
    tintColor: '#0b254a',
  },
  agendaContainer: {
    backgroundColor: '#1c2f4a',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  agendaTitle: {
    color: '#91c9f7',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  agendaItem: {
    backgroundColor: '#ccc',
    padding: 8,
    marginVertical: 5,
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
    marginTop: 8,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 10,
  },
  buttonBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
    tintColor: 'white',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
