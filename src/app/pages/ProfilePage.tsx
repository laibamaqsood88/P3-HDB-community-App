import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award, Lock, ShoppingBag, CalendarDays, FileText, Settings, ChevronRight,
  Bell, Shield as ShieldIcon, HelpCircle, LogOut, Bookmark, Tag, MessageCircle,
  Trash2, RefreshCw, CheckCircle, Edit3, Search, MapPin, Star, Home as HomeIcon,
  Users, X, ChevronLeft, Leaf, Package, Wrench,
} from 'lucide-react';
import { INTEREST_CATEGORIES } from './SignUpPage';

// ---- Design tokens ----
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

// ---- Types ----
interface ProfilePageProps {
  onOpenEvent?: (eventId: number) => void;
  onOpenMarketplaceItem?: (itemId: number) => void;
  onOpenRequest?: (requestId: number) => void;
  onClose?: () => void;
  myPosts?: any[];
  userInterests?: string[];
  onUpdateInterests?: (interests: string[]) => void;
  userLanguages?: string[];
  onUpdateLanguages?: (languages: string[]) => void;
  savedMarketplaceItems?: any[];
}

// ---- Mock Data ----
const MY_INTERESTS = ['Running', 'Photography', 'Cooking'];

const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:       { bg: '#FFF0EC', text: '#FF6B47' },
  Photography:   { bg: '#FAE8FF', text: '#A21CAF' },
  Cooking:       { bg: '#FEF3C7', text: '#D97706' },
  Gardening:     { bg: '#D1FAE5', text: '#059669' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  Cycling:       { bg: '#CCFBF1', text: '#0D9488' },
  Music:         { bg: '#FFE4E6', text: '#E11D48' },
};

const LANGUAGE_COLORS: Record<string, { bg: string; text: string }> = {
  English:       { bg: '#FFF0EC', text: '#FF6B47' },
  Mandarin:      { bg: '#FAE8FF', text: '#A21CAF' },
  Chinese:       { bg: '#FAE8FF', text: '#A21CAF' },
  Malay:         { bg: '#FEF3C7', text: '#D97706' },
  Tamil:         { bg: '#D1FAE5', text: '#059669' },
  Japanese:      { bg: '#EDE9FE', text: '#7C3AED' },
  Korean:        { bg: '#CCFBF1', text: '#0D9488' },
  French:        { bg: '#FFE4E6', text: '#E11D48' },
  Spanish:       { bg: '#DBEAFE', text: '#2563EB' },
  German:        { bg: '#F5D0A9', text: '#92400E' },
};

const SPOKEN_LANGUAGES = ['English', 'Chinese', 'Malay', 'Tamil'];

const AUTOCOMPLETE_LANGUAGES = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',
  'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese',
  'Catalan', 'Cebuano', 'Croatian', 'Czech', 'Danish', 'Dutch',
  'English', 'Esperanto', 'Estonian', 'Finnish', 'French', 'Galician',
  'Georgian', 'German', 'Greek', 'Gujarati', 'Hausa', 'Hebrew',
  'Hindi', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Irish',
  'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer',
  'Korean', 'Kurdish', 'Kyrgyz', 'Lao', 'Latin', 'Latvian',
  'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam',
  'Maltese', 'Marathi', 'Mongolian', 'Nepali', 'Norwegian', 'Odia',
  'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian',
  'Russian', 'Samoan', 'Sanskrit', 'Serbian', 'Shona', 'Sindhi',
  'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Sundanese',
  'Swahili', 'Swedish', 'Tagalog', 'Tajik', 'Tamil', 'Tatar',
  'Telugu', 'Thai', 'Tigrinya', 'Tok Pisin', 'Turkish', 'Turkmen',
  'Twi', 'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese',
  'Welsh', 'Wolof', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu'
];

const SAVED_ITEMS = [
  { id: 1, sourceId: 1, type: 'Event', title: 'Morning Run at Bishan-AMK Park', sub: 'Sat, 12 Apr', category: 'Fitness', categoryColor: '#16A34A', categoryBg: '#DCFCE7', image: 'https://images.unsplash.com/photo-1746046318036-b091b95b02bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 2, sourceId: 2, type: 'Event', title: 'Peranakan Cooking Workshop', sub: 'Sun, 13 Apr', category: 'Cooking', categoryColor: '#D97706', categoryBg: '#FEF3C7', image: 'https://images.unsplash.com/photo-1683633815082-783838d0dfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 3, sourceId: 101, type: 'Item', title: 'IKEA Billy Bookshelf', sub: 'Free · Blk 445', category: 'Furniture', categoryColor: '#2563EB', categoryBg: '#DBEAFE', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 4, sourceId: 1, type: 'Request', title: 'Need someone to water my plants', sub: 'Free Request · Home Help', category: 'Request', categoryColor: '#7C3AED', categoryBg: '#EDE9FE', image: null },
];

// Post icon map: icon name string -> Lucide component
const POST_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Leaf,
  Package,
  Wrench,
};

