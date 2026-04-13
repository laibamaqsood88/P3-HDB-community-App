import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Filter, Bookmark, Share2, X, Shield,
  Bell, Calendar, MapPin, Globe, Users, Search,
  ExternalLink, Check, AlertCircle, Clock
} from 'lucide-react';
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
type EventScreen =
  | 'feed' | 'filtered' | 'detail' | 'share'
  | 'singpass' | 'recipient-detail' | 'non-resident'
  | 'register' | 'browser';

interface EventData {
  id: number; title: string; date: string; time: string;
  location: string; language: string; audience: string;
  attendees: number; signups: number; image: string;
  description: string; category: string; categoryColor: string; categoryBg: string;
}

interface Filters {
  ageGroups: string[]; languages: string[];
  interests: string[]; familyStatus: string[];
}

interface NavFrame { screen: EventScreen; params?: any; }

// ---- Mock Data ----
const EVENTS: EventData[] = [
  {
    id: 1, title: 'Morning Run at Bishan-AMK Park', date: 'Sat, 12 Apr 2026', time: '7:00 AM',
    location: 'Bishan-AMK Park, Main Pavilion', language: 'English', audience: 'Adults 25–45',
    attendees: 8, signups: 24, categoryColor: '#16A34A', categoryBg: '#DCFCE7', category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Join your neighbours for a refreshing morning run around Bishan-AMK Park. Suitable for casual joggers and experienced runners alike. Meet at the main pavilion at 6:50 AM. Water stations provided along the route. All fitness levels welcome — we run at a conversational pace so no one gets left behind.',
  },
  {
    id: 2, title: 'Peranakan Cooking Workshop', date: 'Sun, 13 Apr 2026', time: '10:00 AM',
    location: 'Blk 123 Community Hub, Level 2', language: 'English / Mandarin', audience: 'Families',
    attendees: 12, signups: 30, categoryColor: '#D97706', categoryBg: '#FEF3C7', category: 'Cooking',
    image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Learn to cook traditional Peranakan dishes with your neighbours! Mrs Lim will guide you through making Ayam Buah Keluak and Kueh Pie Tee. Ingredients provided. Limited to 15 participants. Perfect for families and food enthusiasts who want to connect over Singapore heritage food.',
  },
  {
    id: 3, title: 'Community Garden Morning', date: 'Sat, 19 Apr 2026', time: '8:00 AM',
    location: 'Rooftop Garden, Blk 450', language: 'English', audience: 'All Ages',
    attendees: 5, signups: 18, categoryColor: '#059669', categoryBg: '#D1FAE5', category: 'Gardening',
    image: 'https://images.unsplash.com/photo-1759716705272-8d1697eccf7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Help tend the estate\'s shared rooftop garden! Activities include planting vegetables, pruning herbs, and composting. No experience needed — seasoned gardeners and curious beginners are both welcome. Gloves and tools provided. We meet every fortnight to grow our community garden together.',
  },
  {
    id: 4, title: 'Saturday Board Game Afternoon', date: 'Sat, 19 Apr 2026', time: '2:00 PM',
    location: 'RC Multi-Purpose Hall, Blk 447', language: 'English', audience: 'Adults 20–40',
    attendees: 6, signups: 15, categoryColor: '#7C3AED', categoryBg: '#EDE9FE', category: 'Board Games',
    image: 'https://images.unsplash.com/photo-1762068383473-f59f4dc614e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Bring your favourite board games or try something new from the communal game library. From Catan to Codenames, there\'s something for everyone. Snacks and drinks provided. Great way to meet neighbours who love strategy and fun in a relaxed Saturday afternoon setting.',
  },
  {
    id: 5, title: 'Seniors Tai Chi Morning', date: 'Wed, 16 Apr 2026', time: '7:30 AM',
    location: 'Void Deck, Blk 445', language: 'Mandarin', audience: 'Seniors 55+',
    attendees: 15, signups: 40, categoryColor: '#0891B2', categoryBg: '#CFFAFE', category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1690254995096-6e3cc6263e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Weekly Tai Chi sessions for seniors conducted in Mandarin by a certified instructor. Improve balance, reduce stress, and meet fellow residents. Wear comfortable clothing and flat shoes. Open to all senior residents. No prior experience required — we have been running this weekly session for 3 years.',
  },
];

