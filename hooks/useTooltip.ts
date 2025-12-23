// ==============================
// File: hooks/useTooltip.ts
// ==============================
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

type Options = {
  /** Duración total visible del tooltip (excluye fadeIn/fadeOut). Default: 2000ms */
  visibleMs?: number;
  /** Duración del fade in/out. Default: 200ms */
  fadeMs?: number;
};

export function useTooltip(defaults: Options = {}) {
  const { visibleMs = 2000, fadeMs = 200 } = defaults;

  const [tooltip, setTooltip] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;

  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      animRef.current?.stop();
      animRef.current = null;
    };
  }, []);

  const hideTip = useCallback(() => {
    animRef.current?.stop();
    animRef.current = Animated.timing(fade, {
      toValue: 0,
      duration: fadeMs,
      useNativeDriver: true,
    });
    animRef.current.start(({ finished }) => {
      if (finished && mountedRef.current) setTooltip(null);
    });
  }, [fade, fadeMs]);

  const showTip = useCallback(
    (text: string, opts?: Options) => {
      const showFor = opts?.visibleMs ?? visibleMs;
      const fadeTime = opts?.fadeMs ?? fadeMs;

      // Cancelar animación previa
      animRef.current?.stop();

      setTooltip(text);
      fade.setValue(0);

      const seq = Animated.sequence([
        Animated.timing(fade, { toValue: 1, duration: fadeTime, useNativeDriver: true }),
        Animated.delay(showFor),
        Animated.timing(fade, { toValue: 0, duration: fadeTime, useNativeDriver: true }),
      ]);

      animRef.current = seq;
      seq.start(({ finished }) => {
        if (finished && mountedRef.current) setTooltip(null);
      });
    },
    [fade, visibleMs, fadeMs]
  );

  return { tooltip, fade, showTip, hideTip };
}
