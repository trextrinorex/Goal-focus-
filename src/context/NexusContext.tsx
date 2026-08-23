import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Goal,
  DailyPlan,
  ProgressMetrics,
  UserProfile,
  Task,
  Milestone,
  Phase,
  FocusSession,
  AppNotification,
  ChatMessage,
  Mood,
} from '../types/nexus';
import {
  DEFAULT_GOAL,
  DEFAULT_USER,
  DEFAULT_TODAY_PLAN,
  DEFAULT_METRICS,
  INITIAL_NOTIFICATIONS,
  getTodayDateString,
} from '../data/defaultData';
import { audioEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface NexusContextType {
  // Goal
  goals: Goal[];
  activeGoal: Goal;
  currentPhase?: Phase;
  daysRemaining: number;
  journeyProgressPercent: number;
  setActiveGoalId: (id: string) => void;
  updateActiveGoal: (updated: Partial<Goal>) => void;
  createNewGoal: (goalData: Partial<Goal>) => Promise<void>;
  toggleMilestone: (milestoneId: string) => void;
  addMilestone: (titleOrObj: string | { title: string; category?: string; targetDate?: string }, category?: string, targetDate?: string) => void;
  deleteMilestone: (milestoneId: string) => void;

  // Daily Plan & Tasks
  todayPlan: DailyPlan;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  generateNewDailyPlan: (tasks?: Task[], primaryObjective?: string) => void;

  // Focus Mode
  activeFocusSession: FocusSession | null;
  focusSecondsRemaining: number;
  isFocusTimerRunning: boolean;
  activeSoundscape: 'rain' | 'whitenoise' | 'binaural' | 'drone' | 'silence';
  startFocusSession: (task?: Task | { title: string; subject?: string; durationMinutes: number }) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  completeFocusSession: () => void;
  cancelFocusSession: () => void;
  setSoundscape: (type: 'rain' | 'whitenoise' | 'binaural' | 'drone' | 'silence') => void;

  // Modals & Interventions
  isRememberWhyOpen: boolean;
  openRememberWhy: () => void;
  closeRememberWhy: () => void;

  isWhatShouldIDoOpen: boolean;
  openWhatShouldIDo: () => void;
  closeWhatShouldIDo: () => void;

  isEmergencyResetOpen: boolean;
  openEmergencyReset: () => void;
  closeEmergencyReset: () => void;

  isDriftAlertOpen: boolean;
  openDriftAlert: (plannedTime?: string, taskTitle?: string) => void;
  closeDriftAlert: () => void;

  isMorningCheckInOpen: boolean;
  openMorningCheckIn: () => void;
  closeMorningCheckIn: () => void;
  submitMorningCheckIn: (mood: Mood, timeAvailableMinutes: number) => void;

  isEveningReviewOpen: boolean;
  openEveningReview: () => void;
  closeEveningReview: () => void;
  submitEveningReview: (movedCloserRating: number, blockerReason?: string, proudOf?: string) => void;

  isGoalEditorOpen: boolean;
  openGoalEditor: () => void;
  closeGoalEditor: () => void;

  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  completeOnboarding: (newGoal: Partial<Goal>) => Promise<void>;

  // Progress & Metrics
  metrics: ProgressMetrics;
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // AI & Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;

  // Navigation
  activeTab: 'home' | 'goal' | 'plan' | 'focus' | 'progress' | 'journey' | 'coach' | 'milestones' | 'settings';
  setActiveTab: (tab: 'home' | 'goal' | 'plan' | 'focus' | 'progress' | 'journey' | 'coach' | 'milestones' | 'settings') => void;

  // Quick Action
  triggerConfetti: () => void;
  resetAllDataToDemo: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEYS = {
  GOALS: 'nexus_goals_v1',
  ACTIVE_GOAL_ID: 'nexus_active_goal_id_v1',
  TODAY_PLAN: 'nexus_today_plan_v1',
  METRICS: 'nexus_metrics_v1',
  USER: 'nexus_user_v1',
  CHAT: 'nexus_chat_v1',
  NOTIFICATIONS: 'nexus_notifications_v1',
};

const NexusContext = createContext<NexusContextType | null>(null);

export const NexusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or default
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : [DEFAULT_GOAL];
    } catch {
      return [DEFAULT_GOAL];
    }
  });

  const [activeGoalId, setActiveGoalIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_GOAL_ID) || DEFAULT_GOAL.id;
    } catch {
      return DEFAULT_GOAL.id;
    }
  });

  const [todayPlan, setTodayPlan] = useState<DailyPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODAY_PLAN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === getTodayDateString()) {
          return parsed;
        }
      }
      return DEFAULT_TODAY_PLAN;
    } catch {
      return DEFAULT_TODAY_PLAN;
    }
  });

  const [metrics, setMetrics] = useState<ProgressMetrics>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
      return saved ? JSON.parse(saved) : DEFAULT_METRICS;
    } catch {
      return DEFAULT_METRICS;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      return saved ? JSON.parse(saved) : [
        {
          id: 'welcome-msg',
          role: 'assistant',
          content: `Good to see you. I am **NEXUS Coach**.\n\nYour North Star is **${DEFAULT_GOAL.title}**. Every daily plan, focus session, and recovery adjustment we make together will keep you anchored to your core reason: *"${DEFAULT_GOAL.why}"*.\n\nHow can I help you right now?`,
          timestamp: 'Just now',
          suggestedActions: [
            { label: 'What should I do now?', actionType: 'WHAT_NEXT' },
            { label: "I don't feel like studying", actionType: 'PROMPT' },
            { label: "I'm falling behind", actionType: 'PROMPT' },
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'home' | 'goal' | 'plan' | 'focus' | 'progress' | 'journey' | 'coach' | 'milestones' | 'settings'>('home');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Focus Timer
  const [activeFocusSession, setActiveFocusSession] = useState<FocusSession | null>(null);
  const [focusSecondsRemaining, setFocusSecondsRemaining] = useState<number>(0);
  const [isFocusTimerRunning, setIsFocusTimerRunning] = useState<boolean>(false);
  const [activeSoundscape, setActiveSoundscape] = useState<'rain' | 'whitenoise' | 'binaural' | 'drone' | 'silence'>('binaural');

  // Interventions & Modals
  const [isRememberWhyOpen, setIsRememberWhyOpen] = useState(false);
  const [isWhatShouldIDoOpen, setIsWhatShouldIDoOpen] = useState(false);
  const [isEmergencyResetOpen, setIsEmergencyResetOpen] = useState(false);
  const [isDriftAlertOpen, setIsDriftAlertOpen] = useState(false);
  const [isMorningCheckInOpen, setIsMorningCheckInOpen] = useState(false);
  const [isEveningReviewOpen, setIsEveningReviewOpen] = useState(false);
  const [isGoalEditorOpen, setIsGoalEditorOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!user.hasCompletedOnboarding);

  // Active Goal derivation
  const activeGoal = goals.find((g) => g.id === activeGoalId) || goals[0] || DEFAULT_GOAL;

  // Current Phase
  const currentPhase = React.useMemo(() => {
    if (!activeGoal.phases || activeGoal.phases.length === 0) return undefined;
    return activeGoal.phases[activeGoal.currentPhaseIndex] || activeGoal.phases[0];
  }, [activeGoal.phases, activeGoal.currentPhaseIndex]);

  // Days remaining calculation
  const calculateDaysRemaining = useCallback(() => {
    if (!activeGoal?.targetDate) return 284;
    const target = new Date(activeGoal.targetDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }, [activeGoal?.targetDate]);

  const daysRemaining = calculateDaysRemaining();

  // Journey progress percentage based on completed milestones & phases
  const journeyProgressPercent = React.useMemo(() => {
    if (!activeGoal?.milestones?.length) return 40;
    const total = activeGoal.milestones.length;
    const completed = activeGoal.milestones.filter(m => m.isCompleted).length;
    return Math.round((completed / total) * 100);
  }, [activeGoal?.milestones]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GOAL_ID, activeGoalId);
      localStorage.setItem(STORAGE_KEYS.TODAY_PLAN, JSON.stringify(todayPlan));
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [goals, activeGoalId, todayPlan, metrics, user, chatMessages, notifications]);

  // Handle dark / light theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (user.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user.theme]);

  // Confetti helper
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      });
      if (user.soundEnabled) {
        audioEngine.playChime(true);
      }
    } catch (e) {
      // ignore
    }
  }, [user.soundEnabled]);

  // Focus Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isFocusTimerRunning && focusSecondsRemaining > 0) {
      interval = setInterval(() => {
        setFocusSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsFocusTimerRunning(false);
            completeFocusSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusTimerRunning, focusSecondsRemaining]);

  // Focus Timer actions
  const startFocusSession = useCallback((task?: Task | { title: string; subject?: string; durationMinutes: number }) => {
    const duration = task?.durationMinutes || 45;
    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      taskId: (task as Task)?.id,
      taskTitle: task?.title || 'Deep Focus Block',
      subject: task?.subject || 'General Study',
      plannedMinutes: duration,
      actualSeconds: 0,
      startedAt: new Date().toLocaleTimeString(),
      interrupted: false,
      ambientSound: activeSoundscape,
    };

    setActiveFocusSession(newSession);
    setFocusSecondsRemaining(duration * 60);
    setIsFocusTimerRunning(true);
    setActiveTab('focus');

    if (user.soundEnabled && activeSoundscape !== 'silence') {
      audioEngine.playAmbient(activeSoundscape, user.ambientSoundVolume);
    }
  }, [activeSoundscape, user.ambientSoundVolume, user.soundEnabled]);

  const pauseFocusSession = useCallback(() => {
    setIsFocusTimerRunning(false);
    audioEngine.stopAmbient();
  }, []);

  const resumeFocusSession = useCallback(() => {
    setIsFocusTimerRunning(true);
    if (user.soundEnabled && activeSoundscape !== 'silence') {
      audioEngine.playAmbient(activeSoundscape, user.ambientSoundVolume);
    }
  }, [activeSoundscape, user.ambientSoundVolume, user.soundEnabled]);

  const completeFocusSession = useCallback(() => {
    if (!activeFocusSession) return;
    audioEngine.stopAmbient();
    triggerConfetti();

    const elapsedSeconds = (activeFocusSession.plannedMinutes * 60) - focusSecondsRemaining;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    // Update today's plan
    if (activeFocusSession.taskId) {
      setTodayPlan((prev) => {
        const updatedTasks = prev.tasks.map((t) => {
          if (t.id === activeFocusSession.taskId) {
            return {
              ...t,
              status: 'completed' as const,
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              focusMinutesActual: (t.focusMinutesActual || 0) + elapsedMinutes,
            };
          }
          return t;
        });
        const totalCompleted = updatedTasks
          .filter((t) => t.status === 'completed')
          .reduce((acc, t) => acc + (t.durationMinutes || 0), 0);

        return {
          ...prev,
          tasks: updatedTasks,
          totalMinutesCompleted: totalCompleted,
        };
      });
    } else {
      setTodayPlan((prev) => ({
        ...prev,
        totalMinutesCompleted: prev.totalMinutesCompleted + elapsedMinutes,
      }));
    }

    // Update metrics
    setMetrics((prev) => {
      const subject = activeFocusSession.subject || 'Core';
      const updatedSubjectMin = { ...prev.subjectMinutes };
      updatedSubjectMin[subject] = (updatedSubjectMin[subject] || 0) + elapsedMinutes;

      return {
        ...prev,
        totalFocusMinutes: prev.totalFocusMinutes + elapsedMinutes,
        totalTasksCompleted: prev.totalTasksCompleted + (activeFocusSession.taskId ? 1 : 0),
        subjectMinutes: updatedSubjectMin,
      };
    });

    // Add milestone check
    addNotification({
      title: 'Focus Session Completed!',
      message: `You invested ${elapsedMinutes} focused minutes in "${activeFocusSession.taskTitle}". Another vote cast for your goal!`,
      type: 'encouragement',
    });

    setActiveFocusSession(null);
    setFocusSecondsRemaining(0);
    setIsFocusTimerRunning(false);
  }, [activeFocusSession, focusSecondsRemaining, triggerConfetti]);

  const cancelFocusSession = useCallback(() => {
    audioEngine.stopAmbient();
    setActiveFocusSession(null);
    setFocusSecondsRemaining(0);
    setIsFocusTimerRunning(false);
  }, []);

  const setSoundscape = useCallback((type: 'rain' | 'whitenoise' | 'binaural' | 'drone' | 'silence') => {
    setActiveSoundscape(type);
    if (isFocusTimerRunning && user.soundEnabled) {
      if (type === 'silence') {
        audioEngine.stopAmbient();
      } else {
        audioEngine.playAmbient(type, user.ambientSoundVolume);
      }
    }
  }, [isFocusTimerRunning, user.ambientSoundVolume, user.soundEnabled]);

  // Goal & Milestones
  const setActiveGoalId = useCallback((id: string) => {
    setActiveGoalIdState(id);
  }, []);

  const updateActiveGoal = useCallback((updated: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === activeGoal.id ? { ...g, ...updated } : g))
    );
  }, [activeGoal.id]);

  const createNewGoal = useCallback(async (goalData: Partial<Goal>) => {
    const newId = `goal-${Date.now()}`;
    const newGoal: Goal = {
      ...DEFAULT_GOAL,
      id: newId,
      title: goalData.title || 'My Major Goal',
      why: goalData.why || 'To change my trajectory and fulfill my purpose.',
      targetDate: goalData.targetDate || '2027-05-02',
      commitmentLevel: goalData.commitmentLevel || 5,
      dailyAvailableMinutes: goalData.dailyAvailableMinutes || 300,
      createdAt: getTodayDateString(),
      startDate: getTodayDateString(),
      status: 'active',
      isPrimary: true,
      phases: goalData.phases || DEFAULT_GOAL.phases,
      milestones: goalData.milestones || DEFAULT_GOAL.milestones,
      outcomes: goalData.outcomes || DEFAULT_GOAL.outcomes,
    };

    setGoals((prev) => [newGoal, ...prev.map((g) => ({ ...g, isPrimary: false }))]);
    setActiveGoalIdState(newId);

    // Add notification
    addNotification({
      title: 'North Star Established',
      message: `Your journey towards "${newGoal.title}" has officially begun. Let's make every day count.`,
      type: 'morning',
    });
  }, []);

  const toggleMilestone = useCallback((milestoneId: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        if (g.id !== activeGoal.id) return g;
        const updatedMilestones = g.milestones.map((m) => {
          if (m.id === milestoneId) {
            const nextVal = !m.isCompleted;
            if (nextVal) triggerConfetti();
            return {
              ...m,
              isCompleted: nextVal,
              completedAt: nextVal ? getTodayDateString() : undefined,
            };
          }
          return m;
        });
        return { ...g, milestones: updatedMilestones };
      })
    );
  }, [activeGoal.id, triggerConfetti]);

  const addMilestone = useCallback((titleOrObj: string | { title: string; category?: string; targetDate?: string }, categoryParam?: string, targetDateParam?: string) => {
    let title = '';
    let category = categoryParam || 'Momentum';
    let targetDate = targetDateParam;

    if (typeof titleOrObj === 'object' && titleOrObj !== null) {
      title = titleOrObj.title;
      if (titleOrObj.category) category = titleOrObj.category;
      if (titleOrObj.targetDate) targetDate = titleOrObj.targetDate;
    } else if (typeof titleOrObj === 'string') {
      title = titleOrObj;
    }

    if (!title || !title.trim()) return;

    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      category,
      targetDate,
      isCompleted: false,
    };
    setGoals((prev) =>
      prev.map((g) => (g.id === activeGoal.id ? { ...g, milestones: [...(g.milestones || []), newMilestone] } : g))
    );
  }, [activeGoal.id]);

  const deleteMilestone = useCallback((milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === activeGoal.id ? { ...g, milestones: (g.milestones || []).filter((m) => m.id !== milestoneId) } : g))
    );
  }, [activeGoal.id]);

  // Tasks & Daily Plan
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'todo',
    };
    setTodayPlan((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      totalMinutesPlanned: prev.totalMinutesPlanned + taskData.durationMinutes,
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTodayPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    triggerConfetti();
    setTodayPlan((prev) => {
      const updatedTasks = prev.tasks.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === 'completed';
          return {
            ...t,
            status: (isDone ? 'todo' : 'completed') as 'todo' | 'completed' | 'in_progress' | 'skipped',
            completedAt: isDone ? undefined : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return t;
      });

      const totalCompleted = updatedTasks
        .filter((t) => t.status === 'completed')
        .reduce((acc, t) => acc + (t.durationMinutes || 0), 0);

      return {
        ...prev,
        tasks: updatedTasks,
        totalMinutesCompleted: totalCompleted,
      };
    });

    setMetrics((prev) => ({
      ...prev,
      totalTasksCompleted: prev.totalTasksCompleted + 1,
    }));
  }, [triggerConfetti]);

  const deleteTask = useCallback((taskId: string) => {
    setTodayPlan((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      const remainingTasks = prev.tasks.filter((t) => t.id !== taskId);
      return {
        ...prev,
        tasks: remainingTasks,
        totalMinutesPlanned: Math.max(0, prev.totalMinutesPlanned - (task?.durationMinutes || 0)),
      };
    });
  }, []);

  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTodayPlan((prev) => ({ ...prev, tasks: newTasks }));
  }, []);

  const generateNewDailyPlan = useCallback((tasks?: Task[], primaryObjective?: string) => {
    const planTasks = tasks || DEFAULT_TODAY_PLAN.tasks;
    const totalPlanned = planTasks.reduce((acc, t) => acc + t.durationMinutes, 0);
    setTodayPlan({
      id: `plan-${getTodayDateString()}`,
      date: getTodayDateString(),
      primaryObjective: primaryObjective || `Focus on high-leverage execution for ${activeGoal.title}`,
      tasks: planTasks,
      totalMinutesPlanned: totalPlanned,
      totalMinutesCompleted: 0,
      status: 'in_progress',
    });
  }, [activeGoal.title]);

  // Check-ins & Reflections
  const submitMorningCheckIn = useCallback((mood: Mood, timeAvailableMinutes: number) => {
    setTodayPlan((prev) => ({
      ...prev,
      checkInMood: mood,
      checkInAvailableMinutes: timeAvailableMinutes,
    }));
    setIsMorningCheckInOpen(false);

    // AI Coach auto-acknowledges
    const moodGreeting = mood === 'exhausted' || mood === 'low'
      ? "I noticed your energy is low today. That's fine—we'll keep friction minimal and focus on gentle, high-impact micro-steps."
      : mood === 'energized'
      ? "You're feeling energized! Let's channel this into today's hardest concept right away."
      : "You're set for today. Remember: focus on one task at a time.";

    addNotification({
      title: 'Daily Calibration Complete',
      message: `${moodGreeting} Total planned window: ${Math.round(timeAvailableMinutes / 60)}h.`,
      type: 'morning',
    });
  }, []);

  const submitEveningReview = useCallback((movedCloserRating: number, blockerReason?: string, proudOf?: string) => {
    setTodayPlan((prev) => ({
      ...prev,
      eveningReflection: {
        completed: true,
        movedCloserRating,
        blockerReason,
        proudOf,
      },
    }));
    setIsEveningReviewOpen(false);
    triggerConfetti();

    addNotification({
      title: 'Day Reviewed & Logged',
      message: `Progress saved. You gave today a ${movedCloserRating}/5 alignment score. Rest well and recharge for tomorrow.`,
      type: 'evening',
    });
  }, [triggerConfetti]);

  // AI Chat
  const sendChatMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: chatMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          context: {
            goalTitle: activeGoal.title,
            goalWhy: activeGoal.why,
            targetDate: activeGoal.targetDate,
            daysRemaining,
            currentPhase: activeGoal.phases[activeGoal.currentPhaseIndex]?.name || 'Foundation',
            dailyAvailableHours: Math.round(activeGoal.dailyAvailableMinutes / 60),
            todayTasks: todayPlan.tasks.map((t) => ({
              title: t.title,
              subject: t.subject,
              status: t.status,
              durationMinutes: t.durationMinutes,
            })),
            completedMinutesToday: todayPlan.totalMinutesCompleted,
            currentStreak: metrics.currentStreak,
            recentMood: todayPlan.checkInMood,
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm right here with you. What is the single next step we can take together?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Start 25 min focus', actionType: 'START_QUICK_FOCUS' },
          { label: 'Recalculate plan', actionType: 'RECALCULATE' },
          { label: 'Remember Why', actionType: 'REMEMBER_WHY' },
        ],
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      const fallbackMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `You don't need motivation right now. You only need to take the next step towards **${activeGoal.title}**.\n\nLet's start with just 15 minutes of uninterrupted focus.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  }, [activeGoal, daysRemaining, todayPlan, metrics.currentStreak, chatMessages]);

  const clearChat = useCallback(() => {
    setChatMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. I am **NEXUS Coach**, here to guide your journey to **${activeGoal.title}**. What's on your mind?`,
        timestamp: 'Just now',
      },
    ]);
  }, [activeGoal.title]);

  // Notifications
  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: AppNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(async (newGoalData: Partial<Goal>) => {
    setIsOnboardingOpen(false);
    setUser((prev) => ({ ...prev, hasCompletedOnboarding: true }));

    // Try AI generation for full multi-phase plan
    try {
      const response = await fetch('/api/coach/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newGoalData.title,
          why: newGoalData.why,
          targetDate: newGoalData.targetDate,
          dailyHours: Math.round((newGoalData.dailyAvailableMinutes || 300) / 60),
          commitmentLevel: newGoalData.commitmentLevel || 5,
        }),
      });
      const aiPlan = await response.json();

      const createdGoal: Goal = {
        ...DEFAULT_GOAL,
        id: `goal-${Date.now()}`,
        title: newGoalData.title || 'My Primary Goal',
        why: newGoalData.why || 'To transform my life.',
        targetDate: newGoalData.targetDate || '2027-05-02',
        commitmentLevel: newGoalData.commitmentLevel || 5,
        dailyAvailableMinutes: newGoalData.dailyAvailableMinutes || 300,
        createdAt: getTodayDateString(),
        startDate: getTodayDateString(),
        isPrimary: true,
        outcomes: aiPlan.outcomes || DEFAULT_GOAL.outcomes,
        phases: (aiPlan.phases || DEFAULT_GOAL.phases).map((p: any, idx: number) => ({
          id: `p-${idx + 1}`,
          name: p.name,
          description: p.description,
          startDate: getTodayDateString(),
          endDate: newGoalData.targetDate || '2027-05-02',
          status: idx === 0 ? 'in_progress' : 'upcoming',
          progressPercentage: idx === 0 ? 10 : 0,
          milestones: [],
        })),
        milestones: (aiPlan.milestones || DEFAULT_GOAL.milestones).map((m: any, idx: number) => ({
          id: `m-${idx + 1}`,
          title: m.title,
          category: m.category || 'General',
          isCompleted: idx === 0,
          completedAt: idx === 0 ? getTodayDateString() : undefined,
        })),
      };

      setGoals([createdGoal]);
      setActiveGoalIdState(createdGoal.id);

      // Create initial day plan
      if (aiPlan.day1Tasks?.length) {
        const day1Tasks: Task[] = aiPlan.day1Tasks.map((t: any, idx: number) => ({
          id: `task-d1-${idx}`,
          title: t.title,
          subject: t.subject,
          durationMinutes: t.durationMinutes,
          priority: t.priority || 'high',
          status: 'todo',
        }));
        generateNewDailyPlan(day1Tasks, `Day 1 Foundation for ${createdGoal.title}`);
      }
    } catch (e) {
      await createNewGoal(newGoalData);
    }
    triggerConfetti();
  }, [createNewGoal, generateNewDailyPlan, triggerConfetti]);

  // Data import / export
  const exportDataJSON = useCallback(() => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      goals,
      activeGoalId,
      todayPlan,
      metrics,
      user,
      notifications,
    };
    return JSON.stringify(backup, null, 2);
  }, [goals, activeGoalId, todayPlan, metrics, user, notifications]);

  const importDataJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.goals && Array.isArray(parsed.goals)) {
        setGoals(parsed.goals);
        if (parsed.activeGoalId) setActiveGoalIdState(parsed.activeGoalId);
        if (parsed.todayPlan) setTodayPlan(parsed.todayPlan);
        if (parsed.metrics) setMetrics(parsed.metrics);
        if (parsed.user) setUser(parsed.user);
        triggerConfetti();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }, [triggerConfetti]);

  const resetAllDataToDemo = useCallback(() => {
    localStorage.clear();
    setGoals([DEFAULT_GOAL]);
    setActiveGoalIdState(DEFAULT_GOAL.id);
    setTodayPlan(DEFAULT_TODAY_PLAN);
    setMetrics(DEFAULT_METRICS);
    setUser(DEFAULT_USER);
    setNotifications(INITIAL_NOTIFICATIONS);
    triggerConfetti();
  }, [triggerConfetti]);

  return (
    <NexusContext.Provider
      value={{
        goals,
        activeGoal,
        currentPhase,
        daysRemaining,
        journeyProgressPercent,
        setActiveGoalId,
        updateActiveGoal,
        createNewGoal,
        toggleMilestone,
        addMilestone,
        deleteMilestone,

        todayPlan,
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        reorderTasks,
        generateNewDailyPlan,

        activeFocusSession,
        focusSecondsRemaining,
        isFocusTimerRunning,
        activeSoundscape,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        completeFocusSession,
        cancelFocusSession,
        setSoundscape,

        isRememberWhyOpen,
        openRememberWhy: () => setIsRememberWhyOpen(true),
        closeRememberWhy: () => setIsRememberWhyOpen(false),

        isWhatShouldIDoOpen,
        openWhatShouldIDo: () => setIsWhatShouldIDoOpen(true),
        closeWhatShouldIDo: () => setIsWhatShouldIDoOpen(false),

        isEmergencyResetOpen,
        openEmergencyReset: () => setIsEmergencyResetOpen(true),
        closeEmergencyReset: () => setIsEmergencyResetOpen(false),

        isDriftAlertOpen,
        openDriftAlert: () => setIsDriftAlertOpen(true),
        closeDriftAlert: () => setIsDriftAlertOpen(false),

        isMorningCheckInOpen,
        openMorningCheckIn: () => setIsMorningCheckInOpen(true),
        closeMorningCheckIn: () => setIsMorningCheckInOpen(false),
        submitMorningCheckIn,

        isEveningReviewOpen,
        openEveningReview: () => setIsEveningReviewOpen(true),
        closeEveningReview: () => setIsEveningReviewOpen(false),
        submitEveningReview,

        isGoalEditorOpen,
        openGoalEditor: () => setIsGoalEditorOpen(true),
        closeGoalEditor: () => setIsGoalEditorOpen(false),

        isOnboardingOpen,
        openOnboarding: () => setIsOnboardingOpen(true),
        closeOnboarding: () => setIsOnboardingOpen(false),
        completeOnboarding,

        metrics,
        user,
        updateUserProfile,

        chatMessages,
        isChatLoading,
        sendChatMessage,
        clearChat,

        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        addNotification,

        activeTab,
        setActiveTab,

        triggerConfetti,
        resetAllDataToDemo,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
