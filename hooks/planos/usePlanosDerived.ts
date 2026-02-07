// hooks/planos/usePlanosDerived.ts
import React from 'react';
import type { Dispatch, SetStateAction } from 'react';

import {
  edificios,
  coordsMap,
  connectionOverlays,
  BuildingKey,
  FloorKey,
  PlanData,
} from '../../app/mapsConfig';

// Helper: ancla inferior de chevrons por edificio
function bottomYForBuilding(b: '' | BuildingKey): number {
  switch (b) {
    case 'Arenales':  return 92;
    case 'PineyroA':  return 78;
    case 'PineyroB':  return 68;
    case 'PineyroC':  return 68;
    default:          return 78;
  }
}

type Args = {
  building: '' | BuildingKey;
  floorIndex: number;

  showRooms: boolean;
  setShowRooms: Dispatch<SetStateAction<boolean>>;

  showConnections: boolean;
  setShowConnections: Dispatch<SetStateAction<boolean>>;
};

export function usePlanosDerived({
  building,
  floorIndex,
  showRooms,
  setShowRooms,
  showConnections,
  setShowConnections,
}: Args) {
  // Datos del plano actual (con FloorKey)
  const planData = React.useMemo<PlanData | null>(() => {
    if (!building) return null;
    const floors = edificios[building]?.floors ?? [];
    const safeIndex = Math.min(Math.max(floorIndex, 0), Math.max(floors.length - 1, 0));
    const fk: FloorKey | undefined = floors[safeIndex]?.key;
    return fk ? coordsMap[building]?.[fk] ?? null : null;
  }, [building, floorIndex]);

  const currentFloors = React.useMemo(
    () => (building ? edificios[building].floors : []),
    [building]
  );

  // firma única edificio+piso
  const mapId = React.useMemo(() => {
    const fk = currentFloors[floorIndex]?.key ?? 'nofloor';
    const b = building || 'nobuilding';
    return `${b}-${fk}`;
  }, [building, currentFloors, floorIndex]);

  // Lista de aulas
  const roomsList = React.useMemo(() => {
    if (!planData) return [] as NonNullable<PlanData>['zones'];
    return planData.zones.filter(z => z.id.toLowerCase().startsWith('aula'));
  }, [planData]);

  const roomsDisabled = !planData || roomsList.length === 0;

  // Si quedan deshabilitadas y el selector está abierto, lo cerramos
  React.useEffect(() => {
    if (roomsDisabled && showRooms) setShowRooms(false);
  }, [roomsDisabled, showRooms, setShowRooms]);

  // Y de chevrón para este edificio
  const floorBadgeBottomY = React.useMemo(
    () => bottomYForBuilding(building),
    [building]
  );

  // Overlay conexiones (edificio + piso)
  const floorKey: FloorKey | undefined = currentFloors[floorIndex]?.key;

  const connectionOverlay = React.useMemo(() => {
    if (!building || !floorKey) return null;
    const group = connectionOverlays?.[building];
    return group?.[floorKey] ?? null;
  }, [building, floorKey]);

  // Si el overlay no existe, apagamos el flag
  React.useEffect(() => {
    if (!connectionOverlay && showConnections) {
      setShowConnections(false);
    }
  }, [connectionOverlay, showConnections, setShowConnections]);

  return {
    planData,
    currentFloors,
    mapId,
    roomsList,
    roomsDisabled,
    floorBadgeBottomY,
    connectionOverlay,
  };
}
