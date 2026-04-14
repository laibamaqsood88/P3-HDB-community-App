import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Shield, X, Send, Check, Star, ChevronRight, Search, Heart, Wrench, BookOpen, Users, Home, Package, Monitor, Smile, Droplets, MapPin, ChevronDown, Camera } from 'lucide-react';
import { toast } from 'sonner';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

type HelpScreen =
  | 'feed' | 'item-detail' | 'service-detail'
  | 'poster-notif' | 'mutual-confirm' | 'chat'
  | 'category-select' | 'item-post-photo' | 'item-post-form' | 'service-post'
  | 'post-success';

type MainFilter = 'Items' | 'Services';
interface NavFrame { screen: HelpScreen; params?: any; }

// ---- Item Category Filters ----
const ITEM_CATEGORIES = [
  'All', 'Babies & Kids', 'Beauty', 'Car Accessories', 'Computers & Tech',
  'Food & Drinks', 'Furniture', 'Health', 'Learning', 'Luxury',
  "Men's Fashion", 'Pet Supplies', 'Photography', 'Sports Equipment',
  'TV & Home Appliances', "Women's Fashion",
];

// ---- Service Category Filters ----
const SERVICE_CATEGORIES = [
  'All', 'Home Help', 'Repairs', 'Cleaning Services', 'Moving',
  'Babysitting & Childcare', 'Pet Care', 'Elderly Companion Care',
  'Tutoring & Coaching', 'Tech Support',
];

// ---- Mock Data ----
const ITEMS_AND_SERVICES = [
  { id: 101, itemType: 'item' as const, name: 'IKEA Billy Bookshelf', condition: 'Good', location: 'Blk 445', price: 'Free', category: 'Furniture', verified: true, description: 'White IKEA Billy bookshelf, 80cm wide. Small scratch on the back panel but otherwise in good condition. Self-collect from Level 5, available on weekends.', method: 'Self-collect', collectionPoint: 'Blk 445, Level 5 Corridor', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 102, itemType: 'item' as const, name: 'Sharp Rice Cooker', condition: 'Like New', location: 'Blk 448', price: '$20', category: 'TV & Home Appliances', verified: true, description: 'Sharp rice cooker, barely used. Moving to a larger unit and already have a bigger one. Comes with measuring cup and steam tray.', method: 'Self-collect or doorstep', collectionPoint: 'Blk 448, Void Deck', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 103, itemType: 'item' as const, name: 'Baby Stroller', condition: 'Good', location: 'Blk 451', price: '$80', category: 'Babies & Kids', verified: true, description: 'Combi stroller in good working condition. All parts intact. Child has outgrown it. Collection at block void deck on weekend afternoons.', method: 'Self-collect', collectionPoint: 'Blk 451, Void Deck', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 104, itemType: 'item' as const, name: 'Assorted Books (10 pcs)', condition: 'Good', location: 'Blk 445', price: 'Free', category: 'Learning', verified: true, description: 'Mix of fiction and non-fiction. Pick what you like, return what you don\'t.', method: 'Doorstep drop-off', collectionPoint: 'Blk 445, Level 4, Leave at door', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 201, itemType: 'service' as const, name: 'Dog Walking', ServiceIcon: Heart, availability: 'Mon, Wed, Fri mornings (7–9 AM)', pastExchanges: 2, responseRate: '90%', verified: true, trust: false, trustNote: '', description: 'Happy to walk your dog in the estate during weekday mornings. Have experience with medium-sized breeds.', avatarColor: '#F97316', category: 'Pet Care', collectionPoint: 'Estate Vicinity' },
  { id: 202, itemType: 'service' as const, name: 'Babysitting', ServiceIcon: Smile, availability: 'Weekday evenings (5–9 PM)', pastExchanges: 5, responseRate: '95%', verified: true, trust: true, trustNote: 'DBS checked', description: 'Experienced babysitter, parent of 2. Happy to look after children aged 2–8.', avatarColor: '#8B5CF6', category: 'Babysitting & Childcare', collectionPoint: 'Bishan-AMK Estate' },
  { id: 203, itemType: 'service' as const, name: 'Primary Math Tutoring', ServiceIcon: BookOpen, availability: 'Weekday evenings', pastExchanges: 8, responseRate: '100%', verified: true, trust: false, trustNote: '', description: 'Retired primary school teacher offering free maths help for P3–P6 students.', avatarColor: '#3B82F6', category: 'Tutoring & Coaching', collectionPoint: 'Blk 445 Community Room' },
  { id: 204, itemType: 'service' as const, name: 'Elderly Companion', ServiceIcon: Users, availability: 'Weekends', pastExchanges: 3, responseRate: '85%', verified: true, trust: true, trustNote: 'First Aid certified', description: 'Volunteer companion for elderly residents who might enjoy some company or light assistance.', avatarColor: '#22C55E', category: 'Elderly Companion Care', collectionPoint: 'Bishan-AMK Estate' },
];

