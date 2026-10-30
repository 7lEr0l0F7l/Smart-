import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeOverview } from './components/HomeOverview';
import { EducationModeView } from './components/EducationModeView';
import { HobbyistModeView } from './components/HobbyistModeView';
import { DiaryView } from './components/DiaryView';
import { CommunityView } from './components/CommunityView';
import { QRScannerModal } from './components/QRScannerModal';

const AppContent: React.FC = () => {
  const { activeTab, mode } = useApp();

  return (
    <MobileFrame>
      {/* Top Header */}
      <HeaderBar />

      {/* Main Tab Screen View */}
      <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
        {activeTab === 'home' && <HomeOverview />}
        {activeTab === 'lab' && (mode === 'education' ? <EducationModeView /> : <HobbyistModeView />)}
        {activeTab === 'diary' && <DiaryView />}
        {activeTab === 'community' && <CommunityView />}
      </main>

      {/* Bottom Nav Bar */}
      <BottomNavBar />

      {/* QR Code Scanner & Onboarding Modal */}
      <QRScannerModal />
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
