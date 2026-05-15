// ==============================
// File: hooks/usePlanAreaEffects.ts
// ==============================
import { useEffect, useRef } from 'react';
import type { ZoomParams } from './usePlanZoom';

type Args = {
  mapId: string;
  box: { w: number; h: number };
  selectedZoneId: string | null;
  initialFit?: boolean; // default true en el caller
  focusZone: (zoneId: string) => void;
  fitAll: () => void;
  // (Opcional) si querés saber el último target aplicado desde afuera
  currentTarget?: ZoomParams | null;
};

/**
 * Efectos idempotentes de alto nivel:
 * - Fit inicial: cuando hay un plano nuevo (mapId) o cambia el tamaño (box),
 *   y NO hay aula seleccionada, ejecuta fitAll una sola vez por cambio.
 * - Focus: cuando cambia selectedZoneId (no null), hace focusZone una sola vez.
 * 
 * Evita rebotes usando pequeñas firmas en refs.
 */
export function usePlanAreaEffects({
  mapId,
  box,
  selectedZoneId,
  initialFit = true,
  focusZone,
  fitAll,
  currentTarget,
}: Args) {
  // Firmas para evitar repetir efectos
  const lastFitSigRef = useRef<string | null>(null);
  const lastFocusSigRef = useRef<string | null>(null);

  // FIT INICIAL (mapId/box cambian) sin aula seleccionada
  useEffect(() => {
    if (!initialFit) return;
    if (!box.w || !box.h) return;
    if (selectedZoneId) return;

    const sig = `${mapId}|${box.w}x${box.h}`;
    if (sig === lastFitSigRef.current) return;

    lastFitSigRef.current = sig;
    fitAll();
  }, [initialFit, mapId, box.w, box.h, selectedZoneId, fitAll]);

  // FOCUS al cambiar de aula
  useEffect(() => {
    if (!selectedZoneId) return;

    if (selectedZoneId === lastFocusSigRef.current) return;
    lastFocusSigRef.current = selectedZoneId;

    focusZone(selectedZoneId);
  }, [selectedZoneId, focusZone]);

  // Si desde fuera se fuerza un nuevo target (con nueva key),
  // podrías resetear las firmas si lo necesitás. Normalmente no hace falta.
  useEffect(() => {
    // Ejemplo: si querés que un nuevo target "rompa" el recuerdo del fit previo:
    // if (currentTarget?.key) lastFitSigRef.current = null;
  }, [currentTarget?.key]);
}
