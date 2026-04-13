import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, ChevronRight, Bookmark, Check } from 'lucide-react';
import { toast } from 'sonner';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

// ---- Types ----
interface EventsPageProps {
  onOpenProfile: () => void;
  onOpenEvent: (eventId: number) => void;
  savedEvents: number[];
}

// ---- Mock Data ----
const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:       { bg: '#FFF0EC', text: '#FF6B47' },
  Gardening:     { bg: '#D1FAE5', text: '#059669' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  Cooking:       { bg: '#FEF3C7', text: '#D97706' },
};

const EVENTS = [
  { id: 1, title: 'Morning Run at Bishan-AMK Park', date: 'Sat, 12 Apr', time: '7:00 AM', category: 'Fitness', categoryColor: '#16A34A', categoryBg: '#DCFCE7', image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 2, title: 'Peranakan Cooking Workshop', date: 'Sun, 13 Apr', time: '10:00 AM', category: 'Cooking', categoryColor: '#D97706', categoryBg: '#FEF3C7', image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 3, title: 'Community Garden Morning', date: 'Sat, 19 Apr', time: '8:00 AM', category: 'Gardening', categoryColor: '#059669', categoryBg: '#D1FAE5', image: 'https://images.unsplash.com/photo-1759716705272-8d1697eccf7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
];

const SIGNED_UP_EVENTS = [EVENTS[0], EVENTS[1]];

const INTEREST_GROUPS = [
  {
    id: 1,
    name: 'Morning Runners',
    interest: 'Running',
    members: 14,
    nextActivity: 'Run this Sat 7AM',
    gradient: 'linear-gradient(135deg, #FF6B47 0%, #FF9068 100%)',
    emoji: '🏃',
  },
  {
    id: 2,
    name: 'Backyard Gardeners',
    interest: 'Gardening',
    members: 9,
    nextActivity: 'Garden session Sat 8AM',
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    emoji: '🌱',
  },
  {
    id: 3,
    name: 'Board Game Sundays',
    interest: 'Board Games',
    members: 11,
    nextActivity: 'Games this Sun 2PM',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    emoji: '🎲',
  },
];

const WISHLIST_ITEMS = [
  { id: 1, name: 'IKEA Billy Bookshelf', price: 'Free', emoji: '📚', condition: 'Good' },
  { id: 2, name: 'Sharp Rice Cooker', price: '$20', emoji: '🍚', condition: 'Like New' },
];

// ---- Main Component ----
export function EventsPage({ onOpenProfile, onOpenEvent, savedEvents }: EventsPageProps) {
  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'signedup'>('upcoming');

  const savedEventData = EVENTS.filter(ev => savedEvents.includes(ev.id));

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 0px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          {/* Profile avatar button */}
          <button
            onClick={onOpenProfile}
            style={{
              width: '42px', height: '42px', borderRadius: '50%', background: PRIMARY,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1 }}>Y</span>
          </button>

          {/* Center: estate + greeting */}
          <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '3px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT2 }}>📍 Bishan-AMK Estate</span>
              <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: '#D1FAE5', color: '#059669' }}>✓ Verified</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Good morning ☀️</div>
          </div>

          {/* Notification bell */}
          <button
            onClick={() => toast('No new notifications')}
            style={{
              width: '42px', height: '42px', borderRadius: '50%', background: BG,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', position: 'relative', flexShrink: 0,
            }}
          >
            <Bell size={20} color={TEXT} strokeWidth={1.8} />
            <div style={{
              position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px',
              borderRadius: '50%', background: '#EF4444', border: '1.5px solid white',
            }} />
          </button>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '0px' }}>
          {(['upcoming', 'signedup'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                flex: 1, padding: '12px 8px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700,
                color: activeSubTab === tab ? PRIMARY : MUTED,
                borderBottom: activeSubTab === tab ? `2px solid ${PRIMARY}` : '2px solid transparent',
                transition: 'color 0.2s',
              }}
            >
              {tab === 'upcoming' ? 'Upcoming' : 'Signed Up'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 32px' }}>
        {activeSubTab === 'upcoming' ? (
          <>
            {/* Interest Groups */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Your Interest Groups</span>
                <button
                  onClick={() => toast('Opening Connect in Explore')}
                  style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>More</span>
                  <ChevronRight size={14} color={PRIMARY} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px' }}>
                {INTEREST_GROUPS.map(group => (
                  <motion.div
                    key={group.id}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flexShrink: 0, width: '150px', borderRadius: '20px',
                      background: group.gradient, padding: '16px', cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{group.emoji}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', marginBottom: '4px', lineHeight: '1.2' }}>{group.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: '6px' }}>{group.members} members</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '3px 8px' }}>
                      {group.nextActivity}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommended Events */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Recommended Events</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {EVENTS.map(ev => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>

            {/* Saved Events (only if any) */}
            {savedEventData.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Saved Events</span>
                  <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: BORDER, color: MUTED }}>{savedEventData.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedEventData.map(ev => (
                    <motion.div
                      key={ev.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onOpenEvent(ev.id)}
                      style={{
                        background: CARD, borderRadius: '20px', overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex',
                        alignItems: 'center', cursor: 'pointer',
                      }}
                    >
                      <div style={{ width: '80px', height: '72px', flexShrink: 0 }}>
                        <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: ev.categoryBg, color: ev.categoryColor }}>{ev.category}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '3px', lineHeight: '1.3' }}>{ev.title}</div>
                        <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{ev.date} · {ev.time}</div>
                      </div>
                      <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Bookmark size={13} color={PRIMARY} fill={PRIMARY} />
                        <ChevronRight size={14} color={MUTED} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>My Wishlist</span>
                <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: BORDER, color: MUTED }}>{WISHLIST_ITEMS.length}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px' }}>
                {WISHLIST_ITEMS.map(item => (
                  <div
                    key={item.id}
                    style={{
                      flexShrink: 0, width: '140px', background: CARD, borderRadius: '18px',
                      padding: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ fontSize: '26px', marginBottom: '8px' }}>{item.emoji}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT, marginBottom: '4px', lineHeight: '1.3' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: PRIMARY }}>{item.price}</span>
                      <span style={{ fontSize: '10px', color: TEXT2, fontWeight: 500 }}>{item.condition}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Signed Up Tab */
          <>
            {SIGNED_UP_EVENTS.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SIGNED_UP_EVENTS.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      background: CARD, borderRadius: '20px', overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ height: '120px', position: 'relative' }}>
                      <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: '#DCFCE7', borderRadius: '20px', padding: '4px 10px',
                      }}>
                        <Check size={11} color="#16A34A" strokeWidth={2.5} />
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#16A34A' }}>Registered</span>
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: ev.categoryBg, color: ev.categoryColor }}>{ev.category}</span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '4px', lineHeight: '1.3' }}>{ev.title}</div>
                      <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{ev.date} · {ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📅</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No events signed up yet</div>
                <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>Browse events in Explore</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---- Event Card (compact horizontal) ----
function EventCard({ event }: { event: typeof EVENTS[number] }) {
  return (
    <div style={{
      background: CARD, borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center',
    }}>
      <div style={{ width: '80px', height: '72px', flexShrink: 0 }}>
        <img src={event.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: event.categoryBg, color: event.categoryColor }}>{event.category}</span>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '3px', lineHeight: '1.3' }}>{event.title}</div>
        <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{event.date} · {event.time}</div>
      </div>
    </div>
  );
}
