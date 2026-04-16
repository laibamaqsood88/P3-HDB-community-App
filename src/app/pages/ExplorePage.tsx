import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Bookmark, Share2, X, Shield,
  Calendar, MapPin, Users, Search, Check, Clock, Star, ExternalLink, MessageCircle, SlidersHorizontal, Link2, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { ConnectPage } from './ConnectPage';
import { NeighbourProfile } from './NeighbourProfilePage';

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
  | 'feed' | 'filtered' | 'detail' | 'share' | 'going'
  | 'singpass' | 'recipient-detail' | 'non-resident'
  | 'register' | 'browser';

interface EventData {
  id: number; title: string; date: string; time: string;
  location: string; address: string; language: string; audience: string;
  attendees: number; signups: number; going: number; price: string; image: string;
  description: string; category: string; categoryColor: string; categoryBg: string;
  organizer: string; organizerRating: number; organizerReviews: number; organizerImage: string;
}

interface Filters {
  ageGroups: string[]; languages: string[];
  interests: string[]; familyStatus: string[];
}

interface NavFrame { screen: EventScreen; params?: any; }

// ---- Mock Data ----
const EVENTS: EventData[] = [
  {
    id: 1, title: 'Morning Run at Bishan-AMK Park', date: 'Sat, 12 Apr 2026', time: '7:00 AM – 9:00 AM',
    location: 'Bishan-AMK Park, Main Pavilion', address: '1384 Ang Mo Kio Ave 1, S569931',
    language: 'English', audience: 'Adults 25–45',
    attendees: 8, signups: 24, going: 24, price: 'Free',
    organizer: 'Bishan-AMK RC', organizerRating: 4.8, organizerReviews: 124,
    organizerImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#16A34A', categoryBg: '#DCFCE7', category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Join your neighbours for a refreshing morning run around Bishan-AMK Park. Suitable for casual joggers and experienced runners alike. Meet at the main pavilion at 6:50 AM. Water stations provided along the route. All fitness levels welcome — we run at a conversational pace so no one gets left behind.',
  },
  {
    id: 2, title: 'Peranakan Cooking Workshop', date: 'Sun, 13 Apr 2026', time: '10:00 AM – 1:00 PM',
    location: 'Blk 123 Community Hub, Level 2', address: 'Blk 123 Ang Mo Kio Ave 6, S560123',
    language: 'English / Mandarin', audience: 'All Ages',
    attendees: 12, signups: 30, going: 30, price: 'Free',
    organizer: 'Bishan CC', organizerRating: 4.9, organizerReviews: 359,
    organizerImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#D97706', categoryBg: '#FEF3C7', category: 'Cooking',
    image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Learn to cook traditional Peranakan dishes with your neighbours! Mrs Lim will guide you through making Ayam Buah Keluak and Kueh Pie Tee. Ingredients provided. Limited to 15 participants. Perfect for families and food enthusiasts who want to connect over Singapore heritage food.',
  },
  {
    id: 3, title: 'Community Garden Morning', date: 'Sat, 19 Apr 2026', time: '8:00 AM – 11:00 AM',
    location: 'Rooftop Garden, Blk 450', address: 'Blk 450 Ang Mo Kio Ave 10, S560450',
    language: 'English', audience: 'All Ages',
    attendees: 5, signups: 18, going: 18, price: 'Free',
    organizer: 'Green Thumbs SG', organizerRating: 4.7, organizerReviews: 88,
    organizerImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#059669', categoryBg: '#D1FAE5', category: 'Gardening',
    image: 'https://images.unsplash.com/photo-1759716705272-8d1697eccf7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: "Help tend the estate's shared rooftop garden! Activities include planting vegetables, pruning herbs, and composting. No experience needed — seasoned gardeners and curious beginners are both welcome. Gloves and tools provided. We meet every fortnight to grow our community garden together.",
  },
  {
    id: 4, title: 'Saturday Board Game Afternoon', date: 'Sat, 19 Apr 2026', time: '2:00 PM – 5:00 PM',
    location: 'RC Multi-Purpose Hall, Blk 447', address: 'Blk 447 Ang Mo Kio Ave 10, S560447',
    language: 'English', audience: 'Adults 20–40',
    attendees: 6, signups: 15, going: 15, price: 'Free',
    organizer: 'Bishan-AMK RC', organizerRating: 4.6, organizerReviews: 72,
    organizerImage: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#7C3AED', categoryBg: '#EDE9FE', category: 'Board Games',
    image: 'https://images.unsplash.com/photo-1762068383473-f59f4dc614e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: "Bring your favourite board games or try something new from the communal game library. From Catan to Codenames, there's something for everyone. Snacks and drinks provided. Great way to meet neighbours who love strategy and fun in a relaxed Saturday afternoon setting.",
  },
  {
    id: 5, title: 'Seniors Tai Chi Morning', date: 'Wed, 16 Apr 2026', time: '7:30 AM – 9:00 AM',
    location: 'Void Deck, Blk 445', address: 'Blk 445 Ang Mo Kio Ave 10, S560445',
    language: 'Mandarin', audience: 'Seniors 55+',
    attendees: 15, signups: 40, going: 40, price: 'Free',
    organizer: 'Active Ageing SG', organizerRating: 4.9, organizerReviews: 201,
    organizerImage: 'https://images.unsplash.com/photo-1690254995096-6e3cc6263e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#0891B2', categoryBg: '#CFFAFE', category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1690254995096-6e3cc6263e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Weekly Tai Chi sessions for seniors conducted in Mandarin by a certified instructor. Improve balance, reduce stress, and meet fellow residents. Wear comfortable clothing and flat shoes. Open to all senior residents. No prior experience required — we have been running this weekly session for 3 years.',
  },
];

