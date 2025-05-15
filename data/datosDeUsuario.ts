interface User {
  idPersona: string;
  documento: string;
  nombreCompleto: string;
  email: string;
  tel: string;
  legajo: string;
}
export const usuarioActual: User={idPersona: "", documento: "", nombreCompleto: "", email: "", tel: "", legajo: "" };

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

export function JsonStringAObjeto(jsonString:string) {
  return JSON.parse(jsonString);
}
export function JsonACampo(json:JSON) {
    return JSON.parse(JSON.stringify(json));
}

export function SetPersona(jsonString:string) {
    const jsonData = JSON.parse(jsonString);
    usuarioActual.idPersona = jsonData.persona;
    usuarioActual.email = jsonData.email;
    usuarioActual.tel = jsonData.tel;
}
