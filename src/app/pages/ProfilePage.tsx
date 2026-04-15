import { useState } from 'react';
import { Shield, ChevronRight, Bell, Lock, HelpCircle, LogOut, Bookmark, Settings, X, Tag, FileText, MessageCircle, Trash2, RefreshCw, CheckCircle, Edit3, Search } from 'lucide-react';
import { INTEREST_CATEGORIES } from './SignUpPage';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

// ---- Types ----
interface ProfilePageProps {
  onOpenEvent?: (eventId: number) => void;
  onOpenMarketplaceItem?: (itemId: number) => void;
  onOpenRequest?: (requestId: number) => void;
  onClose?: () => void;
  myPosts?: any[];
  userInterests?: string[];
  onUpdateInterests?: (interests: string[]) => void;
  savedMarketplaceItems?: any[];
}

// ---- Mock Data ----
const MY_INTERESTS = ['Running', 'Photography', 'Cooking'];

const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:       { bg: '#FFF0EC', text: '#FF6B47' },
  Photography:   { bg: '#FAE8FF', text: '#A21CAF' },
  Cooking:       { bg: '#FEF3C7', text: '#D97706' },
  Gardening:     { bg: '#D1FAE5', text: '#059669' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  Cycling:       { bg: '#CCFBF1', text: '#0D9488' },
  Music:         { bg: '#FFE4E6', text: '#E11D48' },
};

const SAVED_ITEMS = [
  { id: 1, sourceId: 1, type: 'Event', title: 'Morning Run at Bishan-AMK Park', sub: 'Sat, 12 Apr', category: 'Fitness', categoryColor: '#16A34A', categoryBg: '#DCFCE7', image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 2, sourceId: 2, type: 'Event', title: 'Peranakan Cooking Workshop', sub: 'Sun, 13 Apr', category: 'Cooking', categoryColor: '#D97706', categoryBg: '#FEF3C7', image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 3, sourceId: 101, type: 'Item', title: 'IKEA Billy Bookshelf', sub: 'Free · Blk 445', category: 'Furniture', categoryColor: '#2563EB', categoryBg: '#DBEAFE', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 4, sourceId: 1, type: 'Request', title: 'Need someone to water my plants', sub: 'Free Request · Home Help', category: 'Request', categoryColor: '#7C3AED', categoryBg: '#EDE9FE', image: null },
];

const MY_POSTS = [
  { id: 1, sourceType: 'request', type: 'Request', emoji: '🪴', title: 'Plant watering while away', status: 'Active', statusBg: '#DCFCE7', statusColor: '#16A34A', expiresOn: '25 Apr 2026', isExpired: false, category: 'Home Help', description: 'Need someone to water my 4 potted plants while I\'m away. Easy — just water once every 2 days.' },
  { id: 2, sourceType: 'listing', type: 'Listing', emoji: '🪑', title: 'IKEA Side Table', status: 'In Progress', statusBg: '#FEF3C7', statusColor: '#D97706', expiresOn: null, isExpired: false, category: 'Furniture', description: 'White IKEA side table in good condition. Self-collect from Level 5.' },
  { id: 3, sourceType: 'request', type: 'Request', emoji: '🔧', title: 'Help fixing kitchen shelf', status: 'Expired', statusBg: '#FEE2E2', statusColor: '#DC2626', expiresOn: '1 Apr 2026', isExpired: true, category: 'Repairs', description: 'Looking for someone to help re-mount a kitchen shelf that fell.' },
];

const STATS = [
  { label: 'Items\nSaved', value: '4', emoji: '🔖', bg: '#FFF0EC', text: PRIMARY },
  { label: 'Neighbours\nJio\'d', value: '3', emoji: '👋', bg: '#EDE9FE', text: '#7C3AED' },
  { label: 'Exchanges\nDone', value: '5', emoji: '🤝', bg: '#D1FAE5', text: '#059669' },
];

