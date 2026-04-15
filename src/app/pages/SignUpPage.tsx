import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ChevronDown, Users, Bookmark, Home } from 'lucide-react';

// ---- Design tokens ----
const BG = '#F5F4F0';
const CARD = '#FFFFFF';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';
const BORDER = '#EDEDEC';

const INTEREST_COLORS: Record<string, { bg: string; text: string }> = {
  // Social & Community
  'Community Volunteering':       { bg: '#FEE2E2', text: '#DC2626' },
  'Cultural Heritage & Festivals':{ bg: '#FEF3C7', text: '#B45309' },
  // Fitness & Wellness
  'Fitness & Sports':             { bg: '#DCFCE7', text: '#16A34A' },
  'Yoga & Mindfulness':           { bg: '#F3E8FF', text: '#9333EA' },
  'Outdoor Activities':           { bg: '#CCFBF1', text: '#0D9488' },
  // Arts & Creativity
  'Arts & Crafts':                { bg: '#FCE7F3', text: '#DB2777' },
  'Music & Performing Arts':      { bg: '#FFE4E6', text: '#E11D48' },
  'Dance':                        { bg: '#EDE9FE', text: '#7C3AED' },
  // Learning & Skills
  'Cooking & Baking':             { bg: '#FEF3C7', text: '#D97706' },
  'Technology & Digital Skills':  { bg: '#DBEAFE', text: '#2563EB' },
  'DIY & Home Improvement':       { bg: '#F1F5F9', text: '#475569' },
  'Language Learning':            { bg: '#CFFAFE', text: '#0891B2' },
  // Lifestyle & Hobbies
  'Pets & Animals':               { bg: '#FEF9C3', text: '#CA8A04' },
  'Gardening & Plants':           { bg: '#D1FAE5', text: '#059669' },
  'Gaming':                       { bg: '#E0E7FF', text: '#4F46E5' },
  'Fashion & Beauty':             { bg: '#FCE7F3', text: '#BE185D' },
  'Photography':                  { bg: '#FAE8FF', text: '#A21CAF' },
};

export const INTEREST_CATEGORIES = [
  { label: 'Social & Community',   items: ['Community Volunteering', 'Cultural Heritage & Festivals'] },
  { label: 'Fitness & Wellness',   items: ['Fitness & Sports', 'Yoga & Mindfulness', 'Outdoor Activities'] },
  { label: 'Arts & Creativity',    items: ['Arts & Crafts', 'Music & Performing Arts', 'Dance'] },
  { label: 'Learning & Skills',    items: ['Cooking & Baking', 'Technology & Digital Skills', 'DIY & Home Improvement', 'Language Learning'] },
  { label: 'Lifestyle & Hobbies',  items: ['Pets & Animals', 'Gardening & Plants', 'Gaming', 'Fashion & Beauty', 'Photography'] },
];

const ALL_INTERESTS = Object.keys(INTEREST_COLORS);

const FAMILY_OPTIONS = [
  'Single',
  'Couple',
  'Living with kids',
  'Living with parents',
  'Multigenerational',
  'Senior (60 and above)',
];

const SPOKEN_LANGUAGES = ['English', 'Chinese', 'Malay', 'Tamil'];

const AUTOCOMPLETE_LANGUAGES = [
  'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijani',
  'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese',
  'Catalan', 'Cebuano', 'Croatian', 'Czech', 'Danish', 'Dutch',
  'Esperanto', 'Estonian', 'Filipino', 'Finnish', 'French',
  'Galician', 'Georgian', 'German', 'Greek', 'Gujarati',
  'Haitian Creole', 'Hausa', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian',
  'Icelandic', 'Igbo', 'Indonesian', 'Irish', 'Italian',
  'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kurdish',
  'Lao', 'Latin', 'Latvian', 'Lithuanian',
  'Macedonian', 'Malagasy', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mongolian',
  'Nepali', 'Norwegian', 'Odia', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi',
  'Romanian', 'Russian', 'Samoan', 'Serbian', 'Sinhala', 'Slovak', 'Slovenian',
  'Somali', 'Spanish', 'Sundanese', 'Swahili', 'Swedish',
  'Tajik', 'Thai', 'Turkish', 'Turkmen',
  'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese',
  'Welsh', 'Xhosa', 'Yiddish', 'Yoruba', 'Zulu',
];

interface SignUpPageProps {
  onComplete: (profile: { familyStatus: string; interests: string[]; spokenLanguages: string[] }) => void;
}

