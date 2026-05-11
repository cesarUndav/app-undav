// components/tutorial/useCoachmarks.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type {
  CoachmarkStep,
  FinishReason,
  StartOptions,
  WindowRect,
} from '../../types/tutorial';
import { measureTargetInWindow } from './measure';
import { isValidWindowRect, waitForNextFrame } from './coachmarkUtils';
import {
  findNextValidCoachmarkStep,
  type CoachmarkDirection,
} from './coachmarkStepResolver';

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

  /**
   * Identificador de ejecución.
   * Cada vez que el tutorial inicia, se cierra o finaliza, cambia.
   * Sirve para ignorar mediciones async viejas.
   */
  const runIdRef = useRef(0);

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

  const clearTutorialState = useCallback(() => {
    setVisible(false);
    setSteps([]);
    setSnapshot({ index: 0, rect: null });
    setStartOptions(undefined);
  }, []);

  const isCurrentRunActive = useCallback((runId: number) => {
    return runId === runIdRef.current && visibleRef.current;
  }, []);

  const findNextValid = useCallback(
    async (
      fromIndex: number,
      direction: CoachmarkDirection,
      runId: number
    ) => {
      return findNextValidCoachmarkStep({
        steps: stepsRef.current,
        fromIndex,
        direction,
        shouldContinue: () => isCurrentRunActive(runId),
      });
    },
    [isCurrentRunActive]
  );

  const goToIndex = useCallback(
    async (
      targetIndex: number,
      direction: CoachmarkDirection,
      runId?: number
    ) => {
      const activeRunId = runId ?? runIdRef.current;

      const result = await findNextValid(
        targetIndex,
        direction,
        activeRunId
      );

      if (!isCurrentRunActive(activeRunId)) {
        return;
      }

      if (!result) {
        clearTutorialState();
        return;
      }

      setSnapshot({
        index: result.index,
        rect: result.rect,
      });
    },
    [clearTutorialState, findNextValid, isCurrentRunActive]
  );

  const stop = useCallback(() => {
    runIdRef.current += 1;
    clearTutorialState();
  }, [clearTutorialState]);

  const finish = useCallback(
    async (reason: FinishReason) => {
      const runId = runIdRef.current;
      const opts = optionsRef.current;

      try {
        await opts?.onFinish?.(reason);
      } finally {
        if (runId === runIdRef.current) {
          runIdRef.current += 1;
          clearTutorialState();
        }
      }
    },
    [clearTutorialState]
  );

  const start = useCallback(
    (inputSteps: CoachmarkStep[], options?: StartOptions) => {
      const normalizedSteps = (inputSteps ?? []).filter(Boolean);

      if (normalizedSteps.length === 0) {
        return;
      }

      const nextRunId = runIdRef.current + 1;
      runIdRef.current = nextRunId;

      setSteps(normalizedSteps);
      setStartOptions(options);
      setVisible(true);
      setSnapshot({ index: 0, rect: null });

      void (async () => {
        await waitForNextFrame();

        if (nextRunId !== runIdRef.current) {
          return;
        }

        /**
         * Refleja inmediatamente el estado visible para que las operaciones async
         * iniciadas en este mismo frame no dependan del próximo render.
         */
        visibleRef.current = true;

        await goToIndex(0, 1, nextRunId);
      })();
    },
    [goToIndex]
  );

  const next = useCallback(() => {
    const list = stepsRef.current;
    const currentIndex = indexRef.current;

    if (currentIndex >= list.length - 1) {
      void finish('completed');
      return;
    }

    void goToIndex(currentIndex + 1, 1);
  }, [finish, goToIndex]);

  const prev = useCallback(() => {
    const currentIndex = indexRef.current;

    if (currentIndex <= 0) {
      return;
    }

    void goToIndex(currentIndex - 1, -1);
  }, [goToIndex]);

  const skip = useCallback(() => {
    void finish('skipped');
  }, [finish]);

  const remeasureCurrent = useCallback(async () => {
    if (!visibleRef.current) {
      return;
    }

    const runId = runIdRef.current;
    const currentIndex = indexRef.current;
    const step = stepsRef.current[currentIndex];

    if (!step) {
      return;
    }

    if (step.shouldSkip?.()) {
      await goToIndex(currentIndex + 1, 1, runId);
      return;
    }

    const rect = await measureTargetInWindow(step.targetRef);

    if (!isCurrentRunActive(runId)) {
      return;
    }

    if (!isValidWindowRect(rect)) {
      await goToIndex(currentIndex + 1, 1, runId);
      return;
    }

    setSnapshot((current) => ({
      ...current,
      rect,
    }));
  }, [goToIndex, isCurrentRunActive]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    void (async () => {
      await waitForNextFrame();
      await remeasureCurrent();
    })();
  }, [dims.width, dims.height, visible, remeasureCurrent]);

  const allowOverlayTap = useMemo(() => {
    const step = currentStep;
    const opts = startOptions;

    if (!step) {
      return false;
    }

    return step.allowOverlayTap ?? opts?.allowOverlayTap ?? false;
  }, [currentStep, startOptions]);

  const isActive = useCallback(() => visibleRef.current, []);

  return {
    start,
    stop,
    next,
    prev,
    skip,
    isActive,

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
      onRequestClose: stop,
    },
  };
}