// app/carreras/arquitectura.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import CustomText from '@/components/CustomText';
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';

export default function Arquitectura() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'arquitectura-plan-estudios.pdf': require('../../assets/docs/arquitectura-plan-estudios.pdf'),
    'arquitectura-postal-digital.pdf': require('../../assets/docs/arquitectura-postal-digital.pdf'),
  };

  const toggleSection = (index: number) => {
    setActiveSection((prev) => (prev === index ? null : index));
  };

  const handleOpenPDF = async (fileName: string) => {
    try {
      const module = pdfs[fileName];

      if (!module) {
        throw new Error(`Archivo PDF "${fileName}" no encontrado.`);
      }

      const asset = Asset.fromModule(module);
      await asset.downloadAsync();

      const uri = asset.localUri || asset.uri;

      if (!uri) {
        throw new Error('URI local no disponible');
      }

      const sourceUri =
        Platform.OS === 'android'
          ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(uri)}`
          : uri;

      setPdfUri(sourceUri);
      setModalVisible(true);
    } catch (error) {
      console.error('Error abriendo PDF:', error);
      Alert.alert('Error', 'No se pudo cargar el PDF.');
    }
  };

  const secciones = [
    {
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Arquitecto/a
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          El desafío contemporáneo en la Arquitectura implica posibilitar un
          espacio habitable en lugares dignos y con materiales que aporten a la
          sustentabilidad, dando respuesta a demandas sociales mediante
          propuestas arquitectónicas y urbanas en su contexto histórico, social,
          económico y ambiental.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Formar profesionales con sólida formación teórica y práctica para el
          diseño, planificación y gestión de obras, integrando aspectos legales,
          éticos y perspectivas sistémicas para la colaboración
          interdisciplinaria.
        </CustomText>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <CustomText style={styles.oracion}>
          Desarrollará tareas de proyectista, director de obra, asesor y crítico
          en ámbitos públicos y privados, adaptando el ambiente a necesidades
          humanas, gestionando espacios habitables, planeamiento urbano y
          patrimonio arquitectónico.
        </CustomText>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity
            onPress={() => handleOpenPDF('arquitectura-plan-estudios.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('arquitectura-postal-digital.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Postal digital
            </CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            Departamento de Arquitectura, Diseño y Urbanismo
          </CustomText>

          <CustomText style={styles.oracion}>
            Decana: DIyS Lucrecia Piattelli
          </CustomText>

          <CustomText style={styles.oracion}>
            Vicedecano: Arq. Roberto Panosian
          </CustomText>

          <CustomText style={styles.oracion}>
            Director de Arquitectura: Arq. Raúl Bernasconi
          </CustomText>

          <CustomText style={styles.oracion}>
            Coordinador Académico: Arq. Roberto Panosian
          </CustomText>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL('mailto:arquitecturaydiseno@undav.edu.ar')
            }
          >
            <CustomText weight="bold" style={[styles.oracion, styles.link]}>
              Contacto: arquitecturaydiseno@undav.edu.ar
            </CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {pdfUri && (
            <WebView
              source={{ uri: pdfUri }}
              style={styles.webview}
              originWhitelist={['*']}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator style={styles.webviewLoading} size="large" />
              )}
            />
          )}

          <View style={styles.fabContainer} pointerEvents="box-none">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                styles.fab,
                {
                  bottom: insets.bottom + 16,
                  right: 16,
                },
              ]}
            >
              <CustomText weight="bold" style={styles.fabText}>
                ×
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        {secciones.map((seccion, index) => (
          <View key={index} style={styles.seccion}>
            <TouchableOpacity
              onPress={() => toggleSection(index)}
              style={[
                styles.boton,
                activeSection === index && styles.botonExpandido,
              ]}
            >
              <CustomText weight="bold" style={styles.titulo}>
                {seccion.titulo}
              </CustomText>
            </TouchableOpacity>

            <Collapsible collapsed={activeSection !== index}>
              <View style={styles.contenido}>
                {seccion.contenido}
              </View>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 32,
    lineHeight: 32,
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 15,
    gap: 8,
  },
  seccion: {
    elevation: 4,
  },
  boton: {
    backgroundColor: '#a6398a',
    padding: 16,
    height: 64,
    borderBottomRightRadius: 20,
  },
  botonExpandido: {
    borderBottomRightRadius: 0,
  },
  titulo: {
    color: 'white',
    fontSize: 16,
  },
  contenido: {
    backgroundColor: '#bf55a8',
    padding: 16,
    borderBottomRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  oracion: {
    marginBottom: 8,
    color: '#ffffff',
  },
  link: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
});