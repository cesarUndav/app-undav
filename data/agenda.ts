// agenda.ts

import { 
  enModoOscuro, 
  EventoCalendarioAcademico, 
  ObtenerEventosCalendarioAcademico,
  parsearFechaPHP // 🌟 IMPORTADO: Usamos la función global centralizada
} from "./apiAppUndav";

export type EventoAgenda = {
  id: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  esFeriado: boolean;
  descripcion?: string;
  notificar?: false;
  categoria?: number;
};

// vars dev
let devDiaActual = hoyMasDias(0);
let devUltimoId = 3;

// func dev
function diasAMilisegundos(dias:number) { return 86400000 * dias; }
function hoyMasDias(dias:number) { return new Date(Date.now() + diasAMilisegundos(dias)); }
function devHoyMasDiasPermanente(dias:number) { return new Date(devDiaActual.getTime() + diasAMilisegundos(dias)); }

export let listaEventosCalendarioAcademico: EventoAgenda[] = [];

export let listaEventosPersonalizados: EventoAgenda[] = [
  {
    id: "p0",
    titulo: 'Examen parcial de Sistemas Operativos',
    fechaInicio: devHoyMasDiasPermanente(0),
    fechaFin: devHoyMasDiasPermanente(0),
    esFeriado: false
  },
  {
    id: "p1",
    titulo: 'Presentación de Investigación Operativa',
    fechaInicio: devHoyMasDiasPermanente(3),
    fechaFin: devHoyMasDiasPermanente(3),
    esFeriado: false
  },
  {
    id: "p2",
    titulo: 'Entrega del TP2 de Arquitectura',
    fechaInicio: devHoyMasDiasPermanente(10),
    fechaFin: devHoyMasDiasPermanente(15),
    esFeriado: false
  }
];

// EventoCalendarioAcademico (PHP) -> EventoAgenda (App)
function transformarEvento(evento: EventoCalendarioAcademico): EventoAgenda {
  try {
    const fechaInicioParsed = parsearFechaPHP(evento.fecha_inicio);
    const fechaFinParsed = parsearFechaPHP(evento.fecha_fin);

    if (isNaN(fechaInicioParsed.getTime()) || isNaN(fechaFinParsed.getTime())) {
      console.warn(`⚠️ [Transformar] No se pudo parsear la fecha del evento ${evento.id}. Usando fecha actual.`);
    }

    return {
        id: String(evento.id), 
        titulo: evento.titulo,
        fechaInicio: fechaInicioParsed,
        fechaFin: fechaFinParsed,
        esFeriado: !!evento.feriado, 
    };
  } catch (err: any) {
    console.error(`❌ [Transformar] Error transformando evento ${evento?.id}:`, err.message);
    throw err;
  }
}

export async function cargarEventosAcademicos(): Promise<EventoAgenda[]> {
  console.log("🚀 [Agenda] Iniciando cargarEventosAcademicos()...");
  try {
    const eventosAPI: EventoCalendarioAcademico[] = await ObtenerEventosCalendarioAcademico();
    
    console.log(`📥 [API Response] Se recibieron ${eventosAPI?.length || 0} eventos crudos desde PHP.`);
    
    if (!eventosAPI || !Array.isArray(eventosAPI)) {
      console.error("❌ [API Response] La respuesta de la API no es un Array válido:", eventosAPI);
      return [];
    }

    const eventosTransformados = eventosAPI.map(transformarEvento);
    console.log(`✅ [Mapeo] Transformación exitosa de ${eventosTransformados.length} eventos.`);
    
    listaEventosCalendarioAcademico = eventosTransformados;
    
    return eventosTransformados;
  } catch (error: any) {
    console.error("❌ [Fallo Crítico] Error al cargar eventos académicos desde la API PHP:");
    console.error(`   └─ Mensaje: ${error.message}`);
    if (error.response) {
      console.error(`   └─ Server Status: ${error.response.status}`);
      console.error(`   └─ Server Data:`, error.response.data);
    }
    return [];
  }
}

