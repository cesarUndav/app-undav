// la declaracion de fecha debería ser:
// fechaInicio: new Date('2025-3-1'); // RESPETAR FORMATO: AÑO-MES-DIA
// por cuestiones de DEV se está haciendo con:

import { enModoOscuro } from "./DatosUsuarioGuarani";
import { listaEventosAgenda } from "./notificaciones";

// fechaInicio: devHoyMasDias(n);
export type EventoAgenda = {
  id: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  esFeriado?: Boolean;
  descripcion?: string;
  notificar?: false;
  categoria?: number;
};

// vars dev
let devDiaActual = hoyMasDias(0);
let devUltimoId = 3;
// func dev
function diasAMilisegundos(dias:number) {return 86400000 * dias; }
function hoyMasDias(dias:number) { return new Date(Date.now() + diasAMilisegundos(dias)); }
function devHoyMasDiasPermanente(dias:number) { return new Date(devDiaActual.getTime() + diasAMilisegundos(dias)); }



// listas // FORMATO: new Date(AÑO, MES -1, DIA). EJEMPLO: 1/1/2025 => new Date(2025, 0, 1)
export const listaEventosCalendarioAcademico: EventoAgenda[] = [
  //academicas
  { id: "1", titulo: "Etapa diagnóstica – 1º cuatrimestre", fechaInicio: new Date(2025, 1, 3), fechaFin: new Date(2025, 2, 7) },
  { id: "2", titulo: "Inscripción finales presenciales", fechaInicio: new Date(2025, 1, 12), fechaFin: new Date(2025, 1, 22) },
  { id: "3", titulo: "Inscripción finales a distancia", fechaInicio: new Date(2025, 1, 10), fechaFin: new Date(2025, 1, 13) },
  { id: "4", titulo: "Exámenes finales febrero", fechaInicio: new Date(2025, 1, 17), fechaFin: new Date(2025, 1, 22) },
  { id: "5", titulo: "Actividades académicas de verano", fechaInicio: new Date(2025, 1, 3), fechaFin: new Date(2025, 1, 28) },
  { id: "6", titulo: "Inscripción a asignaturas – 1º cuatrimestre", fechaInicio: new Date(2025, 2, 10), fechaFin: new Date(2025, 2, 18) },
  { id: "7", titulo: "Inicio del 1º cuatrimestre", fechaInicio: new Date(2025, 2, 20), fechaFin: new Date(2025, 2, 20) },
  { id: "7b", titulo: "Fin del 1º cuatrimestre", fechaInicio: new Date(2025, 6, 5), fechaFin: new Date(2025, 6, 5) },
  { id: "8", titulo: "Inscripción finales mayo", fechaInicio: new Date(2025, 3, 21), fechaFin: new Date(2025, 3, 25) },
  { id: "9", titulo: "Exámenes finales mayo", fechaInicio: new Date(2025, 4, 12), fechaFin: new Date(2025, 4, 17) },
  { id: "10", titulo: "Etapa diagnóstica – 2º cuatrimestre", fechaInicio: new Date(2025, 5, 9), fechaFin: new Date(2025, 6, 11) },
  { id: "11", titulo: "Inscripción finales presenciales julio", fechaInicio: new Date(2025, 6, 10), fechaFin: new Date(2025, 6, 12) },
  { id: "12", titulo: "Inscripción finales a distancia julio", fechaInicio: new Date(2025, 6, 7), fechaFin: new Date(2025, 6, 10) },
  { id: "13", titulo: "Exámenes finales julio", fechaInicio: new Date(2025, 6, 14), fechaFin: new Date(2025, 6, 19) },
  { id: "14", titulo: "Receso invernal", fechaInicio: new Date(2025, 6, 21), fechaFin: new Date(2025, 6, 26) },
  { id: "15", titulo: "Inscripción a asignaturas – 2º cuatrimestre", fechaInicio: new Date(2025, 7, 4), fechaFin: new Date(2025, 7, 8) },
  { id: "16", titulo: "Inicio del 2º cuatrimestre", fechaInicio: new Date(2025, 7, 11), fechaFin: new Date(2025, 7, 11) },
  { id: "16b", titulo: "Fin del 2º cuatrimestre", fechaInicio: new Date(2025, 10, 29), fechaFin: new Date(2025, 10, 29) },
  { id: "17", titulo: "Inscripción finales octubre", fechaInicio: new Date(2025, 8, 15), fechaFin: new Date(2025, 8, 19) },
  { id: "18", titulo: "Exámenes finales octubre", fechaInicio: new Date(2025, 8, 29), fechaFin: new Date(2025, 9, 4) },
  { id: "19", titulo: "Inscripción finales presenciales diciembre", fechaInicio: new Date(2025, 11, 4), fechaFin: new Date(2025, 11, 7) },
  { id: "20", titulo: "Inscripción finales a distancia diciembre", fechaInicio: new Date(2025, 11, 1), fechaFin: new Date(2025, 11, 4) },
  { id: "21", titulo: "Exámenes finales diciembre", fechaInicio: new Date(2025, 11, 9), fechaFin: new Date(2025, 11, 15) },

  // Feriados nacionales
  { id: "F1", titulo: "Año Nuevo", fechaInicio: new Date(2025, 0, 1), fechaFin: new Date(2025, 0, 1), esFeriado: true },
  { id: "F2", titulo: "Carnaval", fechaInicio: new Date(2025, 2, 3), fechaFin: new Date(2025, 2, 4), esFeriado: true },
  { id: "F3", titulo: "Día de la Memoria", fechaInicio: new Date(2025, 2, 24), fechaFin: new Date(2025, 2, 24), esFeriado: true },
  { id: "F4", titulo: "Veteranos de Malvinas", fechaInicio: new Date(2025, 3, 2), fechaFin: new Date(2025, 3, 2), esFeriado: true },
  { id: "F5", titulo: "Fundación Avellaneda", fechaInicio: new Date(2025, 3, 7), fechaFin: new Date(2025, 3, 7), esFeriado: true },
  { id: "F6", titulo: "Jueves Santo", fechaInicio: new Date(2025, 3, 17), fechaFin: new Date(2025, 3, 17), esFeriado: true },
  { id: "F7", titulo: "Viernes Santo", fechaInicio: new Date(2025, 3, 18), fechaFin: new Date(2025, 3, 18), esFeriado: true },
  { id: "F8", titulo: "Día del Trabajador", fechaInicio: new Date(2025, 4, 1), fechaFin: new Date(2025, 4, 1), esFeriado: true },
  { id: "F9", titulo: "Pase a la Inmortalidad de Güemes", fechaInicio: new Date(2025, 5, 17), fechaFin: new Date(2025, 5, 17), esFeriado: true },
  { id: "F10", titulo: "Paso a la Inmortalidad de Belgrano", fechaInicio: new Date(2025, 5, 20), fechaFin: new Date(2025, 5, 20), esFeriado: true },
  { id: "F11", titulo: "Día de la Independencia", fechaInicio: new Date(2025, 6, 9), fechaFin: new Date(2025, 6, 9), esFeriado: true },
  { id: "F12", titulo: "Fiestas Patronales Avellaneda", fechaInicio: new Date(2025, 7, 15), fechaFin: new Date(2025, 7, 15), esFeriado: true },
  { id: "F13", titulo: "Paso a la Inmortalidad de San Martín", fechaInicio: new Date(2025, 7, 17), fechaFin: new Date(2025, 7, 17), esFeriado: true },
  { id: "F14", titulo: "Día del Respeto a la Diversidad Cultural", fechaInicio: new Date(2025, 9, 12), fechaFin: new Date(2025, 9, 12), esFeriado: true },
  { id: "F15", titulo: "Día no laboral con fines turísticos", fechaInicio: new Date(2025, 10, 21), fechaFin: new Date(2025, 10, 21), esFeriado: true },
  { id: "F16", titulo: "Día de la Soberanía Nacional", fechaInicio: new Date(2025, 10, 24), fechaFin: new Date(2025, 10, 24), esFeriado: true },
  { id: "F17", titulo: "Inmaculada Concepción", fechaInicio: new Date(2025, 11, 8), fechaFin: new Date(2025, 11, 8), esFeriado: true },
  { id: "F18", titulo: "Navidad", fechaInicio: new Date(2025, 11, 25), fechaFin: new Date(2025, 11, 25), esFeriado: true },
];

