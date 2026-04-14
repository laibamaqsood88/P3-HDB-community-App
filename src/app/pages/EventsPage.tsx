import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChevronRight, Bookmark, Check, ChevronLeft, MapPin, Calendar, Clock, Star, Users, Share2, X } from 'lucide-react';
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
type EventsScreen = 'feed' | 'detail' | 'going' | 'group-detail';
type EventsTab = 'signedup' | 'upcoming' | 'recommended';
interface NavFrame { screen: EventsScreen; params?: any; }

interface EventsPageProps {
  onOpenProfile: () => void;
  onOpenEvent: (eventId: number) => void;
  onOpenGroups: () => void;
  onOpenGroupChat: (groupId: number) => void;
  savedEvents: number[];
}

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
    nextActivity: 'Run this Sat 7AM', gradient: 'linear-gradient(135deg, #FF6B47 0%, #FF9068 100%)', emoji: '🏃',
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
    nextActivity: 'Garden session Sat 8AM', gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)', emoji: '🌱',
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
    nextActivity: 'Games this Sun 2PM', gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', emoji: '🎲',
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
  { label: 'Single',             count: 8,  color: '#FF6B47' },
  { label: 'Couple',             count: 5,  color: '#7C3AED' },
  { label: 'Living with kids',   count: 6,  color: '#D97706' },
  { label: 'Living with parents',count: 3,  color: '#0891B2' },
  { label: 'Multigenerational',  count: 2,  color: '#059669' },
  { label: 'Senior (60+)',       count: 7,  color: '#DB2777' },
];

const NEIGHBOURS_GOING = [
  { id: 1, initials: 'AL', color: '#FF6B47', unit: 'Blk 445 #12-34', status: 'Single' },
  { id: 2, initials: 'BT', color: '#7C3AED', unit: 'Blk 447 #08-12', status: 'Couple' },
  { id: 3, initials: 'CS', color: '#D97706', unit: 'Blk 448 #03-22', status: 'Living with kids' },
  { id: 4, initials: 'DM', color: '#059669', unit: 'Blk 445 #15-01', status: 'Senior (60+)' },
  { id: 5, initials: 'EN', color: '#0891B2', unit: 'Blk 449 #07-05', status: 'Single' },
  { id: 6, initials: 'FR', color: '#DB2777', unit: 'Blk 446 #11-18', status: 'Living with parents' },
  { id: 7, initials: 'GK', color: '#EA580C', unit: 'Blk 450 #04-09', status: 'Couple' },
  { id: 8, initials: 'HL', color: '#475569', unit: 'Blk 445 #09-33', status: 'Senior (60+)' },
];

// ---- Notifications mock data ----
const NOTIFICATIONS = [
  { id: 1, type: 'event', emoji: '🏃', title: 'Morning Run tomorrow at 7 AM', body: 'Your registered event starts in less than 24 hours. Meet at Bishan-AMK Park Pavilion.', time: '10 min ago', read: false },
  { id: 2, type: 'group', emoji: '🌱', title: 'New message in Backyard Gardeners', body: 'Diana M.: "The tomatoes are looking great this week! 🍅"', time: '32 min ago', read: false },
  { id: 3, type: 'marketplace', emoji: '🪴', title: 'Neighbour replied to your request', body: 'Someone offered to help with your plant watering request. Tap to chat.', time: '1 hr ago', read: false },
  { id: 4, type: 'event', emoji: '📅', title: 'New event near you', body: 'Peranakan Cooking Workshop on Sun 13 Apr — 12 neighbours are going!', time: '3 hrs ago', read: true },
  { id: 5, type: 'community', emoji: '📢', title: 'Estate notice from RC', body: 'Lift maintenance at Blk 445–449 on 16 Apr (Wed), 9 AM–12 PM. Please use Blk 450 lift.', time: 'Yesterday', read: true },
  { id: 6, type: 'group', emoji: '🎲', title: 'Board Game Sundays this Sunday', body: 'Eli N. posted: "Anyone up for Ticket to Ride this Sunday? 🚂"', time: 'Yesterday', read: true },
  { id: 7, type: 'marketplace', emoji: '📚', title: 'Item you saved is still available', body: 'IKEA Billy Bookshelf from Blk 445 has not been claimed yet.', time: '2 days ago', read: true },
];

