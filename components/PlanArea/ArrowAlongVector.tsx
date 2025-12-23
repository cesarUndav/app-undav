// components/PlanArea/ArrowAlongVector.tsx
import React, { memo } from 'react';
import { G, Polygon } from 'react-native-svg';
// IMPORTA tu SVG con la ruta CORRECTA desde este archivo:
import ArrowIcon from '../../assets/icons/arrow.svg';

export type Pt = [number, number];

type Props = {
  p0: Pt;                     // origen
  p1: Pt;                     // destino
  /** Altura “visual” de la flecha en px canvas (grosor). */
  baseHeight?: number;        // default 32
  len?: number;
  /** Color de la flecha (forzado sobre el SVG). */
  color?: string;             // default '#ff0055'
  /** Si true, usa un triángulo simple como fallback */
  debugFallbackTriangle?: boolean;
};

function ArrowAlongVector({
  p0, p1,
  baseHeight = 32,
  color = '#ff0055',
  debugFallbackTriangle = false,
}: Props) {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const len = Math.hypot(dx, dy);

  // Nada que dibujar si el vector es muy corto
  if (!(len > 0.5)) return null;

  // Ángulo (en grados) respecto del eje X positivo
  const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

  // NOTA IMPORTANTE:
  // En lugar de depender del viewBox del SVG, estiramos el ícono “a lo bruto”
  // usando width=len y height=baseHeight, con preserveAspectRatio="none".
  // Así evitamos problemas de viewBox desconocido.
  return (
    <G transform={`translate(${p0[0]}, ${p0[1]}) rotate(${angleDeg})`}>
      {debugFallbackTriangle ? (
        // Triángulo simple para verificar que la transformación y z-index son correctos
        <Polygon
          points={`0,0 ${len},${baseHeight / 2} 0,${baseHeight}`}
          fill={color}
          opacity={0.8}
        />
      ) : (
        <ArrowIcon
          // Estira el ícono EXACTAMENTE al largo del vector
          width={len}
          height={baseHeight}
          preserveAspectRatio="none"
          // Forzamos color por si el SVG original no trae fill/stroke visibles
          color={color}
          fill={color}
          stroke={color}
          strokeWidth={1}
          // Sutil transparencia opcional
          opacity={0.9}
        />
      )}
    </G>
  );
}

export default memo(ArrowAlongVector);
