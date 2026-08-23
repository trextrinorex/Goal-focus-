import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Play,
  Pause,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Radio,
  Disc,
  Flame,
  Maximize2,
  Compass,
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../../data/defaultData';

export const FocusView: React.FC = () => {
  const {
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
    activeGoal,
    todayPlan,
    user,
    updateUserProfile,
  } = useNexus();

  const [quoteIndex, setQuoteIndex] = useState(0);

  // If no active session, provide quick starter selector
  const defaultTask = todayPlan.tasks.find((t) => t.status !== 'completed') || todayPlan.tasks[0];

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalPlannedSeconds = (activeFocusSession?.plannedMinutes || 45) * 60;
  const progressRatio = totalPlannedSeconds > 0
    ? Math.max(0, Math.min(1, 1 - focusSecondsRemaining / totalPlannedSeconds))
    : 0;

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  const soundscapes: { id: 'rain' | 'whitenoise' | 'binaural' | 'drone' | 'silence'; label: string; icon: any }[] = [
    { id: 'binaural', label: 'Alpha Waves', icon: Radio },
    { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
    { id: 'whitenoise', label: 'White Noise', icon: Disc },
    { id: 'drone', label: 'Deep Space', icon: Sparkles },
    { id: 'silence', label: 'Silence', icon: VolumeX },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto text-neutral-900 dark:text-white">
      {/* If timer is active */}
      {activeFocusSession ? (
        <div className="w-full flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* North Star Anchor */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Compass className="w-3.5 h-3.5" />
              DESTINATION: {activeGoal.title}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              {activeFocusSession.taskTitle}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold tracking-wider">
              {activeFocusSession.subject || 'Core Focus'}
            </p>
          </div>

          {/* Large Circular Timer */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-neutral-200 dark:stroke-neutral-800"
                strokeWidth="5"
                fill="none"
              />
              {/* Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-linear"
                strokeWidth="5"
                strokeDasharray={264}
                strokeDashoffset={264 * (1 - progressRatio)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-6xl font-black tracking-tighter text-neutral-900 dark:text-white tabular-nums">
                {formatTime(focusSecondsRemaining)}
              </span>
              <span className="text-xs font-medium text-neutral-400 mt-1">
                {isFocusTimerRunning ? 'Session in progress' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3">
            {isFocusTimerRunning ? (
              <button
                onClick={pauseFocusSession}
                id="btn-focus-pause"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white transition-all active:scale-95 shadow-sm"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={resumeFocusSession}
                id="btn-focus-resume"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow-lg shadow-blue-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={completeFocusSession}
              id="btn-focus-complete"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Early</span>
            </button>

            <button
              onClick={cancelFocusSession}
              id="btn-focus-exit"
              title="Exit Session"
              className="p-3 rounded-2xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ambient Soundscapes Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {soundscapes.map((s) => {
              const Icon = s.icon;
              const isCurrent = activeSoundscape === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSoundscape(s.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Motivational Anchor Quote */}
          <div
            onClick={() => setQuoteIndex((prev) => prev + 1)}
            className="cursor-pointer max-w-lg text-center p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic select-none hover:border-blue-500/50 transition-colors"
          >
            "{currentQuote}"
            <div className="text-[10px] not-italic text-neutral-400 mt-1">Tap for another reminder</div>
          </div>
        </div>
      ) : (
        /* Starter Box when no session is running */
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
              Ready for Deep Focus?
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Distraction-free environment with ambient alpha waves and goal reminders.
            </p>
          </div>

          {defaultTask && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left space-y-1">
              <span className="text-[10px] font-bold uppercase text-blue-500">Up Next Today</span>
              <div className="text-sm font-bold text-neutral-900 dark:text-white">{defaultTask.title}</div>
              <div className="text-xs text-neutral-400">{defaultTask.subject} · {defaultTask.durationMinutes} min</div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => startFocusSession(defaultTask)}
              id="btn-start-focus-view"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START FOCUS SESSION ({defaultTask?.durationMinutes || 45}m)</span>
            </button>

            <div className="flex items-center justify-center gap-2">
              {[25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() =>
                    startFocusSession({
                      title: 'Quick Focus Sprint',
                      subject: 'Core',
                      durationMinutes: mins,
                    })
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  {mins} min Sprint
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
