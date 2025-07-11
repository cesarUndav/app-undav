import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { StyleSheet } from 'react-native';
import { azulClaro } from '@/constants/Colors';


type BotonIconoTextoProps = {
  label: string;
  Icon: React.ComponentType<{ width: number; height: number; fill: string }>;
  funcionOnPress: () => void;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function BotonIconoTexto({
  label,
  funcionOnPress,
  Icon,
  iconSize = 40,
  iconColor = 'white',
  backgroundColor = azulClaro,
  styleExtra,
}: BotonIconoTextoProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={"Ir a " + label}
      style={[styles.buttonBox,{backgroundColor: backgroundColor}, styleExtra]}
      onPress={funcionOnPress}
    >
      <View style={styles.buttonBoxIconParent}>
        <Icon width={iconSize} height={iconSize} fill={iconColor} />
      </View>
      <View style={styles.buttonBoxTextParent}>
        <CustomText style={[styles.buttonText, {color: iconColor}]}>{label}</CustomText>
      </View>
    </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
    buttonBox: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    //borderBottomRightRadius: 20,
    //borderRadius: "15%",
    backgroundColor:azulClaro
  },
    buttonBoxIconParent: {
    height: "64%",
    justifyContent: "flex-end"
  },
  buttonBoxTextParent: {
    flex: 1
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 11
  }
});