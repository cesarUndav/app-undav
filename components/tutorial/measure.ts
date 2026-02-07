import type React from "react";
import { findNodeHandle, UIManager } from "react-native";
import type { WindowRect } from "../../types/tutorial";

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function measureTargetInWindow(
  ref: React.RefObject<any>,
  opts?: { retries?: number; retryDelayMs?: number }
): Promise<WindowRect | null> {
  const retries = opts?.retries ?? 6;
  const retryDelayMs = opts?.retryDelayMs ?? 16;

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
          if (
            Number.isFinite(x) &&
            Number.isFinite(y) &&
            Number.isFinite(width) &&
            Number.isFinite(height)
          ) {
            resolve({ x, y, width, height });
          } else {
            resolve(null);
          }
        }
      );
    });

    // Si todavía no está layout-eado o está oculto, suele devolver 0x0
    if (rect && rect.width > 1 && rect.height > 1) return rect;

    await sleep(retryDelayMs);
  }

  return null;
}
