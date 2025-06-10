import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { router } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import CustomText from "@/components/CustomText";

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
          <View key={index} >
            <TouchableOpacity
              onPress={() => toggleCollapse(index)}
              style={[
                styles.deptoHeader,
                { backgroundColor: depto.colorDepto, borderBottomRightRadius: isCollapsed ? 20 : 0 }
              ]}
            >
              <View style={{ flex: 1}}>
                <CustomText style={styles.deptoText}>{depto.nombre}</CustomText>
              </View>
              <View style={{flex: 0.07, justifyContent: 'center', alignItems: 'flex-end', marginLeft: 20, marginRight: 5}}>
                <AntDesign
                  name={isCollapsed ? "down" : "up"}
                  size={22}
                  color="white"
                />
              </View>

            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed} style={{gap: 0, marginTop: 4, paddingBottom: 5}}>
              {depto.carreras.map((carrera, i) => {
                const esUltima = i === depto.carreras.length - 1;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => router.push(`/carreras/${carrera.ruta}`)}
                    style={[
                      styles.botonCarrera,
                      { backgroundColor: depto.colorCarrera },
                      esUltima && styles.ultimaCarrera,
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
    padding: 15,
    gap: 8
  },
  deptoHeader: {
    paddingHorizontal: 15,
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4, // Android sombra
    shadowColor: '#000' // IOS sombra
  },
  deptoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  },
  botonCarrera: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "white"
  },
  textoCarrera: {
    color: "white",
    fontWeight: "bold",
  },
  ultimaCarrera: {
    borderBottomRightRadius: 20,
  },
});