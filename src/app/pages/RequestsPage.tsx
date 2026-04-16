import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, X, SlidersHorizontal, MapPin, MessageCircle, Heart,
  ChevronDown, Check, Send, Search, Lock, Bookmark, Star, ChevronRight, ShieldCheck,
  Camera, Monitor,
  Home as HomeIcon, ShoppingCart, Wrench, Package, BookOpen, Handshake,
  ShoppingBag, Search as SearchIcon, ClipboardList, CheckCircle, SquareArrowOutUpRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { NeighbourProfilePage } from './NeighbourProfilePage';

// ---- Design tokens ----
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

type RequestScreen = 'feed' | 'detail' | 'post' | 'chat' | 'neighbour-profile';
interface NavFrame { screen: RequestScreen; params?: any; }

const REQUEST_CATEGORIES = ['Home Help', 'Errands', 'Repairs', 'Moving', 'Learning', 'Community', 'Items Needed', 'Lost Items'];
const REQUEST_TYPES = ['Borrow', 'Free Request', 'Paid Request'];

const CAT_EMOJIS: Record<string, string> = {
  'Home Help': '🏠', 'Errands': '🛒', 'Repairs': '🔧', 'Moving': '📦',
  'Learning': '📚', 'Community': '🤝', 'Items Needed': '🛍️', 'Lost Items': '🔍',
};

const CAT_ICON_MAP: Record<string, React.FC<any>> = {
  'Home Help': HomeIcon,
  'Errands': ShoppingCart,
  'Repairs': Wrench,
  'Moving': Package,
  'Learning': BookOpen,
  'Community': Handshake,
  'Items Needed': ShoppingBag,
  'Lost Items': SearchIcon,
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'Borrow': { bg: '#EDE9FE', text: '#7C3AED' },
  'Free Request': { bg: '#DCFCE7', text: '#16A34A' },
  'Paid Request': { bg: '#FEF3C7', text: '#D97706' },
};

const POSTER_AVATARS = [
  { name: 'Sarah T.', color: '#8B5CF6', initials: 'ST', rating: 4.8, reviews: 12 },
  { name: 'Ahmad K.', color: '#3B82F6', initials: 'AK', rating: 4.5, reviews: 8 },
  { name: 'Mei Lin', color: '#F97316', initials: 'ML', rating: 4.9, reviews: 21 },
  { name: 'Ravi S.', color: '#22C55E', initials: 'RS', rating: 4.7, reviews: 5 },
  { name: 'Jennifer L.', color: '#EC4899', initials: 'JL', rating: 4.6, reviews: 9 },
];

const MOCK_REVIEWS = [
  { id: 1, reviewer: 'Neighbour A', rating: 5, comment: 'Very helpful and responsive! Would definitely reach out again.', date: '2 weeks ago', avatarColor: '#8B5CF6' },
  { id: 2, reviewer: 'Neighbour B', rating: 4, comment: 'Good neighbour, easy to coordinate with. Smooth experience.', date: '1 month ago', avatarColor: '#06B6D4' },
  { id: 3, reviewer: 'Neighbour C', rating: 5, comment: 'Great attitude, very accommodating. Highly recommended!', date: '3 weeks ago', avatarColor: '#F97316' },
];

