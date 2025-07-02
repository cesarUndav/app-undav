// ciencias-ambientales.tsx

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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import CustomText from '@/components/CustomText';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

export default function CienciasAmbientales() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'ciencias-ambientales-plan-estudios.pdf': require('../../assets/docs/ciencias-ambientales-plan-estudios.pdf'),
    'ciencias-ambientales-plan-creditos.pdf': require('../../assets/docs/ciencias-ambientales-plan-creditos.pdf'),
    'ciencias-ambientales-postal-digital.pdf': require('../../assets/docs/ciencias-ambientales-postal-digital.pdf'),
  };

  const toggleSection = (index: number) => {
    setActiveSection(prev => (prev === index ? null : index));
  };

  const handleOpenPDF = async (fileName: string) => {
    try {
      const module = pdfs[fileName];
      if (!module) throw new Error(`Archivo PDF "${fileName}" no encontrado.`);
      const asset = Asset.fromModule(module);
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      if (!uri) throw new Error('URI local no disponible');

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
      titulo: '🎓 Títulos y Duración',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>• Título de grado: Licenciado/a en Ciencias Ambientales</CustomText>
          <CustomText style={styles.oracion}>• Título intermedio: Técnico/a en Ciencias Ambientales</CustomText>
          <CustomText style={styles.oracion}>• Duración: 4 años y medio</CustomText>
        </View>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          El objetivo de esta carrera es formar especialistas comprometidos y competentes, con conocimientos sólidos...
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>a) Investigar los procesos...</CustomText>
          <CustomText style={styles.oracion}>b) Evaluar los factores...</CustomText>
          <CustomText style={styles.oracion}>c) Gestionar la biodiversidad...</CustomText>
          <CustomText style={styles.oracion}>d) Planificar y gestionar el territorio...</CustomText>
        </View>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity onPress={() => handleOpenPDF('ciencias-ambientales-plan-estudios.pdf')}>
            <CustomText style={styles.oracion}>• Plan de estudios</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('ciencias-ambientales-plan-creditos.pdf')}>
            <CustomText style={styles.oracion}>• Plan de créditos</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('ciencias-ambientales-postal-digital.pdf')}>
            <CustomText style={styles.oracion}>• Postal digital</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Ambiente y Turismo</CustomText>
          <CustomText style={styles.oracion}>Decana: Dra. Natalia Cappelletti</CustomText>
          <CustomText style={styles.oracion}>Vicedecana: Mg. Leticia Estévez</CustomText>
          <CustomText style={styles.oracion}>Director: Ing. Sergio Cataldo</CustomText>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:ambienteyturismo@undav.edu.ar') }>
            <CustomText style={[styles.oracion, styles.link]}>Contacto: ambienteyturismo@undav.edu.ar</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+54942292471') }>
            <CustomText style={[styles.oracion, styles.link]}>Teléfono: 4229-2471</CustomText>
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
              renderLoading={() => <ActivityIndicator style={{ flex: 1 }} size="large" />}
            />
          )}
          <View style={styles.fabContainer} pointerEvents="box-none">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                styles.fab,
                { bottom: insets.bottom + 16, right: 16 }
              ]}
            >
              <CustomText style={styles.fabText}>x</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        {secciones.map((seccion, index) => (
          <View key={index} style={styles.seccion}>
            <TouchableOpacity
              onPress={() => toggleSection(index)}
              style={[styles.boton, activeSection === index && styles.botonExpandido]}
            >
              <CustomText style={styles.titulo}>{seccion.titulo}</CustomText>
            </TouchableOpacity>
            <Collapsible collapsed={activeSection !== index}>
              <View style={styles.contenido}>{seccion.contenido}</View>
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
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
  fabText: { fontSize: 32, lineHeight: 32, color: '#fff', fontWeight: 'bold' },
  container: { flex: 1, padding: 15, gap: 8 },
  seccion: { elevation: 4 },
  boton: { backgroundColor: '#9fa521', padding: 16, height: 64, borderBottomRightRadius: 20 },
  botonExpandido: { borderBottomRightRadius: 0 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  contenido: { backgroundColor: '#b8bf30', padding: 16, borderBottomRightRadius: 20,     borderTopWidth: 1,   borderTopColor: "white"},
  oracion: { marginBottom: 8, color: '#ffffff' },
  link: { color: '#ffffff', textDecorationLine: 'underline', marginBottom: 8, fontWeight: 'bold' },
});
