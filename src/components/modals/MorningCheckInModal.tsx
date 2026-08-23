import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Sun, Clock, Sparkles, X, Check } from 'lucide-react';
import { Mood } from '../../types/nexus';

export const MorningCheckInModal: React.FC = () => {
  const {
    isMorningCheckInOpen,
    closeMorningCheckIn,
    submitMorningCheckIn,
    todayPlan,
    activeGoal,
  } = useNexus();

  const [selectedMood, setSelectedMood] = useState<Mood>(todayPlan.checkInMood || 'good');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(todayPlan.checkInAvailableMinutes || activeGoal.dailyAvailableMinutes || 300);

  if (!isMorningCheckInOpen) return null;

  const moods: { id: Mood; label: string; icon: string }[] = [
    { id: 'exhausted', label: 'Exhausted', icon: '😴' },
    { id: 'low', label: 'Low Energy', icon: '😕' },
    { id: 'neutral', label: 'Normal', icon: '😐' },
    { id: 'good', label: 'Good & Ready', icon: '🙂' },
    { id: 'energized', label: 'Extremely Focused', icon: '🔥' },
  ];

  const timeOptions = [
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: '2 hours', minutes: 120 },
    { label: '3 hours', minutes: 180 },
    { label: '4 hours', minutes: 240 },
    { label: '5+ hours', minutes: 300 },
  ];

  const handleSubmit = () => {
    submitMorningCheckIn(selectedMood, selectedMinutes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={closeMorningCheckIn}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Daily Calibration</h3>
              <p className="text-xs text-neutral-400">Aligning reality with your plan</p>
            </div>
          </div>

          {/* Mood Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    selectedMood === m.id
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.icon}</span>
                  <span className="text-[10px] font-medium text-center leading-tight truncate w-full">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Time Available */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              How much time do you realistically have today?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt.minutes}
                  onClick={() => setSelectedMinutes(opt.minutes)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedMinutes === opt.minutes
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300">
            💡 <strong>Realistic consistency:</strong> NEXUS will dynamically balance your blocks without overloading you.
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            id="btn-submit-checkin"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Calibrate Today's Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
