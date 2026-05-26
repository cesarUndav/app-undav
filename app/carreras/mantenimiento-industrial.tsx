// app/carreras/mantenimiento-industrial.tsx

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

export default function MantenimientoIndustrial() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'regimen-SIED.pdf': require('../../assets/docs/regimen-SIED.pdf'),
    'mantenimiento-industrial-plan-estudios.pdf': require('../../assets/docs/mantenimiento-industrial-plan-estudios.pdf'),
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
          <TouchableOpacity onPress={() => handleOpenPDF('regimen-SIED.pdf')}>
            <CustomText weight="bold" style={styles.link}>
              • Régimen administrativo EAD
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleOpenPDF('mantenimiento-industrial-plan-estudios.pdf')
            }
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio
            </CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '🎓 Título',
      contenido: (
        <CustomText style={styles.oracion}>
          Técnico/a Universitario/a en Mantenimiento Industrial del Sector
          Automotriz
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Formación universitaria de técnicos para atender la complejidad y el
          crecimiento del sector automotriz mediante prácticas profesionalizantes
          y conocimiento integral del mantenimiento industrial.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Resolver problemas de mantenimiento y reparación de equipos
            mecánicos, hidráulicos, neumáticos y microelectrónicos.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Colaborar en programas de mantenimiento preventivo, predictivo y
            correctivo.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Elaborar planes de acción para la gestión de mantenimiento
            industrial.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '👤 Perfil del egresado',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Intervenir en mantenimiento industrial y diagnóstico de fallas.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Participar en equipos de trabajo y coordinar programas de
            mantenimiento.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Adaptar tecnologías 4.0 a procesos de mantenimiento.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '📋 Requisitos de ingreso',
      contenido: (
        <CustomText style={styles.oracion}>
          Educación secundaria completa; mayores de 25 años pueden ingresar
          mediante evaluación de experiencia laboral según Ley de Educación
          Superior.
        </CustomText>
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
            Coordinadora: Dra. Jazmín Paint
          </CustomText>

          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:dtya@undav.edu.ar')}
          >
            <CustomText weight="bold" style={[styles.oracion, styles.link]}>
              Contacto: dtya@undav.edu.ar
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

const styles = crearCarreraStyles({
  colorBoton: '#e3a400',
  colorContenido: '#fdc128',
});