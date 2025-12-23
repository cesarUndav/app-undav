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
  fill: '#1d72b8ff',
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
    capsule: {
    backgroundColor: 'rgba(255,255,255,0.5)', // ~18% opacidad
    borderRadius: 28,                           // cápsula
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center' as const,
    // ligera sombra para separarlo del plano
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};

// theme/mapStyles.ts
export const guidePointStyle = {
  fill: '#ff0000ff',
  stroke: '#ff0000ff',     // mismo azul activo que usas
  strokeWidth: 2,
} as const;

export const searchModalStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 30 },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: '#CBD5E1', // slate-300
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  clearBtn: {
    position: 'absolute',
    right: 8,
    padding: 6,
  },
  clearBtnTxt: {
    fontSize: 14,
    color: '#64748B', // slate-500
  },

  title: { fontSize: 22, marginTop: 0, marginBottom: -10},

  card: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    fontSize: 18,
    marginBottom: 8,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  chip: {
    borderWidth: 2,
    borderColor: '#173c68',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    backgroundColor: '#173c68',
  },
  chipPressed: {
    backgroundColor: 'rgba(59,91,253,0.08)',
  },
  chipText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Empty
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#64748B' },

  // Footer
  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  closeText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

// theme/mapStyles.ts
export const planHeaderV2Styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingCol: {
    flex: 1,
  },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 10,
  },
  roomsCol: {
    flex: 1,
  },
  searchBlueBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1a2b50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  roomsButton: {
  height: 44,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#DADADA',
  backgroundColor: '#fff',
  justifyContent: 'center',
  paddingHorizontal: 16,
  },
  roomsButtonActive: {
    backgroundColor: '#1a2b50',
    borderColor: '#1a2b50',
  },
  roomsButtonDisabled: {
    backgroundColor: '#F2F2F2',
    borderColor: '#E6E6E6',
  },
  roomsButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  roomsButtonTextActive: {
    color: '#fff',
  },
  roomsButtonTextDisabled: {
    color: '#A3A3A3',
  },

});

