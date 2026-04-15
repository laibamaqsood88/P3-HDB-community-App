import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, X, SlidersHorizontal, MapPin, MessageCircle, Heart,
  ChevronDown, Check, Send, Search, Lock,
  Home as HomeIcon, ShoppingCart, Wrench, Package, BookOpen, Handshake,
  ShoppingBag, Search as SearchIcon, ClipboardList, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// ---- Design tokens ----
const BG = '#F7F7F7';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

type RequestScreen = 'feed' | 'detail' | 'post' | 'chat';
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
  { name: 'Sarah T.', color: '#8B5CF6', initials: 'ST' },
  { name: 'Ahmad K.', color: '#3B82F6', initials: 'AK' },
  { name: 'Mei Lin', color: '#F97316', initials: 'ML' },
  { name: 'Ravi S.', color: '#22C55E', initials: 'RS' },
  { name: 'Jennifer L.', color: '#EC4899', initials: 'JL' },
];

const INITIAL_REQUESTS = [
  { id: 1, title: 'Need someone to water my plants', category: 'Home Help', type: 'Free Request', description: 'Need someone to water my 4 potted plants while I\'m away travelling. Easy — just water once every 2 days. Plants are by the window sill.', expiresOn: '25 Apr 2026', verified: true, poster: POSTER_AVATARS[0], collectionPoint: 'Blk 445, Level 5, #05-22' },
  { id: 2, title: 'Help moving sofa to void deck', category: 'Moving', type: 'Paid Request', description: 'Need a hand moving a sofa from Level 8 to ground floor void deck for disposal. Only takes 30 mins with 2 people. Will pay $20 for the help.', expiresOn: '20 Apr 2026', verified: true, poster: POSTER_AVATARS[1], collectionPoint: 'Blk 448, Void Deck' },
  { id: 3, title: 'Looking for P5 Math assessment books', category: 'Items Needed', type: 'Borrow', description: 'My daughter is in P5 and we are looking for any spare Math or English assessment books. Happy to borrow for 2 weeks and return in good condition.', expiresOn: '30 Apr 2026', verified: true, poster: POSTER_AVATARS[2], collectionPoint: 'Blk 451, Level 3 Corridor' },
  { id: 4, title: 'Lost: Orange tabby cat near Blk 443', category: 'Lost Items', type: 'Free Request', description: 'Lost my orange tabby cat Milo near Blk 443 last Sunday evening. Very friendly, wearing a blue collar with a bell. Please contact if spotted!', expiresOn: '28 Apr 2026', verified: true, poster: POSTER_AVATARS[3], collectionPoint: 'Blk 443 Area' },
  { id: 5, title: 'Need help fixing leaking kitchen tap', category: 'Repairs', type: 'Paid Request', description: 'Kitchen tap has been dripping for a week. Looking for someone handy who can fix it. Will pay for parts and a small appreciation fee.', expiresOn: '22 Apr 2026', verified: true, poster: POSTER_AVATARS[4], collectionPoint: 'Blk 445, Level 8, #08-11' },
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

// ---- Request Card ----
function RequestCard({ r, onClick }: { r: any; onClick: () => void }) {
  const typeStyle = TYPE_COLORS[r.type] || { bg: BG, text: TEXT2 };
  const CatIcon = CAT_ICON_MAP[r.category] || ClipboardList;
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: CARD, borderRadius: '14px', padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        cursor: 'pointer', marginBottom: '10px',
      }}
    >
      {/* Icon + content row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CatIcon size={20} color={PRIMARY} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: typeStyle.bg, color: typeStyle.text }}>{r.type}</span>
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: TEXT, marginBottom: '5px', lineHeight: '1.35' }}>{r.title}</div>
          <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.5', marginBottom: '10px' }}>{r.description.slice(0, 80)}...</div>
          {/* Poster row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: r.poster.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>{r.poster.initials}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: TEXT }}>{r.poster.name}</span>
            {r.verified && <CheckCircle size={12} color="#34C759" />}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: MUTED }}>Expires {r.expiresOn}</span>
          </div>
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
function RequestsFeed({ requests, onSelectRequest, onPost }: { requests: any[]; onSelectRequest: (r: any) => void; onPost: () => void }) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeDistance, setActiveDistance] = useState('Any');
  const [sort, setSort] = useState<'Latest' | 'Distance'>('Latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      <div style={{ background: CARD, borderBottom: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ padding: `52px 16px ${14 - (scrollProgress * 6)}px`, display: 'flex', alignItems: 'center', gap: '8px', transition: 'padding 0.1s linear' }}>
          <AnimatePresence mode="wait" initial={false}>
            {!searchOpen ? (
              <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: `${28 - (scrollProgress * 12)}px`, fontWeight: 800, color: TEXT, letterSpacing: '-0.5px', transition: 'font-size 0.1s linear' }}>Requests</span>
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
                </div>
              </motion.div>
            ) : (
              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '8px' }}>
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronLeft size={20} color={TEXT} />
                </button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '50px', background: 'rgba(120,120,128,0.10)' }}>
                  <Search size={14} color={MUTED} />
                  <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search requests..."
                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={14} color={MUTED} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', position: 'relative' }} onScroll={handleScroll}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>No requests match your filters</div>
        ) : (
          filtered.map(r => <RequestCard key={r.id} r={r} onClick={() => onSelectRequest(r)} />)
        )}
        <div style={{ height: '100px' }} />

        {/* Liquid glass overlay when search is active */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(247,247,247,0.72)', backdropFilter: 'blur(20px) saturate(1.8)', WebkitBackdropFilter: 'blur(20px) saturate(1.8)', zIndex: 30, cursor: 'pointer' }} />
          )}
        </AnimatePresence>
      </div>

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

      {/* FAB */}
      <button
        onClick={onPost}
        style={{
          position: 'absolute', bottom: '88px', right: '20px',
          width: '54px', height: '54px', borderRadius: '50%',
          background: PRIMARY, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(255,107,71,0.38)', zIndex: 10,
        }}
      >
        <Plus size={24} color="white" />
      </button>
    </div>
  );
}