const NOTIF_COLORS: Record<string, { bg: string; text: string }> = {
  event:       { bg: '#FFF0EC', text: '#FF6B47' },
  group:       { bg: '#D1FAE5', text: '#059669' },
  marketplace: { bg: '#DBEAFE', text: '#2563EB' },
  community:   { bg: '#FEF3C7', text: '#D97706' },
};

// ---- Marketplace data (mirrored from HelpSharePage for home preview) ----
const HOME_LATEST_REQUEST = {
  id: 1, category: 'Plant Care', emoji: '🪴',
  description: "Need someone to water my 4 potted plants while I'm away travelling. Easy — just water once every 2 days.",
  timeframe: 'Apr 15–22', expiresIn: '2 days', poster: 'Resident A', trust: 3,
};

const HOME_MARKETPLACE_PICKS = [
  { id: 101, type: 'item' as const, emoji: '📚', name: 'IKEA Billy Bookshelf', sub: 'Good condition', price: 'Free', category: 'Furniture',
    description: 'White IKEA Billy bookshelf, 80cm wide. Small scratch on the back panel but otherwise in good condition. Self-collect from Level 5, available on weekends.', location: 'Blk 445', method: 'Self-collect', conditionBg: '#DBEAFE', conditionText: '#2563EB' },
  { id: 201, type: 'service' as const, emoji: '🐕', name: 'Dog Walking', sub: 'Mon, Wed, Fri 7–9 AM', price: 'Free', category: 'Pets',
    description: 'Happy to walk your dog in the estate during weekday mornings. Have experience with medium-sized breeds.', avatarColor: '#F97316', pastExchanges: 2, responseRate: '90%', conditionBg: '#D1FAE5', conditionText: '#059669' },
  { id: 102, type: 'item' as const, emoji: '🍚', name: 'Sharp Rice Cooker', sub: 'Like New', price: '$20', category: 'Kitchen',
    description: 'Sharp rice cooker, barely used. Moving to a larger unit and already have a bigger one. Comes with measuring cup and steam tray.', location: 'Blk 448', method: 'Self-collect or doorstep', conditionBg: '#DCFCE7', conditionText: '#16A34A' },
  { id: 203, type: 'service' as const, emoji: '📐', name: 'Math Tutoring', sub: 'Weekday evenings', price: 'Free', category: 'Education',
    description: 'Retired primary school teacher offering free maths help for P3–P6 students.', avatarColor: '#3B82F6', pastExchanges: 8, responseRate: '100%', conditionBg: '#EDE9FE', conditionText: '#7C3AED' },
];