const INITIAL_REQUESTS = [
  { id: 1, title: 'Need someone to water my plants', category: 'Home Help', type: 'Free Request', description: 'Need someone to water my 4 potted plants while I\'m away travelling. Easy — just water once every 2 days. Plants are by the window sill.', expiresOn: '25 Apr 2026', postedAgo: '2 days ago', distance: '0.3 km away', image: 'https://images.unsplash.com/photo-1599598425947-5202edd56fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', verified: true, poster: POSTER_AVATARS[0], collectionPoint: 'Blk 445, Level 5, #05-22' },
  { id: 2, title: 'Help moving sofa to void deck', category: 'Moving', type: 'Paid Request', description: 'Need a hand moving a sofa from Level 8 to ground floor void deck for disposal. Only takes 30 mins with 2 people. Will pay $20 for the help.', expiresOn: '20 Apr 2026', postedAgo: '5 hours ago', distance: '0.8 km away', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', verified: true, poster: POSTER_AVATARS[1], collectionPoint: 'Blk 448, Void Deck' },
  { id: 3, title: 'Looking for P5 Math assessment books', category: 'Items Needed', type: 'Borrow', description: 'My daughter is in P5 and we are looking for any spare Math or English assessment books. Happy to borrow for 2 weeks and return in good condition.', expiresOn: '30 Apr 2026', postedAgo: '1 day ago', distance: '1.2 km away', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', verified: true, poster: POSTER_AVATARS[2], collectionPoint: 'Blk 451, Level 3 Corridor' },
  { id: 4, title: 'Lost: Orange tabby cat near Blk 443', category: 'Lost Items', type: 'Free Request', description: 'Lost my orange tabby cat Milo near Blk 443 last Sunday evening. Very friendly, wearing a blue collar with a bell. Please contact if spotted!', expiresOn: '28 Apr 2026', postedAgo: '3 days ago', distance: '0.5 km away', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', verified: true, poster: POSTER_AVATARS[3], collectionPoint: 'Blk 443 Area' },
  { id: 5, title: 'Need help fixing leaking kitchen tap', category: 'Repairs', type: 'Paid Request', description: 'Kitchen tap has been dripping for a week. Looking for someone handy who can fix it. Will pay for parts and a small appreciation fee.', expiresOn: '22 Apr 2026', postedAgo: '4 hours ago', distance: '0.7 km away', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', verified: true, poster: POSTER_AVATARS[4], collectionPoint: 'Blk 445, Level 8, #08-11' },
];

export { INITIAL_REQUESTS as REQUESTS_DATA, CAT_EMOJIS as REQUESTS_CAT_EMOJIS };

// ---- Map Component ----
function CollectionPointMap({ address }: { address: string }) {
  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
      <div style={{ position: 'relative', height: '150px', background: 'linear-gradient(135deg, #E8F5E9 0%, #DCEEFB 100%)' }}>
        {[...Array(6)].map((_, i) => (
          <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 27}px`, height: '1px', background: 'rgba(0,0,0,0.05)' }} />
        ))}
        {[...Array(5)].map((_, i) => (
          <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 25}%`, width: '1px', background: 'rgba(0,0,0,0.05)' }} />
        ))}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '13px', background: 'rgba(255,255,255,0.55)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '32%', width: '13px', background: 'rgba(255,255,255,0.55)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '32%', transform: 'translate(-50%, -100%)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50% 50% 50% 0', background: PRIMARY, transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,107,71,0.45)' }}>
            <MapPin size={13} color="white" style={{ transform: 'rotate(45deg)' }} />
          </div>
        </div>
      </div>
      <div style={{ background: CARD, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MapPin size={14} color={PRIMARY} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>Location</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{address}</div>
        </div>
      </div>
    </div>
  );
}

// ---- Poster Avatar ----
function PosterAvatar({ poster, size = 34 }: { poster: any; size?: number }) {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', background: poster.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
      <span style={{ fontSize: `${Math.floor(size * 0.33)}px`, fontWeight: 800, color: 'white' }}>{poster.initials}</span>
    </div>
  );
}

// ---- Star Rating ----
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={12} color={i < rating ? '#FF9500' : BORDER} fill={i < rating ? '#FF9500' : 'none'} />
      ))}
    </div>
  );
}

// ---- Save Button ----
function SaveButton({ itemId, savedItems, onSaveToggle, size = 14, style: extraStyle = {} }: { itemId: number; savedItems: number[]; onSaveToggle: (id: number) => void; size?: number; style?: React.CSSProperties }) {
  const saved = savedItems.includes(itemId);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSaveToggle(itemId); toast.success(saved ? 'Removed from saved' : 'Request saved'); }}
      style={{ width: '30px', height: '30px', borderRadius: '50%', background: saved ? '#FFF0EC' : 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.12)', ...extraStyle }}
    >
      <Bookmark size={size} color={saved ? PRIMARY : MUTED} fill={saved ? PRIMARY : 'none'} />
    </button>
  );
}

