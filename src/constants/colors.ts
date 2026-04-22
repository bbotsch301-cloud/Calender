export const Colors = {
  background: '#0D0D0F',
  surface: '#15151A',
  surfaceElev: '#1E1E25',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  goldDark: '#8B7232',
  text: '#F0EDE6',
  textMuted: '#8A8578',
  textDim: '#5A5648',
  border: '#2A2A36',
  success: '#65A30D',
  error: '#DC2626',
  warning: '#F59E0B',
  shabbatColumnTint: 'rgba(100, 80, 180, 0.12)',
  shabbatBadge: '#6D5CC4',
  overlay: 'rgba(10, 10, 15, 0.85)',
  modalBackdrop: 'rgba(0, 0, 0, 0.65)',
} as const;

/**
 * Pill colors by feast key. `bg` is the filled background of the pill;
 * `text` is the foreground. Chosen for WCAG AA contrast on the dark UI.
 */
export const FeastPillColors: Record<
  string,
  { bg: string; text: string; shortName: string }
> = {
  passover:        { bg: '#B91C1C', text: '#FFFFFF', shortName: 'Passover' },
  unleavenedBread: { bg: '#DC2626', text: '#FFFFFF', shortName: 'Unleavened' },
  firstfruits:     { bg: '#16A34A', text: '#FFFFFF', shortName: 'Firstfruits' },
  shavuot:         { bg: '#15803D', text: '#FFFFFF', shortName: 'Shavuot' },
  yomTeruah:       { bg: '#0EA5E9', text: '#FFFFFF', shortName: 'Yom Teruah' },
  yomKippur:       { bg: '#4C1D95', text: '#FFFFFF', shortName: 'Yom Kippur' },
  sukkot:          { bg: '#EA580C', text: '#FFFFFF', shortName: 'Sukkot' },
  sheminiAtzeret:  { bg: '#C9A84C', text: '#0D0D0F', shortName: "8th Day" },
  hanukkah:        { bg: '#2563EB', text: '#FFFFFF', shortName: 'Hanukkah' },
  purim:           { bg: '#9333EA', text: '#FFFFFF', shortName: 'Purim' },
};