const SETTINGS_ITEMS = [
  { Icon: Bell, label: 'Notification Preferences', sub: 'Manage alerts & reminders' },
  { Icon: Lock, label: 'Privacy & Data', sub: 'Control your visibility' },
  { Icon: Shield, label: 'Verification', sub: 'Singpass verified' },
  { Icon: HelpCircle, label: 'Help & Support', sub: 'FAQs & contact us' },
];

const BADGES = [
  {
    id: 1,
    emoji: '🎟️',
    name: 'Event Joiner',
    desc: 'Join your first event',
    unlocked: true,
    bg: '#FFF0EC',
    color: '#FF6B47',
  },
  {
    id: 2,
    emoji: '👥',
    name: 'Group Member',
    desc: 'Join an interest group',
    unlocked: true,
    bg: '#EDE9FE',
    color: '#7C3AED',
  },
  {
    id: 3,
    emoji: '🛍️',
    name: 'Trader',
    desc: '5 exchanges done',
    unlocked: true,
    bg: '#CCFBF1',
    color: '#0D9488',
  },
  {
    id: 4,
    emoji: '🌟',
    name: 'Community Builder',
    desc: 'Create a new group',
    unlocked: false,
    bg: '#F5F5F5',
    color: '#AEAEB2',
  },
];

