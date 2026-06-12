// apiAppUndav.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { grisUndav } from "@/constants/Colors";
import axios, { AxiosError } from "axios";
import * as SecureStore from 'expo-secure-store';

// ==========================================
// --- INTERFACES ---
// ==========================================

export interface User {
  idPersona: string;
  documento: string;
  nombreCompleto: string;
  email: string;
  legajo: string;
  propuestas: Propuesta[];
  indicePropuestaSeleccionada: number;
}

export interface Propuesta {
  alumno: number;
  propuesta: number;
  nombre: string;
  nombre_abreviado: string;
  regular: "S" | "N";
  plan_version: number;
}

export interface Plan {
  plan: number;
  version_actual: number;
  nombre: string;
  duracion_teorica: string;
  duracion_en_anios: number;
  duracion_en_meses: number;
  cnt_materias: number;
  materias: Materia[];
}

export interface Materia {
  nombre: string;
  nombre_abreviado: string;
  anio_de_cursada: number;
  periodo_de_cursada: number;
  horas_semanales: string;
  horas_totales: string;
  permite_rendir_libre: string;
  permite_promocion: string;
}

export interface Analitico {
  data: ObjetoMateria[];
}
export interface ObjetoMateria {
  actividad_nombre: string;
  actividad_codigo: string;
  nota: string;
  resultado: string;
  fecha: string;
  propuesta_nombre: string;
}

export interface EventoAgenda {
  tipo_actividad: string;
  tipo_persona: string;
  legajo: string;
  actividad_nombre: string; 
  horario: string;
  ubicacion_nombre: string; 
  modalidad: string;
  fecha?: string;           // Examen (YYYY-MM-DD o ISO string)
  dow_semana?: number;      // 0 (Domingo) a 6 (Sábado) para cursadas periódicas
}

export interface EventoCalendarioAcademico {
  id: number;
  titulo: string;
  fecha_inicio: string;     // Devuelve la fecha como string (ej: "2026-06-05 03:00:00+00")
  fecha_fin: string;
  feriado: boolean | number;
  activo: boolean | number;
}

export interface RegistroAPI {
  id: number;
  nombre: string;
  contenido: string;
  activo: boolean;
  tipo_id: number;
  fecha_creado: string;
  fecha_modificado: string;
  tipo_nombre: "noticia" | "correo" | "link" | "telefono" | "texto";
}

export interface NoticiaAPI {
  id: number;
  nombre: string;       // El título de la noticia
  contenido: string;    // El cuerpo/descripción de la noticia
  fecha_creado: string; // Timestamp de la base de datos
  activo: boolean;
}

// ==========================================
// --- ESTADO GLOBAL ---
// ==========================================

export let infoBaseUsuarioActual: User = {
  idPersona: "", documento: "", nombreCompleto: "", email: "",
  legajo: "", propuestas: [], indicePropuestaSeleccionada: -1,
};

export let visitante: boolean = true;

const URL_BASE = process.env.EXPO_PUBLIC_API_APPUNDAV_URL;

// ==========================================
// --- CONFIGURACIÓN DE AXIOS ---
// ==========================================

const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para debugging de peticiones salientes
api.interceptors.request.use(config => {
  console.log(`➡️ [${config.method?.toUpperCase()}] URL: ${config.baseURL}${config.url}`);
  return config;
});