// ---- Main Component ----
export function EventsPage({ onOpenProfile, onOpenEvent, onOpenGroups, onOpenGroupChat, savedEvents }: EventsPageProps) {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const [eventsTab, setEventsTab] = useState<EventsTab>('upcoming');
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([1]); // pre-register event 1
  const [selectedRequest, setSelectedRequest] = useState<typeof HOME_LATEST_REQUEST | null>(null);
  const [selectedMarketItem, setSelectedMarketItem] = useState<typeof HOME_MARKETPLACE_PICKS[0] | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifs, setReadNotifs] = useState<number[]>(NOTIFICATIONS.filter(n => n.read).map(n => n.id));

  const unreadCount = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id)).length;
  const markAllRead = () => setReadNotifs(NOTIFICATIONS.map(n => n.id));

  const current = navStack[navStack.length - 1];
  const goTo = (screen: EventsScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  const toggleRegister = (id: number) => {
    setRegisteredEvents(p => {
      const isRegistered = p.includes(id);
      toast.success(isRegistered ? 'Registration cancelled' : 'Registered! See you there 🎉');
      return isRegistered ? p.filter(x => x !== id) : [...p, id];
    });
  };

  // ---- Detail screen ----
  if (current.screen === 'detail') {
    const ev = current.params?.event;
    if (!ev) return null;
    const isRegistered = registeredEvents.includes(ev.id);

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero */}
          <div style={{ height: '260px', position: 'relative' }}>
            <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%)' }} />
            <button onClick={goBack} style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <div style={{ position: 'absolute', top: '52px', right: '16px', display: 'flex', gap: '8px' }}>
              <button onClick={() => toast.success('Shared!')} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Share2 size={17} color={TEXT} />
              </button>
              <button onClick={() => toast.success('Saved!')} style={{ width: '38px', height: '38px', borderRadius: '14px', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Bookmark size={17} color={TEXT} />
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 20px 32px' }}>
            {/* Category */}
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
              fontFamily: "'DM Sans', sans-serif",
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
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ background: CARD, padding: '52px 20px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={goBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: TEXT }}>Who's Going</div>
            <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{ev?.title}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {/* Stacked bar chart section */}
          <div style={{ background: CARD, borderRadius: '22px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>By Household Type</span>
              <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{total} going</span>
            </div>

            {/* Single stacked bar */}
            <div style={{ height: '20px', borderRadius: '10px', overflow: 'hidden', display: 'flex', marginBottom: '20px' }}>
              {FAMILY_STATUS_BREAKDOWN.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / total) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
                  style={{ height: '100%', background: item.color }}
                />
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FAMILY_STATUS_BREAKDOWN.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{item.count}</span>
                    <span style={{ fontSize: '11px', color: MUTED }}>({Math.round((item.count / total) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neighbours attending */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '12px' }}>
              Neighbours Attending
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NEIGHBOURS_GOING.map(n => (
                <motion.div
                  key={n.id}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: CARD, borderRadius: '18px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}
                >
                  {/* Avatar */}
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{n.initials}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '3px' }}>Neighbour {n.initials}</div>
                    <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{n.unit}</div>
                  </div>
                  {/* Status pill */}
                  <div style={{ padding: '4px 10px', borderRadius: '20px', background: BG, flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: TEXT2 }}>{n.status}</span>
                  </div>
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
  const upcomingEvents = EVENTS;
  const recommendedEvents = EVENTS.filter(e => e.recommended);
  const signedUpEvents = EVENTS.filter(e => registeredEvents.includes(e.id));

  const eventsToShow =
    eventsTab === 'signedup' ? signedUpEvents :
    eventsTab === 'recommended' ? recommendedEvents :
    upcomingEvents;

  return (
    <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onOpenProfile}
            style={{ width: '42px', height: '42px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1 }}>Y</span>
          </button>
          <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '3px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT2 }}>📍 Bishan-AMK Estate</span>
              <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: '#D1FAE5', color: '#059669' }}>✓ Verified</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Good morning ☀️</div>
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
      <div style={{ padding: '20px 20px 32px' }}>
        {/* Interest Groups */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Your Interest Groups</span>
            <button
              onClick={onOpenGroups}
              style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: PRIMARY }}>More</span>
              <ChevronRight size={14} color={PRIMARY} />
            </button>
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px' }}>
            {INTEREST_GROUPS.map(group => (
              <motion.div
                key={group.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenGroupChat(group.id)}
                style={{ flexShrink: 0, width: '150px', borderRadius: '20px', background: group.gradient, padding: '16px', cursor: 'pointer' }}
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

        {/* Latest Request */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Latest Request</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT2 }}>from your neighbourhood</span>
          </div>
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedRequest(HOME_LATEST_REQUEST)}
            style={{ background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {HOME_LATEST_REQUEST.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{HOME_LATEST_REQUEST.category}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#D97706', background: '#FEF3C7', borderRadius: '20px', padding: '2px 8px' }}>
                    Expires in {HOME_LATEST_REQUEST.expiresIn}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: TEXT2, lineHeight: '1.5', marginBottom: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {HOME_LATEST_REQUEST.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < HOME_LATEST_REQUEST.trust ? '#22C55E' : BORDER }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>Trust score</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: PRIMARY }}>View request →</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marketplace Picks */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Marketplace Picks</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT2 }}>items & services nearby</span>
          </div>
          <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginLeft: '-20px', paddingLeft: '20px', marginRight: '-20px', paddingRight: '20px', paddingBottom: '4px' }}>
            {HOME_MARKETPLACE_PICKS.map(item => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedMarketItem(item)}
                style={{ flexShrink: 0, width: '148px', background: CARD, borderRadius: '18px', padding: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', cursor: 'pointer' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '10px' }}>
                  {item.emoji}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '4px', lineHeight: '1.25', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, marginBottom: '8px' }}>{item.sub}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: item.price === 'Free' ? '#059669' : TEXT }}>{item.price}</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: item.conditionText, background: item.conditionBg, borderRadius: '20px', padding: '2px 7px' }}>
                    {item.type === 'item' ? 'Item' : 'Service'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Events section */}
        <div>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: TEXT }}>Events</span>
            <span style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{eventsToShow.length} events</span>
          </div>

          {/* 3 Sub-tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            {([
              { key: 'signedup',    label: 'Signed Up',   count: signedUpEvents.length },
              { key: 'upcoming',   label: 'Upcoming',    count: null },
              { key: 'recommended',label: 'Recommended', count: null },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setEventsTab(tab.key)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '22px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: eventsTab === tab.key ? PRIMARY : CARD,
                  color: eventsTab === tab.key ? 'white' : TEXT2,
                  border: eventsTab === tab.key ? 'none' : `1.5px solid ${BORDER}`,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span style={{
                    width: '16px', height: '16px', borderRadius: '50%', fontSize: '9px', fontWeight: 800,
                    background: eventsTab === tab.key ? 'rgba(255,255,255,0.3)' : '#FFF0EC',
                    color: eventsTab === tab.key ? 'white' : PRIMARY,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Event list */}
          {eventsToShow.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: CARD, borderRadius: '22px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📅</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>
                {eventsTab === 'signedup' ? 'No events signed up yet' : 'No events found'}
              </div>
              <div style={{ fontSize: '13px', color: TEXT2 }}>
                {eventsTab === 'signedup' ? 'Tap an event and hit Attend to sign up' : 'Check back soon'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {eventsToShow.map(ev => {
                const isRegistered = registeredEvents.includes(ev.id);
                return (
                  <motion.div
                    key={ev.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goTo('detail', { event: ev })}
                    style={{ background: CARD, borderRadius: '22px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer' }}
                  >
                    {/* Image */}
                    <div style={{ height: '150px', position: 'relative' }}>
                      <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '20px', background: ev.categoryBg, color: ev.categoryColor, fontSize: '11px', fontWeight: 700 }}>
                        {ev.category}
                      </div>
                      {isRegistered && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', borderRadius: '20px', padding: '4px 10px' }}>
                          <Check size={10} color="#16A34A" strokeWidth={2.5} />
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#16A34A' }}>Registered</span>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '8px', lineHeight: '1.3' }}>{ev.title}</div>
                      <div style={{ display: 'flex', gap: '14px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={12} color={MUTED} />
                          <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{ev.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={12} color={MUTED} />
                          <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{ev.time.split('–')[0].trim()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={12} color={MUTED} />
                          <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{ev.location.split(',')[0]}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Users size={12} color={MUTED} />
                          <span style={{ fontSize: '11px', color: PRIMARY, fontWeight: 700 }}>{ev.going + (isRegistered ? 1 : 0)} going</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
              style={{ background: CARD, borderRadius: '28px 28px 0 0', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
            >
              {/* Handle */}
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '16px auto 0' }} />

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
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: PRIMARY, fontFamily: "'DM Sans', sans-serif", padding: '4px 0' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 36px' }}>
                {NOTIFICATIONS.map((notif, i) => {
                  const isRead = readNotifs.includes(notif.id);
                  const colors = NOTIF_COLORS[notif.type] || { bg: BG, text: TEXT2 };
                  return (
                    <motion.div
                      key={notif.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setReadNotifs(p => p.includes(notif.id) ? p : [...p, notif.id])}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '14px',
                        padding: '14px 0',
                        borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${BORDER}` : 'none',
                        cursor: 'pointer',
                        opacity: isRead ? 0.65 : 1,
                      }}
                    >
                      {/* Icon */}
                      <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        {notif.emoji}
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

      {/* ---- Request Detail Bottom Sheet ---- */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '85vh', overflowY: 'auto' }}
            >
              {/* Handle */}
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  {selectedRequest.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>{selectedRequest.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', background: '#FEF3C7', borderRadius: '20px', padding: '2px 8px' }}>Expires {selectedRequest.expiresIn}</span>
                    <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>📅 {selectedRequest.timeframe}</span>
                  </div>
                </div>
              </div>
              {/* Description */}
              <div style={{ background: BG, borderRadius: '16px', padding: '14px 16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>Request details</div>
                <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.6' }}>{selectedRequest.description}</div>
              </div>
              {/* Trust */}
              <div style={{ background: BG, borderRadius: '16px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT, marginBottom: '5px' }}>Neighbour trust score</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: i < selectedRequest.trust ? '#22C55E' : BORDER }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#D1FAE5', borderRadius: '20px', padding: '4px 10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>✓ Singpass Verified</span>
                </div>
              </div>
              <button
                onClick={() => { toast.success('Request sent! The neighbour will be notified.'); setSelectedRequest(null); }}
                style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: "'DM Sans', sans-serif" }}
              >
                I Can Help!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Marketplace Item/Service Detail Bottom Sheet ---- */}
      <AnimatePresence>
        {selectedMarketItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMarketItem(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '85vh', overflowY: 'auto' }}
            >
              {/* Handle */}
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                  {selectedMarketItem.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>{selectedMarketItem.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: selectedMarketItem.conditionText, background: selectedMarketItem.conditionBg, borderRadius: '20px', padding: '2px 8px' }}>
                      {selectedMarketItem.type === 'item' ? 'Item' : 'Service'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: selectedMarketItem.price === 'Free' ? '#059669' : TEXT }}>{selectedMarketItem.price}</span>
                  </div>
                </div>
              </div>
              {/* Sub-info */}
              <div style={{ background: BG, borderRadius: '16px', padding: '14px 16px', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {selectedMarketItem.type === 'item' ? 'Condition' : 'Availability'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{selectedMarketItem.sub}</div>
              </div>
              {selectedMarketItem.type === 'item' && (
                <div style={{ background: BG, borderRadius: '16px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Location & Collection</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{(selectedMarketItem as any).location}</div>
                  <div style={{ fontSize: '12px', color: TEXT2, marginTop: '2px' }}>{(selectedMarketItem as any).method}</div>
                </div>
              )}
              {selectedMarketItem.type === 'service' && (
                <div style={{ background: BG, borderRadius: '16px', padding: '14px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Stats</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT }}>{(selectedMarketItem as any).pastExchanges} past exchanges · {(selectedMarketItem as any).responseRate} response</div>
                  </div>
                </div>
              )}
              {/* Description */}
              <div style={{ background: BG, borderRadius: '16px', padding: '14px 16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>About</div>
                <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.6' }}>{selectedMarketItem.description}</div>
              </div>
              <button
                onClick={() => { toast.success('Message sent! The neighbour will be notified.'); setSelectedMarketItem(null); }}
                style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: "'DM Sans', sans-serif" }}
              >
                {selectedMarketItem.type === 'item' ? 'I Want This!' : 'Request This Service'}
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 0', borderBottom: `1px solid ${BORDER}` }}>
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