// ---- Main Component ----
export function ProfilePage({ onOpenEvent, onOpenMarketplaceItem, onOpenRequest, onClose, myPosts = [], userInterests = MY_INTERESTS, onUpdateInterests, savedMarketplaceItems = [] }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'settings' | 'saved-items' | 'my-posts'>('main');
  const [showInterestEdit, setShowInterestEdit] = useState(false);
  const [draftInterests, setDraftInterests] = useState<string[]>(userInterests);

  const toggleDraft = (item: string) =>
    setDraftInterests(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const saveInterests = () => {
    onUpdateInterests?.(draftInterests);
    setShowInterestEdit(false);
  };

  if (activeSection === 'settings') {
    return <SettingsScreen onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'my-posts') {
    const newPosts = myPosts.map((p: any) => ({
      id: p.id,
      sourceType: p.type,
      type: p.type === 'listing' ? 'Listing' : p.type === 'service' ? 'Service' : 'Request',
      emoji: p.emoji || '📋',
      title: p.title,
      status: p.status || 'Active',
      statusBg: '#DCFCE7',
      statusColor: '#16A34A',
      expiresOn: p.date || null,
      isExpired: false,
      category: p.category || '',
      description: '',
    }));
    return <MyPostsScreen onBack={() => setActiveSection('main')} posts={[...newPosts, ...MY_POSTS]} />;
  }

  if (activeSection === 'saved-items') {
    return (
      <SavedItemsScreen
        onBack={() => setActiveSection('main')}
        onOpenEvent={onOpenEvent}
        onOpenMarketplaceItem={onOpenMarketplaceItem}
        onOpenRequest={onOpenRequest}
        savedMarketplaceItems={savedMarketplaceItems}
      />
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero Header */}
      <div style={{ background: `linear-gradient(150deg, #FF6B47 0%, #FF9068 60%, #FFB08A 100%)`, padding: '52px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        {/* Close button (when shown as overlay) */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '54px', left: '20px', width: '38px', height: '38px',
              borderRadius: '13px', background: 'rgba(255,255,255,0.2)', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)', zIndex: 2,
            }}
          >
            <X size={18} color="white" />
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={() => setActiveSection('settings')}
          style={{
            position: 'absolute', top: '54px', right: '20px', width: '38px', height: '38px',
            borderRadius: '13px', background: 'rgba(255,255,255,0.2)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Settings size={18} color="white" />
        </button>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '20px', marginTop: onClose ? '52px' : '0' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '26px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '34px', fontWeight: 800, color: 'white', lineHeight: 1 }}>Y</span>
            </div>
            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '24px', height: '24px', borderRadius: '50%', background: '#22C55E', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={11} color="white" />
            </div>
          </div>
          <div style={{ paddingBottom: '6px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>You</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', width: 'fit-content' }}>
              <Shield size={11} color="rgba(255,255,255,0.9)" />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Singpass Verified</span>
            </div>
          </div>
        </div>

        {/* Estate pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 13px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', marginBottom: '22px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>📍 Bishan-AMK Estate</span>
        </div>

      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 32px' }}>

        {/* My Interests */}
        <div style={{ marginBottom: '24px' }}>
          <SectionHeader label="My Interests" count={userInterests.length} />
          <div style={{ background: CARD, borderRadius: '22px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {userInterests.map(i => {
                const c = INTEREST_COLORS[i] || { bg: '#FFF0EC', text: PRIMARY };
                return (
                  <span key={i} style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 700, background: c.bg, color: c.text }}>
                    {i}
                  </span>
                );
              })}
              <button
                onClick={() => { setDraftInterests(userInterests); setShowInterestEdit(true); }}
                style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, background: BG, color: MUTED, border: `1.5px dashed ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                + Edit
              </button>
            </div>
          </div>
        </div>

        {/* Rewards & Badges */}
        <div style={{ marginBottom: '24px' }}>
          <SectionHeader label="Rewards & Badges" count={BADGES.filter(b => b.unlocked).length} />
          <div style={{ background: CARD, borderRadius: '22px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {BADGES.map(badge => (
                <div
                  key={badge.id}
                  style={{
                    borderRadius: '16px',
                    padding: '14px 12px',
                    background: badge.unlocked ? badge.bg : '#F5F5F5',
                    position: 'relative',
                    opacity: badge.unlocked ? 1 : 0.7,
                  }}
                >
                  {/* Lock/unlock indicator */}
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: badge.unlocked ? '#22C55E' : BORDER,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {badge.unlocked ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
                        <rect x="0.5" y="4" width="8" height="5.5" rx="1.5" stroke={MUTED} strokeWidth="1.2" />
                        <path d="M2 4V3C2 1.9 2.9 1 4 1H5C6.1 1 7 1.9 7 3V4" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  <div style={{ fontSize: '26px', marginBottom: '6px' }}>{badge.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: badge.unlocked ? badge.color : MUTED, marginBottom: '3px', lineHeight: '1.2' }}>{badge.name}</div>
                  <div style={{ fontSize: '10px', color: badge.unlocked ? TEXT2 : MUTED, fontWeight: 500, lineHeight: '1.3' }}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Items — nav row */}
        <div style={{ marginBottom: '24px' }}>
          <div
            onClick={() => setActiveSection('saved-items')}
            style={{ background: CARD, borderRadius: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '18px', cursor: 'pointer' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '14px', flexShrink: 0 }}>
              <Bookmark size={17} color={PRIMARY} />
            </div>
            <span style={{ flex: 1, fontSize: '15px', fontWeight: 700, color: TEXT }}>Saved Items</span>
            <ChevronRight size={18} color={MUTED} />
          </div>
        </div>

        {/* My Posts — nav row */}
        <div style={{ marginBottom: '24px' }}>
          <div
            onClick={() => setActiveSection('my-posts')}
            style={{ background: CARD, borderRadius: '22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', padding: '18px', cursor: 'pointer' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '14px', flexShrink: 0 }}>
              <FileText size={17} color="#7C3AED" />
            </div>
            <span style={{ flex: 1, fontSize: '15px', fontWeight: 700, color: TEXT }}>My Posts</span>
            <ChevronRight size={18} color={MUTED} />
          </div>
        </div>

      </div>

      {/* ---- Interest Edit Bottom Sheet ---- */}
      {showInterestEdit && (
        <div
          onClick={() => setShowInterestEdit(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '85vh', overflowY: 'auto' }}
          >
            {/* Handle */}
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Edit Interests</div>
              <button onClick={() => setShowInterestEdit(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color={TEXT2} />
              </button>
            </div>
            {INTEREST_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px' }}>{cat.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {cat.items.map(item => {
                    const selected = draftInterests.includes(item);
                    const c = INTEREST_COLORS[item] || { bg: '#FFF0EC', text: PRIMARY };
                    return (
                      <button
                        key={item}
                        onClick={() => toggleDraft(item)}
                        style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${selected ? c.text : BORDER}`, background: selected ? c.bg : 'transparent', color: selected ? c.text : TEXT2 }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={saveInterests}
              style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: "'DM Sans', sans-serif", marginTop: '8px' }}
            >
              Save Interests
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Section Header ----
function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>{label}</span>
      {count !== undefined && (
        <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: BORDER, color: MUTED }}>
          {count}
        </span>
      )}
    </div>
  );
}

