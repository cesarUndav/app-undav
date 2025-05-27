import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BotonTextoLink from '@/components/BotonTextoLink';

export default function Preinscripcion() {  
  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <BotonTextoLink label="Tutorial Preinscripción" url="https://undav.edu.ar/index.php?idcateg=5" />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 8
  }
});
