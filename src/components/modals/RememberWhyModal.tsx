import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Sparkles, HeartHandshake, ArrowRight, X, BatteryCharging, Brain, HelpCircle, Coffee, ShieldAlert } from 'lucide-react';

export const RememberWhyModal: React.FC = () => {
  const {
    isRememberWhyOpen,
    closeRememberWhy,
    activeGoal,
    todayPlan,
    startFocusSession,
    daysRemaining,
  } = useNexus();

  const [step, setStep] = useState<'reminder' | 'obstacle' | 'adaptive_reply'>('reminder');
  const [selectedObstacle, setSelectedObstacle] = useState<string>('');
  const [adaptiveResolution, setAdaptiveResolution] = useState<{ title: string; desc: string; actionText: string; duration: number } | null>(null);

  if (!isRememberWhyOpen) return null;

  // Derive next action
  const nextTask = todayPlan.tasks.find((t) => t.status !== 'completed') || todayPlan.tasks[0] || {
    title: 'High-Yield Core Review',
    subject: 'Priority Subject',
    durationMinutes: 25,
  };

  const obstacles = [
    { id: 'tired', label: "I'm tired / Low Energy", icon: BatteryCharging },
    { id: 'distracted', label: "I'm distracted / Scrolling", icon: ShieldAlert },
    { id: 'overwhelmed', label: "I'm overwhelmed by the volume", icon: Brain },
    { id: 'dont_know', label: "I don't know what to do next", icon: HelpCircle },
    { id: 'no_motivation', label: "I just don't feel motivated", icon: Sparkles },
    { id: 'need_break', label: "I genuinely need a rest", icon: Coffee },
  ];

  const handleObstacleSelect = (obsId: string) => {
    setSelectedObstacle(obsId);
    let resolution = {
      title: "Lower the Bar: 15-Minute Micro-Step",
      desc: "When resistance is high, don't battle it. Just start a low-pressure 15-minute timer without judging your speed.",
      actionText: "Start 15 Minutes",
      duration: 15,
    };

    if (obsId === 'tired') {
      resolution = {
        title: "Energy is Low: Active Recall Flashcards",
        desc: "Don't do heavy problem solving right now. Switch to passive-active flashcard flipping or reading summaries for 15 minutes.",
        actionText: "Start 15 Min Light Review",
        duration: 15,
      };
    } else if (obsId === 'overwhelmed') {
      resolution = {
        title: "Eliminate the Horizon: Only One Problem",
        desc: "Forget the 100 chapters. You don't need to finish the whole syllabus right now. Only solve 5 questions on today's single topic.",
        actionText: "Focus on Next 5 Questions (20 min)",
        duration: 20,
      };
    } else if (obsId === 'distracted') {
      resolution = {
        title: "Friction Reset: Phone in Another Room",
        desc: "Your brain is caught in a cheap dopamine loop. Take 3 deep breaths, place your phone in another room, and do 10 minutes.",
        actionText: "Start 10 Min Dopamine Reset",
        duration: 10,
      };
    } else if (obsId === 'need_break') {
      resolution = {
        title: "A Conscious 10-Minute Recharge",
        desc: "A planned rest is not procrastination. Step outside, drink a full glass of water, stretch, and then we will restart with a fresh mind.",
        actionText: "Set 10 Min Rest Timer",
        duration: 10,
      };
    }

    setAdaptiveResolution(resolution);
    setStep('adaptive_reply');
  };

  const handleStartNextAction = (duration?: number) => {
    closeRememberWhy();
    setStep('reminder');
    startFocusSession({
      title: nextTask.title,
      subject: nextTask.subject,
      durationMinutes: duration || nextTask.durationMinutes || 25,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            closeRememberWhy();
            setStep('reminder');
          }}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'reminder' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Header label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <HeartHandshake className="w-3.5 h-3.5" />
              Recalibrate Your Compass
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                YOU STARTED FOR A REASON.
              </h2>
              <p className="text-sm text-neutral-400">
                {daysRemaining} days remaining until your target date.
              </p>
            </div>

            {/* Goal Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                YOUR GOAL
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-400">
                {activeGoal.title}
              </div>

              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider pt-2 border-t border-neutral-800/80">
                WHY IT MATTERS TO YOU
              </div>
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed italic bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
                "{activeGoal.why}"
              </p>
            </div>

            {/* Philosophy quote */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 text-blue-200 text-xs sm:text-sm leading-relaxed">
              ✨ <strong>Your future is built from ordinary decisions</strong> like the one you make in the next 10 minutes. You don't need to feel motivated. You only need to take the next step.
            </div>

            {/* Next Action Box */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-neutral-400 uppercase">NEXT ACTION</div>
                <div className="font-bold text-sm sm:text-base text-white">{nextTask.title}</div>
                <div className="text-xs text-neutral-400">{nextTask.subject} · {nextTask.durationMinutes} minutes</div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setStep('obstacle')}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                >
                  Not now
                </button>
                <button
                  onClick={() => handleStartNextAction()}
                  id="btn-remember-why-start"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
                >
                  <span>START NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'obstacle' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h3 className="text-2xl font-bold text-white">What is stopping you right now?</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Be honest with yourself. NEXUS Coach will adapt your next action to eliminate the friction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {obstacles.map((obs) => {
                const Icon = obs.icon;
                return (
                  <button
                    key={obs.id}
                    onClick={() => handleObstacleSelect(obs.id)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-all group active:scale-98"
                  >
                    <div className="p-2.5 rounded-xl bg-neutral-800 group-hover:bg-blue-500/20 text-neutral-400 group-hover:text-blue-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-neutral-200 group-hover:text-white">
                      {obs.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep('reminder')}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Back to goal reminder
            </button>
          </div>
        )}

        {step === 'adaptive_reply' && adaptiveResolution && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              NEXUS Adaptive Friction Reset
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{adaptiveResolution.title}</h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {adaptiveResolution.desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400 font-medium">Adapted session length</div>
                <div className="text-lg font-bold text-blue-400">{adaptiveResolution.duration} minutes</div>
              </div>
              <button
                onClick={() => handleStartNextAction(adaptiveResolution.duration)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
              >
                <span>{adaptiveResolution.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
