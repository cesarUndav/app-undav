// la declaracion de fecha debería ser:
// fechaInicio: new Date('2025-3-1'); // RESPETAR FORMATO: AÑO-MES-DIA
// por cuestiones de DEV se está haciendo con:

import { listaEventosAgenda } from "./notificaciones";

// fechaInicio: devHoyMasDias(n);
export type EventoAgenda = {
  id: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  esFeriado?: Boolean;
  notificar?: false;
};

// vars dev
let devDiaActual = hoyMasDias(0);
let devUltimoId = 3;
// func dev
function diasAMilisegundos(dias:number) {return 86400000 * dias; }
function hoyMasDias(dias:number) { return new Date(Date.now() + diasAMilisegundos(dias)); }
function devHoyMasDiasPermanente(dias:number) { return new Date(devDiaActual.getTime() + diasAMilisegundos(dias)); }



// listas
export const listaEventosCalendarioAcademico: EventoAgenda[] = [
// Actividades académicas
  { id: "1", titulo: "Etapa diagnóstica – 1º cuatrimestre", fechaInicio: new Date("2025-02-03"), fechaFin: new Date("2025-03-07") },
  { id: "2", titulo: "Inscripción finales presenciales", fechaInicio: new Date("2025-02-12"), fechaFin: new Date("2025-02-22") },
  { id: "3", titulo: "Inscripción finales a distancia", fechaInicio: new Date("2025-02-10"), fechaFin: new Date("2025-02-13") },
  { id: "4", titulo: "Exámenes finales febrero", fechaInicio: new Date("2025-02-17"), fechaFin: new Date("2025-02-22") },
  { id: "5", titulo: "Actividades académicas de verano", fechaInicio: new Date("2025-02-03"), fechaFin: new Date("2025-02-28") },
  { id: "6", titulo: "Inscripción a asignaturas – 1º cuatrimestre", fechaInicio: new Date("2025-03-10"), fechaFin: new Date("2025-03-18") },
  { id: "7", titulo: "Inicio del 1º cuatrimestre", fechaInicio: new Date("2025-03-20"), fechaFin: new Date("2025-03-20") },
  { id: "7b", titulo: "Fin del 1º cuatrimestre", fechaInicio: new Date("2025-07-05"), fechaFin: new Date("2025-07-05") },
  { id: "8", titulo: "Inscripción finales mayo", fechaInicio: new Date("2025-04-21"), fechaFin: new Date("2025-04-25") },
  { id: "9", titulo: "Exámenes finales mayo", fechaInicio: new Date("2025-05-12"), fechaFin: new Date("2025-05-17") },
  { id: "10", titulo: "Etapa diagnóstica – 2º cuatrimestre", fechaInicio: new Date("2025-06-09"), fechaFin: new Date("2025-07-11") },
  { id: "11", titulo: "Inscripción finales presenciales julio", fechaInicio: new Date("2025-07-10"), fechaFin: new Date("2025-07-12") },
  { id: "12", titulo: "Inscripción finales a distancia julio", fechaInicio: new Date("2025-07-07"), fechaFin: new Date("2025-07-10") },
  { id: "13", titulo: "Exámenes finales julio", fechaInicio: new Date("2025-07-14"), fechaFin: new Date("2025-07-19") },
  { id: "14", titulo: "Receso invernal", fechaInicio: new Date("2025-07-21"), fechaFin: new Date("2025-07-26") },
  { id: "15", titulo: "Inscripción a asignaturas – 2º cuatrimestre", fechaInicio: new Date("2025-08-04"), fechaFin: new Date("2025-08-08") },
  { id: "16", titulo: "Inicio del 2º cuatrimestre", fechaInicio: new Date("2025-08-11"), fechaFin: new Date("2025-08-11") },
  { id: "16b", titulo: "Fin del 2º cuatrimestre", fechaInicio: new Date("2025-11-29"), fechaFin: new Date("2025-11-29") },
  { id: "17", titulo: "Inscripción finales octubre", fechaInicio: new Date("2025-09-15"), fechaFin: new Date("2025-09-19") },
  { id: "18", titulo: "Exámenes finales octubre", fechaInicio: new Date("2025-09-29"), fechaFin: new Date("2025-10-04") },
  { id: "19", titulo: "Inscripción finales presenciales diciembre", fechaInicio: new Date("2025-12-04"), fechaFin: new Date("2025-12-07") },
  { id: "20", titulo: "Inscripción finales a distancia diciembre", fechaInicio: new Date("2025-12-01"), fechaFin: new Date("2025-12-04") },
  { id: "21", titulo: "Exámenes finales diciembre", fechaInicio: new Date("2025-12-09"), fechaFin: new Date("2025-12-15") },
  // { id: "00", titulo: 'Evento de prueba', fechaInicio: devHoyMasDiasPermanente(30), fechaFin: devHoyMasDiasPermanente(35) },

  // Feriados nacionales
  { id: "F1", titulo: "Año Nuevo", fechaInicio: new Date("2025-01-01"), fechaFin: new Date("2025-01-01"), esFeriado: true },
  { id: "F2", titulo: "Carnaval", fechaInicio: new Date("2025-03-03"), fechaFin: new Date("2025-03-04"), esFeriado: true },
  { id: "F3", titulo: "Día de la Memoria", fechaInicio: new Date("2025-03-24"), fechaFin: new Date("2025-03-24"), esFeriado: true },
  { id: "F4", titulo: "Veteranos de Malvinas", fechaInicio: new Date("2025-04-02"), fechaFin: new Date("2025-04-02"), esFeriado: true },
  { id: "F5", titulo: "Fundación Avellaneda", fechaInicio: new Date("2025-04-07"), fechaFin: new Date("2025-04-07"), esFeriado: true },
  { id: "F6", titulo: "Jueves Santo", fechaInicio: new Date("2025-04-17"), fechaFin: new Date("2025-04-17"), esFeriado: true },
  { id: "F7", titulo: "Viernes Santo", fechaInicio: new Date("2025-04-18"), fechaFin: new Date("2025-04-18"), esFeriado: true },
  { id: "F8", titulo: "Día del Trabajador", fechaInicio: new Date("2025-05-01"), fechaFin: new Date("2025-05-01"), esFeriado: true },
  { id: "F9", titulo: "Pase a la Inmortalidad de Güemes", fechaInicio: new Date("2025-06-17"), fechaFin: new Date("2025-06-17"), esFeriado: true },
  { id: "F10", titulo: "Paso a la Inmortalidad de Belgrano", fechaInicio: new Date("2025-06-20"), fechaFin: new Date("2025-06-20"), esFeriado: true },
  { id: "F11", titulo: "Día de la Independencia", fechaInicio: new Date("2025-07-09"), fechaFin: new Date("2025-07-09"), esFeriado: true },
  { id: "F12", titulo: "Fiestas Patronales Avellaneda", fechaInicio: new Date("2025-08-15"), fechaFin: new Date("2025-08-15"), esFeriado: true },
  { id: "F13", titulo: "Paso a la Inmortalidad de San Martín", fechaInicio: new Date("2025-08-17"), fechaFin: new Date("2025-08-17"), esFeriado: true },
  { id: "F14", titulo: "Día del Respeto a la Diversidad Cultural", fechaInicio: new Date("2025-10-12"), fechaFin: new Date("2025-10-12"), esFeriado: true },
  { id: "F15", titulo: "Día no laboral con fines turísticos", fechaInicio: new Date("2025-11-21"), fechaFin: new Date("2025-11-21"), esFeriado: true },
  { id: "F16", titulo: "Día de la Soberanía Nacional", fechaInicio: new Date("2025-11-24"), fechaFin: new Date("2025-11-24"), esFeriado: true },
  { id: "F17", titulo: "Inmaculada Concepción", fechaInicio: new Date("2025-12-08"), fechaFin: new Date("2025-12-08"), esFeriado: true },
  { id: "F18", titulo: "Navidad", fechaInicio: new Date("2025-12-25"), fechaFin: new Date("2025-12-25"), esFeriado: true },
];
export let listaEventosPersonalizados: EventoAgenda[] = [
  {
  id: "p0",
    titulo: 'Evento Personalizado 1',
    fechaInicio: devHoyMasDiasPermanente(1),
    fechaFin: devHoyMasDiasPermanente(1)
  },{
    id: "p1",
    titulo: 'Evento Personalizado 2',
    fechaInicio: devHoyMasDiasPermanente(3),
    fechaFin: devHoyMasDiasPermanente(3)
  },
    {
  id: "p2",
    titulo: 'Evento Personalizado 3',
    fechaInicio: devHoyMasDiasPermanente(10),
    fechaFin: devHoyMasDiasPermanente(15)
  }
];

