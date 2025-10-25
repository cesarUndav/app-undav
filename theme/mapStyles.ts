// ==============================
// File: styles/mapStyles.ts
// ==============================
import { StyleSheet } from 'react-native';

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


export const mapTokens = {
  buttonHeight: 36,
  buttonRadius: 18,
  buttonBg: '#1a2b50',
  shadow: {
    color: '#000',
    offset: { width: 0, height: 2 },
    opacity: 0.2,
    radius: 3,
    elevation: 3,
  },
  zFloating: 3,
};

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
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export const colors = {
  active: '#1e1ee5',
  inactive: '#9E9E9E',
  disabled: '#CCCCCC',
  btnBg: '#FFFFFF',
  btnBorder: '#DADADA',
  btnBgDisabled: '#F2F2F2',
  btnBorderDisabled: '#E6E6E6',
  badgeBg: 'rgba(161,161,161,0.7)',
  white: '#fff',
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

export const floorBadgeStyles = StyleSheet.create({
  circleBtnBase: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.btnBg,
    borderWidth: 1,
    borderColor: colors.btnBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  circleBtnDisabled: {
    backgroundColor: colors.btnBgDisabled,
    borderColor: colors.btnBorderDisabled,
  },
  label: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.badgeBg,
    color: colors.white,
    fontWeight: '900',
  },
});


/* Estilos + tokens para Tooltip */
export const tooltipTokens = {
  radius: 8,
  padV: 8,
  padH: 12,
  maxWidth: 520,
  // fondos por variante
  variants: {
    default: 'rgba(0,0,0,0.75)',
    success: '#16a34a', // verde
    warning: '#f59e0b', // naranja
    error:   '#ef4444', // rojo
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
  }
});


// === Dropdown / Selectors ===
export const dropdownTokens = {
  height: 44,          // alto del botón
  borderRadius: 8,
  menuOffset: 4,       // separación entre botón y menú
  menuMaxHeight: 240,
  textColor: '#333',
};

export const selectorStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: dropdownTokens.height, // reserva espacio del botón
    zIndex: 30,                    // por encima de otros overlays del header
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
  // Menú flotante (no desplaza el layout)
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
