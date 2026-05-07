import AsyncStorage from "@react-native-async-storage/async-storage";
import { grisUndav } from "@/constants/Colors";

// --- Interfaces ---
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
  idPersona: "",
  documento: "",
  nombreCompleto: "",
  email: "",
  legajo: "",
  propuestas: [],
  indicePropuestaSeleccionada: -1,
  usuario: "",
  password: ""
};

export let visitante: boolean = true;
const URL_BASE = process.env.EXPO_PUBLIC_API_APPUNDAV_URL;

// --- FETCH WRAPPER (CLAVE) ---
async function fetchConHeaders(url: string, options: RequestInit = {}) {
  try {
    console.log("➡️ URL:", url);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    console.log("⬅️ STATUS:", response.status);

    return response;
  } catch (error) {
    console.log("❌ FETCH ERROR:", error);
    throw error;
  }
}

// --- Helpers ---
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function setVisitante(v: boolean): void {
  visitante = v;
}

export function UsuarioEsAutenticado(): boolean {
  return infoBaseUsuarioActual.idPersona !== "";
}

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

  const url = `${URL_BASE}persona/validuser`;
  const body = JSON.stringify({ usuario: String(usuario), clave: String(clave) });

  try {
    const response = await fetchConHeaders(url, {
      method: "POST",
      body: body
    });

    const text = await response.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch (e) {
      if (response.status === 404) throw new Error("Servidor respondió 404");
      throw new Error("El servidor no devolvió un formato JSON válido");
    }

    if (!response.ok) throw new Error(data.error || `Error HTTP ${response.status}`);
    if (!data.token || !data.persona) throw new Error("Respuesta de API incompleta");

    return { token: data.token, idPersona: data.persona };
  } catch (err) {
    console.log("Error en validarPersonaYTraerData:", err);
    throw err;
  }
}

export async function ObtenerDatosBaseUsuarioConToken(token: string, personaId: number): Promise<void> {
  const url = `${URL_BASE}persona/${personaId}`;

  const response = await fetchConHeaders(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!response.ok) throw new Error(`Error al obtener perfil (${response.status})`);

  const datos = await response.json();
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
}

export async function ObtenerMateriasConPlan(): Promise<Plan> {
  const token = await AsyncStorage.getItem("token");
  const planId = infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.indicePropuestaSeleccionada].plan_version;

  const url = `${URL_BASE}propuesta/${planId}/plan`;

  const response = await fetchConHeaders(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!response.ok) throw new Error("Error obteniendo plan de materias");
  return await response.json() as Plan;
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

export function enModoOscuro(): boolean {
  return modoOscuro;
}