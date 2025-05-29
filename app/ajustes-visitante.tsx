import React, { useState } from "react";
import { View, StyleSheet, SectionList, TouchableOpacity, Switch, Linking } from "react-native";
import { router } from "expo-router";
import CustomText from "../components/CustomText";

// Definición de tipos para los ítems de configuración
type TextItem = { type: "text"; label: string };
type ToggleItem = { type: "toggle"; label: string; value: boolean; onValueChange: (val: boolean) => void };
type LinkItem = { type: "link"; label: string; onPress: () => void };
type ActionItem = { type: "action"; label: string; onPress: () => void };
type SeparatorItem = {type: "separator"; };

type ConfigItem = TextItem | ToggleItem | LinkItem | ActionItem | SeparatorItem;
interface ConfigSection {
  data: ConfigItem[];
}

const appVersion = "1.0.0";
export default function Configuracion() {
  const [notifsOn, setNotifsOn] = useState(false);

  const sections: ConfigSection[] = [
    {
      data: [
        { type: "separator" }
      ]
    },
    {
      data: [
        {
          type: "toggle",
          label: "Recibir notificaciones",
          value: notifsOn,
          onValueChange: (val) => setNotifsOn(val),
        },
        { type: "separator" }
      ]
    },
    {
      data: [
        {
          type: "link",
          label: "Envianos tus sugerencias",
          onPress: () => Linking.openURL("mailto:app-sugerencias@undav.edu.ar"),
        },
        { type: "separator" }
      ]
    },
    {
      data: [
        {
          type: "action",
          label: "Ingresar como estudiante",
          onPress: () => {
            // Lógica de logout
            router.replace("/"); // va a la pantalla inicial, "index.tsx"
          },
        }
      ]
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={ ({ item }) => {
          switch (item.type) {
            case "text":
              return (
                <View style={styles.item}>
                  <CustomText style={styles.textItem}>{item.label}</CustomText>
                </View>
              );
            case "toggle":
              return (
                <View style={styles.item}>
                  <CustomText style={styles.textItem}>{item.label}</CustomText>
                  <Switch value={item.value} onValueChange={item.onValueChange} />
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
              return (
              <View style={styles.separator}/>
              );
            
            default:
              return null;
          }
        }}
        //ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  list: {
    padding: 16
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
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
    color: "#d9534f",
  },
  separator: {
    height: 1,
    marginVertical: 0,
    backgroundColor: "#DDD",
  },
});