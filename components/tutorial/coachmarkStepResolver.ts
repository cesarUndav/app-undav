// components/tutorial/coachmarkStepResolver.ts

import type { CoachmarkStep, WindowRect } from '../../types/tutorial';
import { measureTargetInWindow } from './measure';
import { isValidWindowRect } from './coachmarkUtils';

export type CoachmarkDirection = 1 | -1;

export type ValidCoachmarkStepResult = {
    index: number;
    rect: WindowRect;
};

type FindNextValidCoachmarkStepParams = {
    steps: CoachmarkStep[];
    fromIndex: number;
    direction: CoachmarkDirection;
    shouldContinue: () => boolean;
};

export async function findNextValidCoachmarkStep({
    steps,
    fromIndex,
    direction,
    shouldContinue,
}: FindNextValidCoachmarkStepParams): Promise<ValidCoachmarkStepResult | null> {
    let index = fromIndex;

    while (index >= 0 && index < steps.length) {
        if (!shouldContinue()) {
            return null;
        }

        const step = steps[index];

        if (step.shouldSkip?.()) {
            index += direction;
            continue;
        }

        const rect = await measureTargetInWindow(step.targetRef);

        if (!shouldContinue()) {
            return null;
        }

        if (isValidWindowRect(rect)) {
            return { index, rect };
        }

        index += direction;
    }

    return null;
}