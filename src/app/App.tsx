import { useState } from 'react';
import { Toaster } from 'sonner';
import { BottomNav } from './components/BottomNav';
import { EventsPage } from './pages/EventsPage';
import { ExplorePage } from './pages/ExplorePage';
import { HelpSharePage } from './pages/HelpSharePage';
import { RequestsPage } from './pages/RequestsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';

type AuthScreen = 'login' | 'signup' | 'main';
type ActiveTab = 'events' | 'explore' | 'marketplace' | 'requests' | 'messages';

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');
  const [exploreInitialSubTab, setExploreInitialSubTab] = useState<'events' | 'groups' | 'neighbours'>('events');
  const [showProfile, setShowProfile] = useState(false);
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [initialGroupChatId, setInitialGroupChatId] = useState<number | undefined>(undefined);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [savedMarketplaceItems, setSavedMarketplaceItems] = useState<any[]>([]);
  const [initialRequestId, setInitialRequestId] = useState<number | undefined>(undefined);
  const [initialEventId, setInitialEventId] = useState<number | undefined>(undefined);
  const [initialMarketplaceItemId, setInitialMarketplaceItemId] = useState<number | undefined>(undefined);
  const [showBottomNav, setShowBottomNav] = useState(true);

  const onAddPost = (post: any) => setMyPosts(prev => [post, ...prev]);
  const onAddConversation = (conv: any) => setConversations(prev => [conv, ...prev]);

  const onMarketplaceSaveToggle = (id: number, item: any) => {
    setSavedMarketplaceItems(prev => {
      const exists = prev.some(i => i.id === id);
      if (exists) return prev.filter(i => i.id !== id);
      return item ? [item, ...prev] : prev;
    });
  };
  const savedMarketplaceIds = savedMarketplaceItems.map(i => i.id);

  const openExploreGroups = () => {
    setExploreInitialSubTab('groups');
    setActiveTab('explore');
  };

  const openExploreNeighbours = () => {
    setExploreInitialSubTab('neighbours');
    setActiveTab('explore');
  };

  const openGroupChat = (groupId: number) => {
    setInitialGroupChatId(groupId);
    setActiveTab('messages');
  };

  const openRequest = (id: number) => {
    setInitialRequestId(id || undefined);
    setActiveTab('requests');
  };

  // ---- Auth flow ----
  if (authScreen === 'login') {
    return (
      <div style={{ width: '100vw', height: '100svh', fontFamily: "'Nunito', sans-serif" }}>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'Nunito', sans-serif" } }}
        />
        <LoginPage onLogin={() => setAuthScreen('signup')} />
      </div>
    );
  }

  if (authScreen === 'signup') {
    return (
      <div style={{ width: '100vw', height: '100svh', fontFamily: "'Nunito', sans-serif" }}>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'Nunito', sans-serif" } }}
        />
        <SignUpPage onComplete={({ familyStatus, interests, spokenLanguage }) => {
          setUserInterests(interests);
          setAuthScreen('main');
        }} />
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
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <Toaster
        position="top-center"
        richColors
        toastOptions={{ style: { borderRadius: '16px', fontSize: '14px', fontFamily: "'Nunito', sans-serif" } }}
      />

      {/* Content fills full height — nav floats on top */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {activeTab === 'events' && (
          <EventsPage
            onOpenProfile={() => setShowProfile(true)}
            onOpenEvent={(id) => { setActiveTab('explore'); }}
            onOpenGroups={openExploreGroups}
            onOpenGroupChat={openGroupChat}
            onOpenMarketplace={() => setActiveTab('marketplace')}
            savedEvents={savedEvents}
            onOpenNeighbours={openExploreNeighbours}
            onOpenRequest={openRequest}
          />
        )}
        {activeTab === 'explore' && (
          <ExplorePage
            key={initialEventId}
            initialEventId={initialEventId}
            initialSubTab={exploreInitialSubTab}
            onSubTabChange={setExploreInitialSubTab}
            userInterests={userInterests}
            onAddConversation={onAddConversation}
            onOpenDirectChat={(conv) => {
              onAddConversation(conv);
              setInitialGroupChatId(conv.id);
              setActiveTab('messages');
            }}
            onNavVisibilityChange={setShowBottomNav}
          />
        )}
        {activeTab === 'marketplace' && (
          <HelpSharePage
            onAddPost={onAddPost}
            initialItemId={initialMarketplaceItemId}
            savedItems={savedMarketplaceIds}
            onSaveToggle={onMarketplaceSaveToggle}
            onNavVisibilityChange={setShowBottomNav}
          />
        )}
        {activeTab === 'requests' && (
          <RequestsPage key={initialRequestId} onAddPost={onAddPost} initialRequestId={initialRequestId} onNavVisibilityChange={setShowBottomNav} />
        )}
        {activeTab === 'messages' && (
          <MessagesPage
            initialConvId={initialGroupChatId}
            key={initialGroupChatId}
            extraConversations={conversations}
            onNavVisibilityChange={setShowBottomNav}
          />
        )}

        {/* Gradient fade — sits under the nav, fades content into it */}
        {showBottomNav && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '140px',
              pointerEvents: 'none',
              zIndex: 40,
              background: `linear-gradient(
                to bottom,
                transparent            0%,
                rgba(245,244,240,0.18) 28%,
                rgba(245,244,240,0.52) 55%,
                rgba(245,244,240,0.82) 76%,
                rgba(245,244,240,0.96) 100%
              )`,
            }}
          />
        )}

        {/* Floating nav — overlays content */}
        {showBottomNav && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <BottomNav activeTab={activeTab} onTabChange={(tab) => { setShowBottomNav(true); setActiveTab(tab); }} />
            </div>
          </div>
        )}
      </div>

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
              setInitialEventId(id);
              setExploreInitialSubTab('events');
              setActiveTab('explore');
            }}
            onOpenMarketplaceItem={(id) => {
              setShowProfile(false);
              setInitialMarketplaceItemId(id);
              setActiveTab('marketplace');
            }}
            onOpenRequest={(id) => {
              setShowProfile(false);
              openRequest(id);
            }}
            myPosts={myPosts}
            userInterests={userInterests}
            onUpdateInterests={setUserInterests}
            savedMarketplaceItems={savedMarketplaceItems}
          />
        </div>
      )}
    </div>
  );
}
