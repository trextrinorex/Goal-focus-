import React from 'react';
import { NexusProvider, useNexus } from './context/NexusContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';

// Views
import { HomeView } from './components/views/HomeView';
import { FocusView } from './components/views/FocusView';
import { PlanView } from './components/views/PlanView';
import { ProgressView } from './components/views/ProgressView';
import { JourneyView } from './components/views/JourneyView';
import { CoachView } from './components/views/CoachView';
import { GoalHierarchyView } from './components/views/GoalHierarchyView';
import { MilestonesView } from './components/views/MilestonesView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { RememberWhyModal } from './components/modals/RememberWhyModal';
import { WhatShouldIDoModal } from './components/modals/WhatShouldIDoModal';
import { EmergencyResetModal } from './components/modals/EmergencyResetModal';
import { DriftAlertModal } from './components/modals/DriftAlertModal';
import { MorningCheckInModal } from './components/modals/MorningCheckInModal';
import { EveningReviewModal } from './components/modals/EveningReviewModal';
import { GoalEditorModal } from './components/modals/GoalEditorModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useNexus();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'focus':
        return <FocusView />;
      case 'plan':
        return <PlanView />;
      case 'progress':
        return <ProgressView />;
      case 'journey':
        return <JourneyView />;
      case 'coach':
        return <CoachView />;
      case 'goal':
      case 'hierarchy':
        return <GoalHierarchyView />;
      case 'milestones':
        return <MilestonesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic View Canvas */}
        <main className="flex-1 min-w-0 pb-16 md:pb-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* All Overlay Modals */}
      <OnboardingFlow />
      <RememberWhyModal />
      <WhatShouldIDoModal />
      <EmergencyResetModal />
      <DriftAlertModal />
      <MorningCheckInModal />
      <EveningReviewModal />
      <GoalEditorModal />
    </div>
  );
};

export default function App() {
  return (
    <NexusProvider>
      <MainLayout />
    </NexusProvider>
  );
}