// ---- Request Card ----
function RequestCard({ r, savedItems, onSaveToggle, onClick }: { r: any; savedItems: number[]; onSaveToggle: (id: number) => void; onClick: () => void }) {
  const typeStyle = TYPE_COLORS[r.type] || { bg: BG, text: TEXT2 };
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: CARD, borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        cursor: 'pointer', marginBottom: '10px', display: 'flex', flexDirection: 'row', height: '130px',
      }}
    >
      {/* Left image */}
      <div style={{ width: '110px', flexShrink: 0, position: 'relative', background: BG, overflow: 'hidden' }}>
        {r.image ? (
          <img src={r.image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={32} color={MUTED} />
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top row: type badge + save */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: typeStyle.bg, color: typeStyle.text, flexShrink: 0 }}>{r.type}</span>
            <div style={{ flex: 1 }} />
            <SaveButton itemId={r.id} savedItems={savedItems} onSaveToggle={onSaveToggle} />
          </div>
          <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500, marginBottom: '4px' }}>{r.distance}</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, lineHeight: '1.35', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{r.title}</div>
        </div>

        {/* Bottom row: poster + time ago */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: r.poster.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '8px', fontWeight: 800, color: 'white' }}>{r.poster.initials}</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: TEXT2 }}>{r.poster.name}</span>
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: MUTED }}>{r.postedAgo}</span>
        </div>
      </div>
    </motion.div>
  );
}

const DISTANCE_OPTIONS = ['< 0.5 km', '< 1 km', '< 2 km', 'Any'];

