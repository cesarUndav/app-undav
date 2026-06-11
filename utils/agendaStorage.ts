// utils/agendaStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventoAgenda } from '@/data/agenda';

const STORAGE_KEY = '@mis_eventos_agenda';

// Guardar la lista completa de eventos
export const guardarEventosLocalmente = async (eventos: EventoAgenda[]) => {
  try {
    const jsonValue = JSON.stringify(eventos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('❌ Error al guardar eventos en AsyncStorage:', e);
  }
};

// Cargar la lista de eventos al iniciar la app
export const cargarEventosLocalmente = async (): Promise<EventoAgenda[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('❌ Error al cargar eventos desde AsyncStorage:', e);
    return [];
  }
};