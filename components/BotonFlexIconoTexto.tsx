import React from 'react';
import { TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { StyleSheet } from 'react-native';


type BotonIconoTextoProps = {
  label: string;
  Icon: React.ComponentType<{ width: number; height: number; fill: string }>;
  funcionOnPress: () => void;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
};

export default function BotonIconoTexto({
  label,
  funcionOnPress,
  Icon,
  iconSize = 40,
  iconColor = 'white',
  backgroundColor = "#005BA4"
}: BotonIconoTextoProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={"Ir a " + label}
      style={[styles.buttonBox,{backgroundColor: backgroundColor}]}
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
    borderBottomRightRadius: 20,
    backgroundColor:"#005BA4"
  },
    buttonBoxIconParent: {
    height: "60%",
    justifyContent: "flex-end"
  },
  buttonBoxTextParent: {
    flex: 1
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 12
  }
});