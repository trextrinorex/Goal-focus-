import React from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Compass,
  CheckCircle2,
  Circle,
  Flag,
  Calendar,
  Sparkles,
  Award,
  ArrowRight,
  Target,
} from 'lucide-react';

export const JourneyView: React.FC = () => {
  const {
    activeGoal,
    daysRemaining,
    currentPhase,
    journeyProgressPercent,
    metrics,
    openRememberWhy,
  } = useNexus();

  const phases = activeGoal.phases || [];
  const milestonesList = activeGoal.milestones || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Strategic Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            The Long-Horizon Journey
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Phases, checkpoints, and timeline architecture for {activeGoal.title}.
          </p>
        </div>

        <button
          onClick={openRememberWhy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Recalibrate Motivation</span>
        </button>
      </div>

      {/* Target Destination Summary Hero */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-white space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">
              North Star Destination
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {activeGoal.title}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-blue-400">{daysRemaining}</span>
            <span className="text-xs text-neutral-400 block font-medium">Days Remaining</span>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-400 font-semibold">
            <span>Overall Roadmap Completion</span>
            <span className="text-white font-bold">{journeyProgressPercent}%</span>
          </div>
          <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(5, journeyProgressPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Timeline / Journey Map */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-neutral-900 dark:text-white uppercase tracking-wider">
          Phases of the Journey
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
          {phases.map((phase: any, idx: number) => {
            const isCompleted = phase.status === 'completed';
            const isCurrent = phase.status === 'in_progress' || (idx === (activeGoal.currentPhaseIndex || 0) && !isCompleted);
            const title = phase.name || phase.title || `Phase ${idx + 1}`;
            const progress = typeof phase.progressPercentage === 'number' ? phase.progressPercentage : (phase.progressPercent || 0);

            // Resolve phase milestones if stored as strings (IDs) or objects
            const phaseMilestones = (phase.milestones || []).map((mItem: any) => {
              if (typeof mItem === 'string') {
                return milestonesList.find((m) => m.id === mItem) || { id: mItem, title: mItem, isCompleted: false };
              }
              return mItem;
            });

            return (
              <div key={phase.id || idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 border-blue-500 text-white ring-4 ring-blue-500/20 shadow-md'
                      : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Phase Content Box */}
                <div
                  className={`p-5 rounded-3xl border transition-all ${
                    isCurrent
                      ? 'bg-white dark:bg-neutral-900 border-blue-500/50 shadow-lg dark:shadow-blue-950/20'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                            : isCurrent
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {isCompleted ? 'Completed Phase' : isCurrent ? 'CURRENT ACTIVE PHASE' : 'Upcoming Phase'}
                      </span>
                      {phase.startDate && phase.endDate && (
                        <span className="text-xs text-neutral-400">
                          {phase.startDate} → {phase.endDate}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                      {progress}% Complete
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                    {title}
                  </h4>
                  {phase.description && (
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                      {phase.description}
                    </p>
                  )}

                  {/* Milestones inside Phase */}
                  {phaseMilestones && phaseMilestones.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Phase Milestones:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phaseMilestones.map((m: any) => {
                          const isDone = Boolean(m.isCompleted || m.completed);
                          return (
                            <div
                              key={m.id}
                              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                                isDone
                                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-medium'
                                  : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                                  isDone ? 'bg-emerald-500 text-white' : 'border border-neutral-400'
                                }`}
                              >
                                {isDone && <CheckCircle2 className="w-2.5 h-2.5" />}
                              </span>
                              <span className="truncate">{m.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
