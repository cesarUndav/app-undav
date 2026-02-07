import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import type {
  CoachmarkStep,
  FinishReason,
  StartOptions,
  WindowRect,
} from "../../types/tutorial";
import { measureTargetInWindow } from "./measure";

type Snapshot = {
  index: number;
  rect: WindowRect | null;
};

export function useCoachmarks() {
  const dims = useWindowDimensions();

  const [visible, setVisible] = useState(false);
  const [steps, setSteps] = useState<CoachmarkStep[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot>({ index: 0, rect: null });
  const [startOptions, setStartOptions] = useState<StartOptions | undefined>(
    undefined
  );

  const stepsRef = useRef<CoachmarkStep[]>([]);
  const visibleRef = useRef(false);
  const indexRef = useRef(0);
  const optionsRef = useRef<StartOptions | undefined>(undefined);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    indexRef.current = snapshot.index;
  }, [snapshot.index]);

  useEffect(() => {
    optionsRef.current = startOptions;
  }, [startOptions]);

  const currentStep = useMemo(() => {
    return steps[snapshot.index] ?? null;
  }, [steps, snapshot.index]);

  const findNextValid = useCallback(
    async (fromIndex: number, direction: 1 | -1) => {
      const list = stepsRef.current;
      let i = fromIndex;

      while (i >= 0 && i < list.length) {
        const step = list[i];

        if (step.shouldSkip?.()) {
          i += direction;
          continue;
        }

        const rect = await measureTargetInWindow(step.targetRef);
        if (rect && rect.width > 1 && rect.height > 1) {
          return { index: i, rect };
        }

        // No medible => saltar
        i += direction;
      }

      return null;
    },
    []
  );

  const goToIndex = useCallback(
    async (targetIndex: number, direction: 1 | -1) => {
      const res = await findNextValid(targetIndex, direction);
      if (!res) {
        // No hay más pasos válidos. Cerramos sin marcar "seen" (caso raro).
        setVisible(false);
        setSteps([]);
        setSnapshot({ index: 0, rect: null });
        setStartOptions(undefined);
        return;
      }

      setSnapshot({ index: res.index, rect: res.rect });
    },
    [findNextValid]
  );

  const stop = useCallback(() => {
    // Cancelar a mitad => NO onFinish
    setVisible(false);
    setSteps([]);
    setSnapshot({ index: 0, rect: null });
    setStartOptions(undefined);
  }, []);

  const finish = useCallback(
    async (reason: FinishReason) => {
      const opts = optionsRef.current;
      try {
        await opts?.onFinish?.(reason);
      } finally {
        setVisible(false);
        setSteps([]);
        setSnapshot({ index: 0, rect: null });
        setStartOptions(undefined);
      }
    },
    []
  );

  const start = useCallback(
    (inputSteps: CoachmarkStep[], options?: StartOptions) => {
      const normalized = (inputSteps ?? []).filter(Boolean);

      setSteps(normalized);
      setStartOptions(options);
      setVisible(true);
      setSnapshot({ index: 0, rect: null });

      // Asíncrono: ir al primer paso válido
      (async () => {
        // pequeña espera para asegurar layout
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        if (!visibleRef.current && !visible) {
          // Si algo cerró inmediatamente, no seguimos
          return;
        }
        await goToIndex(0, 1);
      })();
    },
    [goToIndex, visible]
  );

  const next = useCallback(() => {
    const list = stepsRef.current;
    const i = indexRef.current;

    if (i >= list.length - 1) {
      void finish("completed");
      return;
    }

    void (async () => {
      await goToIndex(i + 1, 1);
    })();
  }, [finish, goToIndex]);

  const prev = useCallback(() => {
    const i = indexRef.current;
    if (i <= 0) return;

    void (async () => {
      await goToIndex(i - 1, -1);
    })();
  }, [goToIndex]);

  const skip = useCallback(() => {
    void finish("skipped");
  }, [finish]);

  const remeasureCurrent = useCallback(async () => {
    if (!visibleRef.current) return;

    const step = stepsRef.current[indexRef.current];
    if (!step) return;

    if (step.shouldSkip?.()) {
      await goToIndex(indexRef.current + 1, 1);
      return;
    }

    const rect = await measureTargetInWindow(step.targetRef);
    if (!rect) {
      await goToIndex(indexRef.current + 1, 1);
      return;
    }

    setSnapshot((s) => ({ ...s, rect }));
  }, [goToIndex]);

  // Rotación / resize => re-medimos el paso actual
  useEffect(() => {
    if (!visible) return;
    void (async () => {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await remeasureCurrent();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.width, dims.height]);

  const allowOverlayTap = useMemo(() => {
    const step = currentStep;
    const opts = startOptions;
    if (!step) return false;
    return step.allowOverlayTap ?? opts?.allowOverlayTap ?? false;
  }, [currentStep, startOptions]);

  const isActive = useCallback(() => visibleRef.current, []);

  return {
    // Controller (para Context)
    start,
    stop,
    next,
    prev,
    skip,
    isActive,

    // Props para overlay
    overlayProps: {
      visible,
      step: currentStep,
      index: snapshot.index,
      total: steps.length,
      rect: snapshot.rect,
      allowOverlayTap,
      onNext: next,
      onPrev: prev,
      onSkip: skip,
      onRequestClose: stop, // back Android => cancelar sin marcar seen
    },
  };
}
