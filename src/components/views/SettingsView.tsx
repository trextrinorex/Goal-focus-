import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  User,
  Settings,
  Shield,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Moon,
  Sun,
  Volume2,
  Check,
  Bell,
  Clock,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    resetAllDataToDemo,
    openGoalEditor,
    activeGoal,
    exportDataJSON,
    importDataJSON,
  } = useNexus();

  const [name, setName] = useState(user.name || 'Mohit');
  const [theme, setTheme] = useState<'light' | 'dark'>(user.theme || 'dark');
  const [soundEnabled, setSoundEnabled] = useState(user.soundEnabled ?? true);
  const [ambientVolume, setAmbientVolume] = useState(user.ambientSoundVolume ?? 0.4);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled ?? true);
  const [morningReminderTime, setMorningReminderTime] = useState(user.morningReminderTime || '06:30');
  const [eveningReviewTime, setEveningReviewTime] = useState(user.eveningReviewTime || '21:30');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      theme,
      soundEnabled,
      ambientSoundVolume: ambientVolume,
      notificationsEnabled,
      morningReminderTime,
      eveningReviewTime,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importDataJSON(text);
        if (success) {
          setImportStatus('Journey data restored successfully!');
        } else {
          setImportStatus('Invalid JSON format.');
        }
      } catch {
        setImportStatus('Could not parse file.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Preferences & Controls
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
          Settings & Configuration
        </h2>
      </div>

      {/* Profile & Audio Settings Form */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Personal Profile & Interface
          </h3>

          {/* Theme toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                updateUserProfile({ theme: 'light' });
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                theme === 'light'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                updateUserProfile({ theme: 'dark' });
              }}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                theme === 'dark'
                  ? 'bg-neutral-700 text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Morning Calibration Reminder Time
            </label>
            <input
              type="time"
              value={morningReminderTime}
              onChange={(e) => setMorningReminderTime(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Audio & Soundscape Section */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-blue-500" />
            Soundscapes & Focus Audio
          </h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                Enable Audio Synthesizer & Timer Chimes
              </div>
              <div className="text-[11px] text-neutral-400">
                Web Audio synthesized rainfall, white noise, and celebration sounds
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Soundscape Volume</span>
              <span>{Math.round(ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => setAmbientVolume(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            Gentle Accountability
          </h4>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-neutral-900 dark:text-white">
                Morning & Evening Routine Prompts
              </div>
              <div className="text-[11px] text-neutral-400">
                Reminders to check in each morning and reflect each night
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences updated!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 active:scale-95 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Goal Administration & Backup */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" />
          Data Backup & Goal Administration
        </h3>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Your current primary goal is <strong className="text-neutral-800 dark:text-neutral-200">{activeGoal.title}</strong>. You can export a snapshot of your progress or restore a previous journey.
        </p>

        {importStatus && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-semibold">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={openGoalEditor}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            Edit Goal Settings
          </button>

          <button
            onClick={exportDataJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Journey JSON</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={resetAllDataToDemo}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors sm:ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
