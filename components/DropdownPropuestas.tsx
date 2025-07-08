import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { negroAzulado } from "@/constants/Colors";
import { getShadowStyle } from "@/constants/ShadowStyle";

interface Propuesta {
  nombre: string;
  regular: string;
}

interface DropdownListaPropuestasProps {
  propuestas: Propuesta[];
  indiceSeleccionado: number;
  onSeleccionar: (nuevoIndice: number) => void;
  label?: string;
}

const DropdownPropuestas: React.FC<DropdownListaPropuestasProps> = ({
  propuestas,
  indiceSeleccionado,
  onSeleccionar,
  label = "",
}) => {
  const [expandido, setExpandido] = useState(false);

  const seleccionada = propuestas[indiceSeleccionado];
  const opcionesRestantes = propuestas
    .map((p, idx) => ({ ...p, idx }))
    .filter((_, idx) => idx !== indiceSeleccionado);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => setExpandido((v) => !v)}
      >
        <CustomText style={styles.textItem}>
          {`${label}${seleccionada.nombre} (${seleccionada.regular === "S" ? "Regular" : "NO Regular"})`}
        </CustomText>
        <CustomText style={styles.flecha}>{expandido ? "▲" : "▼"}</CustomText>
      </TouchableOpacity>

      {expandido &&
        opcionesRestantes.map((p) => (
          <TouchableOpacity
            key={p.idx}
            style={styles.opcion}
            onPress={() => {
              onSeleccionar(p.idx);
              setExpandido(false);
            }}
          >
            <CustomText style={styles.textItem}>
              {`${p.nombre}: ${p.regular === "S" ? "Regular" : "NO Regular"}`}
            </CustomText>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default DropdownPropuestas;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginBottom: 5,
    //...getShadowStyle(4),
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 0
  },
  textItem: {
    fontSize: 16,
    color: negroAzulado,
    fontWeight: "bold",
  },
  flecha: {
    fontSize: 20,
    color: negroAzulado,
  },
  opcion: {
    paddingVertical: 8,
    paddingLeft: 0,
  },
});
