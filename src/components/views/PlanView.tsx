import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Calendar,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Priority, Task } from '../../types/nexus';

export const PlanView: React.FC = () => {
  const {
    todayPlan,
    addTask,
    completeTask,
    deleteTask,
    startFocusSession,
    activeGoal,
    openMorningCheckIn,
  } = useNexus();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Biology');
  const [duration, setDuration] = useState(45);
  const [time, setTime] = useState('14:00');
  const [priority, setPriority] = useState<Priority>('high');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title,
      subject,
      durationMinutes: duration,
      scheduledTime: time,
      priority,
    });
    setTitle('');
    setIsAdding(false);
  };

  const completedCount = todayPlan.tasks.filter((t) => t.status === 'completed').length;
  const totalPlannedMinutes = todayPlan.totalMinutesPlanned;
  const totalCompletedMinutes = todayPlan.totalMinutesCompleted;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Daily Operating Plan
            </span>
            <span className="text-xs text-neutral-400">· {todayPlan.date}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Today's Schedule & Priorities
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openMorningCheckIn}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors"
          >
            Re-Calibrate Time
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            id="btn-add-task-toggle"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Action</span>
          </button>
        </div>
      </div>

      {/* Primary Objective Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            Primary Objective
          </span>
          <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
            {todayPlan.primaryObjective}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-neutral-400">Planned</span>
            <strong className="text-neutral-900 dark:text-white text-sm">{(totalPlannedMinutes / 60).toFixed(1)}h</strong>
          </div>
          <div className="border-l border-neutral-200 dark:border-neutral-800 pl-4">
            <span className="block text-[10px] uppercase font-semibold text-neutral-400">Completed</span>
            <strong className="text-blue-600 dark:text-blue-400 text-sm">{(totalCompletedMinutes / 60).toFixed(1)}h</strong>
          </div>
        </div>
      </div>

      {/* Add Task Form Modal / Inline */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Add New Daily Action
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Action Title (e.g. Physics — Solve 20 electrostatics numericals)"
                className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                Subject / Category
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={10}
                max={180}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                Scheduled Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-task"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all"
          >
            Create Action
          </button>
        </form>
      )}

      {/* Task List / Timetable */}
      <div className="space-y-3">
        {todayPlan.tasks.map((task, idx) => {
          const isDone = task.status === 'completed';
          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-neutral-50 dark:bg-neutral-950/60 border-neutral-200 dark:border-neutral-850 opacity-75'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:shadow-md'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start sm:items-center gap-3">
                <button
                  onClick={() => completeTask(task.id)}
                  className={`w-6 h-6 rounded-full border mt-0.5 sm:mt-0 flex items-center justify-center transition-colors shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-blue-500'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {task.scheduledTime && (
                      <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.scheduledTime}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {task.subject}
                    </span>
                    <span className="text-xs text-neutral-400">{task.durationMinutes} min</span>
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-bold mt-1 ${
                      isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.notes && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 italic">
                      {task.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {!isDone && (
                  <button
                    onClick={() => startFocusSession(task)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>START ({task.durationMinutes}m)</span>
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                  className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