const AGE_GROUPS = ['All Ages', '20–35', '35–50', '55+'];
const LANGUAGES = ['English', 'Mandarin', 'Malay', 'Tamil', 'Multilingual'];
const INTERESTS = ['Fitness', 'Cooking', 'Gardening', 'Board Games', 'Arts & Crafts', 'Music'];
const FAMILY_STATUS = ['Single', 'Couple', 'Living with kids', 'Living with parents', 'Multigenerational', 'Senior (60 and above)'];
const CATEGORIES = ['All', '🏃 Fitness', '🍳 Cooking', '🌱 Gardening', '🎲 Board Games', '💆 Wellness'];

const FAMILY_STATUS_BREAKDOWN = [
  { label: 'Single',              count: 8,  color: '#FF6B47' },
  { label: 'Couple',              count: 5,  color: '#7C3AED' },
  { label: 'Living with kids',    count: 6,  color: '#D97706' },
  { label: 'Living with parents', count: 3,  color: '#0891B2' },
  { label: 'Multigenerational',   count: 2,  color: '#059669' },
  { label: 'Senior (60+)',        count: 7,  color: '#DB2777' },
];

const LANGUAGE_BREAKDOWN = [
  { label: 'English',     count: 14, color: '#2563EB' },
  { label: 'Mandarin',   count: 8,  color: '#D97706' },
  { label: 'Malay',      count: 4,  color: '#059669' },
  { label: 'Tamil',      count: 2,  color: '#DB2777' },
  { label: 'Multilingual', count: 3, color: '#7C3AED' },
];

const NEIGHBOURS_GOING = [
  { id: 1, initials: 'AL', name: 'Alex Lim',   color: '#FF6B47', unit: 'Blk 445 #12-34', status: 'Single',           distance: '0.1 km', interests: ['Fitness & Sports', 'Cooking & Baking'],              languages: ['English', 'Chinese'] },
  { id: 2, initials: 'BT', name: 'Ben Tan',    color: '#7C3AED', unit: 'Blk 447 #08-12', status: 'Couple',           distance: '0.2 km', interests: ['Gaming', 'Technology & Digital Skills'],              languages: ['English', 'Chinese'] },
  { id: 3, initials: 'CS', name: 'Clara Soh',  color: '#D97706', unit: 'Blk 448 #03-22', status: 'Living with kids', distance: '0.3 km', interests: ['Cooking & Baking', 'Gardening & Plants'],             languages: ['English', 'Malay'] },
  { id: 4, initials: 'DM', name: 'Diana Mak',  color: '#059669', unit: 'Blk 445 #15-01', status: 'Senior (60+)',     distance: '0.4 km', interests: ['Gardening & Plants', 'Yoga & Mindfulness'],           languages: ['English', 'Chinese'] },
  { id: 5, initials: 'EN', name: 'Eli Ng',     color: '#0891B2', unit: 'Blk 449 #07-05', status: 'Single',           distance: '0.5 km', interests: ['Community Volunteering', 'Arts & Crafts'],            languages: ['English'] },
  { id: 6, initials: 'FR', name: 'Fiona Raj',  color: '#DB2777', unit: 'Blk 446 #11-18', status: 'Living with parents', distance: '0.6 km', interests: ['Music & Performing Arts', 'Dance'],               languages: ['English', 'Tamil'] },
  { id: 7, initials: 'GK', name: 'Gary Koh',   color: '#EA580C', unit: 'Blk 450 #04-09', status: 'Couple',           distance: '0.8 km', interests: ['DIY & Home Improvement', 'Technology & Digital Skills'], languages: ['English', 'Chinese'] },
  { id: 8, initials: 'HL', name: 'Hannah Lee', color: '#475569', unit: 'Blk 445 #09-33', status: 'Senior (60+)',     distance: '1.0 km', interests: ['Photography', 'Outdoor Activities'],                  languages: ['English', 'Chinese'] },
];

// Mock neighbour attendance data
const NEIGHBOUR_AVATARS = [
  { id: 1, name: 'Alex T.', avatar: '🟧', color: '#F97316' },
  { id: 2, name: 'Mei L.', avatar: '🟦', color: '#3B82F6' },
  { id: 3, name: 'Raj K.', avatar: '🟨', color: '#FBBF24' },
  { id: 4, name: 'Sarah C.', avatar: '🟪', color: '#A855F7' },
  { id: 5, name: 'Jun W.', avatar: '🟩', color: '#10B981' },
];

// Determine which neighbours are attending which events
const EVENT_ATTENDEES: Record<number, number[]> = {
  1: [1, 2, 5],           // Morning Run: Alex, Mei, Jun
  2: [2, 3, 4, 5],        // Cooking: Mei, Raj, Sarah, Jun
  3: [1, 4, 5],           // Garden: Alex, Sarah, Jun
  4: [2, 3],              // Board Games: Mei, Raj
  5: [1, 3, 4],           // Tai Chi: Alex, Raj, Sarah
};


