export const Colors = {
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceElev: '#1A1A24',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  goldDark: '#8B7232',
  text: '#F0EDE6',
  textMuted: '#8A8578',
  textDim: '#5A5648',
  border: '#2A2A36',
  borderActive: '#C9A84C',
  success: '#65A30D',
  error: '#DC2626',
  warning: '#F59E0B',
  overlay: 'rgba(10, 10, 15, 0.85)',
} as const;

export const FeastColors: Record<string, string> = {
  passover: '#7C2D12',
  unleavenedBread: '#A16207',
  firstfruits: '#65A30D',
  pentecost: '#0EA5E9',
  trumpets: '#DC2626',
  atonement: '#1E293B',
  tabernacles: '#15803D',
  eighthDay: '#9333EA',
};

export const FeastGlows: Record<string, string> = {
  passover: 'rgba(124, 45, 18, 0.4)',
  unleavenedBread: 'rgba(161, 98, 7, 0.4)',
  firstfruits: 'rgba(101, 163, 13, 0.4)',
  pentecost: 'rgba(14, 165, 233, 0.4)',
  trumpets: 'rgba(220, 38, 38, 0.4)',
  atonement: 'rgba(30, 41, 59, 0.4)',
  tabernacles: 'rgba(21, 128, 61, 0.4)',
  eighthDay: 'rgba(147, 51, 234, 0.4)',
};