export let listaEventosPersonalizados: EventoAgenda[] = [
  {
  id: "p0",
    titulo: 'Evento Personalizado 1',
    fechaInicio: devHoyMasDiasPermanente(0),
    fechaFin: devHoyMasDiasPermanente(0)
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

export function agregarEventoPersonalizado(titulo:string, descripcion:string, fechainicio:string, fechaFin:string):void {
  
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
    descripcion: descripcion,
    fechaInicio: fi,
    fechaFin: ff
  };
  devUltimoId += 1;
  listaEventosPersonalizados.push(nuevoEvento);
}
export function editarEventoPersonalizado(id:string, titulo:string, descripcion:string, fechainicio:string, fechaFin:string):void {
  let fi = new Date(fechainicio);
  let ff = new Date(fechaFin);
  if (ff < fi) {
    const aux = ff;
    ff = fi;
    fi = aux;
  }
  const eventoEditado:EventoAgenda = obtenerEventoConId(id);
  eventoEditado.titulo = titulo;
  eventoEditado.descripcion = descripcion;
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
  return ordenarEventosPorFecha(lista);
}
function fechaYaSucedio(fecha:Date) {
  return Date.now > fecha.getTime;
}
function ordenarPorFechaFin(a:EventoAgenda, b:EventoAgenda):number {
  return (a.fechaFin.getTime() - b.fechaFin.getTime());
  // if (fechaYaSucedio(a.fechaFin)) {
  //   return (a.fechaFin.getTime() - b.fechaFin.getTime());
  // } else {
  //   return (a.fechaInicio.getTime() - b.fechaInicio.getTime());
  // }
}
function ordenarEventosPorFecha(listaEventos: EventoAgenda[], ascendiente:Boolean=true) {
  if (ascendiente) {
    return listaEventos.sort((a,b) =>ordenarPorFechaFin(a,b));
  }
  else return listaEventos.sort((a,b) =>ordenarPorFechaFin(a,b)).reverse();
}
function eventoDuraUnDia(evento:EventoAgenda): Boolean {
  return Boolean(evento.fechaInicio.getDate() == evento.fechaFin.getDate());
}
function eventoEnCurso(evento:EventoAgenda): Boolean {
  return (diasHastaFechaActual(evento.fechaInicio) <= -1 && !eventoFinalizado(evento));
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
export function listaFuturo(): EventoAgenda[] {return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }
export function listaPasado(): EventoAgenda[] {return ordenarEventosPorFecha(listaCompleta().filter((evento) => eventoFinalizado(evento)), false);}
export function listaEnCurso(): EventoAgenda[] {return ordenarEventosPorFecha(listaCompleta().filter((evento) => eventoEnCurso(evento)));} 

// export funcs
export function eventoAgendaToFechaString(evento:EventoAgenda): string {
  let intervaloFechaStr = "";
  const duraUnDia = eventoDuraUnDia(evento);

  if (duraUnDia) { intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)}`; }
  else { intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)} - ${DateToFechaString(evento.fechaFin)}`; }

  let diasStr = "";
  const diasHastaInicio = diasHastaFechaActual(evento.fechaInicio) + 1;
  if (diasHastaInicio > 0) {
    if (duraUnDia) diasStr = `falta${charPlural("n",diasHastaInicio)} ${diasHastaInicio} día${charPlural("s",diasHastaInicio)}`;
    else diasStr = `inicia en ${diasHastaInicio} día${charPlural("s",diasHastaInicio)}`;
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
  return evento.esFeriado? "#6CACE4": (enModoOscuro() ? "#fff":"#000");
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