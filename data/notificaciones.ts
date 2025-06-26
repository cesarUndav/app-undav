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
  { id: "A1", titulo: "Inscripción a materias abierta", fecha: new Date("2025-02-10") },
  { id: "A2", titulo: "Publicación de notas del 1° parcial", fecha: new Date("2025-04-18") },
  { id: "A3", titulo: "Recordatorio: Entrega de TP1 mañana", fecha: new Date("2025-05-02") },
  { id: "A4", titulo: "Clase cancelada: Sistemas Operativos", fecha: new Date("2025-06-12") },
  { id: "A5", titulo: "Aula cambiada: Análisis Matemático I", fecha: new Date("2025-04-03") },

  { id: "F1", titulo: "Feriado: Día de la Mujer", fecha: new Date("2025-03-08") },
  { id: "F2", titulo: "Feriado: Semana Santa", fecha: new Date("2025-04-18") },
  { id: "F3", titulo: "Feriado: Día de la Memoria", fecha: new Date("2025-03-24") },
  { id: "F4", titulo: "Feriado: Día del Trabajador", fecha: new Date("2025-05-01") },
  { id: "F5", titulo: "Feriado: Paso a la Inmortalidad de Belgrano", fecha: new Date("2025-06-20") },

  { id: "E1", titulo: "Seminario: Inteligencia Artificial y Sociedad", fecha: new Date("2025-05-15") },
  { id: "E2", titulo: "Charla informativa: Becas Progresar", fecha: new Date("2025-03-12") },
  { id: "E3", titulo: "Convocatoria abierta: Intercambio a México", fecha: new Date("2025-04-01") },
  { id: "E4", titulo: "Taller de Primeros Auxilios", fecha: new Date("2025-06-03") },
  { id: "E5", titulo: "Competencia de programación interna", fecha: new Date("2025-06-10") },

  { id: "S1", titulo: "Actualización del sistema SIU Guaraní", fecha: new Date("2025-02-28") },
  { id: "S2", titulo: "Corte de luz programado en sede central", fecha: new Date("2025-03-25") },
  { id: "S3", titulo: "Nueva versión disponible de la app", fecha: new Date("2025-04-09") },
  { id: "S4", titulo: "Reestablecido el acceso al campus virtual", fecha: new Date("2025-05-06") }
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