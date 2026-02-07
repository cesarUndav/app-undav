// components/tutorial/overlay/geometry.ts
import type { EdgeInsets } from 'react-native-safe-area-context';
import type { CoachmarkStep, WindowRect } from '../../../types/tutorial';

export type ResolvedPlacement = 'top' | 'bottom' | 'left' | 'right';

export type TooltipSize = { width: number; height: number };

export type TooltipPosition = {
  top: number;
  left: number;
  placement: ResolvedPlacement;
};

export type Spotlight =
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx: number; ry: number };

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function applyPadding(r: WindowRect, padding: number, w: number, h: number) {
  const x = clamp(r.x - padding, 0, w);
  const y = clamp(r.y - padding, 0, h);
  const width = clamp(r.width + padding * 2, 0, w - x);
  const height = clamp(r.height + padding * 2, 0, h - y);
  return { x, y, width, height };
}

function pickPlacement(
  preferred: CoachmarkStep['placement'] | undefined,
  spaces: { top: number; bottom: number; left: number; right: number },
  tooltip: TooltipSize
): ResolvedPlacement {
  const orderAuto: ResolvedPlacement[] = ['bottom', 'top', 'right', 'left'];

  const candidates: ResolvedPlacement[] =
    preferred && preferred !== 'auto' ? [preferred as ResolvedPlacement] : orderAuto;

  const fits = (p: ResolvedPlacement) => {
    if (p === 'top') return spaces.top >= tooltip.height;
    if (p === 'bottom') return spaces.bottom >= tooltip.height;
    if (p === 'left') return spaces.left >= tooltip.width;
    return spaces.right >= tooltip.width;
  };

  for (const p of candidates) {
    if (fits(p)) return p;
  }

  // fallback al que tenga más espacio
  const entries: Array<[ResolvedPlacement, number]> = [
    ['bottom', spaces.bottom],
    ['top', spaces.top],
    ['right', spaces.right],
    ['left', spaces.left],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function computePaddedRect(
  rect: WindowRect | null,
  step: CoachmarkStep | null,
  W: number,
  H: number
): WindowRect | null {
  if (!rect || !step) return null;
  const padding = step.padding ?? 10;
  return applyPadding(rect, padding, W, H);
}

export function computeTooltipMaxWidth(step: CoachmarkStep | null, W: number) {
  const desired = step?.tooltipMaxWidth ?? 320;
  const margin = 16;
  return clamp(desired, 200, Math.max(200, W - margin * 2));
}

export function computeTooltipPosition(args: {
  paddedRect: WindowRect | null;
  step: CoachmarkStep | null;
  tooltipSize: TooltipSize;
  W: number;
  H: number;
  insets: EdgeInsets;
}): TooltipPosition {
  const { paddedRect, step, tooltipSize, W, H, insets } = args;

  const margin = 16;
  const gap = 12;

  const usableTop = insets.top + margin;
  const usableBottom = H - insets.bottom - margin;

  // Fallback si todavía no hay medición
  if (!paddedRect || !step) {
    return { top: usableTop, left: margin, placement: 'bottom' };
  }

  const spaces = {
    top: paddedRect.y - usableTop - gap,
    bottom: usableBottom - (paddedRect.y + paddedRect.height) - gap,
    left: paddedRect.x - margin - gap,
    right: W - (paddedRect.x + paddedRect.width) - margin - gap,
  };

  const placement = pickPlacement(step.placement, spaces, tooltipSize);

  let top = usableTop;
  let left = margin;

  const cx = paddedRect.x + paddedRect.width / 2;
  const cy = paddedRect.y + paddedRect.height / 2;

  if (placement === 'top') {
    top = paddedRect.y - tooltipSize.height - gap;
    left = cx - tooltipSize.width / 2;
  } else if (placement === 'bottom') {
    top = paddedRect.y + paddedRect.height + gap;
    left = cx - tooltipSize.width / 2;
  } else if (placement === 'left') {
    top = cy - tooltipSize.height / 2;
    left = paddedRect.x - tooltipSize.width - gap;
  } else if (placement === 'right') {
    top = cy - tooltipSize.height / 2;
    left = paddedRect.x + paddedRect.width + gap;
  }

  // Clamp dentro del área usable
  left = clamp(left, margin, W - margin - tooltipSize.width);
  top = clamp(top, usableTop, usableBottom - tooltipSize.height);

  return { top, left, placement };
}

export function computeSpotlight(
  paddedRect: WindowRect | null,
  step: CoachmarkStep | null
): Spotlight | null {
  if (!paddedRect || !step) return null;

  if (step.shape.type === 'circle') {
    const cx = paddedRect.x + paddedRect.width / 2;
    const cy = paddedRect.y + paddedRect.height / 2;
    const r = Math.max(paddedRect.width, paddedRect.height) / 2;
    return { kind: 'circle', cx, cy, r };
  }

  const borderRadius = step.shape.borderRadius ?? 12;
  return {
    kind: 'rect',
    x: paddedRect.x,
    y: paddedRect.y,
    width: paddedRect.width,
    height: paddedRect.height,
    rx: borderRadius,
    ry: borderRadius,
  };
}
