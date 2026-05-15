// components/tutorial/overlay/TooltipCard.tsx
import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  text: string;
  index: number;
  total: number;
  isLast: boolean;

  top: number;
  left: number;
  maxWidth: number;

  fade: Animated.Value;
  scale: Animated.Value;

  allowOverlayTap: boolean;

  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;

  onMeasured?: (size: { width: number; height: number }) => void;
};

const UI = {
  cardBg: '#111827',
  cardBorder: 'rgba(255,255,255,0.10)',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.75)',
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  buttonText: '#FFFFFF',
};

export function TooltipCard({
  text,
  index,
  total,
  isLast,
  top,
  left,
  maxWidth,
  fade,
  scale,
  allowOverlayTap,
  onPrev,
  onNext,
  onSkip,
  onMeasured,
}: Props) {
  const prevDisabled = index === 0;

  return (
    <Animated.View
      style={[
        styles.tooltip,
        {
          maxWidth,
          top,
          left,
          opacity: fade,
          transform: [{ scale }],
        },
      ]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        onMeasured?.({ width, height });
      }}
      accessible
      accessibilityRole="summary"
    >
      <Text style={styles.text}>{text}</Text>

      <View style={styles.progressRow}>
        <Text style={styles.muted}>{total > 0 ? `${index + 1} / ${total}` : ''}</Text>
      </View>

      <View style={styles.buttonsRow}>
        <Pressable
          onPress={onPrev}
          disabled={prevDisabled}
          style={({ pressed }) => [
            styles.btnSecondary,
            prevDisabled && styles.btnDisabled,
            pressed && !prevDisabled && styles.btnSecondaryPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Anterior"
        >
          <Text style={styles.btnText}>Anterior</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={onSkip}
          style={({ pressed }) => [styles.btnGhost, pressed && styles.btnGhostPressed]}
          accessibilityRole="button"
          accessibilityLabel="Omitir tutorial"
        >
          <Text style={styles.btnText}>Omitir</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Hecho' : 'Siguiente'}
        >
          <Text style={styles.btnText}>{isLast ? 'Hecho' : 'Siguiente'}</Text>
        </Pressable>
      </View>

      {!!allowOverlayTap && (
        <Text style={styles.hint} accessibilityRole="text">
          También puedes tocar el overlay para avanzar.
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    borderRadius: 12,
    padding: 14,
    backgroundColor: UI.cardBg,
    borderWidth: 1,
    borderColor: UI.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  text: {
    color: UI.text,
    fontSize: 14,
    lineHeight: 20,
  },
  muted: {
    color: UI.muted,
    fontSize: 12,
  },
  progressRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnPrimary: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: UI.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryPressed: {
    backgroundColor: UI.primaryPressed,
  },
  btnSecondary: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryPressed: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  btnGhost: {
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    color: UI.buttonText,
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    marginTop: 10,
    color: UI.muted,
    fontSize: 12,
    lineHeight: 16,
  },
});
