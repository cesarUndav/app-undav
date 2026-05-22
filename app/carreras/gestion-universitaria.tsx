// app/carreras/gestion-universitaria.tsx

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { crearCarreraStyles } from '@/theme/carrerasStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import CustomText from '@/components/CustomText';
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';

export default function GestionUniversitaria() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'gestion-universitaria-plan-estudios.pdf': require('../../assets/docs/gestion-universitaria-plan-estudios.pdf'),
    'gestion-universitaria-postal-digital.pdf': require('../../assets/docs/gestion-universitaria-postal-digital.pdf'),
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
          Técnico/a en Gestión Universitaria
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Formar Técnicos con conocimientos teóricos y tecnológicos para
            colaborar en la gestión universitaria.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Mejorar la inserción laboral y la promoción escalafonaria del
            personal no docente.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Optimizar la utilización de recursos para el mejoramiento
            institucional continuo.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <CustomText style={styles.oracion}>
          Integrará herramientas de análisis institucional y administración
          para colaborar en los procesos y procedimientos universitarios.
        </CustomText>
      ),
    },
    {
      titulo: '📋 Alcances',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Asistir en aspectos técnicos y administrativos de áreas
            específicas.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Colaborar en la gestión universitaria según requerimientos del
            área.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Seleccionar herramientas adecuadas a problemáticas profesionales.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity
            onPress={() =>
              handleOpenPDF('gestion-universitaria-plan-estudios.pdf')
            }
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleOpenPDF('gestion-universitaria-postal-digital.pdf')
            }
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Postal Digital
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
            Departamento de Ciencias Sociales
          </CustomText>

          <CustomText style={styles.oracion}>
            Decana: Mg. Anabella Lucardi
          </CustomText>

          <CustomText style={styles.oracion}>
            Vicedecano: Prof. Facundo Harguinteguy
          </CustomText>

          <CustomText style={styles.oracion}>
            Directora de la Tecnicatura: Dra. Ana Laura Ruggiero
          </CustomText>

          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:gremioanduna@gmail.com')}
          >
            <CustomText style={styles.oracion}>
              Contacto: gremioanduna@gmail.com
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

const styles = crearCarreraStyles({
  colorBoton: '#ca2627',
  colorContenido: '#ee3b4d',
});