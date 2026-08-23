export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'skipped';
export type Mood = 'exhausted' | 'low' | 'neutral' | 'good' | 'energized';

export interface Milestone {
  id: string;
  title: string;
  phaseId?: string;
  isCompleted: boolean;
  completedAt?: string;
  targetDate?: string;
  category?: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  progressPercentage: number;
  milestones: string[];
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  scheduledTime?: string;
  priority: Priority;
  status: TaskStatus;
  completedAt?: string;
  focusMinutesActual?: number;
  notes?: string;
  goalId?: string;
  phaseId?: string;
}

export interface Goal {
  id: string;
  title: string;
  why: string; // The original emotional reason
  targetDate: string; // YYYY-MM-DD
  commitmentLevel: number; // 1 to 5
  dailyAvailableMinutes: number; // e.g. 300 for 5 hours
  category: string;
  status: 'active' | 'completed' | 'paused' | 'recalibrating';
  createdAt: string;
  startDate: string;
  isPrimary: boolean;
  currentPhaseIndex: number;
  phases: Phase[];
  milestones: Milestone[];
  outcomes?: string[];
  projects?: { id: string; name: string; description: string; progress: number }[];
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  subject?: string;
  plannedMinutes: number;
  actualSeconds: number;
  startedAt: string;
  completedAt?: string;
  interrupted: boolean;
  notes?: string;
  ambientSound?: string;
}

export interface DailyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  primaryObjective: string;
  tasks: Task[];
  totalMinutesPlanned: number;
  totalMinutesCompleted: number;
  status: 'planned' | 'in_progress' | 'completed' | 'drifted';
  checkInMood?: Mood;
  checkInAvailableMinutes?: number;
  eveningReflection?: {
    completed: boolean;
    movedCloserRating: number; // 1-5
    blockerReason?: string;
    notes?: string;
    proudOf?: string;
  };
}

export interface DayActivityLog {
  date: string;
  minutesFocused: number;
  tasksCompleted: number;
  tasksPlanned: number;
  mood?: Mood;
  isConsistent: boolean;
}

export interface ProgressMetrics {
  totalActiveDays: number;
  currentStreak: number;
  bestStreak: number;
  totalFocusMinutes: number;
  totalTasksCompleted: number;
  overallConsistencyRate: number; // 0-100%
  subjectMinutes: Record<string, number>;
  hourlyProductivity: { hour: number; minutes: number }[];
  weeklyLogs: DayActivityLog[];
}

export interface DistractionIntervention {
  id: string;
  triggerTime: string;
  plannedTaskTitle: string;
  plannedTime: string;
  driftReason?: string;
  resolved: boolean;
}

export interface RecoveryPlan {
  id: string;
  reason: string;
  days: {
    dayNumber: number;
    date: string;
    recommendedMinutes: number;
    focusAreas: string[];
    isCompleted: boolean;
  }[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
  contextSnapshot?: {
    currentGoal: string;
    daysRemaining: number;
    todayProgress: string;
  };
}

export interface UserProfile {
  name: string;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  ambientSoundVolume: number;
  notificationsEnabled: boolean;
  realisticPacingMode: boolean;
  morningReminderTime: string;
  eveningReviewTime: string;
  hasCompletedOnboarding: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'morning' | 'focus_reminder' | 'drift' | 'evening' | 'milestone' | 'encouragement';
  isRead: boolean;
  actionText?: string;
  actionType?: string;
}
