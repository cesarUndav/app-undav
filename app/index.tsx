// app/index.tsx

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '@/components/CustomText';
import FondoGradiente from '@/components/FondoGradiente';
import NavigationHeader from '@/components/NavigationHeader';
import { azulClaro } from '@/constants/Colors';
import { useBloquearBotonAtras } from '@/hooks/useBloquearBotonAtras';

export default function HomeScreen() {
  useBloquearBotonAtras();

  const router = useRouter();

  return (
    <View style={styles.root}>
      <NavigationHeader
        title=""
        hideBackButton
        onBackPress={() => router.replace('/')}
      />

      <FondoGradiente style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/icons/undav.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.studentButton]}
            onPress={() => router.push('../loginAutenticado')}
          >
            <CustomText weight="bold" style={styles.buttonText}>
              SOY ESTUDIANTE
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.visitorButton]}
            onPress={() => router.push('../home-visitante')}
          >
            <CustomText weight="bold" style={styles.buttonText}>
              SOY VISITANTE
            </CustomText>
          </TouchableOpacity>
        </View>
      </FondoGradiente>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  buttonsContainer: {
    gap: 10,
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomRightRadius: 12,
    width: 240,
    alignItems: 'center',
  },
  studentButton: {
    backgroundColor: '#1D3557',
  },
  visitorButton: {
    backgroundColor: azulClaro,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});