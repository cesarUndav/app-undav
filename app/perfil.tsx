import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";
import CustomText from "../components/CustomText";
import FondoGradiente from "@/components/FondoGradiente";
import {
  Logout,
  infoBaseUsuarioActual,
} from "@/data/DatosUsuarioGuarani";
import { getShadowStyle } from "@/constants/ShadowStyle";

// Tipado de ítems de configuración
type TextItem = { type: "text"; label: string };
type ToggleItem = {
  type: "toggle";
  label: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
};
type LinkItem = { type: "link"; label: string; onPress: () => void };
type ActionItem = { type: "action"; label: string; onPress: () => void };
type SeparatorItem = { type: "separator" };
type DropdownItem = { type: "dropdown"; label: string; content: string[] };

type ConfigItem =
  | TextItem
  | ToggleItem
  | LinkItem
  | ActionItem
  | SeparatorItem
  | DropdownItem;

interface ConfigSection {
  data: ConfigItem[];
}

export default function Configuracion() {
  const [mostrarPropuestas, setMostrarPropuestas] = useState(false);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que querés\ncerrar sesión?", [
      {
        text: "Sí",
        style: "destructive",
        onPress: () => {
          Logout();
          router.replace("/");
        },
      },
      { text: "No", style: "cancel" },
    ]);
  };

  const sections: ConfigSection[] = [
    {
      data: [
        {
          type: "text",
          label: infoBaseUsuarioActual.nombreCompleto
        },
        {
          type: "text",
          label: "Legajo: " + infoBaseUsuarioActual.legajo
        },
        {
          type: "dropdown",
          label: "Mis Propuestas Educativas",
          content: infoBaseUsuarioActual.propuestas.map(
              (p) =>
                `${p.nombre}: ${p.regular === "S" ? "Regular" : "NO Regular"}`
            )
        },
        {
          type: "text",
          label: infoBaseUsuarioActual.email
        },
        { type: "separator" },
      ],
    },
    {
      data: [
        {
          type: "link",
          label: "Historia Académica",
          onPress: () => router.push("/historia-academica"),
        },
        {
          type: "link",
          label: "Plan de Estudio",
          onPress: () => router.push("/plan-de-estudio"),
        },
        {
          type: "link",
          label: "Ajustes",
          onPress: () => router.push("/ajustes"),
        },
        {
          type: "link",
          label: "Extras",
          onPress: () => router.push("/extras"),
        },
        { type: "separator" },
      ],
    },
    {
      data: [
        {
          type: "action",
          label: "Cerrar sesión",
          onPress: handleLogout,
        },
      ],
    },
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
                  <View style={[styles.item, { marginVertical: -10 }]}>
                    <CustomText style={styles.textItem}>{item.label}</CustomText>
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                    />
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
              case "dropdown":
                return (
                  <View style={{ marginBottom: 0 }}>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => setMostrarPropuestas(!mostrarPropuestas)}
                    >
                      <CustomText style={styles.textItem}>{item.label}</CustomText>
                      <CustomText style={{ fontSize: 22 }}>
                        {mostrarPropuestas ? "▲ " : "▼ "}
                      </CustomText>
                    </TouchableOpacity>
                    {mostrarPropuestas &&
                      item.content.map((line, idx) => (
                        <View key={idx} style={{ paddingLeft: 16, paddingVertical: 2 }}>
                          <CustomText style={styles.textItem}>{line}</CustomText>
                        </View>
                      ))}
                  </View>
                );
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
    ...getShadowStyle(6),
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
    color: "#d9534f",
  },
  separator: {
    height: 1,
    marginVertical: 6,
    backgroundColor: "#BBB",
  },
});
