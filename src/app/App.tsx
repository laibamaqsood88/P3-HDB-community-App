import { useState } from 'react';
import { Toaster } from 'sonner';
import { BottomNav } from './components/BottomNav';
import { EventsPage } from './pages/EventsPage';
import { NeighboursPage } from './pages/NeighboursPage';
import { HelpSharePage } from './pages/HelpSharePage';
import { ProfilePage } from './pages/ProfilePage';

type ActiveTab = 'events' | 'neighbours' | 'help' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');

  return (
    <div
      style={{
        width: '100vw',
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: '#F5F4F0',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Toaster position="top-center" richColors toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" } }} />
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {activeTab === 'events' && <EventsPage />}
        {activeTab === 'neighbours' && <NeighboursPage />}
        {activeTab === 'help' && <HelpSharePage />}
        {activeTab === 'profile' && <ProfilePage />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}