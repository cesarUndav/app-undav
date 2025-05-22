// la declaracion de fecha debería ser:
// fechaInicio: new Date('2025-3-1'); // RESPETAR FORMATO: AÑO-MES-DIA
// por cuestiones de DEV se está haciendo con:
// fechaInicio: devHoyMasDias(n);
export type EventoAgenda = {
  id: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  color?: string;
};
// vars dev
let devDiaActual = hoyMasDias(0);
let devUltimoId = 3;
// func dev
function diasAMilisegundos(dias:number) {return 86400000 * dias; }
function hoyMasDias(dias:number) { return new Date(Date.now() + diasAMilisegundos(dias)); }
function devHoyMasDiasPermanente(dias:number) { return new Date(devDiaActual.getTime() + diasAMilisegundos(dias)); }

// listas
export const listaEventosAgenda: EventoAgenda[] = [
  {
    id: "21",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },
  {
    id: "1",
    titulo: 'Evento de prueba 2 lineas ----------------------',
    fechaInicio: new Date('2025-3-1'), 
    fechaFin: new Date('2025-3-28')
  },
  {
    id: "2",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(-2),
    fechaFin: devHoyMasDiasPermanente(2)
  },
  {
    id: "3",
    titulo: 'Evento de prueba 2 lineas ----------------------',
    fechaInicio: devHoyMasDiasPermanente(0),
    fechaFin: devHoyMasDiasPermanente(0)
  },
  {
    id: "4",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(-1),
    fechaFin: devHoyMasDiasPermanente(0)
  },
  {
    id: "5",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(-5),
    fechaFin: devHoyMasDiasPermanente(3)
  },{
    id: "6",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(7),
    fechaFin: devHoyMasDiasPermanente(7)
  }
  ,{
    id: "7",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(10),
    fechaFin: devHoyMasDiasPermanente(10)
  },{
    id: "8",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(15),
    fechaFin: devHoyMasDiasPermanente(15)
  },{
    id: "9",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(20),
    fechaFin: devHoyMasDiasPermanente(20)
  },{
    id: "10",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(25),
    fechaFin: devHoyMasDiasPermanente(25)
  },{
    id: "11",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "12",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "13",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "14",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "15",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "16",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "17",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "18",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "19",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  },{
    id: "20",
    titulo: 'Evento de prueba',
    fechaInicio: devHoyMasDiasPermanente(30),
    fechaFin: devHoyMasDiasPermanente(35)
  }
];
export let listaEventosPersonalizados: EventoAgenda[] = [
  {
  id: "p0",
    titulo: 'Evento Personalizado ',
    fechaInicio: devHoyMasDiasPermanente(1),
    fechaFin: devHoyMasDiasPermanente(1)
  },{
    id: "p1",
    titulo: 'Evento Personalizado ------------------------------------',
    fechaInicio: devHoyMasDiasPermanente(3),
    fechaFin: devHoyMasDiasPermanente(3)
  },
    {
  id: "p2",
    titulo: 'Evento Personalizado ----------------------------------------------------------------------',
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
  console.log("Agregando evento. Len: "+listaEventosPersonalizados.length);
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
  console.log("Editando evento: "+eventoEditado);
}
export function quitarEventoPersonalizado(id:string):void {
  const indice = listaEventosPersonalizados.findIndex((evento) => evento.id == id);
  listaEventosPersonalizados.splice(indice, 1);
  console.log("Quitando evento. Len: "+listaEventosPersonalizados.length);
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
export function DateToFechaString(fecha: Date, separador: string = "/"): string {
  return `${fecha.getDate()}${separador}${fecha.getMonth()+1}${separador}${fecha.getFullYear()}`;
}
function charPlural(plural:string, valorAEvaluar:number) {
  if (valorAEvaluar > 1 || valorAEvaluar < -1) return plural;
  else return "";
}

// export listas
export const listaFuturo: EventoAgenda[] = ordenarEventosPorFechaFin(listaEventosAgenda.filter((evento) => eventoFinalizado(evento)==false));
export const listaPasado: EventoAgenda[] = listaEventosAgenda.filter((evento) => eventoFinalizado(evento) == true);
export function listaCompleta(): EventoAgenda[] { return combinarYOrdenarListas(listaFuturo, listaEventosPersonalizados); };

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
export function eventoAgendaProximidadColor(evento:EventoAgenda): string {
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