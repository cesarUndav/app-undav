// theme/tooltipStyles.ts

import { StyleSheet } from 'react-native';
import { colors, shadows } from './mapTokens';

export const tooltipTokens = {
  radius: 8,
  padV: 8,
  padH: 12,
  maxWidth: 520,
  variants: {
    default: 'rgba(0,0,0,0.75)',
    success: '#16a34a',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

export const tooltipStyles = StyleSheet.create({
  containerBase: {
    marginTop: 36,
    position: 'absolute',
    left: 16,
    right: 16,
    alignSelf: 'center',
    maxWidth: tooltipTokens.maxWidth,
    borderRadius: tooltipTokens.radius,
    paddingVertical: tooltipTokens.padV,
    paddingHorizontal: tooltipTokens.padH,
    ...shadows.small,
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});