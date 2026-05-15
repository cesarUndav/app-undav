// components/plan-area/panZoomTypes.ts

export type Transform = {
  zoom: number;
  x: number;
  y: number;
};

export type CanvasPoint = {
  cx: number;
  cy: number;
};

export type PanZoomBaseProps = {
  width: number;
  height: number;

  containerW: number;
  containerH: number;

  zoom: number;
  x: number;
  y: number;

  minScale?: number;
  maxScale?: number;

  onTapCanvas?: (pt: CanvasPoint) => void;

  children: React.ReactNode;
};