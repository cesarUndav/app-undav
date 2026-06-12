// app/generar-certificado.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TextInput, Platform, ScrollView, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useRouter } from 'expo-router';

// Componentes del Toolkit de Diseño
import CustomText from '@/components/CustomText';
import BotonTexto from '@/components/BotonTexto';
import { negroAzulado, azulLogoUndav, azulMedioUndav } from '@/constants/Colors';
import { infoBaseUsuarioActual } from '@/data/apiAppUndav';
import * as FileSystem from 'expo-file-system/legacy'; 
import { Asset } from 'expo-asset';
import FondoGradiente from '@/components/FondoGradiente';

const logoUndavAsset = Asset.fromModule(require('../assets/images/logoundav.png')); 
const linkCertificadoExamen = "https://docs.google.com/document/d/1NGOoRhWOAubZEhG0EzOjhquI1bIKpYwE/edit#heading=h.gjdgxs";
const STORAGE_KEY_PROPUESTA = '@indice_propuesta_seleccionada'; 

interface DatosCertificado {
  tipoExamen: string;
  materia: string;
  diaExamen: string;
  mesExamen: string;
  anioExamen: string;
}

export default function GeneradorCertificado() {
  const router = useRouter(); 
  const [materiaInput, setMateriaInput] = useState('');
  const [tipoExamen, setTipoExamen] = useState<'parcial' | 'final'>('parcial');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [indicePropuesta, setIndicePropuesta] = useState<number>(0);
  const [cargandoPreferencia, setCargandoPreferencia] = useState(true);

  useEffect(() => {
    const cargarPropuestaGuardada = async () => {
      try {
        const guardado = await AsyncStorage.getItem(STORAGE_KEY_PROPUESTA);
        if (guardado !== null) {
          const indexParsed = parseInt(guardado, 10);
          if (infoBaseUsuarioActual?.propuestas && indexParsed < infoBaseUsuarioActual.propuestas.length) {
            setIndicePropuesta(indexParsed);
          }
        }
      } catch (error) {
        console.error("❌ Error al cargar indice de propuesta:", error);
      } finally {
        setCargandoPreferencia(false);
      }
    };
    cargarPropuestaGuardada();
  }, []);

  const manejarCambioCarrera = async (value: number) => {
    setIndicePropuesta(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_PROPUESTA, value.toString());
    } catch (error) {
      console.error("❌ Error al guardar el índice de la propuesta:", error);
    }
  };

  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaSeleccionada(selectedDate);
    }
  };

  const fetchImageData = async (asset: Asset): Promise<string> => {
    try {
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      let uriLocal = asset.localUri || asset.uri;
      const base64Data = await FileSystem.readAsStringAsync(uriLocal, { encoding: 'base64' });
      return base64Data ? `data:image/png;base64,${base64Data}` : "";
    } catch (err) {
      return "";
    }
  };

  const generarHTMLCertificado = (datos: DatosCertificado, fechaEmisionTexto: string, esPlantillaVacia: boolean, urlLogo: string) => {
    const renderCampo = (valorReal: string) => 
      esPlantillaVacia ? `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` : valorReal;
    const carreraNombre = infoBaseUsuarioActual?.propuestas?.[indicePropuesta]?.nombre || "Carrera no especificada";

    return `
      <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <style>
            @page { size: A4; margin: 3cm 2.5cm 3cm 2.5cm; }
            body { font-family: 'Arial', sans-serif; color: #000000; line-height: 2; font-size: 12pt; }
            .header-undav { margin-bottom: 50px; }
            .logo-institucional { height: 75px; width: auto; display: block; }
            .titulo-documento { text-align: center; font-size: 16pt; font-weight: bold; margin-top: 40px; margin-bottom: 50px; text-transform: uppercase; }
            .certifico-label { font-size: 13pt; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; }
            .cuerpo-texto { text-align: justify; font-size: 12pt; margin-bottom: 40px; }
            .campo-relleno { font-weight: bold; border-bottom: 1px solid #000000; padding: 0 4px; display: inline; }
            .tabla-firmas { width: 100%; margin-top: 80px; border-collapse: collapse; }
            .col-firma { width: 50%; vertical-align: bottom; text-align: center; }
            .linea-punteada { border-top: 1px dashed #000; width: 85%; margin: 0 auto 8px auto; }
            .aclaracion { font-size: 10pt; color: #333333; line-height: 1.4; }
            .sello-recuadro { border: 1px dashed #999; width: 130px; height: 130px; margin: 0 auto; line-height: 130px; text-align: center; font-size: 10pt; color: #666; text-transform: uppercase; }
            </style>
        </head>
        <body>
            <div class="header-undav"><img src="${urlLogo}" class="logo-institucional" /></div>
            <div class="titulo-documento">Certificado de Evaluación</div>
            <div class="certifico-label">CERTIFICO:</div>
            <div class="cuerpo-texto">
            Que <span class="campo-relleno">${renderCampo(infoBaseUsuarioActual.nombreCompleto.toUpperCase())}</span> 
            Legajo Nº <span class="campo-relleno">${renderCampo(infoBaseUsuarioActual.legajo)}</span>, 
            DNI <span class="campo-relleno">${renderCampo(infoBaseUsuarioActual.documento)}</span>, estudiante de la Universidad de Avellaneda,
            ha rendido el examen <span class="campo-relleno">${renderCampo(datos.tipoExamen.charAt(0).toUpperCase() + datos.tipoExamen.slice(1))}</span> correspondiente a la asignatura 
            <span class="campo-relleno">${renderCampo(datos.materia)}</span> de la carrera <span class="campo-relleno">${renderCampo(carreraNombre)}</span>, 
            el día <span class="campo-relleno">${renderCampo(datos.diaExamen)}</span> del mes de <span class="campo-relleno">${renderCampo(datos.mesExamen)}</span> del año <span class="campo-relleno">${datos.anioExamen}</span>.
            </div>
            <table class="tabla-firmas">
            <tr>
                <td class="col-firma"><div class="sello-recuadro">Sello UNDAV</div></td>
                <td class="col-firma"><div class="linea-punteada"></div><div class="aclaracion"><strong>Firma autorizada</strong><br>(docente a cargo)</div></td>
            </tr>
            </table>
        </body>
        </html>
    `;
  };
  
  const compilarPDF = async (esPlantillaVacia: boolean) => {
    let nombreMateriaFinal = materiaInput.trim();

    if (!esPlantillaVacia) {
      if (!nombreMateriaFinal) {
        Alert.alert("Campo Obligatorio", "Por favor, ingresá el nombre de la asignatura.");
        return;
      }
      if (!fechaSeleccionada) {
        Alert.alert("Campo Obligatorio", "Por favor, seleccioná la fecha de la evaluación.");
        return;
      }
    }

    const mesesAño = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const objetoFecha = fechaSeleccionada || new Date();
    const diaExamen = String(objetoFecha.getDate()).padStart(2, '0');
    const mesExamen = mesesAño[objetoFecha.getMonth()];
    const anioExamen = String(objetoFecha.getFullYear());

    const conectores = ['de', 'del', 'en', 'y', 'para', 'la', 'los', 'las'];
    const materiaCapitalizada = nombreMateriaFinal
      .toLowerCase()
      .split(' ')
      .map((palabra, idWord) => (conectores.includes(palabra) && idWord !== 0) ? palabra : palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');

    const datosFinales: DatosCertificado = {
      tipoExamen: tipoExamen,
      materia: materiaCapitalizada || "Materia no especificada",
      diaExamen, mesExamen, anioExamen
    };

    const hoy = new Date();
    const textoFechaEmision = `${hoy.getDate()} de ${mesesAño[hoy.getMonth()]} de ${hoy.getFullYear()}`;
    const fechaIngresadaFilename = `${String(objetoFecha.getDate()).padStart(2, '0')}-${String(objetoFecha.getMonth() + 1).padStart(2, '0')}-${objetoFecha.getFullYear()}`;
    const materiaArchivo = esPlantillaVacia ? "SIN MATERIA" : materiaCapitalizada.toUpperCase();
    const nombreFinalDelArchivo = `Certificado Examen ${infoBaseUsuarioActual.nombreCompleto} ${materiaArchivo} ${fechaIngresadaFilename}.pdf`;

    try {
      const base64LogoInline = await fetchImageData(logoUndavAsset);
      const htmlContenido = generarHTMLCertificado(datosFinales, textoFechaEmision, esPlantillaVacia, base64LogoInline);
      const { uri } = await Print.printToFileAsync({ html: htmlContenido, base64: false });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: nombreFinalDelArchivo, UTI: 'com.adobe.pdf' });
      } else {
        Alert.alert("Error", "Compartir no está disponible en este dispositivo.");
      }
    } catch (error: any) {
      Alert.alert("Error Técnico", error?.message || "No se pudo procesar el PDF.");
    }
  };

  const irAlPlanoDeAtencion = () => {
    router.push({
      pathname: '/planos',
      params: {
        building: 'PineyroA',
        floor: 'PB',              
        zoneId: 'aula2' 
      }
    });
  };

  if (cargandoPreferencia || !infoBaseUsuarioActual?.propuestas || infoBaseUsuarioActual.propuestas.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color={azulMedioUndav} />
      </View>
    );
  }

  return (
    <FondoGradiente>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 📋 TARJETA DE FORMULARIO */}
        <View style={styles.cardFormulario}>
          <CustomText weight="bold" style={styles.labelInput}>Carrera:</CustomText>
          <View style={styles.contenedorPickerSelect}>
            <Picker
                selectedValue={indicePropuesta}
                onValueChange={(itemValue) => manejarCambioCarrera(Number(itemValue))}
                style={styles.pickerEstilo}
                dropdownIconColor={azulLogoUndav}
            >
                {infoBaseUsuarioActual.propuestas.map((p, index) => (
                  <Picker.Item key={p.propuesta || index} label={p.nombre} value={index} />
                ))}
            </Picker>
          </View>

          <CustomText weight="bold" style={styles.labelInput}>
            Nombre de la Asignatura: <CustomText style={{color: 'red'}}>*</CustomText>
          </CustomText>
          <TextInput
            style={styles.textInput}
            placeholder="Ej: Trabajo Social Comunitario I"
            placeholderTextColor="#999"
            value={materiaInput}
            onChangeText={setMateriaInput}
          />

          <CustomText weight="bold" style={styles.labelInput}>
            Tipo de Evaluación: <CustomText style={{color: 'red'}}>*</CustomText>
          </CustomText>
          <View style={styles.contenedorPickerSelect}>
            <Picker
              selectedValue={tipoExamen}
              onValueChange={(itemValue) => setTipoExamen(itemValue)}
              style={styles.pickerEstilo}
              dropdownIconColor={azulLogoUndav}
            >
              <Picker.Item label="Examen Parcial" value="parcial" />
              <Picker.Item label="Examen Final" value="final" />
            </Picker>
          </View>

          <CustomText weight="bold" style={styles.labelInput}>
            Fecha de la Evaluación: <CustomText style={{color: 'red'}}>*</CustomText>
          </CustomText>
          <View style={styles.contenedorFechaPicker}>
            <BotonTexto 
              label={fechaSeleccionada ? `Fecha: ${fechaSeleccionada.toLocaleDateString('es-AR')}` : "Seleccionar Fecha"}
              styleExtra={styles.botonPicker}
              onPressFunction={() => setShowDatePicker(true)}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={fechaSeleccionada || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeFecha}
            />
          )}
        </View>

        {/* 💡 TARJETA INSTRUCTIVA (UI Contextualizada y Prolija) */}
        <View style={styles.cardInstrucciones}>
          <CustomText weight="bold" style={styles.tituloInstrucciones}>
            ¿Cómo completar el trámite?
          </CustomText>
          
          <View style={styles.filaPaso}>
            <View style={styles.circuloNumeroCustom}><CustomText weight="bold" style={styles.textoNumeroCustom}>1</CustomText></View>
            <CustomText style={styles.textoPaso}>Descargá e <CustomText weight="bold">imprimí</CustomText> el documento PDF.</CustomText>
          </View>

          <View style={styles.filaPaso}>
            <View style={styles.circuloNumeroCustom}><CustomText weight="bold" style={styles.textoNumeroCustom}>2</CustomText></View>
            <CustomText style={styles.textoPaso}>Hacelo <CustomText weight="bold">firmar</CustomText> por el docente a cargo.</CustomText>
          </View>

          <View style={styles.filaPaso}>
            <View style={styles.circuloNumeroCustom}><CustomText weight="bold" style={styles.textoNumeroCustom}>3</CustomText></View>
            <View style={{ flex: 1, gap: 6 }}>
              <CustomText style={styles.textoPaso}>Presentalo para ser <CustomText weight="bold">sellado</CustomText> en la oficina de atención al estudiante.</CustomText>
            </View>
          </View>
                <BotonTexto 
                  label="Ver oficina en el plano"
                  color="#E67E22"
                  styleExtra={styles.botonPlanoIntegrado}
                  onPressFunction={irAlPlanoDeAtencion}
                />
        </View>

      </ScrollView>

      {/* 🚀 CONTENEDOR DE ACCIONES PRINCIPALES */}
      <View style={styles.contenedorAcciones}>
        <BotonTexto 
          label="Descargar certificado"
          color={azulLogoUndav}
          onPressFunction={() => compilarPDF(false)}
        />

        <BotonTexto 
          label="Descargar plantilla vacía"
          color='#555'
          onPressFunction={() => compilarPDF(true)}
        />
        
        <BotonTexto
          label="Ver certificado en Google Drive"
          styleExtra={{ borderBottomRightRadius: 20 }} 
          url={linkCertificadoExamen}
        />
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  cardFormulario: { backgroundColor: '#FFFFFF', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, gap: 10 },
  labelInput: { fontSize: 13, color: negroAzulado },
  contenedorPickerSelect: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: '#FAFAFA', overflow: 'hidden', height: 42, justifyContent: 'center' },
  pickerEstilo: { width: '100%', color: '#333', backgroundColor: 'transparent', ...Platform.select({ android: { height: 55, marginTop: -3 }, ios: { height: 42 } }) },
  textInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#333', backgroundColor: '#FAFAFA' },
  contenedorFechaPicker: { alignItems: 'flex-start', width: '100%'},
  botonPicker: { backgroundColor: azulLogoUndav, paddingHorizontal: 10, borderRadius: 8, height: 45 },
  
  // Estilos de la Tarjeta Instructiva de Pasos
  cardInstrucciones: { backgroundColor: '#F4F7FA', borderRadius: 15, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  tituloInstrucciones: { fontSize: 15, color: azulLogoUndav, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.3 },
  filaPaso: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10 },
  circuloNumeroCustom: { width: 22, height: 22, borderRadius: 11, backgroundColor: azulMedioUndav, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  textoNumeroCustom: { color: '#FFF', fontSize: 12 },
  textoPaso: { fontSize: 13.5, color: '#4A5568', lineHeight: 19, flex: 1 },
  botonPlanoIntegrado: { 
    alignSelf: 'flex-start', // Mantiene el botón a la izquierda sin estirarse
    paddingHorizontal: 12, 
    height: 45, 
    marginTop: 6,            // Margen superior para separarlo del paso 3 de forma prolija
    borderRadius: 8, 
    shadowOpacity: 0 
  },
  contenedorAcciones: { gap: 6, paddingTop: 5 }
});