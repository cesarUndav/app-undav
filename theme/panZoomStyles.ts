// theme/panZoomStyles.ts

import { StyleSheet } from 'react-native';

export const panZoomStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
  },
  clippedWrapper: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  animatedLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});