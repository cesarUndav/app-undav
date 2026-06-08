// app/generar-certificado.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput, Platform, ScrollView } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

// Componentes de tu Toolkit de Diseño
import CustomText from '@/components/CustomText';
import BotonTexto from '@/components/BotonTexto';
import { negroAzulado, azulLogoUndav } from '@/constants/Colors';
import { infoBaseUsuarioActual } from '@/data/apiAppUndav';
import * as FileSystem from 'expo-file-system/legacy'; 
import { Asset } from 'expo-asset';
import FondoGradiente from '@/components/FondoGradiente';
import { listaCursadasSIU } from '@/data/agenda';

// 🎯 Referencia al asset local
const logoUndavAsset = Asset.fromModule(require('../assets/images/logoundav.png')); 

const linkCertificadoExamen = "https://docs.google.com/document/d/1NGOoRhWOAubZEhG0EzOjhquI1bIKpYwE/edit#heading=h.gjdgxs";

interface DatosCertificado {
  tipoExamen: string;
  materia: string;
  diaExamen: string;
  mesExamen: string;
  anioExamen: string;
}

export default function GeneradorCertificado() {
  const [materiaInput, setMateriaInput] = useState('');
  const [tipoExamen, setTipoExamen] = useState<'parcial' | 'final'>('parcial');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(undefined); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [indicePropuesta, setIndicePropuesta] = useState<number>(infoBaseUsuarioActual.indicePropuestaSeleccionada);
  
  // 🎯 Inicializamos apuntando al índice '0' (o podés usar "" si preferís que no haya selección inicial)
  const [materiaCursada, setMateriaCursada] = useState<string>("0");

  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaSeleccionada(selectedDate);
    }
  };

  // HELPER BASE64
  const fetchImageData = async (asset: Asset): Promise<string> => {
    try {
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      let uriLocal = asset.localUri || asset.uri;
      const base64Data = await FileSystem.readAsStringAsync(uriLocal, {
        encoding: 'base64',
      });
      if (!base64Data) return "";
      return `data:image/png;base64,${base64Data}`;
    } catch (err) {
      console.error("[LOG ❌] Error en fetchImageData:", err);
      return "";
    }
  };

  // --- HTML DEL CERTIFICADO ---
  const generarHTMLCertificado = (datos: DatosCertificado, fechaEmisionTexto: string, esPlantillaVacia: boolean, urlLogo: string) => {
    const renderCampo = (valorReal: string) => 
      esPlantillaVacia 
        ? `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` 
        : valorReal;

    const carreraNombre = infoBaseUsuarioActual?.propuestas?.[indicePropuesta]?.nombre || "Carrera no especificada";

    return `
      <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>Certificado de Evaluación UNDAV</title>
            <style>
            @page { size: A4; margin: 3cm 2.5cm 3cm 2.5cm; }
            body { font-family: 'Arial', sans-serif; color: #000000; line-height: 2; font-size: 12pt; }
            
            .header-undav { margin-bottom: 50px; }
            .logo-institucional { height: 75px; width: auto; display: block; }
            
            .titulo-documento { text-align: center; font-size: 16pt; font-weight: bold; margin-top: 40px; margin-bottom: 50px; text-transform: uppercase; letter-spacing: 0.5px; }
            .certifico-label { font-size: 13pt; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; }
            .cuerpo-texto { text-align: justify; text-indent: 0; font-size: 12pt; margin-bottom: 40px; }
            
            .campo-relleno { 
                font-weight: bold; 
                border-bottom: 1px solid #000000; 
                padding-bottom: 0px; 
                padding-left: 4px;
                padding-right: 4px;
                display: inline; 
                vertical-align: baseline; 
            }
            
            .tabla-firmas { width: 100%; margin-top: 80px; border-collapse: collapse; }
            .col-firma { width: 50%; vertical-align: bottom; text-align: center; }
            .linea-punteada { border-top: 1px dashed #000; width: 85%; margin: 0 auto 8px auto; }
            .aclaracion { font-size: 10pt; color: #333333; line-height: 1.4; }
            
            .sello-recuadro { 
              border: 1px dashed #999; 
              width: 130px; 
              height: 130px; 
              margin: 0 auto; 
              line-height: 130px; 
              text-align: center; 
              font-size: 10pt; 
              color: #666; 
              text-transform: uppercase; 
            }
            </style>
        </head>
        <body>
            <div class="header-undav">
              <img src="${urlLogo}" class="logo-institucional" alt="Logo UNDAV" />
            </div>
            <div class="titulo-documento">Certificado de Evaluación</div>
            <div class="certifico-label">CERTIFICO:</div>
            <div class="cuerpo-texto">
            Que <span class="campo-relleno">${renderCampo(infoBaseUsuarioActual.nombreCompleto.toUpperCase())}</span> 
            Legajo Nº <span class="campo-relleno">${renderCampo(infoBaseUsuarioActual.legajo)}</span>, 
            DNI <span class="campo-relleno">${renderCampo(infoBaseUsuarioActual.documento)}</span>, estudiante de la Universidad de Avellaneda,
            ha rendido el examen <span class="campo-relleno">${renderCampo(datos.tipoExamen.charAt(0).toUpperCase() + datos.tipoExamen.slice(1))}</span> correspondiente a la asignatura 
            <span class="campo-relleno">${renderCampo(datos.materia)}</span>
            de la carrera <span class="campo-relleno">${renderCampo(carreraNombre)}</span>, 
            el día <span class="campo-relleno">${renderCampo(datos.diaExamen)}</span> 
            del mes de <span class="campo-relleno">${renderCampo(datos.mesExamen)}</span> del año <span class="campo-relleno">${datos.anioExamen}</span>.
            </div>
            <div class="presentacion-nota">A solicitud del interesado y para ser presentado ante QUIEN CORRESPONDA se expide el presente.</div>
            
            <table class="tabla-firmas">
            <tr>
                <td class="col-firma">
                <div class="sello-recuadro">Sello UNDAV</div>
                </td>
                <td class="col-firma">
                <div class="linea-punteada"></div>
                <div class="aclaracion"><strong>Firma autorizada</strong><br>(docente a cargo de la asignatura)</div>
                </td>
            </tr>
            </table>
        </body>
        </html>
    `;
  };

  // --- MANEJADOR DE GENERACIÓN ---
  const compilarPDF = async (esPlantillaVacia: boolean) => {
    
    // Determinar qué string de materia vamos a usar
    let nombreMateriaFinal = "";
    if (materiaCursada === "OTRA") {
      nombreMateriaFinal = materiaInput.trim();
    } else {
      const idx = Number(materiaCursada);
      nombreMateriaFinal = listaCursadasSIU[idx] ? listaCursadasSIU[idx].titulo : "";
    }

    if (!esPlantillaVacia) {
      if (!nombreMateriaFinal) {
        Alert.alert("Campo Obligatorio", "Por favor, ingresá o seleccioná el nombre de la asignatura.");
        return;
      }
      if (!fechaSeleccionada) {
        Alert.alert("Campo Obligatorio", "Por favor, seleccioná la fecha en la que se rindió la evaluación.");
        return;
      }
    }

    const mesesAño = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const objetoFecha = fechaSeleccionada || new Date();
    const diaExamen = String(objetoFecha.getDate()).padStart(2, '0');
    const mesExamen = mesesAño[objetoFecha.getMonth()];
    const anioExamen = String(objetoFecha.getFullYear());

    // Capitalización Prolija de la Materia
    const conectores = ['de', 'del', 'en', 'y', 'para', 'la', 'los', 'las'];
    const materiaCapitalizada = nombreMateriaFinal
      .toLowerCase()
      .split(' ')
      .map((palabra, idWord) => {
        if (conectores.includes(palabra) && idWord !== 0) {
          return palabra;
        }
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      })
      .join(' ');

    const datosFinales: DatosCertificado = {
      tipoExamen: tipoExamen,
      materia: materiaCapitalizada || "Materia no especificada",
      diaExamen,
      mesExamen,
      anioExamen
    };

    const hoy = new Date();
    const textoFechaEmision = `${hoy.getDate()} de ${mesesAño[hoy.getMonth()]} de ${hoy.getFullYear()}`;
    
    const diaIngresadoStr = String(objetoFecha.getDate()).padStart(2, '0');
    const mesIngresadoStr = String(objetoFecha.getMonth() + 1).padStart(2, '0');
    const fechaIngresadaFilename = `${diaIngresadoStr}-${mesIngresadoStr}-${objetoFecha.getFullYear()}`;

    const materiaArchivo = esPlantillaVacia ? "SIN MATERIA" : materiaCapitalizada.toUpperCase();
    const nombreFinalDelArchivo = `Certificado Examen ${infoBaseUsuarioActual.nombreCompleto} ${materiaArchivo} ${fechaIngresadaFilename}.pdf`;

    try {
      const base64LogoInline = await fetchImageData(logoUndavAsset);
      const htmlContenido = generarHTMLCertificado(datosFinales, textoFechaEmision, esPlantillaVacia, base64LogoInline);
      const { uri } = await Print.printToFileAsync({ html: htmlContenido, base64: false });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: nombreFinalDelArchivo, 
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert("Error", "Compartir no está disponible en este dispositivo.");
      }
    } catch (error: any) {
      console.error("[LOG ❌] Error en compilarPDF:", error);
      Alert.alert("Error Técnico", error?.message || "No se pudo procesar el archivo PDF.");
    }
  };

  return (
    <FondoGradiente>
        <ScrollView style={styles.cardFormulario}>

          {/* Selector de Carrera Universitaria Real */}
          <CustomText weight="bold" style={styles.labelInput}>
            Carrera:
          </CustomText>
          <View style={styles.contenedorPickerSelect}>
            <Picker
                selectedValue={indicePropuesta}
                onValueChange={(itemValue) => setIndicePropuesta(Number(itemValue))}
                style={styles.pickerEstilo}
                dropdownIconColor={azulLogoUndav}
            >
                {infoBaseUsuarioActual?.propuestas?.map((p, index) => (
                <Picker.Item 
                    key={p.propuesta || index} 
                    label={p.nombre} 
                    value={index} 
                />
                ))}
            </Picker>
          </View>

          {/* Selector de Asignatura / Materia */}
          <CustomText weight="bold" style={styles.labelInput}>
            Materia: <CustomText style={{color: 'red'}}>*</CustomText>
          </CustomText>
          <View style={styles.contenedorPickerSelect}>
            <Picker
                selectedValue={materiaCursada}
                onValueChange={(itemValue) => setMateriaCursada(String(itemValue))}
                style={styles.pickerEstilo}
                dropdownIconColor={azulLogoUndav}
            >
                {listaCursadasSIU?.map((p, index) => (
                <Picker.Item 
                    key={p.id || index} 
                    label={p.titulo} 
                    value={String(index)} 
                />
                ))}
                {/* 🎯 Opción condicional agregada */}
                <Picker.Item label="Otra asignatura" value="OTRA" />
            </Picker>
          </View>
          {/* 🎯 CAMPO TEXTINPUT INTELIGENTE: Aparece únicamente si se escoge "OTRA" */}
          {materiaCursada === "OTRA" && (
            <>
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
            </>
          )}

          {/* Tipo Examen */}
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

          {/* Selector de Fecha */}
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
        </ScrollView>

        <View style={styles.contenedorAcciones}>
          <BotonTexto 
            label="Descargar certificado"
            color={azulLogoUndav}
            onPressFunction={() => compilarPDF(false)}
          />

          <BotonTexto 
            label="Descargar sin rellenar datos"
            color='#666'
            onPressFunction={() => compilarPDF(true)}
          />
          
          <BotonTexto
            label="Ver en Google Drive"
            styleExtra={{ borderBottomRightRadius: 20 }} 
            url={linkCertificadoExamen}
          />
        </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  cardFormulario: { backgroundColor: '#FFFFFF', borderBottomRightRadius: 15, paddingHorizontal: 15, paddingVertical: 5, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  labelInput: { fontSize: 14, color: negroAzulado, marginBottom: 5, marginTop: 5 },
  contenedorPickerSelect: { 
  borderWidth: 1, 
  borderColor: '#CCC', 
  borderRadius: 8, 
  marginBottom: 10, 
  backgroundColor: '#FAFAFA', 
  overflow: 'hidden',
  // 🎯 Forzamos la altura del contenedor visual a algo más compacto
  height: 42, 
  justifyContent: 'center', 
},
pickerEstilo: { 
  width: '100%', 
  color: '#333',
  backgroundColor: 'transparent',
  // 🎯 El truco: En Android el Picker nativo tiene paddings fijos. 
  // Con altura de 50 y un margen negativo, se "centra" perfecto en los 42px del contenedor sin cortarse.
  ...Platform.select({
    android: {
      height: 55,
      marginTop: -3, 
    },
    ios: {
      height: 42,
    },
  }),
},
  textInput: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: '#333', marginBottom: 20, backgroundColor: '#FAFAFA' },
  contenedorFechaPicker: { alignItems: 'flex-start', marginBottom: 10, width: '100%' },
  botonPicker: { backgroundColor: azulLogoUndav, paddingHorizontal: 20, borderRadius: 8 },
  contenedorAcciones: { gap: 5 }
});