// ---- Request Detail ----
function RequestDetail({ request, onBack, onChat }: any) {
  const [saved, setSaved] = useState(false);
  if (!request) return null;
  const typeStyle = TYPE_COLORS[request.type] || { bg: BG, text: TEXT2 };
  const CatIcon = CAT_ICON_MAP[request.category] || ClipboardList;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 16px 18px', borderBottom: `0.5px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <button
            onClick={onBack}
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { setSaved(s => !s); toast.success(saved ? 'Removed from saved' : 'Saved!'); }}
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: saved ? '#FFF0EC' : BG, border: `1.5px solid ${saved ? '#FFD8CC' : BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Heart size={16} color={saved ? PRIMARY : MUTED} fill={saved ? PRIMARY : 'none'} />
          </button>
        </div>

        {/* Poster row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <PosterAvatar poster={request.poster} size={48} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>{request.poster.name}</span>
              {request.verified && <CheckCircle size={14} color="#34C759" />}
            </div>
            <div style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>Bishan-AMK Estate · Verified Resident</div>
          </div>
          <span style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '11px', background: typeStyle.bg, color: typeStyle.text, fontWeight: 700 }}>{request.type}</span>
        </div>

        {/* Category badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', background: '#FFF0EC', color: PRIMARY, fontWeight: 700 }}>
          <CatIcon size={13} color={PRIMARY} />
          {request.category}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px' }}>
        {/* Title */}
        <div style={{ fontSize: '22px', fontWeight: 700, color: TEXT, marginBottom: '12px', lineHeight: '1.3' }}>{request.title}</div>

        {/* Description card */}
        <div style={{ background: CARD, borderRadius: '14px', padding: '16px', marginBottom: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Description</div>
          <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.7' }}>{request.description}</div>
        </div>

        {/* Expiry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', background: '#FEF2F2', borderRadius: '14px', marginBottom: '14px' }}>
          <span style={{ fontSize: '16px' }}>⏰</span>
          <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 600 }}>Expires on {request.expiresOn}</span>
        </div>

        {/* Map card */}
        <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
          <CollectionPointMap address={request.collectionPoint} />
        </div>

        {/* Privacy note */}
        <div style={{ padding: '14px 16px', background: '#FFF0EC', borderRadius: '14px', border: '1px solid #FFD8CC', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: PRIMARY, fontWeight: 500 }}>
            <Lock size={16} color={PRIMARY} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Contact details only shared after both parties confirm. No obligation to proceed.</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 32px', borderTop: `0.5px solid ${BORDER}`, background: CARD }}>
        <button
          onClick={onChat}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            background: PRIMARY, border: 'none', color: 'white',
            fontWeight: 700, fontSize: '16px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255,107,71,0.35)', marginBottom: '10px',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <MessageCircle size={18} color="white" /> Chat with Neighbour
        </button>
        <button onClick={onBack} style={{ width: '100%', padding: '12px', borderRadius: '14px', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: '14px', fontFamily: 'inherit' }}>
          Go Back
        </button>
      </div>
    </div>
  );
}

// ---- Post Request Screen ----
function PostRequestScreen({ onBack, onPost }: any) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [collectionPoint, setCollectionPoint] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const MAX_CHARS = 280;
  const SUGGESTED = ['Home Help', 'Errands', 'Items Needed'];
  const valid = title.trim() && category && requestType && description.trim() && expiryDate;

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
      <div style={{ background: CARD, padding: '52px 16px 18px', borderBottom: `0.5px solid ${BORDER}` }}>
        <button onClick={onBack} style={{ width: '38px', height: '38px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>Post a Request</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Ask your neighbours for help</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 20px' }}>
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
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500, marginBottom: '7px' }}>Suggested</div>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              {SUGGESTED.map(s => {
                const CatIcon = CAT_ICON_MAP[s] || ClipboardList;
                return (
                  <button
                    key={s}
                    onClick={() => setCategory(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${category === s ? PRIMARY : BORDER}`, background: category === s ? '#FFF0EC' : CARD, color: category === s ? PRIMARY : TEXT2, fontWeight: category === s ? 700 : 500 }}
                  >
                    <CatIcon size={12} color={category === s ? PRIMARY : MUTED} />
                    {s}
                  </button>
                );
              })}
            </div>
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
          <input
            value={collectionPoint}
            onChange={e => setCollectionPoint(e.target.value)}
            placeholder="Location of request"
            style={inputStyle}
          />
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
            if (valid) onPost({ title, category, requestType, description, collectionPoint, expiryDate });
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
      <div style={{ background: CARD, padding: '52px 16px 16px', borderBottom: `0.5px solid ${BORDER}` }}>
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

  const current = navStack[navStack.length - 1];
  const goTo = (screen: RequestScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  useEffect(() => {
    onNavVisibilityChange?.(current.screen === 'feed');
  }, [current.screen]);

  const renderScreen = () => {
    switch (current.screen) {
      case 'feed':
        return <RequestsFeed requests={requests} onSelectRequest={(r: any) => goTo('detail', { request: r })} onPost={() => goTo('post')} />;
      case 'detail':
        return <RequestDetail request={current.params?.request} onBack={goBack} onChat={() => goTo('chat', current.params)} />;
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
                verified: true,
                poster: POSTER_AVATARS[0],
                collectionPoint: data.collectionPoint || 'Bishan-AMK Estate',
              };
              setRequests(prev => [newRequest, ...prev]);
              // Notify parent for profile posts
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
