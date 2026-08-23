import React from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  Home,
  Target,
  Calendar,
  Timer,
  TrendingUp,
  Map,
  Bot,
  Award,
  Settings,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  HeartHandshake,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openWhatShouldIDo,
    openEmergencyReset,
    openRememberWhy,
    activeGoal,
    daysRemaining,
  } = useNexus();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'goal', label: 'Goal & North Star', icon: Target },
    { id: 'plan', label: 'Daily Plan', icon: Calendar },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'progress', label: 'Progress & Consistency', icon: TrendingUp },
    { id: 'journey', label: 'Journey Timeline', icon: Map },
    { id: 'coach', label: 'NEXUS Coach', icon: Bot },
    { id: 'milestones', label: 'Milestones', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Primary Goal badge card */}
      <div className="p-3.5 mb-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Active Destination</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{daysRemaining}d left</span>
        </div>
        <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
          {activeGoal.title}
        </div>
        <button
          onClick={openRememberWhy}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
          <span>Remember Why</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`nav-item-${item.id}`}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Anchors */}
      <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        {/* Prominent What Should I Do button */}
        <button
          onClick={openWhatShouldIDo}
          id="btn-sidebar-what-next"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          <span>What Should I Do Now?</span>
        </button>

        {/* Emergency Reset */}
        <button
          onClick={openEmergencyReset}
          id="btn-sidebar-emergency"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>I'm Completely Off Track</span>
        </button>
      </div>
    </aside>
  );
};