// ---- My Posts Screen ----
function MyPostsScreen({ onBack, posts }: { onBack: () => void; posts: any[] }) {
  const [activeTab, setActiveTab] = useState<'All' | 'Marketplace' | 'Requests'>('All');
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const tabs = ['All', 'Marketplace', 'Requests'] as const;

  const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    listing: { bg: '#DBEAFE', text: '#2563EB' },
    service: { bg: '#DCFCE7', text: '#16A34A' },
    request: { bg: '#EDE9FE', text: '#7C3AED' },
    Listing: { bg: '#DBEAFE', text: '#2563EB' },
    Service: { bg: '#DCFCE7', text: '#16A34A' },
    Request: { bg: '#EDE9FE', text: '#7C3AED' },
  };

  const tabFilter = (p: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Marketplace') return p.type === 'Listing' || p.type === 'Service';
    if (activeTab === 'Requests') return p.type === 'Request';
    return true;
  };

  const q = search.toLowerCase().trim();
  const filtered = posts.filter(p => tabFilter(p) && (!q || p.title.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)));

  if (selectedPost) {
    return <PostDetailScreen post={selectedPost} onBack={() => setSelectedPost(null)} onUpdate={(updated: any) => setSelectedPost(updated)} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} color={TEXT} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT }}>My Posts</div>
        </div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '16px', padding: '10px 14px', border: `1.5px solid ${BORDER}`, marginBottom: '14px' }}>
          <Search size={15} color={MUTED} style={{ flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={14} color={MUTED} /></button>}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${activeTab === tab ? PRIMARY : BORDER}`, background: activeTab === tab ? '#FFF0EC' : 'transparent', color: activeTab === tab ? PRIMARY : TEXT2 }}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '5px' }}>No posts yet</div>
            <div style={{ fontSize: '12px', color: MUTED }}>Your marketplace listings and requests will appear here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(p => {
              const tc = TYPE_COLORS[p.type] || { bg: BG, text: TEXT2 };
              return (
                <div key={p.id} onClick={() => setSelectedPost(p)} style={{ background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '16px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, background: tc.bg, color: tc.text, padding: '2px 8px', borderRadius: '8px' }}>{p.type}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, background: p.statusBg || '#DCFCE7', color: p.statusColor || '#16A34A', padding: '2px 8px', borderRadius: '8px' }}>{p.status}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    {p.expiresOn && <div style={{ fontSize: '11px', color: p.isExpired ? '#DC2626' : MUTED, fontWeight: 500 }}>{p.isExpired ? 'Expired' : 'Expires'} {p.expiresOn}</div>}
                  </div>
                  <ChevronRight size={16} color={MUTED} style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Post Detail Screen ----
function PostDetailScreen({ post, onBack, onUpdate }: { post: any; onBack: () => void; onUpdate: (p: any) => void }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRenewSheet, setShowRenewSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [newExpiry, setNewExpiry] = useState('');
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDesc, setEditDesc] = useState(post.description || '');
  const [currentPost, setCurrentPost] = useState(post);
  const { toast: toastFn } = { toast: (msg: string) => {} };

  const isExpired = currentPost.isExpired;
  const isRequest = currentPost.type === 'Request';
  const isMarketplace = currentPost.type === 'Listing' || currentPost.type === 'Service';

  const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    Listing: { bg: '#DBEAFE', text: '#2563EB' },
    Service: { bg: '#DCFCE7', text: '#16A34A' },
    Request: { bg: '#EDE9FE', text: '#7C3AED' },
  };
  const tc = TYPE_COLORS[currentPost.type] || { bg: BG, text: TEXT2 };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} color={TEXT} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT }}>Post Details</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Post card */}
        <div style={{ background: CARD, borderRadius: '22px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
              {currentPost.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, background: tc.bg, color: tc.text, padding: '3px 9px', borderRadius: '8px' }}>{currentPost.type}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, background: currentPost.statusBg || '#DCFCE7', color: currentPost.statusColor || '#16A34A', padding: '3px 9px', borderRadius: '8px' }}>{currentPost.status}</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TEXT, lineHeight: '1.3', marginBottom: '4px' }}>{currentPost.title}</div>
              {currentPost.category && <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{currentPost.category}</div>}
            </div>
          </div>
          {currentPost.description ? (
            <div style={{ background: BG, borderRadius: '14px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT2, marginBottom: '4px' }}>Description</div>
              <div style={{ fontSize: '13px', color: TEXT, lineHeight: '1.5' }}>{currentPost.description}</div>
            </div>
          ) : null}
          {currentPost.expiresOn && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '12px', color: isExpired ? '#DC2626' : TEXT2, fontWeight: 600 }}>
                {isExpired ? `⚠️ Expired on ${currentPost.expiresOn}` : `Expires: ${currentPost.expiresOn}`}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Renew (expired requests only) */}
          {isExpired && isRequest && (
            <button
              onClick={() => setShowRenewSheet(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RefreshCw size={17} color="#16A34A" />
              </div>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#16A34A', textAlign: 'left' }}>Renew Request</span>
              <ChevronRight size={16} color={MUTED} />
            </button>
          )}

          {/* Edit */}
          {!isExpired && (
            <button
              onClick={() => setShowEditSheet(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Edit3 size={17} color={PRIMARY} />
              </div>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: TEXT, textAlign: 'left' }}>Edit Details</span>
              <ChevronRight size={16} color={MUTED} />
            </button>
          )}

          {/* Mark as Sold (marketplace only) */}
          {isMarketplace && !isExpired && currentPost.status !== 'Sold' && (
            <button
              onClick={() => {
                const updated = { ...currentPost, status: 'Sold', statusBg: '#CCFBF1', statusColor: '#0D9488' };
                setCurrentPost(updated);
                onUpdate(updated);
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={17} color="#0D9488" />
              </div>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: TEXT, textAlign: 'left' }}>Mark as Sold</span>
              <ChevronRight size={16} color={MUTED} />
            </button>
          )}

          {/* View Chat */}
          <button
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={17} color="#7C3AED" />
            </div>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: TEXT, textAlign: 'left' }}>View Chat</span>
            <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>No messages yet</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trash2 size={17} color="#DC2626" />
            </div>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#DC2626', textAlign: 'left' }}>Delete Listing</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
        </div>
      </div>

      {/* Delete Confirm Sheet */}
      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '8px' }}>Delete this listing?</div>
            <div style={{ fontSize: '13px', color: TEXT2, marginBottom: '24px' }}>This action cannot be undone. The post will be permanently removed.</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '18px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { setShowDeleteConfirm(false); onBack(); }} style={{ flex: 1, padding: '14px', borderRadius: '18px', background: '#DC2626', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Sheet */}
      {showRenewSheet && (
        <div onClick={() => setShowRenewSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>Renew Request</div>
            <div style={{ fontSize: '13px', color: TEXT2, marginBottom: '20px' }}>Set a new expiry date to reactivate this request.</div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>New Expiry Date</div>
              <input
                type="date"
                value={newExpiry}
                onChange={e => setNewExpiry(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: `1.5px solid ${BORDER}`, fontSize: '14px', color: TEXT, fontFamily: 'inherit', background: BG, boxSizing: 'border-box' as any }}
              />
            </div>
            <button
              onClick={() => {
                if (!newExpiry) return;
                const formatted = new Date(newExpiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
                const updated = { ...currentPost, isExpired: false, status: 'Active', statusBg: '#DCFCE7', statusColor: '#16A34A', expiresOn: formatted };
                setCurrentPost(updated);
                onUpdate(updated);
                setShowRenewSheet(false);
              }}
              disabled={!newExpiry}
              style={{ width: '100%', padding: '15px', borderRadius: '18px', background: newExpiry ? PRIMARY : BORDER, border: 'none', cursor: newExpiry ? 'pointer' : 'not-allowed', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'inherit' }}
            >
              Renew Request
            </button>
          </div>
        </div>
      )}

      {/* Edit Sheet */}
      {showEditSheet && (
        <div onClick={() => setShowEditSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '75vh', overflowY: 'auto' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Edit Details</div>
              <button onClick={() => setShowEditSheet(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color={TEXT2} />
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>Title</div>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: `1.5px solid ${BORDER}`, fontSize: '14px', color: TEXT, fontFamily: 'inherit', background: BG, boxSizing: 'border-box' as any }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>Description</div>
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} style={{ width: '100%', padding: '12px 14px', borderRadius: '14px', border: `1.5px solid ${BORDER}`, fontSize: '14px', color: TEXT, fontFamily: 'inherit', background: BG, resize: 'none', boxSizing: 'border-box' as any }} />
            </div>
            <button
              onClick={() => {
                const updated = { ...currentPost, title: editTitle, description: editDesc };
                setCurrentPost(updated);
                onUpdate(updated);
                setShowEditSheet(false);
              }}
              style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'inherit' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Saved Items Screen ----
function SavedItemsScreen({ onBack, onOpenEvent, onOpenMarketplaceItem, onOpenRequest, savedMarketplaceItems = [] }: {
  onBack: () => void;
  onOpenEvent?: (id: number) => void;
  onOpenMarketplaceItem?: (id: number) => void;
  onOpenRequest?: (id: number) => void;
  savedMarketplaceItems?: any[];
}) {
  const [activeTab, setActiveTab] = useState<'All' | 'Events' | 'Marketplace' | 'Requests'>('All');
  const [search, setSearch] = useState('');

  const tabs = ['All', 'Events', 'Marketplace', 'Requests'] as const;

  const typeColors: Record<string, { bg: string; text: string }> = {
    Event: { bg: '#FFF0EC', text: PRIMARY },
    Item: { bg: '#DBEAFE', text: '#2563EB' },
    Request: { bg: '#EDE9FE', text: '#7C3AED' },
    Service: { bg: '#DCFCE7', text: '#16A34A' },
  };

  // Convert dynamic marketplace items to the saved-item shape
  const dynamicMarketplaceEntries = savedMarketplaceItems.map(item => ({
    id: item.id,
    sourceId: item.id,
    type: item.itemType === 'service' ? 'Service' : 'Item',
    title: item.name,
    sub: item.price ? `${item.price} · ${item.collectionAddress?.split(',')[0] ?? item.distance ?? ''}` : (item.collectionAddress?.split(',')[0] ?? item.distance ?? ''),
    category: item.category || '',
    categoryColor: item.itemType === 'service' ? '#16A34A' : '#2563EB',
    categoryBg: item.itemType === 'service' ? '#DCFCE7' : '#DBEAFE',
    image: item.image || null,
  }));

  // Static entries: keep only Events and Requests (Items are now fully dynamic)
  const staticEntries = SAVED_ITEMS.filter(i => i.type !== 'Item' && i.type !== 'Service');

  // Merge: dynamic marketplace first, then static Events/Requests
  const allSaved = [...dynamicMarketplaceEntries, ...staticEntries];

  const tabFilter = (item: (typeof allSaved)[0]) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Events') return item.type === 'Event';
    if (activeTab === 'Marketplace') return item.type === 'Item' || item.type === 'Service';
    if (activeTab === 'Requests') return item.type === 'Request';
    return true;
  };

  const q = search.toLowerCase().trim();
  const filtered = allSaved.filter(item => tabFilter(item) && (!q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} color={TEXT} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT }}>Saved Items</div>
        </div>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '16px', padding: '10px 14px', border: `1.5px solid ${BORDER}`, marginBottom: '14px' }}>
          <Bookmark size={15} color={MUTED} style={{ flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search saved items..."
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <X size={14} color={MUTED} />
            </button>
          )}
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }} className="no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ flexShrink: 0, padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${activeTab === tab ? PRIMARY : BORDER}`, background: activeTab === tab ? '#FFF0EC' : 'transparent', color: activeTab === tab ? PRIMARY : TEXT2 }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔖</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '5px' }}>Nothing saved yet</div>
            <div style={{ fontSize: '12px', color: MUTED }}>Items you save will appear here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(item => {
              const tc = typeColors[item.type] || { bg: BG, text: MUTED };
              const handleTap = () => {
                if (item.type === 'Event') onOpenEvent?.(item.sourceId);
                else if (item.type === 'Item' || item.type === 'Service') onOpenMarketplaceItem?.(item.sourceId);
                else if (item.type === 'Request') onOpenRequest?.(item.sourceId);
              };
              return (
                <div key={item.id} onClick={handleTap} style={{ background: CARD, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: '80px', height: '72px', flexShrink: 0 }}>
                    {item.image ? (
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                        {item.type === 'Request' ? '🙋' : '🛍️'}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: tc.bg, color: tc.text }}>{item.type}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: item.categoryBg, color: item.categoryColor }}>{item.category}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '2px', lineHeight: '1.3' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{item.sub}</div>
                  </div>
                  <div style={{ padding: '0 14px' }}>
                    <Bookmark size={14} color={PRIMARY} fill={PRIMARY} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Settings Screen ----
function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifNeighbours, setNotifNeighbours] = useState(true);
  const [notifHelp, setNotifHelp] = useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: CARD, padding: '52px 20px 20px', borderBottom: `1px solid ${BORDER}`, position: 'relative' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '52px', left: '20px' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 15L7 10L12 5" stroke={TEXT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT, paddingLeft: '48px' }}>Settings</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Account */}
        <div style={{ marginBottom: '22px' }}>
          <SectionHeader label="Account" />
          <div style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {SETTINGS_ITEMS.map(({ Icon, label, sub }, i) => (
              <button key={label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'none', border: 'none', borderTop: i > 0 ? `1px solid ${BG}` : 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color={TEXT2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{label}</div>
                  <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{sub}</div>
                </div>
                <ChevronRight size={16} color={MUTED} />
              </button>
            ))}
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'none', border: 'none', borderTop: `1px solid ${BG}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={17} color={PRIMARY} />
              </div>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: PRIMARY }}>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: '22px' }}>
          <SectionHeader label="Notifications" />
          <div style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {[
              { label: 'Event reminders', sub: 'Alerts for saved events', val: notifEvents, set: setNotifEvents },
              { label: 'Neighbour invites', sub: "When a neighbour Jio's you", val: notifNeighbours, set: setNotifNeighbours },
              { label: 'Help & Share', sub: 'Matches for your requests', val: notifHelp, set: setNotifHelp },
            ].map(({ label, sub, val, set }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderTop: i > 0 ? `1px solid ${BG}` : 'none' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{label}</div>
                  <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{sub}</div>
                </div>
                <div
                  onClick={() => set(!val)}
                  style={{ width: '46px', height: '26px', borderRadius: '13px', background: val ? PRIMARY : BORDER, cursor: 'pointer', position: 'relative', transition: 'background 0.2s ease', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: '3px', left: val ? '23px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div style={{ marginBottom: '22px' }}>
          <SectionHeader label="Privacy" />
          <div style={{ background: CARD, borderRadius: '22px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '12px', padding: '14px', background: '#F0FDF4', borderRadius: '16px' }}>
              <Shield size={18} color="#22C55E" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803D', marginBottom: '4px' }}>Singpass Verified</div>
                <div style={{ fontSize: '12px', color: '#166534', lineHeight: '1.55' }}>
                  Your identity is verified via Singpass. Only your interests and proximity are visible to other residents until you confirm a connection.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <SectionHeader label="About" />
          <div style={{ background: CARD, borderRadius: '22px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏘️</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>NeighbourHood</div>
            <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500, marginBottom: '12px' }}>Version 1.0.0 · Made for Singapore HDB Estates</div>
            <div style={{ fontSize: '11px', color: '#C0C0CC' }}>All data is estate-gated. No PII shared without mutual consent.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
