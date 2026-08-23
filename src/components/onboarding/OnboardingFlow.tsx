import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Compass, Sparkles, ArrowRight, HeartHandshake, Calendar, Flame, Clock, Loader2, Check } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { isOnboardingOpen, completeOnboarding } = useNexus();

  const [step, setStep] = useState<number>(1);
  const [goalTitle, setGoalTitle] = useState<string>('Crack NEET 2027');
  const [whyReason, setWhyReason] = useState<string>(
    'I want to become a doctor, save lives, lift up my family, and prove to myself that daily discipline transforms my destiny.'
  );
  const [targetDate, setTargetDate] = useState<string>('2027-05-02');
  const [deadlineMode, setDeadlineMode] = useState<'exact' | 'unsure' | 'suggest'>('exact');
  const [commitmentLevel, setCommitmentLevel] = useState<number>(5);
  const [dailyMinutes, setDailyMinutes] = useState<number>(300); // 5 hours
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOnboardingOpen) return null;

  const exampleGoals = [
    'Crack NEET 2027',
    'Clear UPSC Civil Services',
    'Learn Full-Stack AI Programming',
    'Lose 10 kg & Run 10k',
    'Build a Profitable Business',
    'Become Financially Independent',
  ];

  const commitmentLabels: Record<number, { title: string; desc: string }> = {
    1: { title: 'Just exploring', desc: 'Curious about what it takes' },
    2: { title: 'Interested', desc: 'Willing to put in casual effort' },
    3: { title: 'Serious', desc: 'Ready for a structured routine' },
    4: { title: 'Very serious', desc: 'High priority in my life' },
    5: { title: 'This changes my life', desc: 'Absolute priority. Non-negotiable commitment.' },
  };

  const timeOptions = [
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: '2 hours', minutes: 120 },
    { label: '3 hours', minutes: 180 },
    { label: '4 hours', minutes: 240 },
    { label: '5+ hours', minutes: 300 },
  ];

  const handleFinish = async () => {
    setIsGenerating(true);
    let resolvedDate = targetDate;
    if (deadlineMode === 'unsure' || deadlineMode === 'suggest') {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      resolvedDate = d.toISOString().split('T')[0];
    }

    await completeOnboarding({
      title: goalTitle,
      why: whyReason,
      targetDate: resolvedDate,
      commitmentLevel,
      dailyAvailableMinutes: dailyMinutes,
    });
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl text-white">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">
              N
            </div>
            <span className="font-extrabold text-sm tracking-wider">NEXUS NAVIGATION</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-blue-500' : s < step ? 'w-2 bg-blue-800' : 'w-2 bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Goal Title */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20">
                <Compass className="w-3.5 h-3.5" />
                Step 1 of 5
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Where do you want to go?
              </h2>
              <p className="text-sm text-neutral-400">
                Tell me the goal that matters most to you right now. Natural language supported.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. I want to crack NEET 2027 with a top rank..."
                  className="w-full py-4 px-5 rounded-2xl bg-neutral-900 border border-neutral-700 text-lg sm:text-xl font-bold text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 shadow-inner"
                  autoFocus
                />
              </div>

              {/* Suggestions */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <span className="text-xs text-neutral-500 font-medium">Try an example:</span>
                {exampleGoals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoalTitle(g)}
                    className="text-xs py-1 px-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => goalTitle.trim() && setStep(2)}
                disabled={!goalTitle.trim()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Emotional Driver (Why) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20">
                <HeartHandshake className="w-3.5 h-3.5" />
                Step 2 of 5 · Emotional Anchor
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Why does this matter to you?
              </h2>
              <p className="text-sm text-neutral-400">
                Imagine you achieved this goal. What would change in your life? Write freely.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                rows={4}
                value={whyReason}
                onChange={(e) => setWhyReason(e.target.value)}
                placeholder="I want this because..."
                className="w-full py-4 px-5 rounded-2xl bg-neutral-900 border border-neutral-700 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed shadow-inner"
              />
              <p className="text-xs text-neutral-500 italic">
                NEXUS will bring you back to these exact words whenever motivation fades.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-medium text-neutral-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={() => whyReason.trim() && setStep(3)}
                disabled={!whyReason.trim()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
              >
                <span>Next: Deadline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deadline */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20">
                <Calendar className="w-3.5 h-3.5" />
                Step 3 of 5 · Horizon
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                What is your deadline?
              </h2>
              <p className="text-sm text-neutral-400">
                A goal without a timeline is just a wish.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDeadlineMode('exact')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deadlineMode === 'exact'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                }`}
              >
                <div className="font-bold text-sm">I have a deadline</div>
                <div className="text-xs text-neutral-400 mt-1">Specific exam or date</div>
              </button>

              <button
                type="button"
                onClick={() => setDeadlineMode('unsure')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deadlineMode === 'unsure'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                }`}
              >
                <div className="font-bold text-sm">I don't know yet</div>
                <div className="text-xs text-neutral-400 mt-1">Default to 1-year roadmap</div>
              </button>

              <button
                type="button"
                onClick={() => setDeadlineMode('suggest')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  deadlineMode === 'suggest'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                }`}
              >
                <div className="font-bold text-sm">Help me choose</div>
                <div className="text-xs text-neutral-400 mt-1">AI optimizes duration</div>
              </button>
            </div>

            {deadlineMode === 'exact' && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Select Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-700 text-base font-semibold text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-medium text-neutral-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
              >
                <span>Next: Commitment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Commitment Slider */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                <Flame className="w-3.5 h-3.5" />
                Step 4 of 5 · Seriousness
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                How serious are you about this?
              </h2>
              <p className="text-sm text-neutral-400">
                Honesty sets the foundation for realistic accountability.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCommitmentLevel(lvl)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-base transition-all ${
                      commitmentLevel === lvl
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/40 scale-105'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                <div className="text-base font-bold text-blue-400">
                  {commitmentLabels[commitmentLevel]?.title}
                </div>
                <div className="text-xs sm:text-sm text-neutral-300">
                  {commitmentLabels[commitmentLevel]?.desc}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="text-xs font-medium text-neutral-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
              >
                <span>Next: Daily Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Daily Time Availability */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <Clock className="w-3.5 h-3.5" />
                Final Step · Daily Rhythm
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                How much time can you realistically give daily?
              </h2>
              <p className="text-sm text-neutral-400">
                Consistency beats intensity. Choose what you can sustain on hard days.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeOptions.map((opt) => (
                <button
                  key={opt.minutes}
                  type="button"
                  onClick={() => setDailyMinutes(opt.minutes)}
                  className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                    dailyMinutes === opt.minutes
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Summary preview */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Destination:</span>
                <span className="font-semibold text-white">{goalTitle}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Daily Commitment:</span>
                <span className="font-semibold text-blue-400">{Math.round(dailyMinutes / 60)} hours/day</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(4)}
                disabled={isGenerating}
                className="text-xs font-medium text-neutral-400 hover:text-white disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                onClick={handleFinish}
                disabled={isGenerating}
                id="btn-onboarding-finish"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/40 active:scale-95 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Constructing Your Journey...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>BUILD MY JOURNEY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
