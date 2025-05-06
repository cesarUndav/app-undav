import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { router } from "expo-router";

const departamentos = [
  {
    nombre: "Departamento de Ambiente y Turismo",
    colorDepto: "#909b1b",
    colorCarrera: "#b8bf30",
    carreras: [
      { nombre: "Ciencias ambientales", ruta: "ciencias-ambientales" },
      { nombre: "Conservación de la Naturaleza y Áreas Naturales Protegidas", ruta: "conservacion-naturaleza" },
      { nombre: "Turismo", ruta: "turismo" },
      { nombre: "Guía Universitario en Turismo", ruta: "guia-turismo" },
    ],
  },
  {
    nombre: "Departamento de Arquitectura, Diseño y Urbanismo",
    colorDepto: "#a6398a",
    colorCarrera: "#bf55a8",
    carreras: [
      { nombre: "Arquitectura", ruta: "arquitectura" },
      { nombre: "Diseño Industrial", ruta: "diseno-industrial" },
      { nombre: "Diseño de Marcas y Envases", ruta: "diseno-marcas-envases" },
      { nombre: "CCC Licenciatura en Diseño Industrial", ruta: "diseno-industrial-ccc" },
      { nombre: "Tecnicatura en Intervención Socio Comunitaria", ruta: "intervencion-comunitaria" },
      { nombre: "Centro de Estudios del Habitar Popular", ruta: "habitar-popular" },
    ],
  },
  {
    nombre: "Departamento de Ciencias Sociales",
    colorDepto: "#ca2627",
    colorCarrera: "#ee3b4d",
    carreras: [
      { nombre: "Abogacía", ruta: "abogacia" },
      { nombre: "Economía", ruta: "economia" },
      { nombre: "Tecnicatura en Gestión Universitaria", ruta: "gestion-universitaria" },
    ],
  },
  {
    nombre: "Departamento de Cultura, Arte y Comunicación",
    colorDepto: "#158d9e",
    colorCarrera: "#30b7c4",
    carreras: [
      { nombre: "Artes Audiovisuales", ruta: "artes-audiovisuales" },
      { nombre: "Gestión Cultural", ruta: "gestion-cultural" },
      { nombre: "Periodismo", ruta: "periodismo" },
      { nombre: "CCC Licenciatura en Periodismo", ruta: "periodismo-ccc" },
      { nombre: "CCC Licenciatura en Gestión Cultural", ruta: "gestion-cultural-ccc" },
      { nombre: "CCC Licenciatura en Historia", ruta: "historia-ccc" },
      { nombre: "Tecnicatura en Dirección de Orquestas y Coros Infantiles y Juveniles", ruta: "orquestas-coros" },
      { nombre: "CCC en Museología y Repositorios Culturales y Naturales", ruta: "museologia" },
      { nombre: "Tecnicatura en Política, Gestión y Comunicación", ruta: "politica-gestion-comunicacion" },
      { nombre: "CCC Licenciatura en Comunicación Política", ruta: "comunicacion-politica-ccc" },
    ],
  },
  {
    nombre: "Departamento de Salud y Actividad Física",
    colorDepto: "#f47d21",
    colorCarrera: "#fd934b",
    carreras: [
      { nombre: "Enfermería", ruta: "enfermeria" },
      { nombre: "Actividad Física y Deporte", ruta: "actividad-fisica" },
      { nombre: "Tecnicatura Universitaria en Prótesis Dental", ruta: "protesis-dental" },
      { nombre: "CCC Licenciatura en Actividad Física y Deporte", ruta: "actividad-fisica-ccc" },
    ],
  },
  {
    nombre: "Departamento de Tecnología y Administración",
    colorDepto: "#e3a400",
    colorCarrera: "#fdc128",
    carreras: [
      { nombre: "Ingeniería en Informática", ruta: "ingenieria-informatica" },
      { nombre: "Ingeniería en Materiales", ruta: "ingenieria-materiales" },
      { nombre: "Licenciatura en Gerencia de Empresas", ruta: "gerencia-empresas" },
      { nombre: "CCC Licenciatura en Higiene y Seguridad en el Trabajo", ruta: "higiene-seguridad" },
      { nombre: "Tecnicatura Universitaria en Mantenimiento Industrial del Sector Automotriz", ruta: "mantenimiento-industrial" },
    ],
  },
];

export default function OfertaAcademica() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleCollapse = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {departamentos.map((depto, index) => {
        const isCollapsed = expandedIndex !== index;

        return (
          <View key={index} style={{ marginBottom: 5 }}>
            <TouchableOpacity
              onPress={() => toggleCollapse(index)}
              style={[styles.deptoHeader, { backgroundColor: depto.colorDepto }]}
            >
              <Text style={styles.deptoText}>{depto.nombre}</Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed}>
              {depto.carreras.map((carrera, i) => {
                const esUltima = i === depto.carreras.length - 1;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => router.push(`/carreras/${carrera.ruta}`)}
                    style={[
                      styles.botonCarrera,
                      { backgroundColor: depto.colorCarrera },
                      esUltima && styles.ultimaCarrera, // <-- estilo extra para la última
                    ]}
                  >
                    <Text style={styles.textoCarrera}>{carrera.nombre}</Text>
                  </TouchableOpacity>
                );
              })}
            </Collapsible>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  deptoHeader: {
    padding: 12,
    borderBottomRightRadius: 12,
    marginBottom: 0,
  },
  deptoText: {
    color: "white",
    fontWeight: "bold",
  },
  botonCarrera: {
    padding: 12,
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: "white",
    marginBottom: 0,
  },
  textoCarrera: {
    color: "white",
    fontWeight: "bold",
  },
  ultimaCarrera: {
    borderBottomRightRadius: 12,
  },
});

//Se está descargando Andoid Studio. Mientras tanto quiero pedirte ayuda en otra parte del proyecto. La app tiene como objetivo 2 tipos de usuarios, los estudiantes y los no estudiantes (o visitantes/invitados, todavía no he decidido el nombre). Los no estudiantes tienen acceso a ver la oferta académica, que hemos desarrollado recientemente, pero al igual que lso estudiantes tienen una pantalla de home (home-estudiantes.tsx) con un layout de todos los botones, sitios y acciones que pueden realizar los estudiantes, también necesito un layout para el home de los no estudiantes.  Los no estudiantes 