// hooks/planos/usePlanosTutorial.ts
import React from 'react';
import { Alert } from 'react-native';

import type { BuildingKey, PlanData } from '../../app/mapsConfig';

import { useTutorial } from '../../components/tutorial/TutorialProvider';
import { createPlanosSteps } from '../../components/tutorial/steps/planosSteps';
import { setPlanosTutorialSeen } from '../../storage/tutorialSeen';

type Args = {
  building: '' | BuildingKey;
  planData: PlanData | null;

  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRooms: React.Dispatch<React.SetStateAction<boolean>>;
};

export function usePlanosTutorial({
  building,
  planData,
  setShowMenu,
  setShowRooms,
}: Args) {
  const tutorial = useTutorial();

  // Refs coachmarks
  const buildingSelectorRef = React.useRef<any>(null);
  const showAulasButtonRef = React.useRef<any>(null);
  const searchButtonRef = React.useRef<any>(null);

  const mapViewportRef = React.useRef<any>(null);
  const guidePointButtonRef = React.useRef<any>(null);
  const fitAllButtonRef = React.useRef<any>(null);
  const floorControlsRef = React.useRef<any>(null);

  const refs = React.useMemo(
    () => ({
      buildingSelectorRef,
      showAulasButtonRef,
      searchButtonRef,
      mapViewportRef,
      guidePointButtonRef,
      fitAllButtonRef,
      floorControlsRef,
    }),
    []
  );

  const startTutorial = React.useCallback(() => {
    const steps = createPlanosSteps(refs);

    tutorial.start(steps, {
      allowOverlayTap: false,
      onFinish: async () => {
        await setPlanosTutorialSeen(true);
      },
    });
  }, [tutorial, refs]);

  // Botón “?” (Propuesta D)
  const handleOpenTutorial = React.useCallback(() => {
    // 1) Requisito: sede seleccionada
    if (!building) {
      Alert.alert(
        'Acción requerida (*)',
        'Primero selecciona una sede/edificio para iniciar el tutorial.',
        [
          {
            text: 'Seleccionar sede',
            onPress: () => {
              setShowMenu(true);
              setShowRooms(false);
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
      return;
    }

    // 2) Requisito: planData disponible (por si la sede/piso no tiene plano cargado)
    if (!planData) {
      Alert.alert(
        'Plano no disponible',
        'No hay un plano cargado para esta sede/piso. Prueba con otra sede o cambia de piso.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // 3) OK → arrancar tutorial
    setShowMenu(false);
    setShowRooms(false);
    startTutorial();
  }, [building, planData, setShowMenu, setShowRooms, startTutorial]);

  return { refs, handleOpenTutorial, startTutorial };
}
