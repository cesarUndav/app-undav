// lib/floors.ts
export function floorLabel(index: number): string {
  return index === 0 ? 'Planta baja' : `Piso ${index}`;
}