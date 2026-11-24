import { UserStats } from '../types';
import { INITIAL_USER_STATS, loadUserStats, saveUserStats } from './storage';
import { MASCOT_HAPPY, MASCOT_CELEBRATING, MASCOT_STANDING } from '../assets/mascots';

export interface AccountRecord {
  id: string;
  email: string;
  username: string;
  displayName: string;
  age?: number;
  password: string;
  provider: 'email' | 'google' | 'github';
  stats: UserStats;
}

const ACCOUNTS_KEY = 'duoiingo_accounts_v1';
const SESSION_KEY = 'duoiingo_session_v1';

function seedDefaultAccounts(): AccountRecord[] {
  const existingStats = loadUserStats();
  const defaultAccount: AccountRecord = {
    id: existingStats.profile.id || 'user_dev_01',
    email: existingStats.profile.email || 'coder@duoiingo.vn',
    username: existingStats.profile.username || 'coder_vietnam',
    displayName: existingStats.profile.displayName || 'Lập Trình Viên duoIingo',
    age: 20,
    password: '123456',
    provider: 'email',
    stats: {
      ...existingStats,
      profile: {
        ...existingStats.profile,
        displayName:
          existingStats.profile.displayName === 'Lập Trình Viên Duolingo'
            ? 'Lập Trình Viên duoIingo'
            : existingStats.profile.displayName,
      },
    },
  };
  return [defaultAccount];
}

export function loadAccounts(): AccountRecord[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      const seeded = seedDefaultAccounts();
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = seedDefaultAccounts();
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    return seedDefaultAccounts();
  }
}

