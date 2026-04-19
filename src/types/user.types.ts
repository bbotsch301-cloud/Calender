export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  isGuest: boolean;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  notificationsEnabled: boolean;
  sabbathRemindersEnabled: boolean;
  feastRemindersEnabled: boolean;
  dailyCheckinEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  sabbathRemindersEnabled: boolean;
  feastRemindersEnabled: boolean;
  dailyCheckinEnabled: boolean;
  preferredView: 'standard' | 'biblical';
  hebrewNumerals: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'sabbath' | 'feast' | 'checkin' | 'scripture' | 'fast';
  date: Date;
  feastKey?: string;
  notes?: string;
  createdAt: Date;
}

export interface AlignmentStats {
  score: number;
  streakDays: number;
  sabbathsKept: number;
  feastsEngaged: number;
  checkIns: number;
  scripturesRead: number;
  lastUpdated: Date;
}
