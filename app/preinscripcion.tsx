import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import BotonTextoLink from '@/components/BotonTextoLink';
import FondoGradiente from '@/components/FondoGradiente';

export default function Preinscripcion() {  
  return (
    <FondoGradiente>
      <ScrollView style={styles.container}>
        <BotonTextoLink label="Tutorial Preinscripción" url="https://undav.edu.ar/index.php?idcateg=5" />
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
