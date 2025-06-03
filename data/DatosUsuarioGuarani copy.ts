import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  idPersona: string;
  documento: string;
  nombreCompleto: string;
  email: string;
  tel: string;
  legajo: string;
}

export let usuarioActual: User = {
  idPersona: "",
  documento: "",
  nombreCompleto: "",
  email: "",
  tel: "",
  legajo: ""
};

export let visitante: boolean = true;

export function setVisitante(v: boolean): void {
  visitante = v;
}

export function UsuarioAutenticado(): boolean {
  return usuarioActual.idPersona !== "";
}

const celeste: string = "#91c9f7";
const gris: string = "#b1b2b1";

export let colorFondo: string = gris;
export let fondoEsCeleste: boolean = false;

export function setColorFondoCeleste(esCeleste: boolean) {
  fondoEsCeleste = esCeleste;
  colorFondo = esCeleste ? celeste : gris;
}

const URL_BASE = "http://172.16.1.43/api/appundav";

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Función para loguear usuario y obtener token + persona_id
export async function validarPersonaYTraerData(usuario: string, clave: string): Promise<{ token: string, personaId: number }> {
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

  if (!data.token || !data.persona_id) {
    throw new Error("Respuesta incompleta del servidor");
  }

  return {
    token: data.token,
    personaId: data.persona_id
  };
}

// Obtener datos personales con token JWT
export async function ObtenerDatosUsuarioConToken(personaId: number, token: string): Promise<void> {
  if (Platform.OS === "android") {
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

    usuarioActual = {
      idPersona: personaId.toString(),
      documento: datos.documento,
      nombreCompleto: capitalizeWords(`${datos.nombres} ${datos.apellido}`),
      email: datos.mail,
      tel: datos.telefono_celular,
      legajo: datos.legajo
    };

    visitante = false;

    console.log("Usuario cargado:", usuarioActual);
  } else {
    console.log("Plataforma iOS: autenticación deshabilitada.");
  }
}

// Logout
export function Logout() {
  visitante = true;
  usuarioActual = {
    idPersona: "",
    documento: "",
    nombreCompleto: "",
    email: "",
    tel: "",
    legajo: ""
  };
  AsyncStorage.removeItem("token");
  AsyncStorage.removeItem("persona_id");
}


