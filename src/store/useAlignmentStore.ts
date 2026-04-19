import { create } from 'zustand';
import { getActivityHistory, getAlignmentScore, logActivity } from '../supabase/queries';
import type { ActivityLog } from '../types/user.types';
import type { ActivityType } from '../engine/alignment';

interface AlignmentState {
  score: number;
  streak: number;
  sabbathsKept: number;
  feastsEngaged: number;
  checkIns: number;
  scripturesRead: number;
  recentActivity: ActivityLog[];
  loading: boolean;
  userId: string | null;
  setUserId: (id: string | null) => void;
  fetchStats: () => Promise<void>;
  logActivity: (type: ActivityType, metadata?: { feastKey?: string; notes?: string }) => Promise<void>;
}

export const useAlignmentStore = create<AlignmentState>((set, get) => ({
  score: 0,
  streak: 0,
  sabbathsKept: 0,
  feastsEngaged: 0,
  checkIns: 0,
  scripturesRead: 0,
  recentActivity: [],
  loading: false,
  userId: null,
  setUserId: (id) => {
    set({ userId: id });
    if (id) get().fetchStats();
  },
  fetchStats: async () => {
    const userId = get().userId;
    if (!userId) return;
    set({ loading: true });
    try {
      const [stats, history] = await Promise.all([
        getAlignmentScore(userId),
        getActivityHistory(userId, 30),
      ]);
      set({
        score: stats.score,
        streak: stats.streakDays,
        sabbathsKept: stats.sabbathsKept,
        feastsEngaged: stats.feastsEngaged,
        checkIns: stats.checkIns,
        scripturesRead: stats.scripturesRead,
        recentActivity: history,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
  logActivity: async (type, metadata) => {
    const userId = get().userId;
    if (!userId) return;
    await logActivity(userId, type, new Date(), metadata);
    await get().fetchStats();
  },
}));