const MOCK_REVIEWS = [
  { id: 1, reviewer: 'Neighbour A', rating: 5, comment: 'Very helpful and punctual! Would definitely recommend.', date: '2 weeks ago', avatarColor: '#8B5CF6' },
  { id: 2, reviewer: 'Neighbour B', rating: 4, comment: 'Good condition, exactly as described. Easy collection.', date: '1 month ago', avatarColor: '#06B6D4' },
  { id: 3, reviewer: 'Neighbour C', rating: 5, comment: 'Great neighbour, very accommodating. Smooth transaction!', date: '3 weeks ago', avatarColor: '#F97316' },
];

const CONDITION_COLORS: Record<string, { bg: string; text: string }> = {
  'Like New': { bg: '#DCFCE7', text: '#16A34A' },
  'Good':     { bg: '#DBEAFE', text: '#2563EB' },
  'Fair':     { bg: '#FEF3C7', text: '#D97706' },
  'New':      { bg: '#EDE9FE', text: '#7C3AED' },
  'Poor':     { bg: '#FEE2E2', text: '#DC2626' },
};

// ---- AI Suggestions ----
const AI_DESCRIPTIONS: Record<string, string> = {
  'Furniture': 'Pre-loved furniture piece in good condition. Minor signs of use but fully functional. Perfect for those looking for affordable home furnishing. Self-collection preferred.',
  'TV & Home Appliances': 'Home appliance in excellent working condition. All original parts included. Reason for selling: upgrading to newer model. Tested and works perfectly.',
  'Babies & Kids': 'Gently used item, great for growing families. Child-safe and well-maintained. All original components present. Selling as child has outgrown it.',
  'Learning': 'Educational materials in good readable condition. Great for students and lifelong learners. Sharing with the community for free.',
  'default': 'Well-maintained item looking for a new home. Good condition overall with minor cosmetic wear. Perfect for any HDB neighbour looking for a great deal.',
};

const AI_CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  'photo_generic': ['Furniture', 'TV & Home Appliances', "Men's Fashion"],
};

// ---- Confetti ----
function Confetti({ onDone }: { onDone: () => void }) {
  const colors = ['#FF6B47', '#FFD700', '#22C55E', '#3B82F6', '#A855F7', '#F97316', '#EC4899', '#06B6D4'];
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: 10 + (i % 9) * 10,
    delay: (i % 6) * 0.08,
    color: colors[i % colors.length],
    size: 6 + (i % 3) * 3,
    shape: i % 3,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: '-10px', rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: 540, opacity: [1, 1, 0] }}
          transition={{ duration: 2.4 + p.delay, ease: [0.25, 0.46, 0.45, 0.94], delay: p.delay }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '0',
            transform: p.shape === 2 ? 'rotate(45deg)' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ---- StarRating ----
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={12} color={i < rating ? '#F59E0B' : BORDER} fill={i < rating ? '#F59E0B' : 'none'} />
      ))}
    </div>
  );
}