export function saveAccounts(accounts: AccountRecord[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

export function getActiveSessionUserId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setActiveSessionUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(SESSION_KEY, userId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {}
}

export function loginWithCredentials(
  identifier: string,
  password: string
): { ok: true; account: AccountRecord } | { ok: false; error: string } {
  const normalized = identifier.trim().toLowerCase();
  if (!normalized || !password) {
    return { ok: false, error: 'Vui lòng nhập đầy đủ email/tên đăng nhập và mật khẩu.' };
  }

  const accounts = loadAccounts();
  const matched = accounts.find(
    (acc) =>
      acc.email.toLowerCase() === normalized ||
      acc.username.toLowerCase() === normalized
  );

  if (!matched) {
    return { ok: false, error: 'Không tìm thấy tài khoản phù hợp. Bạn đã đăng ký chưa?' };
  }

  if (matched.password !== password) {
    return { ok: false, error: 'Mật khẩu chưa chính xác. Vui lòng thử lại!' };
  }

  setActiveSessionUserId(matched.id);
  saveUserStats(matched.stats);
  return { ok: true, account: matched };
}

export function registerAccount(params: {
  age?: number;
  displayName: string;
  email: string;
  password: string;
  courseId?: string;
}): { ok: true; account: AccountRecord } | { ok: false; error: string } {
  const displayName = params.displayName.trim();
  const email = params.email.trim().toLowerCase();
  const password = params.password;
  const age = params.age;

  if (!displayName || displayName.length < 2) {
    return { ok: false, error: 'Vui lòng nhập tên của bạn (ít nhất 2 ký tự).' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, error: 'Địa chỉ email không hợp lệ.' };
  }

  if (password.length < 6) {
    return { ok: false, error: 'Mật khẩu cần ít nhất 6 ký tự.' };
  }

  if (age !== undefined && (Number.isNaN(age) || age < 5 || age > 120)) {
    return { ok: false, error: 'Vui lòng nhập độ tuổi hợp lệ (5 - 120).' };
  }

  const accounts = loadAccounts();
  if (accounts.some((a) => a.email.toLowerCase() === email)) {
    return { ok: false, error: 'Email này đã được đăng ký. Hãy chuyển sang tab Đăng nhập!' };
  }

  const baseUsername =
    email
      .split('@')[0]
      .replace(/[^a-z0-9_]/gi, '_')
      .toLowerCase() || 'coder';
  let username = baseUsername;
  let suffix = 1;
  while (accounts.some((a) => a.username.toLowerCase() === username)) {
    username = `${baseUsername}_${suffix++}`;
  }

  const id = `user_${Date.now()}`;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const now = new Date();
  const joinedDate = `Tháng ${monthNames[now.getMonth()]}/${now.getFullYear()}`;

  const freshStats: UserStats = {
    ...INITIAL_USER_STATS,
    profile: {
      id,
      username,
      displayName,
      email,
      avatar: MASCOT_HAPPY,
      bio: 'Bắt đầu hành trình lập trình cùng duoIingo 🚀',
      joinedDate,
    },
    hearts: 5,
    maxHearts: 5,
    streak: 1,
    gems: 500,
    xp: 0,
    completedLessonIds: [],
    claimedChestIds: [],
    activeCourseId: params.courseId || 'python',
    currentSectionNumber: 1,
    currentDoorNumber: 1,
    dailyCompletedIds: [],
    lastDailyResetDate: todayDateStr,
    hasSuper: false,
    league: 'Đồng',
    leagueRank: 8,
  };

  const newAccount: AccountRecord = {
    id,
    email,
    username,
    displayName,
    age,
    password,
    provider: 'email',
    stats: freshStats,
  };

  const nextAccounts = [...accounts, newAccount];
  saveAccounts(nextAccounts);
  setActiveSessionUserId(id);
  saveUserStats(freshStats);

  return { ok: true, account: newAccount };
}

export function loginWithSocialProvider(
  provider: 'google' | 'github',
  courseId?: string
): AccountRecord {
  const accounts = loadAccounts();
  const socialEmail =
    provider === 'google' ? 'google.coder@duoiingo.vn' : 'github.dev@duoiingo.vn';
  const existing = accounts.find((a) => a.email === socialEmail);

  if (existing) {
    setActiveSessionUserId(existing.id);
    saveUserStats(existing.stats);
    return existing;
  }

  const id = `user_${provider}_${Date.now()}`;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const stats: UserStats = {
    ...INITIAL_USER_STATS,
    profile: {
      id,
      username: provider === 'google' ? 'google_coder' : 'github_ninja',
      displayName: provider === 'google' ? 'Google Coder' : 'GitHub Developer',
      email: socialEmail,
      avatar: provider === 'google' ? MASCOT_CELEBRATING : MASCOT_STANDING,
      bio: `Đăng nhập nhanh bằng ${provider === 'google' ? 'Google' : 'GitHub'} ✨`,
      joinedDate: 'Hôm nay',
    },
    streak: 1,
    gems: 500,
    xp: 0,
    completedLessonIds: [],
    claimedChestIds: [],
    activeCourseId: courseId || 'python',
    currentSectionNumber: 1,
    currentDoorNumber: 1,
    dailyCompletedIds: [],
    lastDailyResetDate: todayDateStr,
    league: 'Đồng',
    leagueRank: 5,
  };

  const created: AccountRecord = {
    id,
    email: socialEmail,
    username: stats.profile.username,
    displayName: stats.profile.displayName,
    password: `${provider}_oauth_token`,
    provider,
    stats,
  };

  saveAccounts([...accounts, created]);
  setActiveSessionUserId(id);
  saveUserStats(stats);
  return created;
}

export function syncActiveAccountStats(stats: UserStats): void {
  saveUserStats(stats);
  const activeId = getActiveSessionUserId();
  if (!activeId) return;

  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.id === activeId);
  if (idx !== -1) {
    accounts[idx] = {
      ...accounts[idx],
      displayName: stats.profile.displayName,
      username: stats.profile.username,
      email: stats.profile.email,
      stats,
    };
    saveAccounts(accounts);
  }
}

export function logoutAccount(): void {
  setActiveSessionUserId(null);
}
