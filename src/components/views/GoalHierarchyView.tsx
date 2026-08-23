import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Target,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Sparkles,
  Award,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const GoalHierarchyView: React.FC = () => {
  const { activeGoal, todayPlan, openGoalEditor, setActiveTab } = useNexus();

  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    'proj-bio': true,
    'proj-chem': true,
    'proj-phys': true,
  });

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const outcomes = activeGoal.outcomes || (activeGoal as any).keyOutcomes || [
    'Master high-yield concepts across all subject areas',
    'Maintain daily study consistency without burnout',
    'Achieve peak confidence before target exam date'
  ];

  const projects = activeGoal.projects || [
    { id: 'proj-1', name: 'Primary Subject Core', description: 'Deep conceptual comprehension and notes', progress: 50 },
    { id: 'proj-2', name: 'Secondary Subject Practice', description: 'Problem solving and numerical drills', progress: 40 },
    { id: 'proj-3', name: 'Review & Active Recall', description: 'Formula sheets, flashcards, and testing', progress: 35 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Structural Alignment
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Goal Decomposition Hierarchy
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            How your everyday minutes cascade directly up to your ultimate destination.
          </p>
        </div>

        <button
          onClick={openGoalEditor}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors"
        >
          Edit Goal & Settings
        </button>
      </div>

      {/* Level 1: North Star Main Goal Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Level 1 · North Star Destination
          </span>
          <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Target: {activeGoal.targetDate}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white">
          {activeGoal.title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-300 italic bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 leading-relaxed">
          "{activeGoal.why}"
        </p>
      </div>

      {/* Level 2: Key Strategic Outcomes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Level 2 · Key Measurable Outcomes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {outcomes.map((outcome: any, idx: number) => {
            const isObj = typeof outcome === 'object' && outcome !== null;
            const title = isObj ? (outcome.title || outcome.name) : outcome;
            const currentVal = isObj ? (outcome.currentValue ?? 75) : 80;
            const targetVal = isObj ? (outcome.targetValue ?? 100) : 100;
            const unit = isObj ? (outcome.unit || '%') : '';

            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white leading-snug">
                    {title}
                  </div>
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                    {idx + 1}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (currentVal / targetVal) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level 3: Subject Projects & Modules */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Level 3 · Subject Modules & Work Streams</span>
        </div>

        <div className="space-y-3">
          {projects.map((proj: any, idx: number) => {
            const isExpanded = !!expandedProjects[proj.id || idx];
            const name = proj.name || proj.title || `Module ${idx + 1}`;
            const progress = typeof proj.progress === 'number' ? proj.progress : (proj.progressPercent || 40);

            return (
              <div
                key={proj.id || idx}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
              >
                <div
                  onClick={() => toggleProject(proj.id || `${idx}`)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                        {name}
                      </h4>
                      {proj.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {progress}%
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 space-y-2">
                    <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                      <span>Daily tasks tagged for {name} will compound toward this track.</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('plan');
                        }}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 flex items-center gap-1"
                      >
                        <span>View in Plan</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Level 4 & 5: Daily Actions connection */}
      <div className="p-5 sm:p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <CheckSquare className="w-4 h-4" />
          <span>Level 4 & 5 · Daily Execution Bridge</span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Every single minute you log on tasks today ({todayPlan.tasks.length} tasks scheduled, {todayPlan.totalMinutesCompleted}m completed) directly connects upwards to fuel subject mastery, lock in key outcomes, and secure your North Star goal.
        </p>
      </div>
    </div>
  );
};
