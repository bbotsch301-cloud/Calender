import type { HebrewDate } from '../engine/hebrewCalendar';

export interface CalendarDay {
  date: Date;
  gregorianDay: number;
  gregorianMonth: number;
  gregorianYear: number;
  hebrewDate: HebrewDate;
  isSabbath: boolean;
  isRoshChodesh: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  feastKey?: string;
  feastName?: string;
  feastColor?: string;
}

export interface CalendarMonth {
  year: number;
  month: number;
  monthName: string;
  days: CalendarDay[];
  weeks: CalendarDay[][];
}

export type ViewMode = 'standard' | 'biblical';
