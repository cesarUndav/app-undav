import React, { useState } from "react";
import { View, StyleSheet, SectionList, TouchableOpacity, Switch, Linking, Alert } from "react-native";
import { router } from "expo-router";
import CustomText from "../components/CustomText";
import FondoGradiente from "@/components/FondoGradiente";
import {
  fondoEsCeleste,
  Logout,
  setColorFondoCeleste,
  UsuarioEsAutenticado,
  infoBaseUsuarioActual
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
function PropuestasString():string {
  const str:string = "Mis Propuestas Educativas:" +
  infoBaseUsuarioActual.propuestas.map(p=> "\n"+p.nombre + ": " +(p.regular == "S" ? "Regular" : "NO Regular")).join("");
  return str;
}

export default function Configuracion() {

  const [notifsOn, setNotifsOn] = useState(false);
  const [fondoCeleste, setFondoCeleste] = useState(fondoEsCeleste);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que querés\ncerrar sesión?",
      [
        {
          text: "Sí",
          style: "destructive",
          onPress: () => {
            Logout();
            router.replace("/"); // redirige a index.tsx
          }
        },
        { text: "No", style: "cancel" }
      ]
    );
  };

  const sections: ConfigSection[] = [
    {
      data: [
        { type: "text", label: UsuarioEsAutenticado() ? infoBaseUsuarioActual.nombreCompleto : "Nombre Nombre Apellido" },
        { type: "text", label: UsuarioEsAutenticado() ? "Legajo: " + infoBaseUsuarioActual.legajo : "Legajo: 12345" },
        { type: "text", label: UsuarioEsAutenticado() ? PropuestasString() : "Mis Propuestas Educativas:\nP1 - Regular: N" },
        { type: "text", label: UsuarioEsAutenticado() ? infoBaseUsuarioActual.email : "nombreapellido@email.com" },
        { type: "separator" }
      ]
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
        { type: "separator" }
      ]
    },
    {
      data: [
        {
          type: "action",
          label: "Cerrar sesión",
          onPress: handleLogout
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
                  <View style={[styles.item, { marginVertical: -10 }]}>
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