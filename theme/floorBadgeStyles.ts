// theme/floorBadgeStyles.ts

import { colors } from './mapTokens';

export const floorBadgeStyles = {
  circleBtnBase: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  circleBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  circleBtnDisabled: {
    backgroundColor: colors.btnBgDisabled,
    borderColor: colors.borderMuted,
  },
  label: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    backgroundColor: '#334789ff',
    color: '#fff',
    fontWeight: '900' as const,
  },
  capsule: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};