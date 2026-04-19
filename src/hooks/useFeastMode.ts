import { useMemo } from 'react';
import { useFeastStore } from '../store/useFeastStore';
import { useThemeStore } from '../store/useThemeStore';
import { Colors, FeastColors, FeastGlows } from '../constants/colors';

export function useFeastMode() {
  const isFeastMode = useFeastStore((s) => s.isFeastMode);
  const currentFeast = useFeastStore((s) => s.currentFeast);
  const accent = useThemeStore((s) => s.currentAccentColor);

  return useMemo(() => {
    const feastTheme = currentFeast
      ? {
          accent: FeastColors[currentFeast.key] ?? Colors.gold,
          glow: FeastGlows[currentFeast.key] ?? 'rgba(201,168,76,0.4)',
          icon: currentFeast.icon,
          name: currentFeast.name,
        }
      : { accent, glow: 'rgba(201,168,76,0.4)', icon: 'star', name: '' };

    return {
      isFeastMode,
      currentFeast,
      feastTheme,
    };
  }, [isFeastMode, currentFeast, accent]);
}
