import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChevronRight, Bookmark, Check, ChevronLeft, MapPin, Calendar, Clock, Star, Users, Share2, X, Activity, Leaf, Dice5, Sun, MapPin as MapPinIcon, ClipboardList, Plus, Utensils, Camera, BookOpen, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { REQUESTS_DATA, REQUESTS_CAT_EMOJIS } from './RequestsPage';
import { NeighbourProfile } from './NeighbourProfilePage';

// ---- Design tokens ----
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

// ---- Group Icon Map ----
const GROUP_ICON_MAP: Record<string, React.FC<any>> = { Activity, Leaf, Dice5 };

// ---- Emoji → lucide icon (for joined groups from Explore) ----
const EMOJI_ICON_MAP: Record<string, React.FC<any>> = {
  '🏃': Activity, '🍳': Utensils, '🌱': Leaf, '🎲': Dice5,
  '🧘': Activity, '👨‍👩‍👧': Heart, '📸': Camera, '📚': BookOpen,
};

// ---- categoryColor → gradient ----
const COLOR_GRADIENT: Record<string, string> = {
  '#16A34A': 'linear-gradient(135deg, #16A34A 0%, #34D399 100%)',
  '#059669': 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
  '#FF6B47': 'linear-gradient(135deg, #FF6B47 0%, #FF9068 100%)',
  '#7C3AED': 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
  '#D97706': 'linear-gradient(135deg, #D97706 0%, #FCD34D 100%)',
  '#EC4899': 'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)',
  '#0891B2': 'linear-gradient(135deg, #0891B2 0%, #67E8F9 100%)',
  '#EA580C': 'linear-gradient(135deg, #EA580C 0%, #FB923C 100%)',
  '#2563EB': 'linear-gradient(135deg, #2563EB 0%, #93C5FD 100%)',
};

// ---- Types ----
type EventsScreen = 'feed' | 'detail' | 'going' | 'group-detail';
interface NavFrame { screen: EventsScreen; params?: any; }

interface EventsPageProps {
  onOpenProfile: () => void;
  onOpenEvent: (eventId: number) => void;
  onOpenGroups: () => void;
  onOpenGroupChat: (groupId: number) => void;
  onOpenMarketplace: () => void;
  savedEvents: number[];
  onOpenNeighbours?: () => void;
  onOpenRequest?: (id: number) => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
  onSayHello?: (neighbour: any) => void;
  joinedGroups?: any[];
  onOpenExploreEvents?: () => void;
  registeredEventIds?: number[];
  onToggleRegister?: (id: number) => void;
}

