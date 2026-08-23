import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { Home, Calendar, Timer, TrendingUp, Bot, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openWhatShouldIDo, isFocusTimerRunning } = useNexus();

  interface NavItem {
    id: 'home' | 'plan' | 'focus' | 'progress' | 'coach';
    label: string;
    icon: any;
    pulse?: boolean;
  }

  const mobileNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'focus', label: 'Focus', icon: Timer, pulse: isFocusTimerRunning },
    { id: 'progress', label: 'Stats', icon: TrendingUp },
    { id: 'coach', label: 'Coach', icon: Bot },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            id={`bottom-nav-${item.id}`}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.pulse && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Floating What Should I Do quick trigger */}
      <button
        onClick={openWhatShouldIDo}
        id="btn-mobile-fab-what-next"
        title="What Should I Do Now?"
        className="fixed bottom-16 right-4 z-50 p-3.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/40 active:scale-95 transition-transform"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
};
