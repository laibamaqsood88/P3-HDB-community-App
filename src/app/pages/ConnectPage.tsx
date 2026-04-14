import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, ChevronRight, X, Check, MapPin, Bell } from 'lucide-react';
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
interface Group {
  id: number;
  name: string;
  emoji: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  members: number;
  description: string;
  meetFrequency: string;
  location: string;
  tags: string[];
  image: string;
}

type GroupScreen = 'feed' | 'detail';
interface NavFrame { screen: GroupScreen; params?: any; }

// ---- Mock Data ----
const GROUPS: Group[] = [
  {
    id: 1,
    name: 'Morning Runners Club',
    emoji: '🏃',
    category: 'Fitness',
    categoryColor: '#16A34A',
    categoryBg: '#DCFCE7',
    members: 24,
    description: 'We meet every Saturday and Sunday at 7 AM for a casual run around the estate and Bishan-AMK Park. All paces welcome — we run together and no one gets left behind. Great way to start your weekend!',
    meetFrequency: 'Every Sat & Sun, 7 AM',
    location: 'Bishan-AMK Park',
    tags: ['Running', 'Outdoors', 'Weekend'],
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 2,
    name: 'Peranakan Cooking Circle',
    emoji: '🍳',
    category: 'Food',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    members: 18,
    description: 'A cosy group of food lovers sharing recipes and cooking traditional Peranakan dishes together. We meet monthly at the community hub kitchen, each time exploring a different heritage recipe.',
    meetFrequency: 'Monthly, 2nd Sunday',
    location: 'Community Hub, Blk 123',
    tags: ['Cooking', 'Heritage', 'Peranakan'],
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 3,
    name: 'Community Garden Guild',
    emoji: '🌱',
    category: 'Gardening',
    categoryColor: '#059669',
    categoryBg: '#D1FAE5',
    members: 31,
    description: 'Tending the estate rooftop garden together — from planting vegetables to composting. No experience needed! We share tips, tools, and harvests. A great way to go green with your neighbours.',
    meetFrequency: 'Every 2 weeks, Sat 8 AM',
    location: 'Rooftop Garden, Blk 450',
    tags: ['Gardening', 'Sustainability', 'Outdoors'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 4,
    name: 'Board Game Crew',
    emoji: '🎲',
    category: 'Games',
    categoryColor: '#7C3AED',
    categoryBg: '#EDE9FE',
    members: 15,
    description: 'From Catan to Codenames, we love a good game session. Bring your favourite game or try from our library. Snacks provided. Perfect for adults who want to unwind and meet new friends.',
    meetFrequency: 'Every Sat, 2–5 PM',
    location: 'RC Hall, Blk 447',
    tags: ['Board Games', 'Indoor', 'Social'],
    image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 5,
    name: 'Seniors Wellness Circle',
    emoji: '🧘',
    category: 'Wellness',
    categoryColor: '#0891B2',
    categoryBg: '#CFFAFE',
    members: 42,
    description: 'Weekly Tai Chi and light stretching sessions for seniors. Conducted in Mandarin. Improve balance, stay active, and enjoy good company. Wear comfortable clothing and flat shoes.',
    meetFrequency: 'Every Wed & Fri, 7:30 AM',
    location: 'Void Deck, Blk 445',
    tags: ['Tai Chi', 'Wellness', 'Seniors'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 6,
    name: 'Parents & Kids Playgroup',
    emoji: '👨‍👩‍👧',
    category: 'Family',
    categoryColor: '#DB2777',
    categoryBg: '#FCE7F3',
    members: 28,
    description: 'A friendly group for parents with young children to meet, play, and share parenting tips. Activities include outdoor play, arts & crafts, and storytime. Kids aged 1–6 welcome.',
    meetFrequency: 'Every Sunday, 10 AM',
    location: 'Playground, Blk 449',
    tags: ['Kids', 'Family', 'Playtime'],
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 7,
    name: 'Photography Walkers',
    emoji: '📸',
    category: 'Arts',
    categoryColor: '#EA580C',
    categoryBg: '#FFEDD5',
    members: 11,
    description: 'Casual photography walks around the estate and nearby parks. Share your shots, get tips from more experienced members, and see your neighbourhood through a new lens. All cameras welcome.',
    meetFrequency: 'Monthly, last Saturday',
    location: 'Meet at Blk 445',
    tags: ['Photography', 'Outdoors', 'Creative'],
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 8,
    name: 'Neighbourhood Book Club',
    emoji: '📚',
    category: 'Reading',
    categoryColor: '#475569',
    categoryBg: '#F1F5F9',
    members: 14,
    description: 'We read one book a month and meet to discuss over tea. Fiction, non-fiction, local authors — we love it all. A quiet, welcoming space for readers of all tastes.',
    meetFrequency: 'Monthly, 3rd Friday, 7:30 PM',
    location: 'Community Corner, Blk 123',
    tags: ['Reading', 'Discussion', 'Evening'],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

const CATEGORIES = ['All', 'Fitness', 'Food', 'Gardening', 'Games', 'Wellness', 'Family', 'Arts', 'Reading'];

// ---- Props ----
interface ConnectPageProps {
  hideHeader?: boolean;
  externalSearchQuery?: string;
  externalCategory?: string;
  showExternalFilter?: boolean;
  onFilterClose?: () => void;
  onCategoryChange?: (cat: string) => void;
}

export function ConnectPage({ hideHeader = false, externalSearchQuery, externalCategory, showExternalFilter = false, onFilterClose, onCategoryChange }: ConnectPageProps) {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const current = navStack[navStack.length - 1];
  const goTo = (screen: GroupScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  // Sync external filter open signal
  useEffect(() => {
    if (showExternalFilter) {
      setShowCategoryFilter(true);
    }
  }, [showExternalFilter]);

  const toggleJoin = (id: number) => {
    setJoinedGroups(p => {
      const joined = p.includes(id);
      toast.success(joined ? 'Left group' : 'Joined! Welcome to the group 🎉');
      return joined ? p.filter(x => x !== id) : [...p, id];
    });
  };

  // Use external search query / category if hideHeader, otherwise use internal
  const effectiveQuery = hideHeader ? (externalSearchQuery ?? '') : searchQuery;
  const effectiveCategory = hideHeader ? (externalCategory ?? 'All') : activeCategory;

  const filteredGroups = GROUPS.filter(g => {
    if (effectiveCategory !== 'All' && g.category !== effectiveCategory) return false;
    if (effectiveQuery && !g.name.toLowerCase().includes(effectiveQuery.toLowerCase()) && !g.category.toLowerCase().includes(effectiveQuery.toLowerCase())) return false;
    return true;
  });

  const myGroups = GROUPS.filter(g => joinedGroups.includes(g.id));

  // ---- Detail screen ----
  if (current.screen === 'detail') {
    const group: Group = current.params?.group;
    if (!group) return null;
    const isJoined = joinedGroups.includes(group.id);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero */}
          <div style={{ height: '240px', position: 'relative' }}>
            <img src={group.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 50%)' }} />
            <button
              onClick={goBack}
              style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
            >
              <X size={18} color={TEXT} />
            </button>
          </div>

          <div style={{ padding: '20px 20px 32px' }}>
            {/* Category badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', background: group.categoryBg, marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: group.categoryColor }}>{group.emoji} {group.category}</span>
            </div>

            <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, marginBottom: '6px', lineHeight: '1.3' }}>{group.name}</div>

            {/* Members pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <Users size={14} color={MUTED} />
              <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>{group.members + (isJoined ? 1 : 0)} members</span>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { icon: '🕐', label: 'Meets', value: group.meetFrequency },
                { icon: '📍', label: 'Location', value: group.location },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: CARD, borderRadius: '16px', padding: '12px 14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '10px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{icon} {label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT, lineHeight: '1.4' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div style={{ background: CARD, borderRadius: '20px', padding: '18px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>About this group</div>
              <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.6' }}>{group.description}</div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {group.tags.map(tag => (
                <span key={tag} style={{ padding: '5px 12px', borderRadius: '20px', background: BG, fontSize: '12px', fontWeight: 600, color: TEXT2, border: `1px solid ${BORDER}` }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Join / Leave button */}
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={() => toggleJoin(group.id)}
            style={{
              width: '100%', padding: '16px', borderRadius: '18px', border: isJoined ? `2px solid ${BORDER}` : 'none',
              background: isJoined ? CARD : PRIMARY,
              cursor: 'pointer', fontSize: '15px', fontWeight: 800,
              color: isJoined ? TEXT2 : 'white', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {isJoined ? <><Check size={16} /> Leave Group</> : <>Join Group</>}
          </button>
        </div>
      </div>
    );
  }

  // ---- Feed screen ----
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Search + category pills — only shown when NOT in embedded (hideHeader) mode */}
      {!hideHeader && (
        <div style={{ background: CARD, padding: '14px 20px 0px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '14px', padding: '10px 14px', marginBottom: '12px' }}>
            <Search size={16} color={MUTED} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search interest groups..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: TEXT, fontFamily: 'inherit' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <X size={14} color={MUTED} />
              </button>
            )}
          </div>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px' }}>
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
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>
        {/* My Groups */}
        {myGroups.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>My Groups</div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {myGroups.map(g => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goTo('detail', { group: g })}
                  style={{
                    flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    padding: '12px 16px', background: CARD, borderRadius: '18px', border: `2px solid ${PRIMARY}`,
                    cursor: 'pointer', fontFamily: 'inherit', width: '90px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{g.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: TEXT, textAlign: 'center', lineHeight: '1.3' }}>{g.name.split(' ').slice(0, 2).join(' ')}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* All Groups */}
        <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          {effectiveCategory === 'All' ? 'All Groups' : 'Groups'} · {filteredGroups.length}
        </div>

        {filteredGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No groups found</div>
            <div style={{ fontSize: '13px', color: TEXT2 }}>Try a different search or category</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredGroups.map(group => {
              const isJoined = joinedGroups.includes(group.id);
              return (
                <motion.div
                  key={group.id}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer' }}
                  onClick={() => goTo('detail', { group })}
                >
                  {/* Image */}
                  <div style={{ height: '130px', position: 'relative' }}>
                    <img src={group.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '20px', background: group.categoryBg, color: group.categoryColor, fontSize: '11px', fontWeight: 700 }}>
                      {group.emoji} {group.category}
                    </div>
                    {isJoined && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '20px', background: PRIMARY, fontSize: '11px', fontWeight: 700, color: 'white' }}>
                        ✓ Joined
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '4px', lineHeight: '1.3' }}>{group.name}</div>
                    <div style={{ fontSize: '12px', color: TEXT2, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                      {group.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={12} color={MUTED} />
                          <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{group.members + (isJoined ? 1 : 0)} members</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color={MUTED} />
                          <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{group.location.split(',')[0]}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: PRIMARY }}>View →</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category filter bottom sheet (for embedded mode) */}
      <AnimatePresence>
        {showCategoryFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
            onClick={() => { setShowCategoryFilter(false); onFilterClose?.(); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 40px', maxHeight: '70vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Filter Groups</span>
                <button
                  onClick={() => { setShowCategoryFilter(false); onFilterClose?.(); }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} color={TEXT} />
                </button>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {CATEGORIES.map(cat => {
                  const sel = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                        background: sel ? '#FFF0EC' : BG,
                        color: sel ? PRIMARY : TEXT2,
                        border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid transparent`,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => { setActiveCategory('All'); onCategoryChange?.('All'); }}
                  style={{ flex: 1, padding: '14px', borderRadius: '16px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => { setShowCategoryFilter(false); onFilterClose?.(); onCategoryChange?.(activeCategory); }}
                  style={{ flex: 2, padding: '14px', borderRadius: '16px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'inherit' }}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
