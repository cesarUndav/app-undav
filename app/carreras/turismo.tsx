// turismo.tsx

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
import { WebView } from 'react-native-webview';

export default function Turismo() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'turismo-plan-estudios.pdf': require('../../assets/docs/turismo-plan-estudios.pdf'),
    'turismo-plan-creditos.pdf': require('../../assets/docs/turismo-plan-creditos.pdf'),
    'turismo-postal-digital.pdf': require('../../assets/docs/turismo-postal-digital.pdf'),
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
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Licenciado/a en Turismo
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          El turismo en nuestros días es una experiencia de comunicación, ya sea con otros hombres, con la naturaleza o con manifestaciones culturales. Sus alcances cualitativos son trascendentales, y hoy vemos que se progresa no solo por lo que se tiene en las manos, sino por lo que se tiene en la mente.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Formar profesionales en investigación, gestión y desarrollo de productos y destinos turísticos innovadores, incorporando planificación, evaluación de proyectos, comercialización, comunicación y gestión de calidad en servicios turísticos sostenibles.
        </CustomText>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <CustomText style={styles.oracion}>
          El Licenciado en Turismo podrá ubicar el turismo en el contexto global actual, dominar marcos teóricos y metodológicos para desarrollar el turismo como agente socioeconómico y cultural regional y nacional.
        </CustomText>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity onPress={() => handleOpenPDF('turismo-plan-estudios.pdf')}>
            <CustomText style={styles.link}>• Descargar Plan de estudio</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('turismo-plan-creditos.pdf')}>
            <CustomText style={styles.link}>• Descargar Plan de crédito (Res. CS 276/2018)</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('turismo-postal-digital.pdf')}>
            <CustomText style={styles.link}>• Descargar Postal digital</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento, contacto y horarios',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Ambiente y Turismo</CustomText>
          <CustomText style={styles.oracion}>Decana: Dra. Natalia Cappelletti</CustomText>
          <CustomText style={styles.oracion}>Vicedecana: Mg. Leticia Estévez</CustomText>
          <CustomText style={styles.oracion}>Director de la Lic. en Turismo: Lic. Marcelo Pablo Reales</CustomText>
          <CustomText style={styles.oracion}>Oficina: Sede Piñeyro, 1º piso, 2º cuerpo</CustomText>
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
              originWhitelist={["*"]}
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
              <CustomText style={styles.fabText}>×</CustomText>
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
  fabContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
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
  contenido: { backgroundColor: '#b8bf30', padding: 16, borderBottomRightRadius: 20, borderTopWidth: 1, borderTopColor: 'white' },
  oracion: { marginBottom: 8, color: '#ffffff' },
  link: { color: '#ffffff', textDecorationLine: 'underline', marginBottom: 8, fontWeight: 'bold' },
});
