// apiFlaskClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use Expo's built-in environment variable access
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// CHECK API URL
if (!API_URL) {
  console.warn("⚠️ API_URL no está definida en .env.local");
}

const BASE: string = API_URL?.replace(/\/$/, "") || "";
console.log("🔍 API_URL loaded:", BASE);

// ------------------------------
// TYPES
// ------------------------------
interface LoginResponse {
  token: string;
  [key: string]: any;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export type EventoAPIFlask = {
  id: number;
  titulo: string;
  fecha_inicio: string;
  fecha_fin: string;
  feriado: boolean;
};

export type NoticiaAPI = {
  id: number;
  nombre: string;
  contenido: string;
  archivo_path: string | null;
  fecha_modificado: string;
  activo: boolean;
};

export type RegistroAPI = {
  id: number;
  nombre: string;
  contenido: string;
  archivo_path: string | null;
  fecha_modificado: string;
  activo: boolean;
  borrado_logico: boolean;
  tipo: {
    id: number;
    nombre: string;
  };
};

// ------------------------------
// TOKEN HANDLING
// ------------------------------
async function saveToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem("token", token);
  } catch {
    console.error("❌ Error guardando token");
  }
}

async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem("token");
  } catch {
    return null;
  }
}

async function clearToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem("token");
  } catch {}
}

// ------------------------------
// LOGIN
// ------------------------------
export async function login(username: string, password: string): Promise<boolean> {
  let resp: Response;

  try {
    resp = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor Flask");
  }

  let data: LoginResponse;
  try {
    data = await resp.json();
  } catch {
    throw new Error("Error leyendo respuesta del servidor");
  }

  if (!resp.ok) {
    throw new Error(data?.error || "Credenciales inválidas");
  }

  await saveToken(data.token);
  return true;
}

// ------------------------------
// GENERIC REQUEST WITH JWT
// ------------------------------
async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let resp: Response;
  try {
    resp = await fetch(`${BASE}/${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor Flask");
  }

  if (resp.status === 401) {
    await clearToken();
    throw new Error("Token expirado o inválido");
  }

  let json: T;
  try {
    json = await resp.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }

  if (!resp.ok) {
    throw new Error((json as any)?.error || "Error en la solicitud");
  }

  return json;
}

// ------------------------------
// API CALLS
// ------------------------------
export const api = {
  getDatosAppUndav: () => request("datos_app_undav"),
  getEventos: () => request<EventoAPIFlask[]>("eventos"),
  getNoticias: () => request<NoticiaAPI[]>("noticias"), // NUEVO
  getRegistros: () => request<RegistroAPI[]>("registros"),
  getTipos: () => request("tipos"),
  getUsers: () => request("users"),
  getHistorial: () => request("historial"),
};

// ------------------------------
// LOGOUT
// ------------------------------
export async function logout(): Promise<void> {
  await clearToken();
}