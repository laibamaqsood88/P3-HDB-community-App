import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Shield, Clock, X, Send, Check, Bell, Star, ChevronRight, Search, Heart } from 'lucide-react';
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
  | 'feed' | 'category-select'
  | 'request-detail' | 'item-detail' | 'service-detail'
  | 'poster-notif' | 'mutual-confirm' | 'chat'
  | 'request-post' | 'item-post' | 'service-post'
  | 'post-live';

type FeedTab = 'Requests' | 'Items & Services';
type ItemsFilter = 'All' | 'Items' | 'Services';

interface NavFrame { screen: HelpScreen; params?: any; }

// ---- Mock Data ----
const REQUESTS = [
  { id: 1, category: 'Plant Care', emoji: '🪴', description: 'Need someone to water my 4 potted plants while I\'m away travelling. Easy — just water once every 2 days.', timeframe: 'Apr 15–22', expiresIn: '2 days', verified: true, trust: 3, poster: 'Resident A' },
  { id: 2, category: 'Moving Help', emoji: '📦', description: 'Need a hand moving a sofa from Level 8 to ground floor void deck for disposal. Only takes 30 mins with 2 people.', timeframe: 'This weekend', expiresIn: '1 day', verified: true, trust: 5, poster: 'Resident B' },
  { id: 3, category: 'Carpool', emoji: '🚗', description: 'Looking for carpool to Changi Airport Terminal 3 on 15 Apr morning, departing around 6 AM from Blk 445.', timeframe: '15 Apr, 6 AM', expiresIn: '5 days', verified: true, trust: 2, poster: 'Resident C' },
  { id: 4, category: 'Food Share', emoji: '🍱', description: 'Cooked too much curry tonight! Happy to share 2-3 portions with neighbours. First come first served.', timeframe: 'Tonight only', expiresIn: '3 hours', verified: true, trust: 7, poster: 'Resident D' },
];

const ITEMS_AND_SERVICES = [
  // Items
  { id: 101, itemType: 'item' as const, name: 'IKEA Billy Bookshelf', condition: 'Good', location: 'Blk 445', price: 'Free', emoji: '📚', category: 'Furniture', verified: true, description: 'White IKEA Billy bookshelf, 80cm wide. Small scratch on the back panel but otherwise in good condition. Self-collect from Level 5, available on weekends.', method: 'Self-collect' },
  { id: 102, itemType: 'item' as const, name: 'Sharp Rice Cooker', condition: 'Like New', location: 'Blk 448', price: '$20', emoji: '🍚', category: 'Kitchen', verified: true, description: 'Sharp rice cooker, barely used. Moving to a larger unit and already have a bigger one. Comes with measuring cup and steam tray.', method: 'Self-collect or doorstep' },
  { id: 103, itemType: 'item' as const, name: 'Baby Stroller', condition: 'Good', location: 'Blk 451', price: '$80', emoji: '👶', category: 'Baby & Kids', verified: true, description: 'Combi stroller in good working condition. All parts intact. Child has outgrown it. Collection at block void deck on weekend afternoons.', method: 'Self-collect' },
  { id: 104, itemType: 'item' as const, name: 'Assorted Books (10 pcs)', condition: 'Good', location: 'Blk 445', price: 'Free', emoji: '📖', category: 'Books', verified: true, description: 'Mix of fiction and non-fiction. Pick what you like, return what you don\'t.', method: 'Doorstep drop-off' },
  // Services
  { id: 201, itemType: 'service' as const, name: 'Dog Walking', emoji: '🐕', availability: 'Mon, Wed, Fri mornings (7–9 AM)', pastExchanges: 2, responseRate: '90%', verified: true, trust: false, trustNote: '', description: 'Happy to walk your dog in the estate during weekday mornings. Have experience with medium-sized breeds.', avatarColor: '#F97316', category: 'Pets' },
  { id: 202, itemType: 'service' as const, name: 'Babysitting', emoji: '👶', availability: 'Weekday evenings (5–9 PM)', pastExchanges: 5, responseRate: '95%', verified: true, trust: true, trustNote: 'DBS checked', description: 'Experienced babysitter, parent of 2. Happy to look after children aged 2–8.', avatarColor: '#8B5CF6', category: 'Family' },
  { id: 203, itemType: 'service' as const, name: 'Primary Math Tutoring', emoji: '📐', availability: 'Weekday evenings', pastExchanges: 8, responseRate: '100%', verified: true, trust: false, trustNote: '', description: 'Retired primary school teacher offering free maths help for P3–P6 students.', avatarColor: '#3B82F6', category: 'Education' },
  { id: 204, itemType: 'service' as const, name: 'Elderly Companion', emoji: '🤝', availability: 'Weekends', pastExchanges: 3, responseRate: '85%', verified: true, trust: true, trustNote: 'First Aid certified', description: 'Volunteer companion for elderly residents who might enjoy some company.', avatarColor: '#22C55E', category: 'Elderly' },
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
};

