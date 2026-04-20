import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Bookmark, Share2, X, Shield, Bell,
  Calendar, MapPin, Users, Search, Check, Clock, Star, ExternalLink, MessageCircle, SlidersHorizontal, Link2, Copy, RefreshCw, ChevronDown, SquareArrowOutUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import { ConnectPage } from './ConnectPage';
import eventsImg from '../../imports/event1.png';
import { NeighbourProfile } from './NeighbourProfilePage';
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
  ageGroups: string[];
  interests: string[];
  distance: string;
}

interface NavFrame { screen: EventScreen; params?: any; }

// ---- Mock Data ----
const EVENTS: EventData[] = [
  {
    id: 1, title: 'Durian Party', date: 'Sat, 26 Apr 2026', time: '5:00 PM – 8:00 PM',
    location: 'Void Deck, Blk 445', address: 'Blk 445 Ang Mo Kio Ave 10, S560445',
    language: 'English / Mandarin / Malay', audience: 'All Ages',
    attendees: 18, signups: 40, going: 40, price: 'Free',
    organizer: 'Bishan-AMK RC', organizerRating: 4.8, organizerReviews: 124,
    organizerImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#D97706', categoryBg: '#FEF3C7', category: 'Food & Drinks',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: "Calling all durian lovers! Join your neighbours for a community durian feast at the void deck. Multiple varieties including Mao Shan Wang, D24, and Black Thorn will be served. Come hungry and bring the family — it's going to be a smelly good time! Limited seats, sign up early.",
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
    id: 3, title: '1 Day Trip to Johor Bahru', date: 'Sat, 3 May 2026', time: '7:00 AM – 9:00 PM',
    location: 'Bus Pickup, Blk 445 Void Deck', address: 'Blk 445 Ang Mo Kio Ave 10, S560445',
    language: 'English / Mandarin / Malay', audience: 'All Ages',
    attendees: 22, signups: 35, going: 35, price: '$15',
    organizer: 'Bishan-AMK RC', organizerRating: 4.8, organizerReviews: 124,
    organizerImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#2563EB', categoryBg: '#DBEAFE', category: 'Outing',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: "Join your neighbours on a fun day trip across the Causeway to Johor Bahru! Includes a chartered bus, guided shopping stops at City Square Mall and Angsana, and a group dinner at a local seafood restaurant. Great opportunity to bond with neighbours and enjoy affordable food and shopping. Payment collected at signup.",
  },
  {
    id: 4, title: 'Hari Raya Dinner with Community and MP', date: 'Fri, 25 Apr 2026', time: '6:30 PM – 9:30 PM',
    location: 'Bishan-AMK Community Club', address: '1384 Ang Mo Kio Ave 1, S569931',
    language: 'English / Malay', audience: 'All Ages',
    attendees: 35, signups: 80, going: 80, price: 'Free',
    organizer: 'Bishan-AMK RC', organizerRating: 4.9, organizerReviews: 201,
    organizerImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    categoryColor: '#059669', categoryBg: '#D1FAE5', category: 'Community',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: "Celebrate Hari Raya Aidilfitri with your neighbours and our Member of Parliament! Enjoy a festive dinner featuring traditional Malay cuisine, cultural performances, and a warm open-house atmosphere. All residents of Bishan-AMK estate are warmly welcome regardless of race or religion. Dress smart casual.",
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
const EVENT_DISTANCES = ['Any Distance', '< 0.5 km', '< 1 km'];
// Interest → event category mapping
const INTEREST_TO_EVENT_CATS: Record<string, string[]> = {
  'Fitness & Sports': ['Wellness'],
  'Yoga & Mindfulness': ['Wellness'],
  'Outdoor Activities': ['Outing', 'Wellness'],
  'Cooking & Baking': ['Cooking', 'Food & Drinks'],
  'Community Volunteering': ['Community'],
  'Cultural Heritage & Festivals': ['Community', 'Food & Drinks'],
};
const CATEGORIES = ['All', '🏃 Fitness', '🍳 Cooking', '🌱 Gardening', '🎲 Board Games', '💆 Wellness'];

const FAMILY_STATUS_BREAKDOWN = [
  { label: 'Living alone',                  count: 8,  color: '#FF6B47' },
  { label: 'Couple (no children)',          count: 5,  color: '#7C3AED' },
  { label: 'Family with children',         count: 6,  color: '#D97706' },
  { label: 'Living with parents',          count: 3,  color: '#0891B2' },
  { label: 'Shared housing',               count: 2,  color: '#059669' },
  { label: 'Multigenerational household',  count: 7,  color: '#DB2777' },
];

const LANGUAGE_BREAKDOWN = [
  { label: 'English',     count: 14, color: '#2563EB' },
  { label: 'Mandarin',   count: 8,  color: '#D97706' },
  { label: 'Malay',      count: 4,  color: '#059669' },
  { label: 'Tamil',      count: 2,  color: '#DB2777' },
  { label: 'Others', count: 3, color: '#7C3AED' },
];

const OTHERS_BREAKDOWN = [
  { label: 'Japanese',  count: 1, color: '#0891B2' },
  { label: 'Hindi',     count: 1, color: '#EA580C' },
  { label: 'Tagalog',   count: 1, color: '#7C3AED' },
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
  { id: 2, name: 'Ben Tan',     distance: '0.2 km', unit: 'Blk 447 #08-12', interests: ['Gaming', 'Technology & Digital Skills'],              avatar: 'BT', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#7C3AED', lastActive: '5 hours ago',  languages: ['English', 'Chinese'] },
  { id: 3, name: 'Clara Soh',   distance: '0.3 km', unit: 'Blk 448 #03-22', interests: ['Cooking & Baking', 'Gardening & Plants'],             avatar: 'CS', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#D97706', lastActive: '1 day ago',    languages: ['English', 'Malay'] },
  { id: 4, name: 'Diana Mak',   distance: '0.4 km', unit: 'Blk 445 #15-01', interests: ['Gardening & Plants', 'Yoga & Mindfulness'],           avatar: 'DM', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#059669', lastActive: '3 hours ago',  languages: ['English', 'Chinese'] },
  { id: 5, name: 'Eli Ng',      distance: '0.5 km', unit: 'Blk 449 #07-05', interests: ['Community Volunteering', 'Arts & Crafts'],            avatar: 'EN', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#0891B2', lastActive: 'Just now',     languages: ['English'] },
  { id: 6, name: 'Fiona Raj',   distance: '0.6 km', unit: 'Blk 446 #11-18', interests: ['Music & Performing Arts', 'Dance'],                   avatar: 'FR', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#DB2777', lastActive: '30 min ago',   languages: ['English', 'Tamil'] },
  { id: 7, name: 'Gary Koh',    distance: '0.8 km', unit: 'Blk 450 #04-09', interests: ['DIY & Home Improvement', 'Technology & Digital Skills'], avatar: 'GK', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#EA580C', lastActive: '2 days ago', languages: ['English', 'Chinese'] },
  { id: 8, name: 'Hannah Lee',  distance: '1.0 km', unit: 'Blk 445 #09-33', interests: ['Photography', 'Outdoor Activities'],                  avatar: 'HL', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#475569', lastActive: '4 hours ago',  languages: ['English', 'Chinese'] },
  { id: 9, name: 'Ivan Wong',   distance: '1.2 km', unit: 'Blk 451 #02-15', interests: ['Language Learning', 'Cultural Heritage & Festivals'], avatar: 'IW', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', color: '#0D9488', lastActive: '1 hour ago',   languages: ['English', 'Malay', 'Japanese'] },
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
  registeredEventIds?: number[];
  onToggleRegister?: (id: number) => void;
  onSubTabChange?: (tab: 'events' | 'groups' | 'neighbours') => void;
  userInterests?: string[];
  onAddConversation?: (conv: any) => void;
  onOpenDirectChat?: (conv: any) => void;
  onJoinGroup?: (conv: any) => void;
  onNavVisibilityChange?: (visible: boolean) => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
}

export function ExplorePage({ initialEventId, initialSubTab = 'events', onSubTabChange, userInterests = [], onAddConversation, onOpenDirectChat, onJoinGroup, onNavVisibilityChange, onOpenNeighbourProfile, registeredEventIds = [], onToggleRegister }: ExplorePageProps) {
  const initialScreen: NavFrame = initialEventId
    ? { screen: 'detail', params: { event: EVENTS.find(e => e.id === initialEventId) || EVENTS[0] } }
    : { screen: 'feed' };

  const [navStack, setNavStack] = useState<NavFrame[]>([initialScreen]);
  const [filters, setFilters] = useState<Filters>({ ageGroups: [], interests: [], distance: 'Any' });
  const [tempFilters, setTempFilters] = useState<Filters>({ ageGroups: [], interests: [], distance: 'Any' });
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const registeredEvents = registeredEventIds;
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
  const [expandedEventInterestCats, setExpandedEventInterestCats] = useState<Set<string>>(new Set());
  const [filterNeighbourInterests, setFilterNeighbourInterests] = useState<string[]>([]);
  const [filterGroupInterests, setFilterGroupInterests] = useState<string[]>([]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [detailScrollY, setDetailScrollY] = useState(0);
  const [showOthersSheet, setShowOthersSheet] = useState(false);

  const handleSubTabChange = (tab: 'events' | 'groups' | 'neighbours') => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches(prev => [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 6));
    setSearchQuery(trimmed);
    handleSubTabChange(searchScopeTab);
    setSearchMode(false);
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

  const activeFilterCount = filters.ageGroups.length + filters.interests.length + (filters.distance !== 'Any' ? 1 : 0);

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

  const filteredEvents = EVENTS.filter(ev => {
    if (filters.interests.length > 0) {
      const matchedCats = new Set(filters.interests.flatMap(i => INTEREST_TO_EVENT_CATS[i] || []));
      if (matchedCats.size === 0 || !matchedCats.has(ev.category)) return false;
    }
    if (filters.ageGroups.length > 0 && !matchesAgeGroup(ev)) return false;
    if (activeCategory !== 'All' && !activeCategory.includes(ev.category)) return false;
    if (searchQuery && !ev.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSave = (id: number) => setSavedEvents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleRegister = (id: number) => onToggleRegister?.(id);

  // ---- Feed screen (unified for all 3 sub-tabs) ----
  if (current.screen === 'feed' || current.screen === 'filtered') {
    const groupFilterActive = activeGroupCategory !== 'All' || filterGroupInterests.length > 0;
    const neighbourFilterActive = distanceFilter !== 'Any' || filterSharedOnly || filterRecentOnly || filterNeighbourInterests.length > 0;
    const filterLabel = activeSubTab === 'events' ? 'Events' : activeSubTab === 'groups' ? 'Groups' : 'Neighbours';
    const isFilterActive = activeSubTab === 'events' ? activeFilterCount > 0 : activeSubTab === 'groups' ? groupFilterActive : neighbourFilterActive;

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif", position: 'relative' }}>

        {/* ── Shared Header ── */}
        {!(activeSubTab === 'groups' && groupInDetail) && <div style={{ background: searchMode ? 'transparent' : CARD, borderBottom: searchMode ? 'none' : `1px solid ${BORDER}`, flexShrink: 0, position: 'relative', zIndex: searchMode ? 202 : undefined }}>
          <>
              {/* Header: buttons fixed top-right; title starts below and moves up on scroll */}
              <div style={{ position: 'relative', height: searchMode ? '88px' : `${132 - scrollProgress * 40}px`, transition: 'height 0.1s linear' }}>
                {searchMode ? (
                  <button onClick={() => { setSearchMode(false); setSearchQuery(''); }}
                    style={{ position: 'absolute', top: '44px', left: '16px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={22} color="white" />
                  </button>
                ) : (
                  <>
                    {/* Buttons: absolutely pinned, no animation */}
                    <div style={{ position: 'absolute', top: '44px', right: '16px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setSearchScopeTab(activeSubTab); setSearchMode(true); }}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={18} color={TEXT2} />
                      </button>
                      <button onClick={() => { if (activeSubTab === 'events') { setTempFilters(filters); setShowFilter(true); } else if (activeSubTab === 'groups') setShowGroupFilter(true); else setShowNeighbourFilter(true); }}
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
                    {/* Title: starts below buttons, shrinks + moves up to align with buttons on scroll */}
                    <span style={{
                      position: 'absolute',
                      left: '16px',
                      top: `${90 - scrollProgress * 46}px`,
                      fontSize: `${28 - scrollProgress * 8}px`,
                      fontWeight: 800,
                      color: TEXT,
                      letterSpacing: '-0.5px',
                      lineHeight: '40px',
                      transition: 'top 0.1s linear, font-size 0.1s linear',
                    }}>Explore</span>
                  </>
                )}
              </div>
              {/* Sub-tabs — always visible; in search mode they scope the search */}
              <div style={{ display: 'flex' }}>
                {(['events', 'groups', 'neighbours'] as const).map(tab => {
                  const isActive = searchMode ? searchScopeTab === tab : activeSubTab === tab;
                  return (
                    <button key={tab}
                      data-tour={`${tab}-subtab`}
                      onClick={() => {
                        if (searchMode) { setSearchScopeTab(tab); handleSubTabChange(tab); }
                        else handleSubTabChange(tab);
                      }}
                      style={{ flex: 1, padding: '8px 0 10px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {tab === 'events' && <Calendar size={16} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? (searchMode ? 'white' : TEXT) : (searchMode ? 'rgba(255,255,255,0.45)' : MUTED)} />}
                        {tab === 'groups' && <Users size={16} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? (searchMode ? 'white' : TEXT) : (searchMode ? 'rgba(255,255,255,0.45)' : MUTED)} />}
                        {tab === 'neighbours' && <MapPin size={16} strokeWidth={isActive ? 2.2 : 1.8} color={isActive ? (searchMode ? 'white' : TEXT) : (searchMode ? 'rgba(255,255,255,0.45)' : MUTED)} />}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? (searchMode ? 'white' : TEXT) : (searchMode ? 'rgba(255,255,255,0.45)' : MUTED), lineHeight: 1 }}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </span>
                      {isActive && <div style={{ position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '2px', background: searchMode ? 'white' : TEXT, borderRadius: '2px' }} />}
                    </button>
                  );
                })}
              </div>
            </>
        </div>}

        {/* ── Tab content ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>

          {/* Events */}
          {activeSubTab === 'events' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px', background: '#F7F7F7' }} onScroll={handleScroll}>
              {/* Welcome banner */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0px', marginBottom: '-4px', marginLeft: '-10px' }}>
                <img src={eventsImg} alt="Events" style={{ width: '56px', height: '56px', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>Welcome to Events</div>
                  <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 400, lineHeight: '1.5' }}>
                    Events happening in your neighbourhood.
                  </div>
                </div>
              </div>
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

                    const todayMs = todayDate.getTime();
                    const sortKey = (dateStr: string) => {
                      const ms = getDateMs(dateStr);
                      if (ms === todayMs) return 0;          // Today first
                      if (ms > todayMs) return 1 + ms;       // Future in order
                      return 2_000_000_000_000 + ms;         // Past dates last
                    };
                    const sorted = [...filteredEvents].sort((a, b) => sortKey(a.date) - sortKey(b.date));

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
                              borderRadius: '14px',
                              overflow: 'hidden',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                              cursor: 'pointer',
                              marginBottom: idx < groups[label].length - 1 ? '12px' : '0',
                            }}
                          >
                            {/* Top image */}
                            <div style={{ height: '140px', position: 'relative' }}>
                              <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '8px', background: ev.categoryBg, color: ev.categoryColor, fontSize: '11px', fontWeight: 700 }}>
                                {ev.category}
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); toggleSave(ev.id); }}
                                style={{ position: 'absolute', top: '8px', right: '8px', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Bookmark size={13} color={savedEvents.includes(ev.id) ? PRIMARY : MUTED} fill={savedEvents.includes(ev.id) ? PRIMARY : 'none'} />
                              </button>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <img src={ev.organizerImage} alt={ev.organizer} style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                <span style={{ fontSize: '11px', color: MUTED, fontWeight: 600 }}>{ev.organizer}</span>
                              </div>
                              <div style={{ fontSize: '17px', fontWeight: 700, color: TEXT, marginBottom: '8px', lineHeight: '1.3' }}>{ev.title}</div>
                              <div style={{ display: 'flex', gap: '14px', marginBottom: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Clock size={13} color={MUTED} />
                                  <span style={{ fontSize: '13px', color: MUTED }}>{ev.time}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} color={MUTED} />
                                <span style={{ fontSize: '13px', color: MUTED }}>{ev.location.split(',')[0]}</span>
                              </div>
                            </div>
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
                onJoinGroup={onJoinGroup}
                filterGroupInterests={filterGroupInterests}
                onGroupInterestChange={setFilterGroupInterests}
                onScroll={handleScroll}
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
              filterInterests={filterNeighbourInterests}
              onInterestChange={setFilterNeighbourInterests}
              onScroll={handleScroll}
            />
          )}
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchMode && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => { setSearchMode(false); setSearchQuery(''); }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(10,10,20,0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  zIndex: 200,
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute', top: '144px', left: '12px', right: '12px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  zIndex: 201,
                  padding: '16px 16px 20px',
                }}
              >
                {/* Search bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(120,120,128,0.10)', borderRadius: '14px', padding: '12px 14px', marginBottom: recentSearches.length > 0 ? '20px' : 0 }}>
                  <Search size={16} color={MUTED} />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') submitSearch(searchQuery); }}
                    placeholder={`Search ${searchScopeTab}...`}
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '16px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <X size={15} color={MUTED} />
                    </button>
                  )}
                </div>
                {recentSearches.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Recent Searches
                    </div>
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => submitSearch(s)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 4px', background: 'none', border: 'none', borderBottom: i < recentSearches.length - 1 ? `0.5px solid rgba(60,60,67,0.12)` : 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <span style={{ fontSize: '15px', color: TEXT, fontWeight: 500 }}>{s}</span>
                        <SquareArrowOutUpRight size={15} color={MUTED} />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
                {/* Age Group */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age Group</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {AGE_GROUPS.map(opt => {
                      const sel = tempFilters.ageGroups.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setTempFilters(p => ({ ...p, ageGroups: sel ? p.ageGroups.filter(x => x !== opt) : [...p.ageGroups, opt] }))}
                          style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: sel ? '#FFF0EC' : BG, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid transparent`, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Distance */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distance</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {EVENT_DISTANCES.map(opt => {
                      const sel = tempFilters.distance === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setTempFilters(p => ({ ...p, distance: opt }))}
                          style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: sel ? '#FFF0EC' : BG, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid transparent`, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interest — collapsible categories */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interest</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {INTEREST_CATEGORIES.map(cat => {
                      const isOpen = expandedEventInterestCats.has(cat.label);
                      const selectedInCat = cat.items.filter(t => tempFilters.interests.includes(t)).length;
                      return (
                        <div key={cat.label} style={{ background: BG, borderRadius: '14px', overflow: 'hidden' }}>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setExpandedEventInterestCats(prev => {
                              const next = new Set(prev);
                              isOpen ? next.delete(cat.label) : next.add(cat.label);
                              return next;
                            })}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{cat.label}</span>
                              {selectedInCat > 0 && (
                                <div style={{ minWidth: '18px', height: '18px', borderRadius: '9px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'white' }}>{selectedInCat}</span>
                                </div>
                              )}
                            </div>
                            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown size={15} color={MUTED} />
                            </motion.div>
                          </motion.button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 14px 14px' }}>
                                  {cat.items.map(t => {
                                    const sel = tempFilters.interests.includes(t);
                                    return (
                                      <button
                                        key={t}
                                        onClick={() => setTempFilters(p => ({ ...p, interests: sel ? p.interests.filter(x => x !== t) : [...p.interests, t] }))}
                                        style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sel ? '#FFF0EC' : CARD, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
                                      >
                                        {t}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => { setTempFilters({ ageGroups: [], interests: [], distance: 'Any' }); setExpandedEventInterestCats(new Set()); }}
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

    const heroOpacity = Math.max(0, 1 - detailScrollY / 180);
    const headerOpacity = Math.min(1, detailScrollY / 120);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif", position: 'relative' }}>
        {/* Fixed overlay: header bg + buttons — never scroll */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, pointerEvents: 'none' }}>
          {/* Header background fades in on scroll */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: CARD, opacity: headerOpacity, boxShadow: headerOpacity > 0 ? '0 1px 0 rgba(60,60,67,0.1)' : 'none' }} />
          {/* Buttons row — always in place */}
          <div style={{ position: 'relative', padding: '52px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <button onClick={goBack} style={{ pointerEvents: 'auto', width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
              <button onClick={() => goTo('share', { event: ev })} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Share2 size={17} color={TEXT} />
              </button>
              <button onClick={() => toggleSave(ev.id)} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Bookmark size={17} color={isSaved ? PRIMARY : TEXT} fill={isSaved ? PRIMARY : 'none'} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }} onScroll={e => setDetailScrollY((e.target as HTMLElement).scrollTop)}>
          {/* Hero image — fades on scroll */}
          <div style={{ height: '260px', position: 'relative', opacity: heroOpacity }}>
            <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%)' }} />
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

            {/* Hosting & Going */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
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
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>{ev.price}</div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => isRegistered ? toggleRegister(ev.id) : goTo('register', { event: ev })}
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
                const isOthers = item.label === 'Others';
                return (
                  <div
                    key={item.label}
                    onClick={isOthers ? () => setShowOthersSheet(true) : undefined}
                    style={{ cursor: isOthers ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.label}</span>
                        {isOthers && <ChevronRight size={13} color={TEXT2} strokeWidth={2.5} />}
                      </div>
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

          {/* Others language bottom sheet */}
          <AnimatePresence>
            {showOthersSheet && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowOthersSheet(false)}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }}
                />
                <motion.div
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: CARD, borderRadius: '24px 24px 0 0', padding: '20px 20px 40px', zIndex: 301 }}
                >
                  <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>Other Languages</div>
                  <div style={{ fontSize: '13px', color: TEXT2, marginBottom: '20px' }}>3 neighbours speak other languages in your estate</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {OTHERS_BREAKDOWN.map((item, i) => (
                      <div key={item.label}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{item.count}</span>
                            <span style={{ fontSize: '11px', color: MUTED }}>({Math.round((item.count / 3) * 100)}%)</span>
                          </div>
                        </div>
                        <div style={{ height: '10px', borderRadius: '6px', background: BG, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${(item.count / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                            style={{ height: '100%', borderRadius: '6px', background: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
        {/* Header */}
        <div style={{ background: CARD, padding: '44px 20px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={goBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Confirm Attendance</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {/* Event summary card */}
          <div style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            {ev?.image && (
              <div style={{ height: '140px', position: 'relative' }}>
                <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45))' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', padding: '3px 10px', borderRadius: '8px', background: ev.categoryBg, color: ev.categoryColor, fontSize: '11px', fontWeight: 800 }}>
                  {ev.category}
                </div>
              </div>
            )}
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TEXT, marginBottom: '10px', lineHeight: '1.3' }}>{ev?.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color={MUTED} />
                  <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>{ev?.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color={MUTED} />
                  <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>{ev?.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color={MUTED} />
                  <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>{ev?.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reminder section */}
          <div style={{ background: CARD, borderRadius: '22px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={16} color={PRIMARY} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: TEXT }}>Remind me before the event</div>
                <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500, marginTop: '2px' }}>Get a notification so you don't miss it</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['1 day before', '3 hours before', '30 minutes before', 'No reminder'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setReminderOption(opt)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '13px 16px', borderRadius: '14px',
                    background: reminderOption === opt ? '#FFF0EC' : BG,
                    border: `2px solid ${reminderOption === opt ? PRIMARY : 'transparent'}`,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: reminderOption === opt ? PRIMARY : TEXT }}>{opt}</span>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: reminderOption === opt ? PRIMARY : 'transparent',
                    border: `2px solid ${reminderOption === opt ? PRIMARY : BORDER}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {reminderOption === opt && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* External sign-up info */}
          <div style={{ background: CARD, borderRadius: '16px', padding: '14px 16px', display: 'flex', gap: '10px' }}>
            <ExternalLink size={16} color={MUTED} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: TEXT2, lineHeight: '1.6' }}>
              This event requires registration on the organiser's website. Tap below to complete your sign-up.
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ padding: '12px 20px 28px', background: CARD, borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!reminderOption && (
            <div style={{ fontSize: '12px', color: PRIMARY, fontWeight: 600, textAlign: 'center' }}>
              Please select a reminder option above to continue
            </div>
          )}
          <motion.button
            whileTap={reminderOption ? { scale: 0.97 } : {}}
            onClick={() => {
              if (!reminderOption) return;
              const reminderMsg = reminderOption !== 'No reminder' ? ` Reminder set for ${reminderOption.toLowerCase()}.` : '';
              toast.success(`Opening sign-up page…${reminderMsg}`);
              toggleRegister(ev.id);
              goBack();
            }}
            style={{
              width: '100%', padding: '16px', borderRadius: '18px',
              background: reminderOption ? PRIMARY : '#E5E5EA',
              border: 'none', cursor: reminderOption ? 'pointer' : 'not-allowed',
              fontSize: '15px', fontWeight: 800,
              color: reminderOption ? 'white' : '#AEAEB2', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            <ExternalLink size={16} color={reminderOption ? 'white' : '#AEAEB2'} />
            Sign up on organiser's website
          </motion.button>
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
  filterInterests, onInterestChange,
  onScroll,
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
  filterInterests: string[];
  onInterestChange: (v: string[]) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [expandedInterestCats, setExpandedInterestCats] = useState<Set<string>>(new Set());

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
    if (filterInterests.length > 0) {
      if (!n.interests.some(i => filterInterests.includes(i))) return false;
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px', background: BG }} onScroll={onScroll}>
        <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 500, marginBottom: '12px' }}>
          {filtered.length} neighbour{filtered.length !== 1 ? 's' : ''} in your estate
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
                onClick={() => onOpenNeighbourProfile?.({ name: n.name, avatar: n.avatar, avatarUrl: n.avatarUrl, color: n.color, block: n.unit.split(' #')[0], distance: n.distance, interests: n.interests, languages: n.languages })}
                style={{
                  background: CARD, borderRadius: '18px', padding: '14px 14px 12px',
                  boxShadow: isMatched ? '0 2px 16px rgba(255,107,71,0.10)' : '0 1px 6px rgba(0,0,0,0.06)',
                  border: isMatched ? `1.5px solid rgba(255,107,71,0.18)` : '1.5px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {/* Two-column layout: avatar left, everything else right */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>

                  {/* LEFT column — avatar only */}
                  <div
                    style={{ width: '46px', height: '46px', borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}
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
                      <span style={{ fontSize: '15px', fontWeight: 600, color: TEXT, flexShrink: 0 }}>{n.name}</span>
                      <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>{n.unit.split(' #')[0]} · {n.distance}</span>
                    </div>

                    {/* Row 2: shared interests label */}
                    {sharedInterests.length > 0 && (
                      <div style={{ fontSize: '11px', color: PRIMARY, fontWeight: 700, marginBottom: '7px' }}>
                        {sharedInterests.length} interest{sharedInterests.length !== 1 ? 's' : ''} in common
                      </div>
                    )}

                    {/* Row 3: interests as plain pipe-separated text */}
                    <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500, marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.interests.join(' | ')}
                    </div>

                    {/* Row 4: Say Hello — full width of right column */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={e => { e.stopPropagation(); handleMessage(n); }}
                      style={{
                        display: 'flex', padding: '6px 16px', borderRadius: '20px',
                        background: '#FFF0EC', border: `1.5px solid ${PRIMARY}`,
                        color: PRIMARY, fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        alignItems: 'center', justifyContent: 'center', gap: '5px',
                      }}
                    >
                      <style>{`
                        @keyframes chatIconBounce {
                          0%, 100% { transform: translateY(0) scale(1) rotate(-4deg); }
                          30%       { transform: translateY(-3px) scale(1.18) rotate(4deg); }
                          60%       { transform: translateY(1px) scale(0.92) rotate(-2deg); }
                        }
                      `}</style>
                      <span style={{
                        display: 'inline-flex',
                        animation: 'chatIconBounce 2s ease-in-out infinite',
                        filter: 'drop-shadow(0px 3px 5px rgba(255,107,71,0.55)) drop-shadow(0px 1px 2px rgba(255,160,120,0.4))',
                        transformOrigin: 'center bottom',
                      }}>
                        <MessageCircle
                          size={14}
                          color="#FF4B1F"
                          strokeWidth={2.2}
                          fill="rgba(255,107,71,0.22)"
                        />
                      </span>
                       Chat
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
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setVisibleCount(p => p + 5)}
            style={{
              width: '100%', marginTop: '16px', padding: '18px 14px',
              borderRadius: '18px', background: 'transparent',
              border: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={16} color={TEXT2} strokeWidth={2} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: TEXT2 }}>Load more</span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: MUTED }}>{filtered.length - visibleCount} more neighbours</span>
          </motion.button>
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
                { label: 'Shared Interests', sub: 'Only show neighbours with matching interests', value: filterSharedOnly, onChange: onSharedOnlyChange },
                { label: 'Recently Active', sub: 'Only show neighbours active within 5 hours', value: filterRecentOnly, onChange: onRecentOnlyChange },
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

              {/* Interests */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interests</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                {INTEREST_CATEGORIES.map(cat => {
                  const isOpen = expandedInterestCats.has(cat.label);
                  const selectedInCat = cat.items.filter(t => filterInterests.includes(t)).length;
                  return (
                    <div key={cat.label} style={{ background: BG, borderRadius: '14px', overflow: 'hidden' }}>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExpandedInterestCats(prev => {
                          const next = new Set(prev);
                          isOpen ? next.delete(cat.label) : next.add(cat.label);
                          return next;
                        })}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Nunito', sans-serif" }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{cat.label}</span>
                          {selectedInCat > 0 && (
                            <div style={{ minWidth: '18px', height: '18px', borderRadius: '9px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 800, color: 'white' }}>{selectedInCat}</span>
                            </div>
                          )}
                        </div>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={15} color={MUTED} />
                        </motion.div>
                      </motion.button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 14px 14px' }}>
                              {cat.items.map(t => {
                                const sel = filterInterests.includes(t);
                                return (
                                  <button
                                    key={t}
                                    onClick={() => onInterestChange(sel ? filterInterests.filter(x => x !== t) : [...filterInterests, t])}
                                    style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sel ? '#FFF0EC' : CARD, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => { onDistanceChange('Any'); onSharedOnlyChange(false); onRecentOnlyChange(false); onInterestChange([]); setExpandedInterestCats(new Set()); }}
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
