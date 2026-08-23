import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { Compass, Flame, Clock, HeartHandshake, Sparkles } from 'lucide-react';

export const NorthStarBanner: React.FC = () => {
  const { activeGoal, daysRemaining, journeyProgressPercent, metrics, openRememberWhy } = useNexus();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 text-white p-5 sm:p-6 shadow-xl mb-6">
      {/* Subtle background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left: Goal & Why */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Compass className="w-3.5 h-3.5" />
              North Star Destination
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
              Day {metrics.totalActiveDays} of Journey
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {metrics.currentStreak} Day Consistency
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            🎯 {activeGoal.title}
          </h1>

          <p className="text-sm text-neutral-300 line-clamp-2 max-w-3xl leading-relaxed italic">
            "{activeGoal.why}"
          </p>
        </div>

        {/* Right: Countdown & Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-blue-400">
              {daysRemaining}
            </span>
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Days Left
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full sm:w-48 lg:w-52 space-y-1.5">
            <div className="flex justify-between text-xs text-neutral-400 font-medium">
              <span>Journey Progress</span>
              <span className="text-white font-semibold">{journeyProgressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(5, journeyProgressPercent))}%` }}
              />
            </div>
          </div>

          <button
            onClick={openRememberWhy}
            id="btn-remind-why"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 hover:text-white border border-neutral-700 transition-all shadow-sm group"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>REMIND ME WHY</span>
            <Sparkles className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};
