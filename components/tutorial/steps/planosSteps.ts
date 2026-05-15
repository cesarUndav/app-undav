import type React from "react";
import type { CoachmarkStep } from "../../../types/tutorial";

export type PlanosTutorialRefs = {
  buildingSelectorRef: React.RefObject<any>;
  showAulasButtonRef: React.RefObject<any>;
  searchButtonRef: React.RefObject<any>;
  mapViewportRef: React.RefObject<any>;
  guidePointButtonRef: React.RefObject<any>;
  fitAllButtonRef: React.RefObject<any>;
  floorControlsRef: React.RefObject<any>;
};

export function createPlanosSteps(refs: PlanosTutorialRefs): CoachmarkStep[] {
  return [
    {
      id: "planos.buildingSelector",
      targetRef: refs.buildingSelectorRef,
      text: "Selector de edificio: cambia la sede/edificio para ver sus planos disponibles.",
      shape: { type: "roundRect", borderRadius: 12 },
      padding: 10,
      placement: "bottom",
    },
    {
      id: "planos.showAulas",
      targetRef: refs.showAulasButtonRef,
      text: "Mostrar Aulas: abre la lista de aulas del piso actual (si aplica).",
      shape: { type: "roundRect", borderRadius: 12 },
      padding: 10,
      placement: "bottom",
    },
    {
      id: "planos.search",
      targetRef: refs.searchButtonRef,
      text: "Búsqueda: abre el buscador global para encontrar aulas, dependencias o accesos.",
      shape: { type: "roundRect", borderRadius: 12 },
      padding: 10,
      placement: "bottom",
    },
    {
      id: "planos.mapGestures",
      targetRef: refs.mapViewportRef,
      text:
        "Interacción con el plano:\n• Toca un aula para seleccionarla.\n• Desplaza para moverte.\n• Pellizca para acercar/alejar.",
      shape: { type: "roundRect", borderRadius: 16 },
      padding: 12,
      placement: "auto",
      // Suele ser útil permitir tap en overlay aquí (opcional).
      // allowOverlayTap: true,
    },
    {
      id: "planos.guidePoint",
      targetRef: refs.guidePointButtonRef,
      text: "Punto guía: marca o utiliza el punto de referencia para orientarte en el plano.",
      shape: { type: "circle" },
      padding: 14,
      placement: "left",
    },
    {
      id: "planos.fitAll",
      targetRef: refs.fitAllButtonRef,
      text: "Ver todo: ajusta el zoom/encuadre para ver el plano completo.",
      shape: { type: "circle" },
      padding: 14,
      placement: "left",
    },
    {
      id: "planos.floorControls",
      targetRef: refs.floorControlsRef,
      text:
        "Controles de piso:\n• Sube o baja de piso.\n• El indicador muestra el piso activo.",
      shape: { type: "roundRect", borderRadius: 14 },
      padding: 12,
      placement: "left",
    },
  ];
}
