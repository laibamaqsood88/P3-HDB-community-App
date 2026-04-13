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
    description: "Help tend the estate's shared rooftop garden! Activities include planting vegetables, pruning herbs, and composting. No experience needed — seasoned gardeners and curious beginners are both welcome. Gloves and tools provided. We meet every fortnight to grow our community garden together.",
  },
  {
    id: 4, title: 'Saturday Board Game Afternoon', date: 'Sat, 19 Apr 2026', time: '2:00 PM',
    location: 'RC Multi-Purpose Hall, Blk 447', language: 'English', audience: 'Adults 20–40',
    attendees: 6, signups: 15, categoryColor: '#7C3AED', categoryBg: '#EDE9FE', category: 'Board Games',
    image: 'https://images.unsplash.com/photo-1762068383473-f59f4dc614e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: "Bring your favourite board games or try something new from the communal game library. From Catan to Codenames, there's something for everyone. Snacks and drinks provided. Great way to meet neighbours who love strategy and fun in a relaxed Saturday afternoon setting.",
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

interface ExplorePageProps {
  initialEventId?: number;
}

export function ExplorePage({ initialEventId }: ExplorePageProps) {
  const initialScreen: NavFrame = initialEventId
    ? { screen: 'detail', params: { event: EVENTS.find(e => e.id === initialEventId) || EVENTS[0] } }
    : { screen: 'feed' };

  const [navStack, setNavStack] = useState<NavFrame[]>([initialScreen]);
  const [filters, setFilters] = useState<Filters>({ ageGroups: [], languages: [], interests: [], familyStatus: [] });
  const [tempFilters, setTempFilters] = useState<Filters>({ ageGroups: [], languages: [], interests: [], familyStatus: [] });
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [reminderOption, setReminderOption] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const current = navStack[navStack.length - 1];
  const goTo = (screen: EventScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  const activeFilterCount = Object.values(filters).flat().length;
  const filteredEvents = EVENTS.filter(ev => {
    if (filters.interests.length > 0 && !filters.interests.includes(ev.category)) return false;
    if (filters.languages.length > 0 && !filters.languages.some(l => ev.language.includes(l))) return false;
    if (activeCategory !== 'All' && !activeCategory.includes(ev.category)) return false;
    if (searchQuery && !ev.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id: number) => setSavedEvents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // ---- Feed screen ----
  if (current.screen === 'feed' || current.screen === 'filtered') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ background: CARD, padding: '52px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT }}>Explore</div>
              <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>Discover events in your estate</div>
            </div>
            <button
              onClick={() => { setTempFilters(filters); setShowFilter(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', background: activeFilterCount > 0 ? '#FFF0EC' : BG, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Filter size={15} color={activeFilterCount > 0 ? PRIMARY : TEXT2} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: activeFilterCount > 0 ? PRIMARY : TEXT2 }}>
                {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filter'}
              </span>
            </button>
          </div>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '14px', padding: '10px 14px', marginBottom: '12px' }}>
            <Search size={16} color={MUTED} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: TEXT, fontFamily: 'inherit' }}
            />
          </div>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  background: activeCategory === cat ? PRIMARY : CARD,
                  color: activeCategory === cat ? 'white' : TEXT2,
                  border: activeCategory === cat ? 'none' : `1px solid ${BORDER}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No events found</div>
              <div style={{ fontSize: '13px', color: TEXT2 }}>Try adjusting your filters</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredEvents.map(ev => (
                <motion.div
                  key={ev.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goTo('detail', { event: ev })}
                  style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer' }}
                >
                  <div style={{ height: '160px', position: 'relative' }}>
                    <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '20px', background: ev.categoryBg, color: ev.categoryColor, fontSize: '11px', fontWeight: 700 }}>
                      {ev.category}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); toggleSave(ev.id); }}
                      style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Bookmark size={15} color={savedEvents.includes(ev.id) ? PRIMARY : MUTED} fill={savedEvents.includes(ev.id) ? PRIMARY : 'none'} />
                    </button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: TEXT, marginBottom: '8px', lineHeight: '1.3' }}>{ev.title}</div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} color={MUTED} />
                        <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{ev.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} color={MUTED} />
                        <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{ev.time}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                      <MapPin size={13} color={MUTED} />
                      <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{ev.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={13} color={MUTED} />
                        <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{ev.signups} signed up</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: PRIMARY }}>View →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Filter modal */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
              onClick={() => setShowFilter(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 40px', maxHeight: '80vh', overflowY: 'auto' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Filter Events</span>
                  <button onClick={() => setShowFilter(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={16} color={TEXT} />
                  </button>
                </div>
                {[
                  { label: 'Age Group', key: 'ageGroups' as keyof Filters, options: AGE_GROUPS },
                  { label: 'Language', key: 'languages' as keyof Filters, options: LANGUAGES },
                  { label: 'Interest', key: 'interests' as keyof Filters, options: INTERESTS },
                  { label: 'Family Status', key: 'familyStatus' as keyof Filters, options: FAMILY_STATUS },
                ].map(({ label, key, options }) => (
                  <div key={key} style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {options.map(opt => {
                        const sel = tempFilters[key].includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => setTempFilters(p => ({ ...p, [key]: sel ? p[key].filter((x: string) => x !== opt) : [...p[key], opt] }))}
                            style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: sel ? '#FFF0EC' : BG, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid transparent`, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => { setTempFilters({ ageGroups: [], languages: [], interests: [], familyStatus: [] }); }}
                    style={{ flex: 1, padding: '14px', borderRadius: '16px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => { setFilters(tempFilters); setShowFilter(false); }}
                    style={{ flex: 2, padding: '14px', borderRadius: '16px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'inherit' }}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- Detail screen ----
  if (current.screen === 'detail') {
    const ev: EventData = current.params?.event;
    if (!ev) return null;
    const isSaved = savedEvents.includes(ev.id);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero image */}
          <div style={{ height: '260px', position: 'relative' }}>
            <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%)' }} />
            <button onClick={goBack} style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <div style={{ position: 'absolute', top: '52px', right: '16px', display: 'flex', gap: '8px' }}>
              <button onClick={() => toggleSave(ev.id)} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Bookmark size={18} color={isSaved ? PRIMARY : TEXT} fill={isSaved ? PRIMARY : 'none'} />
              </button>
              <button onClick={() => goTo('share', { event: ev })} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Share2 size={18} color={TEXT} />
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 20px 32px' }}>
            <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '20px', background: ev.categoryBg, marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: ev.categoryColor }}>{ev.category}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, marginBottom: '16px', lineHeight: '1.3' }}>{ev.title}</div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { Icon: Calendar, label: 'Date', value: ev.date },
                { Icon: Clock, label: 'Time', value: ev.time },
                { Icon: MapPin, label: 'Location', value: ev.location },
                { Icon: Globe, label: 'Language', value: ev.language },
                { Icon: Users, label: 'Audience', value: ev.audience },
                { Icon: Users, label: 'Signed Up', value: `${ev.signups} people` },
              ].map(({ Icon, label, value }) => (
                <div key={label} style={{ background: CARD, borderRadius: '16px', padding: '12px 14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Icon size={13} color={MUTED} />
                    <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, lineHeight: '1.3' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: CARD, borderRadius: '20px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>About this event</div>
              <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.6' }}>{ev.description}</div>
            </div>

            {/* Organiser */}
            <div style={{ background: CARD, borderRadius: '20px', padding: '16px 18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: ev.categoryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={18} color={ev.categoryColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: MUTED, fontWeight: 600, marginBottom: '2px' }}>Organiser</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>Bishan-AMK RC</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: '#D1FAE5' }}>
                <Shield size={11} color="#059669" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Register button */}
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={() => goTo('register', { event: ev })}
            style={{ width: '100%', padding: '16px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'inherit' }}
          >
            Register for this Event
          </button>
        </div>
      </div>
    );
  }

  // ---- Register screen ----
  if (current.screen === 'register') {
    const ev: EventData = current.params?.event;
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: CARD, padding: '52px 20px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={goBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Register</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ background: CARD, borderRadius: '22px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: TEXT, marginBottom: '8px', lineHeight: '1.3' }}>{ev?.title}</div>
            <div style={{ fontSize: '13px', color: TEXT2 }}>{ev?.date} · {ev?.time}</div>
            <div style={{ fontSize: '13px', color: TEXT2, marginTop: '4px' }}>{ev?.location}</div>
          </div>
          <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '14px 16px', display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <Shield size={18} color="#22C55E" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803D', marginBottom: '3px' }}>Singpass-verified registration</div>
              <div style={{ fontSize: '12px', color: '#166534', lineHeight: '1.5' }}>Your identity is already verified. Registration takes one tap.</div>
            </div>
          </div>
          {/* Reminder options */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Set a reminder</div>
            {['None', '1 day before', '1 hour before', '30 mins before'].map(opt => (
              <button
                key={opt}
                onClick={() => setReminderOption(opt)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', marginBottom: '8px', borderRadius: '14px', background: CARD, border: `2px solid ${reminderOption === opt ? PRIMARY : BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: reminderOption === opt ? PRIMARY : TEXT }}>{opt}</span>
                {reminderOption === opt && <Check size={16} color={PRIMARY} />}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={() => { toast.success('Registered! See you there 🎉'); goBack(); }}
            style={{ width: '100%', padding: '16px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'inherit' }}
          >
            Confirm Registration
          </button>
        </div>
      </div>
    );
  }

  // ---- Share screen ----
  if (current.screen === 'share') {
    const ev: EventData = current.params?.event;
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: CARD, padding: '52px 20px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={goBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Share Event</div>
        </div>
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: CARD, borderRadius: '22px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: '4px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>{ev?.title}</div>
            <div style={{ fontSize: '13px', color: TEXT2 }}>{ev?.date} · {ev?.time}</div>
          </div>
          {[
            { emoji: '💬', label: 'Share to WhatsApp', sub: 'Send to your contacts' },
            { emoji: '📋', label: 'Copy Link', sub: 'Copy to clipboard' },
            { emoji: '📲', label: 'Share via Jio', sub: 'Invite a neighbour directly' },
          ].map(({ emoji, label, sub }) => (
            <button
              key={label}
              onClick={() => { toast.success(`${label} — coming soon!`); }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{emoji}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{label}</div>
                <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{sub}</div>
              </div>
              <ExternalLink size={16} color={MUTED} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
