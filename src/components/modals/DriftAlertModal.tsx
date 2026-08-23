import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { Compass, RotateCcw, Coffee, Calendar, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const DriftAlertModal: React.FC = () => {
  const {
    isDriftAlertOpen,
    closeDriftAlert,
    todayPlan,
    startFocusSession,
    setActiveTab,
  } = useNexus();

  if (!isDriftAlertOpen) return null;

  const topTask = todayPlan.tasks.find((t) => t.status !== 'completed') || todayPlan.tasks[0];

  const handleGetBackOnTrack = () => {
    closeDriftAlert();
    startFocusSession({
      title: topTask?.title || 'Priority Focus',
      subject: topTask?.subject || 'Core',
      durationMinutes: 25,
    });
  };

  const handleTakeBreak = () => {
    closeDriftAlert();
    startFocusSession({
      title: 'Mindful Break & Hydration',
      subject: 'Rest',
      durationMinutes: 10,
    });
  };

  const handleChangePlan = () => {
    closeDriftAlert();
    setActiveTab('plan');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={closeDriftAlert}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Compass className="w-3.5 h-3.5" />
            Drift Detection
          </div>

          {/* Core Message */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs sm:text-sm text-neutral-300 space-y-2">
              <p>
                You planned to focus on <span className="font-semibold text-white">{topTask?.title || 'your study block'}</span> earlier.
              </p>
              <p className="text-amber-300/90 font-medium">
                No problem at all. You drifted — let's restart.
              </p>
            </div>
            <p className="text-xs text-neutral-400">
              Discipline isn't never getting distracted; it's how quickly and gently you return to the path.
            </p>
          </div>

          {/* Action Options */}
          <div className="space-y-2.5">
            <button
              onClick={handleGetBackOnTrack}
              id="btn-drift-get-back"
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-transform active:scale-98"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                GET BACK ON TRACK (25 Min)
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleTakeBreak}
              id="btn-drift-break"
              className="w-full flex items-center gap-2 p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs sm:text-sm border border-neutral-700 transition-colors"
            >
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>TAKE A SHORT BREAK (10 Min)</span>
            </button>

            <button
              onClick={handleChangePlan}
              id="btn-drift-change-plan"
              className="w-full flex items-center gap-2 p-3 rounded-2xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 font-medium text-xs sm:text-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>CHANGE TODAY'S PLAN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
