// higiene-seguridad-industria-automotriz.tsx

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

export default function HigieneSeguridadIndustriaAutomotriz() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'regimen-SIED.pdf': require('../../assets/docs/regimen-SIED.pdf'),
    'higiene-seguridad-industria-automotriz-plan-estudios.pdf': require('../../assets/docs/higiene-seguridad-industria-automotriz-plan-estudios.pdf'),
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
          <TouchableOpacity onPress={() => handleOpenPDF('regimen-SIED.pdf')}>
            <CustomText style={styles.link}>• Régimen administrativo EAD</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('higiene-seguridad-industria-automotriz-plan-estudios.pdf')}>
            <CustomText style={styles.link}>• Descargar Plan de estudio</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Técnico/a Universitario/a en Seguridad e Higiene de la Industria Mecánico-Automotriz
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Tecnicatura que forma especialistas en normas y prácticas de seguridad e higiene para el sector automotriz, integrando calidad, medio ambiente y protección de trabajadores.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>• Diseñar, implementar y evaluar proyectos de seguridad e higiene.</CustomText>
          <CustomText style={styles.oracion}>• Aplicar medidas de prevención y tratamiento en la industria automotriz.</CustomText>
          <CustomText style={styles.oracion}>• Intervenir en la resolución de problemas de higiene y seguridad.</CustomText>
        </View>
      ),
    },
    {
      titulo: '👤 Perfil del egresado',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>• Gestionar proyectos de seguridad e higiene en industrias mecánicas.</CustomText>
          <CustomText style={styles.oracion}>• Evaluar impactos ambientales y sociales del sector.</CustomText>
          <CustomText style={styles.oracion}>• Coordinar esfuerzos en consultoría y estudios de factibilidad.</CustomText>
        </View>
      ),
    },
    {
      titulo: '📋 Requisitos de ingreso',
      contenido: (
        <CustomText style={styles.oracion}>
          Educación secundaria completa; mayores de 25 años con experiencia acreditada pueden ingresar mediante evaluación conforme a la Ley de Educación Superior.
        </CustomText>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Tecnología y Administración</CustomText>
          <CustomText style={styles.oracion}>Decano: Mg. Ing. Silvio Colombo</CustomText>
          <CustomText style={styles.oracion}>Vicedecana: Dra. María Cristina Kanobel</CustomText>
          <CustomText style={styles.oracion}>Coordinadora: Dra. Jazmín Paint</CustomText>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:dtya@undav.edu.ar') }>
            <CustomText style={[styles.oracion, styles.link]}>Contacto: dtya@undav.edu.ar</CustomText>
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
            <WebView source={{ uri: pdfUri }} style={styles.webview} originWhitelist={["*"]} startInLoadingState renderLoading={() => <ActivityIndicator size="large" style={{ flex: 1 }} />} />
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
  boton: { backgroundColor: '#e3a400', padding: 16, height: 64, borderBottomRightRadius: 20 },
  botonExpandido: { borderBottomRightRadius: 0 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  contenido: { backgroundColor: '#fdc128', padding: 16, borderBottomRightRadius: 20, borderTopWidth: 1, borderTopColor: 'white' },
  oracion: { marginBottom: 8, color: '#ffffff' },
  link: { color: '#ffffff', textDecorationLine: 'underline', marginBottom: 8, fontWeight: 'bold' },
});