// Interceptor para debugging de respuestas entrantes
api.interceptors.response.use(
  response => {
    console.log(`⬅️ STATUS: ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    console.log(`❌ ERROR INTERCEPTOR: ${error.message} - Status: ${error.response?.status}`);
    return Promise.reject(error);
  }
);

// ==========================================
// --- HELPERS Y UTILIDADES ---
// ==========================================

function capitalizeWords(str: string): string {
  return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function parsearFechaPHP(fechaStr: string): Date {
  if (!fechaStr) return new Date();
  
  let formatoISO = fechaStr.trim();
  formatoISO = formatoISO.replace(" ", "T");
  formatoISO = formatoISO.replace(/\+\d+(:\d+)?$/, "Z").replace(/-\d+(:\d+)?$/, "Z");
  
  if (!formatoISO.endsWith("Z")) {
    formatoISO += "Z";
  }

  return new Date(formatoISO);
}

export function setVisitante(v: boolean): void { visitante = v; }
export function UsuarioEsAutenticado(): boolean { return infoBaseUsuarioActual.idPersona !== ""; }

// ==========================================
// --- LÓGICA DE API (ENDPOINTS) ---
// ==========================================

export async function validarPersona(usuario: string, clave: string) {
  const { token, idPersona } = await validarPersonaYTraerData(usuario, clave);
  
  // 🎯 Enviamos todo junto aquí, centralizando el almacenamiento
  await guardarSesion(token, idPersona, usuario, clave);

  setVisitante(false);
  await ObtenerDatosBaseUsuarioConToken(token, idPersona);

  return { token, idPersona };
}

export async function validarPersonaYTraerData(
  usuario: string,
  clave: string
): Promise<{ token: string; idPersona: number }> {
  try {
    const response = await api.post("/persona/validuser", {
      usuario: String(usuario),
      clave: String(clave)
    });

    const data = response.data;
    if (!data.token || !data.persona) throw new Error("Respuesta de API incompleta");

    return { token: data.token, idPersona: data.persona };
  } catch (err: any) {
    if (err.response?.status === 404) throw new Error("Servidor respondió 404 (Ruta no encontrada)");
    const errorMsg = err.response?.data?.error || err.message || "Error en la conexión";
    console.log("Error detallado en validarPersonaYTraerData:", errorMsg);
    throw new Error(errorMsg);
  }
}

export async function ObtenerDatosBaseUsuarioConToken(token: string, personaId: number): Promise<void> {
  try {
    const response = await api.get(`/persona/${personaId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const datos = response.data;
    const prop = datos.propuestas;

    infoBaseUsuarioActual = {
      ...infoBaseUsuarioActual,
      idPersona: personaId.toString(),
      legajo: datos.legajo,
      nombreCompleto: capitalizeWords(`${datos.nombres_elegido || datos.nombres} ${datos.apellido_elegido || datos.apellido}`),
      documento: datos.nro_documento,
      email: datos.email,
      propuestas: prop,
      indicePropuestaSeleccionada: prop.length - 1,
    };

    visitante = false;
  } catch (err: any) {
    throw new Error(`Error al obtener perfil: ${err.message}`);
  }
}

export async function ObtenerMateriasConPlan(): Promise<Plan> {
  // 🔄 CAMBIADO A SECURE STORE
  const token = await SecureStore.getItemAsync("token");
  const planId = infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.indicePropuestaSeleccionada].plan_version;

  try {
    const response = await api.get(`/propuesta/${planId}/plan`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data as Plan;
  } catch (err: any) {
    throw new Error("Error obteniendo plan de materias");
  }
}

export async function ObtenerAnalitico(): Promise<any> {
  // 🔄 CAMBIADO A SECURE STORE
  const token = await SecureStore.getItemAsync("token");
  const personaId = infoBaseUsuarioActual.idPersona;

  if (!personaId) throw new Error("No hay un usuario autenticado para consultar analítico");

  try {
    const response = await api.get(`/persona/${personaId}/analitico`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
  } catch (err: any) {
    throw new Error("Error al obtener la historia académica / analítico");
  }
}

export async function ObtenerTramites(): Promise<any> {
  // 🔄 CAMBIADO A SECURE STORE
  const token = await SecureStore.getItemAsync("token");
  const personaId = infoBaseUsuarioActual.idPersona;

  if (!personaId) throw new Error("No hay un usuario autenticado para consultar analítico");

  try {
    const response = await api.get(`/item-contacto`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data;
  } catch (err: any) {
    throw new Error("Error al obtener la historia académica / analítico");
  }
}

export async function ObtenerEventosCalendarioAcademico(): Promise<EventoCalendarioAcademico[]> {
  // 🔄 CAMBIADO A SECURE STORE
  const token = await SecureStore.getItemAsync("token");

  try {
    const response = await api.get("/eventos", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data as EventoCalendarioAcademico[];
  } catch (err: any) {
    throw new Error("Error al obtener la lista de eventos desde el servidor");
  }
}

export async function ObtenerNoticiasAPI(): Promise<NoticiaAPI[]> {
  try {
    // 🔄 CAMBIADO A SECURE STORE
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      console.warn("⚠️ [ObtenerNoticiasAPI] No se envió la petición: El token está vacío o no se ha iniciado sesión.");
      return [];
    }

    const response = await api.get("/noticias", {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    });

    return response.data as NoticiaAPI[];

  } catch (err: any) {
    console.error("❌ [ObtenerNoticiasAPI] Falló el endpoint de noticias:", {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message
    });

    const statusCode = err?.response?.status ? ` (Status: ${err.response.status})` : "";
    throw new Error(`Error al obtener las noticias desde el nuevo endpoint de PHP${statusCode}`);
  }
}

export async function ObtenerRegistrosAPI(): Promise<RegistroAPI[]> {
  // 🔄 CAMBIADO A SECURE STORE
  const token = await SecureStore.getItemAsync("token");

  try {
    const response = await api.get("/registros", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data as RegistroAPI[];
  } catch (err: any) {
    throw new Error("Error al obtener los registros desde la API PHP");
  }
}
// ==========================================
// --- SESIÓN Y LOGOUT ---
// ==========================================

export async function guardarSesion(
  token: string, 
  personaId: number | string, 
  usuario?: string, 
  clave?: string
): Promise<void> {
  try {
    // 🎯 Guardamos de manera encriptada y segura
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("idPersona", personaId.toString());
    
    if (usuario) await SecureStore.setItemAsync("username", usuario.toString());
    if (clave) await SecureStore.setItemAsync("password", clave.toString());
  } catch (err) {
    console.error("Error guardando sesión en SecureStore:", err);
  }
}

export async function Logout() {
  visitante = true;
  infoBaseUsuarioActual = {
    idPersona: "", documento: "", nombreCompleto: "", email: "",
    legajo: "", propuestas: [], indicePropuestaSeleccionada: -1
  };

  try {
    // Borramos selectivamente las claves de SecureStore
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("idPersona");
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");
    
    // Si usabas AsyncStorage para otras cosas (ej. modo oscuro), usas clear o remueves lo demás.
    // await AsyncStorage.clear(); 
  } catch (err) {
    console.error("Error al limpiar SecureStore en Logout:", err);
  }
}

// ==========================================
// --- UI / DARK MODE ---
// ==========================================

export let modoOscuro: boolean = false;
export let colorFondoTop: string = "#fff";
export let colorFondoBottom: string = "#ddd";

export function setDarkMode(dark: boolean): void {
  modoOscuro = dark;
  if (modoOscuro) {
    colorFondoTop = "#000";
    colorFondoBottom = "#000";
  } else {
    colorFondoTop = "#fff";
    colorFondoBottom = grisUndav;
  }
}

export function enModoOscuro(): boolean { return modoOscuro; }

export async function ObtenerJsonString(url: string): Promise<string> {
  try {
    // 🔄 CAMBIADO A SECURE STORE
    const token = await SecureStore.getItemAsync("token");
    let endpoint = url.replace(URL_BASE || '', '');
    
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    
    const response = await api.get(endpoint, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    return JSON.stringify(response.data);
  } catch (err: any) {
    console.error("Error en ObtenerJsonString:", err.message);
    throw new Error(`No se pudo obtener la data de la URL: ${url}`);
  }
}