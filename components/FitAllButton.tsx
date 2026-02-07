// components/FitAllButton.tsx
import React from 'react';
import CustomText from './CustomText';
import { Pressable, StyleSheet, GestureResponderEvent, Platform } from 'react-native';

type Props = {
  onPress: (e: GestureResponderEvent) => void;

  // Coachmark ref
  coachmarkRef?: React.Ref<any>;
};

export default function FitAllButton({ onPress, coachmarkRef }: Props) {
  return (
    <Pressable
      ref={coachmarkRef}
      accessibilityRole="button"
      accessibilityLabel="Ver todo el plano"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      android_ripple={{ color: 'rgba(255,255,255,0.15)', borderless: false }}
    >
      <CustomText style={styles.txt}>Ver todo</CustomText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a2b50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btnPressed: {
    backgroundColor: Platform.select({
      ios: '#2e4385ff',
      android: '#2e4385ff',
      default: '#2e4385ff',
    }),
  },
  txt: { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 0.2 },
});
