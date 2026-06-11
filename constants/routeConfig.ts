// constants/routeConfig.ts
// Centraliza la configuración de rutas de la app: rutas privadas, rutas sin header y rutas sin barra inferior.

/**
 * Rutas que requieren sesión de estudiante.
 *
 * Importante:
 * No usamos una lógica de "todo lo que no sea público es privado",
 * porque la app tiene muchas pantallas públicas para visitantes.
 *
 * Una pantalla solo debe ir en esta lista si realmente necesita token.
 */
export const rutasPrivadas = [
  '/home-estudiante',
  '/historia-académica',
  '/calendario',
  '/notificaciones',
];

/**
 * Rutas donde no se debe mostrar el header de navegación histórica.
 */
export const rutasSinHeader = [
  '/',
  '/loginAutenticado',
  '/loginMail',
  '/home-estudiante',
  '/home-visitante',
];

/**
 * Rutas donde no se debe mostrar la barra inferior.
 */
export const rutasSinBottomBar = [
  '/',
  '/loginAutenticado',
  '/loginMail',
];

/**
 * Rutas asociadas al login.
 * Se usan para limpiar estados visuales cuando el usuario vuelve al flujo de inicio de sesión.
 */
export const rutasLogin = [
  '/',
  '/loginAutenticado',
  '/loginMail',
];

/**
 * Evalúa si una ruta coincide exactamente con una ruta base
 * o si pertenece a una subruta.
 *
 * Ejemplo:
 * ruta = "/notificaciones/detalle"
 * rutaBase = "/notificaciones"
 * resultado = true
 */
function coincideConRutaBase(pathName: string, rutaBase: string): boolean {
  return pathName === rutaBase || pathName.startsWith(`${rutaBase}/`);
}

/**
 * Devuelve true si la ruta actual requiere sesión de estudiante.
 */
export function esRutaPrivada(pathName: string): boolean {
  return rutasPrivadas.some((ruta) => coincideConRutaBase(pathName, ruta));
}

/**
 * Devuelve true si la ruta actual debe ocultar el header.
 */
export function esRutaSinHeader(pathName: string): boolean {
  return rutasSinHeader.some((ruta) => coincideConRutaBase(pathName, ruta));
}

/**
 * Devuelve true si la ruta actual debe ocultar la barra inferior.
 */
export function esRutaSinBottomBar(pathName: string): boolean {
  return rutasSinBottomBar.some((ruta) => coincideConRutaBase(pathName, ruta));
}

/**
 * Devuelve true si la ruta actual pertenece al flujo de login.
 */
export function esRutaLogin(pathName: string): boolean {
  return rutasLogin.some((ruta) => coincideConRutaBase(pathName, ruta));
}