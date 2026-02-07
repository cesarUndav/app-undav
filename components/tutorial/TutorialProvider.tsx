import React, { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import type { TutorialController } from "../../types/tutorial";
import { useCoachmarks } from "./useCoachmarks";
import { CoachmarkOverlay } from "./CoachmarkOverlay";

const TutorialContext = createContext<TutorialController | null>(null);

export function TutorialProvider({ children }: PropsWithChildren) {
  const coach = useCoachmarks();

  const controller = useMemo<TutorialController>(
    () => ({
      start: coach.start,
      stop: coach.stop,
      next: coach.next,
      prev: coach.prev,
      skip: coach.skip,
      isActive: coach.isActive,
    }),
    [coach]
  );

  return (
    <TutorialContext.Provider value={controller}>
      {children}
      <CoachmarkOverlay {...coach.overlayProps} />
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) {
    throw new Error(
      "useTutorial() debe usarse dentro de <TutorialProvider />"
    );
  }
  return ctx;
}
