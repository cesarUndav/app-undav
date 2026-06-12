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
  fecha?: string;           
  dow_semana?: number;      
}

export interface EventoCalendarioAcademico {
  id: number;
  titulo: string;
  fecha_inicio: string;     
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
  nombre: string;       
  contenido: string;    
  fecha_creado: string; 
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

// 🔄 MODIFICADO: Inyectar automáticamente el token fresco en cada petición saliente
api.interceptors.request.use(async (config) => {
  console.log(`➡️ [${config.method?.toUpperCase()}] URL: ${config.baseURL}${config.url}`);
  
  const token = await SecureStore.getItemAsync("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// 🔄 MODIFICADO: Interceptor de respuestas para capturar el 401 de forma silenciosa
api.interceptors.response.use(
  response => {
    console.log(`⬅️ STATUS: ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    const requestOriginal = error.config as any;
    console.log(`❌ ERROR INTERCEPTOR: ${error.message} - Status: ${error.response?.status}`);

    // Si el error es 401 (Unauthorized) y no estamos atrapados en un bucle de reintentos
    if (error.response?.status === 401 && requestOriginal && !requestOriginal._yaReintentado) {
      requestOriginal._yaReintentado = true; // Flag de control para evitar bucles infinitos

      try {
        console.log("🔄 [API] Token expirado detectado. Intentando re-autenticación silenciosa...");
        
        const usuarioGuardado = await SecureStore.getItemAsync("username");
        const claveGuardada = await SecureStore.getItemAsync("password");

        if (!usuarioGuardado || !claveGuardada) {
          console.warn("⚠️ [API] No se encontraron credenciales guardadas en el dispositivo.");
          await Logout();
          return Promise.reject(error);
        }

        // Solicitamos un par de credenciales/token nuevos a la API PHP utilizando los datos guardados
        const nuevaData = await validarPersonaYTraerData(usuarioGuardado, claveGuardada);
        
        // Guardamos las nuevas llaves de acceso
        await guardarSesion(nuevaData.token, nuevaData.idPersona, usuarioGuardado, claveGuardada);
        console.log("💾 [API] Sesión renovada con éxito en segundo plano.");

        // Modificamos la cabecera de la petición original con el nuevo token reactivado
        if (requestOriginal.headers) {
          requestOriginal.headers.Authorization = `Bearer ${nuevaData.token}`;
        }

        // Re-ejecutamos de manera transparente para el usuario
        return api(requestOriginal);

      } catch (errorDeRenovacion) {
        console.error("❌ [API] Error crítico al intentar refrescar la sesión:", errorDeRenovacion);
        await Logout(); // Forzamos deslogueo si las credenciales cambiaron o el servidor murió
        return Promise.reject(errorDeRenovacion);
      }
    }

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
    const response = await api.get(`/persona/${personaId}`);

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
  const planId = infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.indicePropuestaSeleccionada].plan_version;

  try {
    const response = await api.get(`/propuesta/${planId}/plan`);
    return response.data as Plan;
  } catch (err: any) {
    throw new Error("Error obteniendo plan de materias");
  }
}

export async function ObtenerAnalitico(): Promise<any> {
  const personaId = infoBaseUsuarioActual.idPersona;
  if (!personaId) throw new Error("No hay un usuario autenticado para consultar analítico");

  try {
    const response = await api.get(`/persona/${personaId}/analitico`);
    return response.data;
  } catch (err: any) {
    throw new Error("Error al obtener la historia académica / analítico");
  }
}

export async function ObtenerTramites(): Promise<any> {
  const personaId = infoBaseUsuarioActual.idPersona;
  if (!personaId) throw new Error("No hay un usuario autenticado para consultar analítico");

  try {
    const response = await api.get(`/item-contacto`);
    return response.data;
  } catch (err: any) {
    throw new Error("Error al obtener la historia académica / analítico");
  }
}

export async function ObtenerEventosCalendarioAcademico(): Promise<EventoCalendarioAcademico[]> {
  try {
    const response = await api.get("/eventos");
    return response.data as EventoCalendarioAcademico[];
  } catch (err: any) {
    throw new Error("Error al obtener la lista de eventos desde el servidor");
  }
}

export async function ObtenerNoticiasAPI(): Promise<NoticiaAPI[]> {
  try {
    const response = await api.get("/noticias", {
      headers: { "Cache-Control": "no-cache" }
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
  try {
    const response = await api.get("/registros");
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
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("idPersona");
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");
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
    let endpoint = url.replace(URL_BASE || '', '');
    
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    
    const response = await api.get(endpoint);
    return JSON.stringify(response.data);
  } catch (err: any) {
    console.error("Error en ObtenerJsonString:", err.message);
    throw new Error(`No se pudo obtener la data de la URL: ${url}`);
  }
}