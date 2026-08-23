import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Moon, Star, CheckCircle2, X, MessageSquare, Award } from 'lucide-react';

export const EveningReviewModal: React.FC = () => {
  const {
    isEveningReviewOpen,
    closeEveningReview,
    submitEveningReview,
    todayPlan,
    activeGoal,
  } = useNexus();

  const [rating, setRating] = useState<number>(4);
  const [blocker, setBlocker] = useState<string>('None - Kept on track');
  const [proudOf, setProudOf] = useState<string>('');

  if (!isEveningReviewOpen) return null;

  const plannedHours = (todayPlan.totalMinutesPlanned / 60).toFixed(1);
  const completedHours = (todayPlan.totalMinutesCompleted / 60).toFixed(1);
  const completionPct = todayPlan.totalMinutesPlanned > 0
    ? Math.min(100, Math.round((todayPlan.totalMinutesCompleted / todayPlan.totalMinutesPlanned) * 100))
    : 100;

  const blockerOptions = [
    'None - Kept on track',
    'Phone / Social media scrolling',
    'Mental fatigue / Low energy',
    'Unexpected interruptions',
    'Poor sleep from night before',
    'Felt overwhelmed by task size',
  ];

  const handleSubmit = () => {
    submitEveningReview(rating, blocker, proudOf);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={closeEveningReview}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Night Reflection</h3>
              <p className="text-xs text-neutral-400">Locking in today's growth for {activeGoal.title}</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
            <div>
              <div className="text-[10px] uppercase text-neutral-500 font-semibold">Planned</div>
              <div className="text-base font-bold text-neutral-200">{plannedHours}h</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-neutral-500 font-semibold">Completed</div>
              <div className="text-base font-bold text-blue-400">{completedHours}h</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-neutral-500 font-semibold">Completion</div>
              <div className="text-base font-bold text-emerald-400">{completionPct}%</div>
            </div>
          </div>

          {/* Rating 1-5 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Did today move you closer to your North Star?
            </label>
            <div className="flex items-center justify-between gap-1 p-2 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRating(val)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    rating === val
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 mx-auto mb-0.5 ${rating >= val ? 'fill-amber-400 text-amber-400' : ''}`} />
                  {val}/5
                </button>
              ))}
            </div>
          </div>

          {/* Blocker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              What got in your way (if anything)?
            </label>
            <select
              value={blocker}
              onChange={(e) => setBlocker(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-blue-500"
            >
              {blockerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Proud of */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              What are you proud of today?
            </label>
            <input
              type="text"
              value={proudOf}
              onChange={(e) => setProudOf(e.target.value)}
              placeholder="e.g. Mastered action potentials and didn't give up when Physics felt hard."
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            id="btn-submit-evening-review"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Reflection & Rest Well</span>
          </button>
        </div>
      </div>
    </div>
  );
};
