// la declaracion de fecha debería ser:
// fechaInicio: new Date('2025-3-1'); // RESPETAR FORMATO: AÑO-MES-DIA
// por cuestiones de DEV se está haciendo con:
// fechaInicio: devHoyMasDias(n);
export type Notificacion = {
  id: string;
  titulo: string;
  fecha: Date;
  tipo?: string;
};

// vars dev
let devDiaActual = hoyMasDias(0);
let devUltimoId = 3;
// func dev
function diasAMilisegundos(dias:number) {return 86400000 * dias; }
function hoyMasDias(dias:number) { return new Date(Date.now() + diasAMilisegundos(dias)); }
function devHoyMasDiasPermanente(dias:number) { return new Date(devDiaActual.getTime() + diasAMilisegundos(dias)); }


// listas
export const listaEventosAgenda: Notificacion[] = [
  // Feriados nacionales
  { id: "F1", titulo: "Año Nuevo", fecha: new Date("2025-01-01") },
  { id: "F2", titulo: "Carnaval", fecha: new Date("2025-03-03") },
  { id: "F3", titulo: "Día de la Memoria", fecha: new Date("2025-03-24") },
  { id: "F4", titulo: "Veteranos de Malvinas", fecha: new Date("2025-04-02") },
  { id: "F5", titulo: "Fundación Avellaneda", fecha: new Date("2025-04-07") },
  { id: "F6", titulo: "Jueves Santo", fecha: new Date("2025-04-17") },
  { id: "F7", titulo: "Viernes Santo", fecha: new Date("2025-04-18") },
  { id: "F8", titulo: "Día del Trabajador", fecha: new Date("2025-05-01") },
  { id: "F9", titulo: "Pase a la Inmortalidad de Güemes", fecha: new Date("2025-06-17") },
  { id: "F10", titulo: "Paso a la Inmortalidad de Belgrano", fecha: new Date("2025-06-20") },
  { id: "F11", titulo: "Día de la Independencia", fecha: new Date("2025-07-09") },
  { id: "F12", titulo: "Fiestas Patronales Avellaneda", fecha: new Date("2025-08-15") },
  { id: "F13", titulo: "Paso a la Inmortalidad de San Martín", fecha: new Date("2025-08-17") },
  { id: "F14", titulo: "Día del Respeto a la Diversidad Cultural", fecha: new Date("2025-10-12") },
  { id: "F15", titulo: "Día no laboral con fines turísticos", fecha: new Date("2025-11-21") },
  { id: "F16", titulo: "Día de la Soberanía Nacional", fecha: new Date("2025-11-24") },
  { id: "F17", titulo: "Inmaculada Concepción", fecha: new Date("2025-12-08") },
  { id: "F18", titulo: "Navidad", fecha: new Date("2025-12-25") },
];

// aux listas

function ordenarEventosPorFechaFin(listaEventos: Notificacion[], ascendiente:Boolean=true) {
  if (ascendiente) return listaEventos.sort((a,b) => a.fecha.getTime() - b.fecha.getTime());
  else return listaEventos.sort((a,b) => b.fecha.getTime() - a.fecha.getTime());
}
function eventoFinalizado(evento:Notificacion): Boolean {
  return diasHastaFechaActual(evento.fecha) < -1;
}
// aux fechas
function diasHastaFechaActual(targetDate: Date): number {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000); // 1000 * 60 * 60 * 24
  return diffDays;
}
export function DateToFechaString(fecha: Date, separador: string = "/"): string {
  return `${fecha.getDate()}${separador}${fecha.getMonth()+1}${separador}${fecha.getFullYear()}`;
}
function charPlural(plural:string, valorAEvaluar:number) {
  if (valorAEvaluar > 1 || valorAEvaluar < -1) return plural;
  else return "";
}

// export listas
export const historialNotificaciones: Notificacion[] = ordenarEventosPorFechaFin(listaEventosAgenda.filter((evento) => eventoFinalizado(evento) == true), false);

// export funcs
let notifCount = -1;
export function getNotificationCount() {return notifCount; }
export function setNotificationCount(amount:number) { notifCount = amount; }

export function notificacionToFechaString(notif:Notificacion): string {
  let intervaloFechaStr = "";
  intervaloFechaStr = `${DateToFechaString(notif.fecha)}`;

  let diasStr = "";
  const diasHastaInicio = diasHastaFechaActual(notif.fecha) + 1;
  if (diasHastaInicio > 0) {
    diasStr = `falta${charPlural("n",diasHastaInicio)} ${diasHastaInicio} día${charPlural("s",diasHastaInicio)}`;
  }
  else {
    if (diasHastaInicio == 0) { diasStr = "hoy"; }
    else { diasStr = `hace ${-diasHastaInicio} día${charPlural("s",diasHastaInicio)}`;}
    
  }
  return `${intervaloFechaStr} (${diasStr})`;
}