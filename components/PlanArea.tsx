// ==============================
// File: components/PlanArea.tsx
// ==============================
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, AccessibilityInfo } from 'react-native';

import MapViewer from './MapViewer';
import FloorBadgeControls from './FloorBadgeControls';
import Tooltip from './Tooltip';
import FitAllButton from './FitAllButton';
import { PlanData } from '../app/mapsConfig';
import { usePlanZoom } from '../hooks/usePlanZoom';
import { usePlanAreaEffects } from '../hooks/usePlanAreaEffects';
import { useTooltip } from '../hooks/useTooltip';
import { usePlanAreaAnimation } from '../hooks/usePlanAreaAnimation';
import type { ZoomParams } from '../hooks/usePlanZoom';

export type PlanAreaHandle = {
  zoomToZone: (zoneId: string) => void;
};

type Props = {
  planData: PlanData;
  floors: { key: string; SvgComponent: React.ComponentType<any> }[];
  floorIndex: number;
  onChangeFloor: (i: number) => void;
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  /** Identificador único del plano actual (edificio + piso) para reiniciar pan/zoom cuando cambie */
  mapId: string;
  /** Si true, encuadra todo el plano al montar o al cambiar de piso cuando no hay aula seleccionada. */
  initialFit?: boolean; // default: true
  /** Padding relativo (0..1) para el encuadre inicial. Ej: 0.1 => 10% a cada lado. */
  fitPadding?: number; // default: 0.1
  focusPadding: 0.18,
  fitMode: 'canvas'| 'content';
};

const PlanArea = React.forwardRef<PlanAreaHandle, Props>(function PlanArea(
  {
    planData,
    floors,
    floorIndex,
    onChangeFloor,
    selectedZoneId,
    onSelectZone,
    mapId,
    initialFit = true,
    fitPadding = 0.1,
  },
  ref
) {
  // Tooltip
  const { tooltip, fade, showTip } = useTooltip();
  const zoneLabel = (id: string) => planData.zones.find(z => z.id === id)?.name ?? id;

  // Lógica base pan/zoom + layout (objetivos programados: fit/focus)
  const { box, onLayoutBox, zoomParams, setZoomParams, fitAll, focusZone } = usePlanZoom({
    planData,
    floors,
    floorIndex,
    mapId,
    fitPadding,
    focusPadding: 0.36,
  });

  // Efectos idempotentes (focus por selección + fit inicial)
  usePlanAreaEffects({
    mapId,
    box,
    selectedZoneId,
    initialFit,
    focusZone,
    fitAll,
  });

  // Animación de pan/zoom entre objetivos
  const { view: animatedView, setTarget } =
    usePlanAreaAnimation?.(zoomParams) ?? { view: null, setTarget: () => {} };

  // === Estado "en vivo" para gestos (NO pisa la animación) ===
  // Cuando el usuario hace pinch/pan, actualizamos 'live'.
  // Cuando cambia el objetivo programado (zoomParams.key), limpiamos 'live'
  // para que la animación se vea tal cual.
  const [live, setLive] = useState<ZoomParams>(null);

  useEffect(() => {
    // Nuevo objetivo programado (fit/focus): limpiar interacción del usuario
    // y disparar/actualizar la animación hacia ese objetivo.
    setLive(null);
    setTarget?.(zoomParams);
  }, [zoomParams?.key, setTarget]); // importante: depender de la key

  // Exponer API imperativa
  useImperativeHandle(
    ref,
    () => ({
      zoomToZone: (zoneId: string) => focusZone(zoneId),
    }),
    [focusZone]
  );

  // Accesibilidad: anunciar piso
  useEffect(() => {
    if (floors[floorIndex]) {
      AccessibilityInfo.announceForAccessibility?.(`Piso ${floorIndex + 1} de ${floors.length}`);
    }
  }, [floorIndex, floors]);

  // Layout handler
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    onLayoutBox(width, height);
  };

  // Orden de prioridad:
  // 1) 'live' mientras el usuario está interactuando,
  // 2) valores animados hacia el objetivo,
  // 3) objetivo directo si no hay animación disponible.
  const displayZoomParams = live ?? animatedView ?? zoomParams;

  return (
    <View style={styles.box} onLayout={onLayout}>
      {box.w > 0 && box.h > 0 && (
        <>
          <MapViewer
            SvgComponent={floors[floorIndex].SvgComponent}
            planData={planData}
            containerW={box.w}
            containerH={box.h}
            selectedZoneId={selectedZoneId}
            onZonePress={(id) => {
              onSelectZone(id);
              showTip(`${zoneLabel(id)}`);
            }}
            zoomParams={displayZoomParams}
            onTransformChange={(t) => {
              // Mantener la key estable para evitar remounts del viewer.
              setLive(prev =>
                prev
                  ? { ...prev, ...t }
                  : (animatedView ?? zoomParams)
                  ? { ...(animatedView ?? zoomParams)!, ...t }
                  : { key: 'live', ...t }
              );
            }}
          />

          <FloorBadgeControls
            floorIndex={floorIndex}
            maxFloors={floors.length}
            onPrev={() => {
              if (floorIndex > 0) {
                const next = floorIndex - 1;
                onChangeFloor(next);
                setZoomParams(null);
                showTip(`Piso ${next + 1} de ${floors.length}`);
              }
            }}
            onNext={() => {
              if (floorIndex < floors.length - 1) {
                const next = floorIndex + 1;
                onChangeFloor(next);
                setZoomParams(null);
                showTip(`Piso ${next + 1} de ${floors.length}`);
              }
            }}
          />

          {tooltip && <Tooltip text={tooltip} opacity={fade} />}

          {/* Botón flotante: Ver todo (centrado abajo) */}
          <FitAllButton
            onPress={() => {
              fitAll();
              showTip('Vista general');
            }}
          />
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  box: { flex: 1, marginTop: 12, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
});

export default React.memo(PlanArea);
