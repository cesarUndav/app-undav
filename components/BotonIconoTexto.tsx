import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { StyleSheet } from 'react-native';
import { azulClaro, grisBorde, grisTexto } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';


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
  backgroundColor = "#fff",
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
        <View style={styles.buttonOutline}>
          <Icon width={iconSize} height={iconSize} fill={iconColor} />
        </View>
      </View>

      <View style={styles.buttonBoxTextParent}>
        <CustomText style={[styles.buttonText, {color: iconTextColor}]}>{label}</CustomText>
      </View>

    </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
    buttonBox: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
  },
    buttonBoxIconParent: {
    height: "72%",
    justifyContent: "flex-end",
  },
  buttonOutline: {
    backgroundColor: "#fff",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: grisBorde,
    //...getShadowStyle(2),
    padding: 6,
    marginBottom: 4,

    // alignItems: "center",
    // alignContent: "center",
    // justifyContent: 'center'
  },
  buttonBoxTextParent: {
    flex: 1
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 11
  },
  buttonBoxBackup: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:azulClaro,
    ...getShadowStyle(3),
    //borderRadius: 6,
    //borderBottomRightRadius: 20,
    //borderRadius: "15%",
  }
});