// ---- WishlistButton ----
function WishlistButton({ itemId, wishlist, onWishlistToggle }: { itemId: number; wishlist: number[]; onWishlistToggle: (id: number) => void }) {
  const saved = wishlist.includes(itemId);
  return (
    <button
      onClick={() => { onWishlistToggle(itemId); toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist'); }}
      style={{ width: '44px', height: '44px', borderRadius: '14px', background: saved ? '#FFF0EC' : BG, border: `1.5px solid ${saved ? '#FFD8CC' : BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
    >
      <Heart size={18} color={saved ? PRIMARY : MUTED} fill={saved ? PRIMARY : 'none'} />
    </button>
  );
}

// ---- Reviews Section ----
function ReviewsSection() {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '12px' }}>Reviews</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {MOCK_REVIEWS.map(review => (
          <div key={review.id} style={{ background: BG, borderRadius: '16px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: review.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'white' }}>N</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{review.reviewer}</span>
                  <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
              </div>
            </div>
            <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.55', fontWeight: 400 }}>{review.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Map Component ----
function CollectionPointMap({ address }: { address: string }) {
  return (
    <div style={{ borderRadius: '18px', overflow: 'hidden', border: `1px solid ${BORDER}`, marginBottom: '20px' }}>
      <div style={{ position: 'relative', height: '140px', background: 'linear-gradient(135deg, #E8F5E9 0%, #DCEEFB 100%)' }}>
        {[...Array(6)].map((_, i) => <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 25}px`, height: '1px', background: 'rgba(0,0,0,0.05)' }} />)}
        {[...Array(5)].map((_, i) => <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 25}%`, width: '1px', background: 'rgba(0,0,0,0.05)' }} />)}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '12px', background: 'rgba(255,255,255,0.55)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: '12px', background: 'rgba(255,255,255,0.55)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '35%', transform: 'translate(-50%, -100%)' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50% 50% 50% 0', background: PRIMARY, transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,107,71,0.45)' }}>
            <MapPin size={12} color="white" style={{ transform: 'rotate(45deg)' }} />
          </div>
        </div>
      </div>
      <div style={{ background: CARD, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MapPin size={14} color={PRIMARY} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>Collection Point</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{address}</div>
        </div>
      </div>
    </div>
  );
}

// ---- Main Component ----
export function HelpSharePage({ wishlist = [], onWishlistToggle = () => {} }: { wishlist?: number[]; onWishlistToggle?: (id: number) => void }) {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'them', text: "Hi! I saw you're interested. When would work for you?", time: '2:15 PM' },
    { id: 2, from: 'me', text: 'Great! How about Saturday afternoon around 3 PM?', time: '2:17 PM' },
    { id: 3, from: 'system', text: '📞 Contact details have been shared', time: '2:17 PM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const current = navStack[navStack.length - 1];
  const goTo = (screen: HelpScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { id: Date.now(), from: 'me', text: chatInput, time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const handleExpressInterest = () => {
    toast.success('Interest sent — the poster has been notified!');
    setTimeout(() => goTo('poster-notif', current.params), 1200);
  };

  const renderScreen = () => {
    switch (current.screen) {
      case 'feed':
        return (
          <MarketplaceFeed
            onSelectItem={i => goTo('item-detail', { item: i, type: 'item' })}
            onSelectService={s => goTo('service-detail', { item: s, type: 'service' })}
            onPost={() => goTo('category-select')}
            wishlist={wishlist}
          />
        );
      case 'category-select':
        return (
          <CategorySelect
            onBack={goBack}
            onSelectCategory={(cat: string) => {
              if (cat === 'item') goTo('item-post-photo');
              else goTo('service-post');
            }}
          />
        );
      case 'item-detail':
        return <ItemDetail item={current.params?.item} type="item" onBack={goBack} onExpressInterest={handleExpressInterest} wishlist={wishlist} onWishlistToggle={onWishlistToggle} />;
      case 'service-detail':
        return <ItemDetail item={current.params?.item} type="service" onBack={goBack} onExpressInterest={handleExpressInterest} wishlist={wishlist} onWishlistToggle={onWishlistToggle} />;
      case 'poster-notif':
        return <PosterNotification onBack={goBack} onConfirm={() => goTo('mutual-confirm')} onDecline={() => { toast.info('Poster declined — no further action needed'); setNavStack([{ screen: 'feed' }]); }} />;
      case 'mutual-confirm':
        return <MutualConfirm onBack={goBack} onOpenChat={() => goTo('chat')} />;
      case 'chat':
        return <HelpChat messages={chatMessages} input={chatInput} onInputChange={setChatInput} onSend={sendChat} onBack={goBack} item={current.params?.item} />;
      case 'item-post-photo':
        return <ItemPhotoUploadScreen onBack={goBack} onContinue={(photos: string[]) => goTo('item-post-form', { photos })} />;
      case 'item-post-form':
        return (
          <ItemPostScreen
            onBack={goBack}
            photos={current.params?.photos || []}
            onPost={(_data: any) => {
              setShowConfetti(true);
              setNavStack([{ screen: 'feed' }]);
            }}
          />
        );
      case 'service-post':
        return <ServicePostScreen onBack={goBack} onPost={(_data: any) => { toast.success('Your service offer is live!'); setNavStack([{ screen: 'feed' }]); }} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
      {renderScreen()}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </div>
  );
}

// ---- Marketplace Feed ----
function MarketplaceFeed({ onSelectItem, onSelectService, onPost, wishlist }: any) {
  const [mainFilter, setMainFilter] = useState<MainFilter>('Items');
  const [itemCategory, setItemCategory] = useState('All');
  const [serviceCategory, setServiceCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.toLowerCase().trim();

  const allItems = ITEMS_AND_SERVICES.filter(i => i.itemType === 'item');
  const allServices = ITEMS_AND_SERVICES.filter(i => i.itemType === 'service');

  const displayItems = allItems.filter(i =>
    (itemCategory === 'All' || i.category === itemCategory) &&
    (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  );

  const displayServices = allServices.filter(s =>
    (serviceCategory === 'All' || s.category === serviceCategory) &&
    (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 0' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: MUTED }}>📍</span>
            <span style={{ fontSize: '12px', color: MUTED }}>Bishan-AMK Estate</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, lineHeight: 1.15 }}>Marketplace</div>
          <div style={{ fontSize: '13px', color: MUTED, marginTop: '3px', fontWeight: 500 }}>Buy, sell and exchange with neighbours</div>
        </div>
        {/* Main filter: Items | Services */}
        <div style={{ display: 'flex', gap: '4px', background: BG, borderRadius: '16px', padding: '4px', marginBottom: '12px' }}>
          {(['Items', 'Services'] as MainFilter[]).map(tab => (
            <button key={tab} onClick={() => setMainFilter(tab)} style={{ flex: 1, padding: '10px 4px', background: mainFilter === tab ? CARD : 'transparent', border: 'none', cursor: 'pointer', borderRadius: '12px', fontFamily: 'inherit', color: mainFilter === tab ? TEXT : MUTED, fontWeight: mainFilter === tab ? 700 : 500, fontSize: '13px', boxShadow: mainFilter === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease' }}>
              {tab}
            </button>
          ))}
        </div>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '16px', padding: '10px 14px', marginBottom: '0', border: `1.5px solid ${BORDER}` }}>
          <Search size={16} color={MUTED} style={{ flexShrink: 0 }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={`Search ${mainFilter.toLowerCase()}...`} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <X size={14} color={MUTED} />
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
        {/* Category sub-filters */}
        {mainFilter === 'Items' && (
          <>
            <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '14px', scrollbarWidth: 'none' }}>
              {ITEM_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setItemCategory(cat)} style={{ padding: '7px 14px', borderRadius: '22px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, border: `1.5px solid ${itemCategory === cat ? PRIMARY : BORDER}`, background: itemCategory === cat ? '#FFF0EC' : CARD, color: itemCategory === cat ? PRIMARY : TEXT2, fontWeight: itemCategory === cat ? 700 : 500, transition: 'all 0.15s' }}>
                  {cat}
                </button>
              ))}
            </div>
            {displayItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>No items in this category</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {displayItems.map(item => (
                  <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
                ))}
              </div>
            )}
          </>
        )}

        {mainFilter === 'Services' && (
          <>
            <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '14px', scrollbarWidth: 'none' }}>
              {SERVICE_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setServiceCategory(cat)} style={{ padding: '7px 14px', borderRadius: '22px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, border: `1.5px solid ${serviceCategory === cat ? PRIMARY : BORDER}`, background: serviceCategory === cat ? '#FFF0EC' : CARD, color: serviceCategory === cat ? PRIMARY : TEXT2, fontWeight: serviceCategory === cat ? 700 : 500, transition: 'all 0.15s' }}>
                  {cat}
                </button>
              ))}
            </div>
            {displayServices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>No services in this category</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayServices.map(s => <ServiceCard key={s.id} s={s} onClick={() => onSelectService(s)} />)}
              </div>
            )}
          </>
        )}

        <div style={{ height: '80px' }} />
      </div>

      <button onClick={onPost} style={{ position: 'absolute', bottom: '20px', right: '20px', width: '58px', height: '58px', borderRadius: '50%', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(255,107,71,0.45)', zIndex: 10 }}>
        <Plus size={26} color="white" />
      </button>
    </div>
  );
}

// ---- Card sub-components ----
function ItemCard({ item, onClick }: { item: any; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} onClick={onClick} style={{ background: CARD, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', cursor: 'pointer' }}>
      <div style={{ height: '110px', background: BG, position: 'relative', overflow: 'hidden' }}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px' }}>📦</div>
        )}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT, marginBottom: '6px', lineHeight: '1.3' }}>{item.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: item.price === 'Free' ? '#16A34A' : TEXT }}>{item.price}</span>
          <span style={{ padding: '2px 7px', borderRadius: '8px', fontSize: '10px', background: (CONDITION_COLORS[item.condition] || { bg: BG, text: MUTED }).bg, color: (CONDITION_COLORS[item.condition] || { bg: BG, text: MUTED }).text, fontWeight: 700 }}>{item.condition}</span>
        </div>
        <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{item.location}</div>
      </div>
    </motion.div>
  );
}

function ServiceCard({ s, onClick }: { s: any; onClick: () => void }) {
  const IconComp = s.ServiceIcon || Users;
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={onClick} style={{ background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: s.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconComp size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{s.name}</span>
            {s.verified && <Shield size={12} color="#22C55E" />}
          </div>
          <div style={{ fontSize: '12px', color: MUTED, marginBottom: '7px', fontWeight: 500 }}>📅 {s.availability}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>⭐ {s.responseRate}</span>
            <span style={{ fontSize: '11px', color: MUTED }}>·</span>
            <span style={{ fontSize: '11px', color: TEXT2, fontWeight: 500 }}>{s.pastExchanges} exchanges</span>
            {s.trust && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '8px', background: '#DCFCE7', fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>
                <Shield size={9} /> {s.trustNote}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={16} color={MUTED} style={{ flexShrink: 0, marginTop: '4px' }} />
      </div>
    </motion.div>
  );
}

// ---- Category Select ----
function CategorySelect({ onBack, onSelectCategory }: any) {
  const cats = [
    { id: 'item', title: 'List an Item', desc: 'Share an item for free or for sale', emoji: '📦', bg: '#F0FDF4', border: '#A3E6B8', text: '#16A34A' },
    { id: 'service', title: 'Offer a Service', desc: 'Share a skill or help you can offer', emoji: '🤝', bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 20px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>What would you like to post?</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Choose a category to get started</div>
      </div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {cats.map(c => (
          <motion.button key={c.id} whileTap={{ scale: 0.97 }} onClick={() => onSelectCategory(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 20px', borderRadius: '22px', background: c.bg, border: `1.5px solid ${c.border}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
            <span style={{ fontSize: '38px', flexShrink: 0 }}>{c.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>{c.title}</div>
              <div style={{ fontSize: '13px', color: TEXT2, fontWeight: 400 }}>{c.desc}</div>
            </div>
            <ChevronRight size={18} color={MUTED} style={{ flexShrink: 0 }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ---- Item Detail ----
function ItemDetail({ item, type, onBack, onExpressInterest, wishlist, onWishlistToggle }: any) {
  if (!item) return null;
  const getTitle = () => item.title || item.name || item.type;
  const getSubInfo = () => {
    if (type === 'item') return [{ label: 'Condition', value: item.condition }, { label: 'Collection', value: item.method }, { label: 'Location', value: item.location }];
    if (type === 'service') return [{ label: 'Availability', value: item.availability }, { label: 'Response rate', value: item.responseRate }, { label: 'Past exchanges', value: `${item.pastExchanges} completed` }];
    return [];
  };
  const subInfo = getSubInfo();
  const IconComp = item.ServiceIcon || Users;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px', borderBottom: `1px solid ${BG}` }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '22px', overflow: 'hidden', flexShrink: 0 }}>
            {type === 'item' && item.image ? (
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : type === 'service' ? (
              <div style={{ width: '100%', height: '100%', background: item.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconComp size={28} color="white" />
              </div>
            ) : (
              <div style={{ width: '100%', height: '100%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px' }}>📦</div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '8px', lineHeight: '1.25' }}>{getTitle()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
              {item.verified && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '4px 10px', borderRadius: '10px', background: '#DCFCE7', fontSize: '11px', color: '#16A34A', fontWeight: 700 }}>
                  <Shield size={10} /> Verified
                </span>
              )}
              {type === 'item' && (
                <span style={{ fontSize: '17px', fontWeight: 800, color: item.price === 'Free' ? '#16A34A' : TEXT }}>{item.price}</span>
              )}
            </div>
          </div>
          <WishlistButton itemId={item.id} wishlist={wishlist} onWishlistToggle={onWishlistToggle} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ background: BG, borderRadius: '18px', padding: '16px', marginBottom: '20px' }}>
          {subInfo.map((info, i) => (
            <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < subInfo.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{info.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{info.value}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Details</div>
          <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.7' }}>{item.description}</div>
        </div>

        {/* Collection point map */}
        {item.collectionPoint && (
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '12px' }}>Collection Point</div>
            <CollectionPointMap address={item.collectionPoint} />
          </div>
        )}

        {item.trust && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', background: '#F0FDF4', borderRadius: '16px', marginBottom: '16px' }}>
            <Shield size={16} color="#22C55E" />
            <span style={{ fontSize: '13px', color: '#15803D', fontWeight: 600 }}>Trust signal: {item.trustNote}</span>
          </div>
        )}

        <div style={{ padding: '14px 16px', background: '#FFF0EC', borderRadius: '16px', border: '1px solid #FFD8CC', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: PRIMARY, fontWeight: 500 }}>
            🔒 Contact details only shared after both parties confirm. No obligation to proceed.
          </div>
        </div>

        <ReviewsSection />
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={onExpressInterest} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,71,0.38)', marginBottom: '10px', fontFamily: 'inherit' }}>
          Express Interest
        </button>
        <button onClick={onBack} style={{ width: '100%', padding: '12px', borderRadius: '18px', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: '14px', fontFamily: 'inherit' }}>
          No Thanks
        </button>
      </div>
    </div>
  );
}

// ---- Poster Notification ----
function PosterNotification({ onBack, onConfirm, onDecline }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '52px 20px 18px', borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '26px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px', fontSize: '36px' }}>🔔</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '10px' }}>Someone's Interested!</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px', fontWeight: 400 }}>A verified resident has expressed interest in your listing.</div>
        <div style={{ width: '100%', background: CARD, borderRadius: '22px', padding: '20px', marginBottom: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>N2</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>Neighbour #2</span>
                <Shield size={13} color="#22C55E" />
              </div>
              <span style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>Nearby · 3 past exchanges</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(255,107,71,0.3)' }}>Confirm</button>
            <button onClick={onDecline} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: BG, border: `1.5px solid ${BORDER}`, color: TEXT2, fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Decline</button>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: MUTED, textAlign: 'center', fontWeight: 500 }}>No contact details shared until confirmed.</div>
      </div>
    </div>
  );
}

