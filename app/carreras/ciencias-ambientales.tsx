import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { useRouter } from "expo-router";
import CustomText from "@/components/CustomText";
import { getShadowStyle } from "@/constants/ShadowStyle";

export default function CienciasAmbientales() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const router = useRouter();

  const toggleSection = (index: number) => {
    setActiveSection(prevIndex => (prevIndex === index ? null : index));
  };

  const openPDF = (fileName: string) => {
    router.push({
      pathname: "/pdf-viewer",
      params: { file: fileName }
    });
  };

  const secciones = [
    {
      titulo: "🎓 Títulos y Duración",
      contenido: (
        <View>
          <CustomText style={styles.oracion}>• Título de grado: Licenciado/a en Ciencias Ambientales</CustomText>
          <CustomText style={styles.oracion}>• Título intermedio: Técnico/a en Ciencias Ambientales</CustomText>
          <CustomText style={styles.oracion}>• Duración: 4 años y medio</CustomText>
        </View>
      ),
    },
    {
      titulo: "📘 Acerca de la carrera",
      contenido: (
        <CustomText style={styles.oracion}>
          El objetivo de esta carrera es formar especialistas comprometidos y competentes, con conocimientos sólidos...
        </CustomText>
      ),
    },
    {
      titulo: "🎯 Objetivos de la carrera",
      contenido: (
        <View>
          <CustomText style={styles.oracion}>a) Investigar los procesos...</CustomText>
          <CustomText style={styles.oracion}>b) Evaluar los factores...</CustomText>
          <CustomText style={styles.oracion}>c) Gestionar la biodiversidad...</CustomText>
          <CustomText style={styles.oracion}>d) Planificar y gestionar el territorio...</CustomText>
        </View>
      ),
    },
    {
      titulo: "📄 Planes y recursos",
      contenido: (
        <View>
          <TouchableOpacity onPress={() => openPDF("ciencias-ambientales-plan-estudios.pdf")}>
            <CustomText style={styles.link}>📘 Plan de estudios</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPDF("ciencias-ambientales-plan-creditos.pdf")}>
            <CustomText style={styles.link}>📗 Plan de créditos</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPDF("ciencias-ambientales-postal-digital.pdf")}>
            <CustomText style={styles.link}>📨 Postal digital</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: "📍 Departamento y autoridades",
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Ambiente y Turismo</CustomText>
          <CustomText style={styles.oracion}>Decana: Dra. Natalia Cappelletti</CustomText>
          <CustomText style={styles.oracion}>Vicedecana: Mg. Leticia Estévez</CustomText>
          <CustomText style={styles.oracion}>Director: Ing. Sergio Cataldo</CustomText>
        </View>
      ),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {secciones.map((seccion, index) => (
        <View key={index} style={styles.seccion}>
          <TouchableOpacity
            onPress={() => toggleSection(index)}
            style={[
              styles.boton,
              activeSection === index && styles.botonExpandido
            ]}
          >
            <CustomText style={styles.titulo}>{seccion.titulo}</CustomText>
          </TouchableOpacity>
          <Collapsible collapsed={activeSection !== index}>
            <View style={styles.contenido}>
              {seccion.contenido}
            </View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 8
    //justifyContent: "space-evenly",
  },
  seccion: {
    ...getShadowStyle(4)
  },
  boton: {
    backgroundColor: "#9fa521",
    padding: 16,
    height: 64,
    borderBottomRightRadius: 20,
  },
  botonExpandido: {
    borderBottomRightRadius: 0,
  },
  titulo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  contenido: {
    backgroundColor: "#e0dede",
    padding: 16,
    borderBottomRightRadius: 20
  },
  oracion: {
    marginBottom: 8,
    color: "#333",
  },
  link: {
    color: "#1b9ba6",
    textDecorationLine: "underline",
    marginBottom: 8,
    fontWeight: "bold",
  },
});
