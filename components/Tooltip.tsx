// components/Tooltip.tsx
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import CustomText from './CustomText';

interface Props {
  text: string;
  opacity: Animated.Value;
}

export default function Tooltip({ text, opacity }: Props) {
  return (
    <Animated.View style={[styles.tooltip, { opacity }]}>
      <CustomText style={styles.text}>{text}</CustomText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});
