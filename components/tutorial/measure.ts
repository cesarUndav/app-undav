// components/tutorial/measure.ts

import type React from 'react';
import { findNodeHandle, UIManager } from 'react-native';
import type { WindowRect } from '../../types/tutorial';

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function isValidRect(rect: WindowRect | null) {
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

export async function measureTargetInWindow(
  ref: React.RefObject<any>,
  opts?: { retries?: number; retryDelayMs?: number }
): Promise<WindowRect | null> {
  const retries = opts?.retries ?? 8;
  const retryDelayMs = opts?.retryDelayMs ?? 24;

  for (let i = 0; i < retries; i++) {
    const node = ref?.current ? findNodeHandle(ref.current) : null;

    if (!node) {
      await sleep(retryDelayMs);
      continue;
    }

    const rect = await new Promise<WindowRect | null>((resolve) => {
      UIManager.measureInWindow(
        node,
        (x: number, y: number, width: number, height: number) => {
          const measuredRect = { x, y, width, height };

          if (isValidRect(measuredRect)) {
            resolve(measuredRect);
          } else {
            resolve(null);
          }
        }
      );
    });

    if (isValidRect(rect)) {
      return rect;
    }

    await sleep(retryDelayMs);
  }

  return null;
}