export function SignUpPage({ onComplete }: SignUpPageProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [familyStatus, setFamilyStatus] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([]);

  const toggleLanguage = (lang: string) => {
    setSpokenLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

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
        fontFamily: "'Nunito', sans-serif",
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
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <StepSpokenLanguage
              spokenLanguages={spokenLanguages}
              onToggle={toggleLanguage}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          </motion.div>
        )}

        {step === 3 && (
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
              onBack={() => setStep(2)}
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
              onGetStarted={() => onComplete({ familyStatus, interests, spokenLanguages })}
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
        padding: '52px 24px 40px',
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
          marginBottom: '28px',
        }}
      >
        <Home size={52} color={PRIMARY} strokeWidth={1.5} />
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
        Welcome to NeighbourHood
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
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Continue
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

// ---- Step 1: Family Status ----
function StepFamily({
  familyStatus,
  onSelect,
  onNext,
  onBack,
}: {
  familyStatus: string;
  onSelect: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CARD }}>
      <div style={{ padding: '52px 24px 0', flex: 1, overflowY: 'auto' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', fontFamily: 'inherit', color: TEXT2 }}>
          <ChevronLeft size={18} color={TEXT2} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Back</span>
        </button>
        <ProgressBar step={1} total={3} />
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
                  fontFamily: "'Nunito', sans-serif",
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
            fontFamily: "'Nunito', sans-serif",
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
  onBack,
}: {
  interests: string[];
  onToggle: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const filteredInterests = ALL_INTERESTS.filter(t =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCat = (label: string) =>
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CARD, minHeight: 0 }}>
      <div style={{ padding: '52px 24px 0', flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', fontFamily: 'inherit', color: TEXT2 }}>
          <ChevronLeft size={18} color={TEXT2} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Back</span>
        </button>
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
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: TEXT, fontFamily: "'Nunito', sans-serif" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        {/* Selected interests row */}
        <AnimatePresence>
          {interests.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
                {interests.map(t => {
                  const colors = INTEREST_COLORS[t];
                  return (
                    <motion.button
                      key={t}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggle(t)}
                      style={{
                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: 700,
                        background: colors.bg, color: colors.text, border: `2px solid ${colors.text}`,
                        cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      {t}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 16px', minHeight: 0 }}>
        {filteredInterests.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', padding: '40px 0', color: MUTED, fontSize: '14px' }}>
            No interests found for "{searchQuery}"
          </div>
        ) : searchQuery ? (
          /* Flat list when searching */
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filteredInterests.map(t => {
              const sel = interests.includes(t);
              const colors = INTEREST_COLORS[t];
              return (
                <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => onToggle(t)}
                  style={{ padding: '10px 18px', borderRadius: '24px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", border: `2px solid ${sel ? colors.text : BORDER}`, background: sel ? colors.bg : CARD, color: sel ? colors.text : TEXT2, fontWeight: sel ? 700 : 500, transition: 'all 0.15s' }}>
                  {t}
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Grouped by category with collapsible dropdowns */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {INTEREST_CATEGORIES.map(cat => {
              const isOpen = expandedCats.has(cat.label);
              const selectedInCat = cat.items.filter(t => interests.includes(t)).length;
              return (
                <div key={cat.label} style={{ background: BG, borderRadius: '18px', overflow: 'hidden' }}>
                  {/* Category header — tappable */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCat(cat.label)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: TEXT }}>{cat.label}</span>
                      {selectedInCat > 0 && (
                        <div style={{ minWidth: '20px', height: '20px', borderRadius: '10px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: 'white' }}>{selectedInCat}</span>
                        </div>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} color={MUTED} />
                    </motion.div>
                  </motion.button>

                  {/* Subcategory pills — shown when expanded */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '2px 16px 16px' }}>
                          {cat.items.map(t => {
                            const sel = interests.includes(t);
                            const colors = INTEREST_COLORS[t];
                            return (
                              <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => onToggle(t)}
                                style={{ padding: '9px 16px', borderRadius: '24px', fontSize: '13px', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", border: `2px solid ${sel ? colors.text : BORDER}`, background: sel ? colors.bg : CARD, color: sel ? colors.text : TEXT2, fontWeight: sel ? 700 : 500, transition: 'all 0.15s' }}>
                                {t}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px 40px', borderTop: `1px solid ${BG}`, flexShrink: 0 }}>
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
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Find my community →
        </motion.button>
      </div>
    </div>
  );
}

// ---- Step 2: Spoken Language ----
function StepSpokenLanguage({
  spokenLanguages,
  onToggle,
  onNext,
  onBack,
}: {
  spokenLanguages: string[];
  onToggle: (lang: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [showOthers, setShowOthers] = useState(false);
  const [othersExpanded, setOthersExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Languages added via the Others autocomplete (not in presets)
  const otherChips = spokenLanguages.filter(l => !SPOKEN_LANGUAGES.includes(l));

  const suggestions = query.trim().length > 0
    ? AUTOCOMPLETE_LANGUAGES.filter(
        l => l.toLowerCase().includes(query.toLowerCase()) && !spokenLanguages.includes(l)
      ).slice(0, 6)
    : [];

  const addLanguage = (lang: string) => {
    const trimmed = lang.trim();
    if (trimmed && !spokenLanguages.includes(trimmed)) {
      onToggle(trimmed);
    }
    setQuery('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && query.trim()) {
      e.preventDefault();
      addLanguage(query);
    }
  };

  const valid = spokenLanguages.length > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: CARD, minHeight: 0 }}>
      <div style={{ padding: '52px 24px 48px', flex: 1, overflowY: 'auto' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', fontFamily: 'inherit', color: TEXT2 }}>
          <ChevronLeft size={18} color={TEXT2} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Back</span>
        </button>
        <ProgressBar step={2} total={3} />
        <div style={{ fontSize: '26px', fontWeight: 800, color: TEXT, lineHeight: '1.2', marginBottom: '8px' }}>
          Which languages do you speak?
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, marginBottom: '28px', lineHeight: '1.5' }}>
          Select all that apply — we'll match you with neighbours who share your language.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SPOKEN_LANGUAGES.map(lang => {
            const selected = spokenLanguages.includes(lang);
            return (
              <motion.button
                key={lang}
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggle(lang)}
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
                  fontFamily: "'Nunito', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {lang}
                {selected && (
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 800 }}>✓</span>
                  </span>
                )}
              </motion.button>
            );
          })}

          {/* Others option */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowOthers(s => { if (s) setOthersExpanded(false); return !s; }); setQuery(''); setShowDropdown(false); }}
            style={{
              padding: '16px 20px',
              borderRadius: '18px',
              border: `2px solid ${showOthers || otherChips.length > 0 ? PRIMARY : BORDER}`,
              background: showOthers || otherChips.length > 0 ? '#FFF0EC' : CARD,
              color: showOthers || otherChips.length > 0 ? PRIMARY : TEXT,
              fontWeight: showOthers || otherChips.length > 0 ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              fontFamily: "'Nunito', sans-serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Others
            {otherChips.length > 0 && (
              <span style={{ minWidth: '22px', height: '22px', borderRadius: '11px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0 }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 800 }}>{otherChips.length}</span>
              </span>
            )}
          </motion.button>

          {/* Show selected other-language chips when section is collapsed */}
          {otherChips.length > 0 && !showOthers && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {otherChips.map(chip => (
                <motion.span
                  key={chip}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 10px', borderRadius: '20px',
                    background: '#FFF0EC', border: `1.5px solid ${PRIMARY}`,
                    color: PRIMARY, fontSize: '13px', fontWeight: 700,
                  }}
                >
                  {chip}
                  <button
                    onClick={() => onToggle(chip)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: PRIMARY }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* Others: search for additional languages */}
          <AnimatePresence initial={false}>
            {showOthers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                style={{ overflow: othersExpanded ? 'visible' : 'hidden' }}
                onAnimationComplete={() => setOthersExpanded(showOthers)}
              >
                <div style={{ position: 'relative' }}>
                  {/* Search box */}
                  <div
                    style={{
                      background: BG,
                      borderRadius: '18px',
                      border: `2px solid ${showDropdown ? PRIMARY : BORDER}`,
                      padding: '10px 14px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {/* Selected chips */}
                    {otherChips.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        {otherChips.map(chip => (
                          <motion.span
                            key={chip}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '5px 10px', borderRadius: '20px',
                              background: '#FFF0EC', border: `1.5px solid ${PRIMARY}`,
                              color: PRIMARY, fontSize: '13px', fontWeight: 700,
                            }}
                          >
                            {chip}
                            <button
                              onClick={() => onToggle(chip)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: PRIMARY }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <input
                      type="text"
                      value={query}
                      onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                      onKeyDown={handleKeyDown}
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
                          const selected = spokenLanguages.includes(lang);
                          return (
                            <button
                              key={lang}
                              onMouseDown={() => addLanguage(lang)}
                              style={{
                                width: '100%', padding: '12px 16px', background: selected ? '#FFF0EC' : 'none',
                                border: 'none', borderTop: i > 0 ? `1px solid ${BORDER}` : 'none',
                                textAlign: 'left', fontSize: '14px', fontWeight: selected ? 700 : 500,
                                color: selected ? PRIMARY : TEXT, cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                              }}
                            >
                              <span>{lang}</span>
                              {selected && (
                                <span style={{ fontSize: '14px', color: PRIMARY }}>✓</span>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ padding: '16px 24px 40px', borderTop: `1px solid ${BG}`, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={!valid}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: '22px',
            background: valid ? `linear-gradient(135deg, ${PRIMARY}, #FF8C70)` : BORDER,
            border: 'none',
            color: valid ? 'white' : MUTED,
            fontWeight: 700,
            fontSize: '16px',
            cursor: valid ? 'pointer' : 'not-allowed',
            boxShadow: valid ? '0 8px 24px rgba(255,107,71,0.35)' : 'none',
            transition: 'all 0.2s',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Next
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
    date: 'Sat, 12 Apr 2026',
    time: '7:00 AM – 9:00 AM',
    emoji: '🏃',
    category: 'Fitness & Sports',
    categoryColor: '#16A34A',
    categoryBg: '#DCFCE7',
    location: 'Bishan-AMK Park, Main Pavilion',
    description: 'Join your neighbours for a refreshing morning run around Bishan-AMK Park. All paces welcome — water stations provided along the route.',
    price: 'Free',
  },
  {
    id: 2,
    title: 'Peranakan Cooking Workshop',
    date: 'Sun, 13 Apr 2026',
    time: '10:00 AM – 1:00 PM',
    emoji: '🍳',
    category: 'Cooking & Baking',
    categoryColor: '#D97706',
    categoryBg: '#FEF3C7',
    location: 'Community Hub, Blk 123 Level 2',
    description: 'Learn to cook traditional Peranakan dishes including Ayam Buah Keluak and Kueh Pie Tee. Ingredients provided. Limited to 15 participants.',
    price: 'Free',
  },
  {
    id: 3,
    title: 'Community Garden Morning',
    date: 'Sat, 19 Apr 2026',
    time: '8:00 AM – 11:00 AM',
    emoji: '🌱',
    category: 'Gardening & Plants',
    categoryColor: '#059669',
    categoryBg: '#D1FAE5',
    location: 'Rooftop Garden, Blk 450',
    description: "Help tend the estate's shared rooftop garden. Activities include planting vegetables, pruning herbs, and composting. Gloves and tools provided.",
    price: 'Free',
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
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (id: number) => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

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
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: TEXT,
            marginBottom: '6px',
            lineHeight: '1.2',
          }}
        >
          Here's your neighbourhood
        </div>
        <div style={{ fontSize: '14px', color: TEXT2, lineHeight: '1.5', marginBottom: interests.length > 0 ? '14px' : '0' }}>
          Based on your interests, we found these for you
        </div>
        {interests.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {interests.map(interest => {
              const colors = INTEREST_COLORS[interest] || { bg: '#FFF0EC', text: PRIMARY };
              return (
                <span
                  key={interest}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: colors.bg,
                    color: colors.text,
                  }}
                >
                  {interest}
                </span>
              );
            })}
          </div>
        )}
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
                          fontFamily: "'Nunito', sans-serif",
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
            {REC_EVENTS.map((ev, i) => {
              const isWishlisted = wishlist.includes(ev.id);
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  style={{ flexShrink: 0, width: '200px', background: CARD, borderRadius: '20px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'relative' }}
                >
                  {/* Wishlist button */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => toggleWishlist(ev.id)}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      width: '30px', height: '30px', borderRadius: '10px',
                      background: isWishlisted ? '#FFF0EC' : BG,
                      border: `1.5px solid ${isWishlisted ? PRIMARY : BORDER}`,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Bookmark size={13} color={isWishlisted ? PRIMARY : MUTED} fill={isWishlisted ? PRIMARY : 'none'} />
                  </motion.button>

                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: ev.categoryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>
                    {ev.emoji}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '6px', lineHeight: '1.35', paddingRight: '32px' }}>{ev.title}</div>
                  <div style={{ fontSize: '11px', color: TEXT2, fontWeight: 500, marginBottom: '8px' }}>📅 {ev.date}</div>
                  <span style={{ padding: '3px 9px', borderRadius: '10px', background: ev.categoryBg, color: ev.categoryColor, fontSize: '10px', fontWeight: 700 }}>
                    {ev.category}
                  </span>
                </motion.div>
              );
            })}
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
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          Get Started →
        </motion.button>
      </div>

    </div>
  );
}
