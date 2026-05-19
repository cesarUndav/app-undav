// components/BotonIconoTexto.tsx

import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import CustomText from './CustomText';
import { azulClaro, grisBorde, grisTexto } from '@/constants/Colors';

type BotonIconoTextoProps = {
  label: string;
  Icon: React.ComponentType<{ width: number; height: number; fill: string }>;
  funcionOnPress: () => void;
  iconSize?: number;
  iconColor?: string;
  iconTextColor?: string;
  backgroundColor?: string;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function BotonIconoTexto({
  label,
  funcionOnPress,
  Icon,
  iconSize = 55,
  iconColor = azulClaro,
  iconTextColor = grisTexto,
  backgroundColor = '#fff',
  styleExtra,
}: BotonIconoTextoProps) {
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={'Ir a ' + label}
      style={[styles.buttonBox, { backgroundColor }, styleExtra]}
      onPress={funcionOnPress}
    >
      <View style={styles.buttonBoxIconParent}>
        <View style={styles.buttonOutline}>
          <Icon width={iconSize} height={iconSize} fill={iconColor} />
        </View>
      </View>

      <View style={styles.buttonBoxTextParent}>
        <CustomText
          weight="bold"
          style={[styles.buttonText, { color: iconTextColor }]}
        >
          {label}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBoxIconParent: {
    height: '72%',
    justifyContent: 'flex-end',
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: grisBorde,
    padding: 6,
    marginBottom: 4,
  },
  buttonBoxTextParent: {
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 11,
  },
});