const AGE_GROUPS = ['All Ages', '20–35', '35–50', '55+', 'Families'];
const LANGUAGES = ['English', 'Mandarin', 'Malay', 'Tamil', 'Multilingual'];
const INTERESTS = ['Fitness', 'Cooking', 'Gardening', 'Board Games', 'Arts & Crafts', 'Music'];
const FAMILY_STATUS = ['Individual', 'Families', 'Parents', 'Seniors'];
const CATEGORIES = ['All', '🏃 Fitness', '🍳 Cooking', '🌱 Gardening', '🎲 Board Games', '💆 Wellness'];

// ---- Main Component ----
export function EventsPage() {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const [filters, setFilters] = useState<Filters>({ ageGroups: [], languages: [], interests: [], familyStatus: [] });
  const [tempFilters, setTempFilters] = useState<Filters>({ ageGroups: [], languages: [], interests: [], familyStatus: [] });
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [reminderOption, setReminderOption] = useState('');

  const current = navStack[navStack.length - 1];
  const goTo = (screen: EventScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  const activeFilterCount = Object.values(filters).flat().length;
  const filteredEvents = EVENTS.filter(ev => {
    if (filters.interests.length > 0 && !filters.interests.includes(ev.category)) return false;
    if (filters.languages.length > 0 && !filters.languages.some(l => ev.language.includes(l))) return false;
    return true;
  });

  const currentEvent: EventData = current.params?.event || EVENTS[0];

  const renderScreen = () => {
    switch (current.screen) {
      case 'feed':
        return (
          <EventsFeed
            events={EVENTS} savedEvents={savedEvents} activeFilterCount={activeFilterCount}
            onOpenFilter={() => { setTempFilters(filters); setShowFilter(true); }}
            onSelectEvent={ev => goTo('detail', { event: ev })}
            onToggleSave={id => setSavedEvents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
          />
        );
      case 'filtered':
        return (
          <FilteredFeed
            events={filteredEvents} filters={filters} savedEvents={savedEvents}
            onSelectEvent={ev => goTo('detail', { event: ev })}
            onClearFilter={(key: keyof Filters, val: string) =>
              setFilters(p => ({ ...p, [key]: p[key].filter((v: string) => v !== val) }))
            }
            onBack={goBack}
          />
        );
      case 'detail':
        return (
          <EventDetail
            event={currentEvent} saved={savedEvents.includes(currentEvent.id)}
            onBack={goBack}
            onSave={() => {
              setSavedEvents(p => p.includes(currentEvent.id) ? p.filter(id => id !== currentEvent.id) : [...p, currentEvent.id]);
              toast.success('Event saved to your profile');
            }}
            onShare={() => goTo('share', { event: currentEvent })}
            onRegister={() => { setReminderOption(''); goTo('register', { event: currentEvent }); }}
          />
        );
      case 'share':
        return (
          <ShareSheet
            event={currentEvent} onBack={goBack}
            onShareVerified={() => goTo('singpass', { event: currentEvent })}
            onShareUnverified={() => goTo('non-resident')}
          />
        );
      case 'singpass':
        return <SingpassPrompt event={currentEvent} onBack={goBack} onVerify={() => goTo('recipient-detail', { event: currentEvent })} />;
      case 'recipient-detail':
        return <RecipientDetail event={currentEvent} onBack={goBack} onRegister={() => { setReminderOption(''); goTo('register', { event: currentEvent }); }} />;
      case 'non-resident':
        return <NonResidentScreen onBack={goBack} />;
      case 'register':
        return (
          <RegisterScreen
            event={currentEvent} reminderOption={reminderOption} onSelectReminder={setReminderOption}
            onBack={goBack}
            onConfirm={() => {
              if (reminderOption && reminderOption !== 'none') toast.success(`Reminder set for ${reminderOption} before event`);
              goTo('browser', { event: currentEvent });
            }}
          />
        );
      case 'browser':
        return (
          <ExternalBrowser event={currentEvent} onBack={() => { setNavStack([{ screen: 'feed' }]); toast.success('Registration complete! See you there 🎉'); }} />
        );
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
      {renderScreen()}
      <AnimatePresence>
        {showFilter && (
          <FilterPanel
            tempFilters={tempFilters}
            onChangeTempFilters={setTempFilters}
            onApply={() => { setFilters(tempFilters); setShowFilter(false); goTo('filtered'); }}
            onReset={() => setTempFilters({ ageGroups: [], languages: [], interests: [], familyStatus: [] })}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Events Feed ----
function EventsFeed({ events, savedEvents, activeFilterCount, onOpenFilter, onSelectEvent, onToggleSave }: any) {
  const [activeCategory, setActiveCategory] = useState('All');
  const featured = events[0];
  const rest = events.slice(1);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: MUTED }}>📍</span>
              <span style={{ fontSize: '12px', color: MUTED, letterSpacing: '0.2px' }}>Bishan-AMK Estate</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', padding: '1px 7px', borderRadius: '8px', background: '#DCFCE7', fontSize: '10px', color: '#16A34A', fontWeight: 700, marginLeft: '2px' }}>
                <Shield size={8} /> Verified
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, lineHeight: 1.15 }}>Good morning ☀️</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={onOpenFilter}
              style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '13px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Filter size={17} color={activeFilterCount > 0 ? PRIMARY : TEXT} strokeWidth={2} />
              {activeFilterCount > 0 && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: PRIMARY, border: '1.5px solid white' }} />
              )}
            </button>
            <div style={{ width: '40px', height: '40px', borderRadius: '13px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '17px', fontWeight: 800, color: 'white', lineHeight: 1 }}>Y</span>
            </div>
          </div>
        </div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
          <Search size={15} color={MUTED} strokeWidth={2} />
          <span style={{ fontSize: '14px', color: MUTED }}>Search events near you...</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Featured Card */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: PRIMARY }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Featured this week
            </span>
          </div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectEvent(featured)}
            style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', height: '222px', cursor: 'pointer', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}
          >
            <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 100%)' }} />

            {/* Top row */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: featured.categoryColor, color: 'white', letterSpacing: '0.03em' }}>
                {featured.category}
              </span>
              <button
                onClick={e => { e.stopPropagation(); onToggleSave(featured.id); }}
                style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Bookmark size={15} color="white" fill={savedEvents.includes(featured.id) ? 'white' : 'none'} />
              </button>
            </div>

            {/* Bottom content */}
            <div style={{ position: 'absolute', bottom: '18px', left: '18px', right: '18px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', lineHeight: '1.2', marginBottom: '10px' }}>
                {featured.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={12} color="rgba(255,255,255,0.75)" />
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    {featured.date.replace('2026', '').trim().replace(/,$/, '')} · {featured.time}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '5px 10px 5px 6px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ display: 'flex' }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.6)', background: `hsl(${i * 55 + 20}, 68%, 58%)`, marginLeft: i > 0 ? '-6px' : 0, flexShrink: 0 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{featured.attendees} going</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Category Scroll */}
        <div style={{ paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 20px 2px', scrollbarWidth: 'none' } as any}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    flexShrink: 0, padding: '8px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer',
                    background: isActive ? TEXT : CARD,
                    color: isActive ? 'white' : TEXT2,
                    border: `1.5px solid ${isActive ? TEXT : BORDER}`,
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.18s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: MUTED }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Upcoming · {rest.length} events
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rest.map((ev: EventData) => (
              <HorizontalEventCard
                key={ev.id}
                event={ev}
                saved={savedEvents.includes(ev.id)}
                onTap={() => onSelectEvent(ev)}
                onSave={() => onToggleSave(ev.id)}
              />
            ))}
          </div>
          <div style={{ height: '20px' }} />
        </div>
      </div>
    </div>
  );
}

