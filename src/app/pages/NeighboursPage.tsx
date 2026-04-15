import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Shield, Users, Hash, MessageCircle, Plus, X, Send, Compass, ChevronRight, MapPin, ClipboardList, Target } from 'lucide-react';
import { toast } from 'sonner';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

type NeighbourScreen = 'feed' | 'tag-setup' | 'profile' | 'invite' | 'chat' | 'group-create' | 'group-space' | 'group-discovery';

interface Neighbour {
  id: number; name: string; avatarUrl: string;
  sharedInterests: string[]; allInterests: string[];
  sharedCount: number; proximity: string; distance: string; verified: boolean; avatarColor: string;
}

interface Group {
  id: number; name: string; tag: string; members: number; activity: string; joined: boolean;
}

interface NavFrame { screen: NeighbourScreen; params?: any; }

const ALL_INTERESTS = ['Running', 'Gardening', 'Board Games', 'Cooking', 'Reading', 'Cycling', 'Pets', 'Photography', 'Music', 'Fitness', 'Hiking', 'Yoga'];

const NEIGHBOURS: Neighbour[] = [
  { id: 1, name: 'Alex Lim',    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop', sharedInterests: ['Running', 'Photography'], allInterests: ['Running', 'Photography', 'Cooking', 'Travel'],   sharedCount: 2, proximity: 'Blk 445', distance: '0.1 km', verified: true, avatarColor: '#8B5CF6' },
  { id: 2, name: 'Priya Nair',  avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop', sharedInterests: ['Gardening', 'Cooking'], allInterests: ['Gardening', 'Cooking', 'Reading', 'Yoga'],         sharedCount: 2, proximity: 'Blk 447', distance: '0.3 km', verified: true, avatarColor: '#06B6D4' },
  { id: 3, name: 'Wei Ming',    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', sharedInterests: ['Board Games', 'Cycling'], allInterests: ['Board Games', 'Cycling', 'Music', 'Photography'], sharedCount: 2, proximity: 'Blk 445', distance: '0.1 km', verified: true, avatarColor: '#F97316' },
  { id: 4, name: 'Siti Rahah',  avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop', sharedInterests: ['Cooking'], allInterests: ['Cooking', 'Fitness', 'Pets', 'Hiking'],                       sharedCount: 1, proximity: 'Blk 449', distance: '0.5 km', verified: true, avatarColor: '#22C55E' },
  { id: 5, name: 'Rajan Kumar', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', sharedInterests: ['Running', 'Fitness'], allInterests: ['Running', 'Fitness', 'Cycling', 'Reading'],         sharedCount: 2, proximity: 'Blk 445', distance: '0.1 km', verified: true, avatarColor: '#EC4899' },
  { id: 6, name: 'Hannah Lee',  avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop', sharedInterests: ['Music'], allInterests: ['Music', 'Photography', 'Board Games', 'Cooking'],                sharedCount: 1, proximity: 'Blk 451', distance: '0.6 km', verified: true, avatarColor: '#EAB308' },
];

const GROUPS: Group[] = [
  { id: 1, name: 'Morning Runners', tag: 'Running', members: 12, activity: 'Next run: Sat 7 AM at Bishan Park', joined: false },
  { id: 2, name: 'Backyard Gardeners', tag: 'Gardening', members: 8, activity: 'Community garden session: Sat 8 AM', joined: true },
  { id: 3, name: 'Board Game Sundays', tag: 'Board Games', members: 15, activity: 'Next session: Sun 2 PM at RC Hall', joined: false },
];

const JIO_PROMPTS = [
  'Want to run together sometime? 🏃',
  'Anyone up for a board game weekend? 🎲',
  'Looking for a cycling buddy nearby 🚴',
  'Want to swap gardening tips? 🌿',
  'Morning walk catch-up? ☀️',
  'Coffee with a neighbour? ☕',
];

const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:      { bg: '#FFF0EC', text: '#FF6B47' },
  Gardening:    { bg: '#D1FAE5', text: '#059669' },
  'Board Games':{ bg: '#EDE9FE', text: '#7C3AED' },
  Cooking:      { bg: '#FEF3C7', text: '#D97706' },
  Reading:      { bg: '#DBEAFE', text: '#2563EB' },
  Cycling:      { bg: '#CCFBF1', text: '#0D9488' },
  Pets:         { bg: '#FEF9C3', text: '#CA8A04' },
  Photography:  { bg: '#FAE8FF', text: '#A21CAF' },
  Music:        { bg: '#FFE4E6', text: '#E11D48' },
  Fitness:      { bg: '#DCFCE7', text: '#16A34A' },
  Hiking:       { bg: '#D1FAE5', text: '#059669' },
  Yoga:         { bg: '#F3E8FF', text: '#9333EA' },
};

export function NeighboursPage() {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const [firstVisit, setFirstVisit] = useState(true);
  const [myInterests, setMyInterests] = useState<string[]>(['Running', 'Photography']);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'them', text: 'Hey! Saw your Jio invite — sounds like fun!', time: '10:32 AM' },
    { id: 2, from: 'me', text: "Yes! Let's plan a run this Saturday morning 🏃", time: '10:33 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [groupMessages, setGroupMessages] = useState([
    { id: 1, sender: 'A', text: 'Who\'s joining this Saturday at 7 AM?', time: '9:15 AM' },
    { id: 2, sender: 'B', text: 'I\'m in! Meeting at pavilion right? 🙋', time: '9:18 AM' },
    { id: 3, sender: 'me', text: 'Count me in too! See you all there 💪', time: '9:20 AM' },
  ]);
  const [groupInput, setGroupInput] = useState('');
  const [groups, setGroups] = useState<Group[]>(GROUPS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showGroupDisc, setShowGroupDisc] = useState(false);

  const current = navStack[navStack.length - 1];
  const goTo = (screen: NeighbourScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);
  const currentNeighbour: Neighbour = current.params?.neighbour || NEIGHBOURS[0];

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { id: Date.now(), from: 'me', text: chatInput, time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };
  const sendGroupMsg = () => {
    if (!groupInput.trim()) return;
    setGroupMessages(p => [...p, { id: Date.now(), sender: 'me', text: groupInput, time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) }]);
    setGroupInput('');
  };

  const renderScreen = () => {
    switch (current.screen) {
      case 'feed':
        if (firstVisit) return <TagSetupScreen myInterests={myInterests} onToggle={t => setMyInterests(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])} onConfirm={() => setFirstVisit(false)} />;
        return (
          <NeighboursFeed
            neighbours={NEIGHBOURS} activeFilter={activeFilter} myInterests={myInterests}
            onFilterChange={setActiveFilter}
            onSelectNeighbour={n => goTo('profile', { neighbour: n })}
            onDiscoverGroups={() => setShowGroupDisc(true)}
            groups={groups}
            onOpenGroup={g => goTo('group-space', { group: g })}
          />
        );
      case 'profile':
        return (
          <NeighbourProfile
            neighbour={currentNeighbour} onBack={goBack}
            onJio={() => { setSelectedPrompt(''); goTo('invite', { neighbour: currentNeighbour }); }}
          />
        );
      case 'invite':
        return (
          <InviteFlow
            neighbour={currentNeighbour} selectedPrompt={selectedPrompt}
            onSelectPrompt={setSelectedPrompt} onBack={goBack}
            onSend={() => {
              toast.success('Invite sent! We\'ll notify your neighbour');
              setTimeout(() => goTo('chat', { neighbour: currentNeighbour }), 1000);
            }}
          />
        );
      case 'chat':
        return (
          <InAppChat
            neighbour={currentNeighbour} messages={chatMessages}
            input={chatInput} onInputChange={setChatInput} onSend={sendChat}
            onBack={goBack} onCreateGroup={() => goTo('group-create')}
          />
        );
      case 'group-create':
        return <GroupCreateScreen onBack={goBack} onCreateGroup={(g: any) => {
          const newGroup = { id: Date.now(), name: g.name, tag: g.tag, members: 2, activity: 'Just started!', joined: true };
          setGroups(p => [...p, newGroup]);
          toast.success(`Group "${g.name}" created!`);
          goTo('group-space', { group: newGroup });
        }} />;
      case 'group-space':
        return <GroupSpace group={current.params?.group || groups.find(g => g.joined) || groups[0]} messages={groupMessages} input={groupInput} onInputChange={setGroupInput} onSend={sendGroupMsg} onBack={goBack} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Nunito', sans-serif" }}>
      {renderScreen()}
      <AnimatePresence>
        {showGroupDisc && (
          <GroupDiscovery groups={groups} onClose={() => setShowGroupDisc(false)} onJoin={(id) => {
            setGroups(p => p.map(g => g.id === id ? { ...g, joined: true } : g));
            toast.success('You\'ve joined the group!');
          }} onOpenGroup={(g) => { setShowGroupDisc(false); goTo('group-space', { group: g }); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Tag Setup ----
function TagSetupScreen({ myInterests, onToggle, onConfirm }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '44px 24px 0' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Hash size={26} color={PRIMARY} />
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: TEXT, marginBottom: '8px', lineHeight: '1.2' }}>What are you into?</div>
        <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.6', marginBottom: '28px' }}>Select your interests so we can match you with neighbours who share them.</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {ALL_INTERESTS.map(t => {
            const sel = myInterests.includes(t);
            const colors = INTEREST_COLORS[t] || { bg: '#FFF0EC', text: PRIMARY };
            return (
              <button key={t} onClick={() => onToggle(t)} style={{
                padding: '10px 18px', borderRadius: '24px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                border: `2px solid ${sel ? colors.text : BORDER}`,
                background: sel ? colors.bg : CARD,
                color: sel ? colors.text : TEXT2,
                fontWeight: sel ? 700 : 400, transition: 'all 0.15s',
              }}>{t}</button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '16px 24px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={onConfirm} disabled={myInterests.length === 0} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: myInterests.length > 0 ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: myInterests.length > 0 ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: myInterests.length > 0 ? 'pointer' : 'not-allowed', boxShadow: myInterests.length > 0 ? '0 8px 24px rgba(255,107,71,0.35)' : 'none', fontFamily: 'inherit' }}>
          Find Neighbours · {myInterests.length} selected
        </button>
      </div>
    </div>
  );
}

// ---- Neighbours Feed ----
function NeighboursFeed({ neighbours, activeFilter, myInterests, onFilterChange, onSelectNeighbour, onDiscoverGroups, groups, onOpenGroup }: any) {
  const filterTags = ['All', ...Array.from(new Set(neighbours.flatMap((n: Neighbour) => n.sharedInterests)))];
  const shown = activeFilter === 'All' ? neighbours : neighbours.filter((n: Neighbour) => n.sharedInterests.includes(activeFilter));
  const myGroup = (groups as Group[]).find(g => g.joined);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <MapPin size={12} color={MUTED} strokeWidth={2} />
              <span style={{ fontSize: '12px', color: MUTED }}>Bishan-AMK Estate</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, lineHeight: 1.15 }}>Neighbours</div>
          </div>
          <button
            onClick={onDiscoverGroups}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '22px', background: '#FFF0EC', border: `1.5px solid #FFCAB8`, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <Compass size={15} color={PRIMARY} />
            <span style={{ fontSize: '13px', color: PRIMARY, fontWeight: 700 }}>Groups</span>
          </button>
        </div>

        {/* My interests pills */}
        <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px', marginBottom: '12px', scrollbarWidth: 'none' } as any}>
          <span style={{ fontSize: '11px', color: MUTED, fontWeight: 600, flexShrink: 0, alignSelf: 'center' }}>My interests:</span>
          {myInterests.map((t: string) => {
            const colors = INTEREST_COLORS[t] || { bg: '#FFF0EC', text: PRIMARY };
            return (
              <span key={t} style={{ flexShrink: 0, padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: colors.bg, color: colors.text }}>
                {t}
              </span>
            );
          })}
        </div>

        {/* Filter scroll */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' } as any}>
          {(filterTags as string[]).map(tag => (
            <button key={tag} onClick={() => onFilterChange(tag)} style={{
              padding: '7px 16px', borderRadius: '22px', fontSize: '13px', whiteSpace: 'nowrap', fontFamily: 'inherit',
              border: `1.5px solid ${activeFilter === tag ? TEXT : BORDER}`,
              background: activeFilter === tag ? TEXT : 'transparent',
              color: activeFilter === tag ? 'white' : TEXT2,
              fontWeight: activeFilter === tag ? 700 : 400,
              cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s',
            }}>{tag}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        {/* My active group banner */}
        {myGroup && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenGroup(myGroup)}
            style={{ background: `linear-gradient(135deg, #8B5CF6, #6D28D9)`, borderRadius: '22px', padding: '18px 20px', marginBottom: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
                  Your Group
                </div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'white', marginBottom: '5px' }}>{myGroup.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                  📅 {myGroup.activity}
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '13px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={18} color="white" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Matches — horizontal scroll */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: PRIMARY }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Top Matches · {shown.length} neighbours
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' } as any}>
            {(shown as Neighbour[]).slice(0, 4).map(n => (
              <MatchCard key={n.id} neighbour={n} onTap={() => onSelectNeighbour(n)} />
            ))}
          </div>
        </div>

        {/* All neighbours vertical list */}
        {shown.length > 4 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', marginTop: '4px' }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: MUTED }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                More Neighbours
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(shown as Neighbour[]).slice(4).map(n => (
                <NeighbourCard key={n.id} neighbour={n} onTap={() => onSelectNeighbour(n)} />
              ))}
            </div>
          </>
        )}

        {shown.length <= 4 && shown.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            {(shown as Neighbour[]).slice(0).map(n => (
              <NeighbourCard key={`list-${n.id}`} neighbour={n} onTap={() => onSelectNeighbour(n)} />
            ))}
          </div>
        )}

        <div style={{ height: '20px' }} />
      </div>
    </div>
  );
}

// ---- Match Card (horizontal scroll) — reference style ----
function MatchCard({ neighbour: n, onTap }: { neighbour: Neighbour; onTap: () => void }) {
  const topInterest = n.sharedInterests[0];
  const colors = topInterest ? (INTEREST_COLORS[topInterest] || { bg: '#FFF0EC', text: PRIMARY }) : { bg: '#FFF0EC', text: PRIMARY };

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onTap}
      style={{
        flexShrink: 0, width: '160px', background: CARD, borderRadius: '20px',
        padding: '14px', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'visible',
      }}
    >
      {/* Category tag — top-left sticker */}
      <div style={{
        position: 'absolute', top: '-10px', left: '10px',
        padding: '4px 10px', borderRadius: '8px',
        background: colors.bg, color: colors.text,
        fontSize: '11px', fontWeight: 700,
        transform: 'rotate(-1.5deg)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        zIndex: 1,
      }}>
        {topInterest}
      </div>

      {/* Photo */}
      <div style={{ width: '100%', height: '110px', borderRadius: '14px', overflow: 'hidden', background: n.avatarColor, marginTop: '6px' }}>
        <img src={n.avatarUrl} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Name */}
      <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, lineHeight: 1.2 }}>{n.name}</div>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <MapPin size={11} color={MUTED} strokeWidth={2} />
        <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{n.proximity} · {n.distance}</span>
      </div>

      {/* Say Hello button */}
      <button
        onClick={e => { e.stopPropagation(); onTap(); }}
        style={{
          width: '100%', padding: '8px 0', borderRadius: '12px',
          background: 'white', border: `1.5px solid ${PRIMARY}`,
          color: TEXT, fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
        }}
      >
        👋 Say Hello
      </button>
    </motion.div>
  );
}

