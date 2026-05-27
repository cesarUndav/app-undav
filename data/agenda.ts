// la declaracion de fecha debería ser:
// fechaInicio: new Date('2025-3-1'); // RESPETAR FORMATO: AÑO-MES-DIA
// por cuestiones de DEV se está haciendo con:

import { enModoOscuro } from "./DatosUsuarioGuarani";
import { listaEventosAgenda } from "./notificaciones";
import { api } from "./apiFlaskClient";

// Exportamos un tipo que representa el objeto Evento tal como viene de la API.
export type EventoAPIFlask = {
  id: number; // La API devuelve un ID numérico (db.Integer)
  titulo: string;
  fecha_inicio: string; // La API devuelve la fecha como string (ISO 8601)
  fecha_fin: string; // La API devuelve la fecha como string (ISO 8601)
  feriado: boolean; // Bool feriado de API
};

// fechaInicio: devHoyMasDias(n);
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
function diasAMilisegundos(dias:number) {return 86400000 * dias; }
function hoyMasDias(dias:number) { return new Date(Date.now() + diasAMilisegundos(dias)); }
function devHoyMasDiasPermanente(dias:number) { return new Date(devDiaActual.getTime() + diasAMilisegundos(dias)); }


// listas // FORMATO: new Date(AÑO, MES -1, DIA). EJEMPLO: 1/1/2025 => new Date(2025, 0, 1)
// export const listaEventosCalendarioAcademico: EventoAgenda[] = [
//   //academicas
//   { id: "1", titulo: "Etapa diagnóstica – 1º cuatrimestre", fechaInicio: new Date(2025, 1, 3), fechaFin: new Date(2025, 2, 7) },
//   { id: "2", titulo: "Inscripción finales presenciales", fechaInicio: new Date(2025, 1, 12), fechaFin: new Date(2025, 1, 22) },
//   { id: "3", titulo: "Inscripción finales a distancia", fechaInicio: new Date(2025, 1, 10), fechaFin: new Date(2025, 1, 13) },
//   { id: "4", titulo: "Exámenes finales febrero", fechaInicio: new Date(2025, 1, 17), fechaFin: new Date(2025, 1, 22) },
//   { id: "5", titulo: "Actividades académicas de verano", fechaInicio: new Date(2025, 1, 3), fechaFin: new Date(2025, 1, 28) },
//   { id: "6", titulo: "Inscripción a asignaturas – 1º cuatrimestre", fechaInicio: new Date(2025, 2, 10), fechaFin: new Date(2025, 2, 18) },
//   { id: "7", titulo: "Inicio del 1º cuatrimestre", fechaInicio: new Date(2025, 2, 20), fechaFin: new Date(2025, 2, 20) },
//   { id: "7b", titulo: "Fin del 1º cuatrimestre", fechaInicio: new Date(2025, 6, 5), fechaFin: new Date(2025, 6, 5) },
//   { id: "8", titulo: "Inscripción finales mayo", fechaInicio: new Date(2025, 3, 21), fechaFin: new Date(2025, 3, 25) },
//   { id: "9", titulo: "Exámenes finales mayo", fechaInicio: new Date(2025, 4, 12), fechaFin: new Date(2025, 4, 17) },
//   { id: "10", titulo: "Etapa diagnóstica – 2º cuatrimestre", fechaInicio: new Date(2025, 5, 9), fechaFin: new Date(2025, 6, 11) },
//   { id: "11", titulo: "Inscripción finales presenciales julio", fechaInicio: new Date(2025, 6, 10), fechaFin: new Date(2025, 6, 12) },
//   { id: "12", titulo: "Inscripción finales a distancia julio", fechaInicio: new Date(2025, 6, 7), fechaFin: new Date(2025, 6, 10) },
//   { id: "13", titulo: "Exámenes finales julio", fechaInicio: new Date(2025, 6, 14), fechaFin: new Date(2025, 6, 19) },
//   { id: "14", titulo: "Receso invernal", fechaInicio: new Date(2025, 6, 21), fechaFin: new Date(2025, 6, 26) },
//   { id: "15", titulo: "Inscripción a asignaturas – 2º cuatrimestre", fechaInicio: new Date(2025, 7, 4), fechaFin: new Date(2025, 7, 8) },
//   { id: "16", titulo: "Inicio del 2º cuatrimestre", fechaInicio: new Date(2025, 7, 11), fechaFin: new Date(2025, 7, 11) },
//   { id: "16b", titulo: "Fin del 2º cuatrimestre", fechaInicio: new Date(2025, 10, 29), fechaFin: new Date(2025, 10, 29) },
//   { id: "17", titulo: "Inscripción finales octubre", fechaInicio: new Date(2025, 8, 15), fechaFin: new Date(2025, 8, 19) },
//   { id: "18", titulo: "Exámenes finales octubre", fechaInicio: new Date(2025, 8, 29), fechaFin: new Date(2025, 9, 4) },
//   { id: "19", titulo: "Inscripción finales presenciales diciembre", fechaInicio: new Date(2025, 11, 4), fechaFin: new Date(2025, 11, 7) },
//   { id: "20", titulo: "Inscripción finales a distancia diciembre", fechaInicio: new Date(2025, 11, 1), fechaFin: new Date(2025, 11, 4) },
//   { id: "21", titulo: "Exámenes finales diciembre", fechaInicio: new Date(2025, 11, 9), fechaFin: new Date(2025, 11, 15) },

