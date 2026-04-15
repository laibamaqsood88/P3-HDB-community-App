import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Bell, Send, Shield, Users } from 'lucide-react';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

// ---- Mock conversation list ----
type ConvType = 'group' | 'marketplace' | 'direct';

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
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    type: 'group',
    name: 'Morning Runners',
    avatar: '🏃',
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
    avatar: '🌿',
    avatarBg: '#059669',
    lastMessage: 'Community garden session this weekend!',
    time: 'Yesterday',
    unread: 0,
    tag: 'Gardening',
  },
  {
    id: 3,
    type: 'group',
    name: 'Board Game Sundays',
    avatar: '🎲',
    avatarBg: '#7C3AED',
    lastMessage: "Anyone up for Ticket to Ride this Sunday? 🚂",
    time: '3:30 PM',
    unread: 1,
    tag: 'Board Games',
  },
  {
    id: 3,
    type: 'marketplace',
    name: 'IKEA Bookshelf',
    avatar: '📚',
    avatarBg: '#3B82F6',
    lastMessage: 'Hi! Is the bookshelf still available?',
    time: '2:15 PM',
    unread: 1,
    tag: 'Listing',
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
    type: 'marketplace',
    name: 'Plant Watering Request',
    avatar: '🪴',
    avatarBg: '#22C55E',
    lastMessage: 'Thanks for your offer! Saturday works.',
    time: 'Mon',
    unread: 0,
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

// ---- Interest tag colors ----
const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:       { bg: '#FFF0EC', text: '#FF6B47' },
  Gardening:     { bg: '#D1FAE5', text: '#059669' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  'Board Game Sundays': { bg: '#EDE9FE', text: '#7C3AED' },
  Cooking:       { bg: '#FEF3C7', text: '#D97706' },
  Listing:       { bg: '#DBEAFE', text: '#2563EB' },
  Request:       { bg: '#DCFCE7', text: '#16A34A' },
};

type FilterTab = 'All' | 'Groups' | 'Marketplace' | 'Direct';
const FILTER_TABS: FilterTab[] = ['All', 'Groups', 'Marketplace', 'Direct'];

interface MessagesPageProps {
  initialConvId?: number;
  extraConversations?: any[];
}

export function MessagesPage({ initialConvId, extraConversations = [] }: MessagesPageProps = {}) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [openConv, setOpenConv] = useState<Conversation | null>(
    initialConvId ? (CONVERSATIONS.find(c => c.id === initialConvId) ?? null) : null
  );
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [localMessages, setLocalMessages] = useState<Record<number, ChatMessage[]>>({});

  // Merge extra conversations (from neighbours connect etc.) with existing mock data
  const allConversations: Conversation[] = [
    ...extraConversations.map((c: any) => ({
      id: c.id,
      type: (c.type || 'direct') as ConvType,
      name: c.name,
      avatar: c.avatar || c.name?.substring(0, 2) || '??',
      avatarBg: c.avatarColor || c.avatarBg || '#8B5CF6',
      lastMessage: c.lastMessage || 'Say hello!',
      time: c.time || 'Just now',
      unread: c.unread ?? 0,
      tag: c.tag || null,
    })),
    ...CONVERSATIONS,
  ];

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

  const filteredConvs = allConversations.filter(c => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Groups') return c.type === 'group';
    if (activeFilter === 'Marketplace') return c.type === 'marketplace';
    if (activeFilter === 'Direct') return c.type === 'direct';
    return true;
  });

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
        <div style={{ background: CARD, padding: '52px 20px 0', borderBottom: `1px solid ${BORDER}` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT }}>Messages</div>
            <button
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '13px',
                background: BG,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} color={TEXT} />
            </button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '-1px' }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${activeFilter === tab ? PRIMARY : 'transparent'}`,
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '13px',
                  fontWeight: activeFilter === tab ? 700 : 500,
                  color: activeFilter === tab ? PRIMARY : MUTED,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvs.length === 0 && (
            <div
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                color: MUTED,
                fontSize: '14px',
              }}
            >
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
                borderBottom: `1px solid ${BORDER}`,
                cursor: 'pointer',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '18px',
                  background: conv.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: conv.avatar.length > 2 ? '22px' : '14px',
                  fontWeight: 800,
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
                      borderRadius: '6px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
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
                  <span
                    style={{
                      fontSize: '11px',
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
                      fontSize: '13px',
                      color: conv.unread > 0 ? TEXT : TEXT2,
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
                        padding: '0 6px',
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
}: {
  conv: Conversation;
  messages: ChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
}) {
  const isGroup = conv.type === 'group';
  const [groupTab, setGroupTab] = useState<'chat' | 'activity'>('chat');
  const activity = GROUP_ACTIVITY[conv.id];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      {/* Header */}
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ padding: '52px 20px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ChevronLeft size={20} color={TEXT} />
          </button>

          {/* Avatar */}
          <div
            style={{ width: '44px', height: '44px', borderRadius: '14px', background: conv.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: conv.avatar.length > 2 ? '20px' : '15px', fontWeight: 800, color: 'white', flexShrink: 0 }}
          >
            {conv.avatar}
          </div>

          {/* Name + subtitle */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>{conv.name}</span>
              {!isGroup && <Shield size={12} color="#22C55E" />}
            </div>
            <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>
              {isGroup
                ? `${activity?.members ?? ''} members`
                : conv.type === 'marketplace' ? 'Marketplace chat' : 'Direct message'}
            </span>
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
          <div style={{ display: 'flex', borderTop: `1px solid ${BORDER}` }}>
            {(['chat', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setGroupTab(tab)}
                style={{
                  flex: 1, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif", fontSize: '13px',
                  fontWeight: groupTab === tab ? 700 : 500,
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: MUTED, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '14px' }}>
            Upcoming Activity
          </div>

          {[
            { emoji: '📍', label: 'Next Meetup', value: activity.meetup },
            { emoji: '📋', label: 'Upcoming Plan', value: activity.plan },
            { emoji: '🎯', label: 'Group Goal', value: activity.goal },
          ].map(item => (
            <div
              key={item.label}
              style={{ background: CARD, borderRadius: '18px', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
            >
              <span style={{ fontSize: '22px', lineHeight: 1, marginTop: '1px' }}>{item.emoji}</span>
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
      {(!isGroup || groupTab === 'chat') && <div
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
                    padding: '6px 16px',
                    borderRadius: '20px',
                    background: '#F0FDF4',
                    fontSize: '12px',
                    color: '#16A34A',
                    fontWeight: 700,
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
                    borderRadius: '10px',
                    background: conv.avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '12px',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '14px',
                  }}
                >
                  {msg.sender}
                </div>
              )}

              <div style={{ maxWidth: '75%' }}>
                <div
                  style={{
                    padding: '11px 15px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isMe ? PRIMARY : CARD,
                    color: isMe ? 'white' : TEXT,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
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
      </div>}

      {/* Input bar — chat tab only */}
      {(!isGroup || groupTab === 'chat') && <div
        style={{
          padding: '12px 16px 28px',
          background: CARD,
          borderTop: `1px solid ${BORDER}`,
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
              padding: '12px 18px',
              borderRadius: '22px',
              border: `1.5px solid ${BORDER}`,
              background: BG,
              fontSize: '14px',
              outline: 'none',
              color: TEXT,
              fontFamily: "'Nunito', sans-serif",
            }}
          />
          <button
            onClick={onSend}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: PRIMARY,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(255,107,71,0.35)',
            }}
          >
            <Send size={18} color="white" />
          </button>
        </div>
      </div>}
    </div>
  );
}
