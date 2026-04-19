import { create } from 'zustand';
import { Colors, FeastColors, FeastGlows } from '../constants/colors';
import type { FeastKey } from '../engine/feasts';

interface ThemeState {
  isDarkMode: boolean;
  activeFeastKey: FeastKey | null;
  currentAccentColor: string;
  currentGlowColor: string;
  applyFeastTheme: (feastKey: FeastKey) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: true,
  activeFeastKey: null,
  currentAccentColor: Colors.gold,
  currentGlowColor: 'rgba(201, 168, 76, 0.4)',
  applyFeastTheme: (feastKey) =>
    set({
      activeFeastKey: feastKey,
      currentAccentColor: FeastColors[feastKey] || Colors.gold,
      currentGlowColor: FeastGlows[feastKey] || 'rgba(201, 168, 76, 0.4)',
    }),
  resetTheme: () =>
    set({
      activeFeastKey: null,
      currentAccentColor: Colors.gold,
      currentGlowColor: 'rgba(201, 168, 76, 0.4)',
    }),
}));
