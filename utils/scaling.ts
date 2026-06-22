import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Ancho de pantalla base (por ejemplo, un iPhone 11 / celular Android estándar tiene ~375px de ancho)
const baseWidth = 375;

export function scaleFont(size: number): number {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;
  
  // Redondea el número para que los píxeles nativos de Android/iOS lo rendericen de forma óptima
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}