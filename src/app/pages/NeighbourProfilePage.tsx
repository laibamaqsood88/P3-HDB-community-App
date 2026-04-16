import { useState } from 'react';
import { ChevronLeft, Star, MapPin } from 'lucide-react';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

// ---- Interest colors (matches ExplorePage / ProfilePage) ----
const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  'Community Volunteering':        { bg: '#FEE2E2', text: '#DC2626' },
  'Cultural Heritage & Festivals': { bg: '#FEF3C7', text: '#B45309' },
  'Fitness & Sports':              { bg: '#DCFCE7', text: '#16A34A' },
  'Yoga & Mindfulness':            { bg: '#F3E8FF', text: '#9333EA' },
  'Outdoor Activities':            { bg: '#CCFBF1', text: '#0D9488' },
  'Arts & Crafts':                 { bg: '#FCE7F3', text: '#DB2777' },
  'Music & Performing Arts':       { bg: '#FFE4E6', text: '#E11D48' },
  'Dance':                         { bg: '#EDE9FE', text: '#7C3AED' },
  'Cooking & Baking':              { bg: '#FEF3C7', text: '#D97706' },
  'Technology & Digital Skills':   { bg: '#DBEAFE', text: '#2563EB' },
  'DIY & Home Improvement':        { bg: '#F1F5F9', text: '#475569' },
  'Language Learning':             { bg: '#CFFAFE', text: '#0891B2' },
  'Pets & Animals':                { bg: '#FEF9C3', text: '#CA8A04' },
  'Gardening & Plants':            { bg: '#D1FAE5', text: '#059669' },
  'Gaming':                        { bg: '#E0E7FF', text: '#4F46E5' },
  'Fashion & Beauty':              { bg: '#FCE7F3', text: '#BE185D' },
  'Photography':                   { bg: '#FAE8FF', text: '#A21CAF' },
  // Short-form variants used in EventsPage
  'Fitness':    { bg: '#DCFCE7', text: '#16A34A' },
  'Cooking':    { bg: '#FEF3C7', text: '#D97706' },
  'Gardening':  { bg: '#D1FAE5', text: '#059669' },
  'Yoga':       { bg: '#F3E8FF', text: '#9333EA' },
  'Art and Craft': { bg: '#FCE7F3', text: '#DB2777' },
  'Music':      { bg: '#FFE4E6', text: '#E11D48' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  'Running':    { bg: '#DCFCE7', text: '#16A34A' },
};

// ---- Language colors (matches ProfilePage) ----
const LANGUAGE_COLORS: Record<string, { bg: string; text: string }> = {
  'English': { bg: '#E0F2FE', text: '#0369A1' },
  'Chinese': { bg: '#FEF08A', text: '#A16207' },
  'Malay':   { bg: '#D1FAE5', text: '#065F46' },
  'Tamil':   { bg: '#FCE7F3', text: '#BE185D' },
  'Japanese':{ bg: '#FED7AA', text: '#9A3412' },
  'Korean':  { bg: '#DDD6FE', text: '#4C1D95' },
  'French':  { bg: '#F0FDF4', text: '#166534' },
  'Spanish': { bg: '#FEE2E2', text: '#7F1D1D' },
  'German':  { bg: '#E0E7FF', text: '#3730A3' },
};

// ---- Static mock reviews ----
const MOCK_REVIEWS = [
  {
    id: 1,
    reviewer: 'Ahmad F.',
    avatar: 'AF',
    avatarColor: '#3B82F6',
    rating: 5,
    text: 'Very helpful and punctual! Would definitely recommend to other neighbours.',
    source: 'from Marketplace',
  },
  {
    id: 2,
    reviewer: 'Priya N.',
    avatar: 'PN',
    avatarColor: '#7C3AED',
    rating: 4,
    text: 'Great attitude, easy to coordinate with. Smooth and pleasant experience!',
    source: 'from Requests',
  },
  {
    id: 3,
    reviewer: 'Wei Ling',
    avatar: 'WL',
    avatarColor: '#059669',
    rating: 5,
    text: 'Item exactly as described. Super fast response time and very accommodating.',
    source: 'from Marketplace',
  },
  {
    id: 4,
    reviewer: 'Rajan K.',
    avatar: 'RK',
    avatarColor: '#D97706',
    rating: 4,
    text: 'Very friendly and accommodating neighbour. Would connect again for future requests!',
    source: 'from Requests',
  },
];

// ---- Star rating ----
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={13} color="#FF9500" fill={i <= rating ? '#FF9500' : 'none'} strokeWidth={1.8} />
      ))}
    </div>
  );
}

