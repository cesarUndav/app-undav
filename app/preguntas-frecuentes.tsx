import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import CustomText from "../components/CustomText";
import FondoScrollGradiente from "@/components/FondoScrollGradiente";
import { azulLogoUndav, azulMedioUndav } from "@/constants/Colors";

// HACE FALTA UNA MANERA DE MARCAR LINKS EN EL TEXTO DE MANERA QUE EL USUARIO PUEDA TOCARLOS. 

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
      'Los certificados se pueden solicitar desde SIU-Guaraní o en la sección "Certificados" de esta app.',
  },
];

export default function PreguntasFrecuentes() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleCollapse = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

return (
      <FondoScrollGradiente>
        {faqs.map((faq, index) => {
          const isCollapsed = expandedIndex !== index;
          const esUltima = index === faqs.length - 1;

          return (
            <View key={index} style={{ }}>
              <TouchableOpacity
                onPress={() => toggleCollapse(index)}
                style={[
                  styles.preguntaHeader,
                  { backgroundColor: azulLogoUndav, borderBottomRightRadius: isCollapsed ? 12 : 0 },
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
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    color: azulLogoUndav,
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
    backgroundColor: "#fff",
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
