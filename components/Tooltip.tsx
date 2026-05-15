// ==============================
// File: components/Tooltip.tsx
// ==============================
import React, { memo } from 'react';
import { Animated, StyleSheet, ViewStyle, View } from 'react-native';
import CustomText from './CustomText';
import { tooltipStyles, tooltipTokens } from '../theme/mapStyles';

type Variant = 'default' | 'success' | 'warning' | 'error';

interface Props {
  text: string;
  opacity: Animated.Value;
  /** Posición vertical rápida. Por defecto: 'top' */
  vertical?: 'top' | 'bottom';
  /** Separación del borde (px). Por defecto: 16 */
  inset?: number;
  /** Mostrar caret (triangulito) apuntando hacia el borde. Por defecto: true */
  caret?: boolean;
  /** Variante visual. Por defecto: 'default' */
  variant?: Variant;
  /** Permite sobreescribir estilos del contenedor */
  containerStyle?: ViewStyle;
  testID?: string;
}

function Tooltip({
  text,
  opacity,
  vertical = 'top',
  inset = 16,
  caret = true,
  variant = 'default',
  containerStyle,
  testID,
}: Props) {
  const bg = tooltipTokens.variants[variant] ?? tooltipTokens.variants.default;

  const posStyle =
    vertical === 'top'
      ? { top: inset }
      : { bottom: inset };


  return (
    <Animated.View
      testID={testID}
      pointerEvents="none"
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      style={[
        tooltipStyles.containerBase,
        posStyle,
        { opacity, backgroundColor: bg },
        containerStyle,
      ]}
    >
    <CustomText style={tooltipStyles.text}>{text}</CustomText>
    </Animated.View>
  );
}

export default memo(Tooltip);

