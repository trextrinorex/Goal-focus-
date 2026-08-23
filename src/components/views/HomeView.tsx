import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { NorthStarBanner } from '../common/NorthStarBanner';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Plus,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  CalendarCheck,
  Zap,
  BookOpen,
  Target,
  Bot,
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../data/defaultData';

export const HomeView: React.FC = () => {
  const {
    user,
    activeGoal,
    todayPlan,
    startFocusSession,
    completeTask,
    openWhatShouldIDo,
    openRememberWhy,
    openEmergencyReset,
    openMorningCheckIn,
    openEveningReview,
    metrics,
    setActiveTab,
    sendChatMessage,
  } = useNexus();

  const unfinishedTasks = todayPlan.tasks.filter((t) => t.status !== 'completed');
  const completedTasks = todayPlan.tasks.filter((t) => t.status === 'completed');
  const topPriorityTask = unfinishedTasks[0] || todayPlan.tasks[0];

  // Random quote based on active days
  const dailyQuote = MOTIVATIONAL_QUOTES[metrics.totalActiveDays % MOTIVATIONAL_QUOTES.length];

  const quickCoachPrompts = [
    "I wasted the whole day",
    "I don't feel like studying",
    "I have only 2 hours today",
    "I'm scared I won't crack this",
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Greeting & State statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            GOOD MORNING, {user.name.toUpperCase()}
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Your destination hasn't changed.
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={openMorningCheckIn}
            id="btn-home-morning-calibrate"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Morning Check-In</span>
          </button>
          <button
            onClick={openEveningReview}
            id="btn-home-evening-review"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Night Review</span>
          </button>
        </div>
      </div>

      {/* 1. Permanent North Star Banner */}
      <NorthStarBanner />

      {/* 2. Today's Most Important Action Hero Block */}
      {topPriorityTask && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/40 via-neutral-900 to-neutral-950 border border-blue-800/40 shadow-xl text-white relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Today's Primary Focus
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {topPriorityTask.durationMinutes} Minutes Planned
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase font-bold text-blue-400 tracking-wider">
              {topPriorityTask.subject}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {topPriorityTask.title}
            </h3>
            {topPriorityTask.notes && (
              <p className="text-xs sm:text-sm text-neutral-300 italic">
                "{topPriorityTask.notes}"
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
            <div className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Recommended starting window: <strong>Now</strong></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => completeTask(topPriorityTask.id)}
                id="btn-hero-mark-done"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => startFocusSession(topPriorityTask)}
                id="btn-hero-start-focus"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START FOCUS ({topPriorityTask.durationMinutes}m)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Decision Fatigue Reducer Bar: Large "What Should I Do Now?" */}
      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Eliminate Decision Fatigue</h4>
          </div>
          <p className="text-xs text-neutral-400">
            Never wonder what to study next. Let NEXUS evaluate your time, streak, and priorities.
          </p>
        </div>

        <button
          onClick={openWhatShouldIDo}
          id="btn-home-what-next-large"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>WHAT SHOULD I DO NOW?</span>
        </button>
      </div>

      {/* 4. Two Column: Today's Mission & Quick Coach Anchors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                TODAY'S MISSION
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                {completedTasks.length}/{todayPlan.tasks.length} Done
              </span>
            </div>

            <button
              onClick={() => setActiveTab('plan')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayPlan.tasks.map((task, idx) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-neutral-100/50 dark:bg-neutral-900/30 border-neutral-200 dark:border-neutral-800/60 opacity-70'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => completeTask(task.id)}
                      title={isDone ? 'Mark as todo' : 'Mark as done'}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-500'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {task.subject}
                        </span>
                        {task.scheduledTime && (
                          <span className="text-[11px] text-neutral-400">
                            {task.scheduledTime}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-sm font-semibold truncate mt-0.5 ${
                          isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
                      {task.durationMinutes}m
                    </span>
                    {!isDone && (
                      <button
                        onClick={() => startFocusSession(task)}
                        id={`btn-task-start-${task.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-95"
                      >
                        <Play className="w-3 h-3" />
                        <span>START</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: AI Coach & Quick Intervention Pills */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">NEXUS COACH</h4>
                <p className="text-[11px] text-neutral-400">Need help getting started?</p>
              </div>
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 leading-relaxed">
              "{dailyQuote}"
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider">
                Quick Situational Guidance:
              </div>
              <div className="flex flex-col gap-1.5">
                {quickCoachPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => {
                      sendChatMessage(promptText);
                      setActiveTab('coach');
                    }}
                    className="text-left text-xs font-medium py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    "{promptText}" →
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('coach')}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              Open Full Coach Conversation
            </button>
          </div>

          {/* Emergency Safety Box */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 text-rose-900 dark:text-rose-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Feeling Behind or Distracted?
            </div>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
              Never give up after a slow day. NEXUS provides zero-shame 15-minute micro-resets.
            </p>
            <button
              onClick={openEmergencyReset}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Activate Emergency Reset →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
