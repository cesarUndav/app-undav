import AsyncStorage from "@react-native-async-storage/async-storage";
import { grisUndav } from "@/constants/Colors";
import axios, { AxiosError } from "axios";

// --- Interfaces (Se mantienen igual) ---
export interface User {
  idPersona: string;
  documento: string;
  nombreCompleto: string;
  email: string;
  legajo: string;
  propuestas: Propuesta[];
  indicePropuestaSeleccionada: number,
  usuario: string,
  password: string
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
  plan: number,
  version_actual: number,
  nombre: string,
  duracion_teorica: string,
  duracion_en_anios: number,
  duracion_en_meses: number,
  cnt_materias: number,
  materias: Materia[]
}

export interface Materia {
  nombre: string,
  nombre_abreviado: string,
  anio_de_cursada: number,
  periodo_de_cursada: number,
  horas_semanales: string,
  horas_totales: string,
  permite_rendir_libre: string,
  permite_promocion: string,
}

// --- Estado Global ---
export let infoBaseUsuarioActual: User = {
  idPersona: "", documento: "", nombreCompleto: "", email: "",
  legajo: "", propuestas: [], indicePropuestaSeleccionada: -1,
  usuario: "", password: ""
};

export let visitante: boolean = true;

const URL_BASE = process.env.EXPO_PUBLIC_API_APPUNDAV_URL;

// --- CONFIGURACIÓN DE AXIOS LIMPIA ---
const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // ELIMINAMOS EL HOST Y EL USER-AGENT MANUAL
  },
  timeout: 15000,
});

// Interceptor para debugging (opcional, similar a tus logs de antes)
api.interceptors.request.use(config => {
  console.log(`➡️ [${config.method?.toUpperCase()}] URL: ${config.baseURL}${config.url}`);
  return config;
});

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

// --- Helpers ---
function capitalizeWords(str: string): string {
  return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function setVisitante(v: boolean): void { visitante = v; }
export function UsuarioEsAutenticado(): boolean { return infoBaseUsuarioActual.idPersona !== ""; }

// --- Lógica de API ---

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

// --- Sesión y Logout ---
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

// --- UI / Dark Mode ---
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
    
    // Limpiamos cualquier rastro de la URL base por si mandaron la ruta absoluta
    let endpoint = url.replace(URL_BASE || '', '');
    
    // Si por esas casualidades no empieza con '/', se la ponemos nosotros obligatoriamente
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