

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Turismo() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Turismo</Text>
      <Text>Descripción específica de la carrera de Turismo</Text>
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