// funciones
export function agregarEventoPersonalizado(titulo:string, fechainicio:string, fechaFin:string):void {
  
  let fi = new Date(fechainicio);
  let ff = new Date(fechaFin);
  if (ff < fi) {
    const aux = ff;
    ff = fi;
    fi = aux;
  }
  const nuevoEvento:EventoAgenda =
  {
    id: "p"+devUltimoId,
    titulo: titulo,
    fechaInicio: fi,
    fechaFin: ff
  };
  devUltimoId += 1;
  listaEventosPersonalizados.push(nuevoEvento);
}
export function editarEventoPersonalizado(id:string, titulo:string, fechainicio:string, fechaFin:string):void {
  let fi = new Date(fechainicio);
  let ff = new Date(fechaFin);
  if (ff < fi) {
    const aux = ff;
    ff = fi;
    fi = aux;
  }
  const eventoEditado:EventoAgenda = obtenerEventoConId(id);
  eventoEditado.titulo = titulo;
  eventoEditado.fechaInicio = fi;
  eventoEditado.fechaFin = ff;
}
export function quitarEventoPersonalizado(id:string):void {
  const indice = listaEventosPersonalizados.findIndex((evento) => evento.id == id);
  listaEventosPersonalizados.splice(indice, 1);
}
export function obtenerEventoConId(id:string): EventoAgenda {
  const evento = listaEventosPersonalizados.find((evento) => evento.id === id);
  if (!evento) throw new Error("Evento no encontrado");
  return evento;
}

