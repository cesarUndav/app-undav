import type React from "react";
import type { LayoutRectangle } from "react-native";

export type Placement = "top" | "bottom" | "left" | "right" | "auto";

export type CoachmarkShape =
  | { type: "circle" }
  | { type: "roundRect"; borderRadius?: number };

export type FinishReason = "completed" | "skipped";

export interface CoachmarkStep {
  id: string;
  targetRef: React.RefObject<any>;
  text: string;

  shape: CoachmarkShape;
  padding?: number; // px extra alrededor del target
  placement?: Placement;

  /** Si está definido, fuerza el comportamiento para este paso. Si no, usa el default del start(). */
  allowOverlayTap?: boolean;

  /** Si devuelve true, el paso se salta (útil si sabes que algo está deshabilitado). */
  shouldSkip?: () => boolean;

  /** Ancho máximo del tooltip. Default 320 (clamp al ancho de pantalla). */
  tooltipMaxWidth?: number;
}

export interface StartOptions {
  /** Permite avanzar tocando el overlay (si el paso no lo sobreescribe). Default: false */
  allowOverlayTap?: boolean;

  /** Se ejecuta SOLO en Hecho (completed) u Omitir (skipped). */
  onFinish?: (reason: FinishReason) => void | Promise<void>;
}

export type WindowRect = LayoutRectangle;

export interface TutorialController {
  start: (steps: CoachmarkStep[], options?: StartOptions) => void;
  stop: () => void; // cancelar a mitad (NO marca seen)
  next: () => void;
  prev: () => void;
  skip: () => void; // marca finish=skipped
  isActive: () => boolean;
}