// ---- Neighbours Mock Data ----
const MOCK_NEIGHBOURS = [
  { id: 1, name: 'Alex Lim',    distance: '0.1 km', unit: 'Blk 445 #12-34', interests: ['Fitness & Sports', 'Cooking & Baking'],              avatar: 'AL', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#FF6B47', lastActive: '2 hours ago',  languages: ['English', 'Chinese'] },
  { id: 2, name: 'Ben Tan',     distance: '0.2 km', unit: 'Blk 447 #08-12', interests: ['Gaming', 'Technology & Digital Skills'],              avatar: 'BT', avatarUrl: undefined, color: '#7C3AED', lastActive: '5 hours ago',  languages: ['English', 'Chinese'] },
  { id: 3, name: 'Clara Soh',   distance: '0.3 km', unit: 'Blk 448 #03-22', interests: ['Cooking & Baking', 'Gardening & Plants'],             avatar: 'CS', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#D97706', lastActive: '1 day ago',    languages: ['English', 'Malay'] },
  { id: 4, name: 'Diana Mak',   distance: '0.4 km', unit: 'Blk 445 #15-01', interests: ['Gardening & Plants', 'Yoga & Mindfulness'],           avatar: 'DM', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#059669', lastActive: '3 hours ago',  languages: ['English', 'Chinese'] },
  { id: 5, name: 'Eli Ng',      distance: '0.5 km', unit: 'Blk 449 #07-05', interests: ['Community Volunteering', 'Arts & Crafts'],            avatar: 'EN', avatarUrl: undefined, color: '#0891B2', lastActive: 'Just now',     languages: ['English'] },
  { id: 6, name: 'Fiona Raj',   distance: '0.6 km', unit: 'Blk 446 #11-18', interests: ['Music & Performing Arts', 'Dance'],                   avatar: 'FR', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#DB2777', lastActive: '30 min ago',   languages: ['English', 'Tamil'] },
  { id: 7, name: 'Gary Koh',    distance: '0.8 km', unit: 'Blk 450 #04-09', interests: ['DIY & Home Improvement', 'Technology & Digital Skills'], avatar: 'GK', avatarUrl: undefined, color: '#EA580C', lastActive: '2 days ago', languages: ['English', 'Chinese'] },
  { id: 8, name: 'Hannah Lee',  distance: '1.0 km', unit: 'Blk 445 #09-33', interests: ['Photography', 'Outdoor Activities'],                  avatar: 'HL', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#475569', lastActive: '4 hours ago',  languages: ['English', 'Chinese'] },
  { id: 9, name: 'Ivan Wong',   distance: '1.2 km', unit: 'Blk 451 #02-15', interests: ['Language Learning', 'Cultural Heritage & Festivals'], avatar: 'IW', avatarUrl: undefined, color: '#0D9488', lastActive: '1 hour ago',   languages: ['English', 'Malay', 'Japanese'] },
  { id: 10, name: 'Jasmine Yap', distance: '1.5 km', unit: 'Blk 452 #06-28', interests: ['Fashion & Beauty', 'Arts & Crafts'],                 avatar: 'JY', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#BE185D', lastActive: '6 hours ago',  languages: ['English', 'Chinese'] },
];

const NEIGHBOUR_INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  'Community Volunteering':       { bg: '#FEE2E2', text: '#DC2626' },
  'Cultural Heritage & Festivals':{ bg: '#FEF3C7', text: '#B45309' },
  'Fitness & Sports':             { bg: '#DCFCE7', text: '#16A34A' },
  'Yoga & Mindfulness':           { bg: '#F3E8FF', text: '#9333EA' },
  'Outdoor Activities':           { bg: '#CCFBF1', text: '#0D9488' },
  'Arts & Crafts':                { bg: '#FCE7F3', text: '#DB2777' },
  'Music & Performing Arts':      { bg: '#FFE4E6', text: '#E11D48' },
  'Dance':                        { bg: '#EDE9FE', text: '#7C3AED' },
  'Cooking & Baking':             { bg: '#FEF3C7', text: '#D97706' },
  'Technology & Digital Skills':  { bg: '#DBEAFE', text: '#2563EB' },
  'DIY & Home Improvement':       { bg: '#F1F5F9', text: '#475569' },
  'Language Learning':            { bg: '#CFFAFE', text: '#0891B2' },
  'Pets & Animals':               { bg: '#FEF9C3', text: '#CA8A04' },
  'Gardening & Plants':           { bg: '#D1FAE5', text: '#059669' },
  'Gaming':                       { bg: '#E0E7FF', text: '#4F46E5' },
  'Fashion & Beauty':             { bg: '#FCE7F3', text: '#BE185D' },
  'Photography':                  { bg: '#FAE8FF', text: '#A21CAF' },
};

interface ExplorePageProps {
  initialEventId?: number;
  initialSubTab?: 'events' | 'groups' | 'neighbours';
  onSubTabChange?: (tab: 'events' | 'groups' | 'neighbours') => void;
  userInterests?: string[];
  onAddConversation?: (conv: any) => void;
  onOpenDirectChat?: (conv: any) => void;
  onNavVisibilityChange?: (visible: boolean) => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
}

export function ExplorePage({ initialEventId, initialSubTab = 'events', onSubTabChange, userInterests = [], onAddConversation, onOpenDirectChat, onNavVisibilityChange, onOpenNeighbourProfile }: ExplorePageProps) {
  const initialScreen: NavFrame = initialEventId
    ? { screen: 'detail', params: { event: EVENTS.find(e => e.id === initialEventId) || EVENTS[0] } }
    : { screen: 'feed' };

  const [navStack, setNavStack] = useState<NavFrame[]>([initialScreen]);
  const [filters, setFilters] = useState<Filters>({ ageGroups: [], languages: [], interests: [], familyStatus: [] });
  const [tempFilters, setTempFilters] = useState<Filters>({ ageGroups: [], languages: [], interests: [], familyStatus: [] });
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [reminderOption, setReminderOption] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'events' | 'groups' | 'neighbours'>(initialSubTab);
  const [searchMode, setSearchMode] = useState(false);
  const [searchScopeTab, setSearchScopeTab] = useState<'events' | 'groups' | 'neighbours'>(initialSubTab);
  const [showGroupFilter, setShowGroupFilter] = useState(false);
  const [showNeighbourFilter, setShowNeighbourFilter] = useState(false);
  const [activeGroupCategory, setActiveGroupCategory] = useState('All');
  const [distanceFilter, setDistanceFilter] = useState('Any');
  const [filterSharedOnly, setFilterSharedOnly] = useState(false);
  const [filterRecentOnly, setFilterRecentOnly] = useState(false);
  const [groupInDetail, setGroupInDetail] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);

  const handleSubTabChange = (tab: 'events' | 'groups' | 'neighbours') => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollProgress(Math.min(e.currentTarget.scrollTop / 60, 1));
  };

  const current = navStack[navStack.length - 1];
  const goTo = (screen: EventScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  useEffect(() => {
    const atRoot = current.screen === 'feed' || current.screen === 'filtered';
    onNavVisibilityChange?.(atRoot);
  }, [current.screen]);

  useEffect(() => {
    if (activeSubTab === 'groups') {
      onNavVisibilityChange?.(!groupInDetail);
    }
  }, [groupInDetail, activeSubTab]);

  const activeFilterCount = Object.values(filters).flat().length;

  // Helper: Check if event matches selected age groups
  const matchesAgeGroup = (ev: EventData): boolean => {
    if (filters.ageGroups.length === 0) return true;
    const audience = ev.audience.toLowerCase();
    return filters.ageGroups.some(group => {
      if (group === 'All Ages') return audience.includes('all ages');
      if (group === '20–35') return audience.includes('20–35') || audience.includes('20') || audience.includes('adults 20') || audience.includes('adults 25');
      if (group === '35–50') return audience.includes('35–50') || audience.includes('adults 35') || audience.includes('adults 40');
      if (group === '55+') return audience.includes('55+') || audience.includes('seniors');
      if (group === 'Families') return audience.includes('families');
      return false;
    });
  };

  // Helper: Check if event matches selected family status
  const matchesFamilyStatus = (ev: EventData): boolean => {
    if (filters.familyStatus.length === 0) return true;
    const audience = ev.audience.toLowerCase();
    return filters.familyStatus.some(status => {
      if (status === 'Families') return audience.includes('families');
      if (status === 'Individual') return audience.includes('individual') || audience.includes('adults');
      if (status === 'Parents') return audience.includes('parents') || audience.includes('families');
      if (status === 'Seniors') return audience.includes('seniors') || audience.includes('55+');
      return false;
    });
  };

  const filteredEvents = EVENTS.filter(ev => {
    if (filters.interests.length > 0 && !filters.interests.includes(ev.category)) return false;
    if (filters.languages.length > 0 && !filters.languages.some(l => ev.language.includes(l))) return false;
    if (filters.ageGroups.length > 0 && !matchesAgeGroup(ev)) return false;
    if (filters.familyStatus.length > 0 && !matchesFamilyStatus(ev)) return false;
    if (activeCategory !== 'All' && !activeCategory.includes(ev.category)) return false;
    if (searchQuery && !ev.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id: number) => setSavedEvents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleRegister = (id: number) => setRegisteredEvents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // ---- Feed screen (unified for all 3 sub-tabs) ----
  if (current.screen === 'feed' || current.screen === 'filtered') {
    const groupFilterActive = activeGroupCategory !== 'All';
    const neighbourFilterActive = distanceFilter !== 'Any' || filterSharedOnly || filterRecentOnly;
    const filterLabel = activeSubTab === 'events' ? 'Events' : activeSubTab === 'groups' ? 'Groups' : 'Neighbours';
    const isFilterActive = activeSubTab === 'events' ? activeFilterCount > 0 : activeSubTab === 'groups' ? groupFilterActive : neighbourFilterActive;

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif", position: 'relative' }}>

        {/* ── Shared Header ── */}
        {!(activeSubTab === 'groups' && groupInDetail) && <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {!searchMode ? (
            <>
              {/* Normal mode: Title + icons */}
              <div style={{ padding: `${44 - (scrollProgress * 4)}px 16px ${14 - (scrollProgress * 6)}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding 0.1s linear' }}>
                <span style={{ fontSize: `${28 - (scrollProgress * 8)}px`, fontWeight: 800, color: TEXT, letterSpacing: '-0.5px', transition: 'font-size 0.1s linear' }}>Explore</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setSearchScopeTab(activeSubTab); setSearchMode(true); }}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Search size={18} color={TEXT2} />
                  </button>
                  <button
                    onClick={() => {
                      if (activeSubTab === 'events') { setTempFilters(filters); setShowFilter(true); }
                      else if (activeSubTab === 'groups') setShowGroupFilter(true);
                      else setShowNeighbourFilter(true);
                    }}
                    style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', background: isFilterActive ? '#FFF0EC' : 'rgba(120,120,128,0.10)', border: isFilterActive ? `1.5px solid #FFD0C3` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SlidersHorizontal size={17} color={isFilterActive ? PRIMARY : TEXT2} />
                    {activeSubTab === 'events' && activeFilterCount > 0 && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px', width: '14px', height: '14px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
                        <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{activeFilterCount}</span>
                      </div>
                    )}
                    {activeSubTab !== 'events' && isFilterActive && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px', width: '10px', height: '10px', borderRadius: '50%', background: PRIMARY, border: '2px solid white' }} />
                    )}
                  </button>
                </div>
              </div>
              {/* Normal mode: Sub-tabs */}
              <div style={{ display: 'flex' }}>
                {(['events', 'groups', 'neighbours'] as const).map(tab => {
                  const isActive = activeSubTab === tab;
                  return (
                    <button key={tab}
                      onClick={() => handleSubTabChange(tab)}
                      style={{ flex: 1, padding: '8px 0 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? TEXT : MUTED, paddingBottom: '10px' }}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </span>
                      {isActive && <div style={{ position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '2px', background: TEXT, borderRadius: '2px' }} />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Search mode: Back + Sub-tabs row */}
              <div style={{ padding: '44px 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button onClick={() => { setSearchMode(false); setSearchQuery(''); }}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronLeft size={20} color={TEXT} />
                </button>
                <div style={{ flex: 1, display: 'flex' }}>
                  {(['events', 'groups', 'neighbours'] as const).map(tab => {
                    const isActive = searchScopeTab === tab;
                    return (
                      <button key={tab}
                        onClick={() => { setSearchScopeTab(tab); handleSubTabChange(tab); }}
                        style={{ flex: 1, padding: '8px 0 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? TEXT : MUTED, paddingBottom: '10px' }}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                        {isActive && <div style={{ position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '2px', background: TEXT, borderRadius: '2px' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Search mode: Search input row */}
              <div style={{ padding: '8px 16px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '50px', background: 'rgba(120,120,128,0.10)' }}>
                  <Search size={14} color={MUTED} />
                  <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Search ${searchScopeTab}...`}
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
                    onKeyDown={e => { if (e.key === 'Enter') { handleSubTabChange(searchScopeTab); setSearchMode(false); } }} />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={14} color={MUTED} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>}

        {/* ── Tab content ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>

          {/* Events */}
          {activeSubTab === 'events' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px', background: BG }} onScroll={handleScroll}>
              {filteredEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No events found</div>
                  <div style={{ fontSize: '13px', color: TEXT2 }}>Try adjusting your filters</div>
                </div>
              ) : (
                <div>
                  {(() => {
                    const todayDate = new Date(2026, 3, 16);
                    const tomorrowDate = new Date(2026, 3, 17);
                    const MONTH_MAP: Record<string, number> = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };

                    const getDateLabel = (dateStr: string) => {
                      const commaIdx = dateStr.indexOf(', ');
                      if (commaIdx === -1) return dateStr;
                      const dayPart = dateStr.slice(commaIdx + 2); // e.g. "16 Apr 2026"
                      const [d, m, y] = dayPart.split(' ');
                      const parsed = new Date(parseInt(y), MONTH_MAP[m] ?? 0, parseInt(d));
                      if (parsed.toDateString() === todayDate.toDateString()) return 'Today';
                      if (parsed.toDateString() === tomorrowDate.toDateString()) return 'Tomorrow';
                      const weekday = dateStr.slice(0, commaIdx); // e.g. "Sat"
                      return `${weekday}, ${d} ${m}`;
                    };

                    const getDateMs = (dateStr: string) => {
                      const commaIdx = dateStr.indexOf(', ');
                      if (commaIdx === -1) return 0;
                      const [d, m, y] = dateStr.slice(commaIdx + 2).split(' ');
                      return new Date(parseInt(y), MONTH_MAP[m] ?? 0, parseInt(d)).getTime();
                    };

                    const sorted = [...filteredEvents].sort((a, b) => getDateMs(a.date) - getDateMs(b.date));

                    const groups: Record<string, EventData[]> = {};
                    const groupOrder: string[] = [];
                    sorted.forEach(ev => {
                      const label = getDateLabel(ev.date);
                      if (!groups[label]) { groups[label] = []; groupOrder.push(label); }
                      groups[label].push(ev);
                    });

                    return groupOrder.map(label => (
                      <div key={label} style={{ marginBottom: '8px' }}>
                        {/* Date section header */}
                        <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, padding: '8px 0 10px', letterSpacing: '-0.2px' }}>
                          {label}
                        </div>
                        {/* Event rows */}
                        {groups[label].map((ev, idx) => (
                          <motion.div
                            key={ev.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => goTo('detail', { event: ev })}
                            style={{
                              background: CARD,
                              borderRadius: '16px',
                              overflow: 'hidden',
                              boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              marginBottom: idx < groups[label].length - 1 ? '10px' : '0',
                            }}
                          >
                            {/* Left: square thumbnail */}
                            <div style={{ width: '88px', height: '88px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                              <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{
                                position: 'absolute', bottom: '5px', left: '5px',
                                padding: '2px 6px', borderRadius: '6px',
                                background: ev.categoryBg, color: ev.categoryColor,
                                fontSize: '9px', fontWeight: 800, lineHeight: '1.4',
                              }}>
                                {ev.category}
                              </div>
                            </div>

                            {/* Right: info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '11px', color: MUTED, fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ev.organizer}
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: TEXT, lineHeight: '1.3', marginBottom: '7px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                                {ev.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                                <Clock size={11} color={MUTED} />
                                <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{ev.time}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={11} color={MUTED} />
                                <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.location}</span>
                              </div>
                            </div>

                            {/* Bookmark */}
                            <button
                              onClick={e => { e.stopPropagation(); toggleSave(ev.id); }}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(120,120,128,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >
                              <Bookmark size={14} color={savedEvents.includes(ev.id) ? PRIMARY : MUTED} fill={savedEvents.includes(ev.id) ? PRIMARY : 'none'} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Groups */}
          {activeSubTab === 'groups' && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ConnectPage
                hideHeader={true}
                externalSearchQuery={searchQuery}
                externalCategory={activeGroupCategory}
                showExternalFilter={showGroupFilter}
                onFilterClose={() => setShowGroupFilter(false)}
                onCategoryChange={setActiveGroupCategory}
                onOpenNeighbourProfile={onOpenNeighbourProfile}
                onDetailModeChange={setGroupInDetail}
              />
            </div>
          )}

          {/* Neighbours */}
          {activeSubTab === 'neighbours' && (
            <NeighboursTab
              userInterests={userInterests}
              onAddConversation={onAddConversation}
              onOpenDirectChat={onOpenDirectChat}
              externalSearchQuery={searchQuery}
              distanceFilter={distanceFilter}
              filterSharedOnly={filterSharedOnly}
              filterRecentOnly={filterRecentOnly}
              showExternalFilter={showNeighbourFilter}
              onFilterClose={() => setShowNeighbourFilter(false)}
              onDistanceChange={setDistanceFilter}
              onSharedOnlyChange={setFilterSharedOnly}
              onRecentOnlyChange={setFilterRecentOnly}
              onOpenNeighbourProfile={onOpenNeighbourProfile}
            />
          )}
        </div>

        {/* ── Events filter panel ── */}
        <AnimatePresence>
          {activeSubTab === 'events' && showFilter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
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
                    onClick={() => setTempFilters({ ageGroups: [], languages: [], interests: [], familyStatus: [] })}
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
    const isRegistered = registeredEvents.includes(ev.id);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero image */}
          <div style={{ height: '260px', position: 'relative' }}>
            <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%)' }} />
            <button onClick={goBack} style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <div style={{ position: 'absolute', top: '52px', right: '16px', display: 'flex', gap: '8px' }}>
              <button onClick={() => goTo('share', { event: ev })} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Share2 size={17} color={TEXT} />
              </button>
              <button onClick={() => toggleSave(ev.id)} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Bookmark size={17} color={isSaved ? PRIMARY : TEXT} fill={isSaved ? PRIMARY : 'none'} />
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 20px 32px' }}>
            {/* Category badge */}
            <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '20px', background: ev.categoryBg, marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: ev.categoryColor }}>{ev.category}</span>
            </div>

            {/* Title */}
            <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, marginBottom: '18px', lineHeight: '1.3' }}>{ev.title}</div>

            {/* Date row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px', padding: '14px 16px', background: CARD, borderRadius: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={16} color={PRIMARY} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{ev.date}</div>
                <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500, marginTop: '2px' }}>{ev.time} GMT+8</div>
              </div>
            </div>

            {/* Location row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px', padding: '14px 16px', background: CARD, borderRadius: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={16} color={PRIMARY} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{ev.location}</div>
                <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500, marginTop: '2px' }}>{ev.address}</div>
              </div>
            </div>

            {/* Organizer card */}
            <div style={{ background: CARD, borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <img src={ev.organizerImage} alt="" style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: TEXT, marginBottom: '2px' }}>{ev.organizer}</div>
                <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500, marginBottom: '4px' }}>{ev.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Star size={12} color="#FF6B47" fill="#FF6B47" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT }}>{ev.organizerRating}</span>
                  <span style={{ fontSize: '12px', color: MUTED }}>· {ev.organizerReviews} reviews</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: CARD, borderRadius: '18px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>About this event</div>
              <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.65' }}>{ev.description}</div>
            </div>

            {/* Hosting & Going */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Hosting */}
              <div style={{ flex: 1, background: CARD, borderRadius: '18px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT2, marginBottom: '10px' }}>Hosting (1)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>O</span>
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: '#7C3AED', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={7} color="white" strokeWidth={3} />
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: TEXT2 }}>Super Organizer</span>
                </div>
              </div>

              {/* Going */}
              <motion.div
                whileTap={{ scale: 0.97 }}
                onClick={() => goTo('going', { event: ev })}
                style={{ flex: 1, background: CARD, borderRadius: '18px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: PRIMARY, marginBottom: '10px' }}>Going ({ev.going + (isRegistered ? 1 : 0)}) →</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {NEIGHBOURS_GOING.slice(0, 4).map((n, i) => (
                    <div key={n.id} style={{ width: '32px', height: '32px', borderRadius: '50%', background: n.color, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? '-8px' : '0' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'white' }}>{n.initials}</span>
                    </div>
                  ))}
                  {ev.going > 4 && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: TEXT2 }}>+{ev.going - 4}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>{ev.price}</div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => toggleRegister(ev.id)}
            style={{
              flex: 1, padding: '15px', borderRadius: '18px',
              background: isRegistered ? '#D1FAE5' : PRIMARY,
              border: 'none', cursor: 'pointer',
              fontSize: '15px', fontWeight: 800,
              color: isRegistered ? '#059669' : 'white',
              fontFamily: "'Nunito', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            {isRegistered ? <><Check size={16} strokeWidth={2.5} /> Attending</> : 'Attend'}
          </motion.button>
        </div>
      </div>
    );
  }

  // ---- Going breakdown screen ----
  if (current.screen === 'going') {
    const ev: EventData = current.params?.event;
    const total = FAMILY_STATUS_BREAKDOWN.reduce((s, f) => s + f.count, 0);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        {/* Header */}
        <div style={{ background: CARD, padding: '44px 20px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={goBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: TEXT }}>Who's Going</div>
            <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{ev?.title}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          {/* Horizontal bar chart */}
          <div style={{ background: CARD, borderRadius: '22px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>By Household Type</span>
              <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{total} going</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FAMILY_STATUS_BREAKDOWN.map((item, i) => (
                <div key={item.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{item.count}</span>
                      <span style={{ fontSize: '11px', color: MUTED }}>({Math.round((item.count / total) * 100)}%)</span>
                    </div>
                  </div>
                  <div style={{ height: '10px', borderRadius: '6px', background: BG, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / total) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                      style={{ height: '100%', borderRadius: '6px', background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language horizontal bar chart */}
          <div style={{ background: CARD, borderRadius: '22px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>By Language Spoken</span>
              <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{LANGUAGE_BREAKDOWN.reduce((s, i) => s + i.count, 0)} going</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {LANGUAGE_BREAKDOWN.map((item, i) => {
                const langTotal = LANGUAGE_BREAKDOWN.reduce((s, x) => s + x.count, 0);
                return (
                  <div key={item.label}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{item.count}</span>
                        <span style={{ fontSize: '11px', color: MUTED }}>({Math.round((item.count / langTotal) * 100)}%)</span>
                      </div>
                    </div>
                    <div style={{ height: '10px', borderRadius: '6px', background: BG, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / langTotal) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                        style={{ height: '100%', borderRadius: '6px', background: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neighbours attending */}
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '12px' }}>Neighbours Attending</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NEIGHBOURS_GOING.map(n => (
                <motion.div
                  key={n.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenNeighbourProfile?.({
                    name: n.name,
                    avatar: n.initials,
                    color: n.color,
                    block: n.unit.split(' #')[0],
                    distance: n.distance,
                    interests: n.interests,
                    languages: n.languages,
                  })}
                  style={{ background: CARD, borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{n.initials}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '3px' }}>{n.name}</div>
                    <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{n.unit.split(' #')[0]} · {n.distance}</div>
                  </div>
                  <ChevronLeft size={16} color={MUTED} style={{ transform: 'rotate(180deg)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Register screen ----
  if (current.screen === 'register') {
    const ev: EventData = current.params?.event;
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ background: CARD, padding: '44px 20px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Get a reminder</div>
            {['None', '1 day before', '3 days before', '1 week before'].map(opt => (
              <button
                key={opt}
                onClick={() => setReminderOption(opt)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', marginBottom: '8px', borderRadius: '14px', background: reminderOption === opt ? '#FFF0EC' : CARD, border: `2px solid ${reminderOption === opt ? PRIMARY : BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: reminderOption === opt ? PRIMARY : TEXT }}>{opt}</span>
                {reminderOption === opt && <Check size={16} color={PRIMARY} />}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
          <button
            onClick={() => {
              const reminderMsg = reminderOption !== 'None' ? ` Reminder set for ${reminderOption.toLowerCase()}.` : '';
              toast.success(`Registered! See you there.${reminderMsg}`);
              goBack();
            }}
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
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ background: CARD, padding: '44px 20px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            { Icon: MessageCircle, label: 'Share to WhatsApp', sub: 'Send to your contacts' },
            { Icon: Copy, label: 'Copy Link', sub: 'Copy to clipboard' },
            { Icon: Share2, label: 'Share via Jio', sub: 'Invite a neighbour directly' },
          ].map(({ Icon, label, sub }) => (
            <button
              key={label}
              onClick={() => { toast.success(`${label} — coming soon!`); }}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: CARD, borderRadius: '18px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={MUTED} strokeWidth={1.8} />
              </div>
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

// ---- Neighbours Sub-tab ----
function NeighboursTab({
  userInterests, onAddConversation, onOpenDirectChat,
  externalSearchQuery,
  distanceFilter, filterSharedOnly, filterRecentOnly,
  showExternalFilter, onFilterClose,
  onDistanceChange, onSharedOnlyChange, onRecentOnlyChange,
  onOpenNeighbourProfile,
}: {
  userInterests: string[];
  onAddConversation?: (conv: any) => void;
  onOpenDirectChat?: (conv: any) => void;
  externalSearchQuery?: string;
  distanceFilter: string;
  filterSharedOnly: boolean;
  filterRecentOnly: boolean;
  showExternalFilter: boolean;
  onFilterClose: () => void;
  onDistanceChange: (v: string) => void;
  onSharedOnlyChange: (v: boolean) => void;
  onRecentOnlyChange: (v: boolean) => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(5);

  const recentActiveValues = ['Just now', '30 min ago', '1 hour ago', '2 hours ago', '3 hours ago', '4 hours ago', '5 hours ago'];

  const filtered = MOCK_NEIGHBOURS.filter(n => {
    if (distanceFilter === '< 0.5 km') {
      const km = parseFloat(n.distance);
      if (km >= 0.5) return false;
    } else if (distanceFilter === '< 1 km') {
      const km = parseFloat(n.distance);
      if (km >= 1) return false;
    }
    if (filterSharedOnly) {
      const hasShared = n.interests.some(i => userInterests.includes(i));
      if (!hasShared) return false;
    }
    if (filterRecentOnly) {
      if (!recentActiveValues.includes(n.lastActive)) return false;
    }
    if (externalSearchQuery && !n.name.toLowerCase().includes(externalSearchQuery.toLowerCase())) return false;
    return true;
  });

  const handleMessage = (neighbour: typeof MOCK_NEIGHBOURS[0]) => {
    const conv = {
      id: Date.now(),
      type: 'direct',
      name: neighbour.name,
      avatar: neighbour.avatar,
      avatarColor: neighbour.color,
      lastMessage: 'Say hello to your new neighbour!',
      time: 'Just now',
      unread: 0,
      tag: null,
    };
    onOpenDirectChat?.(conv);
  };

  const matchedNeighbours = filtered.filter(n => n.interests.some(i => userInterests.includes(i)));
  const otherNeighbours = filtered.filter(n => !n.interests.some(i => userInterests.includes(i)));
  const sortedFiltered = [...matchedNeighbours, ...otherNeighbours];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif", position: 'relative' }}>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px', background: BG }}>
        <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 500, marginBottom: '12px' }}>
          {filtered.length} neighbour{filtered.length !== 1 ? 's' : ''} in your estate with shared interests
        </div>

        {/* Matched by interest section header */}
        {matchedNeighbours.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '12px',
            padding: '10px 14px',
            background: '#FFF0EC',
            borderRadius: '14px',
            border: `1px solid rgba(255,107,71,0.2)`,
          }}>
            <span style={{ fontSize: '16px' }}>✨</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: PRIMARY }}>Matched to your interests</div>
              <div style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, marginTop: '1px' }}>
                {matchedNeighbours.length} neighbour{matchedNeighbours.length !== 1 ? 's' : ''} share your interests
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedFiltered.slice(0, visibleCount).map((n, idx) => {
            const sharedInterests = n.interests.filter(i => userInterests.includes(i));
            const isMatched = sharedInterests.length > 0;

            // Show "Other Neighbours" divider when transitioning from matched to unmatched
            const prevN = idx > 0 ? sortedFiltered[idx - 1] : null;
            const prevIsMatched = prevN ? prevN.interests.some(i => userInterests.includes(i)) : false;
            const showDivider = matchedNeighbours.length > 0 && otherNeighbours.length > 0 && !isMatched && prevIsMatched;

            return (
              <div key={n.id}>
                {showDivider && (
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px', marginTop: '4px', paddingLeft: '2px' }}>
                    Other Neighbours
                  </div>
                )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: CARD, borderRadius: '18px', padding: '14px 14px 12px',
                  boxShadow: isMatched ? '0 2px 16px rgba(255,107,71,0.10)' : '0 1px 6px rgba(0,0,0,0.06)',
                  border: isMatched ? `1.5px solid rgba(255,107,71,0.18)` : '1.5px solid transparent',
                }}
              >
                {/* Two-column layout: avatar left, everything else right */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>

                  {/* LEFT column — avatar only */}
                  <div
                    onClick={e => { e.stopPropagation(); onOpenNeighbourProfile?.({ name: n.name, avatar: n.avatar, color: n.color, block: n.unit.split(' #')[0], distance: n.distance, interests: n.interests, languages: (n as any).languages }); }}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
                  >
                    {n.avatarUrl
                      ? <img src={n.avatarUrl} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{n.avatar}</span>
                    }
                  </div>

                  {/* RIGHT column — all content */}
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Row 1: name left, address right */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT, flexShrink: 0 }}>{n.name}</span>
                      <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>{n.unit.split(' #')[0]} · {n.distance}</span>
                    </div>

                    {/* Row 2: shared interests label */}
                    {sharedInterests.length > 0 && (
                      <div style={{ fontSize: '11px', color: PRIMARY, fontWeight: 700, marginBottom: '7px' }}>
                        {sharedInterests.length} interest{sharedInterests.length !== 1 ? 's' : ''} in common
                      </div>
                    )}

                    {/* Row 3: interests as plain pipe-separated text */}
                    <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500, marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.interests.join(' | ')}
                    </div>

                    {/* Row 4: Say Hello — full width of right column */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMessage(n)}
                      style={{
                        marginLeft: 'auto', display: 'flex', padding: '6px 16px', borderRadius: '20px',
                        background: '#FFF0EC', border: `1.5px solid ${PRIMARY}`,
                        color: PRIMARY, fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        alignItems: 'center', justifyContent: 'center', gap: '5px',
                      }}
                    >
                      👋 Say Hello
                    </motion.button>

                  </div>{/* end right column */}
                </div>{/* end two-column row */}

              </motion.div>
              </div>
            );
          })}
        </div>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <button
            onClick={() => setVisibleCount(p => p + 5)}
            style={{ width: '100%', marginTop: '16px', padding: '14px', borderRadius: '18px', background: CARD, border: `1.5px solid ${BORDER}`, color: TEXT2, fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <Users size={44} color={MUTED} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No neighbours found</div>
            <div style={{ fontSize: '13px', color: TEXT2 }}>Try adjusting your filters</div>
          </div>
        )}

        <div style={{ height: '32px' }} />
      </div>

      {/* Neighbour filter bottom sheet */}
      <AnimatePresence>
        {showExternalFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
            onClick={onFilterClose}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 40px', maxHeight: '70vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Filter Neighbours</span>
                <button
                  onClick={onFilterClose}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} color={TEXT} />
                </button>
              </div>

              {/* Distance */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distance</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {(['Any', '< 0.5 km', '< 1 km'] as const).map(d => {
                  const sel = distanceFilter === d;
                  return (
                    <button
                      key={d}
                      onClick={() => onDistanceChange(d)}
                      style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: sel ? '#FFF0EC' : BG, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid transparent`, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {d === 'Any' ? 'Any Distance' : d}
                    </button>
                  );
                })}
              </div>

              {/* Toggles */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferences</div>
              {[
                { label: '🎯 Shared Interests', sub: 'Only show neighbours with matching interests', value: filterSharedOnly, onChange: onSharedOnlyChange },
                { label: '🟢 Recently Active', sub: 'Only show neighbours active within 5 hours', value: filterRecentOnly, onChange: onRecentOnlyChange },
              ].map(({ label, sub, value, onChange }) => (
                <div
                  key={label}
                  onClick={() => onChange(!value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: value ? '#FFF0EC' : BG, borderRadius: '16px', marginBottom: '10px', cursor: 'pointer', border: `1.5px solid ${value ? PRIMARY : 'transparent'}` }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: value ? PRIMARY : TEXT }}>{label}</div>
                    <div style={{ fontSize: '12px', color: TEXT2, marginTop: '2px' }}>{sub}</div>
                  </div>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: value ? PRIMARY : BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {value && <Check size={13} color="white" strokeWidth={3} />}
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => { onDistanceChange('Any'); onSharedOnlyChange(false); onRecentOnlyChange(false); }}
                  style={{ flex: 1, padding: '14px', borderRadius: '16px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}
                >
                  Clear
                </button>
                <button
                  onClick={onFilterClose}
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
