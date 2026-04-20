import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronDown, Send, Shield, Users, UserPlus, Search, X, MessageCircle, MapPin, ClipboardList, Target, Plus, SquareArrowOutUpRight, ArrowRight, History, Camera, Filter, Check } from 'lucide-react';
import { NeighbourProfile } from './NeighbourProfilePage';

// ---- Design tokens ----
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

// ---- Create Group data ----
const GROUP_NEIGHBOURS = [
  { id: 1, name: 'Alex Lim',   interests: ['Fitness & Sports', 'Cooking & Baking'],              avatar: 'AL', color: '#FF6B47', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 445 #12-34' },
  { id: 2, name: 'Ben Tan',    interests: ['Gaming', 'Technology & Digital Skills'],              avatar: 'BT', color: '#7C3AED', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 447 #08-12' },
  { id: 3, name: 'Clara Soh',  interests: ['Cooking & Baking', 'Gardening & Plants'],             avatar: 'CS', color: '#D97706', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 448 #03-22' },
  { id: 4, name: 'Diana Mak',  interests: ['Gardening & Plants', 'Yoga & Mindfulness'],           avatar: 'DM', color: '#059669', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 445 #15-01' },
  { id: 5, name: 'Eli Ng',     interests: ['Community Volunteering', 'Arts & Crafts'],            avatar: 'EN', color: '#0891B2', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 449 #07-05' },
  { id: 6, name: 'Fiona Raj',  interests: ['Music & Performing Arts', 'Dance'],                   avatar: 'FR', color: '#DB2777', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 446 #11-18' },
  { id: 7, name: 'Gary Koh',   interests: ['DIY & Home Improvement', 'Technology & Digital Skills'], avatar: 'GK', color: '#EA580C', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 450 #04-09' },
  { id: 8, name: 'Hannah Lee', interests: ['Photography', 'Outdoor Activities'],                  avatar: 'HL', color: '#475569', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', unit: 'Blk 445 #09-33' },
];

const GROUP_INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  'Community Volunteering': { bg: '#FEE2E2', text: '#DC2626' },
  'Cultural Heritage & Festivals': { bg: '#FEF3C7', text: '#B45309' },
  'Fitness & Sports': { bg: '#DCFCE7', text: '#16A34A' },
  'Yoga & Mindfulness': { bg: '#F3E8FF', text: '#9333EA' },
  'Outdoor Activities': { bg: '#CCFBF1', text: '#0D9488' },
  'Arts & Crafts': { bg: '#FCE7F3', text: '#DB2777' },
  'Music & Performing Arts': { bg: '#FFE4E6', text: '#E11D48' },
  'Dance': { bg: '#EDE9FE', text: '#7C3AED' },
  'Cooking & Baking': { bg: '#FEF3C7', text: '#D97706' },
  'Technology & Digital Skills': { bg: '#DBEAFE', text: '#2563EB' },
  'DIY & Home Improvement': { bg: '#F1F5F9', text: '#475569' },
  'Language Learning': { bg: '#CFFAFE', text: '#0891B2' },
  'Pets & Animals': { bg: '#FEF9C3', text: '#CA8A04' },
  'Gardening & Plants': { bg: '#D1FAE5', text: '#059669' },
  'Gaming': { bg: '#E0E7FF', text: '#4F46E5' },
  'Fashion & Beauty': { bg: '#FCE7F3', text: '#BE185D' },
  'Photography': { bg: '#FAE8FF', text: '#A21CAF' },
};

const ALL_GROUP_INTERESTS = Object.keys(GROUP_INTEREST_COLORS);

const GROUP_INTEREST_CATEGORIES = [
  { label: 'Social & Community',  items: ['Community Volunteering', 'Cultural Heritage & Festivals'] },
  { label: 'Fitness & Wellness',  items: ['Fitness & Sports', 'Yoga & Mindfulness', 'Outdoor Activities'] },
  { label: 'Arts & Creativity',   items: ['Arts & Crafts', 'Music & Performing Arts', 'Dance'] },
  { label: 'Learning & Skills',   items: ['Cooking & Baking', 'Technology & Digital Skills', 'DIY & Home Improvement', 'Language Learning'] },
  { label: 'Lifestyle & Hobbies', items: ['Pets & Animals', 'Gardening & Plants', 'Gaming', 'Fashion & Beauty', 'Photography'] },
];

// ---- Mock conversation list ----
type ConvType = 'group' | 'marketplace' | 'request' | 'direct';

interface Conversation {
  id: number;
  type: ConvType;
  name: string;
  avatar: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unread: number;
  tag: string | null;
  subtitle?: string;       // seller/provider name for marketplace chats
  memberCount?: number;    // for dynamically joined groups
  meetFrequency?: string;  // for dynamically joined groups
  location?: string;       // for dynamically joined groups
  imageUrl?: string;       // group cover photo / poster profile photo
  interests?: string[];    // for neighbour profile About section
  languages?: string[];    // for neighbour profile About section
  block?: string;          // e.g. "Blk 445"
  distance?: string;       // e.g. "0.3 km away"
  listingImage?: string;   // thumbnail of the listing/request
  price?: string;          // e.g. "Free", "$25", "Free Request"
  listingId?: number;      // id of the linked marketplace item or request
  rating?: number;
  reviews?: number;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    type: 'group',
    name: 'Morning Runners',
    avatar: 'MR',
    avatarBg: '#FF6B47',
    lastMessage: "Who's joining this Saturday at 7 AM?",
    time: '9:20 AM',
    unread: 2,
    tag: 'Running',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    type: 'group',
    name: 'Backyard Gardeners',
    avatar: 'BG',
    avatarBg: '#059669',
    lastMessage: 'Community garden session this weekend!',
    time: 'Yesterday',
    unread: 0,
    tag: 'Gardening',
    imageUrl: 'https://images.unsplash.com/photo-1621460248083-6271cc4437a8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    type: 'marketplace',
    name: 'IKEA Bookshelf',
    avatar: 'YU',
    avatarBg: '#FF6B47',
    subtitle: 'Yusra',
    lastMessage: 'Hi! Is the bookshelf still available?',
    time: '2:15 PM',
    unread: 1,
    tag: 'Item',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
    interests: ['Gardening & Plants', 'DIY & Home Improvement', 'Cooking & Baking'],
    languages: ['English', 'Malay'],
    block: 'Blk 445',
    distance: '0.3 km away',
    rating: 4.8,
    reviews: 12,
    listingImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 'Free',
    listingId: 101,
  },
  {
    id: 4,
    type: 'direct',
    name: 'Selene Teo',
    avatar: 'ST',
    avatarBg: '#8B5CF6',
    lastMessage: "Yes! Let's plan a run this Saturday 🏃",
    time: '10:33 AM',
    unread: 0,
    tag: null,
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=face',
    interests: ['Fitness & Sports', 'Running', 'Yoga & Mindfulness'],
    languages: ['English', 'Chinese'],
    block: 'Blk 447',
    distance: '0.5 km away',
    rating: 4.8,
    reviews: 12,
  },
  {
    id: 5,
    type: 'request',
    name: 'Plant Watering Request',
    avatar: 'ST',
    avatarBg: '#8B5CF6',
    subtitle: 'Sarah T.',
    lastMessage: 'No problem! Saturday works for me.',
    time: 'Mon',
    unread: 1,
    tag: 'Request',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    interests: ['Community Volunteering', 'Gardening & Plants', 'Outdoor Activities'],
    languages: ['English', 'Chinese'],
    block: 'Blk 445',
    distance: '0.3 km away',
    listingImage: 'https://images.unsplash.com/photo-1771810506686-f70bafda1a16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    price: 'Free Request',
    listingId: 1,
  },
];

// ---- Mock messages per conversation ----
const GROUP_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, from: 'them', sender: 'A', text: "Who's joining this Saturday at 7 AM?", time: '9:15 AM' },
    { id: 2, from: 'them', sender: 'B', text: "I'm in! Meeting at pavilion right? 🙋", time: '9:18 AM' },
    { id: 3, from: 'me', sender: 'me', text: 'Count me in too! See you all there 💪', time: '9:20 AM' },
  ],
  2: [
    { id: 1, from: 'them', sender: 'A', text: 'Community garden session this weekend! Sat 8 AM 🌱', time: 'Yesterday' },
    { id: 2, from: 'them', sender: 'B', text: "Sounds great! I'll bring some seedlings.", time: 'Yesterday' },
    { id: 3, from: 'me', sender: 'me', text: "I'll be there! What tools should I bring?", time: 'Yesterday' },
  ],
  3: [
    { id: 1, from: 'them', sender: 'E', text: "Anyone up for Ticket to Ride this Sunday? 🚂", time: '3:20 PM' },
    { id: 2, from: 'me', sender: 'me', text: "I'm in! Haven't played that one yet.", time: '3:25 PM' },
    { id: 3, from: 'them', sender: 'F', text: "Me too! See you all at 2 PM 🎲", time: '3:30 PM' },
  ],
};

const MARKETPLACE_MESSAGES: Record<number, ChatMessage[]> = {
  3: [
    { id: 1, from: 'them', sender: 'them', text: 'Hi! Is the bookshelf still available?', time: '2:15 PM' },
    { id: 2, from: 'me', sender: 'me', text: 'Great! How about Saturday afternoon around 3 PM?', time: '2:17 PM' },
    { id: 3, from: 'system', sender: 'system', text: '📞 Contact details have been shared', time: '2:17 PM' },
  ],
  5: [
    { id: 1, from: 'them', sender: 'them', text: "Hi! I saw you need plant watering — happy to help!", time: 'Mon' },
    { id: 2, from: 'me', sender: 'me', text: 'That would be amazing, thank you!', time: 'Mon' },
    { id: 3, from: 'them', sender: 'them', text: 'No problem! Saturday works for me.', time: 'Mon' },
  ],
};

const DIRECT_MESSAGES: Record<number, ChatMessage[]> = {
  4: [
    { id: 1, from: 'them', sender: 'them', text: "Hey! Saw your Jio invite — sounds like fun!", time: '10:32 AM' },
    { id: 2, from: 'me', sender: 'me', text: "Yes! Let's plan a run this Saturday morning 🏃", time: '10:33 AM' },
  ],
};

interface ChatMessage {
  id: number;
  from: 'me' | 'them' | 'system';
  sender: string;
  text: string;
  time: string;
}

// ---- Group Activity Board data ----
const GROUP_ACTIVITY: Record<number, { meetup: string; plan: string; goal: string; members: number }> = {
  1: { meetup: 'Saturday 7 AM · Bishan-AMK Park Pavilion', plan: 'Bring water and comfortable shoes', goal: 'Hit 5K in under 30 minutes together', members: 14 },
  2: { meetup: 'Saturday 8 AM · Rooftop Garden, Blk 450', plan: 'Bring gloves — we are pruning herbs this week', goal: 'Grow enough vegetables to share with neighbours', members: 9 },
  3: { meetup: 'Sunday 2 PM · RC Multi-Purpose Hall, Blk 447', plan: 'Bring snacks — we have Catan and Codenames ready', goal: 'Try 3 new games this month as a group', members: 11 },
};

// ---- Group members mock data ----
interface GroupMember { name: string; avatar: string; avatarBg: string; role?: string; interests?: string[]; languages?: string[]; }
const GROUP_MEMBERS: Record<number, GroupMember[]> = {
  1: [
    { name: 'You', avatar: 'YO', avatarBg: '#FF6B47', role: 'Admin' },
    { name: 'Ahmad Farid', avatar: 'AF', avatarBg: '#3B82F6', interests: ['Fitness & Sports','Running','Outdoor Activities'], languages: ['English','Malay'] },
    { name: 'Priya Nair', avatar: 'PN', avatarBg: '#7C3AED', interests: ['Fitness & Sports','Yoga & Mindfulness','Community Volunteering'], languages: ['English','Tamil'] },
    { name: 'Wei Ling', avatar: 'WL', avatarBg: '#059669', interests: ['Fitness & Sports','Outdoor Activities','Cooking & Baking'], languages: ['English','Chinese'] },
    { name: 'Rajan Kumar', avatar: 'RK', avatarBg: '#D97706', interests: ['Fitness & Sports','Running','Community Volunteering'], languages: ['English','Tamil'] },
    { name: 'Mei Xin', avatar: 'MX', avatarBg: '#EC4899', interests: ['Fitness & Sports','Dance','Cooking & Baking'], languages: ['English','Chinese'] },
    { name: 'Hafiz', avatar: 'HF', avatarBg: '#0891B2', interests: ['Fitness & Sports','Running','DIY & Home Improvement'], languages: ['English','Malay'] },
    { name: 'Suriya', avatar: 'SU', avatarBg: '#16A34A', interests: ['Fitness & Sports','Outdoor Activities','Community Volunteering'], languages: ['English','Tamil'] },
    { name: 'Jin Hao', avatar: 'JH', avatarBg: '#7C3AED', interests: ['Fitness & Sports','Technology & Digital Skills','Gaming'], languages: ['English','Chinese'] },
    { name: 'Nalini', avatar: 'NA', avatarBg: '#DC2626', interests: ['Fitness & Sports','Yoga & Mindfulness','Cultural Heritage & Festivals'], languages: ['English','Tamil'] },
    { name: 'Beng Kiat', avatar: 'BK', avatarBg: '#9333EA', interests: ['Fitness & Sports','Running','DIY & Home Improvement'], languages: ['English','Chinese'] },
    { name: 'Siti Rahma', avatar: 'SR', avatarBg: '#059669', interests: ['Fitness & Sports','Outdoor Activities','Gardening & Plants'], languages: ['English','Malay'] },
    { name: 'Chen Wei', avatar: 'CW', avatarBg: '#2563EB', interests: ['Fitness & Sports','Running','Technology & Digital Skills'], languages: ['English','Chinese'] },
    { name: 'Deepa', avatar: 'DE', avatarBg: '#D97706', interests: ['Fitness & Sports','Yoga & Mindfulness','Cooking & Baking'], languages: ['English','Tamil'] },
  ],
  2: [
    { name: 'You', avatar: 'YO', avatarBg: '#059669', role: 'Admin' },
    { name: 'Madam Tan', avatar: 'MT', avatarBg: '#16A34A', interests: ['Gardening & Plants','Cooking & Baking','Community Volunteering'], languages: ['English','Chinese'] },
    { name: 'Rohani', avatar: 'RO', avatarBg: '#7C3AED', interests: ['Gardening & Plants','Community Volunteering','Cooking & Baking'], languages: ['English','Malay'] },
    { name: 'Vincent Lim', avatar: 'VL', avatarBg: '#3B82F6', interests: ['Gardening & Plants','DIY & Home Improvement','Outdoor Activities'], languages: ['English','Chinese'] },
    { name: 'Karthik', avatar: 'KA', avatarBg: '#D97706', interests: ['Gardening & Plants','Outdoor Activities','Fitness & Sports'], languages: ['English','Tamil'] },
    { name: 'Amy Ong', avatar: 'AO', avatarBg: '#EC4899', interests: ['Gardening & Plants','Cooking & Baking','Arts & Crafts'], languages: ['English','Chinese'] },
    { name: 'Encik Razif', avatar: 'ER', avatarBg: '#0891B2', interests: ['Gardening & Plants','Community Volunteering','DIY & Home Improvement'], languages: ['English','Malay'] },
    { name: 'Geeta', avatar: 'GE', avatarBg: '#DC2626', interests: ['Gardening & Plants','Yoga & Mindfulness','Cooking & Baking'], languages: ['English','Tamil'] },
    { name: 'Pak Ismail', avatar: 'PI', avatarBg: '#9333EA', interests: ['Gardening & Plants','Community Volunteering','Cultural Heritage & Festivals'], languages: ['Malay','English'] },
  ],
  3: [
    { name: 'You', avatar: 'YO', avatarBg: '#7C3AED', role: 'Admin' },
    { name: 'Eugene Toh', avatar: 'ET', avatarBg: '#3B82F6', interests: ['Gaming','Technology & Digital Skills','Fitness & Sports'], languages: ['English','Chinese'] },
    { name: 'Fiona Tan', avatar: 'FT', avatarBg: '#EC4899', interests: ['Gaming','Arts & Crafts','Cooking & Baking'], languages: ['English','Chinese'] },
    { name: 'Darren Loh', avatar: 'DL', avatarBg: '#059669', interests: ['Gaming','Technology & Digital Skills','Outdoor Activities'], languages: ['English','Chinese'] },
    { name: 'Shalini', avatar: 'SH', avatarBg: '#D97706', interests: ['Gaming','Fitness & Sports','Music & Performing Arts'], languages: ['English','Tamil'] },
    { name: 'Marcus Ng', avatar: 'MN', avatarBg: '#0891B2', interests: ['Gaming','Technology & Digital Skills','Reading & Books'], languages: ['English','Chinese'] },
    { name: 'Preethi', avatar: 'PT', avatarBg: '#DC2626', interests: ['Gaming','Cooking & Baking','Community Volunteering'], languages: ['English','Tamil'] },
    { name: 'Alex Koh', avatar: 'AK', avatarBg: '#9333EA', interests: ['Gaming','DIY & Home Improvement','Outdoor Activities'], languages: ['English','Chinese'] },
    { name: 'Wendy Yap', avatar: 'WY', avatarBg: '#16A34A', interests: ['Gaming','Arts & Crafts','Reading & Books'], languages: ['English','Chinese'] },
    { name: 'Izwan', avatar: 'IZ', avatarBg: '#D97706', interests: ['Gaming','Fitness & Sports','Community Volunteering'], languages: ['English','Malay'] },
    { name: 'Charlene', avatar: 'CH', avatarBg: '#7C3AED', interests: ['Gaming','Dance','Arts & Crafts'], languages: ['English','Chinese'] },
  ],
};

// ---- Interest tag colors ----
const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:       { bg: '#FFF0EC', text: '#FF6B47' },
  Gardening:     { bg: '#D1FAE5', text: '#059669' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  'Board Game Sundays': { bg: '#EDE9FE', text: '#7C3AED' },
  Cooking:       { bg: '#FEF3C7', text: '#D97706' },
  Item:          { bg: '#DBEAFE', text: '#2563EB' },
  Service:       { bg: '#EDE9FE', text: '#7C3AED' },
  Request:       { bg: '#DCFCE7', text: '#16A34A' },
};

type FilterTab = 'All' | 'Groups' | 'Market' | 'Requests' | 'Neighbour';
const FILTER_TABS: FilterTab[] = ['All', 'Groups', 'Market', 'Requests', 'Neighbour'];

interface MessagesPageProps {
  initialConvId?: number;
  initialFilter?: FilterTab;
  extraConversations?: any[];
  onNavVisibilityChange?: (visible: boolean) => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
  onNewGroup?: () => void;
  onNewNeighbour?: () => void;
  onOpenMarketplaceListing?: (id: number) => void;
  onOpenRequestListing?: (id: number) => void;
}

export function MessagesPage({ initialConvId, initialFilter, extraConversations = [], onNavVisibilityChange, onOpenNeighbourProfile, onNewGroup, onNewNeighbour, onOpenMarketplaceListing, onOpenRequestListing }: MessagesPageProps = {}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>(initialFilter || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [createGroupStep, setCreateGroupStep] = useState<0 | 1 | 2>(0);
  const [selectedNeighbours, setSelectedNeighbours] = useState<typeof GROUP_NEIGHBOURS>([]);
  const [neighbourSearch, setNeighbourSearch] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [showInterestFilter, setShowInterestFilter] = useState(false);
  const [expandedInterestCats, setExpandedInterestCats] = useState<Set<string>>(new Set());
  const [expandedGroupInterestCats, setExpandedGroupInterestCats] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');
  const [selectedGroupInterests, setSelectedGroupInterests] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches(prev => [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 6));
    setSearchQuery(trimmed);
    setSearchOpen(false);
  };
  const newChatRef = useRef<HTMLDivElement>(null);
  const extraMapped: Conversation[] = extraConversations.map((c: any) => ({
    id: c.id,
    type: (c.type || 'direct') as ConvType,
    name: c.name,
    avatar: c.avatar || c.name?.substring(0, 2) || '??',
    avatarBg: c.avatarColor || c.avatarBg || '#8B5CF6',
    lastMessage: c.lastMessage || 'Say hello!',
    time: c.time || 'Just now',
    unread: c.unread ?? 0,
    tag: c.tag || null,
    subtitle: c.subtitle,
    memberCount: c.memberCount,
    meetFrequency: c.meetFrequency,
    location: c.location,
    imageUrl: c.imageUrl,
    listingImage: c.listingImage,
    price: c.price,
    listingId: c.listingId,
    interests: c.interests,
    languages: c.languages,
    block: c.block,
    distance: c.distance,
    rating: c.rating,
    reviews: c.reviews,
  }));

  const [openConv, setOpenConv] = useState<Conversation | null>(
    initialConvId
      ? (extraMapped.find(c => c.id === initialConvId) ?? CONVERSATIONS.find(c => c.id === initialConvId) ?? null)
      : null
  );
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [localMessages, setLocalMessages] = useState<Record<number, ChatMessage[]>>({});
  const [localUnread, setLocalUnread] = useState<Record<number, number>>({});

  useEffect(() => {
    onNavVisibilityChange?.(openConv === null);
  }, [openConv]);

  useEffect(() => {
    if (createGroupStep !== 0) onNavVisibilityChange?.(false);
    else if (openConv === null) onNavVisibilityChange?.(true);
  }, [createGroupStep]);

  useEffect(() => {
    if (!showNewChat) return;
    const handler = (e: MouseEvent) => {
      if (newChatRef.current && !newChatRef.current.contains(e.target as Node)) {
        setShowNewChat(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNewChat]);

  // Merge extra conversations (from neighbours message etc.) with existing mock data
  const allConversations: Conversation[] = [...extraMapped, ...CONVERSATIONS].map(c => ({
    ...c,
    unread: localUnread[c.id] ?? c.unread,
  }));

  const getMessages = (conv: Conversation): ChatMessage[] => {
    const local = localMessages[conv.id];
    if (local) return local;
    if (conv.type === 'group') return GROUP_MESSAGES[conv.id] || [];
    if (conv.type === 'marketplace' || conv.type === 'request') return MARKETPLACE_MESSAGES[conv.id] || [];
    return DIRECT_MESSAGES[conv.id] || [];
  };

  const initMessages = (conv: Conversation) => {
    if (!localMessages[conv.id]) {
      setLocalMessages(p => ({ ...p, [conv.id]: getMessages(conv) }));
    }
    setLocalUnread(p => ({ ...p, [conv.id]: 0 }));
  };

  const sendMessage = (conv: Conversation) => {
    const input = (chatInputs[conv.id] || '').trim();
    if (!input) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      from: 'me',
      sender: 'me',
      text: input,
      time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }),
    };
    setLocalMessages(p => ({
      ...p,
      [conv.id]: [...(p[conv.id] || getMessages(conv)), newMsg],
    }));
    setChatInputs(p => ({ ...p, [conv.id]: '' }));
  };

  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollProgress(Math.min(e.currentTarget.scrollTop / 60, 1));
  };

  const filteredConvs = allConversations.filter(c => {
    if (activeFilter === 'Groups' && c.type !== 'group') return false;
    if (activeFilter === 'Market' && c.type !== 'marketplace') return false;
    if (activeFilter === 'Requests' && c.type !== 'request') return false;
    if (activeFilter === 'Neighbour' && c.type !== 'direct') return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadFor = (filter: FilterTab) => {
    return allConversations.filter(c => {
      if (filter === 'Groups') return c.type === 'group';
      if (filter === 'Market') return c.type === 'marketplace';
      if (filter === 'Requests') return c.type === 'request';
      if (filter === 'Neighbour') return c.type === 'direct';
      return true; // All
    }).reduce((sum, c) => sum + c.unread, 0);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
      }}
    >
      {/* Main messages list */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: searchOpen ? 'transparent' : CARD, borderBottom: searchOpen ? 'none' : `0.5px solid rgba(60,60,67,0.12)`, flexShrink: 0, position: 'relative', zIndex: searchOpen ? 202 : undefined }}>
          <>
              {/* Header: buttons fixed top-right; title starts below and moves up on scroll */}
              <div style={{ position: 'relative', height: searchOpen ? '88px' : `${132 - scrollProgress * 40}px`, transition: 'height 0.1s linear' }}>
                {searchOpen ? (
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    style={{ position: 'absolute', top: '44px', left: '16px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={22} color="white" />
                  </button>
                ) : (
                  /* newChatRef covers full container so click-outside detection still works */
                  <div ref={newChatRef} style={{ position: 'absolute', inset: 0 }}>
                    {/* Buttons: absolutely pinned, no animation ever */}
                    <div style={{ position: 'absolute', top: '44px', right: '16px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => setSearchOpen(true)}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={18} color={TEXT2} />
                      </button>
                      <button onClick={() => setShowNewChat(v => !v)}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={20} color="white" />
                      </button>
                    </div>
                    {/* Title: starts below buttons, slides up + shrinks to align with buttons on scroll */}
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
                    }}>Messages</span>
                    {/* New chat popup — positioned relative to container, below the + button */}
                    <AnimatePresence>
                      {showNewChat && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: -6 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: 'absolute',
                            top: '88px',
                            right: '16px',
                            background: CARD,
                            borderRadius: '14px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.14)',
                            zIndex: 100,
                            minWidth: '180px',
                            overflow: 'hidden',
                          }}
                        >
                          <button
                            onClick={() => { setShowNewChat(false); setSelectedNeighbours([]); setNeighbourSearch(''); setInterestFilter(''); setGroupName(''); setSelectedGroupInterests([]); setCreateGroupStep(1); }}
                            style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: "'Nunito', sans-serif" }}
                          >
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Users size={16} color={PRIMARY} />
                            </div>
                            <span style={{ fontSize: '15px', fontWeight: 600, color: TEXT }}>Create New Group</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              {/* Filter tabs — always visible */}
              <div className="no-scrollbar" style={{ display: 'flex', overflowX: 'auto' }}>
                {FILTER_TABS.map(tab => {
                  const count = unreadFor(tab);
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      style={{
                        flex: '0 0 auto',
                        padding: '8px 14px',
                        background: 'none',
                        border: 'none',
                        borderBottom: `2px solid ${activeFilter === tab ? (searchOpen ? 'white' : PRIMARY) : 'transparent'}`,
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '13px',
                        fontWeight: activeFilter === tab ? 600 : 500,
                        color: activeFilter === tab ? (searchOpen ? 'white' : PRIMARY) : (searchOpen ? 'rgba(255,255,255,0.55)' : MUTED),
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {tab === 'Neighbour' ? 'Neighbours' : tab}
                      {count > 0 && (
                        <span style={{
                          minWidth: '17px', height: '17px', borderRadius: '9px',
                          background: activeFilter === tab ? (searchOpen ? 'rgba(255,255,255,0.9)' : PRIMARY) : (searchOpen ? 'rgba(255,255,255,0.35)' : MUTED),
                          color: searchOpen ? (activeFilter === tab ? TEXT : 'white') : 'white', fontSize: '10px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0 4px',
                        }}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
          </>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px', position: 'relative' }} onScroll={handleScroll}>
          {filteredConvs.length === 0 && (
            <div
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                color: MUTED,
                fontSize: '14px',
              }}
            >
              <MessageCircle size={32} color={MUTED} />
              No conversations here yet
            </div>
          )}
          {filteredConvs.map((conv, i) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                initMessages(conv);
                setOpenConv(conv);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 20px',
                background: CARD,
                borderBottom: `0.5px solid rgba(60,60,67,0.10)`,
                cursor: 'pointer',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: conv.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'white',
                  position: 'relative',
                }}
              >
                {conv.imageUrl ? (
                  <img src={conv.imageUrl} alt={conv.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  conv.avatar
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    {conv.type === 'marketplace' && conv.subtitle && (
                      <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.subtitle}
                      </span>
                    )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: TEXT,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {conv.name}
                    </span>
                    {conv.tag && (() => {
                      const colors = INTEREST_COLORS[conv.tag] || { bg: BG, text: TEXT2 };
                      return (
                        <span
                          style={{
                            padding: '2px 7px',
                            borderRadius: '8px',
                            background: colors.bg,
                            color: colors.text,
                            fontSize: '10px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {conv.tag}
                        </span>
                      );
                    })()}
                  </div>
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      color: MUTED,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {conv.time}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: TEXT2,
                      fontWeight: conv.unread > 0 ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    {conv.lastMessage}
                  </span>
                  {conv.unread > 0 && (
                    <div
                      style={{
                        flexShrink: 0,
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '10px',
                        background: PRIMARY,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 5px',
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(120,120,128,0.10)', borderRadius: '14px', padding: '12px 14px', marginBottom: '16px' }}>
                <Search size={16} color={MUTED} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitSearch(searchQuery); }}
                  placeholder="Search messages..."
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '16px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <X size={15} color={MUTED} />
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', marginBottom: recentSearches.length > 0 ? '16px' : 0 }}>
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); onNewGroup?.(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, color: TEXT }}
                >
                  <span>Explore more groups</span>
                  <ArrowRight size={14} color={TEXT} />
                </button>
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); onNewNeighbour?.(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, color: TEXT }}
                >
                  <span>Find neighbours</span>
                  <ArrowRight size={14} color={TEXT} />
                </button>
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
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-start', padding: '13px 4px', background: 'none', border: 'none', borderBottom: i < recentSearches.length - 1 ? `0.5px solid rgba(60,60,67,0.12)` : 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      <History size={15} color={MUTED} />
                      <span style={{ fontSize: '15px', color: TEXT, fontWeight: 500 }}>{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Group — Step 1: Add Neighbours */}
      <AnimatePresence>
        {createGroupStep === 1 && (() => {
          const filtered = GROUP_NEIGHBOURS.filter(n =>
            n.name.toLowerCase().includes(neighbourSearch.toLowerCase()) &&
            (interestFilter === '' || n.interests.includes(interestFilter))
          );
          const toggle = (n: typeof GROUP_NEIGHBOURS[0]) =>
            setSelectedNeighbours(prev => prev.find(x => x.id === n.id) ? prev.filter(x => x.id !== n.id) : [...prev, n]);
          return (
            <motion.div key="create-group-step1" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: BG, zIndex: 10 }}>
              {/* Header */}
              <div style={{ background: CARD, borderBottom: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 16px 14px' }}>
                  <button onClick={() => setCreateGroupStep(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: PRIMARY, fontFamily: 'inherit', fontSize: '15px', fontWeight: 600, padding: 0 }}>
                    <ChevronLeft size={20} color={PRIMARY} />
                  </button>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: TEXT }}>Create New Group</span>
                  <button
                    onClick={() => selectedNeighbours.length > 0 && setCreateGroupStep(2)}
                    style={{ background: 'none', border: 'none', cursor: selectedNeighbours.length > 0 ? 'pointer' : 'default', fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, color: selectedNeighbours.length > 0 ? PRIMARY : MUTED, padding: 0 }}
                  >Next</button>
                </div>
                {/* Search + Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px 14px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(120,120,128,0.1)', borderRadius: '12px', padding: '10px 14px' }}>
                    <Search size={15} color={MUTED} />
                    <input value={neighbourSearch} onChange={e => setNeighbourSearch(e.target.value)} placeholder="Search neighbours..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
                    {neighbourSearch && <button onClick={() => setNeighbourSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={14} color={MUTED} /></button>}
                  </div>
                  <button onClick={() => setShowInterestFilter(v => !v)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: interestFilter ? PRIMARY : 'rgba(120,120,128,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Filter size={16} color={interestFilter ? 'white' : MUTED} />
                  </button>
                </div>
              </div>
              {/* Neighbour list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                {filtered.map(n => {
                  const selected = !!selectedNeighbours.find(x => x.id === n.id);
                  return (
                    <button key={n.id} onClick={() => toggle(n)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: selected ? `2.5px solid ${PRIMARY}` : '2px solid transparent' }}>
                          <img src={n.avatarUrl} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {selected && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}><Check size={10} color="white" /></div>}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>{n.name}</div>
                        <div style={{ fontSize: '12px', color: MUTED, marginTop: '2px' }}>{n.unit}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '140px' }}>
                        {n.interests.slice(0, 1).map(int => {
                          const tc = GROUP_INTEREST_COLORS[int] || { bg: '#F1F5F9', text: '#475569' };
                          return <span key={int} style={{ fontSize: '10px', fontWeight: 600, padding: '3px 7px', borderRadius: '8px', background: tc.bg, color: tc.text }}>{int}</span>;
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>
              {/* Selected count bar */}
              {selectedNeighbours.length > 0 && (
                <div style={{ background: CARD, borderTop: `0.5px solid ${BORDER}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="no-scrollbar" style={{ flex: 1, display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {selectedNeighbours.map(n => (
                      <div key={n.id} style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden' }}>
                          <img src={n.avatarUrl} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button onClick={() => toggle(n)} style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '50%', background: MUTED, border: '1.5px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}><X size={8} color="white" /></button>
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: PRIMARY, flexShrink: 0 }}>{selectedNeighbours.length} added</span>
                </div>
              )}

              {/* Interest filter bottom sheet */}
              <AnimatePresence>
                {showInterestFilter && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
                    onClick={() => setShowInterestFilter(false)}
                  >
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      onClick={e => e.stopPropagation()}
                      style={{ background: CARD, borderRadius: '20px 20px 0 0', padding: '16px 16px 40px', maxHeight: '70vh', overflowY: 'auto' }}
                    >
                      <div style={{ width: '36px', height: '4px', background: 'rgba(60,60,67,0.15)', borderRadius: '2px', margin: '0 auto 20px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 700, color: TEXT }}>Filter by Interest</span>
                        <button onClick={() => setShowInterestFilter(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={16} color={TEXT} />
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interests</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
                        {GROUP_INTEREST_CATEGORIES.map(cat => {
                          const isOpen = expandedInterestCats.has(cat.label);
                          const selectedInCat = cat.items.filter(t => interestFilter === t).length;
                          return (
                            <div key={cat.label} style={{ background: BG, borderRadius: '14px', overflow: 'hidden' }}>
                              <motion.button whileTap={{ scale: 0.98 }}
                                onClick={() => setExpandedInterestCats(prev => { const next = new Set(prev); isOpen ? next.delete(cat.label) : next.add(cat.label); return next; })}
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
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 14px 14px' }}>
                                      {cat.items.map(t => {
                                        const sel = interestFilter === t;
                                        return (
                                          <button key={t} onClick={() => setInterestFilter(sel ? '' : t)}
                                            style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: sel ? '#FFF0EC' : CARD, color: sel ? PRIMARY : TEXT2, border: sel ? `1.5px solid ${PRIMARY}` : `1.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
                                          >{t}</button>
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
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => { setInterestFilter(''); setExpandedInterestCats(new Set()); }}
                          style={{ flex: 1, padding: '14px', borderRadius: '14px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}>Clear</button>
                        <button onClick={() => setShowInterestFilter(false)}
                          style={{ flex: 2, padding: '14px', borderRadius: '14px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'inherit' }}>Apply</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Create Group — Step 2: Group Details */}
      <AnimatePresence>
        {createGroupStep === 2 && (() => {
          const toggleInterest = (int: string) =>
            setSelectedGroupInterests(prev => prev.includes(int) ? prev.filter(x => x !== int) : [...prev, int]);
          return (
            <motion.div key="create-group-step2" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: BG, zIndex: 11 }}>
              {/* Header */}
              <div style={{ background: CARD, borderBottom: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 16px 14px' }}>
                  <button onClick={() => setCreateGroupStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: PRIMARY, fontFamily: 'inherit', fontSize: '15px', fontWeight: 600, padding: 0 }}>
                    <ChevronLeft size={20} color={PRIMARY} />
                  </button>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: TEXT }}>Create New Group</span>
                  <div style={{ width: '77px' }} />
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
                {/* Photo + Name row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <button style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(120,120,128,0.1)', border: `1.5px dashed ${MUTED}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', flexShrink: 0 }}>
                    <Camera size={22} color={MUTED} />
                    <span style={{ fontSize: '10px', color: MUTED, fontWeight: 600 }}>Photo</span>
                  </button>
                  <div style={{ flex: 1 }}>
                    <input
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      placeholder="Group name..."
                      style={{ width: '100%', fontSize: '16px', fontWeight: 700, color: TEXT, border: 'none', borderBottom: `2px solid ${groupName ? PRIMARY : BORDER}`, background: 'transparent', outline: 'none', fontFamily: 'inherit', padding: '8px 0', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '11px', color: MUTED, marginTop: '4px' }}>Enter a name for your group</div>
                  </div>
                </div>

                {/* Interest tags */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Group Interest</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {GROUP_INTEREST_CATEGORIES.map(cat => {
                      const expanded = expandedGroupInterestCats.has(cat.label);
                      const selectedCount = cat.items.filter(i => selectedGroupInterests.includes(i)).length;
                      return (
                        <div key={cat.label} style={{ borderRadius: '14px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                          <button onClick={() => setExpandedGroupInterestCats(prev => { const s = new Set(prev); s.has(cat.label) ? s.delete(cat.label) : s.add(cat.label); return s; })}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: CARD, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '15px', fontWeight: 600, color: TEXT }}>{cat.label}</span>
                              {selectedCount > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color: PRIMARY, background: 'rgba(255,107,71,0.12)', padding: '2px 7px', borderRadius: '10px' }}>{selectedCount}</span>}
                            </div>
                            <ChevronDown size={16} color={MUTED} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                          </button>
                          {expanded && (
                            <div style={{ padding: '0 16px 14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {cat.items.map(item => {
                                const active = selectedGroupInterests.includes(item);
                                const tc = GROUP_INTEREST_COLORS[item] || { bg: '#F1F5F9', text: '#475569' };
                                return (
                                  <button key={item} onClick={() => toggleInterest(item)}
                                    style={{ padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${active ? tc.text : BORDER}`, background: active ? tc.bg : 'transparent', color: active ? tc.text : MUTED, fontSize: '13px', fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected neighbours */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    Members · {selectedNeighbours.length} neighbour{selectedNeighbours.length !== 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {selectedNeighbours.map(n => (
                      <div key={n.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '56px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${BORDER}` }}>
                          <img src={n.avatarUrl} alt={n.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: TEXT, textAlign: 'center', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{n.name.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Send Invite CTA */}
              <div style={{ background: CARD, borderTop: `0.5px solid ${BORDER}`, padding: '16px 16px 36px', flexShrink: 0 }}>
                <button
                  onClick={() => { if (groupName.trim()) setCreateGroupStep(0); }}
                  disabled={!groupName.trim()}
                  style={{ width: '100%', padding: '16px', borderRadius: '16px', background: groupName.trim() ? PRIMARY : 'rgba(120,120,128,0.15)', border: 'none', cursor: groupName.trim() ? 'pointer' : 'default', fontFamily: 'inherit', fontSize: '16px', fontWeight: 700, color: groupName.trim() ? 'white' : MUTED, transition: 'background 0.2s' }}
                >
                  Send Invite to {selectedNeighbours.length} Member{selectedNeighbours.length !== 1 ? 's' : ''}
                </button>
              </div>

            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Chat screen overlay */}
      <AnimatePresence>
        {openConv && (
          <motion.div
            key={`chat-${openConv.id}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              background: BG,
              zIndex: 10,
            }}
          >
            <ChatScreen
              conv={openConv}
              messages={localMessages[openConv.id] || getMessages(openConv)}
              input={chatInputs[openConv.id] || ''}
              onInputChange={val =>
                setChatInputs(p => ({ ...p, [openConv.id]: val }))
              }
              onSend={() => sendMessage(openConv)}
              onBack={() => setOpenConv(null)}
              onOpenNeighbourProfile={onOpenNeighbourProfile}
              onOpenMarketplaceListing={onOpenMarketplaceListing}
              onOpenRequestListing={onOpenRequestListing}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Chat Screen ----
function ChatScreen({
  conv,
  messages,
  input,
  onInputChange,
  onSend,
  onBack,
  onOpenNeighbourProfile,
  onOpenMarketplaceListing,
  onOpenRequestListing,
}: {
  conv: Conversation;
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
  onOpenMarketplaceListing?: (id: number) => void;
  onOpenRequestListing?: (id: number) => void;
}) {
  const isGroup = conv.type === 'group';
  const [groupTab, setGroupTab] = useState<'chat' | 'activity'>('chat');
  const [showMembers, setShowMembers] = useState(false);
  const activity = GROUP_ACTIVITY[conv.id] ?? (
    conv.meetFrequency ? {
      meetup: `${conv.meetFrequency}${conv.location ? ` · ${conv.location}` : ''}`,
      plan: 'More details will be shared by the group admin.',
      goal: 'Connect and engage with fellow neighbours!',
      members: conv.memberCount ?? 0,
    } : undefined
  );
  const members = GROUP_MEMBERS[conv.id] ?? (isGroup ? [{ name: 'You', avatar: 'YO', avatarBg: '#FF6B47', role: 'Member' }] : []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: CARD, borderBottom: `0.5px solid rgba(60,60,67,0.12)` }}>
        <div style={{ padding: '44px 16px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(120,120,128,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ChevronLeft size={20} color={TEXT} />
          </button>

          {/* Avatar + Name — tappable for groups (shows members), direct/marketplace/request (opens poster profile) */}
          <div
            onClick={() => { if (isGroup) setShowMembers(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: isGroup ? 'pointer' : 'default', minWidth: 0 }}
          >
            <div
              onClick={e => {
                if (isGroup) return; // handled by parent
                e.stopPropagation();
                const profileName = (conv.type === 'marketplace' || conv.type === 'request') && conv.subtitle ? conv.subtitle : conv.name;
                onOpenNeighbourProfile?.({ name: profileName, avatar: conv.avatar, color: conv.avatarBg, avatarUrl: conv.imageUrl, interests: conv.interests, languages: conv.languages, block: conv.block, distance: conv.distance, rating: conv.rating, reviews: conv.reviews });
              }}
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: conv.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden', cursor: 'pointer' }}
            >
              {conv.imageUrl ? (
                <img src={conv.imageUrl} alt={conv.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                conv.avatar
              )}
            </div>

            {/* Name + subtitle */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {(conv.type === 'marketplace' || conv.type === 'request') && conv.subtitle && (
                <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500, marginBottom: '1px' }}>
                  {conv.subtitle}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>{conv.name}</span>
                {!isGroup && <Shield size={12} color="#22C55E" />}
              </div>
              <span style={{ fontSize: '11px', color: isGroup ? PRIMARY : MUTED, fontWeight: 500 }}>
                {isGroup
                  ? `${activity?.members ?? conv.memberCount ?? members.length} members`
                  : conv.type === 'marketplace' ? 'Marketplace chat' : conv.type === 'request' ? 'Request chat' : 'Direct message'}
              </span>
            </div>
          </div>

          {/* Tag badge */}
          {conv.tag && (() => {
            const colors = INTEREST_COLORS[conv.tag] || { bg: BG, text: TEXT2 };
            return (
              <span style={{ padding: '4px 10px', borderRadius: '10px', background: colors.bg, color: colors.text, fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                {conv.tag}
              </span>
            );
          })()}
        </div>

        {/* Chat / Activity Board tabs — groups only */}
        {isGroup && (
          <div style={{ display: 'flex', borderTop: `0.5px solid rgba(60,60,67,0.12)` }}>
            {(['chat', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setGroupTab(tab)}
                style={{
                  flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif", fontSize: '13px',
                  fontWeight: groupTab === tab ? 600 : 500,
                  color: groupTab === tab ? PRIMARY : MUTED,
                  borderBottom: `2px solid ${groupTab === tab ? PRIMARY : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                {tab === 'chat' ? 'Chat' : 'Activity Board'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listing banner — marketplace & request only */}
      {(conv.type === 'marketplace' || conv.type === 'request') && conv.listingImage && (
        <button
          onClick={() => {
            if (!conv.listingId) return;
            if (conv.type === 'marketplace') onOpenMarketplaceListing?.(conv.listingId);
            else onOpenRequestListing?.(conv.listingId);
          }}
          style={{ background: CARD, borderBottom: `0.5px solid rgba(60,60,67,0.12)`, padding: '10px 16px', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={conv.listingImage}
              alt={conv.name}
              style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.name}
              </div>
              {conv.price && (
                <div style={{ fontSize: '13px', fontWeight: 500, color: TEXT2, marginTop: '2px' }}>
                  {conv.price}
                </div>
              )}
            </div>
            <SquareArrowOutUpRight size={16} color={MUTED} style={{ flexShrink: 0 }} />
          </div>
        </button>
      )}

      {/* Activity Board — groups only */}
      {isGroup && groupTab === 'activity' && activity && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: MUTED, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '14px' }}>
            Upcoming Activity
          </div>

          {[
            { icon: <MapPin size={16} color={PRIMARY} />, label: 'Next Meetup', value: activity.meetup },
            { icon: <ClipboardList size={16} color="#7C3AED" />, label: 'Upcoming Plan', value: activity.plan },
            { icon: <Target size={16} color="#059669" />, label: 'Group Goal', value: activity.goal },
          ].map(item => (
            <div
              key={item.label}
              style={{ background: CARD, borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)' }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.5' }}>{item.value}</div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Messages */}
      {(!isGroup || groupTab === 'chat') && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {messages.map(msg => {
            if (msg.from === 'system') {
              return (
                <div key={msg.id} style={{ textAlign: 'center', padding: '4px 0' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: 'rgba(120,120,128,0.1)',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: TEXT2,
                      textAlign: 'center',
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              );
            }

            const isMe = msg.from === 'me';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {/* Sender avatar for group "them" messages */}
                {!isMe && isGroup && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: conv.avatarBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '14px',
                    }}
                  >
                    {msg.sender}
                  </div>
                )}

                <div style={{ maxWidth: '72%' }}>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      background: isMe ? PRIMARY : CARD,
                      color: isMe ? 'white' : TEXT,
                      fontSize: '14px',
                      lineHeight: '1.5',
                      ...(isMe ? {} : { border: '0.5px solid rgba(60,60,67,0.10)' }),
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: MUTED,
                      marginTop: '3px',
                      textAlign: isMe ? 'right' : 'left',
                      paddingLeft: isMe ? 0 : '4px',
                      paddingRight: isMe ? '4px' : 0,
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Input bar — chat tab only */}
      {(!isGroup || groupTab === 'chat') && (
        <div
          style={{
            padding: '10px 16px 28px',
            background: CARD,
            borderTop: `0.5px solid rgba(60,60,67,0.12)`,
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '22px',
                background: 'rgba(120,120,128,0.12)',
                border: 'none',
                fontSize: '15px',
                outline: 'none',
                color: TEXT,
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            <button
              onClick={onSend}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: PRIMARY,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* Members bottom sheet */}
      <AnimatePresence>
        {showMembers && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMembers(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 20 }}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: CARD, borderRadius: '20px 20px 0 0',
                zIndex: 21, maxHeight: '70%', display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(60,60,67,0.18)' }} />
              </div>

              {/* Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 14px' }}>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: TEXT }}>{conv.name}</div>
                  <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500, marginTop: '2px' }}>{members.length} members</div>
                </div>
                <button
                  onClick={() => setShowMembers(false)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(120,120,128,0.12)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} color={MUTED} />
                </button>
              </div>

              {/* Members list */}
              <div className="no-scrollbar" style={{ overflowY: 'auto', padding: '0 20px 32px', flex: 1 }}>
                {members.map((m, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (m.name === 'You') return;
                      setShowMembers(false);
                      onOpenNeighbourProfile?.({ name: m.name, avatar: m.avatar, color: m.avatarBg, interests: m.interests, languages: m.languages });
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 0',
                      borderBottom: i < members.length - 1 ? `0.5px solid rgba(60,60,67,0.10)` : 'none',
                      cursor: m.name === 'You' ? 'default' : 'pointer',
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', background: m.avatarBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}>
                      {m.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{m.name}</span>
                    </div>
                    {m.role && (
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 8px',
                        borderRadius: '8px',
                        background: m.role === 'Admin' ? '#FFF0EC' : 'rgba(120,120,128,0.1)',
                        color: m.role === 'Admin' ? PRIMARY : MUTED,
                      }}>
                        {m.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
