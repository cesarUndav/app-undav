// notificaciones.ts

import { useState, useEffect } from "react";
import { ObtenerNoticiasAPI, NoticiaAPI, parsearFechaPHP } from "./apiAppUndav"; // 🌟 Importación unificada global

export type Notificacion = {
  id: string;
  titulo: string;
  fecha: Date;
  tipo?: string;
  contenido?: string;
};

// 🔔 ESTADO GLOBAL PURO DE MEMORIA
export let listaNoticiasAPI: Notificacion[] = [];
let cacheCount = 0;
const oyentes = new Set<() => void>();

function emitirCambios() {
  oyentes.forEach((fn) => fn());
}

// 🔔 HOOK CENTRAL: Cualquier componente que use esto se redibujará al instante
export function useNotificacionesGlobales() {
  const [noticias, setNoticias] = useState<Notificacion[]>(todasLasNotificaciones());
  const [count, setCount] = useState<number>(cacheCount);

  useEffect(() => {
    const actualizar = () => {
      setNoticias(todasLasNotificaciones());
      setCount(cacheCount);
    };
    oyentes.add(actualizar);
    return () => {
      oyentes.delete(actualizar);
    };
  }, []);

  return { noticias, count };
}

function transformarNoticia(noticia: NoticiaAPI): Notificacion {
  return {
    id: String(noticia.id),
    titulo: noticia.nombre,
    contenido: noticia.contenido,
    fecha: parsearFechaPHP(noticia.fecha_creado), // 🌟 Utiliza la función centralizada de apiAppUndav
  };
}

export async function cargarNoticias(): Promise<Notificacion[]> {
  try {
    // 1. Consumimos el nuevo endpoint directo y optimizado
    const noticiasAPI: NoticiaAPI[] = await ObtenerNoticiasAPI();

    // 2. Mapeamos de forma directa
    const noticiasTransformadas = noticiasAPI.map(transformarNoticia);
    
    // 3. Ordenamos cronológicamente (Más nueva a más vieja)
    listaNoticiasAPI = noticiasTransformadas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    
    // 🌟 Sincronizamos el contador global con el total de noticias nuevas de PHP
    cacheCount = noticiasTransformadas.length;

    console.log(`✅ ${noticiasTransformadas.length} noticias cargadas directamente desde /noticias`);
    
    emitirCambios(); 
    return noticiasTransformadas;
  } catch (error) {
    console.error("❌ Error al cargar noticias desde el nuevo endpoint:", error);
    return [];
  }
}

export const listaEventosAgenda: Notificacion[] = [
  { id: "A1", titulo: "Inscripción a materias abierta", fecha: new Date("2026-02-10"), contenido: "Se encuentra habilitado el sistema para la inscripción del primer cuatrimestre." },
  { id: "A2", titulo: "Publicación de notas del 1° parcial", fecha: new Date("2026-04-18"), contenido: "Ya podés consultar tus calificaciones en la cartelera digital." },
  { id: "A3", titulo: "Recordatorio: Entrega de TP1 mañana", fecha: new Date("2026-05-02"), contenido: "No olvides subir el archivo al campus antes de las 23:59 hs." },
  { id: "A4", titulo: "Clase cancelada: Sistemas Operativos", fecha: new Date("2026-04-12"), contenido: "Por motivos de fuerza mayor la clase de hoy se dictará de forma virtual." },
  { id: "A5", titulo: "Aula cambiada: Análisis Matemático I", fecha: new Date("2026-04-03"), contenido: "La cursada se traslada intermitentemente al Aula 102 de la Sede Piñeyro." },
  { id: "S1", titulo: "Actualización del sistema SIU Guaraní", fecha: new Date("2026-02-28"), contenido: "Mantenimiento programado de la plataforma de alumnos." },
  { id: "S2", titulo: "Corte de luz programado en sede central", fecha: new Date("2026-03-25"), contenido: "Afectará a las actividades administrativas durante el turno mañana." },
  { id: "S3", titulo: "Nueva versión disponible de la app", fecha: new Date("2026-04-09"), contenido: "Descargá la última actualización desde la tienda oficial para ver mejoras." },
  { id: "S4", titulo: "Reestablecido el acceso al campus virtual", fecha: new Date("2026-05-06"), contenido: "Los servidores ya operan con total normalidad." },
  { id: "E1", titulo: "Seminario: Inteligencia Artificial y Sociedad", fecha: new Date("2026-05-15"), contenido: "Disertación a cargo de especialistas invitados en el auditorio." },
  { id: "E2", titulo: "Charla informativa: Becas Progresar", fecha: new Date("2026-03-12"), contenido: "Requisitos y pasos necesarios para renovar el beneficio este año." },
  { id: "E3", titulo: "Convocatoria abierta: Intercambio a México", fecha: new Date("2026-04-01"), contenido: "Destinado a estudiantes con más del 50% de las materias aprobadas." },
  { id: "E4", titulo: "Taller de Primeros Auxilios", fecha: new Date("2026-05-03"), contenido: "Capacitación práctica con entrega de certificados oficiales." },
  { id: "E5", titulo: "Competencia de programación interna", fecha: new Date("2026-05-10"), contenido: "Inscribite con tu equipo y participá por importantes premios." },
];

export function todasLasNotificaciones(): Notificacion[] {
  const combinadas = [...listaNoticiasAPI, ...listaEventosAgenda];
  return combinadas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

function ordenarEventosPorFechaFin(listaEventos: Notificacion[], ascendiente: boolean = true) {
  if (ascendiente) return listaEventos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  return listaEventos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

function eventoFinalizado(evento: Notificacion): boolean {
  return (evento.fecha.getTime() - new Date().getTime()) / 86400000 < -1;
}

export function DateToFechaString(fecha: Date, separador: string = "/"): string {
  return `${fecha.getDate()}${separador}${fecha.getMonth() + 1}${separador}${fecha.getFullYear()}`;
}

export function historialNotificaciones(): Notificacion[] {
  return ordenarEventosPorFechaFin(todasLasNotificaciones().filter((evento) => eventoFinalizado(evento)), false);
}

export function notificacionesFuturas(): Notificacion[] {
  return ordenarEventosPorFechaFin(todasLasNotificaciones().filter((evento) => !eventoFinalizado(evento)), true);
}

export function getNotificationCount() {
  return cacheCount;
}

export function setNotificationCount(amount: number) {
  cacheCount = amount;
  emitirCambios(); 
}

export function notificacionSubtitulo(notif: Notificacion): string {
  let diasStr = "";
  const diffMs = notif.fecha.getTime() - new Date().getTime();
  const dias = Math.floor(diffMs / 86400000) + 1;
  
  if (dias > 0) diasStr = `falta${dias > 1 ? 'n':''} ${dias} día${dias > 1 ? 's':''}`;
  else if (dias === 0) diasStr = "hoy";
  else diasStr = `hace ${-dias} día${-dias > 1 ? 's':''}`;

  return `${notif.contenido}\n${DateToFechaString(notif.fecha)} (${diasStr})`;
}