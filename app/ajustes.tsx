import React, { useState } from "react";
import { View, StyleSheet, SectionList, TouchableOpacity, Switch, Linking } from "react-native";
import { router } from "expo-router";
import CustomText from "../components/CustomText";
import BottomBar from "../components/BottomBar";

// Definición de tipos para los ítems de configuración
type TextItem = { type: "text"; label: string };
type ToggleItem = { type: "toggle"; label: string; value: boolean; onValueChange: (val: boolean) => void };
type LinkItem = { type: "link"; label: string; onPress: () => void };
type ActionItem = { type: "action"; label: string; onPress: () => void };

type ConfigItem = TextItem | ToggleItem | LinkItem | ActionItem;
interface ConfigSection {
  data: ConfigItem[];
}

export default function Configuracion() {
  // Datos de usuario (reemplazar con datos reales del contexto de la app)
  const usuario = { nombre: "Nombre Apellido", email: "usuario@undav.edu.ar" };
  const [notifsOn, setNotifsOn] = useState(false);
  const appVersion = "1.0.0";

  const sections: ConfigSection[] = [
    {
      data: [
        { type: "text", label: usuario.nombre },
        { type: "text", label: usuario.email },
      ],
    },
    {
      data: [
        {
          type: "toggle",
          label: "Activar notificaciones",
          value: notifsOn,
          onValueChange: (val) => setNotifsOn(val),
        },
      ],
    },
    {
      data: [
        {
          type: "link",
          label: "Preguntas frecuentes",
          onPress: () => router.push("/preguntas-frecuentes"),
        },
        {
          type: "link",
          label: "Contacto",
          onPress: () => router.push("/contacto"),
        },
        {
          type: "link",
          label: "Enviar Feedback",
          onPress: () => Linking.openURL("mailto:feedback@undav.edu.ar"),
        },
      ],
    },
    {
      data: [
        { type: "text", label: `Versión ${appVersion}` },
        {
          type: "link",
          label: "Términos y privacidad",
          onPress: () => router.push("/terminos-privacidad"),
        },
      ],
    },
    {
      data: [
        {
          type: "action",
          label: "Cerrar sesión",
          onPress: () => {
            // Lógica de logout
            router.replace("/login");
          },
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
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
            default:
              return null;
          }
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
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
    backgroundColor: "#DDD",
  },
});
