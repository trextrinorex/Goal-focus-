import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Bell,
  Sun,
  Moon,
  Compass,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  CalendarCheck,
  RotateCcw,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeGoal,
    user,
    updateUserProfile,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    openWhatShouldIDo,
    openEmergencyReset,
    openMorningCheckIn,
    openEveningReview,
    openDriftAlert,
    metrics,
  } = useNexus();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const toggleTheme = () => {
    updateUserProfile({ theme: user.theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleSound = () => {
    updateUserProfile({ soundEnabled: !user.soundEnabled });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Brand & North Star pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-lg tracking-wider">
            N
          </div>
          <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white hidden sm:inline-block">
            NEXUS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium truncate max-w-[200px] lg:max-w-xs">{activeGoal.title}</span>
          <span className="text-neutral-400">·</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            {metrics.currentStreak}d
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick "What Should I Do Now" trigger */}
        <button
          onClick={openWhatShouldIDo}
          id="btn-header-what-next"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>What next?</span>
        </button>

        {/* Daily Check-in Shortcut */}
        <button
          onClick={openMorningCheckIn}
          title="Daily Check-In"
          id="btn-header-checkin"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden lg:inline">Check-In</span>
        </button>

        {/* Drift Simulation Demo Trigger */}
        <button
          onClick={() => openDriftAlert()}
          title="Simulate Drift Intervention"
          id="btn-header-drift-test"
          className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Drift Alert</span>
        </button>

        {/* Emergency Reset Trigger */}
        <button
          onClick={openEmergencyReset}
          title="Emergency Reset"
          id="btn-header-emergency"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Off Track?</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          id="btn-toggle-sound"
          title={user.soundEnabled ? 'Mute audio' : 'Enable audio'}
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
        >
          {user.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          id="btn-toggle-theme"
          title="Toggle Dark/Light Mode"
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
        >
          {user.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            id="btn-notifications-menu"
            className="relative p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            )}
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" />
                  Notifications & Guidance
                </div>
                <span className="text-xs text-neutral-400 font-medium">
                  {unreadNotificationsCount} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-6 text-center">No notifications right now.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                        !n.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
