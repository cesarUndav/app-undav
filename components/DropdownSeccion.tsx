// components/DropdownSeccion.tsx

import React, { ReactNode, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import CustomText from './CustomText';
import { Ionicons } from '@expo/vector-icons';
import { azulLogoUndav } from '@/constants/Colors';

interface DropdownSeccionProps {
  titulo: string;
  children: ReactNode;
  styleContenido?: StyleProp<ViewStyle>;
  gap?: number;
  colorTexto?: string;
  colorDeFondo?: string;
  inicialmenteAbierto?: boolean;
}

const DropdownSeccion: React.FC<DropdownSeccionProps> = ({
  titulo,
  children,
  colorTexto = 'white',
  colorDeFondo = azulLogoUndav,
  inicialmenteAbierto = true,
  styleContenido,
  gap = 2,
}) => {
  const [abierto, setAbierto] = useState(inicialmenteAbierto);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setAbierto(!abierto)}
        style={[
          styles.header,
          {
            backgroundColor: colorDeFondo,
            borderBottomEndRadius: abierto ? 0 : 20,
          },
        ]}
      >
        <CustomText weight="bold" style={[styles.titulo, { color: colorTexto }]}>
          {titulo}
        </CustomText>

        <Ionicons
          name={abierto ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colorTexto}
        />
      </TouchableOpacity>

      {abierto && (
        <View style={[styles.contenido, { gap }, styleContenido]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 0,
    borderBottomEndRadius: 20,
  },
  titulo: {
    fontSize: 16,
  },
  contenido: {
    gap: 2,
  },
});

export default DropdownSeccion;