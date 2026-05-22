// app/carreras/gestion-cultural.tsx

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

export default function GestionCultural() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'gestion-cultural-plan-estudios.pdf': require('../../assets/docs/gestion-cultural-plan-estudios.pdf'),
    'gestion-cultural-plan-creditos.pdf': require('../../assets/docs/gestion-cultural-plan-creditos.pdf'),
    'gestion-cultural-postal-digital.pdf': require('../../assets/docs/gestion-cultural-postal-digital.pdf'),
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
      titulo: '🎓 Títulos',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Técnico/a Universitario/a en Gestión Cultural
          </CustomText>

          <CustomText style={styles.oracion}>
            • Licenciado/a en Gestión Cultural
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Capacita al profesional productor y gestor de la cultura en
          producción, gestión y administración de servicios culturales, análisis
          e interpretación de recursos culturales.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos',
      contenido: (
        <CustomText style={styles.oracion}>
          Formar profesionales capaces de concebir, diseñar, gestionar y
          ejecutar políticas y proyectos culturales, asesorar en protección del
          patrimonio y promover identidades locales.
        </CustomText>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity
            onPress={() => handleOpenPDF('gestion-cultural-plan-estudios.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio (*)
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('gestion-cultural-plan-creditos.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de crédito (Res. CS 124/2015)
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('gestion-cultural-postal-digital.pdf')}
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
            Departamento de Cultura, Arte y Comunicación
          </CustomText>

          <CustomText style={styles.oracion}>
            Decano: Lic. Daniel Escribano
          </CustomText>

          <CustomText style={styles.oracion}>
            Vicedecana: Mg. Laura Calvelo
          </CustomText>

          <CustomText style={styles.oracion}>
            Directora: Lic. Úrsula Rucker
          </CustomText>

          <TouchableOpacity onPress={() => Linking.openURL('mailto:cac@undav.edu.ar')}>
            <CustomText weight="bold" style={[styles.oracion, styles.link]}>
              Contacto: cac@undav.edu.ar
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
    backgroundColor: '#158d9e',
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
    backgroundColor: '#30b7c4',
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