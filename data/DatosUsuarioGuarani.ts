import AsyncStorage from "@react-native-async-storage/async-storage";
import { grisUndav } from "@/constants/Colors";

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

export interface Propuesta {
  alumno: number;
  propuesta: number;
  nombre: string;
  nombre_abreviado: string;
  regular: "S" | "N";
  plan_version: number;
}

export interface RespuestaPropuestas {
  propuestas: Propuesta[];
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

export let visitante: boolean = true;

export function setVisitante(v: boolean): void {
  visitante = v;
}

export function UsuarioEsAutenticado(): boolean {
  return infoBaseUsuarioActual.idPersona !== "";
}

const URL_BASE = "http://172.16.1.43/api/appundav";

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Para actualizar infoBaseUsuarioActual desde fuera si hace falta
export function setUsuarioActual(user: User) {
  infoBaseUsuarioActual = { ...user };
}

// Función para loguear usuario y obtener token + "persona" (idPersona)
export async function validarPersonaYTraerData(usuario: string, clave: string): Promise<{ token: string, idPersona: number }> {
  const url = `${URL_BASE}/persona/validuser`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, clave }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Credenciales inválidas. (${response.status}) ${errorBody}`);
  }

  const data = await response.json();
  if (!data.token || !data.persona) {
    throw new Error("Respuesta incompleta del servidor");
  }

  return {
    token: data.token,
    idPersona: data.persona
  };
}
async function guardarSesion(token: string, personaId: number):Promise<void> {
  try {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("idPersona", personaId.toString());
  } catch (err) {
    console.error("Error guardando sesión:", err);
  }
};

export async function validarPersona(usuario: string, clave: string) {
  const { token, idPersona } = await validarPersonaYTraerData(usuario, clave);
  await guardarSesion(token, idPersona);
  
  infoBaseUsuarioActual.usuario = usuario.toString();
  infoBaseUsuarioActual.password = clave.toString();
  
  setVisitante(false);
  await ObtenerDatosBaseUsuarioConToken(token, idPersona);
  return {token, idPersona};
}

// Obtener datos personales con token JWT (para iOS y Android)
export async function ObtenerDatosBaseUsuarioConToken(token: string,personaId: number): Promise<void> {
  const url = `${URL_BASE}/persona/${personaId}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener datos del usuario (${response.status}): ${errorText}`);
  }

  const datos = await response.json();
  const prop = datos.propuestas;
  
  infoBaseUsuarioActual = {
    idPersona: personaId.toString(),
    // se cargan los datos obtenidos:
    legajo: datos.legajo,
    nombreCompleto: capitalizeWords(`${datos.nombres_elegido? datos.nombres_elegido:datos.nombres} ${datos.apellido_elegido?datos.apellido_elegido:datos.apellido}`),
    documento: datos.nro_documento,
    email: datos.email,
    //tel: datos.telefono_celular,
    //
    propuestas: prop,
    // elige la "propuesta" (carrera) más reciente:
    indicePropuestaSeleccionada: prop.length - 1,
    // no realiza cambios en las siguientes variables:
    usuario: infoBaseUsuarioActual.usuario,
    password: infoBaseUsuarioActual.password
  };
  
  visitante = false;
}

export async function ObtenerMateriasConPlan(): Promise<Plan> {
  const token = await AsyncStorage.getItem("token");
  
  //const planId = infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.propuestas.length -1].plan_version;
  
  //console.log("PROPS: ",infoBaseUsuarioActual);
  const planId = infoBaseUsuarioActual.propuestas[infoBaseUsuarioActual.indicePropuestaSeleccionada].plan_version;
  //const planId = 435;
  console.log("plan:",planId,"token:",token);

  const url = `${URL_BASE}/propuesta/${planId}/plan`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener datos del usuario (${response.status}): ${errorText}`);
  }
  const respuestaPlan = await response.json();
  const plan:Plan = respuestaPlan;
  return respuestaPlan as Plan;
}

export async function Logout() {
  visitante = true;
  infoBaseUsuarioActual = {
    idPersona: "",
    documento: "",
    nombreCompleto: "",
    email: "",
    legajo: "",
    propuestas: [],
    indicePropuestaSeleccionada: -1,
    usuario: "",
    password: "",
  };
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("idPersona"); // O AsyncStorage.clear();
}

// El que quiere celeste, que le cueste:
export let modoOscuro:boolean = false;

export let colorFondoTop: string = "#fff";
export let colorFondoBottom: string = grisUndav;

const celeste: string = "#91c9f7";

export function setDarkMode(dark: boolean):void {
  modoOscuro = dark;
  if (modoOscuro) {
    colorFondoTop = "#000";
    colorFondoBottom = "#000";
  } else {
    colorFondoTop = "#fff";
    colorFondoBottom = grisUndav;
  }
} 
export function enModoOscuro():boolean {return modoOscuro;}