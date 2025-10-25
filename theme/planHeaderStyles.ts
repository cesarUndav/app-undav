// theme/planHeaderStyles.ts (resumen mínimo esperado)
import { StyleSheet } from 'react-native';

export const BTN_H = 44;
export const MENU_OFFSET = 4;

export const dropdownStyles = StyleSheet.create({
  wrapper: { position: 'relative', height: BTN_H, zIndex: 30 },
  button: {
    height: BTN_H, borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    justifyContent: 'center', paddingHorizontal: 12, backgroundColor: '#fff',
  },
  buttonDisabled: { backgroundColor: '#f5f5f5' },
  text: { fontSize: 16, color: '#333' },
  textDisabled: { color: '#9e9e9e' },

  menu: {
    position: 'absolute', left: 0, right: 0,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc',
    borderRadius: 6, maxHeight: 200, zIndex: 29, elevation: 5,
  },
  menuContent: { paddingVertical: 4 },
  item: { paddingVertical: 10, paddingHorizontal: 12 },
  itemText: { fontSize: 16, color: '#333' },
  emptyItem: { paddingVertical: 14, paddingHorizontal: 12 },
  emptyText: { fontSize: 14, color: '#666' },
});
