// app/carreras/higiene-seguridad.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import CustomText from '@/components/CustomText';
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';

export default function HigieneSeguridad() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'higiene-seguridad-plan-estudios.pdf': require('../../assets/docs/higiene-seguridad-plan-estudios.pdf'),
    'higiene-seguridad-postal-digital.pdf': require('../../assets/docs/higiene-seguridad-postal-digital.pdf'),
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
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity
            onPress={() => handleOpenPDF('higiene-seguridad-plan-estudios.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('higiene-seguridad-postal-digital.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Postal Digital
            </CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Licenciado/a en Higiene y Seguridad en el Trabajo
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la Carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Preparar profesionales con formación teórica y práctica para prevenir
          y gestionar riesgos laborales y ambientales, inspeccionar y eliminar
          factores de pérdida.
        </CustomText>
      ),
    },
    {
      titulo: '👤 Perfil del Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Profesional con conocimientos técnicos, científicos y de gestión para
          aplicar normativas en Higiene y Seguridad, resolver problemas y
          adaptarse a cambios tecnológicos.
        </CustomText>
      ),
    },
    {
      titulo: '📋 Requisitos de ingreso',
      contenido: (
        <View>
          {[
            'Técnico Universitario en Seguridad e Higiene de la Industria Mecánico-Automotriz',
            'Técnico Superior en Higiene y Seguridad Laboral',
            'Técnico en Higiene y Seguridad Alimentaria',
            'Técnico en Higiene y Seguridad del Trabajo',
            'Técnico Universitario en Gestión de Riesgos, Higiene y Seguridad en el Trabajo',
            'Técnico Universitario en Higiene y Seguridad',
          ].map((item, idx) => (
            <CustomText key={idx} style={styles.oracion}>
              • {item}
            </CustomText>
          ))}

          <CustomText style={styles.oracion}>
            Egresados de pregrado con mínimo 1600 hs y experiencia pueden ser
            admitidos previa evaluación.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            Departamento de Tecnología y Administración
          </CustomText>

          <CustomText style={styles.oracion}>
            Decano: Mg. Ing. Silvio Colombo
          </CustomText>

          <CustomText style={styles.oracion}>
            Vicedecana: Dra. María Cristina Kanobel
          </CustomText>

          <CustomText style={styles.oracion}>
            Contacto: ccc-hys@undav.edu.ar
          </CustomText>
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
                <ActivityIndicator size="large" style={styles.webviewLoading} />
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
    backgroundColor: '#e3a400',
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
    backgroundColor: '#fdc128',
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