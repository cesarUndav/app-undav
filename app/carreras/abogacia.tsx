// app/carreras/abogacia.tsx

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

export default function Abogacia() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'abogacia-plan-estudios-transicion.pdf': require('../../assets/docs/abogacia-plan-estudios-transicion.pdf'),
    'abogacia-plan-estudios-nuevo.pdf': require('../../assets/docs/abogacia-plan-estudios-nuevo.pdf'),
    'abogacia-plan-estudios.pdf': require('../../assets/docs/abogacia-plan-estudios.pdf'),
    'abogacia-postal-digital.pdf': require('../../assets/docs/abogacia-postal-digital.pdf'),
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
          Abogado/a
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          La complejización de la vida social y transformaciones culturales
          demandan saberes jurídicos e intervenciones estatales, haciendo
          indispensable formarse en Derecho Público, Gestión Pública y
          Administración de Justicia.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Fomentar la vocación por el servicio público.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Construir valores democráticos y ciudadanía.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Capacitar en derecho público y gestión judicial.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Promover compromiso con el interés público.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Articular enseñanza, investigación y extensión.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <CustomText style={styles.oracion}>
          Egresado con mirada transdisciplinaria del Derecho, consciente de su
          rol público y capaz de intervenir complejamente en la sociedad y en el
          Estado.
        </CustomText>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity
            onPress={() =>
              handleOpenPDF('abogacia-plan-estudios-transicion.pdf')
            }
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio - Plan de transición
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('abogacia-plan-estudios-nuevo.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio - Nuevo plan
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('abogacia-plan-estudios.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('abogacia-postal-digital.pdf')}
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
            Directora de Abogacía: Mg. Milagros Rayes
          </CustomText>

          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:sociales@undav.edu.ar')}
          >
            <CustomText style={styles.oracion}>
              Contacto: sociales@undav.edu.ar
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
    backgroundColor: '#ca2627',
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
    backgroundColor: '#ee3b4d',
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