import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';
import BottomBar from '../components/BottomBar';

export default function CmabiarNombre() {  
  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={{flex: 1}}>
      <View style={styles.container}>

      </View>
      <BottomBar />
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