// ---- Exported type ----
export interface NeighbourProfile {
  name: string;
  avatar?: string;     // initials for coloured circle (e.g. "AL")
  avatarUrl?: string;  // real image URL — takes priority over initials
  color?: string;      // avatar background colour
  block?: string;      // e.g. "Blk 445"
  distance?: string;   // e.g. "0.3 km" or "0.3 km away"
  rating?: number;
  reviews?: number;
  interests?: string[];
  languages?: string[];
}

// ---- Page component ----
export function NeighbourProfilePage({
  profile,
  onBack,
}: {
  profile: NeighbourProfile;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  const name = profile.name || 'Neighbour';
  const initials =
    profile.avatar ||
    name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  const color = profile.color || PRIMARY;
  const block = profile.block || 'Bishan-AMK';
  const rating = profile.rating ?? 4.8;
  const reviewCount = profile.reviews ?? 12;
  const distanceStr = profile.distance
    ? profile.distance.includes('away')
      ? profile.distance
      : `${profile.distance} away`
    : undefined;

  const hasInterests = profile.interests && profile.interests.length > 0;
  const hasLanguages = profile.languages && profile.languages.length > 0;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          background: CARD,
          padding: '44px 20px 16px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: BG,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={20} color={TEXT} />
        </button>
        <span style={{ fontSize: '17px', fontWeight: 700, color: TEXT }}>
          Neighbour Profile
        </span>
      </div>

      {/* ── Scrollable body ── */}
      <div
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '28px 20px 100px' }}
      >
        {/* Photo + Name + Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '28px',
          }}
        >
          {/* Avatar */}
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={name}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
              }}
            />
          ) : (
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
              }}
            >
              <span style={{ fontSize: '34px', fontWeight: 800, color: 'white' }}>
                {initials}
              </span>
            </div>
          )}

          {/* Name */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: TEXT,
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {name}
          </div>

          {/* Key details row: block · distance · ★ rating · N reviews */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '5px',
              rowGap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={12} color={MUTED} strokeWidth={1.8} />
              <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>
                {block}
              </span>
            </div>

            {distanceStr && (
              <>
                <span style={{ color: MUTED, fontSize: '13px' }}>·</span>
                <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 500 }}>
                  {distanceStr}
                </span>
              </>
            )}

            <span style={{ color: MUTED, fontSize: '13px' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={12} color="#FF9500" fill="#FF9500" strokeWidth={1.8} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: TEXT }}>
                {rating.toFixed(1)}
              </span>
            </div>
            <span style={{ color: MUTED, fontSize: '13px' }}>·</span>
            <span style={{ fontSize: '13px', color: TEXT2 }}>{reviewCount} reviews</span>
          </div>
        </div>

        {/* ── Tab switcher ── */}
        <div
          style={{
            display: 'flex',
            background: CARD,
            borderRadius: '16px',
            padding: '4px',
            marginBottom: '20px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
          }}
        >
          {(['about', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                background: activeTab === tab ? PRIMARY : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                fontWeight: 700,
                color: activeTab === tab ? 'white' : TEXT2,
                transition: 'all 0.15s',
              }}
            >
              {tab === 'about' ? 'About' : 'Reviews'}
            </button>
          ))}
        </div>

        {/* ── About tab ── */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hasInterests && (
              <div
                style={{
                  background: CARD,
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: MUTED,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '12px',
                  }}
                >
                  Interests
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.interests!.map(interest => {
                    const c = INTEREST_COLORS[interest] || { bg: '#FFF0EC', text: PRIMARY };
                    return (
                      <span
                        key={interest}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: c.bg,
                          color: c.text,
                        }}
                      >
                        {interest}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {hasLanguages && (
              <div
                style={{
                  background: CARD,
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: MUTED,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '12px',
                  }}
                >
                  Languages Spoken
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.languages!.map(lang => {
                    const c = LANGUAGE_COLORS[lang] || { bg: '#F5F5F5', text: TEXT2 };
                    return (
                      <span
                        key={lang}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: c.bg,
                          color: c.text,
                        }}
                      >
                        {lang}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasInterests && !hasLanguages && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  color: MUTED,
                  background: CARD,
                  borderRadius: '16px',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  No additional info available
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Reviews tab ── */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_REVIEWS.map(r => (
              <div
                key={r.id}
                style={{
                  background: CARD,
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
              >
                {/* Reviewer row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: r.avatarColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>
                      {r.avatar}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>
                      {r.reviewer}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: MUTED,
                        fontWeight: 500,
                        marginTop: '2px',
                      }}
                    >
                      {r.source}
                    </div>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                {/* Review text */}
                <div style={{ fontSize: '13px', color: TEXT2, lineHeight: '1.6' }}>
                  {r.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
