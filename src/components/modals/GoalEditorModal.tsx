import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Target, AlertTriangle, ShieldCheck, X, Check, Sparkles, RefreshCw } from 'lucide-react';
import { Goal } from '../../types/nexus';

export const GoalEditorModal: React.FC = () => {
  const {
    isGoalEditorOpen,
    closeGoalEditor,
    activeGoal,
    updateActiveGoal,
    createNewGoal,
    openEmergencyReset,
    openRememberWhy,
  } = useNexus();

  const [step, setStep] = useState<'form' | 'safety_check' | 'discouraged_path'>('form');
  const [title, setTitle] = useState(activeGoal.title);
  const [why, setWhy] = useState(activeGoal.why);
  const [targetDate, setTargetDate] = useState(activeGoal.targetDate);
  const [dailyHours, setDailyHours] = useState(Math.round(activeGoal.dailyAvailableMinutes / 60));
  const [commitment, setCommitment] = useState(activeGoal.commitmentLevel || 5);

  if (!isGoalEditorOpen) return null;

  const handleSave = () => {
    const isMajorGoalChange = title.trim().toLowerCase() !== activeGoal.title.trim().toLowerCase();

    if (isMajorGoalChange) {
      setStep('safety_check');
    } else {
      updateActiveGoal({
        title,
        why,
        targetDate,
        dailyAvailableMinutes: dailyHours * 60,
        commitmentLevel: commitment,
      });
      closeGoalEditor();
    }
  };

  const handleConfirmGenuineChange = async () => {
    await createNewGoal({
      title,
      why,
      targetDate,
      dailyAvailableMinutes: dailyHours * 60,
      commitmentLevel: commitment,
    });
    setStep('form');
    closeGoalEditor();
  };

  const handleDiscouraged = () => {
    setStep('discouraged_path');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={() => {
            closeGoalEditor();
            setStep('form');
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Edit North Star Goal</h3>
                <p className="text-xs text-neutral-400">Keep your compass crystal clear</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-neutral-400">Goal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-neutral-400">Why It Matters (Emotional Driver)</label>
                <textarea
                  rows={3}
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Daily Time (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  closeGoalEditor();
                  setStep('form');
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                id="btn-save-goal"
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {step === 'safety_check' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" />
              Cognitive Safety Guard
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Are you changing direction or escaping discomfort?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                When goals get difficult or monotonous, the brain naturally looks for novelty and wants to jump to a new goal.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleConfirmGenuineChange}
                className="w-full p-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-left border border-neutral-700 text-xs sm:text-sm font-semibold text-white transition-colors"
              >
                ✓ "I genuinely changed my life goal."
              </button>

              <button
                onClick={() => {
                  closeGoalEditor();
                  setStep('form');
                  openEmergencyReset();
                }}
                className="w-full p-3.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-left border border-blue-500/40 text-xs sm:text-sm font-semibold text-blue-200 transition-colors"
              >
                ⚡ "I just need to rethink today's schedule and plan."
              </button>

              <button
                onClick={handleDiscouraged}
                className="w-full p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-left border border-rose-500/30 text-xs sm:text-sm font-semibold text-rose-200 transition-colors"
              >
                💔 "I am just feeling discouraged / behind."
              </button>
            </div>
          </div>
        )}

        {step === 'discouraged_path' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/40 space-y-2">
              <h3 className="font-bold text-white text-base">Let's adjust the plan instead of abandoning the dream.</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                You chose <strong>{activeGoal.title}</strong> for a powerful reason: <em>"{activeGoal.why}"</em>.
                <br /><br />
                Discouragement is temporary. Quitting is permanent. Let's reduce your daily requirement to a lighter pace for a few days to restore your momentum.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  closeGoalEditor();
                  setStep('form');
                  openRememberWhy();
                }}
                className="w-full py-3 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
              >
                Remind Me Why I Started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
