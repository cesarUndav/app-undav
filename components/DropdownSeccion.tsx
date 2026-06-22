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
import { scaleFont } from '@/utils/scaling';

interface DropdownSeccionProps {
  titulo: string;
  children: ReactNode;
  styleContenido?: StyleProp<ViewStyle>;
  gap?: number;
  colorTexto?: string;
  colorDeFondo?: string;
  inicialmenteAbierto?: boolean;
  fontSize?: number;
}

const DropdownSeccion: React.FC<DropdownSeccionProps> = ({
  titulo,
  children,
  colorTexto = 'white',
  colorDeFondo = azulLogoUndav,
  inicialmenteAbierto = false,
  styleContenido,
  fontSize = scaleFont(14),
  gap = 2,
}) => {
  const [abierto, setAbierto] = useState(inicialmenteAbierto);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setAbierto(!abierto)}
        activeOpacity={0.85}
        style={[
          styles.header,
          {
            backgroundColor: colorDeFondo,
            borderBottomRightRadius: abierto ? 0 : 28,
          },
        ]}
      >
        <CustomText weight="bold" style={[styles.titulo, { color: colorTexto, fontSize: fontSize }]}>
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
  container: {
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 2
  },
  titulo: {
    flex: 1,
    marginRight: 12,
  },
  contenido: {
    overflow: 'hidden',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 28,
  },
});

export default DropdownSeccion;