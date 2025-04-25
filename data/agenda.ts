// data/agenda.ts

export type EventoAgenda = {
  id: number;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  color?: string;
};
export const listaEventosAgenda: EventoAgenda[] = [
  {
    id: 1,
    titulo: 'Desarrollo de actividades de verano',
    fechaInicio: new Date('2025-3-1'), // RESPETAR FORMATO: AÑO-MES-DIA
    fechaFin: new Date('2025-3-28')
  },
  {
    id: 2,
    titulo: 'Inscripción a Arquitectura de Sistemas de Elaboración de Datos II',
    fechaInicio: new Date('2025-4-24'),
    fechaFin: new Date('2025-4-24')
  },
  {
    id: 3,
    titulo: 'Comprar medias aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    fechaInicio: new Date('2025-4-20'),
    fechaFin: new Date('2025-4-24')
  },
  {
    id: 4,
    titulo: 'Entrega TP Final',
    fechaInicio: new Date('2025-3-3'),
    fechaFin: new Date('2025-4-25'),
  },
  {
    id: 5,
    titulo: 'Desarrollo 1° Cuatrimestre',
    fechaInicio: new Date('2025-4-3'),
    fechaFin: new Date('2025-5-25')
  },{
    id: 6,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 7,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 8,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 9,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 10,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 11,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 12,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 13,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 14,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 15,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 16,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 17,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 18,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 19,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 20,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  },{
    id: 21,
    titulo: 'Inscripción a Finales Mayo',
    fechaInicio: new Date('2025-5-3'),
    fechaFin: new Date('2025-5-3')
  }
];
//export listas
export const listaFuturo: EventoAgenda[] = listaEventosAgenda.filter((evento) => eventoFinalizado(evento)==false);
export const listaPasado: EventoAgenda[] = listaEventosAgenda.filter((evento) => eventoFinalizado(evento) == true);

// aux listas
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
      if (diasHastaFin > 0) { diasStr = `queda${charPlural("n",diasHastaFin)} ${diasHastaFin} día${charPlural("s",diasHastaFin)}`;}
      else if (diasHastaFin == 0) { diasStr = `último día`;}
      else { diasStr = `hace ${-diasHastaFin} día${charPlural("s",diasHastaFin)}`;}
    }
  }
  return `${intervaloFechaStr} (${diasStr})`;
}
export function eventoAgendaProximidadColor(evento:EventoAgenda): string {
  const colorPasado = "#7a7a7a";
  const colorDiaActual = "#ad0c00";
  const colorDentroDeIntervalo = '#ff5100';
  const colorFuturo = "#497a00";

  const diasHastaInicio = diasHastaFechaActual(evento.fechaInicio) + 1;

  if (diasHastaInicio > 0) {
    return colorFuturo;
  }
  else
  {
    if (diasHastaInicio > 0) { return colorFuturo; }
    else
    {
      if (evento.fechaInicio.getDate() == evento.fechaFin.getDate())
      {
        if (diasHastaInicio == 0) { return colorDiaActual; } // hoy
        else { return colorPasado; } // hace X dias
      }
      else
      {
        const diasHastaFin = diasHastaFechaActual(evento.fechaFin) + 1;
        if (diasHastaFin > 0) { return colorDentroDeIntervalo; } // quedan X dias
        else if (diasHastaFin == 0) { return colorDiaActual; } // último día
        else { return colorPasado; } // hace X dias
      }
    }
  }
}