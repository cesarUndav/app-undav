// components/Tooltip.tsx

import React, { memo } from 'react';
import { Animated, ViewStyle } from 'react-native';
import CustomText from './CustomText';
import { tooltipStyles, tooltipTokens } from '../theme/mapStyles';

type Variant = 'default' | 'success' | 'warning' | 'error';

interface Props {
  text: string;
  opacity: Animated.Value;
  vertical?: 'top' | 'bottom';
  inset?: number;
  caret?: boolean;
  variant?: Variant;
  containerStyle?: ViewStyle;
  testID?: string;
}

function Tooltip({
  text,
  opacity,
  vertical = 'top',
  inset = 16,
  caret = true,
  variant = 'default',
  containerStyle,
  testID,
}: Props) {
  const bg = tooltipTokens.variants[variant] ?? tooltipTokens.variants.default;

  const posStyle = vertical === 'top' ? { top: inset } : { bottom: inset };

  return (
    <Animated.View
      testID={testID}
      pointerEvents="none"
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      style={[
        tooltipStyles.containerBase,
        posStyle,
        { opacity, backgroundColor: bg },
        containerStyle,
      ]}
    >
      <CustomText weight="bold" style={tooltipStyles.text}>
        {text}
      </CustomText>
    </Animated.View>
  );
}

export default memo(Tooltip);