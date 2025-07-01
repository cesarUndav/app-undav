import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity, SafeAreaView } from 'react-native';

import CustomText from '../components/CustomText';
import FondoGradiente from '@/components/FondoGradiente';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { getShadowStyle } from '@/constants/ShadowStyle';

export default function Contacto() {
  const abrirEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const llamar = (telefono: string) => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <FondoScrollGradiente>
      <View style={styles.bloque}>
        <CustomText style={styles.subtitulo}>Secretaría Académica</CustomText>
        <TouchableOpacity onPress={() => abrirEmail('academica@undav.edu.ar')}>
          <CustomText style={styles.link}>academica@undav.edu.ar</CustomText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => llamar('01142019999')}>
          <CustomText style={styles.link}>Tel: (011) 4201-9999</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.bloque}>
        <CustomText style={styles.subtitulo}>Soporte Técnico</CustomText>
        <TouchableOpacity onPress={() => abrirEmail('soporte@undav.edu.ar')}>
          <CustomText style={styles.link}>soporte@undav.edu.ar</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.bloque}>
        <CustomText style={styles.subtitulo}>Dirección</CustomText>
        <CustomText style={styles.direccion}>
          España 350, Avellaneda, Buenos Aires, Argentina
        </CustomText>
      </View>
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({

  bloque: {
    //backgroundColor: '#e3f0fb',
    backgroundColor: '#fff',
    borderBottomRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...getShadowStyle(6)
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0b5085',
  },
  link: {
    fontSize: 15,
    color: '#0068b3',
    marginBottom: 5,
  },
  direccion: {
    fontSize: 15,
    color: '#333',
  },
});
