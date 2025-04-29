import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { useRouter } from "expo-router";

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
          <Text style={styles.texto}>• Título de grado: Licenciado/a en Ciencias Ambientales</Text>
          <Text style={styles.texto}>• Título intermedio: Técnico/a en Ciencias Ambientales</Text>
          <Text style={styles.texto}>• Duración: 4 años y medio</Text>
        </View>
      ),
    },
    {
      titulo: "📘 Acerca de la carrera",
      contenido: (
        <Text style={styles.texto}>
          El objetivo de esta carrera es formar especialistas comprometidos y competentes, con conocimientos sólidos...
        </Text>
      ),
    },
    {
      titulo: "🎯 Objetivos de la carrera",
      contenido: (
        <View>
          <Text style={styles.texto}>a) Investigar los procesos...</Text>
          <Text style={styles.texto}>b) Evaluar los factores...</Text>
          <Text style={styles.texto}>c) Gestionar la biodiversidad...</Text>
          <Text style={styles.texto}>d) Planificar y gestionar el territorio...</Text>
        </View>
      ),
    },
    {
      titulo: "📄 Planes y recursos",
      contenido: (
        <View>
          <TouchableOpacity onPress={() => openPDF("ciencias-ambientales-plan-estudios.pdf")}>
            <Text style={styles.link}>📘 Plan de estudios</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPDF("ciencias-ambientales-plan-creditos.pdf")}>
            <Text style={styles.link}>📗 Plan de créditos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPDF("ciencias-ambientales-postal-digital.pdf")}>
            <Text style={styles.link}>📨 Postal digital</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: "📍 Departamento y autoridades",
      contenido: (
        <View>
          <Text style={styles.texto}>Departamento de Ambiente y Turismo</Text>
          <Text style={styles.texto}>Decana: Dra. Natalia Cappelletti</Text>
          <Text style={styles.texto}>Vicedecana: Mg. Leticia Estévez</Text>
          <Text style={styles.texto}>Director: Ing. Sergio Cataldo</Text>
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
            <Text style={styles.titulo}>{seccion.titulo}</Text>
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
    padding: 16,
    flex: 1,
    justifyContent: "space-evenly",
  },
  seccion: {
    marginBottom: 10,
  },
  boton: {
    backgroundColor: "#9fa521",
    padding: 16,
    borderBottomRightRadius: 10,
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
    padding: 12,
    borderBottomRightRadius: 20,
  },
  texto: {
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
