// comunicacion-politica-ccc.tsx

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

export default function ComunicacionPolitica() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'regimen-SIED.pdf': require('../../assets/docs/regimen-SIED.pdf'),
    'comunicacion-politica-ccc-plan-estudios.pdf': require('../../assets/docs/comunicacion-politica-ccc-plan-estudios.pdf'),
    'comunicacion-politica-ccc-postal-digital.pdf': require('../../assets/docs/comunicacion-politica-ccc-postal-digital.pdf'),
  };

  const toggleSection = (index: number) => setActiveSection(prev => prev === index ? null : index);

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
          <TouchableOpacity onPress={() => handleOpenPDF('comunicacion-politica-ccc-plan-estudios.pdf')}>
            <CustomText style={styles.link}>• Descargar Plan de estudio</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenPDF('comunicacion-politica-ccc-postal-digital.pdf')}>
            <CustomText style={styles.link}>• Descargar Postal Digital</CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Licenciado/a en Comunicación Política
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          El CCC abre un espacio de formación federal y equitativa, emergente de necesidades de actualización para graduados de la Tecnicatura en Política, Gestión y Comunicación, enfocándose en pensamiento conceptual y competencias adaptativas.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Formar profesionales capaces de diseñar, gestionar y evaluar proyectos de comunicación política orientados a políticas públicas a nivel nacional.
        </CustomText>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <CustomText style={styles.oracion}>
          Profesional humanístico y científico, experto en estrategias de comunicación política para difundir contenidos y colaborar en la gestión de políticas públicas.
        </CustomText>
      ),
    },
    {
      titulo: '📋 Alcances del título',
      contenido: (
        <View>
          {[
            'Desarrollar y asesorar campañas de imagen y opinión pública.',
            'Producir y difundir piezas comunicacionales en cualquier medio.',
            'Diseñar y ejecutar estrategias para organismos públicos y privados.',
            'Realizar análisis de opinión pública y sondeos de opinión.',
            'Elaborar y evaluar mensajes y discursos políticos.',
            'Conducir investigaciones y gestionar proyectos políticos comunicacionales.',
            'Aplicar innovación tecnológica en comunicación política.',
            'Participar en producción de programas, campañas y eventos políticos.',
            'Gestionar recursos y presupuestos en emprendimientos de comunicación política.',
            'Producir conocimiento en comunicación política y participar en equipos de investigación.',
          ].map((item, idx) => (
            <CustomText key={idx} style={styles.oracion}>• {item}</CustomText>
          ))}
        </View>
      ),
    },
    {
      titulo: '📋 Condiciones de ingreso',
      contenido: (
        <View>
          {[
            'Técnico en Política, Gestión y Comunicación.',
            'Técnico en Política, Comunicación y Educación.',
            'Técnico en Periodismo.',
            'Técnico Superior en Comunicación Digital.',
            'Técnico en Comunicación Social.',
            'Técnico en Administración y Gestión de Políticas Públicas.',
            'Técnico en Asuntos Municipales.',
            'Técnico en Administración y Gestión Pública.',
            'Técnico en Gestión Municipal con orientación en Desarrollo Local.',
            'Técnico Superior en Gestión Administrativa y Políticas Públicas.',
            'Técnico en Gestión Jurídica con Orientación en Gobierno Local.',
            'Técnico Universitario en Gestión Jurídica.',
            'Técnico Superior en Gestión Municipal.',
            'Técnico Universitario en Gestión de Medios Digitales.',
            'Técnico Universitario en Gestión de Gobierno.',
            'Técnico Universitario en Gobierno Municipal y Desarrollo Local.',
            'Técnico en Gestión de Políticas Públicas.',
            'Técnico Superior en Comunicación Digital y Multimedial (EaD).',
            'Técnico Superior en Administración de Gestión y Políticas Culturales (CABA).',
            'Técnico Superior en Gestión Cultural de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires.',
          ].map((item, idx) => (
            <CustomText key={idx} style={styles.oracion}>• {item}</CustomText>
          ))}
          <CustomText style={styles.oracion}>
            Todas las titulaciones deben tener mínima carga horaria de 1600 hs. y duración de al menos 2.5 años.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento y contacto',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>Departamento de Cultura, Arte y Comunicación</CustomText>
          <CustomText style={styles.oracion}>Decano: Lic. Daniel Escribano</CustomText>
          <CustomText style={styles.oracion}>Vicedecana: Mg. Laura Calvelo</CustomText>
          <CustomText style={styles.oracion}>Director: Lic. Walter Temporelli</CustomText>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:cac@undav.edu.ar') }>
            <CustomText style={[styles.oracion, styles.link]}>Contacto: cac@undav.edu.ar</CustomText>
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
            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.fab, { bottom: insets.bottom + 16, right: 16 }]}>
              <CustomText style={styles.fabText}>×</CustomText>
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
  boton: { backgroundColor: '#158d9e', padding: 16, height: 64, borderBottomRightRadius: 20 },
  botonExpandido: { borderBottomRightRadius: 0 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  contenido: { backgroundColor: '#30b7c4', padding: 16, borderBottomRightRadius: 20, borderTopWidth: 1, borderTopColor: 'white' },
  oracion: { marginBottom: 8, color: '#ffffff' },
  link: { color: '#ffffff', textDecorationLine: 'underline', marginBottom: 8, fontWeight: 'bold' },
});
