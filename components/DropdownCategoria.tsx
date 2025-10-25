import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";
import { grisBorde, negroAzulado } from "@/constants/Colors";

export type Categoria = {
  nombre: string;
  color: string;
};

interface DropdownCategoriasProps {
  categorias: Categoria[];
  seleccionada: Categoria | null;
  onSeleccionar: (cat: Categoria) => void;
  onEliminar: (nombre: string) => void;
  onAgregar: (nueva: Categoria) => void;
}

const coloresDisponibles = ["#d60084", "#de1600", "#fc9d03", "#79c400", "#0292e6", "#27009c"];

const DropdownCategorias: React.FC<DropdownCategoriasProps> = ({
  categorias,
  seleccionada,
  onSeleccionar,
  onEliminar,
  onAgregar,
}) => {
  const [expandido, setExpandido] = useState(false);
  const [agregando, setAgregando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoColor, setNuevoColor] = useState(coloresDisponibles[0]);

  const toggle = () => setExpandido(!expandido);

  const renderCategoria = (cat: Categoria) => (
    <View key={cat.nombre+cat.color} style={styles.opcionFila}>
      <TouchableOpacity key={"t"+cat.nombre+cat.color}
        style={[styles.categoriaOpcion, { backgroundColor: cat.color }]}
        onPress={() => {
          onSeleccionar(cat);
          setExpandido(false);
        }}
      >
        <CustomText style={styles.opcionTexto}>{cat.nombre}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={{paddingLeft: 6, paddingRight: 2}} onPress={() => onEliminar(cat.nombre)}>
        <Ionicons name="trash-outline" size={26} color="#d00" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggle}>
        <View style={[styles.colorPunto, { backgroundColor: seleccionada?.color || "#aaa" }]} />
        <CustomText style={styles.texto}>
          {seleccionada?.nombre || "Seleccionar categoría"}
        </CustomText>
        <Ionicons name={expandido ? "chevron-up" : "chevron-down"} size={20} />
      </TouchableOpacity>

      {expandido && (
        <View style={{ gap: 6 }}>
          {categorias.map(renderCategoria)}

          {agregando ? (
            <View style={styles.agregarBox}>
              <TextInput
                value={nuevoNombre}
                onChangeText={setNuevoNombre}
                placeholder="Nombre categoría"
                style={styles.input}
              />
              <View style={styles.colorSelector}>
                {coloresDisponibles.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNuevoColor(c)}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c },
                      c === nuevoColor && styles.selectedColor,
                    ]}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: nuevoColor }]}
                onPress={() => {
                  if (nuevoNombre.trim()) {
                    onAgregar({ nombre: nuevoNombre.trim(), color: nuevoColor });
                    setNuevoNombre("");
                    setNuevoColor(coloresDisponibles[0]);
                    setAgregando(false);
                  }
                }}
              >
                <CustomText style={[styles.btnText,{color: "#fff"}]}>Agregar categoría</CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setAgregando(true)} style={styles.btn}>
              <CustomText style={styles.btnText}>+ Agregar nueva categoría</CustomText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default DropdownCategorias;

const styles = StyleSheet.create({
  card: {
    //backgroundColor: "#f00",
    //paddingHorizontal: 10
    //...getShadowStyle(3),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    //backgroundColor: "red",
    paddingHorizontal: 10
  },
  colorPunto: {
    width: 14,
    height: 14,
    borderRadius: "100%",
  },
  texto: {
    flex: 1,
    fontSize: 16,
    color: negroAzulado,
    paddingTop: 8,
    paddingBottom: 8-2
  },
  opcionFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoriaOpcion: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    //borderRadius: 6,
    flex: 1
  },
  opcionTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  agregarBox: {
    marginTop: 8,
    gap: 8
  },
  input: {
    borderBottomWidth: 1,
    borderColor: grisBorde,
    paddingVertical: 4,
    fontSize: 16,
  },
  colorSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  colorCircle: {
    flex: 1,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: grisBorde,
  },
  selectedColor: {
    borderColor: "#000",
    borderWidth: 2,
  },
  btn: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