export function agregarEventoPersonalizado(titulo:string, descripcion:string, fechainicio:string, fechaFin:string):void {
  let fi = new Date(fechainicio);
  let ff = new Date(fechaFin);
  if (ff < fi) {
    const aux = ff;
    ff = fi;
    fi = aux;
  }
  const nuevoEvento:EventoAgenda = {
    id: "p"+devUltimoId,
    titulo: titulo,
    descripcion: descripcion,
    fechaInicio: fi,
    fechaFin: ff,
    esFeriado: false
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
  const eventoEditado = obtenerEventoConId(id);
  eventoEditado.titulo = titulo;
  eventoEditado.descripcion = descripcion;
  eventoEditado.fechaInicio = fi;
  eventoEditado.fechaFin = ff;
}

export function quitarEventoPersonalizado(id:string):void {
  const indice = listaEventosPersonalizados.findIndex((evento) => evento.id == id);
  if (indice !== -1) listaEventosPersonalizados.splice(indice, 1);
}

export function obtenerEventoConId(id:string): EventoAgenda {
  const evento = listaEventosPersonalizados.find((evento) => evento.id === id);
  if (!evento) throw new Error("Evento no encontrado");
  return evento;
}

function combinerYOrdenarListas(lista1:EventoAgenda[], lista2: EventoAgenda[]): EventoAgenda[] {
  const lista = lista1.concat(lista2);
  return ordenarEventosPorFecha(lista);
}

function ordenarPorFechaFin(a: EventoAgenda, b: EventoAgenda): number {
  return a.fechaFin.getTime() - b.fechaFin.getTime();
}

function ordenarEventosPorFecha(listaEventos: EventoAgenda[], ascendiente: boolean = true) {
  const copia = [...listaEventos]; 
  if (ascendiente) {
    return copia.sort((a, b) => ordenarPorFechaFin(a, b));
  } else {
    return copia.sort((a, b) => ordenarPorFechaFin(a, b)).reverse();
  }
}

function eventoDuraUnDia(evento: EventoAgenda): boolean {
  return evento.fechaInicio.toDateString() === evento.fechaFin.toDateString();
}

function eventoEnCurso(evento: EventoAgenda): boolean {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const inicio = new Date(evento.fechaInicio);
  inicio.setHours(0, 0, 0, 0);
  
  const fin = new Date(evento.fechaFin);
  fin.setHours(23, 59, 59, 999);

  return hoy >= inicio && hoy <= fin;
}

function eventoFinalizado(evento: EventoAgenda): boolean {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const fin = new Date(evento.fechaFin);
  fin.setHours(23, 59, 59, 999);

  return hoy > fin;
}

function diasHastaFechaActual(targetDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000); 
}

export function DateToFechaString(fecha: Date, separador: string = "/", mostrarAnio: boolean = false): string {
  return `${fecha.getDate()}${separador}${fecha.getMonth()+1}${mostrarAnio ? (separador + fecha.getFullYear()):""}`;
}

function charPlural(plural:string, valorAEvaluar:number) {
  if (valorAEvaluar > 1 || valorAEvaluar < -1) return plural;
  return "";
}

export function listaCompleta(): EventoAgenda[] { 
  // Ahora solo combina Calendario Académico con Eventos Personalizados de forma segura
  return combinerYOrdenarListas(listaEventosCalendarioAcademico, listaEventosPersonalizados); 
}

export function listaFuturo(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }
export function listaFuturoVIEJO(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }
export function listaPasado(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => eventoFinalizado(evento)), false); }
export function listaEnCurso(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => eventoEnCurso(evento))); } 

export function eventoAgendaToFechaString(evento: EventoAgenda): string {
  let intervaloFechaStr = "";
  const duraUnDia = eventoDuraUnDia(evento);

  if (duraUnDia) { 
    intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)}`; 
  } else { 
    intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)} - ${DateToFechaString(evento.fechaFin)}`; 
  }

  let diasStr = "";
  const diasHastaInicio = diasHastaFechaActual(evento.fechaInicio);
  const diasHastaFin = diasHastaFechaActual(evento.fechaFin);

  if (duraUnDia) {
    if (diasHastaInicio > 1) {
      diasStr = `falta${charPlural("n", diasHastaInicio)} ${diasHastaInicio} día${charPlural("s", diasHastaInicio)}`;
    } else if (diasHastaInicio === 0) {
      diasStr = "hoy"; 
    } else if (diasHastaInicio === 1) {
      diasStr = "mañana";
    } else {
      const diasPasados = -diasHastaInicio;
      diasStr = `hace ${diasPasados} día${charPlural("s", diasPasados)}`;
    }
  } else {
    if (diasHastaInicio > 0) {
      diasStr = `inicia en ${diasHastaInicio} día${charPlural("s", diasHastaInicio)}`;
    } else if (diasHastaFin > 0) {
      diasStr = `termina en ${diasHastaFin} día${charPlural("s", diasHastaFin)}`;
    } else if (diasHastaFin === 0) {
      diasStr = "último día";
    } else {
      const diasPasados = -diasHastaFin;
      diasStr = `hace ${diasPasados} día${charPlural("s", diasPasados)}`;
    }
  }

  return `${intervaloFechaStr} (${diasStr})`;
}

export function eventoAgendaTituloColor(evento:EventoAgenda): string {
  return evento.esFeriado ? "#6CACE4" : "#000";
}

export function eventoAgendaProximidadColor(evento:EventoAgenda): string {
  const diasPrioridadUno = 2;
  const diasPrioridadDos = 7;
  const diasPrioridadTres = 15;
  const colorPasado = "#4a4a4a";
  const colorPrioridadUno = '#e10000';
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