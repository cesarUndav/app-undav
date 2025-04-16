import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomBar from '../components/BottomBar';
import CustomText from '../components/CustomText';

// Habilita la animación en Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
  {
    pregunta: '¿Cómo me inscribo a una materia?',
    respuesta: 'Debés ingresar a tu SIU-Guaraní, ir a la sección "Inscripción" y seguir los pasos del sistema.',
  },
  {
    pregunta: '¿Dónde puedo ver mis horarios?',
    respuesta: 'En esta app, accediendo a la sección "Inscripciones", podés ver tus horarios una vez inscripto.',
  },
  {
    pregunta: '¿Qué hago si no puedo ingresar a SIU?',
    respuesta: 'Verificá tus datos de acceso. Si el problema persiste, comunicate con soporte técnico de la UNDAV.',
  },
  {
    pregunta: '¿Dónde solicito un certificado?',
    respuesta: 'Los certificados se pueden solicitar desde SIU-Guaraní o en la sección "Certificados y Reportes" de esta app.',
  },
];

export default function PreguntasFrecuentes() {
  const [activa, setActiva] = useState<number | null>(null);

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiva(activa === index ? null : index);
  };

  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomText style={styles.titulo}>Preguntas Frecuentes</CustomText>

        {faqs.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => toggle(index)} style={styles.item}>
            <CustomText style={styles.pregunta}>{item.pregunta}</CustomText>
            {activa === index && (
              <CustomText style={styles.respuesta}>{item.respuesta}</CustomText>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomBar />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#0b254a',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#e3f0fb',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  pregunta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b5085',
  },
  respuesta: {
    marginTop: 10,
    fontSize: 15,
    color: '#333',
  },
});
