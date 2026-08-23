import { Goal, DailyPlan, ProgressMetrics, UserProfile, Milestone, Phase, AppNotification } from '../types/nexus';

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Started Journey & Established North Star', isCompleted: true, completedAt: '2026-08-06', category: 'Foundation' },
  { id: 'm2', title: 'Completed First 10 Hours of Deep Focus', isCompleted: true, completedAt: '2026-08-09', category: 'Momentum' },
  { id: 'm3', title: '7 Consistent Study Days Streak', isCompleted: true, completedAt: '2026-08-13', category: 'Consistency' },
  { id: 'm4', title: 'Finished Human Physiology Biology Core', isCompleted: true, completedAt: '2026-08-18', category: 'Academics' },
  { id: 'm5', title: 'First Full Chapter Diagnostic Test (80%+)', isCompleted: false, targetDate: '2026-09-10', category: 'Academics' },
  { id: 'm6', title: '50 Total Focus Sessions Logged', isCompleted: false, targetDate: '2026-09-30', category: 'Momentum' },
  { id: 'm7', title: 'Phase 1: Foundation Completed', isCompleted: false, targetDate: '2026-10-31', category: 'Phase' },
  { id: 'm8', title: 'First Full-Length NEET Mock Test', isCompleted: false, targetDate: '2027-01-15', category: 'Mock' },
  { id: 'm9', title: 'Syllabus Completion & Weakness Elimination', isCompleted: false, targetDate: '2027-03-20', category: 'Revision' },
  { id: 'm10', title: '🎯 Crack NEET 2027 with Top Rank', isCompleted: false, targetDate: '2027-05-02', category: 'Achievement' },
];

export const INITIAL_PHASES: Phase[] = [
  {
    id: 'p1',
    name: 'Foundation & Core Concepts',
    description: 'Master NCERT basics across Biology, Organic/Inorganic Chemistry & Fundamental Physics mechanics.',
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    status: 'in_progress',
    progressPercentage: 42,
    milestones: ['m1', 'm2', 'm3', 'm4', 'm5', 'm7'],
  },
  {
    id: 'p2',
    name: 'Syllabus Completion & Depth',
    description: 'Comprehensive coverage of entire 11th & 12th standard high-yield chapters with concept notes.',
    startDate: '2026-11-01',
    endDate: '2027-01-31',
    status: 'upcoming',
    progressPercentage: 0,
    milestones: ['m6'],
  },
  {
    id: 'p3',
    name: 'High-Yield Question Practice & Drills',
    description: 'Solve past 15 years NEET questions, timed chapter drills, and speed optimization.',
    startDate: '2027-02-01',
    endDate: '2027-03-15',
    status: 'upcoming',
    progressPercentage: 0,
    milestones: ['m8'],
  },
  {
    id: 'p4',
    name: 'Full Mock Tests & Weakness Elimination',
    description: 'Simulate full exam environments, identify negative marking patterns, and fine-tune time management.',
    startDate: '2027-03-16',
    endDate: '2027-04-15',
    status: 'upcoming',
    progressPercentage: 0,
    milestones: ['m9'],
  },
  {
    id: 'p5',
    name: 'Final Revision & Peak State',
    description: 'Formula sheets, high-frequency diagrams, flashcards review, and calm mental readiness.',
    startDate: '2027-04-16',
    endDate: '2027-05-02',
    status: 'upcoming',
    progressPercentage: 0,
    milestones: ['m10'],
  },
];

export const DEFAULT_GOAL: Goal = {
  id: 'goal-neet-2027',
  title: 'Crack NEET 2027',
  why: 'I want to become a doctor and build a better future for myself. I want to save lives, make my family proud, and prove to myself that my daily dedication can transform my destiny.',
  targetDate: '2027-05-02',
  commitmentLevel: 5,
  dailyAvailableMinutes: 300, // 5 hours
  category: 'Academics & Medicine',
  status: 'active',
  createdAt: '2026-08-06',
  startDate: '2026-08-06',
  isPrimary: true,
  currentPhaseIndex: 0,
  phases: INITIAL_PHASES,
  milestones: INITIAL_MILESTONES,
  outcomes: [
    'Score 680+ in NEET 2027',
    'Secure admission into a premier Government Medical College',
    'Build unstoppable daily discipline and mental resilience'
  ],
  projects: [
    { id: 'proj-bio', name: 'Biology NCERT Mastery', description: 'Botany & Zoology in-depth conceptual recall', progress: 55 },
    { id: 'proj-chem', name: 'Chemistry Equilibrium & Bonding', description: 'Physical, Inorganic & Organic practice', progress: 40 },
    { id: 'proj-phys', name: 'Physics Mechanics & Electrodynamics', description: 'Formula derivation and problem drills', progress: 35 },
  ]
};

export const DEFAULT_USER: UserProfile = {
  name: 'Mohit',
  theme: 'dark',
  soundEnabled: true,
  ambientSoundVolume: 0.4,
  notificationsEnabled: true,
  realisticPacingMode: true,
  morningReminderTime: '06:30',
  eveningReviewTime: '21:30',
  hasCompletedOnboarding: true,
};

