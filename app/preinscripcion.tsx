import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';
import { router } from 'expo-router';

export default function Preinscripcion() {
  //router.push(`/webview/${encodeURIComponent("https://undav.edu.ar/index.php?idcateg=5")}?tryLogin=${false}`);
  return (
    <FondoGradiente>
      <ScrollView style={styles.container}>
        <BotonTexto label="Tutorial Preinscripción" openInsideApp url="https://undav.edu.ar/index.php?idcateg=5" />
      </ScrollView>
    </FondoGradiente>
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
