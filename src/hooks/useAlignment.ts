import { useEffect } from 'react';
import { useAlignmentStore } from '../store/useAlignmentStore';
import type { ActivityType } from '../engine/alignment';

export function useAlignment() {
  const score = useAlignmentStore((s) => s.score);
  const streak = useAlignmentStore((s) => s.streak);
  const sabbathsKept = useAlignmentStore((s) => s.sabbathsKept);
  const feastsEngaged = useAlignmentStore((s) => s.feastsEngaged);
  const checkIns = useAlignmentStore((s) => s.checkIns);
  const scripturesRead = useAlignmentStore((s) => s.scripturesRead);
  const recentActivity = useAlignmentStore((s) => s.recentActivity);
  const fetchStats = useAlignmentStore((s) => s.fetchStats);
  const userId = useAlignmentStore((s) => s.userId);

  const logActivity = useAlignmentStore((s) => s.logActivity);

  useEffect(() => {
    if (userId) fetchStats();
  }, [userId]);

  return {
    score,
    streak,
    sabbathsKept,
    feastsEngaged,
    checkIns,
    scripturesRead,
    recentActivity,
    refresh: fetchStats,
    logActivity: (type: ActivityType, metadata?: { feastKey?: string; notes?: string }) =>
      logActivity(type, metadata),
  };
}
