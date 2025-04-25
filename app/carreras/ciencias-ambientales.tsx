import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import Collapsible from "react-native-collapsible";
import { router } from "expo-router";

export default function CienciasAmbientales() {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setActiveSection(prevIndex => (prevIndex === index ? null : index));
  };

  const secciones = [
    {
      titulo: "🎓 Títulos y Duración",
      contenido: (
        <View>
          <Text style={styles.texto}>
            • Título de grado: Licenciado/a en Ciencias Ambientales
          </Text>
          <Text style={styles.texto}>
            • Título intermedio: Técnico/a en Ciencias Ambientales
          </Text>
          <Text style={styles.texto}>
            • Duración: 4 años y medio
          </Text>
        </View>
      ),
    },
    {
      titulo: "📘 Acerca de la carrera",
      contenido: (
        <Text style={styles.texto}>
          El objetivo de esta carrera es formar especialistas comprometidos y competentes, con conocimientos sólidos, para que entiendan el medio ambiente de manera integral. La UNDAV se compromete en la temática ambiental formando profesionales que contribuyan en forma positiva al bienestar social, lo que requiere un abordaje sistémico de los conflictos ambientales para afrontar el desafío de alcanzar el desarrollo individual y comunitario sin comprometer los recursos naturales o el ambiente.
        </Text>
      ),
    },
    {
      titulo: "🎯 Objetivos de la carrera",
      contenido: (
        <View>
          <Text style={styles.texto}>El objetivo de la carrera es formar profesionales capaces de:</Text>
          <Text style={styles.texto}>a) Investigar los procesos e interacciones bióticas y abióticas del medio ambiente.</Text>
          <Text style={styles.texto}>b) Evaluar los factores que modifican el medio ambiente y sus consecuencias.</Text>
          <Text style={styles.texto}>c) Gestionar la biodiversidad a través del desarrollo sostenible.</Text>
          <Text style={styles.texto}>d) Planificar y gestionar el territorio de manera sostenible.</Text>
        </View>
      ),
    },
    {
      titulo: "📄 Plan de estudios",
      contenido: (
        <Text style={styles.texto}>
          Podés descargar el plan de estudios desde el sitio oficial de la UNDAV:
          {"\n"}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://undav.edu.ar/index.php?idcateg=279")}
          >
            https://undav.edu.ar/index.php?idcateg=279
          </Text>
        </Text>
      ),
    },
    {
      titulo: "📍 Departamento y autoridades",
      contenido: (
        <View>
          <Text style={styles.texto}>Departamento de Ambiente y Turismo</Text>
          <Text style={styles.texto}>Decana: Dra. Natalia Cappelletti</Text>
          <Text style={styles.texto}>Vicedecana: Mg. Leticia Estévez</Text>
          <Text style={styles.texto}>Director de la Licenciatura: Ing. Sergio Cataldo </Text>
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
  },
  seccion: {
    marginBottom: 10,
  },
  boton: {
    backgroundColor: "#9fa521",
    padding: 12,
    borderBottomRightRadius: 10,
  },
  botonExpandido: {
    borderBottomRightRadius: 0,
  },
  titulo: {
    color: "white",
    fontWeight: "bold",
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
  },
});
