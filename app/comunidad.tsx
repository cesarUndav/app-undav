import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Comunidad() {  
  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={{flex: 1}}>
      <View style={styles.container}>

      </View>
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
