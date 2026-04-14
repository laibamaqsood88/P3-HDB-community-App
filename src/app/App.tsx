import { useState } from 'react';
import { Toaster } from 'sonner';
import { BottomNav } from './components/BottomNav';
import { EventsPage } from './pages/EventsPage';
import { ExplorePage } from './pages/ExplorePage';
import { HelpSharePage } from './pages/HelpSharePage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

type AuthScreen = 'login' | 'signup' | 'main';
type ActiveTab = 'events' | 'explore' | 'marketplace' | 'messages';

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');
  const [exploreInitialSubTab, setExploreInitialSubTab] = useState<'events' | 'groups'>('events');
  const [showProfile, setShowProfile] = useState(false);
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const openExploreGroups = () => {
    setExploreInitialSubTab('groups');
    setActiveTab('explore');
  };

  // ---- Auth flow ----
  if (authScreen === 'login') {
    return (
      <div style={{ width: '100vw', height: '100svh', fontFamily: "'DM Sans', sans-serif" }}>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" } }}
        />
        <LoginPage onLogin={() => setAuthScreen('signup')} />
      </div>
    );
  }

  if (authScreen === 'signup') {
    return (
      <div style={{ width: '100vw', height: '100svh', fontFamily: "'DM Sans', sans-serif" }}>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" } }}
        />
        <SignUpPage onComplete={() => setAuthScreen('main')} />
      </div>
    );
  }

  // ---- Main app ----
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
      <Toaster
        position="top-center"
        richColors
        toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" } }}
      />

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {activeTab === 'events' && (
          <EventsPage
            onOpenProfile={() => setShowProfile(true)}
            onOpenEvent={(id) => { setActiveTab('explore'); }}
            onOpenGroups={openExploreGroups}
            savedEvents={savedEvents}
          />
        )}
        {activeTab === 'explore' && (
          <ExplorePage
            initialSubTab={exploreInitialSubTab}
            onSubTabChange={setExploreInitialSubTab}
          />
        )}
        {activeTab === 'marketplace' && (
          <HelpSharePage />
        )}
        {activeTab === 'messages' && <MessagesPage />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Profile Modal Overlay */}
      {showProfile && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
          }}
        >
          <ProfilePage
            onClose={() => setShowProfile(false)}
            onOpenEvent={(id) => {
              setShowProfile(false);
              setActiveTab('explore');
            }}
          />
        </div>
      )}
    </div>
  );
}
