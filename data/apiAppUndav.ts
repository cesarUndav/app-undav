// apiAppUndav.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { grisUndav } from "@/constants/Colors";
import axios, { AxiosError } from "axios";

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
  usuario: string;
  password: string;
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
  promedio_con_aprazos: number;
  promedio_sin_aprazos: number;
  porcentaje_avance: number;
  materias_aprobadas: number;
  historial: MateriaHistorial[];
}

export interface MateriaHistorial {
  materia: string;
  nombre: string;
  fecha: string;
  nota: string;
  resultado: string;
  acta: string;
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
  fecha_modificado: string;
  archivo_path: string | null;
  activo: boolean;
  borrado_logico: boolean;
  tipo_id: number;
  fecha_creado: string;
  modificado_por: string | null;
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
  usuario: "", password: ""
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
    console.log(`❌ ERROR: ${error.message} - Status: ${error.response?.status}`);
    return Promise.reject(error);
  }
);

// ==========================================
// --- HELPERS Y UTILIDADES ---
// ==========================================

function capitalizeWords(str: string): string {
  return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/**
 * Normaliza los strings de fecha devueltos por PHP/PostgreSQL a un formato ISO-8601
 * compatible con el motor estricto de JavaScript Hermes (React Native).
 */
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
  await guardarSesion(token, idPersona);

  infoBaseUsuarioActual.usuario = usuario.toString();
  infoBaseUsuarioActual.password = clave.toString();

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
  const token = await AsyncStorage.getItem("token");
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

export async function ObtenerAnalitico(): Promise<Analitico> {
  const token = await AsyncStorage.getItem("token");
  const personaId = infoBaseUsuarioActual.idPersona;

  if (!personaId) throw new Error("No hay un usuario autenticado para consultar analítico");

  try {
    const response = await api.get(`/persona/${personaId}/analitico`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data as Analitico;
  } catch (err: any) {
    throw new Error("Error al obtener la historia académica / analítico");
  }
}

export async function ObtenerAgendaFechas(
  fechaInicio: string = "2026-04-01",
  fechaFin: string = "2026-05-31",
  filtrarFeriados: boolean = true
): Promise<EventoAgenda[]> {
  const token = await AsyncStorage.getItem("token");
  const personaId = infoBaseUsuarioActual.idPersona;

  if (!personaId) throw new Error("No hay un usuario autenticado para consultar la agenda");

  try {
    const response = await api.get(
      `/persona/${personaId}/${fechaInicio}/${fechaFin}/${filtrarFeriados}/agenda`,
      {
        headers: { "Authorization": `Bearer ${token}` }
      }
    );
    return response.data.data as EventoAgenda[];
  } catch (err: any) {
    throw new Error("Error al obtener la agenda desde la API propia");
  }
}

export async function ObtenerEventosCalendarioAcademico(): Promise<EventoCalendarioAcademico[]> {
  const token = await AsyncStorage.getItem("token");

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
  const token = await AsyncStorage.getItem("token");

  try {
    const response = await api.get("/noticias", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.data as NoticiaAPI[];
  } catch (err: any) {
    throw new Error("Error al obtener las noticias desde el nuevo endpoint de PHP");
  }
}

export async function ObtenerRegistrosAPI(): Promise<RegistroAPI[]> {
  const token = await AsyncStorage.getItem("token");

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

async function guardarSesion(token: string, personaId: number): Promise<void> {
  try {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("idPersona", personaId.toString());
  } catch (err) {
    console.error("Error guardando sesión en storage:", err);
  }
}

export async function Logout() {
  visitante = true;
  infoBaseUsuarioActual = {
    idPersona: "", documento: "", nombreCompleto: "", email: "",
    legajo: "", propuestas: [], indicePropuestaSeleccionada: -1,
    usuario: "", password: "",
  };
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("idPersona");
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
    const token = await AsyncStorage.getItem("token");
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