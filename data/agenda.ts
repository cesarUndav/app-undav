// data/agenda.ts

export type EventoAgenda = {
  id: number;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  color?: string;
};
let devDiaActual = hoyMasDias(0);

// declaracion de fecha-> fechaInicio: new Date('2025-3-1') // RESPETAR FORMATO: AÑO-MES-DIA

export const listaEventosAgenda: EventoAgenda[] = [
  {
    id: 21,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },
  {
    id: 1,
    titulo: 'Desarrollo de actividades de verano',
    fechaInicio: new Date('2025-3-1'), 
    fechaFin: new Date('2025-3-28')
  },
  {
    id: 2,
    titulo: 'Inscripción a Arquitectura de Sistemas de Elaboración de Datos II',
    fechaInicio: devHoyMasDias(-2),
    fechaFin: devHoyMasDias(2)
  },
  {
    id: 3,
    titulo: 'Evento hoy',
    fechaInicio: devHoyMasDias(0),
    fechaFin: devHoyMasDias(0)
  },
  {
    id: 4,
    titulo: 'Evento último día',
    fechaInicio: devHoyMasDias(-1),
    fechaFin: devHoyMasDias(0)
  },
  {
    id: 5,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(-5),
    fechaFin: devHoyMasDias(3)
  },{
    id: 6,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(7),
    fechaFin: devHoyMasDias(7)
  }
  ,{
    id: 7,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(10),
    fechaFin: devHoyMasDias(10)
  },{
    id: 8,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(15),
    fechaFin: devHoyMasDias(15)
  },{
    id: 9,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(20),
    fechaFin: devHoyMasDias(20)
  },{
    id: 10,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(25),
    fechaFin: devHoyMasDias(25)
  },{
    id: 11,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 12,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 13,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 14,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 15,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 16,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 17,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 18,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 19,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  },{
    id: 20,
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDias(30),
    fechaFin: devHoyMasDias(35)
  }
];
// aux dev
function hoyMasDias(dias:number) { return new Date(Date.now() + 86400000 * dias); }
function devHoyMasDias(dias:number) { return new Date(devDiaActual.getTime() + 86400000 * dias); }

// export listas
export const listaFuturo: EventoAgenda[] = ordenarEventosPorFechaFin(listaEventosAgenda.filter((evento) => eventoFinalizado(evento)==false));
export const listaPasado: EventoAgenda[] = listaEventosAgenda.filter((evento) => eventoFinalizado(evento) == true);

// aux listas
function ordenarEventosPorFechaFin(listaEventos: EventoAgenda[]) {
  return listaEventos.sort((a,b) => a.fechaFin.getTime() - b.fechaFin.getTime());
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
function DateToFechaString(fecha: Date): string {
  return `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
}
function charPlural(plural:string, valorAEvaluar:number) {
  if (valorAEvaluar > 1 || valorAEvaluar < -1) return plural;
  else return "";
}
// exports
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
export function eventoAgendaProximidadColor(evento:EventoAgenda): string {
  const diasPrioridadUno = 2;
  const diasPrioridadDos = 7;
  const diasPrioridadTres = 15;
  const colorPasado = "#4a4a4a";
  const colorPrioridadUno = '#8c1500';
  const colorPrioridadDos = "#d12a00";
  const colorPrioridadTres = "#f75b00";
  const colorPrioridadCuatro = "#334a00";

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