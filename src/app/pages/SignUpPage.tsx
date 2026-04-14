import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Users } from 'lucide-react';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  Running:       { bg: '#FFF0EC', text: '#FF6B47' },
  Gardening:     { bg: '#D1FAE5', text: '#059669' },
  'Board Games': { bg: '#EDE9FE', text: '#7C3AED' },
  Cooking:       { bg: '#FEF3C7', text: '#D97706' },
  Reading:       { bg: '#DBEAFE', text: '#2563EB' },
  Cycling:       { bg: '#CCFBF1', text: '#0D9488' },
  Pets:          { bg: '#FEF9C3', text: '#CA8A04' },
  Photography:   { bg: '#FAE8FF', text: '#A21CAF' },
  Music:         { bg: '#FFE4E6', text: '#E11D48' },
  Fitness:       { bg: '#DCFCE7', text: '#16A34A' },
  Hiking:        { bg: '#D1FAE5', text: '#059669' },
  Yoga:          { bg: '#F3E8FF', text: '#9333EA' },
};

const ALL_INTERESTS = Object.keys(INTEREST_COLORS);

const FAMILY_OPTIONS = [
  'Single',
  'Couple',
  'Living with kids',
  'Living with parents',
  'Multigenerational',
  'Senior (60 and above)',
];

interface SignUpPageProps {
  onComplete: (profile: { dob: string; familyStatus: string; interests: string[] }) => void;
}

