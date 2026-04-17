import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { NeighbourProfilePage, NeighbourProfile } from './pages/NeighbourProfilePage';

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
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [savedMarketplaceItems, setSavedMarketplaceItems] = useState<any[]>([]);
  const [initialRequestId, setInitialRequestId] = useState<number | undefined>(undefined);
  const [initialEventId, setInitialEventId] = useState<number | undefined>(undefined);
  const [initialMarketplaceItemId, setInitialMarketplaceItemId] = useState<number | undefined>(undefined);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [neighbourProfile, setNeighbourProfile] = useState<NeighbourProfile | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<any[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);
  const toggleRegisteredEvent = (id: number) => {
    setRegisteredEventIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const openNeighbourProfile = (profile: NeighbourProfile) => setNeighbourProfile(profile);

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

  const openExploreEvents = () => {
    setExploreInitialSubTab('events');
    setActiveTab('explore');
  };

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
        <SignUpPage onComplete={({ familyStatus, interests, spokenLanguages }) => {
          setUserInterests(interests);
          setUserLanguages(spokenLanguages);
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
        overflow: 'hidden',
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
            onOpenExploreEvents={openExploreEvents}
            onOpenGroups={openExploreGroups}
            onOpenGroupChat={openGroupChat}
            joinedGroups={joinedGroups}
            registeredEventIds={registeredEventIds}
            onToggleRegister={toggleRegisteredEvent}
            onOpenMarketplace={() => setActiveTab('marketplace')}
            savedEvents={savedEvents}
            onOpenNeighbours={openExploreNeighbours}
            onOpenRequest={openRequest}
            onOpenNeighbourProfile={openNeighbourProfile}
            onSayHello={(neighbour) => {
              const conv = {
                id: Date.now(),
                type: 'direct',
                name: neighbour.name,
                avatar: neighbour.avatar || neighbour.name?.substring(0, 2) || '??',
                avatarBg: neighbour.color || '#8B5CF6',
                lastMessage: '👋 Say Hello!',
                time: 'Just now',
                unread: 0,
                tag: null,
              };
              onAddConversation(conv);
              setInitialGroupChatId(conv.id);
              setActiveTab('messages');
            }}
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
            onJoinGroup={(group) => {
              const convId = Date.now();
              const conv = {
                id: convId,
                type: 'group',
                name: group.name,
                avatar: group.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
                avatarBg: group.categoryColor || '#FF6B47',
                lastMessage: `Welcome to ${group.name}! Say hi 👋`,
                time: 'Just now',
                unread: 1,
                tag: group.category,
                memberCount: group.members,
                meetFrequency: group.meetFrequency,
                location: group.location,
                imageUrl: group.image,
              };
              onAddConversation(conv);
              setJoinedGroups(prev => {
                if (prev.some(g => g.id === group.id)) return prev;
                return [...prev, { ...group, convId }];
              });
              setInitialGroupChatId(convId);
              setActiveTab('messages');
            }}
            registeredEventIds={registeredEventIds}
            onToggleRegister={toggleRegisteredEvent}
            onNavVisibilityChange={setShowBottomNav}
            onOpenNeighbourProfile={openNeighbourProfile}
          />
        )}
        {activeTab === 'marketplace' && (
          <HelpSharePage
            onAddPost={onAddPost}
            initialItemId={initialMarketplaceItemId}
            savedItems={savedMarketplaceIds}
            onSaveToggle={onMarketplaceSaveToggle}
            onNavVisibilityChange={setShowBottomNav}
            onOpenChat={(item) => {
              const isService = item?.itemType === 'service';
              const personName = item?.provider?.name || item?.seller?.name || 'Neighbour';
              const conv = {
                id: Date.now(),
                type: 'marketplace',
                name: item?.name || item?.title || (isService ? 'Service' : 'Marketplace Item'),
                subtitle: personName,
                avatar: (item?.name || item?.title || 'M').slice(0, 2).toUpperCase(),
                avatarBg: isService ? '#7C3AED' : '#3B82F6',
                lastMessage: isService ? 'Hi! Is this service still available?' : 'Hi! Is this still available?',
                time: 'Just now',
                unread: 0,
                tag: isService ? 'Service' : 'Item',
              };
              onAddConversation(conv);
              setInitialGroupChatId(conv.id);
              setActiveTab('messages');
            }}
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
            onOpenNeighbourProfile={openNeighbourProfile}
            onNewGroup={openExploreGroups}
            onNewNeighbour={openExploreNeighbours}
            onOpenMarketplaceListing={(id) => {
              setInitialMarketplaceItemId(id);
              setActiveTab('marketplace');
            }}
            onOpenRequestListing={(id) => {
              setInitialRequestId(id);
              setActiveTab('requests');
            }}
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

      {/* Neighbour Profile Overlay */}
      <AnimatePresence>
        {neighbourProfile && (
          <motion.div
            key="neighbour-profile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'absolute', inset: 0, zIndex: 110 }}
          >
            <NeighbourProfilePage
              profile={neighbourProfile}
              onBack={() => setNeighbourProfile(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
            userLanguages={userLanguages}
            onUpdateLanguages={setUserLanguages}
            savedMarketplaceItems={savedMarketplaceItems}
          />
        </div>
      )}
    </div>
  );
}
