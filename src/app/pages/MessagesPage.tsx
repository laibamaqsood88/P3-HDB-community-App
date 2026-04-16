import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, Shield, Users, Search, X, MessageCircle, MapPin, ClipboardList, Target } from 'lucide-react';
import { NeighbourProfile } from './NeighbourProfilePage';

// ---- Design tokens ----
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

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
  },
  {
    id: 3,
    type: 'marketplace',
    name: 'IKEA Bookshelf',
    avatar: 'IB',
    avatarBg: '#3B82F6',
    lastMessage: 'Hi! Is the bookshelf still available?',
    time: '2:15 PM',
    unread: 1,
    tag: 'Item',
  },
  {
    id: 4,
    type: 'direct',
    name: 'Neighbour #2',
    avatar: 'N2',
    avatarBg: '#8B5CF6',
    lastMessage: "Yes! Let's plan a run this Saturday 🏃",
    time: '10:33 AM',
    unread: 0,
    tag: null,
  },
  {
    id: 5,
    type: 'request',
    name: 'Plant Watering Request',
    avatar: 'PW',
    avatarBg: '#22C55E',
    lastMessage: 'Thanks for your offer! Saturday works.',
    time: 'Mon',
    unread: 1,
    tag: 'Request',
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
    { id: 3, from: 'them', sender: 'them', text: 'Thanks for your offer! Saturday works.', time: 'Mon' },
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
interface GroupMember { name: string; avatar: string; avatarBg: string; role?: string }
const GROUP_MEMBERS: Record<number, GroupMember[]> = {
  1: [
    { name: 'You', avatar: 'YO', avatarBg: '#FF6B47', role: 'Admin' },
    { name: 'Ahmad Farid', avatar: 'AF', avatarBg: '#3B82F6' },
    { name: 'Priya Nair', avatar: 'PN', avatarBg: '#7C3AED' },
    { name: 'Wei Ling', avatar: 'WL', avatarBg: '#059669' },
    { name: 'Rajan Kumar', avatar: 'RK', avatarBg: '#D97706' },
    { name: 'Mei Xin', avatar: 'MX', avatarBg: '#EC4899' },
    { name: 'Hafiz', avatar: 'HF', avatarBg: '#0891B2' },
    { name: 'Suriya', avatar: 'SU', avatarBg: '#16A34A' },
    { name: 'Jin Hao', avatar: 'JH', avatarBg: '#7C3AED' },
    { name: 'Nalini', avatar: 'NA', avatarBg: '#DC2626' },
    { name: 'Beng Kiat', avatar: 'BK', avatarBg: '#9333EA' },
    { name: 'Siti Rahma', avatar: 'SR', avatarBg: '#059669' },
    { name: 'Chen Wei', avatar: 'CW', avatarBg: '#2563EB' },
    { name: 'Deepa', avatar: 'DE', avatarBg: '#D97706' },
  ],
  2: [
    { name: 'You', avatar: 'YO', avatarBg: '#059669', role: 'Admin' },
    { name: 'Madam Tan', avatar: 'MT', avatarBg: '#16A34A' },
    { name: 'Rohani', avatar: 'RO', avatarBg: '#7C3AED' },
    { name: 'Vincent Lim', avatar: 'VL', avatarBg: '#3B82F6' },
    { name: 'Karthik', avatar: 'KA', avatarBg: '#D97706' },
    { name: 'Amy Ong', avatar: 'AO', avatarBg: '#EC4899' },
    { name: 'Encik Razif', avatar: 'ER', avatarBg: '#0891B2' },
    { name: 'Geeta', avatar: 'GE', avatarBg: '#DC2626' },
    { name: 'Pak Ismail', avatar: 'PI', avatarBg: '#9333EA' },
  ],
  3: [
    { name: 'You', avatar: 'YO', avatarBg: '#7C3AED', role: 'Admin' },
    { name: 'Eugene Toh', avatar: 'ET', avatarBg: '#3B82F6' },
    { name: 'Fiona Tan', avatar: 'FT', avatarBg: '#EC4899' },
    { name: 'Darren Loh', avatar: 'DL', avatarBg: '#059669' },
    { name: 'Shalini', avatar: 'SH', avatarBg: '#D97706' },
    { name: 'Marcus Ng', avatar: 'MN', avatarBg: '#0891B2' },
    { name: 'Preethi', avatar: 'PT', avatarBg: '#DC2626' },
    { name: 'Alex Koh', avatar: 'AK', avatarBg: '#9333EA' },
    { name: 'Wendy Yap', avatar: 'WY', avatarBg: '#16A34A' },
    { name: 'Izwan', avatar: 'IZ', avatarBg: '#D97706' },
    { name: 'Charlene', avatar: 'CH', avatarBg: '#7C3AED' },
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

type FilterTab = 'All' | 'Groups' | 'Marketplace' | 'Requests' | 'Direct';
const FILTER_TABS: FilterTab[] = ['All', 'Groups', 'Marketplace', 'Requests', 'Direct'];

interface MessagesPageProps {
  initialConvId?: number;
  extraConversations?: any[];
  onNavVisibilityChange?: (visible: boolean) => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
}

export function MessagesPage({ initialConvId, extraConversations = [], onNavVisibilityChange, onOpenNeighbourProfile }: MessagesPageProps = {}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Merge extra conversations (from neighbours message etc.) with existing mock data
  const allConversations: Conversation[] = [...extraMapped, ...CONVERSATIONS].map(c => ({
    ...c,
    unread: localUnread[c.id] ?? c.unread,
  }));

  const getMessages = (conv: Conversation): ChatMessage[] => {
    const local = localMessages[conv.id];
    if (local) return local;
    if (conv.type === 'group') return GROUP_MESSAGES[conv.id] || [];
    if (conv.type === 'marketplace') return MARKETPLACE_MESSAGES[conv.id] || [];
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
    if (activeFilter === 'Marketplace' && c.type !== 'marketplace') return false;
    if (activeFilter === 'Requests' && c.type !== 'request') return false;
    if (activeFilter === 'Direct' && c.type !== 'direct') return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadFor = (filter: FilterTab) => {
    return allConversations.filter(c => {
      if (filter === 'Groups') return c.type === 'group';
      if (filter === 'Marketplace') return c.type === 'marketplace';
      if (filter === 'Requests') return c.type === 'request';
      if (filter === 'Direct') return c.type === 'direct';
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
        <div style={{ background: CARD, borderBottom: `0.5px solid rgba(60,60,67,0.12)`, flexShrink: 0 }}>
          {!searchOpen ? (
            <>
              {/* Normal mode: Title + search icon */}
              <div style={{ padding: `${44 - (scrollProgress * 4)}px 16px ${14 - (scrollProgress * 6)}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding 0.1s linear' }}>
                <span style={{ fontSize: `${28 - (scrollProgress * 8)}px`, fontWeight: 800, color: TEXT, letterSpacing: '-0.5px', transition: 'font-size 0.1s linear' }}>Messages</span>
                <button onClick={() => setSearchOpen(true)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={18} color={TEXT2} />
                </button>
              </div>
              {/* Normal mode: Filter tabs */}
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
                        borderBottom: `2px solid ${activeFilter === tab ? PRIMARY : 'transparent'}`,
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '13px',
                        fontWeight: activeFilter === tab ? 600 : 500,
                        color: activeFilter === tab ? PRIMARY : MUTED,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {tab}
                      {count > 0 && (
                        <span style={{
                          minWidth: '17px', height: '17px', borderRadius: '9px',
                          background: activeFilter === tab ? PRIMARY : MUTED,
                          color: 'white', fontSize: '10px', fontWeight: 700,
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
          ) : (
            <>
              {/* Search mode: Back + Filter tabs row */}
              <div style={{ paddingTop: '44px', display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '0 8px 0 12px', flexShrink: 0 }}>
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={20} color={TEXT} />
                  </button>
                </div>
                <div className="no-scrollbar" style={{ flex: 1, display: 'flex', overflowX: 'auto' }}>
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
                          borderBottom: `2px solid ${activeFilter === tab ? PRIMARY : 'transparent'}`,
                          cursor: 'pointer',
                          fontFamily: "'Nunito', sans-serif",
                          fontSize: '13px',
                          fontWeight: activeFilter === tab ? 600 : 500,
                          color: activeFilter === tab ? PRIMARY : MUTED,
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {tab}
                        {count > 0 && (
                          <span style={{
                            minWidth: '17px', height: '17px', borderRadius: '9px',
                            background: activeFilter === tab ? PRIMARY : MUTED,
                            color: 'white', fontSize: '10px', fontWeight: 700,
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
              </div>
              {/* Search mode: Search input row */}
              <div style={{ padding: '8px 16px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '50px', background: 'rgba(120,120,128,0.10)' }}>
                  <Search size={14} color={MUTED} />
                  <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: TEXT, outline: 'none', fontFamily: "'Nunito', sans-serif" }} />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={14} color={MUTED} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
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
                {conv.avatar}
                {conv.type === 'group' && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-3px',
                      right: '-3px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: CARD,
                      border: `2px solid ${CARD}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Users size={10} color={conv.avatarBg} />
                  </div>
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
}: {
  conv: Conversation;
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
  onOpenNeighbourProfile?: (profile: NeighbourProfile) => void;
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

          {/* Avatar + Name — tappable for groups (shows members), direct (opens profile) */}
          <div
            onClick={() => {
              if (isGroup) setShowMembers(true);
              else onOpenNeighbourProfile?.({ name: conv.name, avatar: conv.avatar, color: conv.avatarBg });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer', minWidth: 0 }}
          >
            <div
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: conv.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white', flexShrink: 0 }}
            >
              {conv.avatar}
            </div>

            {/* Name + subtitle */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {conv.type === 'marketplace' && conv.subtitle && (
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

          {/* Discoverability notice */}
          <div style={{ background: '#FFF0EC', borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '8px', border: `1px solid #FFD8CC` }}>
            <Users size={16} color={PRIMARY} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontSize: '12px', color: PRIMARY, fontWeight: 600, lineHeight: '1.5' }}>
              This group is discoverable by verified estate residents with the "{conv.tag}" interest tag
            </div>
          </div>
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
                      onOpenNeighbourProfile?.({ name: m.name, avatar: m.avatar, color: m.avatarBg });
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