//   // Feriados nacionales
//   { id: "F1", titulo: "Año Nuevo", fechaInicio: new Date(2025, 0, 1), fechaFin: new Date(2025, 0, 1), esFeriado: true },
//   { id: "F2", titulo: "Carnaval", fechaInicio: new Date(2025, 2, 3), fechaFin: new Date(2025, 2, 4), esFeriado: true },
//   { id: "F3", titulo: "Día de la Memoria", fechaInicio: new Date(2025, 2, 24), fechaFin: new Date(2025, 2, 24), esFeriado: true },
//   { id: "F4", titulo: "Veteranos de Malvinas", fechaInicio: new Date(2025, 3, 2), fechaFin: new Date(2025, 3, 2), esFeriado: true },
//   { id: "F5", titulo: "Fundación Avellaneda", fechaInicio: new Date(2025, 3, 7), fechaFin: new Date(2025, 3, 7), esFeriado: true },
//   { id: "F6", titulo: "Jueves Santo", fechaInicio: new Date(2025, 3, 17), fechaFin: new Date(2025, 3, 17), esFeriado: true },
//   { id: "F7", titulo: "Viernes Santo", fechaInicio: new Date(2025, 3, 18), fechaFin: new Date(2025, 3, 18), esFeriado: true },
//   { id: "F8", titulo: "Día del Trabajador", fechaInicio: new Date(2025, 4, 1), fechaFin: new Date(2025, 4, 1), esFeriado: true },
//   { id: "F9", titulo: "Pase a la Inmortalidad de Güemes", fechaInicio: new Date(2025, 5, 17), fechaFin: new Date(2025, 5, 17), esFeriado: true },
//   { id: "F10", titulo: "Paso a la Inmortalidad de Belgrano", fechaInicio: new Date(2025, 5, 20), fechaFin: new Date(2025, 5, 20), esFeriado: true },
//   { id: "F11", titulo: "Día de la Independencia", fechaInicio: new Date(2025, 6, 9), fechaFin: new Date(2025, 6, 9), esFeriado: true },
//   { id: "F12", titulo: "Fiestas Patronales Avellaneda", fechaInicio: new Date(2025, 7, 15), fechaFin: new Date(2025, 7, 15), esFeriado: true },
//   { id: "F13", titulo: "Paso a la Inmortalidad de San Martín", fechaInicio: new Date(2025, 7, 17), fechaFin: new Date(2025, 7, 17), esFeriado: true },
//   { id: "F14", titulo: "Día del Respeto a la Diversidad Cultural", fechaInicio: new Date(2025, 9, 12), fechaFin: new Date(2025, 9, 12), esFeriado: true },
//   { id: "F15", titulo: "Día no laboral con fines turísticos", fechaInicio: new Date(2025, 10, 21), fechaFin: new Date(2025, 10, 21), esFeriado: true },
//   { id: "F16", titulo: "Día de la Soberanía Nacional", fechaInicio: new Date(2025, 10, 24), fechaFin: new Date(2025, 10, 24), esFeriado: true },
//   { id: "F17", titulo: "Inmaculada Concepción", fechaInicio: new Date(2025, 11, 8), fechaFin: new Date(2025, 11, 8), esFeriado: true },
//   { id: "F18", titulo: "Navidad", fechaInicio: new Date(2025, 11, 25), fechaFin: new Date(2025, 11, 25), esFeriado: true },
// ];
export let listaEventosCalendarioAcademico: EventoAgenda[] = [];