const MY_POSTS = [
  { id: 1, sourceType: 'request', type: 'Request', icon: 'Leaf', title: 'Plant watering while away', status: 'Active', statusBg: '#DCFCE7', statusColor: '#16A34A', expiresOn: '25 Apr 2026', isExpired: false, category: 'Home Help', description: 'Need someone to water my 4 potted plants while I\'m away. Easy — just water once every 2 days.' },
  { id: 2, sourceType: 'listing', type: 'Listing', icon: 'Package', title: 'IKEA Side Table', status: 'In Progress', statusBg: '#FEF3C7', statusColor: '#D97706', expiresOn: null, isExpired: false, category: 'Furniture', description: 'White IKEA side table in good condition. Self-collect from Level 5.' },
  { id: 3, sourceType: 'request', type: 'Request', icon: 'Wrench', title: 'Help fixing kitchen shelf', status: 'Expired', statusBg: '#FEE2E2', statusColor: '#DC2626', expiresOn: '1 Apr 2026', isExpired: true, category: 'Repairs', description: 'Looking for someone to help re-mount a kitchen shelf that fell.' },
];

const STATS = [
  { label: 'Items\nSaved', value: '4', bg: '#FFF0EC', text: PRIMARY },
  { label: 'Neighbours\nJio\'d', value: '3', bg: '#EDE9FE', text: '#7C3AED' },
  { label: 'Exchanges\nDone', value: '5', bg: '#D1FAE5', text: '#059669' },
];

const BADGES = [
  { id: 1, name: 'Event Joiner', desc: 'Join your first event', unlocked: true, bg: '#FFF0EC', color: PRIMARY },
  { id: 2, name: 'Group Member', desc: 'Join an interest group', unlocked: true, bg: '#EDE9FE', color: '#7C3AED' },
  { id: 3, name: 'Trader', desc: '5 exchanges done', unlocked: true, bg: '#CCFBF1', color: '#059669' },
  { id: 4, name: 'Community Builder', desc: 'Create a new group', unlocked: false, bg: '#F5F5F5', color: MUTED },
];