export const getTodayDateString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const DEFAULT_TODAY_PLAN: DailyPlan = {
  id: `plan-${getTodayDateString()}`,
  date: getTodayDateString(),
  primaryObjective: 'Complete 3 high-yield study blocks across Biology, Chemistry, and Physics.',
  status: 'in_progress',
  totalMinutesPlanned: 200,
  totalMinutesCompleted: 45,
  tasks: [
    {
      id: 'task-1',
      title: 'Human Physiology — Neural Control & Reflexes',
      subject: 'Biology',
      durationMinutes: 45,
      scheduledTime: '09:00',
      priority: 'high',
      status: 'completed',
      completedAt: '09:48',
      focusMinutesActual: 48,
      notes: 'Reviewed action potential graphs and synaptic transmission.'
    },
    {
      id: 'task-2',
      title: 'Chemical Bonding — Hybridization & VSEPR Theory',
      subject: 'Chemistry',
      durationMinutes: 50,
      scheduledTime: '11:00',
      priority: 'high',
      status: 'todo',
      notes: 'Solve 20 molecular geometry questions.'
    },
    {
      id: 'task-3',
      title: 'Current Electricity — Kirchhoff’s Laws & Potentiometer',
      subject: 'Physics',
      durationMinutes: 60,
      scheduledTime: '15:00',
      priority: 'high',
      status: 'todo',
      notes: 'Derive balance condition for meter bridge.'
    },
    {
      id: 'task-4',
      title: 'Active Recall & High-Yield NCERT Tables',
      subject: 'Revision',
      durationMinutes: 30,
      scheduledTime: '18:30',
      priority: 'medium',
      status: 'todo'
    },
    {
      id: 'task-5',
      title: 'Daily Review & Next Step Calibration',
      subject: 'Review',
      durationMinutes: 15,
      scheduledTime: '21:00',
      priority: 'low',
      status: 'todo'
    }
  ],
  checkInMood: 'good',
  checkInAvailableMinutes: 300,
};

export const DEFAULT_METRICS: ProgressMetrics = {
  totalActiveDays: 17,
  currentStreak: 12,
  bestStreak: 12,
  totalFocusMinutes: 4280, // ~71.3 hours
  totalTasksCompleted: 48,
  overallConsistencyRate: 88,
  subjectMinutes: {
    'Biology': 1950,
    'Chemistry': 1240,
    'Physics': 940,
    'Revision': 150,
  },
  hourlyProductivity: [
    { hour: 6, minutes: 120 },
    { hour: 7, minutes: 180 },
    { hour: 8, minutes: 140 },
    { hour: 9, minutes: 160 },
    { hour: 10, minutes: 110 },
    { hour: 11, minutes: 90 },
    { hour: 14, minutes: 70 },
    { hour: 15, minutes: 100 },
    { hour: 16, minutes: 120 },
    { hour: 19, minutes: 130 },
    { hour: 20, minutes: 150 },
    { hour: 21, minutes: 80 },
  ],
  weeklyLogs: [
    { date: '2026-08-17', minutesFocused: 270, tasksCompleted: 4, tasksPlanned: 4, mood: 'energized', isConsistent: true },
    { date: '2026-08-18', minutesFocused: 290, tasksCompleted: 5, tasksPlanned: 5, mood: 'good', isConsistent: true },
    { date: '2026-08-19', minutesFocused: 240, tasksCompleted: 3, tasksPlanned: 4, mood: 'neutral', isConsistent: true },
    { date: '2026-08-20', minutesFocused: 180, tasksCompleted: 2, tasksPlanned: 3, mood: 'low', isConsistent: true },
    { date: '2026-08-21', minutesFocused: 310, tasksCompleted: 5, tasksPlanned: 5, mood: 'energized', isConsistent: true },
    { date: '2026-08-22', minutesFocused: 280, tasksCompleted: 4, tasksPlanned: 4, mood: 'good', isConsistent: true },
    { date: '2026-08-23', minutesFocused: 48, tasksCompleted: 1, tasksPlanned: 5, mood: 'good', isConsistent: true },
  ]
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Your goal is still waiting for you',
    message: 'Day 17 of your journey to Crack NEET 2027. Your destination hasn\'t changed.',
    timestamp: '06:45 AM',
    type: 'morning',
    isRead: false,
    actionText: 'View Today\'s Mission',
    actionType: 'NAVIGATE_DASHBOARD'
  },
  {
    id: 'n2',
    title: 'Milestone Completed: Human Physiology Core',
    message: 'You logged over 15 hours on Human Physiology this week. Solid foundation built.',
    timestamp: 'Yesterday',
    type: 'milestone',
    isRead: true
  }
];

export const MOTIVATIONAL_QUOTES = [
  "Every focused session is a vote for your future.",
  "You don't need to feel motivated. You only need to take the next step.",
  "Your future is built from ordinary decisions like the one you make in the next 10 minutes.",
  "Consistency beats intensity every single time.",
  "Your goal hasn't changed. Return to the path without guilt.",
  "Small daily actions compound into life-changing achievements.",
  "When you are overwhelmed, forget everything else and win the next 15 minutes."
];
