// app/carreras/ciencias-ambientales.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CienciasAmbientales() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ciencias Ambientales</Text>
      <Text>Descripción específica de la carrera de Ciencias Ambientales</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
