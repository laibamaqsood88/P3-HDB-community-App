import { useState } from 'react';
import { Shield, ChevronRight, Bell, Lock, HelpCircle, LogOut, Bookmark, Settings, X, Tag } from 'lucide-react';

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
  onClose?: () => void;
  myPosts?: any[];
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
  { id: 1, type: 'Event', title: 'Morning Run at Bishan-AMK Park', sub: 'Sat, 12 Apr', category: 'Fitness', categoryColor: '#16A34A', categoryBg: '#DCFCE7', image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 2, type: 'Event', title: 'Peranakan Cooking Workshop', sub: 'Sun, 13 Apr', category: 'Cooking', categoryColor: '#D97706', categoryBg: '#FEF3C7', image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 3, type: 'Item', title: 'IKEA Billy Bookshelf', sub: 'Free · Blk 445', category: 'Furniture', categoryColor: '#2563EB', categoryBg: '#DBEAFE', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 4, type: 'Request', title: 'Need someone to water my plants', sub: 'Free Request · Home Help', category: 'Request', categoryColor: '#7C3AED', categoryBg: '#EDE9FE', image: null },
];

const MY_POSTS = [
  { id: 1, type: 'Request', emoji: '🪴', title: 'Plant watering while away', status: 'Active', statusBg: '#DCFCE7', statusColor: '#16A34A', expiresIn: '4 days' },
  { id: 2, type: 'Listing', emoji: '🪑', title: 'IKEA Side Table', status: 'In Progress', statusBg: '#FEF3C7', statusColor: '#D97706', expiresIn: null },
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
export function ProfilePage({ onOpenEvent, onClose, myPosts = [] }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'settings'>('main');

  if (activeSection === 'settings') {
    return <SettingsScreen onBack={() => setActiveSection('main')} />;
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
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '20px', marginTop: onClose ? '10px' : '0' }}>
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

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.92)', borderRadius: '18px', padding: '14px 10px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, lineHeight: 1, marginBottom: '5px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: TEXT2, fontWeight: 600, lineHeight: '1.3', whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 32px' }}>

        {/* My Interests */}
        <div style={{ marginBottom: '24px' }}>
          <SectionHeader label="My Interests" count={MY_INTERESTS.length} />
          <div style={{ background: CARD, borderRadius: '22px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {MY_INTERESTS.map(i => {
                const c = INTEREST_COLORS[i] || { bg: '#FFF0EC', text: PRIMARY };
                return (
                  <span key={i} style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 700, background: c.bg, color: c.text }}>
                    {i}
                  </span>
                );
              })}
              <button style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, background: BG, color: MUTED, border: `1.5px dashed ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                + Add
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

        {/* Saved Items */}
        <div style={{ marginBottom: '24px' }}>
          <SectionHeader label="Saved Items" count={SAVED_ITEMS.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SAVED_ITEMS.map(item => {
              const typeColors: Record<string, { bg: string; text: string }> = {
                Event: { bg: '#FFF0EC', text: PRIMARY },
                Item: { bg: '#DBEAFE', text: '#2563EB' },
                Request: { bg: '#EDE9FE', text: '#7C3AED' },
                Service: { bg: '#DCFCE7', text: '#16A34A' },
              };
              const tc = typeColors[item.type] || { bg: BG, text: MUTED };
              return (
                <div
                  key={item.id}
                  onClick={() => item.type === 'Event' && onOpenEvent?.(item.id)}
                  style={{ background: CARD, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: item.type === 'Event' ? 'pointer' : 'default' }}
                >
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
                  <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bookmark size={13} color={PRIMARY} fill={PRIMARY} />
                    <ChevronRight size={14} color={MUTED} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Posts */}
        {(() => {
          const typeColors: Record<string, { bg: string; text: string }> = {
            listing: { bg: '#DBEAFE', text: '#2563EB' },
            service: { bg: '#DCFCE7', text: '#16A34A' },
            request: { bg: '#EDE9FE', text: '#7C3AED' },
          };
          const newPosts = myPosts.map(p => ({
            id: p.id,
            type: p.type === 'listing' ? 'Listing' : p.type === 'service' ? 'Service' : 'Request',
            emoji: p.emoji || '📋',
            title: p.title,
            status: p.status || 'Active',
            statusBg: '#DCFCE7',
            statusColor: '#16A34A',
            date: p.date,
            expiresIn: null,
          }));
          const allPosts = [...newPosts, ...MY_POSTS];
          return (
            <div style={{ marginBottom: '24px' }}>
              <SectionHeader label="My Posts" count={allPosts.length} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allPosts.map(p => {
                  const typeLower = p.type.toLowerCase();
                  const tc = typeColors[typeLower] || { bg: BG, text: TEXT2 };
                  return (
                    <div key={p.id} style={{ background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '16px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                        {p.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: tc.text, fontWeight: 700, background: tc.bg, padding: '2px 8px', borderRadius: '8px' }}>{p.type}</span>
                          <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: (p as any).statusBg || '#DCFCE7', color: (p as any).statusColor || '#16A34A' }}>
                            {p.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '2px' }}>{p.title}</div>
                        {(p as any).date && <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{(p as any).date}</div>}
                        {(p as any).expiresIn && <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>Expires in {(p as any).expiresIn}</div>}
                      </div>
                      <ChevronRight size={16} color={MUTED} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Settings Section */}
        <div>
          <SectionHeader label="Account" />
          <div style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            {SETTINGS_ITEMS.map(({ Icon, label, sub }, i) => (
              <button
                key={label}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px',
                  background: 'none', border: 'none', borderTop: i > 0 ? `1px solid ${BG}` : 'none',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}
              >
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
            <button
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px',
                background: 'none', border: 'none', borderTop: `1px solid ${BG}`,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={17} color={PRIMARY} />
              </div>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: PRIMARY }}>Sign Out</span>
            </button>
          </div>
        </div>

        {/* App version */}
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>NeighbourHood v1.0.0</div>
          <div style={{ fontSize: '10px', color: '#C0C0CC', marginTop: '3px' }}>All residents are Singpass-verified · Estate-gated</div>
        </div>
      </div>
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
