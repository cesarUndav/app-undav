// app/carreras/gerencia-empresas.tsx

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

export default function GerenciaEmpresas() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'regimen-SIED.pdf': require('../../assets/docs/regimen-SIED.pdf'),
    'gerencia-empresas-plan-estudios.pdf': require('../../assets/docs/gerencia-empresas-plan-estudios.pdf'),
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
            onPress={() => handleOpenPDF('gerencia-empresas-plan-estudios.pdf')}
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
          Licenciado/a en Gerencia de Empresas
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Formación de profesionales idóneos en planificación, dirección,
          marketing, recursos humanos y logística, con compromiso local y
          regional para pymes y empresas familiares.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          Preparar profesionales sólidos en administración, organización y
          control de procesos, con capacidad de análisis global de economía y
          finanzas empresariales.
        </CustomText>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Administrar y gerenciar empresas con técnicas administrativas.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Diseñar estrategias de recursos humanos, financieros y
            económicos.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Participar activamente en transformaciones organizacionales y
            sociales.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Analizar procesos y su vinculación con la realidad económica y
            política.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Trabajar con principios de justicia social, igualdad y
            solidaridad.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '📋 Requisitos de ingreso',
      contenido: (
        <CustomText style={styles.oracion}>
          Todas las personas con educación secundaria aprobada ingresan
          libremente; mayores de 25 años con evaluación acreditada por la
          universidad podrán hacerlo excepcionalmente.
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
            Coordinadora: Dra. Patricia Fernández
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