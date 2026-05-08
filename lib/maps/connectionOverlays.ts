import React from 'react';
import { BuildingKey, FloorKey } from './types';

// Overlays de conexiones — se mantienen como SVG
import PineyroA0Conn from '../../assets/maps/PineyroA/pineyroA0connections.svg';
import PineyroA1Conn from '../../assets/maps/PineyroA/pineyroA1connections.svg';
import PineyroA2Conn from '../../assets/maps/PineyroA/pineyroA2connections.svg';

import PineyroB0Conn from '../../assets/maps/PineyroB/pineyroB0connections.svg';
import PineyroB1Conn from '../../assets/maps/PineyroB/pineyroB1connections.svg';
import PineyroB2Conn from '../../assets/maps/PineyroB/pineyroB2connections.svg';

import PineyroC0Conn from '../../assets/maps/PineyroC/pineyroC0connections.svg';
import PineyroC1Conn from '../../assets/maps/PineyroC/pineyroC1connections.svg';
import PineyroC2Conn from '../../assets/maps/PineyroC/pineyroC2connections.svg';

export const connectionOverlays: Partial<Record<BuildingKey, Partial<Record<FloorKey, React.FC<any>>>>> = {
  PineyroA: {
    '0': PineyroA0Conn,
    '1': PineyroA1Conn,
    '2': PineyroA2Conn,
    // '3': intencionalmente sin overlay
  },
  PineyroB: {
    '0': PineyroB0Conn,
    '1': PineyroB1Conn,
    '2': PineyroB2Conn,
  },
  PineyroC: {
    '0': PineyroC0Conn,
    '1': PineyroC1Conn,
    '2': PineyroC2Conn,
  },
  // Espana / Arenales: sin overlays
};