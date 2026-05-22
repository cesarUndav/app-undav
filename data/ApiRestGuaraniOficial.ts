// data/ApiRestGuaraniOficial.ts
import { DigestClient } from "./DigestClient";

const URL_BASE_GUARANI = process.env.EXPO_PUBLIC_GUARANI_URL_BASE;

// Credenciales hardcodeadas válidas
const GUARANI_API_USER = process.env.EXPO_PUBLIC_GUARANI_USER || 'usuario';
const GUARANI_API_PASS = process.env.EXPO_PUBLIC_GUARANI_PASS || 'contrasena';

// Instanciamos el cliente separado que acabamos de crear
const client = new DigestClient(GUARANI_API_USER, GUARANI_API_PASS);

/**
 * Petición directa al SIU Guaraní Oficial usando Autenticación Digest
 */
export async function ObtenerAnaliticoDirecto(idPersona: string): Promise<any> {
  try {
    const urlCompleta = `${URL_BASE_GUARANI}/personas/${idPersona}/datosanalitico`;
    
    console.log(`📡 [EXPO DIGEST] Conectando de forma segura a: ${urlCompleta}`);
    
    const response = await client.fetchWithDigest(urlCompleta, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Error en la consulta analítica:", error.message);
    throw new Error("No se pudo obtener la historia académica desde el Guaraní central");
  }
}

/**
 * Convierte cualquier formato de fecha al formato estricto YYYY-MM-DD que exige el SIU
 */
function formatearFechaISO(fecha: string | Date): string {
  if (fecha instanceof Date) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
  
  // Si ya es un string con guiones y tiene la longitud correcta (YYYY-MM-DD), lo dejamos pasar
  if (fecha.includes('-') && fecha.split('-')[0].length === 4) {
    return fecha;
  }

  // Si por las dudas venía en formato DD/MM/YYYY, lo damos vuelta
  if (fecha.includes('/')) {
    const [dia, mes, anio] = fecha.split('/');
    return `${anio}-${mes}-${dia}`;
  }

  return fecha;
}

export interface FiltrosAgenda {
  fecha?: string | Date;
  soloPresencial?: boolean; // Mapea a 'modalidad' del Swagger
}

/**
 * Devuelve la agenda de una persona desde el SIU Guaraní.
 * @param idPersona ID del estudiante (Path parameter)
 * @param filtros Filtros opcionales de fecha y modalidad (Query parameters)
 */
export async function ObtenerAgenda(idPersona: string, filtros?: FiltrosAgenda): Promise<any> {
  try {
    let urlCompleta = `${URL_BASE_GUARANI}/personas/${idPersona}/agenda`;
    const queryParams: string[] = [];

    if (filtros) {
      if (filtros.fecha) {
        const fechaFormateada = formatearFechaISO(filtros.fecha);
        queryParams.push(`fecha=${fechaFormateada}`);
      }
      if (filtros.soloPresencial !== undefined) {
        queryParams.push(`modalidad=${filtros.soloPresencial ? 'true' : 'false'}`);
      }
    }

    if (queryParams.length > 0) {
      urlCompleta += `?${queryParams.join('&')}`;
    }
    
    console.log(`📡 [EXPO DIGEST] Conectando a agenda: ${urlCompleta}`);
    
    const response = await client.fetchWithDigest(urlCompleta, { method: 'GET' });

    // 💡 CONTROL DE 404 SIU GUARANÍ: 
    // Si da 404, significa que el alumno simplemente NO TIENE ACTIVIDADES ese día.
    if (response.status === 404) {
      console.log(`ℹ️ [SIU] 404 recibido: El alumno no registra actividades para esta fecha.`);
      return []; // Devolvemos un array vacío seguro para que no rompa el mapeo
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Error en ObtenerAgenda:", error.message);
    throw new Error("No se pudo obtener la agenda del día desde el servidor central");
  }
}