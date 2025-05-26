import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import CustomText from "../components/CustomText";
import BottomBar from "../components/BottomBar";

const faqs = [
  {
    pregunta: "¿Cómo me inscribo a una materia?",
    respuesta:
      'Debés ingresar a tu SIU-Guaraní, ir a la sección "Inscripción" y seguir los pasos del sistema.',
  },
  {
    pregunta: "¿Dónde puedo ver mis horarios?",
    respuesta:
      'En esta app, accediendo a la sección "Inscripciones", podés ver tus horarios una vez inscripto.',
  },
  {
    pregunta: "¿Qué hago si no puedo ingresar a SIU?",
    respuesta:
      "Verificá tus datos de acceso. Si el problema persiste, comunicate con soporte técnico de la UNDAV.",
  },
  {
    pregunta: "¿Dónde solicito un certificado?",
    respuesta:
      'Los certificados se pueden solicitar desde SIU-Guaraní o en la sección "Certificados y Reportes" de esta app.',
  },
];

export default function PreguntasFrecuentes() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleCollapse = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {faqs.map((faq, index) => {
          const isCollapsed = expandedIndex !== index;
          const esUltima = index === faqs.length - 1;

          return (
            <View key={index} style={{ marginBottom: 5 }}>
              <TouchableOpacity
                onPress={() => toggleCollapse(index)}
                style={[
                  styles.preguntaHeader,
                  { backgroundColor: "#0b5085", borderBottomRightRadius: isCollapsed ? 12 : 0 },
                ]}
              >
                <CustomText style={styles.preguntaText}>
                  {faq.pregunta}
                </CustomText>
              </TouchableOpacity>

              <Collapsible collapsed={isCollapsed}>
                <View
                  style={[
                    styles.respuestaContainer,
                    esUltima && styles.ultimaRespuesta,
                  ]}
                >
                  <CustomText style={styles.respuestaText}>
                    {faq.respuesta}
                  </CustomText>
                </View>
              </Collapsible>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#0b254a",
    marginBottom: 20,
  },
  preguntaHeader: {
    padding: 12,
    borderBottomRightRadius: 12, // valor inicial cuando colapsado
  },
  preguntaText: {
    color: "white",
    fontWeight: "bold",
  },
  respuestaContainer: {
    padding: 12,
    backgroundColor: "#e3f0fb",
    borderTopWidth: 1,
    borderTopColor: "white",
  },
  respuestaText: {
    color: "#333",
  },
  ultimaRespuesta: {
    borderBottomRightRadius: 12,
  },
});
