import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { AlertCircle, Flame, X, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const EmergencyResetModal: React.FC = () => {
  const {
    isEmergencyResetOpen,
    closeEmergencyReset,
    activeGoal,
    todayPlan,
    startFocusSession,
    reorderTasks,
  } = useNexus();

  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);

  if (!isEmergencyResetOpen) return null;

  const unfinishedTasks = todayPlan.tasks.filter((t) => t.status !== 'completed');
  const targetTask = unfinishedTasks[selectedTaskIndex] || {
    title: 'High-Yield Concept Micro-Session',
    subject: 'Core',
    durationMinutes: 15,
  };

  const handleStart15Min = () => {
    // Simplify today's plan: mark top priority as the primary focus
    closeEmergencyReset();
    startFocusSession({
      title: targetTask.title,
      subject: targetTask.subject,
      durationMinutes: 15,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={closeEmergencyReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Emergency Friction Reset
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Forget the last few hours.
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-400">
              Let's win the next 15 minutes.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
              Zero shame. Zero guilt. Long-term goals are not achieved in a straight line. We discard the backlog for today and pick exactly <strong>ONE</strong> high-leverage micro-step.
            </p>
          </div>

          {/* Choose ONE task */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Select your ONE focus area:
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {unfinishedTasks.slice(0, 3).map((t, idx) => (
                <div
                  key={t.id || idx}
                  onClick={() => setSelectedTaskIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTaskIndex === idx
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs sm:text-sm">{t.title}</div>
                    <div className="text-[11px] text-neutral-400">{t.subject}</div>
                  </div>
                  {selectedTaskIndex === idx && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prompt banner */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              We will automatically reprioritize the remainder of your schedule after you complete these 15 minutes.
            </span>
          </div>

          {/* Action button */}
          <button
            onClick={handleStart15Min}
            id="btn-emergency-start-15"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-transform"
          >
            <span>START 15 MINUTES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
