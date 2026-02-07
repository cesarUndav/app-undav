// theme/planHeaderStyles.ts
import { StyleSheet } from 'react-native';

export const BTN_H = 44;
export const MENU_OFFSET = 4;

/**
 * Estilos del header de Planos (PlanHeader.tsx)
 * Nota: aquí vive el layout del header, NO en mapStyles.
 */
export const planHeaderStyles = StyleSheet.create({
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

  // Botón lupa (primario)
  searchBlueBtn: {
    width: BTN_H,
    height: BTN_H,
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

  // Botón ayuda “?” (secundario: outline para evitar confusión con la lupa)
  helpBtn: {
    width: BTN_H,
    height: BTN_H,
    borderRadius: BTN_H / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1a2b50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '800',
    color: '#1a2b50',
    marginTop: -1,
  },

  // (Opcional) estilos heredados (si en algún momento los usás)
  roomsButton: {
    height: BTN_H,
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

/**
 * Si este dropdownStyles aún se usa en algún lado, dejalo.
 * Si ya no se usa, se puede eliminar más adelante.
 */
export const dropdownStyles = StyleSheet.create({
  wrapper: { position: 'relative', height: BTN_H, zIndex: 30 },
  button: {
    height: BTN_H,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  buttonDisabled: { backgroundColor: '#f5f5f5' },
  text: { fontSize: 16, color: '#333' },
  textDisabled: { color: '#9e9e9e' },

  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 200,
    zIndex: 29,
    elevation: 5,
  },
  menuContent: { paddingVertical: 4 },
  item: { paddingVertical: 10, paddingHorizontal: 12 },
  itemText: { fontSize: 16, color: '#333' },
  emptyItem: { paddingVertical: 14, paddingHorizontal: 12 },
  emptyText: { fontSize: 14, color: '#666' },
});
