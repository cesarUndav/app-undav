// app/carreras/[ruta].tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CarreraDetalle() {
  const { ruta } = useLocalSearchParams();

  // Mapa de carreras con su contenido
  const carreras: Record<string, { nombre: string; descripcion: string }> = {
    "ciencias-ambientales": {
      nombre: "Ciencias Ambientales",
      descripcion: "Contenido pendiente.",
    },
    "conservacion-naturaleza": {
      nombre: "Conservación de la Naturaleza y Áreas Naturales Protegidas",
      descripcion: "Contenido pendiente.",
    },
    "turismo": {
      nombre: "Turismo",
      descripcion: "Contenido pendiente.",
    },
    "guia-turismo": {
      nombre: "Guía Universitario en Turismo",
      descripcion: "Contenido pendiente.",
    },
    "arquitectura": {
      nombre: "Arquitectura",
      descripcion: "Contenido pendiente.",
    },
    "diseno-industrial": {
      nombre: "Diseño Industrial",
      descripcion: "Contenido pendiente.",
    },
    "diseno-marcas-envases": {
      nombre: "Diseño de Marcas y Envases",
      descripcion: "Contenido pendiente.",
    },
    "diseno-industrial-ccc": {
      nombre: "CCC Licenciatura en Diseño Industrial",
      descripcion: "Contenido pendiente.",
    },
    "intervencion-comunitaria": {
      nombre: "Tecnicatura en Intervención Socio Comunitaria",
      descripcion: "Contenido pendiente.",
    },
    "habitar-popular": {
      nombre: "Centro de Estudios del Habitar Popular",
      descripcion: "Contenido pendiente.",
    },
    "abogacia": {
      nombre: "Abogacía",
      descripcion: "Contenido pendiente.",
    },
    "economia": {
      nombre: "Economía",
      descripcion: "Contenido pendiente.",
    },
    "gestion-universitaria": {
      nombre: "Tecnicatura en Gestión Universitaria",
      descripcion: "Contenido pendiente.",
    },
    "artes-audiovisuales": {
      nombre: "Artes Audiovisuales",
      descripcion: "Contenido pendiente.",
    },
    "gestion-cultural": {
      nombre: "Gestión Cultural",
      descripcion: "Contenido pendiente.",
    },
    "periodismo": {
      nombre: "Periodismo",
      descripcion: "Contenido pendiente.",
    },
    "periodismo-ccc": {
      nombre: "CCC Licenciatura en Periodismo",
      descripcion: "Contenido pendiente.",
    },
    "gestion-cultural-ccc": {
      nombre: "CCC Licenciatura en Gestión Cultural",
      descripcion: "Contenido pendiente.",
    },
    "historia-ccc": {
      nombre: "CCC Licenciatura en Historia",
      descripcion: "Contenido pendiente.",
    },
    "orquestas-coros": {
      nombre: "Tecnicatura en Dirección de Orquestas y Coros",
      descripcion: "Contenido pendiente.",
    },
    "museologia": {
      nombre: "CCC en Museología y Repositorios",
      descripcion: "Contenido pendiente.",
    },
    "politica-gestion-comunicacion": {
      nombre: "Tecnicatura en Política, Gestión y Comunicación",
      descripcion: "Contenido pendiente.",
    },
    "comunicacion-politica-ccc": {
      nombre: "CCC Licenciatura en Comunicación Política",
      descripcion: "Contenido pendiente.",
    },
    "enfermeria": {
      nombre: "Enfermería",
      descripcion: "Contenido pendiente.",
    },
    "actividad-fisica": {
      nombre: "Actividad Física y Deporte",
      descripcion: "Contenido pendiente.",
    },
    "protesis-dental": {
      nombre: "Prótesis Dental",
      descripcion: "Contenido pendiente.",
    },
    "actividad-fisica-ccc": {
      nombre: "CCC Licenciatura en Actividad Física y Deporte",
      descripcion: "Contenido pendiente.",
    },
    "ingenieria-informatica": {
      nombre: "Ingeniería en Informática",
      descripcion: "Contenido pendiente.",
    },
    "ingenieria-materiales": {
      nombre: "Ingeniería en Materiales",
      descripcion: "Contenido pendiente.",
    },
    "gerencia-empresas": {
      nombre: "Licenciatura en Gerencia de Empresas",
      descripcion: "Contenido pendiente.",
    },
    "higiene-seguridad": {
      nombre: "CCC Licenciatura en Higiene y Seguridad",
      descripcion: "Contenido pendiente.",
    },
    "mantenimiento-industrial": {
      nombre: "Mantenimiento Industrial del Sector Automotriz",
      descripcion: "Contenido pendiente.",
    },
  };

  const carrera = carreras[ruta as string];

  if (!carrera) {
    return (
      <View style={styles.container}>
        <Text style={styles.nombre}>Carrera no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.nombre}>{carrera.nombre}</Text>
      <Text style={styles.descripcion}>{carrera.descripcion}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    lineHeight: 22,
  },
});
