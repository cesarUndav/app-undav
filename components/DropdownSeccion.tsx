// components/DropdownSeccion.tsx

import React, { ReactNode, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import CustomText from './CustomText';
import { Ionicons } from '@expo/vector-icons';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';

interface DropdownSeccionProps {
  titulo: string;
  children: ReactNode;
  styleContenido?: StyleProp<ViewStyle>;
  colorTexto?: string;
  colorFondo?: string;
  inicialmenteAbierto?: boolean;
}

const DropdownSeccion: React.FC<DropdownSeccionProps> = ({
  titulo,
  children,
  colorTexto = "#fff",
  colorFondo = azulLogoUndav,
  inicialmenteAbierto = true,
  styleContenido,
}) => {
  const [abierto, setAbierto] = useState(inicialmenteAbierto);

  return (
    <>
      <TouchableOpacity
        onPress={() => setAbierto(!abierto)}
        style={[styles.header, { backgroundColor: colorFondo }]}
      >
        <CustomText style={[styles.titulo, { color: colorTexto }]}>{titulo}</CustomText>
        <Ionicons
          name={abierto ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colorTexto}
        />
      </TouchableOpacity>
      {abierto && <View style={styleContenido}>{children}</View>}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomEndRadius: 20,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default DropdownSeccion;
