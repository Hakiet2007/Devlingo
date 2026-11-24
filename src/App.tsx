import React, { useState, useEffect } from 'react';
import { COURSES } from './data/coursesData';
import { Course, Lesson, Unit, UserStats, UserProfile } from './types';
import { loadUserStats, saveUserStats, INITIAL_USER_STATS } from './utils/storage';
import { soundEffects } from './utils/audio';
import { Sidebar, NavTab } from './components/Sidebar';
import { RightSidebar } from './components/RightSidebar';
import { PathView } from './components/PathView';
import { LessonModal } from './components/LessonModal';
import { GuidebookModal } from './components/GuidebookModal';
import { LeaderboardView } from './components/LeaderboardView';
import { QuestsView } from './components/QuestsView';
import { ShopView } from './components/ShopView';
import { CharactersView } from './components/CharactersView';
import { PracticeView } from './components/PracticeView';
import { CodePlaygroundView } from './components/CodePlaygroundView';
import { ProfileView } from './components/ProfileView';
import { HeartsModal } from './components/HeartsModal';
import { SuperModal } from './components/SuperModal';
import { SectionDrawer } from './components/SectionDrawer';
import { LandingPage } from './components/LandingPage';
import { AuthModal, AuthMode } from './components/AuthModal';
import {
  AccountRecord,
  getActiveSessionUserId,
  loadAccounts,
  logoutAccount,
  syncActiveAccountStats,
} from './utils/auth';
import confetti from 'canvas-confetti';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const activeId = getActiveSessionUserId();
    if (!activeId) return false;
    const accounts = loadAccounts();
    return accounts.some((a) => a.id === activeId);
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const activeId = getActiveSessionUserId();
    if (activeId) {
      const accounts = loadAccounts();
      const matched = accounts.find((a) => a.id === activeId);
      if (matched) return matched.stats;
    }
    return loadUserStats();
  });

  const [activeTab, setActiveTab] = useState<NavTab>('learn');
  const [showSandbox, setShowSandbox] = useState(false);
  const [showSectionDrawer, setShowSectionDrawer] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode | null>(null);
  const [landingCourseId, setLandingCourseId] = useState<string>('python');

  // Current course & section
  const currentCourse = COURSES.find((c) => c.id === stats.activeCourseId) || COURSES[0];
  const currentSection = currentCourse.sections.find((s) => s.sectionNumber === stats.currentSectionNumber) || currentCourse.sections[0];

  // Modals state
  const [activeLessonState, setActiveLessonState] = useState<{
    lesson: Lesson;
    unit: Unit;
  } | null>(null);
  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState<Unit | null>(null);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [showSuperModal, setShowSuperModal] = useState(false);

  // Sync state to local storage and active account
  useEffect(() => {
    if (isAuthenticated) {
      syncActiveAccountStats(stats);
    } else {
      saveUserStats(stats);
    }
  }, [stats, isAuthenticated]);

  // Sync sound setting
  useEffect(() => {
    soundEffects.setSoundEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Handlers
  const handleSelectTab = (tab: NavTab) => {
    soundEffects.playPop();
    setShowSandbox(false);
    setActiveTab(tab);
  };

  const handleSelectCourse = (courseId: string) => {
    soundEffects.playPop();
    setStats((prev) => ({
      ...prev,
      activeCourseId: courseId,
      currentSectionNumber: 1,
      currentDoorNumber: 1,
    }));
  };

  const handleSelectSection = (sectionNum: number) => {
    soundEffects.playPop();
    setStats((prev) => ({
      ...prev,
      currentSectionNumber: sectionNum,
      currentDoorNumber: 1,
    }));
  };

  const handleSelectDoor = (doorNum: number) => {
    soundEffects.playPop();
    setStats((prev) => ({
      ...prev,
      currentDoorNumber: doorNum,
    }));
  };

  const handleToggleSound = () => {
    const nextSound = !stats.soundEnabled;
    soundEffects.setSoundEnabled(nextSound);
    if (nextSound) {
      soundEffects.playPop();
    }
    setStats((prev) => ({
      ...prev,
      soundEnabled: nextSound,
    }));
  };

  const handleStartLesson = (lesson: Lesson, unit: Unit) => {
    soundEffects.playPop();
    setActiveLessonState({ lesson, unit });
  };

  const handleCompleteLesson = ({
    xp,
    gems,
    accuracy,
  }: {
    xp: number;
    gems: number;
    accuracy: number;
  }) => {
    if (!activeLessonState) return;
    const lessonId = activeLessonState.lesson.id;

    setStats((prev) => {
      const isDailySection = prev.currentSectionNumber === 9;
      const alreadyCompleted = isDailySection
        ? prev.dailyCompletedIds.includes(lessonId)
        : prev.completedLessonIds.includes(lessonId);

      const nextCompleted = isDailySection
        ? prev.completedLessonIds
        : (alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId]);

      const nextDailyCompleted = isDailySection
        ? (alreadyCompleted ? prev.dailyCompletedIds : [...prev.dailyCompletedIds, lessonId])
        : prev.dailyCompletedIds;

      const updatedQuests = prev.dailyQuests.map((q) => {
        if (q.id === 'quest_1') {
          return { ...q, progress: Math.min(q.target, q.progress + xp) };
        }
        if (q.id === 'quest_2') {
          return { ...q, progress: Math.min(q.target, q.progress + 1) };
        }
        if (q.id === 'quest_3' && accuracy === 100) {
          return { ...q, progress: 1 };
        }
        return q;
      });

      return {
        ...prev,
        xp: prev.xp + xp,
        gems: prev.gems + gems,
        streak: alreadyCompleted ? prev.streak : prev.streak + 1,
        completedLessonIds: nextCompleted,
        dailyCompletedIds: nextDailyCompleted,
        dailyQuests: updatedQuests,
      };
    });

    setActiveLessonState(null);
  };

  const handleDeductHeart = () => {
    soundEffects.playHeartLoss();
    setStats((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const handleRefillHeartsWithGems = () => {
    if (stats.gems < 50) return;
    soundEffects.playCorrect();
    setStats((prev) => ({
      ...prev,
      gems: prev.gems - 50,
      hearts: prev.maxHearts,
    }));
    setShowHeartsModal(false);
  };

  const handlePracticeForHeart = () => {
    soundEffects.playCorrect();
    setStats((prev) => ({
      ...prev,
      hearts: Math.min(prev.maxHearts, prev.hearts + 1),
    }));
    setShowHeartsModal(false);
  };

  const handleBuyStreakFreeze = () => {
    if (stats.gems < 100) return;
    soundEffects.playCorrect();
    setStats((prev) => ({
      ...prev,
      gems: prev.gems - 100,
      inventory: {
        ...prev.inventory,
        streakFreezes: prev.inventory.streakFreezes + 1,
      },
    }));
  };

  const handleUnlockTheme = (themeId: string, cost: number) => {
    if (stats.gems < cost) return;
    soundEffects.playCorrect();
    setStats((prev) => ({
      ...prev,
      gems: prev.gems - cost,
      inventory: {
        ...prev.inventory,
        unlockedThemes: [...prev.inventory.unlockedThemes, themeId],
      },
    }));
  };

  const handleActivateSuper = () => {
    soundEffects.playFanfare();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
    });
    setStats((prev) => ({
      ...prev,
      hasSuper: true,
      hearts: 5,
    }));
  };

  const handleClaimChestBonus = (chestId: string) => {
    soundEffects.playFanfare();
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 },
    });
    setStats((prev) => ({
      ...prev,
      gems: prev.gems + 20,
      xp: prev.xp + 10,
      claimedChestIds: [...(prev.claimedChestIds || []), chestId],
    }));
  };

  const handleClaimQuest = (questId: string, rewardGems: number) => {
    soundEffects.playCorrect();
    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.6 },
    });
    setStats((prev) => ({
      ...prev,
      gems: prev.gems + rewardGems,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === questId ? { ...q, claimed: true } : q
      ),
    }));
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setStats((prev) => ({
      ...prev,
      profile: updatedProfile,
    }));
  };

  const handleResetData = () => {
    soundEffects.playPop();
    setStats({ ...INITIAL_USER_STATS });
  };

  const handleAuthSuccess = (account: AccountRecord) => {
    setStats(account.stats);
    setIsAuthenticated(true);
    setAuthModalMode(null);
    setActiveTab('learn');
    setShowSandbox(false);
  };

  const handleContinueAsGuest = (courseId: string) => {
    setStats((prev) => ({
      ...prev,
      activeCourseId: courseId || prev.activeCourseId,
      currentSectionNumber: 1,
      currentDoorNumber: 1,
    }));
    setIsAuthenticated(true);
    setAuthModalMode(null);
    setActiveTab('learn');
    setShowSandbox(false);
  };

  const handleLogout = () => {
    soundEffects.playPop();
    logoutAccount();
    setIsAuthenticated(false);
    setShowSandbox(false);
    setActiveTab('learn');
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          courses={COURSES}
          selectedCourseId={landingCourseId}
          onSelectCourse={(id) => setLandingCourseId(id)}
          onOpenAuth={(mode) => setAuthModalMode(mode)}
          onQuickTry={handleContinueAsGuest}
        />

        {authModalMode && (
          <AuthModal
            initialMode={authModalMode}
            selectedCourseId={landingCourseId}
            courses={COURSES}
            onClose={() => setAuthModalMode(null)}
            onAuthSuccess={handleAuthSuccess}
            onContinueAsGuest={handleContinueAsGuest}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col md:flex-row antialiased">
      {/* Left Navigation Sidebar with Authentic Duolingo Icons */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        avatarUrl={stats.profile.avatar}
        soundEnabled={stats.soundEnabled}
        onToggleSound={handleToggleSound}
        hasSuper={stats.hasSuper}
        onOpenSuperModal={() => setShowSuperModal(true)}
        onOpenSandbox={() => setShowSandbox(true)}
        onOpenSectionDrawer={() => setShowSectionDrawer(true)}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <div className="md:hidden sticky top-0 bg-[#131f24] border-b-2 border-[#37464f] p-3 z-30 flex items-center justify-between font-black text-sm">
          <div 
            onClick={() => setShowSectionDrawer(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl">{currentCourse.icon}</span>
            <span className="text-[#58cc02] font-black text-lg">duoIingo</span>
            <span className="text-[10px] bg-red-900 text-red-300 px-1.5 py-0.5 rounded font-black">
              P{stats.currentSectionNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-500 flex items-center gap-1">
              🔥 {stats.streak}
            </span>
            <span className="text-[#1cb0f6] flex items-center gap-1">
              💎 {stats.gems}
            </span>
            <span 
              onClick={() => setShowHeartsModal(true)}
              className="text-[#ff4b4b] flex items-center gap-1 cursor-pointer"
            >
              ❤️ {stats.hasSuper ? '∞' : stats.hearts}
            </span>
          </div>
        </div>

        {/* View Routing */}
        <div className="flex-1 flex justify-center w-full">
          {showSandbox ? (
            <CodePlaygroundView />
          ) : activeTab === 'learn' ? (
            <div className="w-full flex justify-center">
              {/* Path view center */}
              <div className="flex-1 max-w-xl">
                <PathView
                  section={currentSection}
                  currentDoorNumber={stats.currentDoorNumber}
                  completedLessonIds={stats.completedLessonIds}
                  claimedChestIds={stats.claimedChestIds || []}
                  dailyCompletedIds={stats.dailyCompletedIds || []}
                  onSelectDoor={handleSelectDoor}
                  onOpenSectionDrawer={() => setShowSectionDrawer(true)}
                  onStartLesson={handleStartLesson}
                  onOpenGuidebook={(unit) => setActiveGuidebookUnit(unit)}
                  onClaimChestBonus={handleClaimChestBonus}
                />
              </div>

              {/* Right widgets sidebar */}
              <RightSidebar
                stats={stats}
                courses={COURSES}
                activeCourseId={stats.activeCourseId}
                onSelectCourse={handleSelectCourse}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenHeartsRefill={() => setShowHeartsModal(true)}
              />
            </div>
          ) : activeTab === 'characters' ? (
            <CharactersView />
          ) : activeTab === 'practice' ? (
            <PracticeView
              stats={stats}
              course={currentCourse}
              onPracticeForHeart={handlePracticeForHeart}
              onQuickQuiz={() => {
                const lesson = currentSection.doors[0]?.lessons[0];
                if (lesson) handleStartLesson(lesson, currentSection.doors[0]);
              }}
            />
          ) : activeTab === 'leaderboard' ? (
            <LeaderboardView stats={stats} />
          ) : activeTab === 'quests' ? (
            <QuestsView stats={stats} onClaimQuest={handleClaimQuest} />
          ) : activeTab === 'shop' ? (
            <ShopView
              stats={stats}
              onRefillHearts={handleRefillHeartsWithGems}
              onBuyStreakFreeze={handleBuyStreakFreeze}
              onUnlockTheme={handleUnlockTheme}
              onActivateSuper={handleActivateSuper}
            />
          ) : (
            <ProfileView
              stats={stats}
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
              onLogout={handleLogout}
              onOpenAuth={(mode) => setAuthModalMode(mode)}
            />
          )}
        </div>
      </div>

      {/* Section Drawer (9 Sections, 20+ Doors each, Section 9 Daily 6 Lessons) */}
      {showSectionDrawer && (
        <SectionDrawer
          sections={currentCourse.sections}
          currentSectionNumber={stats.currentSectionNumber}
          completedLessonIds={stats.completedLessonIds}
          onSelectSection={handleSelectSection}
          onClose={() => setShowSectionDrawer(false)}
          dailyCompletedCount={stats.dailyCompletedIds?.length || 0}
        />
      )}

      {/* Fullscreen Interactive Lesson Modal */}
      {activeLessonState && (
        <LessonModal
          lesson={activeLessonState.lesson}
          unit={activeLessonState.unit}
          hearts={stats.hearts}
          maxHearts={stats.maxHearts}
          hasSuper={stats.hasSuper}
          gems={stats.gems}
          streak={stats.streak}
          onClose={() => setActiveLessonState(null)}
          onCompleteLesson={handleCompleteLesson}
          onDeductHeart={handleDeductHeart}
          onRefillHearts={handleRefillHeartsWithGems}
        />
      )}

      {/* Guidebook Modal */}
      {activeGuidebookUnit && (
        <GuidebookModal
          unit={activeGuidebookUnit}
          onClose={() => setActiveGuidebookUnit(null)}
        />
      )}

      {/* Hearts Recharge Modal */}
      {showHeartsModal && (
        <HeartsModal
          hearts={stats.hearts}
          maxHearts={stats.maxHearts}
          gems={stats.gems}
          hasSuper={stats.hasSuper}
          onClose={() => setShowHeartsModal(false)}
          onRefillWithGems={handleRefillHeartsWithGems}
          onPracticeForHeart={handlePracticeForHeart}
          onOpenSuperModal={() => setShowSuperModal(true)}
        />
      )}

      {/* Super Duolingo Modal */}
      {showSuperModal && (
        <SuperModal
          onClose={() => setShowSuperModal(false)}
          onActivate={handleActivateSuper}
        />
      )}

      {/* Auth Modal (Switch account / Sign in inside app) */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          selectedCourseId={stats.activeCourseId}
          courses={COURSES}
          onClose={() => setAuthModalMode(null)}
          onAuthSuccess={handleAuthSuccess}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}
    </div>
  );
}
