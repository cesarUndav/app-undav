// ==============================
// File: styles/mapStyles.ts
// ==============================
import { StyleSheet } from 'react-native';

/** Estilo por zona según selección/ID */
export function zoneStyleById(id: string, selected: boolean) {
  if (selected) {
    return { fill: 'rgba(255, 12, 150, 0.49)' } as const;
  }
  const lower = id.toLowerCase();
  if (lower.startsWith('aula')) {
    return { fill: 'rgba(0,120,255,0.08)', stroke: '#2b7cff', strokeWidth: 1 } as const;
  }
  return { fill: 'rgba(0,0,0,0.001)', stroke: 'rgba(0,0,0,0)', strokeWidth: 1 } as const;
}

/* === Tokens base === */
export const colors = {
  active: '#1e1ee5',
  arrowActive: '#FFFFFF',
  inactive: '#9E9E9E',
  disabled: '#CCCCCC',

  white: '#fff',
  primary: '#1a2b50',
  primaryPressed: '#192447',

  btnBg: '#FFFFFF',
  btnBorder: '#DADADA',
  btnBgDisabled: '#F2F2F2',
  btnBorderDisabled: '#E6E6E6',

  badgeBg: 'rgba(161,161,161,0.7)',
  border: '#DADADA',
  borderMuted: '#E6E6E6',
  bg: '#FFFFFF',
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const mapTokens = {
  buttonHeight: 36,
  buttonRadius: 18,
  buttonBg: colors.primary,
  shadow: {
    color: '#000',
    offset: { width: 0, height: 2 },
    opacity: 0.2,
    radius: 3,
    elevation: 3,
  },
  zFloating: 3,
};

/* === Botones flotantes (FitAll / Punto Guía) === */
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

/* === Tooltip === */
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

/* === Dropdown / Selectors === */
export const dropdownTokens = {
  height: 44,
  borderRadius: 8,
  menuOffset: 4,
  menuMaxHeight: 240,
  textColor: '#333',
};

export const selectorStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: dropdownTokens.height,
    zIndex: 30,
  },
  button: {
    height: dropdownTokens.height,
    borderWidth: 1,
    borderColor: colors.btnBorder,
    borderRadius: dropdownTokens.borderRadius,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.btnBg,
  },
  buttonText: {
    fontSize: 16,
    color: dropdownTokens.textColor,
  },
  menu: {
    position: 'absolute',
    top: dropdownTokens.height + dropdownTokens.menuOffset,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.btnBorder,
    borderRadius: dropdownTokens.borderRadius,
    maxHeight: dropdownTokens.menuMaxHeight,
    zIndex: 30,
    ...shadows.small,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  itemText: {
    fontSize: 16,
    color: dropdownTokens.textColor,
  },
});

/* === Estilo del “camino” (polígono de ruta) === */
export const route_style = {
  fill: '#192447b5',
  stroke: '#ffffff',
  strokeWidth: 0,
} as const;

/* === Controles de pisos === */
export const floorBadgeStyles = {
  circleBtnBase: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  circleBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  circleBtnDisabled: {
    backgroundColor: colors.btnBgDisabled,
    borderColor: colors.borderMuted,
  },
  label: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    backgroundColor: '#334789ff',
    color: '#fff',
    fontWeight: '900' as const,
  },
};
