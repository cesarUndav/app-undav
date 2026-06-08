// agenda.ts

import { 
  enModoOscuro, 
  EventoCalendarioAcademico, 
  ObtenerEventosCalendarioAcademico,
  parsearFechaPHP // 🌟 IMPORTADO: Usamos la función global centralizada
} from "./apiAppUndav";

// Exportamos un tipo que representa el objeto Evento tal como viene de la API.
export type EventoAPIFlask = {
  id: number; 
  titulo: string;
  fecha_inicio: string; 
  fecha_fin: string; 
  feriado: boolean; 
};

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

// 🌟 Actualizamos el tipo de Cursada para incluir el número de día de forma segura
export type CursadaSIU = { 
  id: string; 
  titulo: string; 
  descripcion: string; 
  dow_semana?: number; 
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

// 🌟 Estas listas se quedan fijas como constantes para NO romper sus referencias al importar
export const listaExamenesSIU: EventoAgenda[] = [];
export const listaCursadasSIU: CursadaSIU[] = [];

// Función para transformar las fechas de exámenes puntuales de la API al formato unificado de la interfaz
function transformarExamenToEvento(item: any, idx: number): EventoAgenda {
  const fechaPuntual = item.fecha ? new Date(item.fecha) : new Date();
  return {
    id: `siu-examen-${idx}`,
    titulo: `[EXAMEN] ${item.actividad_nombre || 'Evaluación'}`,
    descripcion: `${item.horario || ''} | ${item.ubicacion_nombre || 'Sede'} (${item.modalidad || 'Presencial'})`,
    fechaInicio: fechaPuntual,
    fechaFin: fechaPuntual,
    esFeriado: false,
    categoria: 99 
  };
}

export async function cargarDatosSiuGuarani(): Promise<void> {
  try {
    const { infoBaseUsuarioActual, ObtenerAgendaFechas } = await import("./apiAppUndav");
    const personaId = infoBaseUsuarioActual?.idPersona;

    if (!personaId) {
      console.log("⚠️ [Agenda Data] No hay sesión activa para consultar datos de SIU Guaraní.");
      return;
    }

    // 📅 CALCULAR LUNES Y SÁBADO DE LA SEMANA ACTUAL
    const hoy = new Date();
    const diaSemana = hoy.getDay(); 
    
    const diferenciaAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    const lunesActual = new Date(hoy);
    lunesActual.setDate(hoy.getDate() + diferenciaAlLunes);
    
    const sabadoActual = new Date(lunesActual);
    sabadoActual.setDate(lunesActual.getDate() + 5);

    const formatearFechaApi = (d: Date) => {
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const dia = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${mes}-${dia}`;
    };

    const fechaInicioStr = formatearFechaApi(lunesActual);
    const fechaFinStr = formatearFechaApi(sabadoActual);

    console.log(`🔍 [SIU Query] Consultando semana actual desde el Lunes ${fechaInicioStr} hasta el Sábado ${fechaFinStr}`);

    let eventosRemotos = await ObtenerAgendaFechas(fechaInicioStr, fechaFinStr, true);

    // MOCK DE CONTINGENCIA
    if (Array.isArray(eventosRemotos) && eventosRemotos.length === 0) {
      console.log("🛠️ [SIU Sync] Insertando datos simulados semanales...");
      eventosRemotos = [
        {
          actividad_nombre: "Desarrollo de Aplicaciones Móviles",
          tipo_actividad: "Cursada Obligatoria",
          horario: "18:30 a 22:30",
          ubicacion_nombre: "Sede Piñeyro",
          modalidad: "Presencial",
          dow_semana: 3,
          fecha: undefined,
          tipo_persona: "",
          legajo: ""
        },
        {
          actividad_nombre: "Base de Datos II",
          tipo_actividad: "Cursada Obligatoria",
          horario: "14:00 a 18:00",
          ubicacion_nombre: "Sede España",
          modalidad: "Virtual",
          dow_semana: 1,
          fecha: undefined,
          tipo_persona: "",
          legajo: ""
        },
        {
          actividad_nombre: "Examen Parcial Sorpresa",
          tipo_actividad: "Examen",
          horario: "19:00",
          fecha: "2026-05-20", 
          ubicacion_nombre: "Sede Piñeyro",
          modalidad: "Presencial",
          tipo_persona: "",
          legajo: ""
        }
      ];
    }

    const examenesTemp: EventoAgenda[] = [];
    const cursadasTemp: CursadaSIU[] = [];

    if (Array.isArray(eventosRemotos)) {
      eventosRemotos.forEach((item: any, idx: number) => {
        if (item.fecha && item.fecha !== null && item.fecha !== "null") {
          examenesTemp.push(transformarExamenToEvento(item, idx));
        } 
        else if (
          (!item.fecha || item.fecha === null || item.fecha === "null") && 
          item.dow_semana !== undefined && 
          item.dow_semana !== null
        ) {
          const yaExiste = cursadasTemp.some(c => c.titulo === item.actividad_nombre);
          if (!yaExiste) {
            const diasTexto = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
            const nombreDia = diasTexto[item.dow_semana] || "Día a confirmar";

            cursadasTemp.push({
              id: `siu-cursada-${idx}`,
              titulo: item.actividad_nombre || 'Materia regular',
              descripcion: `${nombreDia} | ${item.horario || ''} (${item.modalidad || 'Presencial'})`,
              dow_semana: item.dow_semana // 🌟 Guardado nativo para ordenar sin strings peligrosos
            });
          }
        }
      });
    }

    // 🏛️ ORDENAMIENTO SEGURO DIRECTO POR EL ENTERO DOW
    const cursadasOrdenadas = cursadasTemp.sort((a, b) => {
      return (a.dow_semana || 0) - (b.dow_semana || 0);
    });

    // 🌟 LA SOLUCIÓN MAESTRA: Vaciamos y empujamos datos preservando la referencia del array original
    listaExamenesSIU.length = 0;
    listaExamenesSIU.push(...examenesTemp);

    listaCursadasSIU.length = 0;
    listaCursadasSIU.push(...cursadasOrdenadas);
    
    console.log(`✅ [SIU Sync] Mapeo completado: ${examenesTemp.length} Exámenes y ${cursadasTemp.length} Cursadas estables.`);
  } catch (error) {
    console.error("❌ Fallo crítico al sincronizar datos extendidos de SIU Guaraní:", error);
  }
}

// 🗑️ REMOVIDO: Se borró por completo la función duplicada parsearFechaPHP de este archivo.

// EventoCalendarioAcademico (PHP) -> EventoAgenda (App)
function transformarEvento(evento: EventoCalendarioAcademico): EventoAgenda {
  try {
    // 🌟 CORRECCIÓN: Ahora consume directamente la función global e importada de apiAppUndav
    const fechaInicioParsed = parsearFechaPHP(evento.fecha_inicio);
    const fechaFinParsed = parsearFechaPHP(evento.fecha_fin);

    // Validamos si la conversión funcionó
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
    // 1. Llamamos a la API PHP
    const eventosAPI: EventoCalendarioAcademico[] = await ObtenerEventosCalendarioAcademico();
    
    console.log(`📥 [API Response] Se recibieron ${eventosAPI?.length || 0} eventos crudos desde PHP.`);
    
    if (!eventosAPI || !Array.isArray(eventosAPI)) {
      console.error("❌ [API Response] La respuesta de la API no es un Array válido:", eventosAPI);
      return [];
    }

    // 2. Mapeamos y transformamos
    const eventosTransformados = eventosAPI.map(transformarEvento);
    console.log(`✅ [Mapeo] Transformación exitosa de ${eventosTransformados.length} eventos.`);
    
    // 3. Guardamos en el estado global
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

function combinarYOrdenarListas(lista1:EventoAgenda[], lista2: EventoAgenda[]): EventoAgenda[] {
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

export function DateToFechaString(fecha: Date, separador: string = "/"): string {
  return `${fecha.getDate()}${separador}${fecha.getMonth()+1}${separador}${fecha.getFullYear()}`;
}

function charPlural(plural:string, valorAEvaluar:number) {
  if (valorAEvaluar > 1 || valorAEvaluar < -1) return plural;
  return "";
}

export function listaCompleta(): EventoAgenda[] { 
  const baseLocal = combinarYOrdenarListas(listaEventosCalendarioAcademico, listaEventosPersonalizados); 
  return combinarYOrdenarListas(baseLocal, listaExamenesSIU);
}

export function listaFuturo(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }
export function listaFuturoVIEJO(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }
export function listaPasado(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => eventoFinalizado(evento)), false); }
export function listaEnCurso(): EventoAgenda[] { return ordenarEventosPorFecha(listaCompleta().filter((evento) => eventoEnCurso(evento))); } 

export function eventoAgendaToFechaString(evento: EventoAgenda): string {
  let intervaloFechaStr = "";
  const duraUnDia = eventoDuraUnDia(evento);

  // 1. Armamos el string del rango de fechas
  if (duraUnDia) { 
    intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)}`; 
  } else { 
    intervaloFechaStr = `${DateToFechaString(evento.fechaInicio)} - ${DateToFechaString(evento.fechaFin)}`; 
  }

  let diasStr = "";
  // 🌟 Removemos el "+ 1" para trabajar con los días reales netos (0 = Hoy)
  const diasHastaInicio = diasHastaFechaActual(evento.fechaInicio);
  const diasHastaFin = diasHastaFechaActual(evento.fechaFin);

  // 2. Evaluamos la proximidad según el tipo de evento
  if (duraUnDia) {
    if (diasHastaInicio > 1) {
      diasStr = `falta${charPlural("n", diasHastaInicio)} ${diasHastaInicio} día${charPlural("s", diasHastaInicio)}`;
    } else if (diasHastaInicio === 0) {
      diasStr = "hoy"; // 🎯 Ahora sí entra acá cuando es 0
    } else if (diasHastaInicio === 1) {
      diasStr = "mañana";
    } else {
      const diasPasados = -diasHastaInicio;
      diasStr = `hace ${diasPasados} día${charPlural("s", diasPasados)}`;
    }
  } else {
    // Eventos de varios días (como el receso o inscripciones)
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