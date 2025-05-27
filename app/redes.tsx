import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BotonTextoLink from '../components/BotonTextoLink';

const verticalPadding = 20;
const fontSize = 16;
export default function Contacto() {
  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BotonTextoLink label="Web UNDAV" url="https://undav.edu.ar/index.php" color="#173c68" verticalPadding={verticalPadding} fontSize={fontSize}/>
        <BotonTextoLink label="Youtube" url="https://www.youtube.com/@UNDAVOficial/featured" color="#c4302b" verticalPadding={verticalPadding} fontSize={fontSize}/>
        <BotonTextoLink label="Instagram" url="https://www.instagram.com/undav_oficial/?hl=es" color="#C13584" verticalPadding={verticalPadding} fontSize={fontSize}/>
        <BotonTextoLink label="Facebook" url="https://www.facebook.com/UNDAV2011" color="#3b5998" verticalPadding={verticalPadding} fontSize={fontSize}/>
        <BotonTextoLink label="X / Twitter" url="https://x.com/UNDAVOFICIAL" color="#000" verticalPadding={verticalPadding} fontSize={fontSize}/>
        <BotonTextoLink label="LinkedIn" url="https://www.linkedin.com/school/universidad-nacional-de-avellaneda-undav-/" color="#0e76a8" verticalPadding={verticalPadding} fontSize={fontSize}/>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 15,
    gap: 10,
  },
});
