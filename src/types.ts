export type ExerciseType = 
  | 'multiple_choice' 
  | 'fill_blank' 
  | 'order_blocks' 
  | 'code_output' 
  | 'fix_bug'
  | 'write_code';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  hint?: string;
  codeSnippet?: string;
  language?: string;
  // For multiple_choice & code_output
  options?: string[];
  correctOptionIndex?: number;
  // For fill_blank
  template?: string; // e.g. "print(__BLANK__)"
  blankOptions?: string[];
  correctBlankAnswer?: string;
  // For order_blocks
  codeBlocks?: string[]; // pieces to reorder
  correctBlockOrder?: string[];
  // For fix_bug
  buggyCode?: string;
  bugLineIndex?: number;
  bugExplanation?: string;
  // For write_code
  starterCode?: string;
  expectedOutput?: string;
  testValidator?: (code: string) => boolean;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  gemReward: number;
  exercises: Exercise[];
}

export interface UnitGuidebook {
  title: string;
  summary: string;
  keyConcepts: {
    title: string;
    description: string;
    exampleCode: string;
  }[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  color: string; // Tailwind color token or hex
  accentColor: string;
  guidebook: UnitGuidebook;
  lessons: Lesson[];
}

export interface Section {
  id: string;
  sectionNumber: number; // 1 to 9
  title: string;
  subtitle: string;
  description: string;
  color: string;
  doorsCount: number; // >20 doors (21 doors)
  isDailySpecial?: boolean; // Section 9: 6 lessons, resets daily!
  doors: Unit[];
}

export interface Course {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  totalXp: number;
  sections: Section[];
  units: Unit[]; // active units shortcut
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
}

export interface UserStats {
  profile: UserProfile;
  hearts: number;
  maxHearts: number;
  streak: number;
  gems: number;
  xp: number;
  completedLessonIds: string[];
  claimedChestIds: string[];
  activeCourseId: string;
  currentSectionNumber: number; // 1 to 9
  currentDoorNumber: number; // 1 to 21
  dailyCompletedIds: string[]; // for section 9 daily reset
  lastDailyResetDate: string; // YYYY-MM-DD
  streakFrozenToday: boolean;
  hasSuper: boolean;
  inventory: {
    streakFreezes: number;
    unlockedThemes: string[];
  };
  league: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim Cương';
  leagueRank: number;
  dailyQuests: {
    id: string;
    title: string;
    target: number;
    progress: number;
    rewardGems: number;
    claimed: boolean;
  }[];
  soundEnabled: boolean;
}
