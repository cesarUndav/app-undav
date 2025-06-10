import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { negroAzulado } from '@/constants/Colors';

type LoadingWrapperProps = {
  loading: boolean;
  customText?: string;
  children: React.ReactNode;
};

export default function LoadingWrapper({ loading, customText, children }: LoadingWrapperProps) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <CustomText style={styles.loadingText}>{customText? customText:"Cargando..."}</CustomText>
      </View>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
  },
});
