// app/carreras/guia-turismo.tsx

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

export default function GuiaTurismo() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const pdfs: { [key: string]: any } = {
    'guia-turismo-plan-estudios.pdf': require('../../assets/docs/guia-turismo-plan-estudios.pdf'),
    'guia-turismo-plan-creditos.pdf': require('../../assets/docs/guia-turismo-plan-creditos.pdf'),
    'guia-turismo-postal-digital.pdf': require('../../assets/docs/guia-turismo-postal-digital.pdf'),
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
          Guía Universitario/a en Turismo
        </CustomText>
      ),
    },
    {
      titulo: '📘 Acerca de la carrera',
      contenido: (
        <CustomText style={styles.oracion}>
          El plan de estudios está diseñado para la formación en guiado,
          accesibilidad turística e interpretación del patrimonio en circuitos
          innovadores, incorporando comunicación y gestión de calidad en
          servicios turísticos sostenibles. Carga: 1728 horas reloj.
        </CustomText>
      ),
    },
    {
      titulo: '🎯 Objetivos de la carrera',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            • Formar profesionales capaces de construir y transmitir un discurso
            plural y valorativo a través de técnicas de comunicación.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Desarrollar capacidad de observación y teorización para promover
            juicio crítico y valoración del entorno.
          </CustomText>

          <CustomText style={styles.oracion}>
            • Generar relaciones interpersonales para conducir grupos en
            actividades organizadas y gestionar aspectos operativos del viaje.
          </CustomText>
        </View>
      ),
    },
    {
      titulo: '👤 Perfil del graduado',
      contenido: (
        <CustomText style={styles.oracion}>
          El egresado podrá desempeñarse en ámbitos públicos y privados
          brindando recepción, traslado asistido, coordinación y transmisión de
          información sociocultural, económica, histórica, geográfica y
          ambiental en visitas, excursiones y viajes.
        </CustomText>
      ),
    },
    {
      titulo: '📄 Planes y recursos',
      contenido: (
        <View>
          <TouchableOpacity
            onPress={() => handleOpenPDF('guia-turismo-plan-estudios.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de estudio
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('guia-turismo-plan-creditos.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Plan de crédito (Res. CS 106/2018)
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOpenPDF('guia-turismo-postal-digital.pdf')}
          >
            <CustomText weight="bold" style={styles.link}>
              • Descargar Postal digital
            </CustomText>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      titulo: '📍 Departamento, contacto y horarios',
      contenido: (
        <View>
          <CustomText style={styles.oracion}>
            Departamento de Ambiente y Turismo
          </CustomText>

          <CustomText style={styles.oracion}>
            Decana: Dra. Natalia Cappelletti
          </CustomText>

          <CustomText style={styles.oracion}>
            Vicedecana: Mg. Leticia Estévez
          </CustomText>

          <CustomText style={styles.oracion}>
            Director: Lic. Marcelo Pablo Reales
          </CustomText>

          <CustomText style={styles.oracion}>
            Oficina: Sede Piñeyro, 1º piso, 2º cuerpo
          </CustomText>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL('mailto:ambienteyturismo@undav.edu.ar')
            }
          >
            <CustomText weight="bold" style={[styles.oracion, styles.link]}>
              Contacto: ambienteyturismo@undav.edu.ar
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('tel:+54942292471')}>
            <CustomText weight="bold" style={[styles.oracion, styles.link]}>
              Teléfono: 4229-2471
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


const styles = crearCarreraStyles({
  colorBoton: '#9fa521',
  colorContenido: '#b8bf30',
});