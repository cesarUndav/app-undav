// actividad-fisica-ccc.tsx

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

export default function ActividadFisicaCCC() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'actividad-fisica-ccc-plan-estudios.pdf': require('../../assets/docs/actividad-fisica-ccc-plan-estudios.pdf'),
    'actividad-fisica-ccc-postal-digital.pdf': require('../../assets/docs/actividad-fisica-ccc-postal-digital.pdf'),
    'actividad-fisica-ccc-plan-creditos.pdf': require('../../assets/docs/actividad-fisica-ccc-plan-creditos.pdf'),
  };

  const toggleSection = (index: number) => setActiveSection(prev => (prev === index ? null : index));

  const handleOpenPDF = async (fileName: string) => {
    try {
      const module = pdfs[fileName];
      if (!module) throw new Error(`Archivo PDF "${fileName}" no encontrado.`);
      const asset = Asset.fromModule(module);
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      if (!uri) throw new Error('URI local no disponible');
      const sourceUri = Platform.OS === 'android'
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
          <TouchableOpacity onPress={() => handleOpenPDF('actividad-fisica-ccc-plan-estudios.pdf')}>
            <CustomText style={styles.link}>• Descargar Plan de estudio</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('actividad-fisica-ccc-postal-digital.pdf')}>
            <CustomText style={styles.link}>• Descargar Postal Digital</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('actividad-fisica-ccc-plan-creditos.pdf')}>
            <CustomText style={styles.link}>• Descargar Plan de créditos (Res. CS 687/2022)</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Licenciado/a en Actividad Física y Deporte
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Ciclo de Complementación Curricular orientado a formar profesionales en gestión de organizaciones deportivas con liderazgo y análisis crítico.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos',
      contenido: (
        <CustomText style={styles.oracion}>
          Desarrollar competencias para gestionar y conducir eficientemente organizaciones deportivas, promoviendo una visión integral del sujeto y el deporte.
        </CustomText>
      ),
    },
    {
      titulo: '📋 Requisitos',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>• Certificado analítico de Profesor de Educación Física (4 años).</CustomText>
          <CustomText style={styles.oracion}>• Ficha de inscripcion.</CustomText>
          <CustomText style={styles.oracion}>• Certificado de aptitud físico-médica.</CustomText>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Salud y Actividad Física</CustomText>
          <CustomText style={styles.oracion}>Decana: Mg. Karina Torres</CustomText>
          <CustomText style={styles.oracion}>Vicedecano: Lic. Héctor Donato Ortiz</CustomText>
          <CustomText style={styles.oracion}>Directora CCC: Mg. Roxana González</CustomText>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:deptosalud@undav.edu.ar') }>
            <CustomText style={[styles.oracion, styles.link]}>Comunicación institucional: deptosalud@undav.edu.ar</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:saludenfermeria@undav.edu.ar') }>
            <CustomText style={[styles.oracion, styles.link]}>Consultas de carreras: saludenfermeria@undav.edu.ar</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.wrapper}>
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {pdfUri && (
            <WebView
              source={{ uri: pdfUri }}
              style={styles.webview}
              originWhitelist={["*"]}
              startInLoadingState
              renderLoading={() => <ActivityIndicator size="large" style={{ flex: 1 }} />}
            />
          )}
          <View style={styles.fabContainer} pointerEvents="box-none">
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.fab, { bottom: insets.bottom + 16, right: 16 }]}>              <CustomText style={styles.fabText}>×</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        {secciones.map((seccion, index) => (
          <View key={index} style={styles.seccion}>
            <TouchableOpacity onPress={() => toggleSection(index)} style={[styles.boton, activeSection === index && styles.botonExpandido]}>              <CustomText style={styles.titulo}>{seccion.titulo}</CustomText>
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
  fab: { position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  fabText: { fontSize: 32, lineHeight: 32, color: '#fff', fontWeight: 'bold' },
  container: { flex: 1, padding: 15, gap: 8 },
  seccion: { elevation: 4 },
  boton: { backgroundColor: '#f47d21', padding: 16, height: 64, borderBottomRightRadius: 20 },
  botonExpandido: { borderBottomRightRadius: 0 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  contenido: { backgroundColor: '#fd934b', padding: 16, borderBottomRightRadius: 20, borderTopWidth: 1, borderTopColor: 'white' },
  oracion: { marginBottom: 8, color: '#ffffff' },
  link: { color: '#ffffff', textDecorationLine: 'underline', marginBottom: 8, fontWeight: 'bold' },
});