// ---- Horizontal Event Card (compact list) ----
function HorizontalEventCard({ event, saved, onTap, onSave }: { event: EventData; saved: boolean; onTap: () => void; onSave: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      style={{ display: 'flex', gap: '14px', background: CARD, borderRadius: '20px', padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.055)', cursor: 'pointer', alignItems: 'flex-start' }}
    >
      {/* Thumbnail */}
      <div style={{ width: '82px', height: '82px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
        <img src={event.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {saved && (
          <div style={{ position: 'absolute', top: '6px', right: '6px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bookmark size={10} color="white" fill="white" />
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ padding: '3px 9px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: event.categoryBg, color: event.categoryColor, letterSpacing: '0.02em' }}>
            {event.category}
          </span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '7px', lineHeight: '1.3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as any}>
          {event.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
          <Calendar size={11} color={MUTED} />
          <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>
            {event.date.split(',')[1]?.trim().replace(' 2026', '') || event.date} · {event.time}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={11} color={MUTED} />
          <span style={{ fontSize: '12px', color: MUTED }}>{event.attendees} neighbours going</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Legacy Event Card (used in filtered feed) ----
function EventCard({ event, saved, onTap }: { event: EventData; saved: boolean; onTap: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onTap}
      style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', height: '168px', overflow: 'hidden' }}>
        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span style={{ padding: '4px 11px', borderRadius: '20px', fontSize: '11px', background: event.categoryColor, color: 'white', fontWeight: 700 }}>
            {event.category}
          </span>
        </div>
        {saved && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bookmark size={13} color="white" fill="white" />
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', background: 'rgba(0,0,0,0.45)', color: 'white', backdropFilter: 'blur(4px)' }}>
            {event.audience}
          </span>
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px', lineHeight: '1.3' }}>{event.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Calendar size={12} color={MUTED} />
            <span style={{ fontSize: '12px', color: TEXT2 }}>{event.date} · {event.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MapPin size={12} color={MUTED} />
            <span style={{ fontSize: '12px', color: TEXT2 }}>{event.location}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px solid ${BG}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex' }}>
              {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid white', background: `hsl(${i * 60 + 15}, 68%, 58%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? '-8px' : 0 }}>
                  <span style={{ fontSize: '8px', color: 'white', fontWeight: 700 }}>{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{event.attendees} going</span>
          </div>
          <span style={{ fontSize: '12px', color: MUTED }}>{event.signups} signed up</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Filter Panel ----
function FilterPanel({ tempFilters, onChangeTempFilters, onApply, onReset, onClose }: any) {
  const toggle = (key: keyof Filters, val: string) => {
    onChangeTempFilters((prev: Filters) => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter((v: string) => v !== val) : [...prev[key], val],
    }));
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 10 }} onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: CARD, borderRadius: '28px 28px 0 0', zIndex: 20, maxHeight: '88%', overflowY: 'auto', fontFamily: "'DM Sans', sans-serif" }}
      >
        <div style={{ padding: '16px 20px 32px' }}>
          <div style={{ width: '36px', height: '4px', background: BORDER, borderRadius: '4px', margin: '0 auto 22px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Filter Events</span>
            <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color={TEXT2} />
            </button>
          </div>
          {([
            { key: 'ageGroups', title: 'Age Group', opts: AGE_GROUPS },
            { key: 'languages', title: 'Language', opts: LANGUAGES },
            { key: 'interests', title: 'Interest', opts: INTERESTS },
            { key: 'familyStatus', title: 'Family Status', opts: FAMILY_STATUS },
          ] as { key: keyof Filters; title: string; opts: string[] }[]).map(({ key, title, opts }) => (
            <div key={key} style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>{title}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {opts.map(opt => {
                  const sel = tempFilters[key].includes(opt);
                  return (
                    <button key={opt} onClick={() => toggle(key, opt)} style={{
                      padding: '8px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                      border: `1.5px solid ${sel ? PRIMARY : BORDER}`,
                      background: sel ? PRIMARY : 'transparent',
                      color: sel ? 'white' : TEXT2,
                      fontWeight: sel ? 600 : 400,
                      transition: 'all 0.15s',
                    }}>{opt}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button onClick={onReset} style={{ flex: 1, padding: '15px', borderRadius: '18px', border: `1.5px solid ${BORDER}`, background: 'white', color: TEXT, fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
              Reset
            </button>
            <button onClick={onApply} style={{ flex: 2, padding: '15px', borderRadius: '18px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(255,107,71,0.3)' }}>
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ---- Filtered Feed ----
function FilteredFeed({ events, filters, savedEvents, onSelectEvent, onClearFilter, onBack }: any) {
  const chips: { key: string; label: string }[] = [];
  Object.entries(filters).forEach(([k, vals]) => (vals as string[]).forEach(v => chips.push({ key: k, label: v })));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: CARD, padding: '52px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Filtered Events</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          {chips.map(({ key, label }) => (
            <span key={`${key}-${label}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#FFF0EC', color: PRIMARY, border: `1px solid #FFCAB8` }}>
              {label}
              <button onClick={() => onClearFilter(key, label)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} color={PRIMARY} /></button>
            </span>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{events.length} events found</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No events found</div>
            <div style={{ fontSize: '13px', color: MUTED }}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((ev: EventData) => <EventCard key={ev.id} event={ev} saved={savedEvents.includes(ev.id)} onTap={() => onSelectEvent(ev)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Event Detail ----
function EventDetail({ event, saved, onBack, onSave, onShare, onRegister }: any) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '280px', flexShrink: 0 }}>
        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '52px 16px 16px' }}>
          <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color="white" />
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onSave} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={18} color="white" fill={saved ? 'white' : 'none'} />
            </button>
            <button onClick={onShare} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={18} color="white" />
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
          <span style={{ padding: '5px 13px', borderRadius: '20px', fontSize: '12px', background: event.categoryColor, color: 'white', fontWeight: 700 }}>{event.category}</span>
        </div>
      </div>

      {/* Content — drawer style */}
      <div style={{ flex: 1, overflowY: 'auto', background: CARD, borderRadius: '28px 28px 0 0', marginTop: '-20px', position: 'relative', zIndex: 1, padding: '24px 20px 0' }}>
        <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, marginBottom: '18px', lineHeight: '1.25' }}>{event.title}</div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {[
            { Icon: Calendar, label: `${event.date} · ${event.time}` },
            { Icon: MapPin, label: event.location },
            { Icon: Globe, label: event.language },
            { Icon: Users, label: event.audience },
          ].map(({ Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '13px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={PRIMARY} />
              </div>
              <span style={{ fontSize: '14px', color: TEXT2, fontWeight: 500, flex: 1 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Attendees row */}
        <div style={{ background: BG, borderRadius: '18px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT }}>{event.signups}</div>
            <div style={{ fontSize: '11px', color: MUTED, marginTop: '2px', fontWeight: 500 }}>Signed up</div>
          </div>
          <div style={{ width: '1px', background: BORDER, alignSelf: 'stretch' }} />
          <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex' }}>
              {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2.5px solid white', background: `hsl(${i * 50 + 20}, 65%, 60%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? '-10px' : 0, zIndex: 3 - i }}>
                  <span style={{ fontSize: '10px', color: 'white', fontWeight: 700 }}>{String.fromCharCode(65 + i)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{event.attendees} neighbours</div>
              <div style={{ fontSize: '11px', color: MUTED }}>verified & going</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>About this event</div>
          <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.65' }}>
            {expanded ? event.description : event.description.slice(0, 140) + '...'}
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{ color: PRIMARY, fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 0', fontFamily: 'inherit' }}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BG}` }}>
        <button onClick={onRegister} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: `linear-gradient(135deg, ${PRIMARY} 0%, #FF8C70 100%)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,71,0.38)', fontFamily: 'inherit' }}>
          Register Now
        </button>
      </div>
    </div>
  );
}

// ---- Share Sheet ----
function ShareSheet({ event, onBack, onShareVerified, onShareUnverified }: any) {
  const shareOpts = [
    { label: 'WhatsApp', emoji: '💬', color: '#25D366' },
    { label: 'Telegram', emoji: '✈️', color: '#0088CC' },
    { label: 'Copy Link', emoji: '🔗', color: '#6B7280' },
    { label: 'More', emoji: '⋯', color: '#9CA3AF' },
  ];
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 10 }} onClick={onBack} />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: CARD, borderRadius: '28px 28px 0 0', zIndex: 20, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ padding: '16px 20px 36px' }}>
          <div style={{ width: '36px', height: '4px', background: BORDER, borderRadius: '4px', margin: '0 auto 22px' }} />
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>Share Event</div>
          <div style={{ fontSize: '13px', color: MUTED, marginBottom: '22px' }}>Only verified estate residents can access this event.</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {shareOpts.map(opt => (
              <button key={opt.label} onClick={() => {
                if (opt.label === 'WhatsApp' || opt.label === 'Telegram') { onShareVerified(); }
                else { toast.success('Link copied!'); onBack(); }
              }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 6px', borderRadius: '18px', background: BG, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span style={{ fontSize: '26px' }}>{opt.emoji}</span>
                <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{opt.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', background: '#FFF0EC', borderRadius: '16px', marginBottom: '16px' }}>
            <AlertCircle size={16} color={PRIMARY} />
            <span style={{ fontSize: '12px', color: PRIMARY, fontWeight: 500 }}>Estate-gated link — only works for verified residents</span>
          </div>
          <button onClick={onBack} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: '14px', fontFamily: 'inherit' }}>Cancel</button>
        </div>
      </motion.div>
    </>
  );
}

// ---- Singpass Login ----
function SingpassPrompt({ event, onBack, onVerify }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '52px 20px 16px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px 80px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#E30613', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 16px 36px rgba(227,6,19,0.28)' }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '26px' }}>SP</span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#E30613', marginBottom: '8px' }}>Singpass</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '12px' }}>Verify Your Residency</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px' }}>
          This event is only available to verified residents of your estate. Log in with Singpass to confirm your residency.
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', background: '#F0FDF4', borderRadius: '16px', marginBottom: '28px', width: '100%', boxSizing: 'border-box' }}>
          <Shield size={16} color="#22C55E" style={{ marginTop: '1px', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#15803D', lineHeight: '1.55', fontWeight: 500 }}>Your data is protected. We only verify residency status — no other data is accessed.</span>
        </div>
        <button onClick={onVerify} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: '#E30613', border: 'none', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 10px 28px rgba(227,6,19,0.28)', marginBottom: '14px', fontFamily: 'inherit' }}>
          Log in with Singpass
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: '13px', fontFamily: 'inherit' }}>What is Singpass?</button>
      </div>
    </div>
  );
}

// ---- Recipient Detail ----
function RecipientDetail({ event, onBack, onRegister }: any) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '52px 16px 12px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 13px', background: '#F0FDF4', borderRadius: '20px' }}>
          <Shield size={12} color="#22C55E" />
          <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 700 }}>Verified Resident Access</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: '200px', flexShrink: 0 }}>
        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 20px 0' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT, marginBottom: '16px' }}>{event.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '18px' }}>
          {[{ Icon: Calendar, t: `${event.date} · ${event.time}` }, { Icon: MapPin, t: event.location }, { Icon: Globe, t: event.language }, { Icon: Users, t: event.audience }].map(({ Icon, t }) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color={PRIMARY} />
              </div>
              <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.65', marginBottom: '16px' }}>
          {expanded ? event.description : event.description.slice(0, 120) + '...'}
          <button onClick={() => setExpanded(!expanded)} style={{ color: PRIMARY, fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px', fontFamily: 'inherit' }}>
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </div>
      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${BG}` }}>
        <button onClick={onRegister} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,71,0.35)', fontFamily: 'inherit' }}>
          Register Now
        </button>
      </div>
    </div>
  );
}

// ---- Non-Resident ----
function NonResidentScreen({ onBack }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '52px 20px 16px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px 100px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '26px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
          <Shield size={40} color={PRIMARY} />
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '12px' }}>Estate Residents Only</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '36px' }}>
          This event is only available to verified residents of this estate. If you've recently moved in, verify your residency through Singpass to access community events.
        </div>
        <button onClick={onBack} style={{ padding: '14px 36px', borderRadius: '20px', border: `1.5px solid ${BORDER}`, background: CARD, color: TEXT, fontWeight: 600, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
          Go Back
        </button>
      </div>
    </div>
  );
}

// ---- Register / Reminder Screen ----
function RegisterScreen({ event, reminderOption, onSelectReminder, onBack, onConfirm }: any) {
  const opts = [
    { id: '1 day', label: '1 day before' },
    { id: '3 days', label: '3 days before' },
    { id: '1 week', label: '1 week before' },
    { id: 'none', label: 'No reminder' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '52px 20px 16px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Bell size={28} color={PRIMARY} />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '8px' }}>Set a reminder?</div>
        <div style={{ fontSize: '14px', color: TEXT2, marginBottom: '28px', lineHeight: '1.55' }}>
          We'll notify you before <span style={{ fontWeight: 700, color: TEXT }}>{event.title}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {opts.map(opt => {
            const sel = reminderOption === opt.id;
            return (
              <button key={opt.id} onClick={() => onSelectReminder(opt.id)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '17px 18px', borderRadius: '18px', border: `1.5px solid ${sel ? PRIMARY : BORDER}`,
                background: sel ? '#FFF0EC' : BG, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={17} color={sel ? PRIMARY : MUTED} />
                  <span style={{ fontSize: '14px', fontWeight: sel ? 600 : 500, color: sel ? PRIMARY : TEXT }}>{opt.label}</span>
                </div>
                {sel && (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={13} color="white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '16px 20px 32px' }}>
        <button onClick={onConfirm} disabled={!reminderOption} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: reminderOption ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: reminderOption ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: reminderOption ? 'pointer' : 'not-allowed', boxShadow: reminderOption ? '0 8px 24px rgba(255,107,71,0.35)' : 'none', transition: 'all 0.2s', fontFamily: 'inherit' }}>
          {reminderOption === 'none' ? 'Continue to Registration' : 'Set Reminder & Continue'}
        </button>
      </div>
    </div>
  );
}

// ---- External Browser ----
function ExternalBrowser({ event, onBack }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: CARD, padding: '52px 16px 14px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onBack} style={{ width: '34px', height: '34px', borderRadius: '11px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: BG, borderRadius: '12px', padding: '9px 13px' }}>
            <Shield size={12} color="#22C55E" />
            <span style={{ fontSize: '12px', color: TEXT2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>go.gov.sg/estate-events/register</span>
          </div>
          <ExternalLink size={16} color={MUTED} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ background: CARD, borderRadius: '22px', padding: '22px', boxShadow: '0 2px 14px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', paddingBottom: '18px', borderBottom: `1px solid ${BG}` }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#E30613', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '11px', fontWeight: 800 }}>SG</span>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>Government of Singapore</div>
              <div style={{ fontSize: '11px', color: MUTED }}>go.gov.sg</div>
            </div>
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>{event.title}</div>
          <div style={{ fontSize: '12px', color: MUTED, marginBottom: '22px', fontWeight: 500 }}>{event.date} · {event.location}</div>
          {['Full Name', 'NRIC / FIN', 'Email Address', 'Mobile Number', 'No. of participants'].map(label => (
            <div key={label} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: TEXT2, marginBottom: '6px', fontWeight: 600 }}>{label}</div>
              <div style={{ height: '46px', background: BG, borderRadius: '14px', border: `1.5px solid ${BORDER}` }} />
            </div>
          ))}
          <button onClick={onBack} style={{ width: '100%', padding: '15px', borderRadius: '18px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '6px', fontFamily: 'inherit' }}>
            Submit Registration
          </button>
        </div>
        <div style={{ height: '16px' }} />
      </div>
    </div>
  );
}