// ---- Neighbour Card (vertical list) — reference style ----
function NeighbourCard({ neighbour: n, onTap }: { neighbour: Neighbour; onTap: () => void }) {
  const topInterest = n.sharedInterests[0];
  const colors = topInterest ? (INTEREST_COLORS[topInterest] || { bg: '#FFF0EC', text: PRIMARY }) : { bg: '#FFF0EC', text: PRIMARY };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      style={{
        background: CARD, borderRadius: '20px', padding: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
        position: 'relative', overflow: 'visible',
      }}
    >
      {/* Category sticker tag */}
      <div style={{
        position: 'absolute', top: '-10px', left: '14px',
        padding: '4px 12px', borderRadius: '8px',
        background: colors.bg, color: colors.text,
        fontSize: '11px', fontWeight: 700,
        transform: 'rotate(-1.5deg)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        zIndex: 1,
      }}>
        {topInterest}
      </div>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginTop: '8px' }}>
        {/* Square photo */}
        <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, background: n.avatarColor }}>
          <img src={n.avatarUrl} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Right side info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT, marginBottom: '4px', lineHeight: 1.2 }}>{n.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
            <MapPin size={13} color={MUTED} strokeWidth={1.8} />
            <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{n.proximity} · {n.distance}</span>
          </div>

          {/* Say Hello button */}
          <button
            onClick={e => { e.stopPropagation(); onTap(); }}
            style={{
              width: '100%', padding: '10px 0', borderRadius: '14px',
              background: 'white', border: `1.5px solid ${PRIMARY}`,
              color: TEXT, fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            👋 Say Hello
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Neighbour Profile ----
function NeighbourProfile({ neighbour: n, onBack, onJio }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 20px 22px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '76px', height: '76px', borderRadius: '24px', background: n.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '30px', fontWeight: 800, color: 'white' }}>N{n.id}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: TEXT }}>Neighbour #{n.id}</span>
              {n.verified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 10px', borderRadius: '10px', background: '#DCFCE7', fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                  <Shield size={10} /> Verified
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: MUTED, fontWeight: 500 }}>
              <MapPin size={12} color={MUTED} strokeWidth={2} />
              {n.proximity}
            </div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
        {/* Shared interests */}
        <div style={{ background: CARD, borderRadius: '22px', padding: '20px', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '14px' }}>
            🤝 {n.sharedCount} Shared Interests
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {n.sharedInterests.map((i: string) => {
              const c = INTEREST_COLORS[i] || { bg: '#FFF0EC', text: PRIMARY };
              return (
                <span key={i} style={{ padding: '8px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, background: c.bg, color: c.text, border: `1.5px solid ${c.text}25` }}>
                  ✓ {i}
                </span>
              );
            })}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Also into</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {n.allInterests.filter((i: string) => !n.sharedInterests.includes(i)).map((i: string) => (
              <span key={i} style={{ padding: '7px 14px', borderRadius: '14px', fontSize: '13px', background: BG, color: MUTED, fontWeight: 500 }}>{i}</span>
            ))}
          </div>
        </div>
        <div style={{ background: '#F0FDF4', borderRadius: '18px', padding: '15px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Shield size={16} color="#22C55E" style={{ marginTop: '1px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#15803D', lineHeight: '1.55', fontWeight: 500 }}>No personal details shared until you both confirm a connection.</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 20px 32px', background: CARD, borderTop: `1px solid ${BG}` }}>
        <button onClick={onJio} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,71,0.35)', marginBottom: '10px', fontFamily: 'inherit' }}>
          Jio This Neighbour ��
        </button>
        <button style={{ width: '100%', padding: '13px', borderRadius: '18px', background: 'none', border: `1.5px solid ${BORDER}`, color: TEXT2, fontWeight: 500, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Not Now
        </button>
      </div>
    </div>
  );
}

// ---- Invite Flow ----
function InviteFlow({ neighbour: n, selectedPrompt, onSelectPrompt, onBack, onSend }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '44px 20px 20px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>Send an Invite</div>
        <div style={{ fontSize: '14px', color: TEXT2 }}>Choose a casual prompt to start the conversation</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {JIO_PROMPTS.map(prompt => {
            const sel = selectedPrompt === prompt;
            return (
              <button key={prompt} onClick={() => onSelectPrompt(prompt)} style={{
                padding: '17px 18px', borderRadius: '18px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                border: `2px solid ${sel ? PRIMARY : BORDER}`,
                background: sel ? '#FFF0EC' : BG,
                color: sel ? PRIMARY : TEXT,
                fontWeight: sel ? 600 : 400, fontSize: '14px', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{prompt}</span>
                {sel && <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                </div>}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={onSend} disabled={!selectedPrompt} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: selectedPrompt ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: selectedPrompt ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: selectedPrompt ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', boxShadow: selectedPrompt ? '0 8px 24px rgba(255,107,71,0.35)' : 'none' }}>
          <Send size={17} /> Send Invite
        </button>
        <button onClick={onBack} style={{ width: '100%', padding: '12px', marginTop: '8px', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: '14px', fontFamily: 'inherit' }}>Cancel</button>
      </div>
    </div>
  );
}

// ---- In-App Chat ----
function InAppChat({ neighbour: n, messages, input, onInputChange, onSend, onBack, onCreateGroup }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: n.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>N{n.id}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>Neighbour #{n.id}</span>
              <Shield size={12} color="#22C55E" />
            </div>
            <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{n.proximity}</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg: any) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '75%' }}>
              <div style={{ padding: '11px 15px', borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.from === 'me' ? PRIMARY : CARD, color: msg.from === 'me' ? 'white' : TEXT, fontSize: '14px', lineHeight: '1.5', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontWeight: 400 }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '10px', color: MUTED, marginTop: '3px', textAlign: msg.from === 'me' ? 'right' : 'left', paddingLeft: msg.from === 'me' ? 0 : '4px', paddingRight: msg.from === 'me' ? '4px' : 0 }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <button onClick={onCreateGroup} style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '22px', background: CARD, border: `1.5px solid ${BORDER}`, cursor: 'pointer', color: TEXT2, fontSize: '13px', marginTop: '4px', fontFamily: 'inherit' }}>
          <Users size={14} color={PRIMARY} /> Suggest creating a group
        </button>
      </div>
      <div style={{ padding: '12px 16px 24px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder="Type a message..." style={{ flex: 1, padding: '12px 18px', borderRadius: '22px', border: `1.5px solid ${BORDER}`, background: BG, fontSize: '14px', outline: 'none', color: TEXT, fontFamily: 'inherit' }} />
          <button onClick={onSend} style={{ width: '46px', height: '46px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(255,107,71,0.35)' }}>
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Group Create ----
function GroupCreateScreen({ onBack, onCreateGroup }: any) {
  const [name, setName] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [invited, setInvited] = useState<number[]>([]);
  const tags = ['Running', 'Gardening', 'Board Games', 'Cooking', 'Cycling', 'Music'];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '44px 20px 20px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>Create a Group</div>
        <div style={{ fontSize: '14px', color: TEXT2 }}>Connect with neighbours around shared interests</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>Group Name</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Morning Runners" style={{ width: '100%', padding: '14px 18px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Interest Tag</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map(t => {
              const sel = selectedTag === t;
              const c = INTEREST_COLORS[t] || { bg: '#FFF0EC', text: PRIMARY };
              return (
                <button key={t} onClick={() => setSelectedTag(sel ? '' : t)} style={{ padding: '8px 18px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `2px solid ${sel ? c.text : BORDER}`, background: sel ? c.bg : 'transparent', color: sel ? c.text : TEXT2, fontWeight: sel ? 700 : 400 }}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Invite Connections</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {NEIGHBOURS.slice(0, 4).map(n => (
              <div key={n.id} onClick={() => setInvited(p => p.includes(n.id) ? p.filter(x => x !== n.id) : [...p, n.id])} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: '16px', background: invited.includes(n.id) ? '#FFF0EC' : BG, cursor: 'pointer', border: `1.5px solid ${invited.includes(n.id) ? PRIMARY : 'transparent'}`, transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: n.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>N{n.id}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT }}>Neighbour #{n.id}</div>
                    <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{n.sharedInterests.slice(0, 2).join(' · ')}</div>
                  </div>
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${invited.includes(n.id) ? PRIMARY : BORDER}`, background: invited.includes(n.id) ? PRIMARY : CARD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {invited.includes(n.id) && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => name && selectedTag && onCreateGroup({ name, tag: selectedTag, invited })} disabled={!name || !selectedTag} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: name && selectedTag ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: name && selectedTag ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: name && selectedTag ? 'pointer' : 'not-allowed', fontFamily: 'inherit', boxShadow: name && selectedTag ? '0 8px 24px rgba(255,107,71,0.35)' : 'none' }}>
          Create Group
        </button>
      </div>
    </div>
  );
}

// ---- Group Space ----
function GroupSpace({ group, messages, input, onInputChange, onSend, onBack }: any) {
  const [activeTab, setActiveTab] = useState<'chat' | 'activity'>('chat');
  const getActivityIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'location': <MapPin size={20} color={PRIMARY} strokeWidth={2} />,
      'clipboard': <ClipboardList size={20} color={PRIMARY} strokeWidth={2} />,
      'target': <Target size={20} color={PRIMARY} strokeWidth={2} />,
    };
    return icons[iconName] || null;
  };

  const activities = [
    { id: 1, title: 'Next Meetup', detail: 'Saturday 7 AM · Bishan-AMK Park Pavilion', iconName: 'location' },
    { id: 2, title: 'Upcoming Plan', detail: 'Bring water and comfortable shoes', iconName: 'clipboard' },
    { id: 3, title: 'Group Goal', detail: 'Hit 5K in under 30 minutes together', iconName: 'target' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 20px 0', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: TEXT }}>{group.name}</div>
            <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{group.members} members · {group.tag}</div>
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: `2px solid ${BG}` }}>
          {(['chat', 'activity'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '10px 4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: `2.5px solid ${activeTab === tab ? PRIMARY : 'transparent'}`, marginBottom: '-2px',
              color: activeTab === tab ? PRIMARY : MUTED, fontWeight: activeTab === tab ? 700 : 500, fontSize: '14px',
              textTransform: 'capitalize',
            }}>{tab}</button>
          ))}
        </div>
      </div>
      {activeTab === 'chat' ? (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg: any) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-end' }}>
                  {!isMe && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `hsl(${msg.sender.charCodeAt(0) * 40}, 65%, 55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{msg.sender}</span>
                    </div>
                  )}
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{ padding: '11px 15px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? PRIMARY : CARD, color: isMe ? 'white' : TEXT, fontSize: '14px', lineHeight: '1.5', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: '10px', color: MUTED, marginTop: '3px', textAlign: isMe ? 'right' : 'left' }}>{msg.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px 16px 24px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder="Message group..." style={{ flex: 1, padding: '12px 18px', borderRadius: '22px', border: `1.5px solid ${BORDER}`, background: BG, fontSize: '14px', outline: 'none', color: TEXT, fontFamily: 'inherit' }} />
              <button onClick={onSend} style={{ width: '46px', height: '46px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(255,107,71,0.35)' }}>
                <Send size={18} color="white" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map(a => (
              <div key={a.id} style={{ background: CARD, borderRadius: '20px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getActivityIcon(a.iconName)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>{a.title}</div>
                  <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.45' }}>{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Group Discovery ----
function GroupDiscovery({ groups, onClose, onJoin, onOpenGroup }: any) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 10 }} onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: CARD, borderRadius: '28px 28px 0 0', zIndex: 20, maxHeight: '80%', overflowY: 'auto', fontFamily: "'Nunito', sans-serif" }}
      >
        <div style={{ padding: '16px 20px 32px' }}>
          <div style={{ width: '36px', height: '4px', background: BORDER, borderRadius: '4px', margin: '0 auto 22px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Discover Groups</div>
              <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500, marginTop: '2px' }}>Join neighbours with shared interests</div>
            </div>
            <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color={TEXT2} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(groups as Group[]).map(g => (
              <div key={g.id} style={{ background: BG, borderRadius: '20px', padding: '18px', border: g.joined ? `2px solid ${PRIMARY}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '3px' }}>{g.name}</div>
                    <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{g.members} members · #{g.tag}</div>
                  </div>
                  {g.joined ? (
                    <button onClick={() => onOpenGroup(g)} style={{ padding: '7px 14px', borderRadius: '20px', background: PRIMARY, border: 'none', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Open</button>
                  ) : (
                    <button onClick={() => onJoin(g.id)} style={{ padding: '7px 14px', borderRadius: '20px', background: CARD, border: `1.5px solid ${BORDER}`, color: TEXT, fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Join</button>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>📅 {g.activity}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
