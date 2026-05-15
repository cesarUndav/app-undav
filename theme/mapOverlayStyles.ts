// theme/mapOverlayStyles.ts

/** Estilo por zona según selección/ID */
export function zoneStyleById(id: string, selected: boolean) {
  if (selected) {
    return {
      fill: 'rgba(255, 12, 150, 0.49)',
    } as const;
  }

  const lower = id.toLowerCase();

  if (lower.startsWith('aula')) {
    return {
      fill: 'rgba(0,120,255,0.08)',
      stroke: '#2b7cff',
      strokeWidth: 2,
    } as const;
  }

  return {
    fill: 'rgba(0,0,0,0.001)',
    stroke: 'rgba(0,0,0,0)',
    strokeWidth: 1,
  } as const;
}

/* Estilo del “camino” / polígono de ruta */
export const route_style = {
  fill: '#1d72b8ff',
  stroke: '#ffffff',
  strokeWidth: 0,
} as const;

export const guidePointStyle = {
  fill: '#ff0000ff',
  stroke: '#ff0000ff',
  strokeWidth: 2,
} as const;