// ---- StarRating ----
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          color={i < rating ? '#F59E0B' : BORDER}
          fill={i < rating ? '#F59E0B' : 'none'}
        />
      ))}
    </div>
  );
}

// ---- WishlistButton ----
function WishlistButton({ itemId, wishlist, onWishlistToggle }: { itemId: number; wishlist: number[]; onWishlistToggle: (id: number) => void }) {
  const saved = wishlist.includes(itemId);
  return (
    <button
      onClick={() => {
        onWishlistToggle(itemId);
        toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist');
      }}
      style={{
        width: '44px', height: '44px', borderRadius: '14px',
        background: saved ? '#FFF0EC' : BG,
        border: `1.5px solid ${saved ? '#FFD8CC' : BORDER}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
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

// ---- Main Component ----
export function HelpSharePage({ wishlist = [], onWishlistToggle = () => {} }: { wishlist?: number[]; onWishlistToggle?: (id: number) => void }) {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'feed' }]);
  const [feedTab, setFeedTab] = useState<FeedTab>('Requests');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'them', text: 'Hi! I saw you\'re interested. When would work for you?', time: '2:15 PM' },
    { id: 2, from: 'me', text: 'Great! How about Saturday afternoon around 3 PM?', time: '2:17 PM' },
    { id: 3, from: 'system', text: '📞 Contact details have been shared', time: '2:17 PM' },
  ]);
  const [chatInput, setChatInput] = useState('');

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
            feedTab={feedTab}
            onTabChange={setFeedTab}
            onSelectRequest={r => goTo('request-detail', { item: r, type: 'request' })}
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
              if (cat === 'request') goTo('request-post');
              else if (cat === 'item') goTo('item-post');
              else goTo('service-post');
            }}
          />
        );
      case 'request-detail':
        return (
          <ItemDetail
            item={current.params?.item}
            type="request"
            onBack={goBack}
            onExpressInterest={handleExpressInterest}
            wishlist={wishlist}
            onWishlistToggle={onWishlistToggle}
          />
        );
      case 'item-detail':
        return (
          <ItemDetail
            item={current.params?.item}
            type="item"
            onBack={goBack}
            onExpressInterest={handleExpressInterest}
            wishlist={wishlist}
            onWishlistToggle={onWishlistToggle}
          />
        );
      case 'service-detail':
        return (
          <ItemDetail
            item={current.params?.item}
            type="service"
            onBack={goBack}
            onExpressInterest={handleExpressInterest}
            wishlist={wishlist}
            onWishlistToggle={onWishlistToggle}
          />
        );
      case 'poster-notif':
        return (
          <PosterNotification
            onBack={goBack}
            onConfirm={() => goTo('mutual-confirm')}
            onDecline={() => { toast.info('Poster declined — no further action needed'); setNavStack([{ screen: 'feed' }]); }}
          />
        );
      case 'mutual-confirm':
        return <MutualConfirm onBack={goBack} onOpenChat={() => goTo('chat')} />;
      case 'chat':
        return (
          <HelpChat
            messages={chatMessages}
            input={chatInput}
            onInputChange={setChatInput}
            onSend={sendChat}
            onBack={goBack}
            item={current.params?.item}
          />
        );
      case 'request-post':
        return (
          <RequestPostScreen
            onBack={goBack}
            onPost={(_data: any) => { toast.success('Your post is live — matched neighbours notified!'); setNavStack([{ screen: 'feed' }]); }}
          />
        );
      case 'item-post':
        return (
          <ItemPostScreen
            onBack={goBack}
            onPost={(_data: any) => { toast.success('Your listing is live — matched neighbours notified!'); setNavStack([{ screen: 'feed' }]); }}
          />
        );
      case 'service-post':
        return (
          <ServicePostScreen
            onBack={goBack}
            onPost={(_data: any) => { toast.success('Your service offer is live!'); setNavStack([{ screen: 'feed' }]); }}
          />
        );
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
      {renderScreen()}
    </div>
  );
}

// ---- Marketplace Feed ----
function MarketplaceFeed({ feedTab, onTabChange, onSelectRequest, onSelectItem, onSelectService, onPost, wishlist }: any) {
  const tabs: FeedTab[] = ['Requests', 'Items & Services'];
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsFilter, setItemsFilter] = useState<ItemsFilter>('All');

  const q = searchQuery.toLowerCase().trim();

  const filteredRequests = REQUESTS.filter(r =>
    !q || r.category.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
  );

  const filteredItemsAndServices = ITEMS_AND_SERVICES.filter(i =>
    !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );

  const isSearchActive = q.length > 0;

  const searchItems = filteredItemsAndServices.filter(i => i.itemType === 'item');
  const searchServices = filteredItemsAndServices.filter(i => i.itemType === 'service');

  const displayItems = ITEMS_AND_SERVICES.filter(i => i.itemType === 'item').filter(i =>
    !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );
  const displayServices = ITEMS_AND_SERVICES.filter(i => i.itemType === 'service').filter(i =>
    !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: CARD, padding: '52px 20px 0' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: MUTED }}>📍</span>
            <span style={{ fontSize: '12px', color: MUTED }}>Bishan-AMK Estate</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, lineHeight: 1.15 }}>Marketplace</div>
          <div style={{ fontSize: '13px', color: MUTED, marginTop: '3px', fontWeight: 500 }}>Exchange favours and items with neighbours</div>
        </div>
        {/* Segment control */}
        <div style={{ display: 'flex', gap: '4px', background: BG, borderRadius: '16px', padding: '4px', marginBottom: '14px' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => onTabChange(tab)} style={{
              flex: 1, padding: '10px 4px', background: feedTab === tab ? CARD : 'transparent',
              border: 'none', cursor: 'pointer', borderRadius: '12px', fontFamily: 'inherit',
              color: feedTab === tab ? TEXT : MUTED,
              fontWeight: feedTab === tab ? 700 : 500, fontSize: '13px',
              boxShadow: feedTab === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
            }}>{tab}</button>
          ))}
        </div>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '16px', padding: '10px 14px', marginBottom: '14px', border: `1.5px solid ${BORDER}` }}>
          <Search size={16} color={MUTED} style={{ flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search requests, items and services..."
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <X size={14} color={MUTED} />
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* Matched banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'linear-gradient(135deg, #FFF0EC, #FFF7F5)', borderRadius: '18px', marginBottom: '16px', border: '1px solid #FFD8CC' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Star size={16} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: PRIMARY }}>Matched for you</div>
            <div style={{ fontSize: '11px', color: '#FF8C70', fontWeight: 500 }}>Based on your location & interests in the estate</div>
          </div>
        </div>

        {/* Search active: show results from all categories in a single unified list */}
        {isSearchActive && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredRequests.length > 0 && (
              <>
                <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Requests</div>
                {filteredRequests.map(r => (
                  <RequestCard key={r.id} r={r} onClick={() => onSelectRequest(r)} />
                ))}
              </>
            )}
            {searchItems.length > 0 && (
              <>
                <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px', marginBottom: '2px' }}>Items</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {searchItems.map(i => (
                    <ItemCard key={i.id} item={i} onClick={() => onSelectItem(i)} />
                  ))}
                </div>
              </>
            )}
            {searchServices.length > 0 && (
              <>
                <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px', marginBottom: '2px' }}>Services</div>
                {searchServices.map(s => (
                  <ServiceCard key={s.id} s={s} onClick={() => onSelectService(s)} />
                ))}
              </>
            )}
            {filteredRequests.length === 0 && searchItems.length === 0 && searchServices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>
                No results for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Normal feed (no search active) */}
        {!isSearchActive && feedTab === 'Requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {REQUESTS.map(r => (
              <RequestCard key={r.id} r={r} onClick={() => onSelectRequest(r)} />
            ))}
          </div>
        )}

        {!isSearchActive && feedTab === 'Items & Services' && (
          <>
            {/* Filter chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '14px', scrollbarWidth: 'none' }}>
              {(['All', 'Items', 'Services'] as ItemsFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setItemsFilter(f)}
                  style={{
                    padding: '7px 18px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer',
                    fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
                    border: `1.5px solid ${itemsFilter === f ? PRIMARY : BORDER}`,
                    background: itemsFilter === f ? '#FFF0EC' : CARD,
                    color: itemsFilter === f ? PRIMARY : TEXT2,
                    fontWeight: itemsFilter === f ? 700 : 500,
                    transition: 'all 0.15s',
                  }}
                >{f}</button>
              ))}
            </div>

            {(itemsFilter === 'All' || itemsFilter === 'Items') && (
              <>
                {itemsFilter === 'All' && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Items</div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  {displayItems.map(item => (
                    <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
                  ))}
                </div>
              </>
            )}

            {(itemsFilter === 'All' || itemsFilter === 'Services') && (
              <>
                <div style={{ fontSize: '12px', fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Services</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {displayServices.map(s => (
                    <ServiceCard key={s.id} s={s} onClick={() => onSelectService(s)} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div style={{ height: '80px' }} />
      </div>

      {/* FAB */}
      <button onClick={onPost} style={{ position: 'absolute', bottom: '20px', right: '20px', width: '58px', height: '58px', borderRadius: '50%', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(255,107,71,0.45)', zIndex: 10 }}>
        <Plus size={26} color="white" />
      </button>
    </div>
  );
}

// ---- Card sub-components ----
function RequestCard({ r, onClick }: { r: any; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={onClick} style={{ background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
          {r.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px', flexWrap: 'wrap' }}>
            <span style={{ padding: '3px 9px', borderRadius: '10px', fontSize: '10px', background: BG, color: TEXT2, fontWeight: 700 }}>{r.category}</span>
            {r.verified && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '10px', background: '#DCFCE7', fontSize: '10px', color: '#16A34A', fontWeight: 700 }}><Shield size={9} /> Verified</span>}
            <span style={{ padding: '3px 9px', borderRadius: '10px', fontSize: '10px', background: '#FEF2F2', color: '#EF4444', fontWeight: 700, marginLeft: 'auto' }}>
              Expires {r.expiresIn}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: TEXT, lineHeight: '1.5', marginBottom: '8px', fontWeight: 500 }}>{r.description.slice(0, 80)}...</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: MUTED, fontWeight: 500 }}>
            <Clock size={11} color={MUTED} /> {r.timeframe}
          </div>
        </div>
        <ChevronRight size={16} color={MUTED} style={{ flexShrink: 0, marginTop: '4px' }} />
      </div>
    </motion.div>
  );
}

function ItemCard({ item, onClick }: { item: any; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} onClick={onClick} style={{ background: CARD, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', cursor: 'pointer' }}>
      <div style={{ height: '96px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px' }}>
        {item.emoji}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: TEXT, marginBottom: '6px', lineHeight: '1.3' }}>{item.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: item.price === 'Free' ? '#16A34A' : TEXT }}>{item.price}</span>
          <span style={{ padding: '2px 7px', borderRadius: '8px', fontSize: '10px', background: (CONDITION_COLORS[item.condition] || { bg: BG, text: MUTED }).bg, color: (CONDITION_COLORS[item.condition] || { bg: BG, text: MUTED }).text, fontWeight: 700 }}>
            {item.condition}
          </span>
        </div>
        <div style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}>{item.location}</div>
      </div>
    </motion.div>
  );
}

function ServiceCard({ s, onClick }: { s: any; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} onClick={onClick} style={{ background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.055)', cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: s.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
          {s.emoji}
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
    { id: 'request', title: 'Post a Request', desc: 'Ask neighbours for help or a favour', emoji: '🙋', bg: '#FFF0EC', border: '#FFD8CC', text: PRIMARY },
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
          <motion.button key={c.id} whileTap={{ scale: 0.97 }} onClick={() => onSelectCategory(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 20px', borderRadius: '22px',
            background: c.bg, border: `1.5px solid ${c.border}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
          }}>
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
  const getEmoji = () => item.emoji || '📋';
  const getTitle = () => item.title || item.name || item.type;
  const getSubInfo = () => {
    if (type === 'request') return [{ label: 'Timeframe', value: item.timeframe }, { label: 'Expires in', value: item.expiresIn }];
    if (type === 'item') return [{ label: 'Condition', value: item.condition }, { label: 'Collection', value: item.method }, { label: 'Location', value: item.location }];
    if (type === 'service') return [{ label: 'Availability', value: item.availability }, { label: 'Response rate', value: item.responseRate }, { label: 'Past exchanges', value: `${item.pastExchanges} completed` }];
    return [];
  };
  const subInfo = getSubInfo();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px', borderBottom: `1px solid ${BG}` }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '22px', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', flexShrink: 0 }}>
            {getEmoji()}
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
              {type === 'request' && (
                <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', background: '#FEF2F2', color: '#EF4444', fontWeight: 700 }}>Expires {item.expiresIn}</span>
              )}
            </div>
          </div>
          <WishlistButton itemId={item.id} wishlist={wishlist} onWishlistToggle={onWishlistToggle} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Info grid */}
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

        {/* Reviews */}
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
        <div style={{ width: '80px', height: '80px', borderRadius: '26px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px', fontSize: '36px' }}>
          🔔
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '10px' }}>Someone's Interested!</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px', fontWeight: 400 }}>
          A verified resident has expressed interest in your post. View their profile to decide if you'd like to proceed.
        </div>
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
            <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(255,107,71,0.3)' }}>
              Confirm
            </button>
            <button onClick={onDecline} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: BG, border: `1.5px solid ${BORDER}`, color: TEXT2, fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
              Decline
            </button>
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
        <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px', fontSize: '40px' }}>
          🤝
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '10px' }}>You're Both Confirmed!</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px' }}>
          A chat has been opened for you. Contact details will be shared inside once you're both ready.
        </div>
        <div style={{ width: '100%', background: '#F0FDF4', borderRadius: '18px', padding: '16px 18px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Shield size={16} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#15803D', lineHeight: '1.55', fontWeight: 500 }}>Both parties confirmed. Contact details are now securely shared. The listing will be marked as in progress.</span>
        </div>
        <button onClick={onOpenChat} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,71,0.38)', fontFamily: 'inherit' }}>
          Open Chat
        </button>
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
          📦 Re: {item?.name || item?.type || item?.category || 'Your post'}
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
          <input value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} placeholder="Type a message..." style={{ flex: 1, padding: '12px 18px', borderRadius: '22px', border: `1.5px solid ${BORDER}`, background: BG, fontSize: '14px', outline: 'none', color: TEXT, fontFamily: 'inherit' }} />
          <button onClick={onSend} style={{ width: '46px', height: '46px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(255,107,71,0.35)' }}>
            <Send size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Request Post Screen ----