// ---- Filter Panel ----
function FilterPanel({ activeCategories, activeTypes, activeDistance, sort, onCategoryToggle, onTypeToggle, onDistanceChange, onSortChange, onClose, onClear }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: CARD, borderRadius: '20px 20px 0 0', padding: '16px 16px 40px',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.12)', maxHeight: '80vh', overflowY: 'auto',
      }}
    >
      {/* Handle */}
      <div style={{ width: '36px', height: '4px', background: 'rgba(60,60,67,0.15)', borderRadius: '2px', margin: '0 auto 20px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div style={{ fontSize: '17px', fontWeight: 700, color: TEXT }}>Filter Requests</div>
        <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={16} color={TEXT2} />
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT2, marginBottom: '10px' }}>Distance</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {DISTANCE_OPTIONS.map(d => {
            const active = activeDistance === d;
            return (
              <button key={d} onClick={() => onDistanceChange(d)} style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? PRIMARY : BORDER}`, background: active ? '#FFF0EC' : 'transparent', color: active ? PRIMARY : TEXT2, fontWeight: active ? 700 : 500 }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT2, marginBottom: '10px' }}>Sort By</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['Latest', 'Distance'] as const).map(s => {
            const active = sort === s;
            return (
              <button key={s} onClick={() => onSortChange(s)} style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? PRIMARY : BORDER}`, background: active ? '#FFF0EC' : 'transparent', color: active ? PRIMARY : TEXT2, fontWeight: active ? 700 : 500 }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT2, marginBottom: '10px' }}>Category</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {REQUEST_CATEGORIES.map(cat => {
            const active = activeCategories.includes(cat);
            const CatIcon = CAT_ICON_MAP[cat] || ClipboardList;
            return (
              <button key={cat} onClick={() => onCategoryToggle(cat)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '22px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? PRIMARY : BORDER}`, background: active ? '#FFF0EC' : 'transparent', color: active ? PRIMARY : TEXT2, fontWeight: active ? 700 : 500 }}>
                <CatIcon size={13} color={active ? PRIMARY : MUTED} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT2, marginBottom: '10px' }}>Type of Request</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {REQUEST_TYPES.map(type => {
            const active = activeTypes.includes(type);
            const tc = TYPE_COLORS[type];
            return (
              <button key={type} onClick={() => onTypeToggle(type)} style={{ padding: '8px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? tc.text : BORDER}`, background: active ? tc.bg : 'transparent', color: active ? tc.text : TEXT2, fontWeight: active ? 700 : 500 }}>
                {type}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClear} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit' }}>
          Clear All
        </button>
        <button onClick={onClose} style={{ flex: 2, padding: '14px', borderRadius: '14px', background: PRIMARY, border: 'none', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
}

// ---- Requests Feed ----
function RequestsFeed({ requests, savedRequests, onSaveToggle, onSelectRequest, onPost }: { requests: any[]; savedRequests: number[]; onSaveToggle: (id: number) => void; onSelectRequest: (r: any) => void; onPost: () => void }) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeDistance, setActiveDistance] = useState('Any');
  const [sort, setSort] = useState<'Latest' | 'Distance'>('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const submitSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches(prev => [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, 6));
    setSearchQuery(trimmed);
    setSearchOpen(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollProgress(Math.min(e.currentTarget.scrollTop / 60, 1));
  };

  const toggleCategory = (cat: string) => setActiveCategories(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);
  const toggleType = (t: string) => setActiveTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const q = searchQuery.toLowerCase().trim();
  const filtered = requests.filter(r => {
    if (activeCategories.length > 0 && !activeCategories.includes(r.category)) return false;
    if (activeTypes.length > 0 && !activeTypes.includes(r.type)) return false;
    if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    return true;
  });

  const filterCount = activeCategories.length + activeTypes.length + (activeDistance !== 'Any' ? 1 : 0) + (sort !== 'Latest' ? 1 : 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: searchOpen ? 'transparent' : CARD, borderBottom: searchOpen ? 'none' : `0.5px solid ${BORDER}`, flexShrink: 0, position: 'relative', zIndex: searchOpen ? 202 : undefined }}>
        <div style={{ padding: `${44 - (scrollProgress * 4)}px 16px ${12 - (scrollProgress * 4)}px`, display: 'flex', alignItems: 'center', gap: '8px', transition: 'padding 0.1s linear' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            {searchOpen ? (
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={22} color="white" />
              </button>
            ) : (
              <>
                <span style={{ fontSize: `${28 - (scrollProgress * 8)}px`, fontWeight: 800, color: TEXT, letterSpacing: '-0.5px', transition: 'font-size 0.1s linear' }}>Requests</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setSearchOpen(true)}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Search size={18} color={TEXT2} />
                  </button>
                  <button onClick={() => setFilterVisible(true)}
                    style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', background: filterCount > 0 ? '#FFF0EC' : 'rgba(120,120,128,0.10)', border: filterCount > 0 ? `1.5px solid #FFD0C3` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SlidersHorizontal size={17} color={filterCount > 0 ? PRIMARY : TEXT2} />
                    {filterCount > 0 && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px', width: '14px', height: '14px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
                        <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{filterCount}</span>
                      </div>
                    )}
                  </button>
                  <button onClick={onPost}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} color="white" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', position: 'relative' }} onScroll={handleScroll}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>No requests match your filters</div>
        ) : (
          filtered.map(r => <RequestCard key={r.id} r={r} savedItems={savedRequests} onSaveToggle={onSaveToggle} onClick={() => onSelectRequest(r)} />)
        )}
        <div style={{ height: '100px' }} />

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
                position: 'absolute', top: '106px', left: '12px', right: '12px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                zIndex: 201,
                padding: '16px 16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(120,120,128,0.10)', borderRadius: '14px', padding: '12px 14px', marginBottom: recentSearches.length > 0 ? '20px' : 0 }}>
                <Search size={16} color={MUTED} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitSearch(searchQuery); }}
                  placeholder="Search requests..."
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

      <AnimatePresence>
        {filterVisible && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterVisible(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60 }} />
            <FilterPanel
              activeCategories={activeCategories}
              activeTypes={activeTypes}
              activeDistance={activeDistance}
              sort={sort}
              onCategoryToggle={toggleCategory}
              onTypeToggle={toggleType}
              onDistanceChange={setActiveDistance}
              onSortChange={setSort}
              onClose={() => setFilterVisible(false)}
              onClear={() => { setActiveCategories([]); setActiveTypes([]); setActiveDistance('Any'); setSort('Latest'); }}
            />
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// ---- Request Detail ----
function RequestDetail({ request, savedItems, onSaveToggle, onBack, onChat, onViewProfile }: any) {
  if (!request) return null;
  const typeStyle = TYPE_COLORS[request.type] || { bg: BG, text: TEXT2 };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ flex: 1, overflowY: 'auto', background: CARD }}>
        {/* Full-width image header */}
        <div style={{ position: 'relative', width: '100%', height: '260px', background: BG }}>
          {request.image ? (
            <img src={request.image} alt={request.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: request.poster?.color || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={64} color="white" />
            </div>
          )}
          <button onClick={onBack} style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ position: 'absolute', top: '52px', right: '16px' }}>
            <SaveButton itemId={request.id} savedItems={savedItems} onSaveToggle={onSaveToggle} size={18} style={{ width: '38px', height: '38px', backdropFilter: 'blur(8px)' }} />
          </div>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          {/* Title */}
          <div style={{ fontSize: '22px', fontWeight: 700, color: TEXT, lineHeight: '1.3', marginBottom: '20px', letterSpacing: '-0.2px' }}>{request.title}</div>

          {/* Details */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Details</div>
            <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '0 16px' }}>
              {[
                { label: 'Type of Request', value: request.type },
                { label: 'Date Posted', value: request.postedAgo },
                { label: 'Category', value: request.category },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `0.5px solid rgba(60,60,67,0.10)` : 'none' }}>
                  <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: TEXT, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Description</div>
            <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '14px 16px' }}>
              <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.7' }}>{request.description}</div>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>Location</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{request.distance}</div>
            </div>
            <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <CollectionPointMap address={request.collectionPoint} />
            </div>
          </div>

          {/* About the Neighbour */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '12px' }}>About the Neighbour</div>
            <div
              onClick={() => onViewProfile?.({ poster: request.poster, request })}
              style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: request.poster?.color || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{request.poster?.initials || 'N'}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '3px' }}>{request.poster?.name || 'Neighbour'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <Star size={13} color="#FF9500" fill="#FF9500" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{request.poster?.rating ?? '4.8'}</span>
                  <span style={{ fontSize: '12px', color: MUTED }}>· {request.poster?.reviews ?? 0} reviews</span>
                </div>
              </div>
              <ChevronRight size={16} color={MUTED} />
            </div>
          </div>
        </div>
        <div style={{ height: '100px' }} />
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BORDER}`, background: CARD, flexShrink: 0 }}>
        <button
          onClick={onChat}
          style={{ width: '100%', height: '50px', borderRadius: '14px', background: PRIMARY, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Chat
        </button>
      </div>
    </div>
  );
}


const REQUEST_MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1599598425947-5202edd56fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1519689680058-324335c77eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
];

// ---- Post Request Screen ----
function PostRequestScreen({ onBack, onPost }: any) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [collectionPoint, setCollectionPoint] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showPickerSheet, setShowPickerSheet] = useState(false);

  const MAX_CHARS = 280;
  const valid = title.trim() && category && requestType && description.trim() && expiryDate;
  const TILE_SIZE = '100px';
  const removePhoto = (idx: number) => setPhotos(p => p.filter((_, i) => i !== idx));

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '15px',
    outline: 'none',
    color: TEXT,
    background: 'rgba(120,120,128,0.1)',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 16px 18px', borderBottom: `0.5px solid ${BORDER}` }}>
        <button onClick={onBack} style={{ width: '38px', height: '38px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>Post a Request</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Ask your neighbours for help</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px', position: 'relative' }}>
        <FormField label="Images">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {photos.map((p, i) => (
              <div key={i} style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: '12px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: '5px', right: '5px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={11} color="white" />
                </button>
              </div>
            ))}
            {photos.length < 6 && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowPickerSheet(true)}
                style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: '12px', border: '1.5px dashed rgba(60,60,67,0.2)', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: '4px', flexShrink: 0 }}
              >
                <Plus size={20} color={MUTED} />
              </motion.button>
            )}
          </div>
        </FormField>

        <FormField label="Title">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Need help moving boxes"
            style={inputStyle}
          />
        </FormField>

        <FormField label="Category">
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: category ? 600 : 400, color: category ? TEXT : MUTED, cursor: 'pointer' }}
            >
              {category
                ? (() => { const CatIcon = CAT_ICON_MAP[category] || ClipboardList; return <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CatIcon size={15} color={PRIMARY} />{category}</span>; })()
                : 'Select a category'
              }
              <ChevronDown size={16} color={MUTED} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: CARD, borderRadius: '14px', boxShadow: '0 8px 28px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                {REQUEST_CATEGORIES.map((cat, i) => {
                  const CatIcon = CAT_ICON_MAP[cat] || ClipboardList;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setDropdownOpen(false); }}
                      style={{ width: '100%', padding: '13px 16px', border: 'none', background: category === cat ? '#FFF0EC' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit', fontSize: '14px', color: category === cat ? PRIMARY : TEXT, fontWeight: category === cat ? 700 : 400, borderBottom: i < REQUEST_CATEGORIES.length - 1 ? `0.5px solid ${BORDER}` : 'none', textAlign: 'left' }}
                    >
                      <CatIcon size={16} color={category === cat ? PRIMARY : MUTED} />
                      <span style={{ flex: 1 }}>{cat}</span>
                      {category === cat && <Check size={15} color={PRIMARY} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </FormField>

        <FormField label="Type of Request">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {REQUEST_TYPES.map(type => {
              const active = requestType === type;
              const tc = TYPE_COLORS[type];
              return (
                <button key={type} onClick={() => setRequestType(type)} style={{ padding: '9px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? tc.text : BORDER}`, background: active ? tc.bg : 'transparent', color: active ? tc.text : TEXT2, fontWeight: active ? 700 : 400 }}>
                  {type}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label={`Description (${description.length}/${MAX_CHARS})`}>
          <textarea
            value={description}
            onChange={e => e.target.value.length <= MAX_CHARS && setDescription(e.target.value)}
            placeholder="Describe what you need in detail..."
            rows={4}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.5', border: description.length >= MAX_CHARS - 30 ? '1.5px solid #F59E0B' : 'none' }}
          />
          {description.length >= MAX_CHARS - 30 && (
            <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 600, marginTop: '5px' }}>{MAX_CHARS - description.length} characters remaining</div>
          )}
        </FormField>

        <FormField label="Location">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(120,120,128,0.1)' }}>
            <MapPin size={16} color={MUTED} style={{ flexShrink: 0, marginTop: '2px' }} />
            <input
              value={collectionPoint}
              onChange={e => setCollectionPoint(e.target.value)}
              placeholder="Location of request"
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </FormField>

        <FormField label="Post expires on">
          <input
            type="date"
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={inputStyle}
          />
        </FormField>
      </div>

      <div style={{ padding: '12px 16px 32px', borderTop: `0.5px solid ${BORDER}`, background: CARD }}>
        <button
          onClick={() => {
            if (valid) onPost({ title, category, requestType, description, collectionPoint, expiryDate, image: photos[0] || null });
          }}
          disabled={!valid}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            background: valid ? PRIMARY : BORDER, border: 'none',
            color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '16px',
            cursor: valid ? 'pointer' : 'not-allowed',
            boxShadow: valid ? '0 4px 16px rgba(255,107,71,0.35)' : 'none',
            fontFamily: 'inherit',
          }}
        >
          Post Request
        </button>
      </div>

      {/* Photo Picker Sheet */}
      <AnimatePresence>
        {showPickerSheet && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPickerSheet(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
          >
            <motion.div
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: '20px 20px 0 0', padding: '20px 20px 40px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
              <div style={{ fontSize: '17px', fontWeight: 800, color: TEXT, marginBottom: '16px' }}>Add Photo</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => { setPhotos(p => [...p, REQUEST_MOCK_PHOTOS[Math.floor(Math.random() * REQUEST_MOCK_PHOTOS.length)]]); setShowPickerSheet(false); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '52px', padding: '0 12px', borderRadius: '14px', background: '#FFF0EC', border: '1.5px solid #FFD8CC', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Camera size={20} color={PRIMARY} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: PRIMARY }}>Take Photo</span>
                </button>
                <button
                  onClick={() => { setPhotos(p => [...p, REQUEST_MOCK_PHOTOS[Math.floor(Math.random() * REQUEST_MOCK_PHOTOS.length)]]); setShowPickerSheet(false); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '52px', padding: '0 12px', borderRadius: '14px', background: '#EDE9FE', border: '1.5px solid #DDD6FE', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Monitor size={20} color="#7C3AED" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#7C3AED' }}>Library</span>
                </button>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px' }}>Recent Photos</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', overflowY: 'auto' }}>
                {REQUEST_MOCK_PHOTOS.map((photo, i) => (
                  <motion.div key={i} whileTap={{ scale: 0.95 }} onClick={() => { setPhotos(p => [...p, photo]); setShowPickerSheet(false); }}
                    style={{ aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}>
                    <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Chat Screen ----
function ChatScreen({ request, onBack }: any) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'them', text: `Hi! I saw your request "${request?.title}". I'd love to help!`, time: '2:15 PM' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { id: Date.now(), from: 'me', text: input, time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 16px 16px', borderBottom: `0.5px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{ width: '38px', height: '38px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          {request && <PosterAvatar poster={request.poster} size={38} />}
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>{request?.poster?.name}</div>
            <div style={{ fontSize: '11px', color: MUTED }}>Verified resident</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ textAlign: 'center', padding: '4px 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '20px', background: '#F0FDF4', fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>
            <Lock size={14} color="#16A34A" strokeWidth={2} />
            <span>Contact details shared after confirmation</span>
          </div>
        </div>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '78%' }}>
              <div style={{ padding: '11px 16px', borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.from === 'me' ? PRIMARY : CARD, color: msg.from === 'me' ? 'white' : TEXT, fontSize: '14px', lineHeight: '1.5', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '10px', color: MUTED, marginTop: '3px', textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px 24px', background: CARD, borderTop: `0.5px solid ${BORDER}` }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '12px 18px', borderRadius: '22px', border: `1.5px solid ${BORDER}`, background: BG, fontSize: '14px', outline: 'none', color: TEXT, fontFamily: 'inherit' }}
          />
          <button onClick={send} style={{ width: '46px', height: '46px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(255,107,71,0.35)' }}>
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Shared FormField ----
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT2, marginBottom: '6px' }}>{label}</div>
      {children}
    </div>
  );
}

// ---- Main Export ----
interface RequestsPageProps {
  onAddPost?: (post: any) => void;
  initialRequestId?: number;
  onNavVisibilityChange?: (visible: boolean) => void;
}

export function RequestsPage({ onAddPost, initialRequestId, onNavVisibilityChange }: RequestsPageProps = {}) {
  const initialStack: NavFrame[] = initialRequestId
    ? [{ screen: 'feed' }, { screen: 'detail', params: { request: INITIAL_REQUESTS.find(r => r.id === initialRequestId) } }]
    : [{ screen: 'feed' }];
  const [navStack, setNavStack] = useState<NavFrame[]>(initialStack);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [savedRequests, setSavedRequests] = useState<number[]>([]);
  const toggleSave = (id: number) => setSavedRequests(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const current = navStack[navStack.length - 1];
  const goTo = (screen: RequestScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  useEffect(() => {
    onNavVisibilityChange?.(current.screen === 'feed');
  }, [current.screen]);

  const renderScreen = () => {
    switch (current.screen) {
      case 'feed':
        return <RequestsFeed requests={requests} savedRequests={savedRequests} onSaveToggle={toggleSave} onSelectRequest={(r: any) => goTo('detail', { request: r })} onPost={() => goTo('post')} />;
      case 'detail':
        return <RequestDetail request={current.params?.request} savedItems={savedRequests} onSaveToggle={toggleSave} onBack={goBack} onChat={() => goTo('chat', current.params)} onViewProfile={({ poster, request }: any) => goTo('neighbour-profile', { poster, request })} />;
      case 'neighbour-profile':
        return (
          <NeighbourProfilePage
            profile={{
              name: current.params?.poster?.name || 'Neighbour',
              avatar: current.params?.poster?.initials || 'N',
              color: current.params?.poster?.color || '#FF6B47',
              block: 'Bishan-AMK',
              rating: current.params?.poster?.rating,
              reviews: current.params?.poster?.reviews,
            }}
            onBack={goBack}
          />
        );
      case 'post':
        return (
          <PostRequestScreen
            onBack={goBack}
            onPost={(data: any) => {
              const newRequest = {
                id: Date.now(),
                title: data.title,
                category: data.category,
                type: data.requestType,
                description: data.description,
                expiresOn: new Date(data.expiryDate).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
                postedAgo: 'Just now',
                distance: '0.1 km away',
                image: data.image || null,
                verified: true,
                poster: POSTER_AVATARS[0],
                collectionPoint: data.collectionPoint || 'Bishan-AMK Estate',
              };
              setRequests(prev => [newRequest, ...prev]);
              onAddPost?.({
                id: Date.now(),
                type: 'request',
                title: data.title,
                category: data.category,
                status: 'Active',
                emoji: CAT_EMOJIS[data.category] || '📋',
                date: new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
              });
              toast.success('Your request is live! Neighbours have been notified.');
              setNavStack([{ screen: 'feed' }]);
            }}
          />
        );
      case 'chat':
        return <ChatScreen request={current.params?.request} onBack={goBack} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Nunito', sans-serif" }}>
      {renderScreen()}
    </div>
  );
}