// ---- Main Component ----
export function ProfilePage({ onOpenEvent, onOpenMarketplaceItem, onOpenRequest, onClose, myPosts = [], userInterests = MY_INTERESTS, onUpdateInterests, userLanguages = [], onUpdateLanguages, savedMarketplaceItems = [] }: ProfilePageProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'settings' | 'saved-items' | 'my-posts'>('main');
  const [showPhotoEdit, setShowPhotoEdit] = useState(false);
  const [showInterestEdit, setShowInterestEdit] = useState(false);
  const [draftInterests, setDraftInterests] = useState<string[]>(userInterests);
  const [showLanguageEdit, setShowLanguageEdit] = useState(false);
  const [draftLanguages, setDraftLanguages] = useState<string[]>(userLanguages);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDraft = (item: string) =>
    setDraftInterests(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);

  const toggleDraftLanguage = (lang: string) =>
    setDraftLanguages(prev => prev.includes(lang) ? prev.filter(x => x !== lang) : [...prev, lang]);

  const addLanguage = (lang: string) => {
    const trimmed = lang.trim();
    if (trimmed && !draftLanguages.includes(trimmed)) {
      setDraftLanguages(prev => [...prev, trimmed]);
      setQuery('');
      setShowDropdown(false);
    }
  };

  const saveInterests = () => {
    onUpdateInterests?.(draftInterests);
    setShowInterestEdit(false);
  };

  const saveLanguages = () => {
    onUpdateLanguages?.(draftLanguages);
    setShowLanguageEdit(false);
    setQuery('');
    setShowDropdown(false);
  };

  // Calculate suggestions for language autocomplete
  const suggestions = query.trim().length > 0
    ? AUTOCOMPLETE_LANGUAGES.filter(
        l => l.toLowerCase().includes(query.toLowerCase()) && !draftLanguages.includes(l)
      ).slice(0, 6)
    : [];

  if (activeSection === 'settings') {
    return <SettingsScreen onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'my-posts') {
    const newPosts = myPosts.map((p: any) => ({
      id: p.id,
      sourceType: p.type,
      type: p.type === 'listing' ? 'Listing' : p.type === 'service' ? 'Service' : 'Request',
      icon: p.icon || null,
      title: p.title,
      status: p.status || 'Active',
      statusBg: '#DCFCE7',
      statusColor: '#16A34A',
      expiresOn: p.date || null,
      isExpired: false,
      category: p.category || '',
      description: '',
    }));
    return <MyPostsScreen onBack={() => setActiveSection('main')} posts={[...newPosts, ...MY_POSTS]} />;
  }

  if (activeSection === 'saved-items') {
    return (
      <SavedItemsScreen
        onBack={() => setActiveSection('main')}
        onOpenEvent={onOpenEvent}
        onOpenMarketplaceItem={onOpenMarketplaceItem}
        onOpenRequest={onOpenRequest}
        savedMarketplaceItems={savedMarketplaceItems}
      />
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* ---- Header ---- */}
      <div style={{ background: BG, paddingTop: '52px', paddingBottom: '20px' }}>
        {/* Back button + Title + Edit & Settings buttons */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute', left: '20px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.07)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ChevronLeft size={22} color={TEXT} />
            </button>
          )}

          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>
            Profile
          </div>

          <div style={{ position: 'absolute', right: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowPhotoEdit(true)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.07)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Edit3 size={18} color={TEXT} />
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.07)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Settings size={18} color={TEXT} />
            </button>
          </div>
        </div>

        {/* Avatar — centred */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=200&h=200&q=80"
            alt="Richard"
            style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${BORDER}`, display: 'block' }}
          />

          {/* Name */}
          <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT }}>Richard</div>

          {/* Estate location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color={TEXT} />
            <span style={{ fontSize: '13px', color: TEXT, fontWeight: 500 }}>Bishan-AMK Estate</span>
          </div>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div style={{ padding: '24px 0 100px' }}>

        {/* ---- Languages Spoken ---- */}
        {userLanguages.length > 0 && (
          <>
            <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Languages Spoken
            </div>
            <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 24px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {userLanguages.map(lang => {
                  return (
                    <span key={lang} style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, background: '#F2F2F7', color: TEXT }}>
                      {lang}
                    </span>
                  );
                })}
                <button
                  onClick={() => { setDraftLanguages(userLanguages); setQuery(''); setShowDropdown(false); setShowLanguageEdit(true); }}
                  style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: BG, color: MUTED, border: `1.5px dashed ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  + Edit
                </button>
              </div>
            </div>
          </>
        )}

        {/* ---- My Interests ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Interests
        </div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 24px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {userInterests.map(i => {
              return (
                <span key={i} style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, background: '#F2F2F7', color: TEXT }}>
                  {i}
                </span>
              );
            })}
            <button
              onClick={() => { setDraftInterests(userInterests); setShowInterestEdit(true); }}
              style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, background: BG, color: MUTED, border: `1.5px dashed ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + Edit
            </button>
          </div>
        </div>

        {/* ---- Rewards & Badges ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Rewards &amp; Badges
        </div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 24px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {BADGES.map(badge => {
              let BadgeIcon;
              if (badge.id === 1) BadgeIcon = <CalendarDays size={20} color={badge.unlocked ? PRIMARY : MUTED} />;
              else if (badge.id === 2) BadgeIcon = <Users size={20} color={badge.unlocked ? PRIMARY : MUTED} />;
              else if (badge.id === 3) BadgeIcon = <ShoppingBag size={20} color={badge.unlocked ? PRIMARY : MUTED} />;
              else BadgeIcon = <Lock size={20} color={MUTED} />;

              return (
                <div
                  key={badge.id}
                  style={{
                    padding: '14px',
                    background: badge.unlocked ? '#F2F2F7' : '#F5F5F5',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: badge.unlocked ? 1 : 0.7,
                    position: 'relative',
                  }}
                >
                  {/* Unlock indicator dot */}
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: badge.unlocked ? '#22C55E' : BORDER,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {badge.unlocked ? (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </div>

                  {BadgeIcon}
                  <div style={{ fontSize: '11px', fontWeight: 800, color: badge.unlocked ? PRIMARY : MUTED, textAlign: 'center', lineHeight: '1.2' }}>{badge.name}</div>
                  <div style={{ fontSize: '10px', color: badge.unlocked ? TEXT2 : MUTED, fontWeight: 500, lineHeight: '1.3', textAlign: 'center' }}>{badge.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Saved Items + My Posts (grouped card) ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          My Content
        </div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Saved Items row */}
          <button
            onClick={() => setActiveSection('saved-items')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bookmark size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left', fontFamily: 'inherit' }}>Saved Items</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
          {/* My Posts row */}
          <button
            onClick={() => setActiveSection('my-posts')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left', fontFamily: 'inherit' }}>My Posts</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
        </div>


      </div>

      {/* ---- Photo Edit Bottom Sheet ---- */}
      {showPhotoEdit && (
        <div
          onClick={() => setShowPhotoEdit(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px' }}
          >
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Change Profile Photo</div>
              <button onClick={() => setShowPhotoEdit(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color={TEXT2} />
              </button>
            </div>

            {/* Current photo preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px', gap: '10px' }}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=faces&fit=crop&w=200&h=200&q=80"
                alt="Richard"
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${BORDER}` }}
              />
              <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>Current photo</div>
            </div>

            {/* Options */}
            {[
              { icon: <ShoppingBag size={20} color={PRIMARY} />, label: 'Choose from Library', bg: '#FFF0EC' },
              { icon: <RefreshCw size={20} color="#7C3AED" />, label: 'Take a New Photo', bg: '#EDE9FE' },
              { icon: <Trash2 size={20} color="#DC2626" />, label: 'Remove Current Photo', bg: '#FEE2E2' },
            ].map(({ icon, label, bg }) => (
              <button
                key={label}
                onClick={() => setShowPhotoEdit(false)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', marginBottom: '10px',
                  background: BG, border: 'none', borderRadius: '14px',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icon}
                </div>
                <span style={{ fontSize: '15px', fontWeight: 600, color: TEXT }}>{label}</span>
                <ChevronRight size={16} color={MUTED} style={{ marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- Interest Edit Bottom Sheet ---- */}
      {showInterestEdit && (
        <div
          onClick={() => setShowInterestEdit(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Edit Interests</div>
              <button onClick={() => setShowInterestEdit(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color={TEXT2} />
              </button>
            </div>
            {INTEREST_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px' }}>{cat.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {cat.items.map(item => {
                    const selected = draftInterests.includes(item);
                    const c = INTEREST_COLORS[item] || { bg: '#FFF0EC', text: PRIMARY };
                    return (
                      <button
                        key={item}
                        onClick={() => toggleDraft(item)}
                        style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${selected ? c.text : BORDER}`, background: selected ? c.bg : 'transparent', color: selected ? c.text : TEXT2 }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={saveInterests}
              style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: "'Nunito', sans-serif", marginTop: '8px' }}
            >
              Save Interests
            </button>
          </div>
        </div>
      )}

      {/* ---- Language Edit Bottom Sheet ---- */}
      {showLanguageEdit && (
        <div
          onClick={() => setShowLanguageEdit(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Edit Languages</div>
              <button onClick={() => setShowLanguageEdit(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color={TEXT2} />
              </button>
            </div>

            {/* Selected Languages Section — At Top */}
            {draftLanguages.length > 0 && (
              <div style={{ marginBottom: '24px', padding: '16px', background: '#FFF8F6', borderRadius: '14px', border: `1.5px solid ${PRIMARY}` }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  Selected Languages
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {draftLanguages.map(lang => {
                    const c = LANGUAGE_COLORS[lang] || { bg: '#FFF0EC', text: PRIMARY };
                    return (
                      <motion.div
                        key={lang}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '8px 14px', borderRadius: '20px',
                          background: c.bg, border: `2px solid ${c.text}`,
                          color: c.text, fontSize: '13px', fontWeight: 700,
                        }}
                      >
                        {lang}
                        <button
                          onClick={() => toggleDraftLanguage(lang)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'inherit', fontSize: '16px' }}
                        >
                          ×
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Common Preset Languages */}
            {SPOKEN_LANGUAGES.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px' }}>Common Languages</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SPOKEN_LANGUAGES.map(lang => {
                    const selected = draftLanguages.includes(lang);
                    const c = LANGUAGE_COLORS[lang] || { bg: '#FFF0EC', text: PRIMARY };
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleDraftLanguage(lang)}
                        style={{
                          padding: '10px 16px', borderRadius: '22px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                          border: `2px solid ${selected ? c.text : BORDER}`,
                          background: selected ? c.bg : CARD,
                          color: selected ? c.text : TEXT2,
                          transition: 'all 0.15s'
                        }}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search & Browse More Languages */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '10px' }}>Browse Languages</div>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    background: BG,
                    borderRadius: '18px',
                    border: `2px solid ${showDropdown ? PRIMARY : BORDER}`,
                    padding: '12px 14px',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Input field */}
                  <input
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Search languages..."
                    style={{
                      width: '100%', background: 'transparent', border: 'none', outline: 'none',
                      fontSize: '14px', color: TEXT, fontFamily: "'Nunito', sans-serif",
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {showDropdown && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                        background: CARD, borderRadius: '14px', border: `1.5px solid ${BORDER}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 20, overflow: 'hidden',
                        maxHeight: '240px', overflowY: 'auto'
                      }}
                    >
                      {suggestions.map((lang, i) => {
                        const selected = draftLanguages.includes(lang);
                        const c = LANGUAGE_COLORS[lang] || { bg: '#FFF0EC', text: PRIMARY };
                        return (
                          <button
                            key={lang}
                            onMouseDown={() => addLanguage(lang)}
                            style={{
                              width: '100%', padding: '12px 16px', background: selected ? c.bg : 'none',
                              border: 'none', borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
                              textAlign: 'left', fontSize: '14px', fontWeight: selected ? 700 : 500,
                              color: selected ? c.text : TEXT, cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}
                          >
                            <span>{lang}</span>
                            {selected && (
                              <span style={{ fontSize: '14px', color: c.text }}>✓</span>
                            )}
                          </button>
                        );
                      })}
                      {/* Padding below suggestions */}
                      <div style={{ height: '8px' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={saveLanguages}
              style={{ width: '100%', padding: '15px', borderRadius: '18px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: "'Nunito', sans-serif", marginTop: '8px' }}
            >
              Save Languages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- My Posts Screen ----
function MyPostsScreen({ onBack, posts }: { onBack: () => void; posts: any[] }) {
  const [activeTab, setActiveTab] = useState<'All' | 'Marketplace' | 'Requests'>('All');
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const tabs = ['All', 'Marketplace', 'Requests'] as const;

  const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    listing: { bg: '#DBEAFE', text: '#2563EB' },
    service: { bg: '#DCFCE7', text: '#16A34A' },
    request: { bg: '#EDE9FE', text: '#7C3AED' },
    Listing: { bg: '#DBEAFE', text: '#2563EB' },
    Service: { bg: '#DCFCE7', text: '#16A34A' },
    Request: { bg: '#EDE9FE', text: '#7C3AED' },
  };

  const tabFilter = (p: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Marketplace') return p.type === 'Listing' || p.type === 'Service';
    if (activeTab === 'Requests') return p.type === 'Request';
    return true;
  };

  const q = search.toLowerCase().trim();
  const filtered = posts.filter(p => tabFilter(p) && (!q || p.title.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)));

  if (selectedPost) {
    return <PostDetailScreen post={selectedPost} onBack={() => setSelectedPost(null)} onUpdate={(updated: any) => setSelectedPost(updated)} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} color={TEXT} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: '28px', fontWeight: 700, color: TEXT }}>My Posts</div>
        </div>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(120,120,128,0.12)', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px' }}>
          <Search size={15} color={MUTED} style={{ flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={14} color={MUTED} /></button>}
        </div>
        {/* Tabs — underline style */}
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${BORDER}` }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0, padding: '8px 16px', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${PRIMARY}` : '2px solid transparent',
                fontSize: '14px', fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                color: activeTab === tab ? PRIMARY : TEXT2,
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <FileText size={32} color={MUTED} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '5px' }}>No posts yet</div>
            <div style={{ fontSize: '12px', color: MUTED }}>Your marketplace listings and requests will appear here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(p => {
              const tc = TYPE_COLORS[p.type] || { bg: BG, text: TEXT2 };
              const PostIconComp = p.icon && POST_ICON_MAP[p.icon] ? POST_ICON_MAP[p.icon] : FileText;
              const iconBgColor = p.type === 'Listing' ? '#DBEAFE' : p.type === 'Service' ? '#DCFCE7' : '#EDE9FE';
              const iconColor = p.type === 'Listing' ? '#2563EB' : p.type === 'Service' ? '#16A34A' : '#7C3AED';
              return (
                <div key={p.id} onClick={() => setSelectedPost(p)} style={{ background: CARD, borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: iconBgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PostIconComp size={20} color={iconColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, background: tc.bg, color: tc.text, padding: '2px 8px', borderRadius: '8px' }}>{p.type}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, background: p.statusBg || '#DCFCE7', color: p.statusColor || '#16A34A', padding: '2px 8px', borderRadius: '8px' }}>{p.status}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    {p.expiresOn && <div style={{ fontSize: '11px', color: p.isExpired ? '#DC2626' : MUTED, fontWeight: 500 }}>{p.isExpired ? 'Expired' : 'Expires'} {p.expiresOn}</div>}
                  </div>
                  <ChevronRight size={16} color={MUTED} style={{ flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Post Detail Screen ----
function PostDetailScreen({ post, onBack, onUpdate }: { post: any; onBack: () => void; onUpdate: (p: any) => void }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRenewSheet, setShowRenewSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [newExpiry, setNewExpiry] = useState('');
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDesc, setEditDesc] = useState(post.description || '');
  const [currentPost, setCurrentPost] = useState(post);
  const { toast: toastFn } = { toast: (msg: string) => {} };

  const isExpired = currentPost.isExpired;
  const isRequest = currentPost.type === 'Request';
  const isMarketplace = currentPost.type === 'Listing' || currentPost.type === 'Service';

  const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
    Listing: { bg: '#DBEAFE', text: '#2563EB' },
    Service: { bg: '#DCFCE7', text: '#16A34A' },
    Request: { bg: '#EDE9FE', text: '#7C3AED' },
  };
  const tc = TYPE_COLORS[currentPost.type] || { bg: BG, text: TEXT2 };

  const PostIconComp = currentPost.icon && POST_ICON_MAP[currentPost.icon] ? POST_ICON_MAP[currentPost.icon] : FileText;
  const iconBgColor = currentPost.type === 'Listing' ? '#DBEAFE' : currentPost.type === 'Service' ? '#DCFCE7' : '#EDE9FE';
  const iconColor = currentPost.type === 'Listing' ? '#2563EB' : currentPost.type === 'Service' ? '#16A34A' : '#7C3AED';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 20px', flexShrink: 0, borderBottom: `0.5px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} color={TEXT} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: '20px', fontWeight: 700, color: TEXT }}>Post Details</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {/* Post card */}
        <div style={{ background: CARD, borderRadius: '14px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: iconBgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PostIconComp size={22} color={iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, background: tc.bg, color: tc.text, padding: '3px 9px', borderRadius: '8px' }}>{currentPost.type}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, background: currentPost.statusBg || '#DCFCE7', color: currentPost.statusColor || '#16A34A', padding: '3px 9px', borderRadius: '8px' }}>{currentPost.status}</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: TEXT, lineHeight: '1.3', marginBottom: '4px' }}>{currentPost.title}</div>
              {currentPost.category && <div style={{ fontSize: '12px', color: TEXT2, fontWeight: 500 }}>{currentPost.category}</div>}
            </div>
          </div>
          {currentPost.description ? (
            <div style={{ background: BG, borderRadius: '12px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT2, marginBottom: '4px' }}>Description</div>
              <div style={{ fontSize: '13px', color: TEXT, lineHeight: '1.5' }}>{currentPost.description}</div>
            </div>
          ) : null}
          {currentPost.expiresOn && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '12px', color: isExpired ? '#DC2626' : TEXT2, fontWeight: 600 }}>
                {isExpired ? `Expired on ${currentPost.expiresOn}` : `Expires: ${currentPost.expiresOn}`}
              </div>
            </div>
          )}
        </div>

        {/* Actions — grouped card */}
        <div style={{ padding: '0 0 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</div>
        <div style={{ background: CARD, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Renew (expired requests only) */}
          {isExpired && isRequest && (
            <button
              onClick={() => setShowRenewSheet(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RefreshCw size={16} color="#16A34A" />
              </div>
              <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: '#16A34A', textAlign: 'left' }}>Renew Request</span>
              <ChevronRight size={16} color={MUTED} />
            </button>
          )}

          {/* Edit */}
          {!isExpired && (
            <button
              onClick={() => setShowEditSheet(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Edit3 size={16} color={PRIMARY} />
              </div>
              <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Edit Details</span>
              <ChevronRight size={16} color={MUTED} />
            </button>
          )}

          {/* Mark as Sold (marketplace only) */}
          {isMarketplace && !isExpired && currentPost.status !== 'Sold' && (
            <button
              onClick={() => {
                const updated = { ...currentPost, status: 'Sold', statusBg: '#CCFBF1', statusColor: '#0D9488' };
                setCurrentPost(updated);
                onUpdate(updated);
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={16} color="#0D9488" />
              </div>
              <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Mark as Sold</span>
              <ChevronRight size={16} color={MUTED} />
            </button>
          )}

          {/* View Chat */}
          <button
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={16} color="#7C3AED" />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>View Chat</span>
            <span style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>No messages yet</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trash2 size={16} color="#FF3B30" />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: '#FF3B30', textAlign: 'left' }}>Delete Listing</span>
          </button>
        </div>
      </div>

      {/* Delete Confirm Sheet */}
      {showDeleteConfirm && (
        <div onClick={() => setShowDeleteConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '8px' }}>Delete this listing?</div>
            <div style={{ fontSize: '13px', color: TEXT2, marginBottom: '24px' }}>This action cannot be undone. The post will be permanently removed.</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => { setShowDeleteConfirm(false); onBack(); }} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#FF3B30', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'white', fontFamily: 'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Sheet */}
      {showRenewSheet && (
        <div onClick={() => setShowRenewSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>Renew Request</div>
            <div style={{ fontSize: '13px', color: TEXT2, marginBottom: '20px' }}>Set a new expiry date to reactivate this request.</div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>New Expiry Date</div>
              <input
                type="date"
                value={newExpiry}
                onChange={e => setNewExpiry(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${BORDER}`, fontSize: '14px', color: TEXT, fontFamily: 'inherit', background: BG, boxSizing: 'border-box' as any }}
              />
            </div>
            <button
              onClick={() => {
                if (!newExpiry) return;
                const formatted = new Date(newExpiry).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
                const updated = { ...currentPost, isExpired: false, status: 'Active', statusBg: '#DCFCE7', statusColor: '#16A34A', expiresOn: formatted };
                setCurrentPost(updated);
                onUpdate(updated);
                setShowRenewSheet(false);
              }}
              disabled={!newExpiry}
              style={{ width: '100%', padding: '15px', borderRadius: '14px', background: newExpiry ? PRIMARY : BORDER, border: 'none', cursor: newExpiry ? 'pointer' : 'not-allowed', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'inherit' }}
            >
              Renew Request
            </button>
          </div>
        </div>
      )}

      {/* Edit Sheet */}
      {showEditSheet && (
        <div onClick={() => setShowEditSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '28px 28px 0 0', padding: '24px 20px 44px', maxHeight: '75vh', overflowY: 'auto' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Edit Details</div>
              <button onClick={() => setShowEditSheet(false)} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color={TEXT2} />
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>Title</div>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${BORDER}`, fontSize: '14px', color: TEXT, fontFamily: 'inherit', background: BG, boxSizing: 'border-box' as any }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '8px' }}>Description</div>
              <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4} style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${BORDER}`, fontSize: '14px', color: TEXT, fontFamily: 'inherit', background: BG, resize: 'none', boxSizing: 'border-box' as any }} />
            </div>
            <button
              onClick={() => {
                const updated = { ...currentPost, title: editTitle, description: editDesc };
                setCurrentPost(updated);
                onUpdate(updated);
                setShowEditSheet(false);
              }}
              style={{ width: '100%', padding: '15px', borderRadius: '14px', background: PRIMARY, border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 800, color: 'white', fontFamily: 'inherit' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Saved Items Screen ----
function SavedItemsScreen({ onBack, onOpenEvent, onOpenMarketplaceItem, onOpenRequest, savedMarketplaceItems = [] }: {
  onBack: () => void;
  onOpenEvent?: (id: number) => void;
  onOpenMarketplaceItem?: (id: number) => void;
  onOpenRequest?: (id: number) => void;
  savedMarketplaceItems?: any[];
}) {
  const [activeTab, setActiveTab] = useState<'All' | 'Events' | 'Marketplace' | 'Requests'>('All');
  const [search, setSearch] = useState('');

  const tabs = ['All', 'Events', 'Marketplace', 'Requests'] as const;

  const typeColors: Record<string, { bg: string; text: string }> = {
    Event: { bg: '#FFF0EC', text: PRIMARY },
    Item: { bg: '#DBEAFE', text: '#2563EB' },
    Request: { bg: '#EDE9FE', text: '#7C3AED' },
    Service: { bg: '#DCFCE7', text: '#16A34A' },
  };

  // Convert dynamic marketplace items to the saved-item shape
  const dynamicMarketplaceEntries = savedMarketplaceItems.map(item => ({
    id: item.id,
    sourceId: item.id,
    type: item.itemType === 'service' ? 'Service' : 'Item',
    title: item.name,
    sub: item.price ? `${item.price} · ${item.collectionAddress?.split(',')[0] ?? item.distance ?? ''}` : (item.collectionAddress?.split(',')[0] ?? item.distance ?? ''),
    category: item.category || '',
    categoryColor: item.itemType === 'service' ? '#16A34A' : '#2563EB',
    categoryBg: item.itemType === 'service' ? '#DCFCE7' : '#DBEAFE',
    image: item.image || null,
  }));

  // Static entries: keep only Events and Requests (Items are now fully dynamic)
  const staticEntries = SAVED_ITEMS.filter(i => i.type !== 'Item' && i.type !== 'Service');

  // Merge: dynamic marketplace first, then static Events/Requests
  const allSaved = [...dynamicMarketplaceEntries, ...staticEntries];

  const tabFilter = (item: (typeof allSaved)[0]) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Events') return item.type === 'Event';
    if (activeTab === 'Marketplace') return item.type === 'Item' || item.type === 'Service';
    if (activeTab === 'Requests') return item.type === 'Request';
    return true;
  };

  const q = search.toLowerCase().trim();
  const filtered = allSaved.filter(item => tabFilter(item) && (!q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronRight size={18} color={TEXT} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: '28px', fontWeight: 700, color: TEXT }}>Saved</div>
        </div>
        {/* Search bar — iOS pill style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(120,120,128,0.12)', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px' }}>
          <Search size={15} color={MUTED} style={{ flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search saved items..."
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <X size={14} color={MUTED} />
            </button>
          )}
        </div>
        {/* Tabs — underline style */}
        <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${BORDER}`, overflowX: 'auto' }} className="no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flexShrink: 0, padding: '8px 16px', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${PRIMARY}` : '2px solid transparent',
                fontSize: '14px', fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                color: activeTab === tab ? PRIMARY : TEXT2,
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Bookmark size={32} color={MUTED} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '5px' }}>Nothing saved yet</div>
            <div style={{ fontSize: '12px', color: MUTED }}>Items you save will appear here</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(item => {
              const tc = typeColors[item.type] || { bg: BG, text: MUTED };
              const handleTap = () => {
                if (item.type === 'Event') onOpenEvent?.(item.sourceId);
                else if (item.type === 'Item' || item.type === 'Service') onOpenMarketplaceItem?.(item.sourceId);
                else if (item.type === 'Request') onOpenRequest?.(item.sourceId);
              };
              return (
                <div key={item.id} onClick={handleTap} style={{ background: CARD, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: '80px', height: '72px', flexShrink: 0 }}>
                    {item.image ? (
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={24} color={MUTED} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: tc.bg, color: tc.text }}>{item.type}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: item.categoryBg, color: item.categoryColor }}>{item.category}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '2px', lineHeight: '1.3' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{item.sub}</div>
                  </div>
                  <div style={{ padding: '0 14px' }}>
                    <Bookmark size={14} color={PRIMARY} fill={PRIMARY} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Settings Screen ----
function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifNeighbours, setNotifNeighbours] = useState(true);
  const [notifHelp, setNotifHelp] = useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '44px 20px 20px', borderBottom: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronLeft size={22} color={TEXT} />
          </button>
          <div style={{ flex: 1, fontSize: '18px', fontWeight: 800, color: TEXT, textAlign: 'center' }}>Settings</div>
          <div style={{ width: '36px', flexShrink: 0 }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '40px' }}>
        {/* ---- Account section ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px' }}>Account</div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Edit Profile */}
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Edit3 size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Edit Profile</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
          {/* Change Password */}
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Change Password</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
        </div>

        {/* ---- Notifications section ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px' }}>Notifications</div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Notifications row (nav) */}
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `0.5px solid ${BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Notifications</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
          {/* Toggles */}
          {[
            { label: 'Event reminders', sub: 'Alerts for saved events', val: notifEvents, set: setNotifEvents },
            { label: 'Neighbour invites', sub: "When a neighbour Jio's you", val: notifNeighbours, set: setNotifNeighbours },
            { label: 'Help & Share', sub: 'Matches for your requests', val: notifHelp, set: setNotifHelp },
          ].map(({ label, sub, val, set }, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < 2 ? `0.5px solid ${BORDER}` : 'none' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: TEXT }}>{label}</div>
                <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>{sub}</div>
              </div>
              <div
                onClick={() => set(!val)}
                style={{ width: '46px', height: '26px', borderRadius: '13px', background: val ? PRIMARY : BORDER, cursor: 'pointer', position: 'relative', transition: 'background 0.2s ease', flexShrink: 0 }}
              >
                <div style={{ position: 'absolute', top: '3px', left: val ? '23px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* ---- Privacy section ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px' }}>Privacy</div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldIcon size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Privacy &amp; Data</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
        </div>

        {/* ---- Support section ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px' }}>Support</div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HelpCircle size={16} color={MUTED} />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: TEXT, textAlign: 'left' }}>Help &amp; Support</span>
            <ChevronRight size={16} color={MUTED} />
          </button>
        </div>

        {/* ---- Log Out ---- */}
        <div style={{ margin: '24px 16px 0' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: CARD, border: 'none', borderRadius: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,59,48,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogOut size={16} color="#FF3B30" />
            </div>
            <span style={{ flex: 1, fontSize: '16px', fontWeight: 500, color: '#FF3B30', textAlign: 'left' }}>Log Out</span>
          </button>
        </div>

        {/* ---- About section ---- */}
        <div style={{ padding: '0 16px 8px', fontSize: '12px', fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px' }}>About</div>
        <div style={{ background: CARD, borderRadius: '14px', margin: '0 16px 8px', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <HomeIcon size={28} color={PRIMARY} />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>NeighbourHood</div>
          <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500, marginBottom: '12px' }}>Version 1.0.0 · Made for Singapore HDB Estates</div>
          <div style={{ fontSize: '11px', color: '#C0C0CC' }}>All data is estate-gated. No PII shared without mutual consent.</div>
        </div>
      </div>
    </div>
  );
}
