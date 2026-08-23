import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Flag,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Award,
  Tag,
} from 'lucide-react';
import { Milestone } from '../../types/nexus';

export const MilestonesView: React.FC = () => {
  const { activeGoal, toggleMilestone, addMilestone, deleteMilestone } = useNexus();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState('Momentum');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const allMilestones = activeGoal.milestones || [];
  const completedCount = allMilestones.filter((m: any) => m.isCompleted || m.completed).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMilestone({
      title: newTitle.trim(),
      category: category.trim() || 'Momentum',
      targetDate: targetDate || undefined,
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Checkpoints & Achievements
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Key Milestones
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Break down {activeGoal.title} into concrete, verifiable victories.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Progress banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Milestones Completed
          </span>
          <span className="text-sm font-black text-blue-600 dark:text-blue-400">
            {completedCount} of {allMilestones.length} Achieved
          </span>
        </div>

        <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{
              width: `${allMilestones.length > 0 ? (completedCount / allMilestones.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Add form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Create New Major Milestone
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] text-neutral-400 font-semibold uppercase block mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Complete 10 Full-Length Mock Tests"
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-semibold uppercase block mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all"
          >
            Save Milestone
          </button>
        </form>
      )}

      {/* Milestones List */}
      <div className="space-y-3">
        {allMilestones.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl text-neutral-400 text-xs">
            No milestones added yet. Add your first milestone to establish checkpoints for your goal.
          </div>
        ) : (
          allMilestones.map((m: any) => {
            const isDone = Boolean(m.isCompleted || m.completed);
            return (
              <div
                key={m.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => toggleMilestone(m.id)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-500'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm sm:text-base font-bold truncate ${
                        isDone
                          ? 'line-through text-emerald-800 dark:text-emerald-300'
                          : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5 flex-wrap">
                      {m.category && (
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                          {m.category}
                        </span>
                      )}
                      {m.targetDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Target: {m.targetDate}
                        </span>
                      )}
                      {isDone && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          · Achieved!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteMilestone(m.id)}
                  title="Delete milestone"
                  className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
