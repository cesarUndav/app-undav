// components/plan-area/PlanAreaControls.tsx

import React from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';

import FloorBadgeControls from '../FloorBadgeControls';
import FitAllButton from '../FitAllButton';
import GuidePointButton from '../GuidePointButton';
import Tooltip from '../Tooltip';
import CustomText from '../CustomText';
import { mapButtonStyles } from '../../theme/mapStyles';

type Props = {
  floorIndex: number;
  maxFloors: number;
  onPrevFloor: () => void;
  onNextFloor: () => void;
  floorBadgeBottomY?: number;
  floorControlsRef?: React.Ref<any>;

  onPressGuidePoint: () => void;
  onPressFitAll: () => void;
  guidePointButtonRef?: React.Ref<any>;
  fitAllButtonRef?: React.Ref<any>;

  connectionOverlay?: React.ComponentType<any> | null;
  showConnections?: boolean;
  onToggleConnections?: () => void;

  tooltip: string | null;
  fade: Animated.Value;
};

export default function PlanAreaControls({
  floorIndex,
  maxFloors,
  onPrevFloor,
  onNextFloor,
  floorBadgeBottomY,
  floorControlsRef,

  onPressGuidePoint,
  onPressFitAll,
  guidePointButtonRef,
  fitAllButtonRef,

  connectionOverlay,
  showConnections = false,
  onToggleConnections,

  tooltip,
  fade,
}: Props) {
  return (
    <>
      <FloorBadgeControls
        coachmarkRef={floorControlsRef}
        floorIndex={floorIndex}
        maxFloors={maxFloors}
        onPrev={onPrevFloor}
        onNext={onNextFloor}
        bottomY={floorBadgeBottomY}
      />

      <GuidePointButton
        coachmarkRef={guidePointButtonRef}
        onPress={onPressGuidePoint}
      />

      <FitAllButton
        coachmarkRef={fitAllButtonRef}
        onPress={onPressFitAll}
      />

      {connectionOverlay && onToggleConnections && (
        <TouchableOpacity
          onPress={onToggleConnections}
          activeOpacity={0.85}
          style={[mapButtonStyles.base, styles.connBtn]}
          accessibilityRole="button"
          accessibilityLabel={
            showConnections ? 'Ocultar conexiones' : 'Mostrar conexiones'
          }
        >
          <CustomText weight="bold" style={mapButtonStyles.text}>
            {showConnections ? 'Ocultar conexiones' : 'Mostrar conexiones'}
          </CustomText>
        </TouchableOpacity>
      )}

      {tooltip && <Tooltip text={tooltip} opacity={fade} />}
    </>
  );
}

const styles = StyleSheet.create({
  connBtn: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    zIndex: 6,
    paddingHorizontal: 14,
  },
});