export function SignUpPage({ onComplete }: SignUpPageProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [dob, setDob] = useState('');
  const [familyStatus, setFamilyStatus] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  // Step 4 -> 5 auto-transition (loading -> recommendations)
  useEffect(() => {
    if ((step as number) === 4) {
      const t = setTimeout(() => setStep(5 as any), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const toggleInterest = (t: string) => {
    setInterests(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: step === 0 ? CARD : BG,
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <WelcomeStep onContinue={() => setStep(1)} />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="dob"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <StepDOB dob={dob} onChangeDob={setDob} onNext={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="family"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <StepFamily
              familyStatus={familyStatus}
              onSelect={setFamilyStatus}
              onNext={() => setStep(3 as any)}
            />
          </motion.div>
        )}

        {(step as number) === 3 && (
          <motion.div
            key="interests"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <StepInterests
              interests={interests}
              onToggle={toggleInterest}
              onNext={() => setStep(4 as any)}
            />
          </motion.div>
        )}

        {(step as number) === 4 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <LoadingStep />
          </motion.div>
        )}

        {(step as number) === 5 && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <RecommendationsStep
              interests={interests}
              onGetStarted={() => onComplete({ dob, familyStatus, interests })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Progress Bar ----
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        padding: '0 24px',
        marginBottom: '28px',
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '4px',
            background: i < step ? PRIMARY : BORDER,
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

// ---- Welcome Step ----
function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 24px 40px',
        background: CARD,
      }}
    >
      {/* Decorative gradient circle */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '32px',
          background: `linear-gradient(135deg, #FFF0EC, #FFD8CC)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          marginBottom: '28px',
        }}
      >
        🏘️
      </div>

      <div
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: TEXT,
          lineHeight: '1.2',
          marginBottom: '14px',
        }}
      >
        Welcome to NeighbourHood 🏘️
      </div>
      <div
        style={{
          fontSize: '16px',
          color: TEXT2,
          lineHeight: '1.6',
          fontWeight: 400,
          marginBottom: '40px',
        }}
      >
        Let's personalise your experience with a few quick questions
      </div>

      <div style={{ marginTop: 'auto' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: '22px',
            background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`,
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255,107,71,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Continue
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

// ---- Step 1: Date of Birth ----
function StepDOB({ dob, onChangeDob, onNext }: { dob: string; onChangeDob: (v: string) => void; onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 24px 0' }}>
        <ProgressBar step={1} total={3} />
        <div style={{ fontSize: '26px', fontWeight: 800, color: TEXT, lineHeight: '1.2', marginBottom: '8px' }}>
          When were you born?
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, marginBottom: '32px', lineHeight: '1.5' }}>
          We use this to show you age-appropriate events and groups.
        </div>

        <div
          style={{
            background: BG,
            borderRadius: '18px',
            padding: '4px',
            border: `2px solid ${dob ? PRIMARY : BORDER}`,
            transition: 'border-color 0.2s',
          }}
        >
          <input
            type="date"
            value={dob}
            onChange={e => onChangeDob(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 18px',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              fontWeight: 600,
              color: dob ? TEXT : MUTED,
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '20px 24px 40px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!dob}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: '22px',
            background: dob ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER,
            border: 'none',
            color: dob ? 'white' : MUTED,
            fontWeight: 700,
            fontSize: '16px',
            cursor: dob ? 'pointer' : 'not-allowed',
            boxShadow: dob ? '0 8px 24px rgba(255,107,71,0.35)' : 'none',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

// ---- Step 2: Family Status ----
function StepFamily({
  familyStatus,
  onSelect,
  onNext,
}: {
  familyStatus: string;
  onSelect: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 24px 0', flex: 1, overflowY: 'auto' }}>
        <ProgressBar step={2} total={3} />
        <div style={{ fontSize: '26px', fontWeight: 800, color: TEXT, lineHeight: '1.2', marginBottom: '8px' }}>
          What's your family status?
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, marginBottom: '28px', lineHeight: '1.5' }}>
          Helps us match you with relevant community groups and events.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAMILY_OPTIONS.map(opt => {
            const selected = familyStatus === opt;
            return (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(opt)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '18px',
                  border: `2px solid ${selected ? PRIMARY : BORDER}`,
                  background: selected ? '#FFF0EC' : CARD,
                  color: selected ? PRIMARY : TEXT,
                  fontWeight: selected ? 700 : 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {opt}
                {selected && (
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: PRIMARY,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 800 }}>✓</span>
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 24px 40px', borderTop: `1px solid ${BG}` }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!familyStatus}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: '22px',
            background: familyStatus ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER,
            border: 'none',
            color: familyStatus ? 'white' : MUTED,
            fontWeight: 700,
            fontSize: '16px',
            cursor: familyStatus ? 'pointer' : 'not-allowed',
            boxShadow: familyStatus ? '0 8px 24px rgba(255,107,71,0.35)' : 'none',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

// ---- Step 3: Interests ----
function StepInterests({
  interests,
  onToggle,
  onNext,
}: {
  interests: string[];
  onToggle: (t: string) => void;
  onNext: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredInterests = ALL_INTERESTS.filter(t =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 24px 0' }}>
        <ProgressBar step={3} total={3} />
        <div style={{ fontSize: '26px', fontWeight: 800, color: TEXT, lineHeight: '1.2', marginBottom: '8px' }}>
          What are you into?
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, marginBottom: '16px', lineHeight: '1.5' }}>
          Select all that apply — we'll match you with relevant groups and events.
        </div>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: BG, borderRadius: '14px', padding: '10px 14px', marginBottom: '16px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search interests..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: TEXT, fontFamily: "'DM Sans', sans-serif" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {filteredInterests.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: '14px' }}>
              No interests found for "{searchQuery}"
            </div>
          ) : null}
          {filteredInterests.map(t => {
            const sel = interests.includes(t);
            const colors = INTEREST_COLORS[t];
            return (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(t)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  border: `2px solid ${sel ? colors.text : BORDER}`,
                  background: sel ? colors.bg : CARD,
                  color: sel ? colors.text : TEXT2,
                  fontWeight: sel ? 700 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 24px 40px', borderTop: `1px solid ${BG}` }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={interests.length === 0}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: '22px',
            background:
              interests.length > 0 ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER,
            border: 'none',
            color: interests.length > 0 ? 'white' : MUTED,
            fontWeight: 700,
            fontSize: '16px',
            cursor: interests.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: interests.length > 0 ? '0 8px 24px rgba(255,107,71,0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Find my community →
        </motion.button>
      </div>
    </div>
  );
}

// ---- Step 4: Loading ----
function LoadingStep() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: CARD,
        padding: '40px 24px',
      }}
    >
      {/* Animated spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: `5px solid ${BORDER}`,
          borderTopColor: PRIMARY,
          marginBottom: '32px',
        }}
      />

      <div
        style={{
          fontSize: '22px',
          fontWeight: 800,
          color: TEXT,
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        Finding your community...
      </div>
      <div
        style={{
          fontSize: '14px',
          color: TEXT2,
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '260px',
        }}
      >
        Matching you with events and groups nearby
      </div>

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '28px' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: PRIMARY,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ---- Step 5: Recommendations ----
const REC_GROUPS = [
  {
    id: 1,
    name: 'Morning Runners',
    tag: 'Running',
    members: 12,
    gradient: 'linear-gradient(135deg, #FF6B47, #FF9068)',
    emoji: '🏃',
  },
  {
    id: 2,
    name: 'Backyard Gardeners',
    tag: 'Gardening',
    members: 8,
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
    emoji: '🌿',
  },
  {
    id: 3,
    name: 'Board Game Sundays',
    tag: 'Board Games',
    members: 15,
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    emoji: '🎲',
  },
];

const REC_EVENTS = [
  {
    id: 1,
    title: 'Morning Run at Bishan-AMK Park',
    date: 'Sat 12 Apr',
    emoji: '🏃',
    category: 'Fitness',
    categoryColor: '#16A34A',
    categoryBg: '#DCFCE7',
  },
  {
    id: 2,
    title: 'Peranakan Cooking Workshop',
    date: 'Sun 13 Apr',
    emoji: '🍳',
    category: 'Cooking',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
  },
  {
    id: 3,
    title: 'Community Garden Morning',
    date: 'Sat 19 Apr',
    emoji: '🌱',
    category: 'Gardening',
    categoryColor: '#059669',
    categoryBg: '#D1FAE5',
  },
];

function RecommendationsStep({
  interests,
  onGetStarted,
}: {
  interests: string[];
  onGetStarted: () => void;
}) {
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: BG }}>
      {/* Header */}
      <div
        style={{
          background: CARD,
          padding: '52px 24px 20px',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ fontSize: '32px', marginBottom: '8px' }}
        >
          🎉
        </motion.div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: TEXT,
            marginBottom: '6px',
            lineHeight: '1.2',
          }}
        >
          Here's your neighbourhood 🎉
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.5' }}>
          Based on your interests, we found these for you
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        {/* Top Interest Groups */}
        <div style={{ padding: '20px 0 0' }}>
          <div
            style={{
              padding: '0 24px',
              fontSize: '16px',
              fontWeight: 800,
              color: TEXT,
              marginBottom: '14px',
            }}
          >
            Top Interest Groups
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '0 24px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            } as React.CSSProperties}
          >
            {REC_GROUPS.map((g, i) => {
              const joined = joinedGroups.includes(g.id);
              const tagColors = INTEREST_COLORS[g.tag] || { bg: '#FFF0EC', text: PRIMARY };
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    flexShrink: 0,
                    width: '180px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: CARD,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  }}
                >
                  <div
                    style={{
                      background: g.gradient,
                      height: '90px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '38px',
                    }}
                  >
                    {g.emoji}
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: TEXT,
                        marginBottom: '6px',
                        lineHeight: '1.3',
                      }}
                    >
                      {g.name}
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '3px 9px',
                        borderRadius: '10px',
                        background: tagColors.bg,
                        color: tagColors.text,
                        fontSize: '10px',
                        fontWeight: 700,
                        marginBottom: '10px',
                      }}
                    >
                      {g.tag}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{ fontSize: '11px', color: MUTED, fontWeight: 500 }}
                      >
                        <Users
                          size={11}
                          color={MUTED}
                          style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}
                        />
                        {g.members} members
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setJoinedGroups(p =>
                            p.includes(g.id) ? p.filter(x => x !== g.id) : [...p, g.id]
                          )
                        }
                        style={{
                          padding: '5px 12px',
                          borderRadius: '12px',
                          background: joined ? BORDER : PRIMARY,
                          border: 'none',
                          color: joined ? TEXT2 : 'white',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {joined ? 'Joined ✓' : 'Join'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recommended Events */}
        <div style={{ padding: '24px 0 0' }}>
          <div
            style={{
              padding: '0 24px',
              fontSize: '16px',
              fontWeight: 800,
              color: TEXT,
              marginBottom: '14px',
            }}
          >
            Recommended Events
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '0 24px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            } as React.CSSProperties}
          >
            {REC_EVENTS.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{
                  flexShrink: 0,
                  width: '200px',
                  background: CARD,
                  borderRadius: '20px',
                  padding: '16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: ev.categoryBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    marginBottom: '12px',
                  }}
                >
                  {ev.emoji}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: TEXT,
                    marginBottom: '6px',
                    lineHeight: '1.35',
                  }}
                >
                  {ev.title}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: TEXT2,
                    fontWeight: 500,
                    marginBottom: '8px',
                  }}
                >
                  📅 {ev.date}
                </div>
                <span
                  style={{
                    padding: '3px 9px',
                    borderRadius: '10px',
                    background: ev.categoryBg,
                    color: ev.categoryColor,
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {ev.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px 36px',
          background: `linear-gradient(to top, ${BG} 70%, transparent)`,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onGetStarted}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: '22px',
            background: `linear-gradient(135deg, ${PRIMARY}, #FF8C70)`,
            border: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255,107,71,0.35)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Get Started →
        </motion.button>
      </div>
    </div>
  );
}
