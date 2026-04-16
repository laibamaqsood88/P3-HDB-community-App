import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Plus, Shield, ShieldCheck, X, Send, Check, Star, ChevronRight, Search,
  Wrench, BookOpen, Users, Home, Package, Monitor, Droplets, MapPin,
  ChevronDown, Camera, SlidersHorizontal, Bookmark, Heart, Leaf, Dog,
  Baby, GraduationCap, UserCheck, SquareArrowOutUpRight
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

type HelpScreen =
  | 'feed' | 'item-detail' | 'service-detail' | 'neighbour-profile'
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
  { id: 101, itemType: 'item' as const, name: 'IKEA Billy Bookshelf', condition: 'lightly used', distance: '0.3 km away', postedTime: '2 hours ago', price: 'Free', category: 'Furniture', brand: 'IKEA', verified: true, description: 'White IKEA Billy bookshelf, 80cm wide. Small scratch on the back panel but otherwise in great condition. Self-collect from Level 5, available on weekends.', collectionAddress: 'Blk 445 Ang Mo Kio Ave 10, #05-12, Singapore 560445', collectionDistance: '0.3 km away', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Yusra', avatarColor: '#FF6B47', rating: 4.8, reviews: 12 } },
  { id: 102, itemType: 'item' as const, name: 'Sharp Rice Cooker', condition: 'like new', distance: '0.6 km away', postedTime: '5 hours ago', price: '$20', category: 'TV & Home Appliances', brand: 'Sharp', verified: true, description: 'Sharp rice cooker, barely used. Moving to a larger unit and already have a bigger one. Comes with measuring cup and steam tray.', collectionAddress: 'Blk 448 Ang Mo Kio Ave 10, #02-08, Singapore 560448', collectionDistance: '0.6 km away', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Ahmad', avatarColor: '#3B82F6', rating: 4.5, reviews: 8 } },
  { id: 103, itemType: 'item' as const, name: 'Baby Stroller', condition: 'well used', distance: '1.1 km away', postedTime: '1 day ago', price: '$80', category: 'Babies & Kids', brand: 'Combi', verified: true, description: 'Combi stroller in good working condition. All parts intact. Child has outgrown it. Collection at void deck on weekend afternoons.', collectionAddress: 'Blk 451 Bishan Street 14, Void Deck, Singapore 570451', collectionDistance: '1.1 km away', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Mei Lin', avatarColor: '#8B5CF6', rating: 4.9, reviews: 21 } },
  { id: 104, itemType: 'item' as const, name: 'Assorted Books (10 pcs)', condition: 'well used', distance: '0.3 km away', postedTime: '3 days ago', price: 'Free', category: 'Learning', brand: '', verified: true, description: 'Mix of fiction and non-fiction. Pick what you like, return what you don\'t.', collectionAddress: 'Blk 445 Ang Mo Kio Ave 10, #04-22, Singapore 560445', collectionDistance: '0.3 km away', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Rajan', avatarColor: '#059669', rating: 4.7, reviews: 5 } },
  { id: 105, itemType: 'item' as const, name: 'Standing Fan', condition: 'lightly used', distance: '0.7 km away', postedTime: '4 days ago', price: '$15', category: 'TV & Home Appliances', brand: 'Panasonic', verified: true, description: 'Panasonic 16-inch standing fan, 3-speed settings. Works perfectly, upgrading to air-con. Collect from void deck.', collectionAddress: 'Blk 449 Ang Mo Kio Ave 10, #01-01, Singapore 560449', collectionDistance: '0.7 km away', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Hafiz', avatarColor: '#0EA5E9', rating: 4.6, reviews: 7 } },
  { id: 106, itemType: 'item' as const, name: 'Dining Table (4-seater)', condition: 'well used', distance: '0.9 km away', postedTime: '5 days ago', price: '$50', category: 'Furniture', brand: '', verified: true, description: 'Solid wood dining table with 4 matching chairs. Minor scratches on surface. Moving overseas, must clear.', collectionAddress: 'Blk 453 Bishan Street 14, #03-18, Singapore 570453', collectionDistance: '0.9 km away', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Linda', avatarColor: '#EC4899', rating: 4.8, reviews: 14 } },
  { id: 107, itemType: 'item' as const, name: 'Yoga Mat', condition: 'like new', distance: '0.4 km away', postedTime: '1 week ago', price: '$10', category: 'Sports & Outdoors', brand: 'Lululemon', verified: true, description: 'Lululemon yoga mat, barely used — only 3 sessions. Non-slip surface, comes with strap.', collectionAddress: 'Blk 446 Ang Mo Kio Ave 10, #08-05, Singapore 560446', collectionDistance: '0.4 km away', image: 'https://images.unsplash.com/photo-1601925228096-3eb255ae8e9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Sarah', avatarColor: '#A855F7', rating: 5.0, reviews: 3 } },
  { id: 108, itemType: 'item' as const, name: 'Laptop Bag', condition: 'lightly used', distance: '0.5 km away', postedTime: '1 week ago', price: '$12', category: 'Bags & Luggage', brand: 'Targus', verified: true, description: 'Targus 15-inch laptop bag with padded compartment. Good condition, switching to a backpack.', collectionAddress: 'Blk 447 Ang Mo Kio Ave 10, #06-11, Singapore 560447', collectionDistance: '0.5 km away', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Kevin', avatarColor: '#14B8A6', rating: 4.4, reviews: 6 } },
  { id: 109, itemType: 'item' as const, name: 'Kids Bicycle (20")', condition: 'well used', distance: '1.0 km away', postedTime: '2 weeks ago', price: '$35', category: 'Babies & Kids', brand: 'Trek', verified: true, description: 'Trek kids bike for ages 6–9. Brakes work well, tyres in good shape. Helmet included.', collectionAddress: 'Blk 510 Bishan Street 13, #01-01, Singapore 570510', collectionDistance: '1.0 km away', image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'David', avatarColor: '#F59E0B', rating: 4.7, reviews: 10 } },
  { id: 110, itemType: 'item' as const, name: 'Potted Snake Plant', condition: 'like new', distance: '0.2 km away', postedTime: '2 weeks ago', price: 'Free', category: 'Home & Garden', brand: '', verified: true, description: 'Healthy snake plant about 40cm tall. Low maintenance, great for indoors. Propagated from my own plant — collect with pot.', collectionAddress: 'Blk 444 Ang Mo Kio Ave 10, #07-03, Singapore 560444', collectionDistance: '0.2 km away', image: 'https://images.unsplash.com/photo-1599598425947-5202edd56fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', seller: { name: 'Nurul', avatarColor: '#22C55E', rating: 4.9, reviews: 8 } },
  { id: 201, itemType: 'service' as const, name: 'Dog Walking', rate: '$15 per walk', distance: '0.5 km away', serviceAddress: 'Blk 447 Ang Mo Kio Ave 10, Singapore 560447', postedTime: '1 day ago', category: 'Pet Care', availability: 'Mon, Wed, Fri mornings (7–9 AM)', verified: true, trust: false, trustNote: '', description: 'Happy to walk your dog in the estate during weekday mornings. Have experience with medium-sized breeds. All dogs welcome — can handle up to 2 dogs per session.', responseTime: 'Replies within a few hours', completedServices: 12, yearsExperience: 3, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'James', avatarColor: '#F97316', rating: 4.7, reviews: 9 } },
  { id: 202, itemType: 'service' as const, name: 'Babysitting', rate: '$12 per hour', distance: '0.8 km away', serviceAddress: 'Blk 452 Bishan Street 14, Singapore 570452', postedTime: '2 days ago', category: 'Babysitting & Childcare', availability: 'Weekday evenings (5–9 PM)', verified: true, trust: true, trustNote: 'DBS checked', description: 'Experienced babysitter, parent of 2. Happy to look after children aged 2–8. Meals can be prepared on request. References available.', responseTime: 'Replies within 1 hour', completedServices: 28, yearsExperience: 5, image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Siti', avatarColor: '#8B5CF6', rating: 4.9, reviews: 18 } },
  { id: 203, itemType: 'service' as const, name: 'Primary Math Tutoring', rate: 'Free', distance: '0.3 km away', serviceAddress: 'Blk 445 Ang Mo Kio Ave 10, Singapore 560445', postedTime: '3 days ago', category: 'Tutoring & Coaching', availability: 'Weekday evenings', verified: true, trust: false, trustNote: '', description: 'Retired primary school teacher offering free maths help for P3–P6 students. 25 years of teaching experience. Small group sessions available.', responseTime: 'Replies within a day', completedServices: 34, yearsExperience: 25, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b6f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Mr Tan', avatarColor: '#3B82F6', rating: 5.0, reviews: 22 } },
  { id: 204, itemType: 'service' as const, name: 'Elderly Companion', rate: 'Free', distance: '1.2 km away', serviceAddress: 'Blk 512 Bishan Street 13, Singapore 570512', postedTime: '5 days ago', category: 'Elderly Companion Care', availability: 'Weekends', verified: true, trust: true, trustNote: 'First Aid certified', description: 'Volunteer companion for elderly residents who might enjoy some company or light assistance. Happy to accompany for walks, grocery runs, or just a chat.', responseTime: 'Replies within a few hours', completedServices: 15, yearsExperience: 2, image: 'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Priya', avatarColor: '#22C55E', rating: 4.8, reviews: 11 } },
  { id: 205, itemType: 'service' as const, name: 'Home Cleaning', rate: '$25 per session', distance: '0.6 km away', serviceAddress: 'Blk 448 Ang Mo Kio Ave 10, Singapore 560448', postedTime: '1 week ago', category: 'Home Cleaning', availability: 'Weekends, weekday afternoons', verified: true, trust: true, trustNote: 'Police clearance done', description: 'Thorough home cleaning for HDB flats up to 4-room. Bring own equipment and eco-friendly supplies. Flexible scheduling — contact me to discuss.', responseTime: 'Replies within a few hours', completedServices: 41, yearsExperience: 6, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Aisha', avatarColor: '#EC4899', rating: 4.8, reviews: 27 } },
  { id: 206, itemType: 'service' as const, name: 'Basic Plumbing Repair', rate: '$30 per visit', distance: '0.4 km away', serviceAddress: 'Blk 446 Ang Mo Kio Ave 10, Singapore 560446', postedTime: '1 week ago', category: 'Home Repair & Handyman', availability: 'Evenings and weekends', verified: true, trust: false, trustNote: '', description: 'Retired plumber offering basic pipe repairs, tap replacements and leakage fixes. 20 years trade experience. Parts charged at cost. No job too small.', responseTime: 'Replies within a few hours', completedServices: 19, yearsExperience: 20, image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Uncle Raj', avatarColor: '#F59E0B', rating: 4.6, reviews: 15 } },
  { id: 207, itemType: 'service' as const, name: 'Grocery Errand Run', rate: 'Free', distance: '0.3 km away', serviceAddress: 'Blk 445 Ang Mo Kio Ave 10, Singapore 560445', postedTime: '2 weeks ago', category: 'Errands & Delivery', availability: 'Tue & Thu mornings', verified: true, trust: false, trustNote: '', description: 'Happy to pick up groceries for elderly or mobility-limited neighbours on my regular marketing trips to AMK market. Just share your list and reimburse cost — no charge.', responseTime: 'Replies within a day', completedServices: 8, yearsExperience: 1, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Mrs Lim', avatarColor: '#06B6D4', rating: 5.0, reviews: 6 } },
  { id: 208, itemType: 'service' as const, name: 'Secondary English Tutor', rate: '$20 per hour', distance: '0.7 km away', serviceAddress: 'Blk 449 Ang Mo Kio Ave 10, Singapore 560449', postedTime: '2 weeks ago', category: 'Tutoring & Coaching', availability: 'Weekday evenings, Sat mornings', verified: true, trust: true, trustNote: 'MOE-trained teacher', description: 'Full-time English teacher offering private tuition for Sec 1–4. Focus on comprehension, essay writing and oral. Small groups (max 3) or 1-to-1 available.', responseTime: 'Replies within 1 hour', completedServices: 52, yearsExperience: 8, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Ms Chen', avatarColor: '#A855F7', rating: 4.9, reviews: 33 } },
  { id: 209, itemType: 'service' as const, name: 'Cat Boarding', rate: '$18 per night', distance: '0.9 km away', serviceAddress: 'Blk 453 Bishan Street 14, Singapore 570453', postedTime: '3 weeks ago', category: 'Pet Care', availability: 'Year-round, book in advance', verified: true, trust: true, trustNote: 'AVS licensed boarder', description: 'Licensed home boarding for cats — up to 2 cats at a time. Spacious cat-friendly home, daily updates with photos. Experienced with timid and senior cats.', responseTime: 'Replies within a few hours', completedServices: 36, yearsExperience: 4, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Wendy', avatarColor: '#14B8A6', rating: 4.7, reviews: 21 } },
  { id: 210, itemType: 'service' as const, name: 'Furniture Assembly', rate: '$15 per item', distance: '0.5 km away', serviceAddress: 'Blk 447 Ang Mo Kio Ave 10, Singapore 560447', postedTime: '3 weeks ago', category: 'Home Repair & Handyman', availability: 'Weekends', verified: true, trust: false, trustNote: '', description: 'Handy with tools and happy to help assemble IKEA or flat-pack furniture. Bring own toolkit. Up to 3 items per visit. Quick and reliable — done within the day.', responseTime: 'Replies within a few hours', completedServices: 23, yearsExperience: 3, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', provider: { name: 'Ahmad', avatarColor: '#0EA5E9', rating: 4.5, reviews: 17 } },
];

const MOCK_REVIEWS = [
  { id: 1, reviewer: 'Neighbour A', rating: 5, comment: 'Very helpful and punctual! Would definitely recommend.', date: '2 weeks ago', avatarColor: '#8B5CF6' },
  { id: 2, reviewer: 'Neighbour B', rating: 4, comment: 'Good condition, exactly as described. Easy collection.', date: '1 month ago', avatarColor: '#06B6D4' },
  { id: 3, reviewer: 'Neighbour C', rating: 5, comment: 'Great neighbour, very accommodating. Smooth transaction!', date: '3 weeks ago', avatarColor: '#F97316' },
];

const CONDITION_COLORS: Record<string, { bg: string; text: string }> = {
  'brand new':    { bg: '#EDE9FE', text: '#7C3AED' },
  'like new':     { bg: '#DCFCE7', text: '#16A34A' },
  'lightly used': { bg: '#DBEAFE', text: '#2563EB' },
  'well used':    { bg: '#FEF3C7', text: '#D97706' },
  'heavily used': { bg: '#FEE2E2', text: '#DC2626' },
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
        <Star key={i} size={12} color={i < rating ? '#FF9500' : BORDER} fill={i < rating ? '#FF9500' : 'none'} />
      ))}
    </div>
  );
}

// ---- SaveButton (Bookmark) ----
function SaveButton({ itemId, savedItems, onSaveToggle, size = 18, style: extraStyle = {} }: { itemId: number; savedItems: number[]; onSaveToggle: (id: number) => void; size?: number; style?: React.CSSProperties }) {
  const saved = savedItems.includes(itemId);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSaveToggle(itemId); toast.success(saved ? 'Removed from saved' : 'Item saved'); }}
      style={{ width: '30px', height: '30px', borderRadius: '50%', background: saved ? '#FFF0EC' : 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...extraStyle }}
    >
      <Bookmark size={size} color={saved ? PRIMARY : MUTED} fill={saved ? PRIMARY : 'none'} />
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
          <div key={review.id} style={{ background: BG, borderRadius: '14px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: review.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
function CollectionPointMap({ address, distanceText }: { address?: string; distanceText?: string }) {
  const isService = !!distanceText;
  const footerLabel = isService ? 'Service Area' : 'Collection Point';
  const footerText = distanceText || address || 'To be confirmed';
  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
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
      <div style={{ background: CARD, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
          <MapPin size={14} color={PRIMARY} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, lineHeight: '1.4' }}>{footerText}</div>
        </div>
      </div>
    </div>
  );
}

// ---- Main Component ----
export function HelpSharePage({ onAddPost, initialItemId, savedItems = [], onSaveToggle: externalSaveToggle, onNavVisibilityChange, onOpenChat }: { onAddPost?: (post: any) => void; initialItemId?: number; savedItems?: number[]; onSaveToggle?: (id: number, item: any) => void; onNavVisibilityChange?: (visible: boolean) => void; onOpenChat?: (item: any) => void }) {
  const onSaveToggle = (id: number) => {
    const item = ITEMS_AND_SERVICES.find(i => i.id === id);
    externalSaveToggle?.(id, item);
  };
  const initialStack: NavFrame[] = (() => {
    if (initialItemId) {
      const item = ITEMS_AND_SERVICES.find(i => i.id === initialItemId);
      if (item) return [{ screen: 'feed' }, { screen: item.itemType === 'service' ? 'service-detail' : 'item-detail', params: { item, type: item.itemType } }];
    }
    return [{ screen: 'feed' }];
  })();
  const [navStack, setNavStack] = useState<NavFrame[]>(initialStack);
  const [mainFilter, setMainFilter] = useState<MainFilter>('Items');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, from: 'them', text: "Hi! I saw you're interested. When would work for you?", time: '2:15 PM' },
    { id: 2, from: 'me', text: 'Great! How about Saturday afternoon around 3 PM?', time: '2:17 PM' },
    { id: 3, from: 'system', text: 'Contact details have been shared', time: '2:17 PM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const current = navStack[navStack.length - 1];
  const goTo = (screen: HelpScreen, params?: any) => setNavStack(p => [...p, { screen, params }]);
  const goBack = () => setNavStack(p => p.length > 1 ? p.slice(0, -1) : p);

  useEffect(() => {
    onNavVisibilityChange?.(current.screen === 'feed');
  }, [current.screen]);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { id: Date.now(), from: 'me', text: chatInput, time: new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  const handleExpressInterest = () => {
    const item = current.params?.item;
    if (onOpenChat) {
      onOpenChat(item);
    } else {
      toast.success('Interest sent — the poster has been notified!');
      setTimeout(() => goTo('poster-notif', current.params), 1200);
    }
  };

  const renderScreen = () => {
    switch (current.screen) {
      case 'feed':
        return (
          <MarketplaceFeed
            onSelectItem={i => goTo('item-detail', { item: i, type: 'item' })}
            onSelectService={s => goTo('service-detail', { item: s, type: 'service' })}
            onPost={() => goTo('category-select')}
            savedItems={savedItems}
            onSaveToggle={onSaveToggle}
            mainFilter={mainFilter}
            onMainFilterChange={setMainFilter}
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
        return <ItemDetail item={current.params?.item} type="item" onBack={goBack} onExpressInterest={handleExpressInterest} onViewProfile={({ person, item }: any) => goTo('neighbour-profile', { person, item })} savedItems={savedItems} onSaveToggle={onSaveToggle} />;
      case 'service-detail':
        return <ItemDetail item={current.params?.item} type="service" onBack={goBack} onExpressInterest={handleExpressInterest} onViewProfile={({ person, item }: any) => goTo('neighbour-profile', { person, item })} savedItems={savedItems} onSaveToggle={onSaveToggle} />;
      case 'neighbour-profile': {
        const person = current.params?.person;
        const item = current.params?.item;
        const addr: string = item?.itemType === 'service' ? (item?.serviceAddress || '') : (item?.collectionAddress || '');
        const blockMatch = addr.match(/^(Blk \S+)/i);
        return (
          <NeighbourProfilePage
            profile={{
              name: person?.name || 'Neighbour',
              avatar: (person?.name || 'N')[0],
              color: person?.avatarColor || '#FF6B47',
              block: blockMatch ? blockMatch[1] : 'Bishan-AMK',
              rating: person?.rating,
              reviews: person?.reviews,
            }}
            onBack={goBack}
          />
        );
      }
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
            onPost={(data: any) => {
              onAddPost?.({
                id: Date.now(),
                type: 'listing',
                title: data.itemName || 'New Listing',
                price: data.price ? `$${data.price}` : 'Free',
                status: 'Active',
                date: new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
              });
              setShowConfetti(true);
              setNavStack([{ screen: 'feed' }]);
            }}
          />
        );
      case 'service-post':
        return <ServicePostScreen onBack={goBack} onPost={(data: any) => {
          onAddPost?.({
            id: Date.now(),
            type: 'service',
            title: data.serviceTitle || (data.category ? `${data.category} Service` : 'New Service'),
            price: data.rate || 'Free',
            status: 'Active',
            date: new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
          });
          toast.success('Your service offer is live!');
          setNavStack([{ screen: 'feed' }]);
        }} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Nunito', sans-serif" }}>
      {renderScreen()}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </div>
  );
}

const MARKETPLACE_DISTANCE_OPTIONS = ['< 0.5 km', '< 1 km', '< 2 km', 'Any'];

// ---- Marketplace Filter Panel ----
function MarketplaceFilterPanel({ mainFilter, itemCategory, serviceCategory, activeDistance, onItemCategoryChange, onServiceCategoryChange, onDistanceChange, onClose, onClear }: any) {
  const categories = mainFilter === 'Items' ? ITEM_CATEGORIES : SERVICE_CATEGORIES;
  const activeCategory = mainFilter === 'Items' ? itemCategory : serviceCategory;
  const onCategoryChange = mainFilter === 'Items' ? onItemCategoryChange : onServiceCategoryChange;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 61, background: CARD, borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', boxShadow: '0 -8px 40px rgba(0,0,0,0.12)', maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: BORDER, margin: '0 auto 20px' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT }}>Filter {mainFilter}</div>
        <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={16} color={TEXT2} />
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Distance</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {MARKETPLACE_DISTANCE_OPTIONS.map(d => {
            const active = activeDistance === d;
            return (
              <button key={d} onClick={() => onDistanceChange(d)} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${active ? PRIMARY : BORDER}`, background: active ? PRIMARY : 'transparent', color: active ? 'white' : TEXT2, fontWeight: active ? 700 : 500 }}>
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Category</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat: string) => {
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => onCategoryChange(cat)} style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', border: `1px solid ${active ? PRIMARY : BORDER}`, background: active ? PRIMARY : 'transparent', color: active ? 'white' : TEXT2, fontWeight: active ? 700 : 500 }}>
                {cat}
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

// ---- Marketplace Feed ----
function MarketplaceFeed({ onSelectItem, onSelectService, onPost, savedItems, onSaveToggle, mainFilter, onMainFilterChange: setMainFilter }: any) {
  const [itemCategory, setItemCategory] = useState('All');
  const [serviceCategory, setServiceCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeDistance, setActiveDistance] = useState('Any');
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

  const filterCount = (activeDistance !== 'Any' ? 1 : 0) +
    (mainFilter === 'Items' && itemCategory !== 'All' ? 1 : 0) +
    (mainFilter === 'Services' && serviceCategory !== 'All' ? 1 : 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG, position: 'relative' }}>
      {/* Header */}
      <div style={{ background: CARD, flexShrink: 0 }}>
        <>
          {/* Title + icons */}
          <div style={{ padding: `${44 - (scrollProgress * 4)}px 16px ${14 - (scrollProgress * 6)}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding 0.1s linear' }}>
            <span style={{ fontSize: `${28 - (scrollProgress * 8)}px`, fontWeight: 800, color: TEXT, letterSpacing: '-0.5px', transition: 'font-size 0.1s linear' }}>Market</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSearchOpen(true)}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(120,120,128,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={18} color={TEXT2} />
              </button>
              <button onClick={() => setShowFilterPanel(true)}
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
          </div>
          {/* Sub-tabs */}
          <div style={{ display: 'flex' }}>
            {(['Items', 'Services'] as MainFilter[]).map(tab => {
              const isActive = mainFilter === tab;
              return (
                <button key={tab} onClick={() => setMainFilter(tab)}
                  style={{ flex: 1, padding: '8px 0 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? TEXT : MUTED, paddingBottom: '10px' }}>
                    {tab}
                  </span>
                  {isActive && <div style={{ position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '2px', background: TEXT, borderRadius: '2px' }} />}
                </button>
              );
            })}
          </div>
        </>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', position: 'relative' }} onScroll={handleScroll}>
        {mainFilter === 'Items' && (
          <>
            {displayItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>No items found</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {displayItems.map(item => (
                  <ItemCard key={item.id} item={item} savedItems={savedItems || []} onSaveToggle={onSaveToggle || (() => {})} onClick={() => onSelectItem(item)} />
                ))}
              </div>
            )}
          </>
        )}

        {mainFilter === 'Services' && (
          <>
            {displayServices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: MUTED, fontSize: '14px', fontWeight: 500 }}>No services found</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {displayServices.map(s => (
                  <ServiceCard key={s.id} s={s} savedItems={savedItems || []} onSaveToggle={onSaveToggle || (() => {})} onClick={() => onSelectService(s)} />
                ))}
              </div>
            )}
          </>
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
              onClick={() => setSearchOpen(false)}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(10,10,20,0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                background: 'white',
                borderRadius: '0 0 24px 24px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                zIndex: 201,
                padding: '52px 16px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(120,120,128,0.10)', borderRadius: '14px', padding: '12px 14px', marginBottom: recentSearches.length > 0 ? '20px' : 0 }}>
                <Search size={16} color={MUTED} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitSearch(searchQuery); }}
                  placeholder="Search market..."
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '16px', color: TEXT, outline: 'none', fontFamily: 'inherit' }}
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <X size={15} color={MUTED} />
                  </button>
                ) : (
                  <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '14px', fontWeight: 600, color: PRIMARY, fontFamily: 'inherit' }}>
                    Cancel
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
        {showFilterPanel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFilterPanel(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60 }} />
            <MarketplaceFilterPanel
              mainFilter={mainFilter}
              itemCategory={itemCategory}
              serviceCategory={serviceCategory}
              activeDistance={activeDistance}
              onItemCategoryChange={setItemCategory}
              onServiceCategoryChange={setServiceCategory}
              onDistanceChange={setActiveDistance}
              onClose={() => setShowFilterPanel(false)}
              onClear={() => { setItemCategory('All'); setServiceCategory('All'); setActiveDistance('Any'); }}
            />
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// ---- Card sub-components ----
function ItemCard({ item, savedItems, onSaveToggle, onClick }: { item: any; savedItems: number[]; onSaveToggle: (id: number) => void; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} onClick={onClick} style={{ background: CARD, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '120px', background: BG, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={40} color={MUTED} />
          </div>
        )}
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <SaveButton itemId={item.id} savedItems={savedItems} onSaveToggle={onSaveToggle} size={14} />
        </div>
      </div>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT, lineHeight: '1.3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.name}</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: item.price === 'Free' ? '#34C759' : TEXT }}>{item.price}</div>
        <div style={{ fontSize: '12px', color: MUTED }}>{item.distance}</div>
        <div style={{ fontSize: '11px', color: MUTED }}>{item.postedTime}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: item.seller?.avatarColor || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>{(item.seller?.name || 'N')[0]}</span>
          </div>
          <span style={{ fontSize: '12px', color: TEXT2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.seller?.name || 'Neighbour'}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceCard({ s, savedItems, onSaveToggle, onClick }: { s: any; savedItems: number[]; onSaveToggle: (id: number) => void; onClick: () => void }) {
  return (
    <motion.div whileTap={{ scale: 0.96 }} onClick={onClick} style={{ background: CARD, borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '120px', background: BG, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {s.image ? (
          <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={40} color={MUTED} />
          </div>
        )}
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <SaveButton itemId={s.id} savedItems={savedItems} onSaveToggle={onSaveToggle} size={14} />
        </div>
      </div>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: TEXT, lineHeight: '1.3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.name}</div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: (s.rate === 'Free' || !s.rate) ? '#34C759' : TEXT }}>{s.rate || 'Free'}</div>
        <div style={{ fontSize: '12px', color: MUTED }}>{s.distance}</div>
        <div style={{ fontSize: '11px', color: MUTED }}>{s.postedTime}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: s.provider?.avatarColor || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>{(s.provider?.name || 'N')[0]}</span>
          </div>
          <span style={{ fontSize: '12px', color: TEXT2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.provider?.name || 'Neighbour'}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Category Select ----
function CategorySelect({ onBack, onSelectCategory }: any) {
  const cats = [
    { id: 'item', title: 'List an Item', desc: 'Share an item for free or for sale', Icon: Package, bg: '#F0FDF4', border: '#A3E6B8', text: '#16A34A', iconBg: '#DCFCE7' },
    { id: 'service', title: 'Offer a Service', desc: 'Share a skill or help you can offer', Icon: UserCheck, bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', iconBg: '#DBEAFE' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '44px 20px 20px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '6px' }}>What would you like to post?</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Choose a category to get started</div>
      </div>
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {cats.map(c => (
          <motion.button key={c.id} whileTap={{ scale: 0.97 }} onClick={() => onSelectCategory(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '22px 20px', borderRadius: '14px', background: c.bg, border: `1.5px solid ${c.border}`, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <c.Icon size={20} color={c.text} />
            </div>
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
function ItemDetail({ item, type, onBack, onExpressInterest, onViewProfile, savedItems, onSaveToggle }: any) {
  if (!item) return null;
  const name = item.title || item.name || '';

  if (type === 'service') {
    const trustRows = [
      item.verified && { icon: <Shield size={14} color="#22C55E" />, label: 'Verified Resident', value: 'Singpass verified', valueColor: '#16A34A' },
      item.trust && item.trustNote ? { icon: <Check size={14} color="#2563EB" />, label: 'Credentials', value: item.trustNote, valueColor: '#2563EB' } : null,
      { icon: <Droplets size={14} color={MUTED} />, label: 'Response Time', value: item.responseTime || 'Replies within a few hours', valueColor: TEXT },
      { icon: <Check size={14} color={PRIMARY} />, label: 'Completed Services', value: `${item.completedServices || 0} done`, valueColor: TEXT },
      item.yearsExperience ? { icon: <GraduationCap size={14} color={MUTED} />, label: 'Experience', value: `${item.yearsExperience} years`, valueColor: TEXT } : null,
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; valueColor: string }[];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
        <div style={{ flex: 1, overflowY: 'auto', background: CARD }}>
          <div style={{ position: 'relative', width: '100%', height: '260px', background: BG }}>
            {item.image ? (
              <img src={item.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: item.provider?.avatarColor || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={64} color="white" />
              </div>
            )}
            <button onClick={onBack} style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
              <ChevronLeft size={20} color={TEXT} />
            </button>
            <div style={{ position: 'absolute', top: '52px', right: '16px' }}>
              <SaveButton itemId={item.id} savedItems={savedItems} onSaveToggle={onSaveToggle} size={18} style={{ width: '38px', height: '38px', borderRadius: '50%', backdropFilter: 'blur(8px)' }} />
            </div>
          </div>
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: TEXT, lineHeight: '1.3', marginBottom: '6px', letterSpacing: '-0.2px' }}>{name}</div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: (item.rate === 'Free' || !item.rate) ? '#34C759' : TEXT, marginBottom: '20px' }}>{item.rate || 'Free'}</div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Details</div>
              <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '0 16px' }}>
                {[
                  { label: 'Category', value: item.category },
                  { label: 'Availability', value: item.availability },
                  { label: 'Posted', value: item.postedTime },
                ].map((row, i, arr) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `0.5px solid rgba(60,60,67,0.10)` : 'none' }}>
                    <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: TEXT, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Description</div>
              <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '14px 16px' }}>
                <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.7' }}>{item.description}</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>Location</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.distance}</div>
              </div>
              <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
                <CollectionPointMap address={item.serviceAddress} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '12px' }}>About the Neighbour</div>
              <div onClick={() => onViewProfile?.({ person: item.provider, item })} style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: item.provider?.avatarColor || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{(item.provider?.name || 'N')[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '3px' }}>{item.provider?.name || 'Neighbour'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <Star size={13} color="#FF9500" fill="#FF9500" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{item.provider?.rating ?? '4.8'}</span>
                    <span style={{ fontSize: '12px', color: MUTED }}>· {item.provider?.reviews ?? 0} reviews</span>
                  </div>
                </div>
                <ChevronRight size={16} color={MUTED} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '12px' }}>Trust & Verification</div>
              <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '0 16px' }}>
                {trustRows.map((row, i) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < trustRows.length - 1 ? `0.5px solid rgba(60,60,67,0.10)` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {row.icon}
                      <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: row.valueColor, textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: '100px' }} />
        </div>

        <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BORDER}`, background: CARD, borderRadius: '0', flexShrink: 0 }}>
          <button onClick={onExpressInterest} style={{ width: '100%', height: '50px', borderRadius: '14px', background: PRIMARY, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Chat
          </button>
        </div>
      </div>
    );
  }

  // ---- ITEM detail layout ----
  const condStyle = CONDITION_COLORS[item.condition] || { bg: BG, text: MUTED };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ flex: 1, overflowY: 'auto', background: CARD }}>
        <div style={{ position: 'relative', width: '100%', height: '260px', background: BG }}>
          {item.image ? (
            <img src={item.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={64} color={MUTED} />
            </div>
          )}
          <button
            onClick={onBack}
            style={{ position: 'absolute', top: '52px', left: '16px', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          >
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ position: 'absolute', top: '52px', right: '16px' }}>
            <SaveButton itemId={item.id} savedItems={savedItems} onSaveToggle={onSaveToggle} size={18} style={{ width: '38px', height: '38px', borderRadius: '50%', backdropFilter: 'blur(8px)' }} />
          </div>
        </div>
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: TEXT, lineHeight: '1.3', marginBottom: '6px', letterSpacing: '-0.2px' }}>{name}</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: item.price === 'Free' ? '#34C759' : TEXT, marginBottom: '20px' }}>{item.price}</div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Details</div>
            <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '0 16px' }}>
              {[
                { label: 'Condition', value: item.condition, valueStyle: { color: condStyle.text, fontWeight: 700 }, badge: true },
                ...(item.brand ? [{ label: 'Brand', value: item.brand, valueStyle: {}, badge: false }] : []),
                { label: 'Posted', value: item.postedTime, valueStyle: {}, badge: false },
                { label: 'Category', value: item.category, valueStyle: {}, badge: false },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `0.5px solid rgba(60,60,67,0.10)` : 'none' }}>
                  <span style={{ fontSize: '13px', color: MUTED, fontWeight: 500 }}>{row.label}</span>
                  {row.badge ? (
                    <span style={{ padding: '4px 10px', borderRadius: '8px', background: condStyle.bg, fontSize: '12px', fontWeight: 700, color: condStyle.text }}>{row.value}</span>
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: TEXT, textAlign: 'right', maxWidth: '55%', ...row.valueStyle }}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '10px' }}>Description</div>
            <div style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '14px 16px' }}>
              <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.7' }}>{item.description}</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT }}>Location</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: TEXT2 }}>{item.collectionDistance}</div>
            </div>
            <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <CollectionPointMap address={item.collectionAddress} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '12px' }}>About the Neighbour</div>
            <div
              onClick={() => onViewProfile?.({ person: item.seller, item })}
              style={{ background: CARD, borderRadius: '14px', border: `0.5px solid ${BORDER}`, padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: item.seller?.avatarColor || PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{(item.seller?.name || 'N')[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>{item.seller?.name || 'Neighbour'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} color="#FF9500" fill="#FF9500" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>{item.seller?.rating || '4.8'}</span>
                  <span style={{ fontSize: '12px', color: MUTED }}>· {item.seller?.reviews || 0} reviews</span>
                </div>
              </div>
              <ChevronRight size={16} color={MUTED} />
            </div>
          </div>
        </div>
        <div style={{ height: '100px' }} />
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `1px solid ${BORDER}`, background: CARD, borderRadius: '0', flexShrink: 0 }}>
        <button
          onClick={onExpressInterest}
          style={{ width: '100%', height: '50px', borderRadius: '14px', background: PRIMARY, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Chat
        </button>
      </div>
    </div>
  );
}

// ---- Poster Notification ----
function PosterNotification({ onBack, onConfirm, onDecline }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 20px 18px', borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '26px', background: '#FFF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
          <Heart size={36} color={PRIMARY} />
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '10px' }}>Someone's Interested!</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px', fontWeight: 400 }}>A verified resident has expressed interest in your listing.</div>
        <div style={{ width: '100%', background: CARD, borderRadius: '14px', padding: '20px', marginBottom: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
            <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: PRIMARY, border: 'none', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Confirm</button>
            <button onClick={onDecline} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: BG, border: `1px solid ${BORDER}`, color: TEXT2, fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>Decline</button>
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
      <div style={{ padding: '44px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px 100px' }}>
        <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
          <Check size={44} color="#22C55E" strokeWidth={2.5} />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, textAlign: 'center', marginBottom: '10px' }}>You're Both Confirmed!</div>
        <div style={{ fontSize: '14px', color: TEXT2, textAlign: 'center', lineHeight: '1.65', marginBottom: '28px' }}>A chat has been opened. Contact details will be shared inside.</div>
        <div style={{ width: '100%', background: '#F0FDF4', borderRadius: '14px', padding: '16px 18px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Shield size={16} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#15803D', lineHeight: '1.55', fontWeight: 500 }}>Both parties confirmed. Contact details are now securely shared.</span>
        </div>
        <button onClick={onOpenChat} style={{ width: '100%', height: '50px', borderRadius: '14px', background: PRIMARY, border: 'none', color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' }}>Open Chat</button>
      </div>
    </div>
  );
}

// ---- Help Chat ----
function HelpChat({ messages, input, onInputChange, onSend, onBack, item }: any) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      <div style={{ background: CARD, padding: '44px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} color={TEXT} />
          </button>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <div style={{ padding: '9px 13px', background: BG, borderRadius: '12px', fontSize: '12px', color: TEXT2, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Package size={13} color={TEXT2} />
          Re: {item?.name || item?.type || 'Your listing'}
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
          <input value={input} onChange={e => onInputChange(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && onSend()} placeholder="Type a message..." style={{ flex: 1, padding: '12px 18px', borderRadius: '22px', border: `1px solid ${BORDER}`, background: BG, fontSize: '14px', outline: 'none', color: TEXT, fontFamily: 'inherit' }} />
          <button onClick={onSend} style={{ width: '46px', height: '46px', borderRadius: '50%', background: PRIMARY, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
      <div style={{ padding: '44px 20px 18px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT, marginBottom: '4px' }}>Add Photos</div>
        <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Add photos of your item</div>
      </div>

      <div style={{ flex: 1, padding: '0 20px 20px' }}>
        {photos.length === 0 ? (
          <motion.button whileTap={{ scale: 0.97 }} onClick={addPhoto} style={{ width: '100%', height: '240px', borderRadius: '12px', border: '1.5px dashed rgba(60,60,67,0.2)', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: '12px' }}>
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
                <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: photos.length === 1 ? '220px' : '140px' }}>
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={13} color="white" />
                  </button>
                </div>
              ))}
              {photos.length < 3 && (
                <motion.button whileTap={{ scale: 0.96 }} onClick={addPhoto} style={{ height: photos.length === 0 ? '220px' : '140px', borderRadius: '12px', border: '1.5px dashed rgba(60,60,67,0.2)', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: '6px' }}>
                  <Camera size={22} color={MUTED} />
                  <span style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>Add more</span>
                </motion.button>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `0.5px solid ${BORDER}` }}>
        <button onClick={() => photos.length > 0 && onContinue(photos)} disabled={photos.length === 0} style={{ width: '100%', height: '52px', borderRadius: '14px', background: photos.length > 0 ? PRIMARY : BORDER, border: 'none', color: photos.length > 0 ? 'white' : MUTED, fontWeight: 700, fontSize: '16px', cursor: photos.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
          Continue
        </button>
      </div>
    </div>
  );
}

// ---- Photo Picker Bottom Sheet ----
function PhotoPickerSheet({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const RECENT_PHOTOS = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
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
              onClick={() => onSelect(RECENT_PHOTOS[Math.floor(Math.random() * RECENT_PHOTOS.length)])}
              style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', height: '52px', padding: '0 12px', borderRadius: '14px', background: '#FFF0EC', border: `1.5px solid #FFD8CC`, cursor: 'pointer', fontFamily: 'inherit', justifyContent: 'center' }}
            >
              <Camera size={20} color={PRIMARY} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: PRIMARY, marginLeft: '8px' }}>Take Photo</span>
            </button>
            <button
              onClick={() => onSelect(RECENT_PHOTOS[Math.floor(Math.random() * RECENT_PHOTOS.length)])}
              style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', height: '52px', padding: '0 12px', borderRadius: '14px', background: '#EDE9FE', border: `1.5px solid #DDD6FE`, cursor: 'pointer', fontFamily: 'inherit', justifyContent: 'center' }}
            >
              <Monitor size={20} color="#7C3AED" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#7C3AED', marginLeft: '8px' }}>Library</span>
            </button>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT2, marginBottom: '12px' }}>Recent Photos</div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
              {RECENT_PHOTOS.map((photo, i) => (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(photo)}
                  style={{ aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              ))}
            </div>
          </div>

          <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: BG, border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: TEXT2, fontFamily: 'inherit', marginTop: '16px' }}>
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---- Item Post Form ----
function ItemPostScreen({ onBack, photos: initialPhotos, onPost }: any) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos || []);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [priceMode, setPriceMode] = useState<'sale' | 'free'>('free');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [showPickerSheet, setShowPickerSheet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const FORM_ITEM_CATEGORIES = ITEM_CATEGORIES.filter(c => c !== 'All');
  const CONDITIONS = ['brand new', 'like new', 'lightly used', 'well used', 'heavily used'];
  const TILE_SIZE = '100px';

  useEffect(() => {
    const t = setTimeout(() => {
      setItemName('Pre-loved Item in Great Condition');
      setDescription(AI_DESCRIPTIONS['default']);
      setCategory('Furniture');
      setIsGenerating(false);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  const removePhoto = (idx: number) => setPhotos(p => p.filter((_, i) => i !== idx));
  const valid = itemName.trim() && category && condition;

  if (isGenerating) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: CARD, gap: '20px', padding: '40px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          style={{ width: '60px', height: '60px', borderRadius: '20px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Star size={28} color="white" fill="white" />
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: TEXT, marginBottom: '8px' }}>Analysing your photos...</div>
          <div style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>Generating listing description</div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: PRIMARY }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, position: 'relative' }}>
      <div style={{ padding: '44px 20px 18px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT }}>List an Item</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>

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
          <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="What are you listing?" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>

        <FormField label="Category">
          <div style={{ position: 'relative' }}>
            <button onClick={() => setCategoryOpen(!categoryOpen)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', background: 'rgba(120,120,128,0.1)', color: category ? TEXT : MUTED, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: category ? 600 : 400, boxSizing: 'border-box' }}>
              {category || 'Select category'}
              <ChevronDown size={16} color={MUTED} style={{ transform: categoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {categoryOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: CARD, borderRadius: '14px', boxShadow: '0 8px 28px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden', border: `1px solid ${BORDER}`, maxHeight: '200px', overflowY: 'auto' }}>
                {FORM_ITEM_CATEGORIES.map((cat, i) => (
                  <button key={cat} onClick={() => { setCategory(cat); setCategoryOpen(false); }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: category === cat ? '#FFF0EC' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', fontSize: '13px', color: category === cat ? PRIMARY : TEXT, fontWeight: category === cat ? 700 : 400, borderBottom: i < FORM_ITEM_CATEGORIES.length - 1 ? `1px solid ${BG}` : 'none', textAlign: 'left' }}>
                    {cat}
                    {category === cat && <Check size={15} color={PRIMARY} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField label="Condition">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CONDITIONS.map(c => {
              const active = condition === c;
              return (
                <button key={c} onClick={() => setCondition(c)} style={{ padding: '9px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: active ? PRIMARY : 'rgba(120,120,128,0.1)', color: active ? 'white' : TEXT2, fontWeight: active ? 700 : 400 }}>
                  {c}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Description (optional)">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your item..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>

        <FormField label="Price">
          <div style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(120,120,128,0.08)', padding: '4px', margin: '8px 8px 4px' }}>
              {(['free', 'sale'] as const).map(mode => (
                <button key={mode} onClick={() => setPriceMode(mode)} style={{ flex: 1, padding: '10px 4px', background: priceMode === mode ? CARD : 'transparent', border: 'none', cursor: 'pointer', borderRadius: '10px', fontFamily: 'inherit', color: priceMode === mode ? TEXT : MUTED, fontWeight: priceMode === mode ? 700 : 500, fontSize: '13px', boxShadow: priceMode === mode ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                  {mode === 'free' ? 'For free' : 'For sale'}
                </button>
              ))}
            </div>
            {priceMode === 'sale' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px' }}>
                <span style={{ fontSize: '14px', color: MUTED, fontWeight: 600 }}>$</span>
                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter price" type="number" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
              </div>
            )}
            {priceMode === 'free' && <div style={{ height: '8px' }} />}
          </div>
        </FormField>

        <FormField label="Brand (optional)">
          <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. IKEA, Samsung" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>

        <FormField label="Collection Location">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: 'rgba(120,120,128,0.1)' }}>
            <MapPin size={16} color={MUTED} style={{ flexShrink: 0, marginTop: '2px' }} />
            <textarea
              value={collectionAddress}
              onChange={e => setCollectionAddress(e.target.value)}
              placeholder="e.g. Blk 445 Ang Mo Kio Ave 10, #05-12, Singapore 560445"
              rows={2}
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: '1.5' }}
            />
          </div>
        </FormField>
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
        <button
          onClick={() => valid && onPost({ itemName, description, category, condition, price: priceMode === 'free' ? 'Free' : `$${price}`, brand, collectionAddress, photos })}
          disabled={!valid}
          style={{ width: '100%', height: '52px', borderRadius: '14px', background: valid ? PRIMARY : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '16px', cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
        >
          Post Listing
        </button>
      </div>

      {showPickerSheet && (
        <PhotoPickerSheet
          onSelect={url => { setPhotos(p => [...p, url]); setShowPickerSheet(false); }}
          onClose={() => setShowPickerSheet(false)}
        />
      )}
    </div>
  );
}

// ---- Service Post Screen ----
function ServicePostScreen({ onBack, onPost }: any) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [serviceTitle, setServiceTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [availability, setAvailability] = useState('');
  const [description, setDescription] = useState('');
  const [priceMode, setPriceMode] = useState<'free' | 'charge'>('free');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState<'hour' | 'session'>('hour');
  const [yearsExp, setYearsExp] = useState('');
  const [certifications, setCertifications] = useState('');
  const [skills, setSkills] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [showPickerSheet, setShowPickerSheet] = useState(false);

  const SERVICE_FORM_CATS = SERVICE_CATEGORIES.filter(c => c !== 'All');
  const TILE_SIZE = '100px';
  const valid = serviceTitle.trim() && category && availability.trim();

  const removePhoto = (idx: number) => setPhotos(p => p.filter((_, i) => i !== idx));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: CARD, position: 'relative' }}>
      <div style={{ padding: '44px 20px 18px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: BG, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <div style={{ fontSize: '24px', fontWeight: 800, color: TEXT }}>Offer a Service</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>

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
              <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowPickerSheet(true)} style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: '12px', border: '1.5px dashed rgba(60,60,67,0.2)', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: '4px', flexShrink: 0 }}>
                <Plus size={20} color={MUTED} />
              </motion.button>
            )}
          </div>
        </FormField>

        <FormField label="Service Title">
          <input value={serviceTitle} onChange={e => setServiceTitle(e.target.value)} placeholder="What service are you offering?" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>

        <FormField label="Category">
          <div style={{ position: 'relative' }}>
            <button onClick={() => setCategoryOpen(!categoryOpen)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', background: 'rgba(120,120,128,0.1)', color: category ? TEXT : MUTED, fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: category ? 600 : 400, boxSizing: 'border-box' }}>
              {category || 'Select category'}
              <ChevronDown size={16} color={MUTED} style={{ transform: categoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
            </button>
            {categoryOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: CARD, borderRadius: '14px', boxShadow: '0 8px 28px rgba(0,0,0,0.12)', zIndex: 10, overflow: 'hidden', border: `1px solid ${BORDER}`, maxHeight: '200px', overflowY: 'auto' }}>
                {SERVICE_FORM_CATS.map((cat, i) => (
                  <button key={cat} onClick={() => { setCategory(cat); setCategoryOpen(false); }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: category === cat ? '#FFF0EC' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', fontSize: '13px', color: category === cat ? PRIMARY : TEXT, fontWeight: category === cat ? 700 : 400, borderBottom: i < SERVICE_FORM_CATS.length - 1 ? `1px solid ${BG}` : 'none', textAlign: 'left' }}>
                    {cat}
                    {category === cat && <Check size={15} color={PRIMARY} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField label="Availability">
          <textarea value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Weekday evenings (6–9 PM), Weekends" rows={2} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>

        <FormField label="Description (optional)">
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your service, experience, or any useful notes..." rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', resize: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.5' }} />
        </FormField>

        <FormField label="Pricing">
          <div style={{ background: CARD, borderRadius: '14px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(120,120,128,0.08)', padding: '4px', margin: '8px 8px 4px' }}>
              {(['free', 'charge'] as const).map(mode => (
                <button key={mode} onClick={() => setPriceMode(mode)} style={{ flex: 1, padding: '10px 4px', background: priceMode === mode ? CARD : 'transparent', border: 'none', cursor: 'pointer', borderRadius: '10px', fontFamily: 'inherit', color: priceMode === mode ? TEXT : MUTED, fontWeight: priceMode === mode ? 700 : 500, fontSize: '13px', boxShadow: priceMode === mode ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                  {mode === 'free' ? 'Free' : 'Charge a fee'}
                </button>
              ))}
            </div>
            {priceMode === 'charge' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px' }}>
                <span style={{ fontSize: '14px', color: MUTED, fontWeight: 600 }}>$</span>
                <input value={rate} onChange={e => setRate(e.target.value)} placeholder="Rate" type="number" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit', minWidth: 0 }} />
                <div style={{ display: 'flex', gap: '4px', background: BG, borderRadius: '10px', padding: '3px', border: `1px solid ${BORDER}`, flexShrink: 0 }}>
                  {(['hour', 'session'] as const).map(u => (
                    <button key={u} onClick={() => setRateUnit(u)} style={{ padding: '5px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '11px', fontWeight: 700, background: rateUnit === u ? PRIMARY : 'transparent', color: rateUnit === u ? 'white' : MUTED }}>
                      /{u}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {priceMode === 'free' && <div style={{ height: '8px' }} />}
          </div>
        </FormField>

        <FormField label="Years of Experience">
          <input value={yearsExp} onChange={e => setYearsExp(e.target.value)} placeholder="e.g. 3" type="number" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>
        <FormField label="Certifications (optional)">
          <input value={certifications} onChange={e => setCertifications(e.target.value)} placeholder="e.g. DBS checked, First Aid certified" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>
        <FormField label="Relevant Skills (optional)">
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. CPR, Bilingual, Pet first aid" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none', color: TEXT, background: 'rgba(120,120,128,0.1)', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </FormField>

        <FormField label="Service Location">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: 'rgba(120,120,128,0.1)' }}>
            <MapPin size={16} color={MUTED} style={{ flexShrink: 0 }} />
            <input value={serviceLocation} onChange={e => setServiceLocation(e.target.value)} placeholder="e.g. Bishan-AMK Estate, your block" style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px', color: TEXT, outline: 'none', fontFamily: 'inherit' }} />
          </div>
        </FormField>
      </div>

      <div style={{ padding: '12px 20px 32px', borderTop: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
        <button
          onClick={() => valid && onPost({ serviceTitle, category, availability, description, rate: priceMode === 'free' ? 'Free' : `$${rate} per ${rateUnit}`, yearsExp, certifications, skills, serviceLocation, photos })}
          disabled={!valid}
          style={{ width: '100%', height: '52px', borderRadius: '14px', background: valid ? PRIMARY : BORDER, border: 'none', color: valid ? 'white' : MUTED, fontWeight: 700, fontSize: '16px', cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
        >
          Post Service
        </button>
      </div>

      {showPickerSheet && (
        <PhotoPickerSheet
          onSelect={url => { setPhotos(p => [...p, url]); setShowPickerSheet(false); }}
          onClose={() => setShowPickerSheet(false)}
        />
      )}
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
