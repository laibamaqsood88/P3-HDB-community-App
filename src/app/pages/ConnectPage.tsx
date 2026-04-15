import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, X, Check, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

// ---- Design tokens ----
const BG = '#F2F2F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

// ---- Types ----
interface GroupMember { name: string; block: string; avatar: string; color: string; }
interface Group {
  id: number;
  name: string;
  emoji: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  members: number;
  membersList: GroupMember[];
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
    membersList: [
      { name: 'Alex Lim', block: 'Blk 445', avatar: 'AL', color: '#FF6B47' },
      { name: 'Ben Tan', block: 'Blk 447', avatar: 'BT', color: '#7C3AED' },
      { name: 'Diana Mak', block: 'Blk 445', avatar: 'DM', color: '#059669' },
      { name: 'Eli Ng', block: 'Blk 449', avatar: 'EN', color: '#0891B2' },
      { name: 'Gary Koh', block: 'Blk 450', avatar: 'GK', color: '#EA580C' },
      { name: 'Hannah Lee', block: 'Blk 445', avatar: 'HL', color: '#475569' },
    ],
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
    membersList: [
      { name: 'Clara Soh', block: 'Blk 448', avatar: 'CS', color: '#D97706' },
      { name: 'Fiona Raj', block: 'Blk 446', avatar: 'FR', color: '#DB2777' },
      { name: 'Ivan Wong', block: 'Blk 451', avatar: 'IW', color: '#0D9488' },
      { name: 'Jasmine Yap', block: 'Blk 452', avatar: 'JY', color: '#BE185D' },
      { name: 'Hannah Lee', block: 'Blk 445', avatar: 'HL', color: '#475569' },
    ],
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
    membersList: [
      { name: 'Diana Mak', block: 'Blk 445', avatar: 'DM', color: '#059669' },
      { name: 'Clara Soh', block: 'Blk 448', avatar: 'CS', color: '#D97706' },
      { name: 'Ivan Wong', block: 'Blk 451', avatar: 'IW', color: '#0D9488' },
      { name: 'Eli Ng', block: 'Blk 449', avatar: 'EN', color: '#0891B2' },
      { name: 'Gary Koh', block: 'Blk 450', avatar: 'GK', color: '#EA580C' },
      { name: 'Alex Lim', block: 'Blk 445', avatar: 'AL', color: '#FF6B47' },
      { name: 'Jasmine Yap', block: 'Blk 452', avatar: 'JY', color: '#BE185D' },
    ],
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
    membersList: [
      { name: 'Ben Tan', block: 'Blk 447', avatar: 'BT', color: '#7C3AED' },
      { name: 'Eli Ng', block: 'Blk 449', avatar: 'EN', color: '#0891B2' },
      { name: 'Fiona Raj', block: 'Blk 446', avatar: 'FR', color: '#DB2777' },
      { name: 'Gary Koh', block: 'Blk 450', avatar: 'GK', color: '#EA580C' },
      { name: 'Jasmine Yap', block: 'Blk 452', avatar: 'JY', color: '#BE185D' },
    ],
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
    membersList: [
      { name: 'Mr Tan Ah Kow', block: 'Blk 445', avatar: 'TA', color: '#0891B2' },
      { name: 'Mdm Wong Li Hua', block: 'Blk 447', avatar: 'WL', color: '#DB2777' },
      { name: 'Mr Lim Beng Huat', block: 'Blk 448', avatar: 'LB', color: '#059669' },
      { name: 'Mdm Chan Siew Eng', block: 'Blk 445', avatar: 'CS', color: '#EA580C' },
      { name: 'Mr Goh Teck Seng', block: 'Blk 449', avatar: 'GT', color: '#7C3AED' },
    ],
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
    membersList: [
      { name: 'Sarah Chen', block: 'Blk 447', avatar: 'SC', color: '#DB2777' },
      { name: 'Marcus Lim', block: 'Blk 448', avatar: 'ML', color: '#7C3AED' },
      { name: 'Priya Nair', block: 'Blk 449', avatar: 'PN', color: '#D97706' },
      { name: 'Darren Yeo', block: 'Blk 446', avatar: 'DY', color: '#059669' },
      { name: 'Kelly Tan', block: 'Blk 450', avatar: 'KT', color: '#EA580C' },
      { name: 'James Ho', block: 'Blk 445', avatar: 'JH', color: '#0891B2' },
    ],
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
    membersList: [
      { name: 'Hannah Lee', block: 'Blk 445', avatar: 'HL', color: '#475569' },
      { name: 'Ryan Chew', block: 'Blk 451', avatar: 'RC', color: '#EA580C' },
      { name: 'Mei Lin Tan', block: 'Blk 452', avatar: 'MT', color: '#BE185D' },
      { name: 'Ahmad Razi', block: 'Blk 447', avatar: 'AR', color: '#0D9488' },
    ],
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
    membersList: [
      { name: 'Jasmine Yap', block: 'Blk 452', avatar: 'JY', color: '#BE185D' },
      { name: 'Ivan Wong', block: 'Blk 451', avatar: 'IW', color: '#0D9488' },
      { name: 'Nurul Ain', block: 'Blk 446', avatar: 'NA', color: '#7C3AED' },
      { name: 'Wei Jie Ong', block: 'Blk 448', avatar: 'WJ', color: '#059669' },
      { name: 'Celine Koh', block: 'Blk 450', avatar: 'CK', color: '#D97706' },
    ],
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
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero */}
          <div style={{ height: '240px', position: 'relative' }}>
            <img src={group.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 55%)' }} />
            <button
              onClick={goBack}
              style={{
                position: 'absolute', top: '52px', left: '16px',
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <ChevronLeft size={20} color={TEXT} />
            </button>
          </div>

          <div style={{ padding: '0 16px 100px' }}>
            {/* Category badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', background: group.categoryBg, marginTop: '20px', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: group.categoryColor }}>{group.emoji} {group.category}</span>
            </div>

            <div style={{ fontSize: '26px', fontWeight: 700, color: TEXT, marginBottom: '6px', lineHeight: '1.25', letterSpacing: '-0.3px' }}>{group.name}</div>

            {/* Members count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <Users size={14} color={MUTED} />
              <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{group.members + (isJoined ? 1 : 0)} members</span>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { iconBg: '#FFF0EC', icon: '🕐', label: 'Meets', value: group.meetFrequency },
                { iconBg: '#FFF0EC', icon: '📍', label: 'Location', value: group.location },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: CARD, borderRadius: '14px', padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{icon}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT, lineHeight: '1.4' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div style={{ background: CARD, borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>About</div>
              <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.6' }}>{group.description}</div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {group.tags.map(tag => (
                <span key={tag} style={{ padding: '5px 12px', borderRadius: '8px', background: CARD, fontSize: '12px', fontWeight: 600, color: TEXT2, border: `1px solid ${BORDER}` }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Members list */}
            {group.membersList && group.membersList.length > 0 && (
              <div style={{ background: CARD, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Members</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} color={MUTED} />
                    <span style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{group.membersList.length}</span>
                  </div>
                </div>
                {group.membersList.map((member, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px',
                      borderBottom: i < group.membersList!.length - 1 ? '0.5px solid rgba(60,60,67,0.10)' : 'none',
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: member.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: member.color }}>{member.avatar}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{member.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={11} color={MUTED} />
                        <span style={{ fontSize: '12px', color: TEXT2 }}>{member.block}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Join / Leave button */}
        <div style={{ padding: '12px 16px 28px', background: CARD, borderTop: `0.5px solid ${BORDER}` }}>
          <button
            onClick={() => toggleJoin(group.id)}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px',
              border: isJoined ? `1.5px solid ${BORDER}` : 'none',
              background: isJoined ? CARD : PRIMARY,
              cursor: 'pointer', fontSize: '16px', fontWeight: 700,
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Search + category pills — only shown when NOT in embedded (hideHeader) mode */}
      {!hideHeader && (
        <div style={{ background: CARD, padding: '52px 16px 0', borderBottom: `0.5px solid ${BORDER}` }}>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(120,120,128,0.12)', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px' }}>
            <Search size={16} color={MUTED} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search interest groups..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '15px', color: TEXT, fontFamily: 'inherit' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <X size={14} color={MUTED} />
              </button>
            )}
          </div>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                  background: activeCategory === cat ? PRIMARY : CARD,
                  color: activeCategory === cat ? 'white' : TEXT2,
                  border: activeCategory === cat ? 'none' : '1px solid ' + BORDER,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px' }}>
        {/* My Groups */}
        {myGroups.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 16px', marginBottom: '10px' }}>My Groups</div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {myGroups.map(g => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => goTo('detail', { group: g })}
                  style={{
                    flexShrink: 0, width: '130px', borderRadius: '14px', overflow: 'hidden',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0,
                    position: 'relative', height: '100px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <img src={g.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', lineHeight: '1.3', display: 'block', textAlign: 'left' }}>{g.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* All Groups header */}
        <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 16px', marginBottom: '10px' }}>
          {effectiveCategory === 'All' ? 'All Groups' : 'Groups'} · {filteredGroups.length}
        </div>

        {filteredGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Search size={36} color={MUTED} style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No groups found</div>
            <div style={{ fontSize: '13px', color: TEXT2 }}>Try a different search or category</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredGroups.map(group => {
              const isJoined = joinedGroups.includes(group.id);
              return (
                <motion.div
                  key={group.id}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: CARD, borderRadius: '14px', overflow: 'hidden',
                    marginBottom: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                  }}
                  onClick={() => goTo('detail', { group })}
                >
                  {/* Image */}
                  <div style={{ height: '140px', position: 'relative' }}>
                    <img src={group.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '8px', background: group.categoryBg, color: group.categoryColor, fontSize: '11px', fontWeight: 700 }}>
                      {group.emoji} {group.category}
                    </div>
                    {isJoined && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '8px', background: PRIMARY, fontSize: '11px', fontWeight: 700, color: 'white' }}>
                        ✓ Joined
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: TEXT, marginBottom: '5px', lineHeight: '1.3' }}>{group.name}</div>
                    <div style={{ fontSize: '14px', color: TEXT2, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      {group.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={13} color={MUTED} />
                          <span style={{ fontSize: '13px', color: MUTED }}>{group.members + (isJoined ? 1 : 0)} members</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color={MUTED} />
                          <span style={{ fontSize: '13px', color: MUTED }}>{group.location.split(',')[0]}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} color={MUTED} />
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
              style={{ background: CARD, borderRadius: '20px 20px 0 0', padding: '16px 16px 40px', maxHeight: '70vh', overflowY: 'auto' }}
            >
              {/* Handle */}
              <div style={{ width: '36px', height: '4px', background: 'rgba(60,60,67,0.15)', borderRadius: '2px', margin: '0 auto 20px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '17px', fontWeight: 700, color: TEXT }}>Filter Groups</span>
                <button
                  onClick={() => { setShowCategoryFilter(false); onFilterClose?.(); }}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} color={TEXT} />
                </button>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {CATEGORIES.map(cat => {
                  const sel = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
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
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}
                >
                  Clear
                </button>
                <button
                  onClick={() => { setShowCategoryFilter(false); onFilterClose?.(); onCategoryChange?.(activeCategory); }}
                  style={{ flex: 2, padding: '14px', borderRadius: '14px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'inherit' }}
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
