// components/tutorial/coachmarkUtils.ts

import type { WindowRect } from '../../types/tutorial';

export function waitForNextFrame() {
    return new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
    });
}

export function isValidWindowRect(rect: WindowRect | null): rect is WindowRect {
    return (
        !!rect &&
        Number.isFinite(rect.x) &&
        Number.isFinite(rect.y) &&
        Number.isFinite(rect.width) &&
        Number.isFinite(rect.height) &&
        rect.width > 1 &&
        rect.height > 1
    );
}