function RequestPostScreen({ onBack, onPost }: any) {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [expiry, setExpiry] = useState('');
  const cats = ['Plant Care', 'Moving Help', 'Carpool', 'Food Share', 'Pet Care', 'Tech Help', 'Other'];
  const expiryOpts = ['1 day', '3 days', '7 days', '14 days'];
  const valid = category && description && expiry;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>Post a Request</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Ask your neighbours for help</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <FormField label="Category">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cats.map(c => <ChipBtn key={c} label={c} selected={category === c} onSelect={() => setCategory(c)} />)}
          </div>
        </FormField>
        <FormField label="Description">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you need..." rows={4} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>
        <FormField label="Timeframe (optional)">
          <input value={timeframe} onChange={e => setTimeframe(e.target.value)} placeholder="e.g. This weekend, Apr 15–22" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>
        <FormField label="Post expires in">
          <div style={{ display: 'flex', gap: '8px' }}>
            {expiryOpts.map(e => <ChipBtn key={e} label={e} selected={expiry === e} onSelect={() => setExpiry(e)} />)}
          </div>
        </FormField>
      </div>
      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => valid && onPost({ category, description, timeframe, expiry })} disabled={!valid} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: valid ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 8px 24px rgba(255,107,71,0.38)' : 'none', fontFamily: 'inherit' }}>
          Post Request
        </button>
      </div>
    </div>
  );
}