// ---- Mutual Confirm ----
function MutualConfirm({ onBack, onOpenChat }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px 100px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px', fontSize: '40px' }}>🤝</div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '10px' }}>You're Both Confirmed!</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px' }}>A chat has been opened. Contact details will be shared inside.</div>
        <div style={{ width: '100%', background: '#F0FDF4', borderRadius: '18px', padding: '16px 18px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Shield size={16} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#15803D', lineHeight: '1.55', fontWeight: 500 }}>Both parties confirmed. Contact details are now securely shared.</span>
        </div>
        <button onClick={onOpenChat} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,71,0.38)', fontFamily: 'inherit' }}>Open Chat</button>
      </div>
    </div>
  );
}

// ---- Help Chat ----
function HelpChat({ messages, input, onInputChange, onSend, onBack, item }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '52px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>N2</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>Neighbour #2</span>
              <Shield size={12} color="#22C55E" />
            </div>
            <span style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>Verified resident</span>
          </div>
        </div>
        <div style={{ padding: '9px 13px', background: BG, borderRadius: '12px', fontSize: '12px', color: TEXT2, fontWeight: 500 }}>
          📦 Re: {item?.name || item?.type || 'Your listing'}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg: any) => {
          if (msg.from === 'system') {
            return (
              <div key={msg.id} style={{ textAlign: 'center', padding: '4px 0' }}>
                <span style={{ padding: '6px 16px', borderRadius: '20px', background: '#F0FDF4', fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>{msg.text}</span>
              </div>
            );
          }
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '78%' }}>
                <div style={{ padding: '11px 16px', borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.from === 'me' ? PRIMARY : CARD, color: msg.from === 'me' ? 'white' : TEXT, fontSize: '14px', lineHeight: '1.5', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '10px', color: MUTED, marginTop: '3px', textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '12px 16px 24px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && onSend()} placeholder="Type a message..." style={{ flex: 1, padding: '12px 18px', borderRadius: '22px', border: `1.5px solid ${BORDER}`, background: BG, fontSize: '14px', outline: 'none', color: TEXT, fontFamily: 'inherit' }} />
          <button onClick={onSend} style={{ width: '46px', height: '46px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(255,107,71,0.35)' }}>
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Item Photo Upload Screen ----
function ItemPhotoUploadScreen({ onBack, onContinue }: any) {
  const [photos, setPhotos] = useState<string[]>([]);
  const SAMPLE_PHOTOS = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  ];

  const addPhoto = () => {
    if (photos.length < 3) {
      setPhotos(p => [...p, SAMPLE_PHOTOS[p.length % SAMPLE_PHOTOS.length]]);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>Add Photos</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Add up to 3 photos — AI will help write your listing</div>
      </div>

      <div style={{ flex: 1, padding: '0 20px 20px' }}>
        {photos.length === 0 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={addPhoto} style={{ width: '100%', height: '240px', borderRadius: '24px', border: `2.5px dashed ${BORDER}`, background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: '12px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={26} color={PRIMARY} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>Tap to add photos</div>
              <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>Supported: JPG, PNG</div>
            </div>
          </motion.button>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: photos.length === 1 ? '1fr' : '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              {photos.map((photo, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: photos.length === 1 ? '220px' : '140px' }}>
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={13} color="white" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <motion.button whileTap={{ scale: 0.96 }} onClick={addPhoto} style={{ height: photos.length === 0 ? '220px' : '140px', borderRadius: '16px', border: `2px dashed ${BORDER}`, background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: '6px' }}>
                  <Camera size={22} color={MUTED} />
                  <span style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>Add more</span>
                </motion.button>
              )}
            </div>
            <div style={{ padding: '12px 16px', background: '#FFF0EC', borderRadius: '14px', border: '1px solid #FFD8CC', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: PRIMARY, fontWeight: 600 }}>✨ AI will auto-generate your listing title and description</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => photos.length > 0 && onContinue(photos)} disabled={photos.length === 0} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: photos.length > 0 ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: photos.length > 0 ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: photos.length > 0 ? 'pointer' : 'not-allowed', boxShadow: photos.length > 0 ? '0 8px 24px rgba(255,107,71,0.38)' : 'none', fontFamily: 'inherit' }}>
          Continue → Generate Listing
        </button>
      </div>
    </div>
  );
}

// ---- Item Post Form (after AI generates) ----
function ItemPostScreen({ onBack, photos, onPost }: any) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [collectionPoint, setCollectionPoint] = useState('');
  const [price, setPrice] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const FORM_ITEM_CATEGORIES = ITEM_CATEGORIES.filter(c => c !== 'All');
  const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    const t = setTimeout(() => {
      // Simulate AI generating listing
      setItemName('Pre-loved Home Item in Great Condition');
      setDescription(AI_DESCRIPTIONS['default']);
      setCategory('Furniture');
      setIsGenerating(false);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const valid = itemName.trim() && category && condition && collectionPoint.trim();

  if (isGenerating) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: CARD, gap: '20px', padding: '40px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #FF6B47, #FF8C70)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '26px' }}>✨</span>
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '8px' }}>AI is analysing your photos...</div>
          <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Generating title, description & category suggestions</div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: PRIMARY }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT }}>Review Listing</div>
          <span style={{ padding: '4px 10px', borderRadius: '10px', background: '#FFF0EC', fontSize: '11px', color: PRIMARY, fontWeight: 700 }}>✨ AI Generated</span>
        </div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Review and edit before posting</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        {/* Photos strip */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {photos.map((p: string, i: number) => (
            <div key={i} style={{ width: '80px', height: '80px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        <FormField label="Item Name">
          <input value={itemName} onChange={e => setItemName(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${PRIMARY}`, fontSize: '14px', outline: 'none', color: TEXT, background: '#FFFDF9', boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: 600 }} />
        </FormField>

        <FormField label="Category (AI suggested)">
          <div style={{ position: 'relative' }}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${dropdownOpen ? PRIMARY : '#22C55E'}`, fontSize: '14px', background: '#F0FDF4', color: TEXT, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, boxSizing: 'border-box' }}>
              {category || 'Select category'}
              <ChevronDown size={16} color={MUTED} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: CARD, borderRadius: '16px', boxShadow: '0 8px 28px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden', border: `1px solid ${BORDER}`, maxHeight: '200px', overflowY: 'auto' }}>
                {FORM_ITEM_CATEGORIES.map((cat, i) => (
                  <button key={cat} onClick={() => { setCategory(cat); setDropdownOpen(false); }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: category === cat ? '#FFF0EC' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', fontSize: '13px', color: category === cat ? PRIMARY : TEXT, fontWeight: category === cat ? 700 : 400, borderBottom: i < FORM_ITEM_CATEGORIES.length - 1 ? `1px solid ${BG}` : 'none', textAlign: 'left' }}>
                    {cat}
                    {category === cat && <Check size={15} color={PRIMARY} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField label="Description (AI generated)">
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid #22C55E`, fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: '#F0FDF4', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>

        <FormField label="Condition">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CONDITIONS.map(c => {
              const active = condition === c;
              const cs = CONDITION_COLORS[c] || { bg: BG, text: TEXT2 };
              return (
                <button key={c} onClick={() => setCondition(c)} style={{ padding: '9px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? cs.text : BORDER}`, background: active ? cs.bg : 'transparent', color: active ? cs.text : TEXT2, fontWeight: active ? 700 : 400 }}>
                  {c}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Asking Price">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, background: BG }}>
            <span style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>$</span>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="0 for free" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </FormField>

        <FormField label="Collection Point">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, background: BG }}>
            <MapPin size={16} color={MUTED} style={{ flexShrink: 0 }} />
            <input value={collectionPoint} onChange={e => setCollectionPoint(e.target.value)} placeholder="e.g. Blk 445, Void Deck" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </FormField>
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => valid && onPost({ itemName, description, category, condition, price, collectionPoint, photos })} disabled={!valid} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: valid ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 8px 24px rgba(255,107,71,0.38)' : 'none', fontFamily: 'inherit' }}>
          Post Listing
        </button>
      </div>
    </div>
  );
}

// ---- Service Post Screen ----
function ServicePostScreen({ onBack, onPost }: any) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState('');
  const [notes, setNotes] = useState('');
  const [collectionPoint, setCollectionPoint] = useState('');

  const SERVICE_FORM_CATS = SERVICE_CATEGORIES.filter(c => c !== 'All');
  const valid = category && description && availability;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>Offer a Service</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Share your skills with the community</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <FormField label="Service Category">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SERVICE_FORM_CATS.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 14px', borderRadius: '22px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${category === c ? PRIMARY : BORDER}`, background: category === c ? '#FFF0EC' : 'transparent', color: category === c ? PRIMARY : TEXT2, fontWeight: category === c ? 700 : 400 }}>
                {c}
              </button>
            ))}
          </div>
        </FormField>
        <FormField label="Description">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the service you're offering..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>
        <FormField label="Availability">
          <input value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Weekday evenings, Weekends" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>
        <FormField label="Service Location / Collection Point">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, background: BG }}>
            <MapPin size={16} color={MUTED} style={{ flexShrink: 0 }} />
            <input value={collectionPoint} onChange={e => setCollectionPoint(e.target.value)} placeholder="e.g. Bishan-AMK Estate, your unit" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </FormField>
        <FormField label="Trust Signal (optional)">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any relevant credentials, DBS check, references..." rows={2} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>
      </div>
      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => valid && onPost({ category, description, availability, notes, collectionPoint })} disabled={!valid} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: valid ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 8px 24px rgba(255,107,71,0.38)' : 'none', fontFamily: 'inherit' }}>
          Post Service
        </button>
      </div>
    </div>
  );
}

// ---- Shared FormField ----
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>{label}</div>
      {children}
    </div>
  );
}
