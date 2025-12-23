// ==============================
// File: components/PlanArea.tsx
// ==============================
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, AccessibilityInfo, TouchableOpacity } from 'react-native';

import MapViewer from './MapViewer';
import FloorBadgeControls from './FloorBadgeControls';
import Tooltip from './Tooltip';
import FitAllButton from './FitAllButton';
import GuidePointButton from './GuidePointButton';
import CustomText from './CustomText';
import { floorLabel } from '../lib/floors';
import { PlanData } from '../app/mapsConfig';
import { usePlanZoom } from '../hooks/usePlanZoom';
import { usePlanAreaEffects } from '../hooks/usePlanAreaEffects';
import { useTooltip } from '../hooks/useTooltip';
import { usePlanAreaAnimation } from '../hooks/usePlanAreaAnimation';
import type { ZoomParams } from '../hooks/usePlanZoom';
import { mapButtonStyles } from '../theme/mapStyles';

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
  /** Padding relativo (0..1) para foco (aula / punto guía). */
  focusPadding?: number; // default: 0.18
  /** Modo de encuadre "Ver todo" */
  fitMode?: 'canvas' | 'content'; // default: 'canvas'
  /** Ventana (radio en unidades canvas) para el Punto Guía */
  guideRadius?: number; // default: 90
  /** Ancla inferior personalizada para chevrons del selector de piso (viewBox 100x100). */
  floorBadgeBottomY?: number;

  /** NUEVO: overlay de conexiones entre edificios (SVG transparente del piso actual) */
  showConnections?: boolean;
  onToggleConnections?: () => void;
  connectionOverlay?: React.ComponentType<any> | null;
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
    focusPadding = 0.18,
    fitMode = 'canvas',
    guideRadius = 90,
    floorBadgeBottomY,

    // conexiones
    showConnections = false,
    onToggleConnections,
    connectionOverlay,
  },
  ref
) {
  // Tooltip
  const { tooltip, fade, showTip } = useTooltip();
  const zoneLabel = (id: string) => planData.zones.find(z => z.id === id)?.name ?? id;

  // Lógica base pan/zoom + layout (objetivos programados: fit/focus/guía)
  const {
    box,
    onLayoutBox,
    zoomParams,
    setZoomParams,
    fitAll,
    focusZone,
    focusGuidePoint,
  } = usePlanZoom({
    planData,
    floors,
    floorIndex,
    mapId,
    fitPadding,
    focusPadding,
    fitMode,
    guideRadius,
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

  // Animación de pan/zoom
  const { view: animatedView, setTarget } =
    usePlanAreaAnimation?.(zoomParams) ?? { view: null, setTarget: () => {} };

  // Estado "en vivo" para gestos
  const [live, setLive] = useState<ZoomParams>(null);

  useEffect(() => {
    setLive(null);
    setTarget?.(zoomParams);
  }, [zoomParams?.key, setTarget]);

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
      AccessibilityInfo.announceForAccessibility?.(
        `${floorLabel(floorIndex)} de ${floors.length}`
      );
    }
  }, [floorIndex, floors]);

  // Layout handler
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    onLayoutBox(width, height);
  };

  // Prioridad: live → animado → objetivo directo
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
              setLive(prev =>
                prev
                  ? { ...prev, ...t }
                  : (animatedView ?? zoomParams)
                  ? { ...(animatedView ?? zoomParams)!, ...t }
                  : { key: 'live', ...t }
              );
            }}

            // 👇 NUEVO: pasar overlay y flag a MapViewer (deberás tener esas props allí)
            connectionOverlay={connectionOverlay}
            showConnections={showConnections}
          />

          <FloorBadgeControls
            floorIndex={floorIndex}
            maxFloors={floors.length}
            onPrev={() => {
              if (floorIndex > 0) {
                const next = floorIndex - 1;
                onChangeFloor(next);
                setZoomParams(null);
                showTip(floorLabel(next));
              }
            }}
            onNext={() => {
              if (floorIndex < floors.length - 1) {
                const next = floorIndex + 1;
                onChangeFloor(next);
                setZoomParams(null);
                showTip(floorLabel(next));
              }
            }}
            // override opcional del ancla inferior de chevrons
            bottomY={floorBadgeBottomY}
          />

          {/* Botón “Punto guía” alineado a la izquierda */}
          <GuidePointButton
            onPress={() => {
              focusGuidePoint();
              showTip('Punto guía');
            }}
          />

          {/* Botón “Ver todo” centrado */}
          <FitAllButton
            onPress={() => {
              fitAll();
              showTip('Vista general');
            }}
          />

          {/* Botón “Mostrar/Ocultar conexiones” (solo si hay overlay y handler) */}
          {connectionOverlay && onToggleConnections && (
            <TouchableOpacity
              onPress={onToggleConnections}
              activeOpacity={0.85}
              style={[mapButtonStyles.base, styles.connBtn]}
              accessibilityRole="button"
              accessibilityLabel={showConnections ? 'Ocultar conexiones' : 'Mostrar conexiones'}
            >
              <CustomText style={mapButtonStyles.text}>
                {showConnections ? 'Ocultar conexiones' : 'Mostrar conexiones'}
              </CustomText>
            </TouchableOpacity>
          )}

          {tooltip && <Tooltip text={tooltip} opacity={fade} />}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Botón de conexiones: ARRIBA y CENTRADO horizontalmente
  connBtn: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center', // centra el Touchable horizontalmente
    zIndex: 6,           // por encima del mapa/gestos
    paddingHorizontal: 14,
  },
});


export default React.memo(PlanArea);