// aux listas
function combinarYOrdenarListas(lista1:EventoAgenda[], lista2: EventoAgenda[]): EventoAgenda[] {
  const lista = lista1.concat(lista2);
  return ordenarEventosPorFechaFin(lista);
}
function fechaYaSucedio(fecha:Date) {
  return fecha.getTime < Date.now;
}
function ordenar(a:EventoAgenda, b:EventoAgenda):number {
  // return (a.fechaFin.getTime() - b.fechaFin.getTime());
  if (!fechaYaSucedio(a.fechaFin)) {
    return (a.fechaFin.getTime() - b.fechaFin.getTime());
  } else {
    return (a.fechaInicio.getTime() - b.fechaInicio.getTime());
  }
}
function ordenarEventosPorFechaFin(listaEventos: EventoAgenda[], ascendiente:Boolean=true) {
  if (ascendiente) {
    return listaEventos.sort((a,b) =>ordenar(a,b));
  }
  else return listaEventos.sort((a,b) =>ordenar(a,b)).reverse();
}
function ordenarEventosPorFechaFin2(listaEventos: EventoAgenda[], ascendiente:Boolean=true) {
  if (ascendiente) {
    return listaEventos.sort((a,b) => a.fechaFin.getTime() - b.fechaFin.getTime());
  }
  else return listaEventos.sort((a,b) => b.fechaFin.getTime() - a.fechaFin.getTime());
}
function eventoDuraUnDia(evento:EventoAgenda): Boolean {
  return Boolean(evento.fechaInicio.getDate() == evento.fechaFin.getDate());
}
function eventoEnCurso(evento:EventoAgenda): Boolean {
  if (!eventoDuraUnDia(evento) && diasHastaFechaActual(evento.fechaInicio) <= 0 && !eventoFinalizado(evento)) return true;
  else return false;
}
function eventoEnCursoFinalizaHoy(evento:EventoAgenda): Boolean {
  return eventoEnCurso(evento)==true && diasHastaFechaActual(evento.fechaFin) == -1;
}
function eventoFinalizado(evento:EventoAgenda): Boolean {
  return diasHastaFechaActual(evento.fechaFin) < -1;
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
// export function listaFuturoFiltros(mostrarFeriados:Boolean): EventoAgenda[] {
//   return ordenarEventosPorFechaFin(listaEventosAgenda.filter((evento) => eventoFinalizado(evento)==false)); }
export function listaCompleta(): EventoAgenda[] { return combinarYOrdenarListas(listaEventosCalendarioAcademico, listaEventosPersonalizados); };
export const listaFuturo: EventoAgenda[] = ordenarEventosPorFechaFin(listaCompleta().filter((evento) => eventoFinalizado(evento)==false));
export const listaPasado: EventoAgenda[] = ordenarEventosPorFechaFin(listaCompleta().filter((evento) => eventoFinalizado(evento) == true), false);

// export funcs
export function eventoAgendaToFechaString(evento:EventoAgenda): string {
  let intervaloFechaStr = "";
  const duraUnDia = eventoDuraUnDia(evento);

  if (duraUnDia) { intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)}`; }
  else { intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)} - ${DateToFechaString(evento.fechaFin)}`; }

  let diasStr = "";
  const diasHastaInicio = diasHastaFechaActual(evento.fechaInicio) + 1;
  if (diasHastaInicio > 0) {
    diasStr = `falta${charPlural("n",diasHastaInicio)} ${diasHastaInicio} día${charPlural("s",diasHastaInicio)}`;
  }
  else {
    if (duraUnDia)
    {
      if (diasHastaInicio == 0) { diasStr = "hoy"; }
      else { diasStr = `hace ${-diasHastaInicio} día${charPlural("s",diasHastaInicio)}`;}
    }
    else
    {
      const diasHastaFin = diasHastaFechaActual(evento.fechaFin) + 1;
      if (diasHastaFin > 0) { diasStr = `termina en ${diasHastaFin} día${charPlural("s",diasHastaFin)}`;}
      else if (diasHastaFin == 0) { diasStr = `último día`;}
      else { diasStr = `hace ${-diasHastaFin} día${charPlural("s",diasHastaFin)}`;}
    }
  }
  return `${intervaloFechaStr} (${diasStr})`;
}
export function eventoAgendaTituloColor(evento:EventoAgenda): string {
  return evento.esFeriado? "#6CACE4":"#000";
}
export function eventoAgendaProximidadColor(evento:EventoAgenda): string {
  // const colorFeriado = "#6CACE4";
  // if (evento.esFeriado) return colorFeriado;

  const diasPrioridadUno = 2;
  const diasPrioridadDos = 7;
  const diasPrioridadTres = 15;
  const colorPasado = "#4a4a4a";
  const colorPrioridadUno = '#cc0000';
  const colorPrioridadDos = "#e83000";
  const colorPrioridadTres = "#e88200";
  const colorPrioridadCuatro = "#3e8800";

  const diasHastaFin = diasHastaFechaActual(evento.fechaFin);

  if (diasHastaFin < -1) {
    return colorPasado;
  } else if (diasHastaFin < diasPrioridadUno) {
    return colorPrioridadUno;
  } else if (diasHastaFin < diasPrioridadDos) {
    return colorPrioridadDos;
  } else if (diasHastaFin < diasPrioridadTres) {
    return colorPrioridadTres;
  } else {
    return colorPrioridadCuatro;
  }
}