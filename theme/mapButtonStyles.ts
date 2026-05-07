// theme/mapButtonStyles.ts

import { StyleSheet } from 'react-native';
import { colors, mapTokens } from './mapTokens';

export const mapButtonStyles = StyleSheet.create({
  base: {
    height: mapTokens.buttonHeight,
    borderRadius: mapTokens.buttonRadius,
    backgroundColor: mapTokens.buttonBg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: mapTokens.shadow.color,
    shadowOffset: mapTokens.shadow.offset,
    shadowOpacity: mapTokens.shadow.opacity,
    shadowRadius: mapTokens.shadow.radius,
    elevation: mapTokens.shadow.elevation,
    paddingHorizontal: 14,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
  },
  disabled: {
    backgroundColor: colors.btnBgDisabled,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});