import React, { useState, useEffect } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Sparkles, Brain, Clock, X, ArrowRight, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

export const WhatShouldIDoModal: React.FC = () => {
  const {
    isWhatShouldIDoOpen,
    closeWhatShouldIDo,
    activeGoal,
    todayPlan,
    daysRemaining,
    metrics,
    startFocusSession,
  } = useNexus();

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    taskTitle: string;
    subject: string;
    durationMinutes: number;
    rationale: string;
    microAction?: string;
  } | null>(null);

  useEffect(() => {
    if (isWhatShouldIDoOpen) {
      fetchAnalysis();
    }
  }, [isWhatShouldIDoOpen]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const unfinishedTasks = todayPlan.tasks.filter((t) => t.status !== 'completed');
      const response = await fetch('/api/coach/what-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalTitle: activeGoal.title,
          goalWhy: activeGoal.why,
          daysRemaining,
          todayTasks: unfinishedTasks,
          completedMinutesToday: todayPlan.totalMinutesCompleted,
          currentStreak: metrics.currentStreak,
          mood: todayPlan.checkInMood,
        }),
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (e) {
      console.warn('What-next fallback:', e);
      const topTask = todayPlan.tasks.find((t) => t.status !== 'completed') || todayPlan.tasks[0];
      setRecommendation({
        taskTitle: topTask?.title || 'Biology — Human Physiology',
        subject: topTask?.subject || 'Biology',
        durationMinutes: topTask?.durationMinutes || 45,
        rationale: "This is today's highest-priority unfinished action. Tackling it immediately locks in today's momentum.",
        microAction: "Open your notes and read the first summary paragraph without hesitation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWhatShouldIDoOpen) return null;

  const handleStart = () => {
    if (!recommendation) return;
    closeWhatShouldIDo();
    startFocusSession({
      title: recommendation.taskTitle,
      subject: recommendation.subject,
      durationMinutes: recommendation.durationMinutes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={closeWhatShouldIDo}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Decision Engine</h3>
              <p className="text-xs text-neutral-400">Eliminating decision fatigue</p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-200">Analyzing your journey state...</p>
                <p className="text-xs text-neutral-500">Cross-referencing deadline, remaining tasks, time of day & streak</p>
              </div>
            </div>
          ) : recommendation ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Right now, your highest-value action is:
              </p>

              {/* Task Highlight Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-neutral-950 border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    📚 {recommendation.subject}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {recommendation.durationMinutes} minutes
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {recommendation.taskTitle}
                </h2>

                <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-blue-400">Why: </span>
                  {recommendation.rationale}
                </div>

                {recommendation.microAction && (
                  <div className="text-xs bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 text-amber-200/90 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>2-Minute Hook:</strong> {recommendation.microAction}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={closeWhatShouldIDo}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  Choose another
                </button>
                <button
                  onClick={handleStart}
                  id="btn-what-next-start"
                  className="w-full flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
                >
                  <span>START {recommendation.durationMinutes} MIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
