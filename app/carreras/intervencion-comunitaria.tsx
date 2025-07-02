// intervencion-comunitaria.tsx

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

export default function IntervencionComunitaria() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'regimen-SIED.pdf': require('../../assets/docs/regimen-SIED.pdf'),
    'intervencion-comunitaria-plan-estudios-nuevo.pdf': require('../../assets/docs/intervencion-comunitaria-plan-estudios-nuevo.pdf'),
    'intervencion-comunitaria-plan-estudios.pdf': require('../../assets/docs/intervencion-comunitaria-plan-estudios.pdf'),
    'intervencion-comunitaria-postal-digital.pdf': require('../../assets/docs/intervencion-comunitaria-postal-digital.pdf'),
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
          Técnico/a en Intervención Socio Comunitaria
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          La Tecnicatura en Intervención Socio Comunitaria forma técnicos con mirada comunitaria para reconstruir redes sociales y colaborar en la implementación de políticas públicas y acciones estatales y sociales.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Formar profesionales capaces de diseñar, implementar y gestionar proyectos socio comunitarios orientados al ejercicio de la ciudadanía plena.
        </CustomText>
      ),
    },
    {
      titulo: '👤 Perfil del egresado',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>• Contribuir a la gestión de dispositivos y acciones comunitarias en ámbitos públicos y de sociedad civil.</CustomText>
          <CustomText style={styles.oracion}>• Identificar y relevar condiciones, marcos institucionales y actores de la vida socio comunitaria.</CustomText>
          <CustomText style={styles.oracion}>• Interpretar políticas públicas de intervención.</CustomText>
          <CustomText style={styles.oracion}>• Planificar, administrar y evaluar programas socioculturales con indicadores de seguimiento.</CustomText>
          <CustomText style={styles.oracion}>• Asistir en estrategias de inclusión y promoción de ciudadanía en contextos de vulnerabilidad.</CustomText>
        </View>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity onPress={() => handleOpenPDF('regimen-SIED.pdf')}>
            <CustomText style={styles.link}>• Régimen administrativo EAD</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('intervencion-comunitaria-plan-estudios-nuevo.pdf')}>
            <CustomText style={styles.link}>• Descargar plan de estudio (Res. 437/2020)</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('intervencion-comunitaria-plan-estudios.pdf')}>
            <CustomText style={styles.link}>• Descargar plan de estudio (Res. 473/2011)</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('intervencion-comunitaria-postal-digital.pdf')}>
            <CustomText style={styles.link}>• Descargar Postal Digital</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Arquitectura, Diseño y Urbanismo</CustomText>
          <CustomText style={styles.oracion}>Decana: DIyS Lucrecia Piattelli</CustomText>
          <CustomText style={styles.oracion}>Vicedecano: Arq. Roberto Panosian</CustomText>
          <CustomText style={styles.oracion}>Coordinadora de la Tecnicatura: Lic. Viviana Celso</CustomText>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:arquitecturaydiseno@undav.edu.ar') }>
            <CustomText style={[styles.oracion, styles.link]}>Contacto: arquitecturaydiseno@undav.edu.ar</CustomText>
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
              renderLoading={() => <ActivityIndicator style={{ flex: 1 }} size="large" />}
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
            <TouchableOpacity onPress={() => toggleSection(index)} style={[styles.boton, activeSection === index && styles.botonExpandido]}>
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
  fab: { position: 'absolute', width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  fabText: { fontSize: 32, lineHeight: 32, color: '#fff', fontWeight: 'bold' },
  container: { flex: 1, padding: 15, gap: 8 },
  seccion: { elevation: 4 },
  boton: { backgroundColor: '#a6398a', padding: 16, height: 64, borderBottomRightRadius: 20 },
  botonExpandido: { borderBottomRightRadius: 0 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  contenido: { backgroundColor: '#bf55a8', padding: 16, borderBottomRightRadius: 20, borderTopWidth: 1, borderTopColor: 'white' },
  oracion: { marginBottom: 8, color: '#ffffff' },
  link: { color: '#ffffff', textDecorationLine: 'underline', marginBottom: 8, fontWeight: 'bold' },
});
