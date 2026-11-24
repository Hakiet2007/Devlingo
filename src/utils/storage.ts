import { UserStats } from '../types';
import { MASCOT_HAPPY } from '../assets/mascots';

const STORAGE_KEY = 'devlingo_user_stats_v4';

const todayDateStr = new Date().toISOString().split('T')[0];

export const INITIAL_USER_STATS: UserStats = {
  profile: {
    id: 'user_dev_01',
    username: 'coder_vietnam',
    displayName: 'Lập Trình Viên Duolingo',
    email: 'haanhkiet957@gmail.com',
    avatar: MASCOT_HAPPY,
    bio: 'Đang chinh phục 9 Phần lập trình mỗi ngày 🚀',
    joinedDate: 'Tháng 10/2026',
  },
  hearts: 5,
  maxHearts: 5,
  streak: 111,
  gems: 2969,
  xp: 0,
  completedLessonIds: [], // Start from Part 1 Door 1!
  claimedChestIds: [],
  activeCourseId: 'python',
  currentSectionNumber: 1, // Start from Section 1
  currentDoorNumber: 1, // Start from Door 1
  dailyCompletedIds: [], // 0/6 daily lessons completed
  lastDailyResetDate: todayDateStr,
  streakFrozenToday: false,
  hasSuper: false,
  inventory: {
    streakFreezes: 2,
    unlockedThemes: ['default'],
  },
  league: 'Kim Cương',
  leagueRank: 2,
  dailyQuests: [
    {
      id: 'quest_1',
      title: 'Kiếm 30 KN',
      target: 30,
      progress: 0,
      rewardGems: 15,
      claimed: false,
    },
    {
      id: 'quest_2',
      title: 'Làm đúng 5 câu liên tiếp trong 2 bài học',
      target: 2,
      progress: 0,
      rewardGems: 25,
      claimed: false,
    },
    {
      id: 'quest_3',
      title: 'Học trong 15 phút',
      target: 15,
      progress: 15,
      rewardGems: 20,
      claimed: false,
    },
  ],
  soundEnabled: true,
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_STATS;
    const parsed = JSON.parse(raw);
    const loaded: UserStats = {
      ...INITIAL_USER_STATS,
      ...parsed,
      profile: {
        ...INITIAL_USER_STATS.profile,
        ...(parsed.profile || {}),
      },
    };

    // Check if new day: reset daily challenge for Section 9!
    const currentToday = new Date().toISOString().split('T')[0];
    if (loaded.lastDailyResetDate !== currentToday) {
      loaded.dailyCompletedIds = [];
      loaded.lastDailyResetDate = currentToday;
    }

    return loaded;
  } catch {
    return INITIAL_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}
