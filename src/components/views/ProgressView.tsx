import React from 'react';
import { useNexus } from '../../context/NexusContext';
import {
  TrendingUp,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  Zap,
  Compass,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const ProgressView: React.FC = () => {
  const { metrics, activeGoal, daysRemaining, journeyProgressPercent } = useNexus();

  const totalHours = (metrics.totalFocusMinutes / 60).toFixed(1);

  // Weekly study hours data for Recharts
  const weeklyData = metrics.weeklyLogs.map((log) => {
    const dayName = new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' });
    return {
      day: dayName,
      hours: Number((log.minutesFocused / 60).toFixed(1)),
      tasks: log.tasksCompleted,
      date: log.date,
    };
  });

  // Subject breakdown for Pie/Bar
  const subjectData = Object.entries(metrics.subjectMinutes).map(([subject, minutes], index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
    const mins = Number(minutes) || 0;
    return {
      name: subject,
      value: Number((mins / 60).toFixed(1)),
      color: colors[index % colors.length],
    };
  });

  // Hourly Productivity Data
  const hourlyData = metrics.hourlyProductivity.map((h) => ({
    time: `${h.hour}:00`,
    minutes: h.minutes,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Analytics & Consistency
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
          Journey Progress & Effort
        </h2>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Focus Hours */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase">Focus Invested</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
            {totalHours}h
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Across {metrics.totalActiveDays} active days
          </p>
        </div>

        {/* Metric 2: Consistency */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase">Consistency</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {metrics.currentStreak} Days
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {metrics.overallConsistencyRate}% overall adherence
          </p>
        </div>

        {/* Metric 3: Tasks Completed */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase">Tasks Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500">
            {metrics.totalTasksCompleted}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            High-yield actions completed
          </p>
        </div>

        {/* Metric 4: Journey Progress */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase">North Star Progress</span>
            <Compass className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-500">
            {journeyProgressPercent}%
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {daysRemaining} days remaining
          </p>
        </div>
      </div>

      {/* Consistency Philosophy Callout: "Your streak ended. Your journey didn't." */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/30 text-neutral-900 dark:text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Resilient Consistency Philosophy</span>
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            If you ever miss a day, NEXUS never resets your hard work to zero. Streaks are tools, not your destination.
          </p>
        </div>
        <div className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-600 text-white shrink-0">
          Day {metrics.totalActiveDays} Continues
        </div>
      </div>

      {/* Main Charts: 2 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Focus Hours This Week */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Focus Hours (Past 7 Days)
            </h3>
            <span className="text-xs text-neutral-400">Hours / Day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-500" />
              Subject Time Distribution
            </h3>
            <span className="text-xs text-neutral-400">Total Hours</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#262626',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} hours`, 'Invested']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {subjectData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <strong className="text-neutral-900 dark:text-white">{item.value}h</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Behavioral Insights Card */}
      <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>AI Behavioral Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/80 space-y-1">
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
              Peak Focus Window: 06:00 AM – 09:30 AM
            </h5>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your completion rate is 38% higher in morning sessions. Schedule your hardest topic (e.g. Physics / Chemistry numericals) during this window.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800/80 space-y-1">
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
              Realistic Pacing Calibration
            </h5>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              You achieve highest consistency with 45-minute blocks followed by 10-minute active recall breaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
