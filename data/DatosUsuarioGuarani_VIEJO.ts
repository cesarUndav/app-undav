import { DigestClient } from "@/app/lib/DigestClient";
import { Platform } from "react-native";


interface User {
  idPersona: string;
  documento: string;
  nombreCompleto: string;
  email: string;
  tel: string;
  legajo: string;
}
export let usuarioActual: User={idPersona: "", documento: "", nombreCompleto: "", email: "", tel: "", legajo: "" };
export function UsuarioAutenticado():Boolean {return usuarioActual.idPersona != "";}
// auth y requests

export let visitante:Boolean = true;

export function setVisitante(v:Boolean):void {visitante = v; }

const celeste:string = '#91c9f7';
const gris:string = '#b1b2b1';

export let colorFondo:string = "#b1b2b1";
export let fondoEsCeleste:boolean = false;

export function setColorFondoCeleste(esCeleste:boolean) {
  fondoEsCeleste = esCeleste;
  esCeleste ? colorFondo = celeste : colorFondo = gris;
}

const client = new DigestClient("app_undav", "app123456");
export async function ObtenerJsonString(url:string) {
  const res = await client.fetchWithDigest(url);
  const data = await res.json();
  return JSON.stringify(data);
}

const urlBase = "http://172.16.1.43/guarani/3.17/rest/v2/";

export function UrlObtenerIdPersona(numero_documento:string, tipo_documento:number=0, pais:number=0) {
  return urlBase+"personas?pais="+pais+"&tipo_documento="+tipo_documento+"&numero_documento="+numero_documento;
}
export function UrlObtenerDatosPersona(persona:string) {
  return "http://172.16.1.43/guarani/3.17/rest/v2/personas/"+persona+"/datospersonales";
}
export function UrlObtenerMailTel(numero_documento:string, tipo_documento:number=0) {
  return urlBase+"alumnos?tipo_documento="+tipo_documento+"&numero_documento="+numero_documento;
}
export function UrlObtenerAgenda(persona:string, fecha:string) {
  return urlBase+"personas/"+persona+"/agenda?fecha="+fecha;
}

export function JsonStringAObjeto(jsonString:string) {
  return JSON.parse(jsonString);
}
export function JsonACampo(json:JSON) {
    return JSON.parse(JSON.stringify(json));
}

// aux parseo
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// AUTENTICACIÓN:
export async function ObtenerCorreoConDocumento(documentoUsuario:string):Promise<string> {
  if (Platform.OS == "android") {
    // obtener id "persona" a partir de DNI:
    const jsonPersona = JsonStringAObjeto(await ObtenerJsonString(UrlObtenerIdPersona(documentoUsuario, 0, 0)));
    usuarioActual.idPersona = jsonPersona.persona;
    // obtener datos personales a partir de id Persona:
    const jsonDatosPersonales = JsonStringAObjeto(await ObtenerJsonString(UrlObtenerDatosPersona(usuarioActual.idPersona)));
    
    const email:string = jsonDatosPersonales.mail;
    if (email == undefined) return "undefined";
    else return email;
    //else return email.split("@")[0]+"\n@"+email.split("@")[1];
  }
  else {
    console.log("salteando auth en IOS");
    return "";
  }
}

export async function ObtenerDatosUsuarioActual(documentoUsuario:string) {
  console.log("iniciando auth:");
  if (Platform.OS == "android") {
    // obtener id "persona" a partir de DNI:
    const jsonPersona = JsonStringAObjeto(await ObtenerJsonString(UrlObtenerIdPersona(documentoUsuario, 0, 0)));
    usuarioActual.idPersona = jsonPersona.persona;
    // obtener datos personales a partir de id Persona:
    const jsonDatosPersonales = JsonStringAObjeto(await ObtenerJsonString(UrlObtenerDatosPersona(usuarioActual.idPersona)));
    //aplicar datos:
    usuarioActual.nombreCompleto = capitalizeWords((jsonDatosPersonales.nombres+" "+jsonDatosPersonales.apellido).toLowerCase());
    usuarioActual.legajo = jsonDatosPersonales.legajo;
    usuarioActual.email = jsonDatosPersonales.mail;
    usuarioActual.tel = jsonDatosPersonales.telefono_celular;
    usuarioActual.documento = ((jsonDatosPersonales.documento).split(/\s+/)[1]);
    // DEBUG LOG
    console.log(usuarioActual);
    
    visitante = false;
    
    //console.log("Datos personales:\n" + JSON.stringify(jsonDatosPersonales));
  } else {
    console.log("salteando auth en IOS");
  }
};

export function Logout() {
  visitante = true;
  usuarioActual = {idPersona: "", documento: "", nombreCompleto: "", email: "", tel: "", legajo: "" };
}