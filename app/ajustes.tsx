import React, { useState } from "react";
import { View, StyleSheet, SectionList, TouchableOpacity, Switch, Platform } from "react-native";
import CustomText from "../components/CustomText";
import FondoGradiente from "@/components/FondoGradiente";
import {
  fondoEsCeleste,
  setColorFondoCeleste
} from "@/data/DatosUsuarioGuarani";
import { getShadowStyle } from "@/constants/ShadowStyle";

// Tipado de ítems de configuración
type TextItem = { type: "text"; label: string };
type ToggleItem = { type: "toggle"; label: string; value: boolean; onValueChange: (val: boolean) => void };
type LinkItem = { type: "link"; label: string; onPress: () => void };
type ActionItem = { type: "action"; label: string; onPress: () => void };
type SeparatorItem = { type: "separator" };

type ConfigItem = TextItem | ToggleItem | LinkItem | ActionItem | SeparatorItem;
interface ConfigSection {
  data: ConfigItem[];
}

export default function Configuracion() {

  const [notifsOn, setNotifsOn] = useState(false);
  const [fondoCeleste, setFondoCeleste] = useState(fondoEsCeleste);

  const sections: ConfigSection[] = [
    {
      data: [
        {
          type: "toggle",
          label: "Recibir notificaciones",
          value: notifsOn,
          onValueChange: (val) => setNotifsOn(val),
        },
        {
          type: "toggle",
          label: "DEV - Fondo celeste",
          value: fondoCeleste,
          onValueChange: (val) => {
            setFondoCeleste(val);
            setColorFondoCeleste(val);
          },
        }
      ]
    }
  ];

  return (
    <FondoGradiente>
      <View style={styles.card}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          renderItem={({ item }) => {
            switch (item.type) {
              case "text":
                return (
                  <View style={styles.item}>
                    <CustomText style={styles.textItem}>{item.label}</CustomText>
                  </View>
                );
              case "toggle":
                return (
                  <View style= {[styles.item, Platform.OS === "ios" ? {marginVertical: 0} : {marginVertical: -10}]}>
                    <CustomText style={styles.textItem}>{item.label}</CustomText>
                    <Switch value={item.value} onValueChange={item.onValueChange}/>
                  </View>
                );
              case "link":
                return (
                  <TouchableOpacity style={styles.item} onPress={item.onPress}>
                    <CustomText style={styles.linkItem}>{item.label}</CustomText>
                  </TouchableOpacity>
                );
              case "action":
                return (
                  <TouchableOpacity style={styles.item} onPress={item.onPress}>
                    <CustomText style={styles.actionItem}>{item.label}</CustomText>
                  </TouchableOpacity>
                );
              case "separator":
                return <View style={styles.separator} />;
              default:
                return null;
            }
          }}
          contentContainerStyle={styles.list}
        />
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomRightRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#fff",
    ...getShadowStyle(6)
  },
  list: {},
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  textItem: {
    fontSize: 16,
    color: "#0b254a",
  },
  linkItem: {
    fontSize: 16,
    color: "#0b5085",
  },
  actionItem: {
    fontSize: 16,
    color: "#d9534f"
  },
  separator: {
    height: 1,
    marginVertical: 6,
    backgroundColor: "#BBB",
  },
});
