// utils/exportador.ts

// 🎯 Importamos la API legacy para mantener compatibilidad total en SDK 54 sin Warnings
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { EventoAgenda } from '@/data/agenda';

export const exportarDatosAgenda = async (eventos: EventoAgenda[], formato: 'json' | 'csv') => {
  if (eventos.length === 0) {
    Alert.alert('Atención', 'No hay datos en la agenda para exportar.');
    return;
  }

  try {
    let contenidoArchivo = '';
    let nombreArchivo = `mi_agenda_${Date.now()}`;
    let extension = '';

    if (formato === 'json') {
      contenidoArchivo = JSON.stringify(eventos, null, 2);
      extension = 'json';
    } else {
      extension = 'csv';
      const encabezados = ['ID', 'Título', 'Descripción', 'Fecha Inicio', 'Fecha Fin', 'Es Feriado'];
      
      const filas = eventos.map(e => [
        `"${e.id}"`,
        `"${e.titulo.replace(/"/g, '""')}"`,
        `"${(e.descripcion || '').replace(/"/g, '""')}"`,
        `"${e.fechaInicio || ''}"`,
        `"${e.fechaFin || ''}"`,
        `"${e.esFeriado ? 'Sí' : 'No'}"`
      ].join(';'));

      contenidoArchivo = [encabezados.join(';'), ...filas].join('\n');
    }

    // 🎯 Ahora las propiedades existen perfectamente bajo el tipado heredado seguro
    const dirBase = FileSystem.documentDirectory;
    const uriArchivo = `${dirBase}${nombreArchivo}.${extension}`;

    // 🎯 Escribe de forma asincrónica usando la firma clásica estable
    await FileSystem.writeAsStringAsync(uriArchivo, contenidoArchivo, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uriArchivo, {
        mimeType: formato === 'json' ? 'application/json' : 'text/csv',
        dialogTitle: `Exportar agenda como ${formato.toUpperCase()}`,
        UTI: formato === 'json' ? 'public.json' : 'public.comma-separated-values-text'
      });
    } else {
      Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
    }

  } catch (error) {
    console.error('❌ Error al exportar los datos:', error);
    Alert.alert('Error', 'No se pudieron exportar los datos de la agenda.');
  }
};