// ---- Mock Neighbours Data (shared with ExplorePage) ----
const MOCK_NEIGHBOURS = [
  { id: 1, name: 'Alex Lim',   distance: '0.1 km', unit: 'Blk 445 #12-34', interests: ['Fitness & Sports', 'Cooking & Baking'],              avatar: 'AL', color: '#FF6B47', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '2 hours ago',  languages: ['English', 'Chinese'] },
  { id: 2, name: 'Ben Tan',    distance: '0.2 km', unit: 'Blk 447 #08-12', interests: ['Gaming', 'Technology & Digital Skills'],              avatar: 'BT', color: '#7C3AED', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '5 hours ago',  languages: ['English', 'Chinese'] },
  { id: 3, name: 'Clara Soh',  distance: '0.3 km', unit: 'Blk 448 #03-22', interests: ['Cooking & Baking', 'Gardening & Plants'],             avatar: 'CS', color: '#D97706', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '1 day ago',    languages: ['English', 'Malay'] },
  { id: 4, name: 'Diana Mak',  distance: '0.4 km', unit: 'Blk 445 #15-01', interests: ['Gardening & Plants', 'Yoga & Mindfulness'],           avatar: 'DM', color: '#059669', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '3 hours ago',  languages: ['English', 'Chinese'] },
  { id: 5, name: 'Eli Ng',     distance: '0.5 km', unit: 'Blk 449 #07-05', interests: ['Community Volunteering', 'Arts & Crafts'],            avatar: 'EN', color: '#0891B2', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: 'Just now',     languages: ['English'] },
  { id: 6, name: 'Fiona Raj',  distance: '0.6 km', unit: 'Blk 446 #11-18', interests: ['Music & Performing Arts', 'Dance'],                   avatar: 'FR', color: '#DB2777', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '30 min ago',   languages: ['English', 'Tamil'] },
  { id: 7, name: 'Gary Koh',   distance: '0.8 km', unit: 'Blk 450 #04-09', interests: ['DIY & Home Improvement', 'Technology & Digital Skills'], avatar: 'GK', color: '#EA580C', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '2 days ago', languages: ['English', 'Chinese'] },
  { id: 8, name: 'Hannah Lee', distance: '1.0 km', unit: 'Blk 445 #09-33', interests: ['Photography', 'Outdoor Activities'],                  avatar: 'HL', color: '#475569', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&w=100', lastActive: '4 hours ago',  languages: ['English', 'Chinese'] },
];

// ---- Mock Data ----
const EVENTS = [
  {
    id: 1,
    title: 'Morning Run at Bishan-AMK Park',
    date: 'Sat, 12 Apr 2026',
    time: '7:00 AM – 9:00 AM',
    category: 'Fitness',
    categoryColor: '#16A34A',
    categoryBg: '#DCFCE7',
    image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'Bishan-AMK Park, Main Pavilion',
    address: '1384 Ang Mo Kio Ave 1, S569931',
    description: 'Join your neighbours for a refreshing morning run around Bishan-AMK Park. Suitable for casual joggers and experienced runners alike. Meet at the main pavilion at 6:50 AM. Water stations provided. All fitness levels welcome — we run at a conversational pace so no one gets left behind.',
    organizer: 'Bishan-AMK RC',
    organizerRating: 4.8,
    organizerReviews: 124,
    organizerImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    price: 'Free',
    going: 24,
    hosting: 1,
    recommended: true,
  },
  {
    id: 2,
    title: 'Peranakan Cooking Workshop',
    date: 'Sun, 13 Apr 2026',
    time: '10:00 AM – 1:00 PM',
    category: 'Cooking',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'Community Hub, Level 2 Kitchen',
    address: 'Blk 123 Ang Mo Kio Ave 6, S560123',
    description: 'Learn to cook traditional Peranakan dishes with your neighbours! Mrs Lim will guide you through making Ayam Buah Keluak and Kueh Pie Tee. Ingredients provided. Limited to 15 participants. Perfect for families and food enthusiasts who want to connect over Singapore heritage food.',
    organizer: 'Bishan CC',
    organizerRating: 4.9,
    organizerReviews: 359,
    organizerImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    price: 'Free',
    going: 12,
    hosting: 1,
    recommended: true,
  },
  {
    id: 3,
    title: 'Community Garden Morning',
    date: 'Sat, 19 Apr 2026',
    time: '8:00 AM – 11:00 AM',
    category: 'Gardening',
    categoryColor: '#059669',
    categoryBg: '#D1FAE5',
    image: 'https://images.unsplash.com/photo-1759716705272-8d1697eccf7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'Rooftop Garden, Blk 450',
    address: 'Blk 450 Ang Mo Kio Ave 10, S560450',
    description: "Help tend the estate's shared rooftop garden! Activities include planting vegetables, pruning herbs, and composting. No experience needed — seasoned gardeners and curious beginners are both welcome. Gloves and tools provided.",
    organizer: 'Green Thumbs SG',
    organizerRating: 4.7,
    organizerReviews: 88,
    organizerImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    price: 'Free',
    going: 18,
    hosting: 2,
    recommended: false,
  },
  {
    id: 4,
    title: 'Saturday Board Game Afternoon',
    date: 'Sat, 19 Apr 2026',
    time: '2:00 PM – 5:00 PM',
    category: 'Board Games',
    categoryColor: '#7C3AED',
    categoryBg: '#EDE9FE',
    image: 'https://images.unsplash.com/photo-1762068383473-f59f4dc614e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'RC Multi-Purpose Hall, Blk 447',
    address: 'Blk 447 Ang Mo Kio Ave 10, S560447',
    description: "Bring your favourite board games or try something from the communal library. From Catan to Codenames, there's something for everyone. Snacks provided. Great way to meet neighbours who love strategy and fun.",
    organizer: 'Bishan-AMK RC',
    organizerRating: 4.6,
    organizerReviews: 72,
    organizerImage: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    price: 'Free',
    going: 15,
    hosting: 1,
    recommended: true,
  },
  {
    id: 5,
    title: 'Seniors Tai Chi Morning',
    date: 'Wed, 16 Apr 2026',
    time: '7:30 AM – 9:00 AM',
    category: 'Wellness',
    categoryColor: '#0891B2',
    categoryBg: '#CFFAFE',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    location: 'Void Deck, Blk 445',
    address: 'Blk 445 Ang Mo Kio Ave 10, S560445',
    description: 'Weekly Tai Chi sessions for seniors conducted in Mandarin by a certified instructor. Improve balance, reduce stress, and meet fellow residents. Wear comfortable clothing and flat shoes. All senior residents welcome.',
    organizer: 'Active Ageing SG',
    organizerRating: 4.9,
    organizerReviews: 201,
    organizerImage: 'https://images.unsplash.com/photo-1690254995096-6e3cc6263e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100',
    price: 'Free',
    going: 40,
    hosting: 1,
    recommended: false,
  },
];

const INTEREST_GROUPS = [
  {
    id: 1, name: 'Morning Runners', interest: 'Running', members: 14,
    nextActivity: 'Run this Sat 7AM', gradient: 'linear-gradient(135deg, #FF6B47 0%, #FF9068 100%)', icon: 'Activity',
    categoryColor: '#FF6B47', categoryBg: '#FFF0EC',
    meetup: 'Saturday 7 AM · Bishan-AMK Park Pavilion',
    plan: 'Bring water and comfortable shoes',
    goal: 'Hit 5K in under 30 minutes together',
    chat: [
      { id: 1, sender: 'Alex L.', initials: 'AL', color: '#FF6B47', text: 'See everyone Saturday! 🏃', time: '8:42 AM', mine: false },
      { id: 2, sender: 'You', initials: 'Y', color: '#7C3AED', text: "I'll be there! Starting from the pavilion right?", time: '8:45 AM', mine: true },
      { id: 3, sender: 'Ben T.', initials: 'BT', color: '#059669', text: 'Yes, meet at 6:50 AM near the entrance 👍', time: '8:47 AM', mine: false },
      { id: 4, sender: 'Clara S.', initials: 'CS', color: '#D97706', text: 'Will there be water stations?', time: '9:01 AM', mine: false },
      { id: 5, sender: 'Alex L.', initials: 'AL', color: '#FF6B47', text: 'Yes! Stations at every 1km mark 💧', time: '9:03 AM', mine: false },
    ],
  },
  {
    id: 2, name: 'Backyard Gardeners', interest: 'Gardening', members: 9,
    nextActivity: 'Garden session Sat 8AM', gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', icon: 'Leaf',
    categoryColor: '#059669', categoryBg: '#D1FAE5',
    meetup: 'Saturday 8 AM · Rooftop Garden, Blk 450',
    plan: 'Bring gloves — we are pruning herbs this week',
    goal: 'Grow enough vegetables to share with neighbours',
    chat: [
      { id: 1, sender: 'Diana M.', initials: 'DM', color: '#059669', text: 'The tomatoes are looking great this week! 🍅', time: '7:10 AM', mine: false },
      { id: 2, sender: 'You', initials: 'Y', color: '#7C3AED', text: 'Awesome! Should I bring extra compost?', time: '7:15 AM', mine: true },
      { id: 3, sender: 'Diana M.', initials: 'DM', color: '#059669', text: 'That would be great, yes please!', time: '7:18 AM', mine: false },
    ],
  },
  {
    id: 3, name: 'Board Game Sundays', interest: 'Board Games', members: 11,
    nextActivity: 'Games this Sun 2PM', gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', icon: 'Dice5',
    categoryColor: '#7C3AED', categoryBg: '#EDE9FE',
    meetup: 'Sunday 2 PM · RC Multi-Purpose Hall, Blk 447',
    plan: 'Bring snacks — we have Catan and Codenames ready',
    goal: 'Try 3 new games this month as a group',
    chat: [
      { id: 1, sender: 'Eli N.', initials: 'EN', color: '#7C3AED', text: "Anyone up for Ticket to Ride this Sunday? 🚂", time: '3:20 PM', mine: false },
      { id: 2, sender: 'You', initials: 'Y', color: '#FF6B47', text: "I'm in! Haven't played that one yet.", time: '3:25 PM', mine: true },
      { id: 3, sender: 'Fiona R.', initials: 'FR', color: '#DB2777', text: "Me too! See you all at 2 PM 🎲", time: '3:30 PM', mine: false },
    ],
  },
];

// Going breakdown data
const FAMILY_STATUS_BREAKDOWN = [
  { label: 'Living alone',                        count: 8,  color: '#FF6B47' },
  { label: 'Couple (no children)',                count: 5,  color: '#7C3AED' },
  { label: 'Family with children',               count: 6,  color: '#D97706' },
  { label: 'Living with parents',                count: 3,  color: '#0891B2' },
  { label: 'Shared housing',                     count: 2,  color: '#059669' },
  { label: 'Multigenerational household',        count: 7,  color: '#DB2777' },
];

const LANGUAGE_BREAKDOWN = [
  { label: 'English',     count: 14, color: '#2563EB' },
  { label: 'Mandarin',   count: 8,  color: '#D97706' },
  { label: 'Malay',      count: 4,  color: '#059669' },
  { label: 'Tamil',      count: 2,  color: '#DB2777' },
  { label: 'Multilingual', count: 3, color: '#7C3AED' },
];

const NEIGHBOURS_GOING = [
  { id: 1, initials: 'AL', name: 'Alex Lim',   color: '#FF6B47', unit: 'Blk 445 #12-34', status: 'Single',              distance: '0.1 km', interests: ['Fitness & Sports', 'Cooking & Baking'],               languages: ['English', 'Chinese'] },
  { id: 2, initials: 'BT', name: 'Ben Tan',    color: '#7C3AED', unit: 'Blk 447 #08-12', status: 'Couple',              distance: '0.2 km', interests: ['Gaming', 'Technology & Digital Skills'],               languages: ['English', 'Chinese'] },
  { id: 3, initials: 'CS', name: 'Clara Soh',  color: '#D97706', unit: 'Blk 448 #03-22', status: 'Living with kids',    distance: '0.3 km', interests: ['Cooking & Baking', 'Gardening & Plants'],              languages: ['English', 'Malay'] },
  { id: 4, initials: 'DM', name: 'Diana Mak',  color: '#059669', unit: 'Blk 445 #15-01', status: 'Senior (60+)',        distance: '0.4 km', interests: ['Gardening & Plants', 'Yoga & Mindfulness'],            languages: ['English', 'Chinese'] },
  { id: 5, initials: 'EN', name: 'Eli Ng',     color: '#0891B2', unit: 'Blk 449 #07-05', status: 'Single',              distance: '0.5 km', interests: ['Community Volunteering', 'Arts & Crafts'],             languages: ['English'] },
  { id: 6, initials: 'FR', name: 'Fiona Raj',  color: '#DB2777', unit: 'Blk 446 #11-18', status: 'Living with parents', distance: '0.6 km', interests: ['Music & Performing Arts', 'Dance'],                    languages: ['English', 'Tamil'] },
  { id: 7, initials: 'GK', name: 'Gary Koh',   color: '#EA580C', unit: 'Blk 450 #04-09', status: 'Couple',              distance: '0.8 km', interests: ['DIY & Home Improvement', 'Technology & Digital Skills'], languages: ['English', 'Chinese'] },
  { id: 8, initials: 'HL', name: 'Hannah Lee', color: '#475569', unit: 'Blk 445 #09-33', status: 'Senior (60+)',        distance: '1.0 km', interests: ['Photography', 'Outdoor Activities'],                   languages: ['English', 'Chinese'] },
];

// ---- Notifications mock data ----
const NOTIFICATIONS = [
  { id: 1, type: 'event', icon: 'Activity', title: 'Morning Run tomorrow at 7 AM', body: 'Your registered event starts in less than 24 hours. Meet at Bishan-AMK Park Pavilion.', time: '10 min ago', read: false, route: { to: 'event', eventId: 1 } },
  { id: 2, type: 'group', icon: 'Users', title: 'New message in Backyard Gardeners', body: 'Diana M.: "The tomatoes are looking great this week! 🍅"', time: '32 min ago', read: false, route: { to: 'group', groupId: 2 } },
  { id: 3, type: 'marketplace', icon: 'ShoppingBag', title: 'Neighbour replied to your request', body: 'Someone offered to help with your plant watering request. Tap to chat.', time: '1 hr ago', read: false, route: { to: 'messages', convId: 5 } },
  { id: 4, type: 'event', icon: 'Activity', title: 'New event near you', body: 'Peranakan Cooking Workshop on Sun 13 Apr — 12 neighbours are going!', time: '3 hrs ago', read: true, route: { to: 'event', eventId: 2 } },
  { id: 5, type: 'group', icon: 'Users', title: 'Board Game Sundays this Sunday', body: 'Eli N. posted: "Anyone up for Ticket to Ride this Sunday? 🚂"', time: 'Yesterday', read: true, route: { to: 'group', groupId: 3 } },
  { id: 6, type: 'marketplace', icon: 'ShoppingBag', title: 'Item you saved is still available', body: 'IKEA Billy Bookshelf from Blk 445 has not been claimed yet.', time: '2 days ago', read: true, route: { to: 'marketplace' } },
];

const NOTIF_COLORS: Record<string, { bg: string; text: string }> = {
  event:       { bg: '#FFF0EC', text: '#FF6B47' },
  group:       { bg: '#D1FAE5', text: '#059669' },
  marketplace: { bg: '#DBEAFE', text: '#2563EB' },
  community:   { bg: '#FEF3C7', text: '#D97706' },
};

// Notification icon map (using imported Lucide icons where available, fallback for ShoppingBag inline)
const NOTIF_ICON_MAP: Record<string, React.FC<any>> = {
  Activity,
  Users,
  ShoppingBag: ({ size, color, strokeWidth }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
};

// ---- Main Component ----
export function EventsPage({ onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat, onOpenMarketplace, savedEvents, onOpenNeighbours, onOpenRequest, onOpenNeighbourProfile, onSayHello, joinedGroups = [], onOpenExploreEvents, registeredEventIds = [], onToggleRegister }: EventsPageProps) {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const registeredEvents = registeredEventIds;
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNeighbour, setSelectedNeighbour] = useState<typeof MOCK_NEIGHBOURS[0] | null>(null);
  const [readNotifs, setReadNotifs] = useState<number[]>(NOTIFICATIONS.filter(n => n.read).map(n => n.id));

  const unreadCount = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id)).length;
  const markAllRead = () => setReadNotifs(NOTIFICATIONS.map(n => n.id));

  const current = navStack[navStack.length - 1];
  const goTo = (screen: EventsScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  const toggleRegister = (id: number) => {
    const isRegistered = registeredEvents.includes(id);
    toast.success(isRegistered ? 'Registration cancelled' : 'Registered! See you there 🎉');
    onToggleRegister?.(id);
  };

  // ---- Detail screen ----
  if (current.screen === 'detail') {
    const ev = current.params?.event;
    if (!ev) return null;
    const isRegistered = registeredEvents.includes(ev.id);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero */}
          <div style={{ height: '260px', position: 'relative' }}>
            <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%)' }} />
            <button onClick={goBack} style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <div style={{ position: 'absolute', top: '52px', right: '16px', display: 'flex', gap: '8px' }}>
              <button onClick={() => toast.success('Shared!')} style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Share2 size={17} color={TEXT} />
              </button>
              <button onClick={() => toast.success('Saved!')} style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Bookmark size={17} color={TEXT} />
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 20px 32px' }}>
            {/* Category */}
            <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '8px', background: ev.categoryBg, marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: ev.categoryColor }}>{ev.category}</span>
            </div>

            {/* Title */}
            <div style={{ fontSize: '24px', fontWeight: 700, color: TEXT, marginBottom: '18px', lineHeight: '1.3', letterSpacing: '-0.3px' }}>{ev.title}</div>

            {/* Date row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px', padding: '14px 16px', background: CARD, borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={16} color={PRIMARY} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{ev.date}</div>
                <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500, marginTop: '2px' }}>{ev.time} GMT+8</div>
              </div>
            </div>

            {/* Location row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px', padding: '14px 16px', background: CARD, borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
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
              <div style={{ flex: 1, background: CARD, borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT2, marginBottom: '10px' }}>Hosting ({ev.hosting})</div>
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
                style={{ flex: 1, background: CARD, borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)', cursor: 'pointer' }}
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
            <div style={{ background: CARD, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
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
            <div style={{ background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
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
            onClick={() => toggleRegister(ev.id)}
            style={{
              flex: 1, padding: '15px', borderRadius: '14px',
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
    const ev = current.params?.event;
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
          {/* Household Type horizontal bar chart */}
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

  // ---- Group Detail screen ----
  if (current.screen === 'group-detail') {
    return <GroupDetailScreen group={current.params?.group} onBack={goBack} />;
  }

  // ---- Feed screen ----
  const signedUpEvents = EVENTS.filter(e => registeredEvents.includes(e.id));

  return (
    <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 14px', boxShadow: '0 1px 0 rgba(60,60,67,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onOpenProfile}
            style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden', flexShrink: 0 }}
          >
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=faces&fit=crop&w=200&h=200&q=80" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
          <div style={{ flex: 1, padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <MapPinIcon size={11} color={TEXT2} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT2 }}>Bishan-AMK Estate</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>
              Hi, Rachel
            </div>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            style={{ width: '42px', height: '42px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}
          >
            <Bell size={20} color={TEXT} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <div style={{ position: 'absolute', top: '6px', right: '6px', minWidth: '16px', height: '16px', borderRadius: '8px', background: '#EF4444', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{unreadCount}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 100px' }}>

        {/* My Events */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Events</span>
              {signedUpEvents.length > 0 && (
                <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: '#FFF0EC', color: PRIMARY }}>{signedUpEvents.length}</span>
              )}
            </div>
            <button
              onClick={() => onOpenExploreEvents?.()}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>Find more events</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>›</span>
            </button>
          </div>

          <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px', paddingBottom: '4px' }}>
            {signedUpEvents.map(ev => (
              <motion.div
                key={ev.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => goTo('detail', { event: ev })}
                style={{
                  flexShrink: 0, width: '240px', background: CARD, borderRadius: '16px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)', cursor: 'pointer', overflow: 'hidden',
                }}
              >
                {/* Top: full-width image with category tag */}
                <div style={{ width: '100%', height: '130px', position: 'relative' }}>
                  <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '8px', left: '8px', padding: '3px 8px', borderRadius: '8px', background: ev.categoryBg, color: ev.categoryColor, fontSize: '10px', fontWeight: 800 }}>
                    {ev.category}
                  </div>
                </div>
                {/* Bottom: content */}
                <div style={{ padding: '12px' }}>
                  {/* Registered tag */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#DCFCE7', borderRadius: '8px', padding: '3px 8px', marginBottom: '8px' }}>
                    <Check size={9} color="#16A34A" strokeWidth={2.5} />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#16A34A' }}>Registered</span>
                  </div>
                  {/* Organiser */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <img src={ev.organizerImage} alt={ev.organizer} style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{ev.organizer}</span>
                  </div>
                  {/* Title */}
                  <div style={{ fontSize: '13px', fontWeight: 800, color: TEXT, lineHeight: '1.3', marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{ev.title}</div>
                  {/* Date & time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <Calendar size={11} color={MUTED} />
                    <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{ev.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} color={MUTED} />
                    <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{ev.time}</span>
                  </div>
                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={11} color={MUTED} />
                    <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{ev.location.split(',')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Find-an-event CTA — always shown after registered events */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => onOpenExploreEvents?.()}
              style={{
                flexShrink: 0, width: '148px', minHeight: '167px', borderRadius: '16px',
                background: '#F7F5FF',
                border: '1.5px dashed #A989EE',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '10px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Soft background glow */}
              <div style={{
                position: 'absolute', width: '90px', height: '90px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)',
                animation: 'pulseRing 2.4s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
              {/* 3D floating icon */}
              <div style={{
                perspective: '300px',
                animation: 'floatGroups 3s ease-in-out infinite',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 40%, #e0e0e0 100%)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06), 0 -2px 6px rgba(255,255,255,0.9), inset 3px 3px 8px rgba(255,255,255,1), inset -2px -3px 6px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: '8px', left: '10px',
                    width: '18px', height: '10px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    transform: 'rotate(-30deg)',
                    filter: 'blur(3px)',
                    pointerEvents: 'none',
                  }} />
                  <Calendar size={22} color="#A989EE" strokeWidth={2} style={{ filter: 'drop-shadow(0px 2px 4px rgba(169,137,238,0.35))' }} />
                  <div style={{
                    position: 'absolute', bottom: '-4px', right: '-4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C4A8F5 0%, #A989EE 100%)',
                    boxShadow: '0 2px 6px rgba(169,137,238,0.5), 0 0 0 2px #F7F5FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Plus size={11} color="white" strokeWidth={3} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#A989EE', textAlign: 'center', lineHeight: '1.3', letterSpacing: '0.1px' }}>
                Find an event
              </span>
            </motion.div>
          </div>
        </div>

        {/* My Groups */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Groups</span>
            <button
              onClick={onOpenGroups}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>Find more groups</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>›</span>
            </button>
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px' }}>
            {joinedGroups.map(group => {
              const gradient = COLOR_GRADIENT[group.categoryColor] || `linear-gradient(135deg, ${group.categoryColor} 0%, ${group.categoryColor}AA 100%)`;
              const IconComp = EMOJI_ICON_MAP[group.emoji] || Users;
              return (
                <motion.div
                  key={group.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenGroupChat(group.convId)}
                  style={{ flexShrink: 0, width: '148px', borderRadius: '16px', background: gradient, padding: '16px 14px', cursor: 'pointer' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <IconComp size={20} color="white" strokeWidth={1.8} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '4px', lineHeight: '1.2' }}>{group.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, marginBottom: '6px' }}>{group.members} members</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '3px 8px' }}>
                    {group.meetFrequency}
                  </div>
                </motion.div>
              );
            })}
            {/* Find-a-group CTA — always shown after joined groups */}
            <><style>{`
              @keyframes floatGroups {
                0%, 100% { transform: translateY(0px) rotateX(0deg); }
                50% { transform: translateY(-6px) rotateX(8deg); }
              }
              @keyframes pulseRing {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.18); opacity: 0.15; }
              }
              @keyframes shimmerOrb {
                0% { background-position: -80px 0; }
                100% { background-position: 80px 0; }
              }
              @keyframes dotBounce1 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
              @keyframes dotBounce2 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
              @keyframes dotBounce3 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
            `}</style>
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={onOpenGroups}
              style={{
                flexShrink: 0, width: '148px', minHeight: '167px', alignSelf: 'stretch', borderRadius: '16px',
                background: '#F4FFF7',
                border: '1.5px dashed #4CA154',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '10px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Soft background glow */}
              <div style={{
                position: 'absolute', width: '90px', height: '90px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,0,0,0.06) 0%, transparent 70%)',
                animation: 'pulseRing 2.4s ease-in-out infinite',
                pointerEvents: 'none',
              }} />

              {/* 3D floating icon group */}
              <div style={{
                perspective: '300px',
                animation: 'floatGroups 3s ease-in-out infinite',
              }}>
                {/* Orb container */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 40%, #e0e0e0 100%)',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06), 0 -2px 6px rgba(255,255,255,0.9), inset 3px 3px 8px rgba(255,255,255,1), inset -2px -3px 6px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {/* Highlight shine */}
                  <div style={{
                    position: 'absolute', top: '8px', left: '10px',
                    width: '18px', height: '10px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    transform: 'rotate(-30deg)',
                    filter: 'blur(3px)',
                    pointerEvents: 'none',
                  }} />
                  <Users size={22} color="#4CA154" strokeWidth={2} style={{ filter: 'drop-shadow(0px 2px 4px rgba(76,161,84,0.35))' }} />
                  {/* Plus badge */}
                  <div style={{
                    position: 'absolute', bottom: '-4px', right: '-4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6FCF78 0%, #4CA154 100%)',
                    boxShadow: '0 2px 6px rgba(76,161,84,0.5), 0 0 0 2px #F4FFF7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Plus size={11} color="white" strokeWidth={3} />
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '12px', fontWeight: 700, color: '#4CA154', textAlign: 'center', lineHeight: '1.3', letterSpacing: '0.1px' }}>
                Find a group
              </span>
            </motion.div></>
          </div>
        </div>

        {/* Latest Requests */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Community Latest Requests</span>
            <button
              onClick={() => onOpenRequest && onOpenRequest(0)}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>See all</span>
              <ChevronRight size={14} color={PRIMARY} />
            </button>
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px', paddingBottom: '6px' }}>
            {REQUESTS_DATA.slice(0, 5).map(r => {
              const typeColors: Record<string, { bg: string; text: string }> = {
                'Borrow': { bg: '#EDE9FE', text: '#7C3AED' },
                'Free Request': { bg: '#DCFCE7', text: '#16A34A' },
                'Paid Request': { bg: '#FEF3C7', text: '#D97706' },
              };
              const tc = typeColors[r.type] || { bg: BG, text: TEXT2 };
              return (
                <motion.div
                  key={r.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenRequest ? onOpenRequest(r.id) : undefined}
                  style={{
                    flexShrink: 0, width: '280px', background: CARD, borderRadius: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    padding: '10px', gap: '10px',
                  }}
                >
                  {/* Left image — square 1:1 with badge overlay */}
                  <div style={{ width: '90px', height: '90px', flexShrink: 0, borderRadius: '10px', background: BG, overflow: 'hidden', position: 'relative' }}>
                    {r.image
                      ? <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={28} color={MUTED} /></div>
                    }
                    <span style={{ position: 'absolute', top: '6px', left: '6px', padding: '2px 6px', borderRadius: '5px', fontSize: '9px', fontWeight: 700, background: tc.bg, color: tc.text, backdropFilter: 'blur(4px)' }}>{r.type}</span>
                  </div>
                  {/* Right content */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500, marginBottom: '3px' }}>{r.distance}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, lineHeight: '1.3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, marginBottom: '6px' }}>{r.title}</div>
                    </div>
                    {/* Poster row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: r.poster.color, flexShrink: 0, overflow: 'hidden' }}>
                        {r.poster.avatarUrl
                          ? <img src={r.poster.avatarUrl} alt={r.poster.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '7px', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{r.poster.initials}</span>
                        }
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: TEXT2 }}>{r.poster.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '10px', color: MUTED }}>{r.postedAgo}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Connect with Neighbours */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Connect with Neighbours</span>
            <button
              onClick={onOpenNeighbours}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>See all</span>
              <ChevronRight size={14} color={PRIMARY} />
            </button>
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: '14px', overflowX: 'auto', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px', paddingBottom: '12px' }}>
            {MOCK_NEIGHBOURS.slice(0, 6).map(neighbour => (
              <motion.div
                key={neighbour.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenNeighbourProfile?.({ name: neighbour.name, avatar: neighbour.avatar, avatarUrl: neighbour.avatarUrl, color: neighbour.color, block: neighbour.unit, distance: neighbour.distance, interests: neighbour.interests, languages: neighbour.languages })}
                style={{
                  flexShrink: 0, width: '220px', background: CARD,
                  borderRadius: '18px', padding: '14px 14px 12px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                }}
              >
                {/* Two-column: avatar left, content right */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Avatar */}
                  <div
                    style={{ width: '46px', height: '46px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: neighbour.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {neighbour.avatarUrl
                      ? <img src={neighbour.avatarUrl} alt={neighbour.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{neighbour.avatar}</span>
                    }
                  </div>

                  {/* Right column */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name */}
                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: TEXT }}>{neighbour.name}</span>
                    </div>
                    {/* Interests as pipe text */}
                    <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500, marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {neighbour.interests.join(' | ')}
                    </div>
                    {/* Chat button */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={e => { e.stopPropagation(); onSayHello ? onSayHello(neighbour) : toast.success(`Message sent to ${neighbour.name}!`); }}
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
                        <MessageCircle size={14} color="#FF4B1F" strokeWidth={2.2} fill="rgba(255,107,71,0.22)" />
                      </span>
                      Chat
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ---- Notifications Bottom Sheet ---- */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotifications(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '20px 20px 0 0', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
            >
              {/* Handle */}
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(60,60,67,0.15)', margin: '16px auto 0' }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Notifications</span>
                  {unreadCount > 0 && (
                    <div style={{ minWidth: '20px', height: '20px', borderRadius: '10px', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'white' }}>{unreadCount}</span>
                    </div>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: PRIMARY, fontFamily: "'Nunito', sans-serif", padding: '4px 0' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
                {NOTIFICATIONS.map((notif, i) => {
                  const isRead = readNotifs.includes(notif.id);
                  const colors = NOTIF_COLORS[notif.type] || { bg: BG, text: TEXT2 };
                  const NotifIcon = NOTIF_ICON_MAP[notif.icon] || Activity;
                  return (
                    <motion.div
                      key={notif.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Mark as read
                        setReadNotifs(p => p.includes(notif.id) ? p : [...p, notif.id]);
                        setShowNotifications(false);
                        // Navigate to relevant screen
                        const r = notif.route;
                        if (r.to === 'event') {
                          const ev = EVENTS.find(e => e.id === (r as any).eventId);
                          if (ev) goTo('detail', { event: ev });
                        } else if (r.to === 'group') {
                          onOpenGroupChat((r as any).groupId);
                        } else if (r.to === 'messages') {
                          onOpenGroupChat((r as any).convId);
                        } else if (r.to === 'marketplace') {
                          onOpenMarketplace();
                        }
                      }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '14px',
                        padding: '14px 0',
                        borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${BORDER}` : 'none',
                        cursor: 'pointer',
                        opacity: isRead ? 0.65 : 1,
                      }}
                    >
                      {/* Icon */}
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <NotifIcon size={20} color={colors.text} strokeWidth={1.8} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontSize: '13px', fontWeight: isRead ? 600 : 800, color: TEXT, lineHeight: '1.3' }}>{notif.title}</span>
                          {!isRead && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', flexShrink: 0, marginTop: '4px' }} />
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: TEXT2, lineHeight: '1.5', marginBottom: '5px' }}>{notif.body}</div>
                        <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{notif.time}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Neighbour Profile Bottom Sheet ---- */}
      <AnimatePresence>
        {selectedNeighbour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNeighbour(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '20px 20px 0 0', padding: '24px 20px 44px' }}
            >
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(60,60,67,0.15)', margin: '0 auto 24px' }} />
              {/* Avatar + name */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: selectedNeighbour.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{selectedNeighbour.avatar}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>{selectedNeighbour.name}</div>
                <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>{selectedNeighbour.distance} away</div>
              </div>
              {/* Interests */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Interests</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedNeighbour.interests.map(interest => (
                    <span key={interest} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#FFF0EC', color: PRIMARY }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              {/* Action button */}
              <button
                onClick={() => { toast.success(`Message sent to ${selectedNeighbour.name}!`); setSelectedNeighbour(null); }}
                style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: "'Nunito', sans-serif" }}
              >
                Say Hello
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ---- Group Detail Screen (separate component to follow Rules of Hooks) ----
function GroupDetailScreen({ group, onBack }: { group: any; onBack: () => void }) {
  const [groupTab, setGroupTab] = useState<'chat' | 'activity'>('activity');
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<any[]>(group?.chat ?? []);

  if (!group) return null;

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages(p => [...p, { id: Date.now(), sender: 'You', initials: 'Y', color: PRIMARY, text: chatMsg.trim(), time: 'now', mine: true }]);
    setChatMsg('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 0', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '17px', fontWeight: 800, color: TEXT }}>{group.name}</span>
              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: group.categoryBg, color: group.categoryColor }}>{group.interest}</span>
            </div>
            <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{group.members} members</span>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {(['chat', 'activity'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setGroupTab(tab)}
              style={{
                flex: 1, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '13px', fontWeight: 700,
                color: groupTab === tab ? PRIMARY : MUTED,
                borderBottom: groupTab === tab ? `2px solid ${PRIMARY}` : '2px solid transparent',
                transition: 'color 0.2s',
              }}
            >
              {tab === 'chat' ? 'Chat' : 'Activity Board'}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Board */}
      {groupTab === 'activity' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>Upcoming Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {[
              { emoji: '📍', title: 'Next Meetup', detail: group.meetup },
              { emoji: '📋', title: 'Upcoming Plan', detail: group.plan },
              { emoji: '🎯', title: 'Group Goal', detail: group.goal },
            ].map(item => (
              <div key={item.title} style={{ background: CARD, borderRadius: '18px', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '22px', lineHeight: 1, marginTop: '1px' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 500, lineHeight: '1.5' }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', background: '#FFF7F5', borderRadius: '16px', border: '1px solid #FFD5CC' }}>
            <Users size={16} color={PRIMARY} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '13px', color: PRIMARY, fontWeight: 500, lineHeight: '1.5' }}>
              This group is discoverable by verified estate residents with the "{group.interest}" interest tag
            </span>
          </div>
        </div>
      )}

      {/* Chat */}
      {groupTab === 'chat' && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg: any) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.mine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                  {!msg.mine && (
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'white' }}>{msg.initials}</span>
                    </div>
                  )}
                  <div style={{ maxWidth: '70%' }}>
                    {!msg.mine && <div style={{ fontSize: '10px', fontWeight: 600, color: MUTED, marginBottom: '3px', paddingLeft: '4px' }}>{msg.sender}</div>}
                    <div style={{ padding: '10px 14px', borderRadius: msg.mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.mine ? PRIMARY : CARD, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                      <span style={{ fontSize: '13px', color: msg.mine ? 'white' : TEXT, lineHeight: '1.5' }}>{msg.text}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: MUTED, marginTop: '3px', textAlign: msg.mine ? 'right' : 'left', paddingLeft: '4px', paddingRight: '4px' }}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Chat input */}
          <div style={{ padding: '10px 16px 28px', background: CARD, borderTop: `1px solid ${BORDER}`, display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Message the group..."
              style={{ flex: 1, background: BG, border: 'none', outline: 'none', borderRadius: '22px', padding: '11px 16px', fontSize: '14px', color: TEXT, fontFamily: 'inherit' }}
            />
            <button
              onClick={sendMessage}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: chatMsg.trim() ? PRIMARY : BORDER, border: 'none', cursor: chatMsg.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