// ---- Item Post Screen (formerly Listing Post) ----
function ItemPostScreen({ onBack, onPost }: any) {
  const [category, setCategory] = useState('');
  const [itemName, setItemName] = useState('');
  const [condition, setCondition] = useState('');
  const [method, setMethod] = useState('');
  const cats = ['Furniture', 'Kitchen', 'Electronics', 'Baby & Kids', 'Books', 'Clothing', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const methods = ['Self-collect', 'Doorstep drop', 'Meet at void deck'];
  const valid = category && itemName && condition && method;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '12px', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>List an Item</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Share an item with your neighbours</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
        <FormField label="Category">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cats.map(c => <ChipBtn key={c} label={c} selected={category === c} onSelect={() => setCategory(c)} />)}
          </div>
        </FormField>
        <FormField label="Item Name">
          <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. IKEA Billy Bookshelf" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>
        <FormField label="Condition">
          <div style={{ display: 'flex', gap: '8px' }}>
            {conditions.map(c => <ChipBtn key={c} label={c} selected={condition === c} onSelect={() => setCondition(c)} />)}
          </div>
        </FormField>
        <FormField label="Photo">
          <div style={{ height: '110px', borderRadius: '16px', border: `2px dashed ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: BG }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>📷</div>
              <div style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>Tap to add photo</div>
            </div>
          </div>
        </FormField>
        <FormField label="Collection Method">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {methods.map(m => <ChipBtn key={m} label={m} selected={method === m} onSelect={() => setMethod(m)} />)}
          </div>
        </FormField>
      </div>
      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => valid && onPost({ category, itemName, condition, method })} disabled={!valid} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: valid ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 8px 24px rgba(255,107,71,0.38)' : 'none', fontFamily: 'inherit' }}>
          List Item
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
  const cats = ['Childcare', 'Elder Care', 'Pet Care', 'Tutoring', 'Home Help', 'Tech Help', 'Other'];
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
            {cats.map(c => <ChipBtn key={c} label={c} selected={category === c} onSelect={() => setCategory(c)} />)}
          </div>
        </FormField>
        <FormField label="Description">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the service you're offering..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>
        <FormField label="Availability">
          <input value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Weekday evenings, Weekends" style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>
        <FormField label="Trust Signal (optional)">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any relevant experience, credentials, or references..." rows={2} style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', border: `1.5px solid ${BORDER}`, fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: BG, boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>
      </div>
      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BG}` }}>
        <button onClick={() => valid && onPost({ category, description, availability, notes })} disabled={!valid} style={{ width: '100%', padding: '17px', borderRadius: '22px', background: valid ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '15px', cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 8px 24px rgba(255,107,71,0.38)' : 'none', fontFamily: 'inherit' }}>
          Post Service
        </button>
      </div>
    </div>
  );
}

// ---- Shared UI helpers ----
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>{label}</div>
      {children}
    </div>
  );
}

function ChipBtn({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} style={{
      padding: '9px 16px', borderRadius: '22px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
      border: `1.5px solid ${selected ? PRIMARY : BORDER}`,
      background: selected ? '#FFF0EC' : 'transparent',
      color: selected ? PRIMARY : TEXT2,
      fontWeight: selected ? 700 : 400, transition: 'all 0.15s',
    }}>{label}</button>
  );
}
