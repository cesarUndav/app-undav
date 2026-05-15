// theme/selectorStyles.ts

import { StyleSheet } from 'react-native';
import { colors, shadows } from './mapTokens';

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