export let listaEventosPersonalizados: EventoAgenda[] = [
  {
  id: "p0",
    titulo: 'Examen parcial de Sistemas Operativos',
    fechaInicio: devHoyMasDiasPermanente(0),
    fechaFin: devHoyMasDiasPermanente(0),
    esFeriado: false
  },{
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

export let listaExamenesSIU: EventoAgenda[] = [];
export let listaCursadasSIU: { id: string; titulo: string; descripcion: string }[] = [];

// funciones
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
    categoria: 99 // 🌟 CRUCIAL: El ID de filtro para agenda.tsx
  };
}

export async function cargarDatosSiuGuarani(): Promise<void> {
  try {
    const { infoBaseUsuarioActual, ObtenerAgendaFechas } = await import("./DatosUsuarioGuarani");
    const personaId = infoBaseUsuarioActual?.idPersona;

    if (!personaId) {
      console.log("⚠️ [Agenda Data] No hay sesión activa para consultar datos de SIU Guaraní.");
      return;
    }

    // 📅 CALCULAR LUNES Y SÁBADO DE LA SEMANA ACTUAL
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    
    // Calcular cuántos días restar para llegar al Lunes (si hoy es domingo (0), restamos 6 días)
    const diferenciaAlLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    const lunesActual = new Date(hoy);
    lunesActual.setDate(hoy.getDate() + diferenciaAlLunes);
    
    // El sábado es 5 días después del lunes
    const sabadoActual = new Date(lunesActual);
    sabadoActual.setDate(lunesActual.getDate() + 5);

    // Formatear las fechas en formato estricto AÑO-MES-DIA (YYYY-MM-DD)
    const formatearFechaApi = (d: Date) => {
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const dia = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${mes}-${dia}`;
    };

    const fechaInicioStr = formatearFechaApi(lunesActual);
    const fechaFinStr = formatearFechaApi(sabadoActual);

    console.log(`🔍 [SIU Query] Consultando semana actual desde el Lunes ${fechaInicioStr} hasta el Sábado ${fechaFinStr}`);

    // Llamada real a la API con el nuevo rango acotado de la semana
    let eventosRemotos = await ObtenerAgendaFechas(fechaInicioStr, fechaFinStr, true);

    console.log("🚨 [RESPUESTA REAL SIU]:", JSON.stringify(eventosRemotos));

    // 💡 MOCK DE CONTINGENCIA CORREGIDO PARA TYPESCRIPT
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
          fecha: undefined // 🌟 CORREGIDO: 'undefined' remueve el conflicto de asignación
          ,
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
          fecha: undefined // 🌟 CORREGIDO: Quitamos las propiedades 'legajo' y 'tipo_persona' sobrantes
          ,
          tipo_persona: "",
          legajo: ""
        },
        {
          actividad_nombre: "Examen Parcial Sorpresa",
          tipo_actividad: "Examen",
          horario: "19:00",
          fecha: "2026-05-20", // NO va a MIS MATERIAS porque tiene fecha (es un evento de agenda)
          ubicacion_nombre: "Sede Piñeyro",
          modalidad: "Presencial",
          tipo_persona: "",
          legajo: ""
        }
      ];
    }

    const examenesTemp: EventoAgenda[] = [];
    const cursadasTemp: { id: string; titulo: string; descripcion: string }[] = [];

    if (Array.isArray(eventosRemotos)) {
      eventosRemotos.forEach((item: any, idx: number) => {
        
        // 1. Si tiene fecha válida, se procesa como Examen/Evento puntual para la Agenda
        if (item.fecha && item.fecha !== null && item.fecha !== "null") {
          examenesTemp.push(transformarExamenToEvento(item, idx));
        } 
        
        // 2. 🏛️ FILTRADO ESTRICTO PARA MIS MATERIAS (en data/agenda.ts):
        else if (
          (!item.fecha || item.fecha === null || item.fecha === "null") && 
          item.dow_semana !== undefined && 
          item.dow_semana !== null
        ) {
          const yaExiste = cursadasTemp.some(c => c.titulo === item.actividad_nombre);
          if (!yaExiste) {
            // Array auxiliar para traducir el integer (asumiendo 1 = Lunes, 2 = Martes... si 0 es Domingo, se ajusta directo)
            const diasTexto = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
            const nombreDia = diasTexto[item.dow_semana] || "Día a confirmar";

            cursadasTemp.push({
              id: `siu-cursada-${idx}`,
              titulo: item.actividad_nombre || 'Materia regular',
              // 🌟 Agregamos el texto del día al principio del subtítulo
              descripcion: `${nombreDia} | ${item.horario || ''} (${item.modalidad || 'Presencial'})`
            });
          }
        }
      });
    }

    // 🏛️ ORDENAR DE LUNES A SÁBADO ANTES DE ASIGNAR
    // Compara el número de día extraído de la propiedad 'id' o lo manejamos ordenando el array temporal:
    const cursadasOrdenadas = cursadasTemp.sort((a, b) => {
      // Extraemos el índice original del elemento mapeado para usar el objeto nativo que vino de la API
      const idxA = parseInt(a.id.split('-')[2]);
      const idxB = parseInt(b.id.split('-')[2]);
      
      const diaA = eventosRemotos[idxA]?.dow_semana || 0;
      const diaB = eventosRemotos[idxB]?.dow_semana || 0;
      
      return diaA - diaB;
    });

    listaExamenesSIU = examenesTemp;
    listaCursadasSIU = cursadasOrdenadas; // 🌟 Guardamos la lista ya ordenada cronológicamente
    
    console.log(`✅ [SIU Sync] Mapeo semanal completado y ordenado: ${examenesTemp.length} Exámenes y ${cursadasTemp.length} Cursadas estrictas.`);
  } catch (error) {
    console.error("❌ Fallo crítico al sincronizar datos extendidos de SIU Guaraní:", error);
  }
}

// EventoAPIFlask -> EventoAgenda
function transformarEvento(evento: EventoAPIFlask): EventoAgenda {
  return {
      id: String(evento.id), // Convertir a string para usar como key en React
      titulo: evento.titulo,
      // Usar new Date() en la cadena ISO para obtener el objeto Date
      fechaInicio: new Date(evento.fecha_inicio),
      fechaFin: new Date(evento.fecha_fin),
      esFeriado: evento.feriado, // Asumimos que los eventos de esta tabla no son feriados
  };
}
// Carga Eventos desde API y Actualiza la variable Global "listaEventosCalendarioAcademico"
export async function cargarEventosAcademicos(): Promise<EventoAgenda[]> {
    try {
        // 1. Llamar a la API para obtener los eventos
        const eventosAPI: EventoAPIFlask[] = await api.getEventos();
        // 2. Transformar los datos de la API al formato de la UI
        const eventosTransformados = eventosAPI.map(transformarEvento);
        //console.log(eventosTransformados);
        // 3. Actualizar la variable global (IMPORTANTE: Esto debe hacerse para que listaCompleta funcione)
        listaEventosCalendarioAcademico = eventosTransformados;
        return eventosTransformados;
    } catch (error) {
        console.error("Error al cargar eventos académicos desde la API:", error);
        // Podrías devolver una lista vacía o una lista de fallback si falla la API
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
  const nuevoEvento:EventoAgenda =
  {
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

function fechaYaSucedio(fecha: Date): boolean {
  return Date.now() > fecha.getTime();
}

function ordenarPorFechaFin(a: EventoAgenda, b: EventoAgenda): number {
  return a.fechaFin.getTime() - b.fechaFin.getTime();
}

function ordenarEventosPorFecha(listaEventos: EventoAgenda[], ascendiente: boolean = true) {
  const copia = [...listaEventos]; // Evitamos mutar arrays globales directamente
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
// Aux fechas
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
  else return "";
}

// export listas
// export function listaFuturoFiltros(mostrarFeriados:Boolean): EventoAgenda[] {
//   return ordenarEventosPorFechaFin(listaEventosAgenda.filter((evento) => eventoFinalizado(evento)==false)); }
export function listaCompleta(): EventoAgenda[] { 
  const baseLocal = combinarYOrdenarListas(listaEventosCalendarioAcademico, listaEventosPersonalizados); 
  return combinarYOrdenarListas(baseLocal, listaExamenesSIU);
}
export function listaFuturo(): EventoAgenda[] {return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }
export function listaFuturoVIEJO(): EventoAgenda[] {return ordenarEventosPorFecha(listaCompleta().filter((evento) => !eventoFinalizado(evento))); }

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
  return evento.esFeriado? "#6CACE4": "#000";
  //return evento.esFeriado? "#6CACE4": (enModoOscuro() ? "#fff":"#000");
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