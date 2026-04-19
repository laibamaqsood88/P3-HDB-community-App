import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ---- Types ----
interface TourStep {
  id: string;
  type: 'modal' | 'spotlight';
  title: string;
  description: string;
  emoji?: string;
  target?: string;
  tooltipSide?: 'above' | 'below';
  navigateTo?: 'events' | 'explore' | 'marketplace' | 'requests' | 'messages';
  navigateSubTab?: 'events' | 'groups' | 'neighbours';
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface GuidedTourProps {
  onNavigate: (tab: 'events' | 'explore' | 'marketplace' | 'requests' | 'messages') => void;
  onNavigateSubTab: (tab: 'events' | 'groups' | 'neighbours') => void;
}

// ---- Tour steps ----
const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    type: 'modal',
    title: "Welcome to your Community 👋",
    description: "Discover local events, connect with neighbours, join interest groups, browse the market, and help each other with requests.",
    emoji: '🏘️',
  },
  {
    id: 'explore-tab',
    type: 'spotlight',
    title: "Explore Your Community",
    description: "Your main discovery hub — find events, groups, and neighbours all in one place.",
    target: 'explore-tab',
    tooltipSide: 'above',
    navigateTo: 'explore',
  },
  {
    id: 'events-subtab',
    type: 'spotlight',
    title: "Discover Events",
    description: "Find community events happening nearby and register to attend.",
    target: 'events-subtab',
    tooltipSide: 'below',
    navigateSubTab: 'events',
  },
  {
    id: 'groups-subtab',
    type: 'spotlight',
    title: "Join Groups",
    description: "Connect with neighbours who share your interests — fitness, food, gardening, and more.",
    target: 'groups-subtab',
    tooltipSide: 'below',
    navigateSubTab: 'groups',
  },
  {
    id: 'neighbours-subtab',
    type: 'spotlight',
    title: "Meet Neighbours",
    description: "Discover neighbours nearby with similar interests and start a conversation.",
    target: 'neighbours-subtab',
    tooltipSide: 'below',
    navigateSubTab: 'neighbours',
  },
  {
    id: 'market-tab',
    type: 'spotlight',
    title: "Browse the Market",
    description: "Find items and services from neighbours — or list your own for others to discover.",
    target: 'market-tab',
    tooltipSide: 'above',
    navigateTo: 'marketplace',
  },
  {
    id: 'requests-tab',
    type: 'spotlight',
    title: "Community Requests",
    description: "See what your neighbours need help with, or post your own request.",
    target: 'requests-tab',
    tooltipSide: 'above',
    navigateTo: 'requests',
  },
  {
    id: 'requests-add',
    type: 'spotlight',
    title: "Post a Request",
    description: "Tap + to create a new request and let your community know what you need.",
    target: 'requests-add',
    tooltipSide: 'below',
  },
  {
    id: 'completion',
    type: 'modal',
    title: "You're all set! 🎉",
    description: "Your community is waiting. Start exploring, connecting, and making your neighbourhood a better place.",
    emoji: '✨',
  },
];

// ---- Component ----
export function GuidedTour({ onNavigate, onNavigateSubTab }: GuidedTourProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);

  const completeTour = useCallback(() => {
    setIsVisible(false);
  }, []);

  const measureTarget = useCallback((target: string) => {
    const el = document.querySelector(`[data-tour="${target}"]`);
    if (!el) {
      setSpotlightRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setSpotlightRect({
      top: rect.top - 6,
      left: rect.left - 8,
      width: rect.width + 16,
      height: rect.height + 12,
    });
  }, []);

  // When the step changes, navigate and then measure target
  useEffect(() => {
    if (!isVisible) return;

    const step = TOUR_STEPS[currentStep];

    if (step.navigateTo) {
      onNavigate(step.navigateTo);
    }
    if (step.navigateSubTab) {
      onNavigateSubTab(step.navigateSubTab);
    }

    if (step.type === 'modal' || !step.target) {
      setSpotlightRect(null);
      return;
    }

    // Wait for DOM to update after navigation
    const timer = setTimeout(() => {
      measureTarget(step.target!);
    }, 350);

    return () => clearTimeout(timer);
  }, [currentStep, isVisible, onNavigate, onNavigateSubTab, measureTarget]);

  const goNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      completeTour();
    }
  }, [currentStep, completeTour]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  }, [currentStep]);

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;
  const totalSteps = TOUR_STEPS.length;

  // ---- Tooltip vertical position ----
  const getTooltipStyle = (): React.CSSProperties => {
    const base = {
      background: 'white',
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      zIndex: 10001,
      position: 'fixed' as const,
      left: '50%',
      width: 'calc(100% - 48px)',
      maxWidth: '400px',
    };

    if (step.type === 'modal') {
      return { ...base, top: '50%', borderRadius: '24px', padding: '28px 24px 24px' };
    }

    if (spotlightRect) {
      if (step.tooltipSide === 'above') {
        return { ...base, bottom: `calc(100vh - ${spotlightRect.top}px + 12px)`, borderRadius: '20px', padding: '20px' };
      } else {
        return { ...base, top: `${spotlightRect.top + spotlightRect.height + 12}px`, borderRadius: '20px', padding: '20px' };
      }
    }

    return { ...base, top: '50%', borderRadius: '20px', padding: '20px' };
  };

  return (
    <>
      {/* Dark overlay — only for non-spotlight or when spotlight rect not available */}
      {step.type === 'modal' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.58)',
            zIndex: 9999,
          }}
        />
      )}

      {/* Spotlight highlight */}
      {step.type === 'spotlight' && spotlightRect && (
        <div
          style={{
            position: 'fixed',
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
            borderRadius: '14px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.58)',
            zIndex: 10000,
            pointerEvents: 'none',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      )}

      {/* Fallback full overlay when spotlight rect not yet measured */}
      {step.type === 'spotlight' && !spotlightRect && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.58)',
            zIndex: 9999,
          }}
        />
      )}

      {/* Tooltip / Modal card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10, x: '-50%' }}
          animate={{ opacity: 1, y: step.type === 'modal' ? '-50%' : 0, x: '-50%' }}
          exit={{ opacity: 0, y: -10, x: '-50%' }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={getTooltipStyle()}
        >
          {step.type === 'modal' ? (
            // ---- Modal card (welcome / completion) ----
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              {step.emoji && (
                <div style={{ fontSize: '48px', lineHeight: 1, marginBottom: '4px' }}>
                  {step.emoji}
                </div>
              )}
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1C1C1E', fontFamily: "'Nunito', sans-serif", lineHeight: 1.25 }}>
                {step.title}
              </div>
              <div style={{ fontSize: '14px', color: '#6B6B72', lineHeight: 1.55, fontFamily: "'Nunito', sans-serif", maxWidth: '280px' }}>
                {step.description}
              </div>

              {/* Step dots */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: i === currentStep ? '#1C1C1E' : '#E5E5EA',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>

              {/* CTA button */}
              <button
                onClick={isLast ? completeTour : goNext}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  background: '#1C1C1E',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {isLast ? 'Start Exploring →' : "Let's go →"}
              </button>
            </div>
          ) : (
            // ---- Spotlight tooltip card ----
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1C1C1E', fontFamily: "'Nunito', sans-serif", lineHeight: 1.3 }}>
                {step.title}
              </div>
              <div style={{ fontSize: '13px', color: '#6B6B72', lineHeight: 1.5, marginTop: '6px', fontFamily: "'Nunito', sans-serif" }}>
                {step.description}
              </div>

              {/* Step dots */}
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '14px' }}>
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: i === currentStep ? '#1C1C1E' : '#E5E5EA',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>

              {/* Buttons row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', gap: '8px' }}>
                {/* Skip */}
                <button
                  onClick={completeTour}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#AEAEB2',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: "'Nunito', sans-serif",
                    padding: '4px 0',
                    fontWeight: 500,
                  }}
                >
                  Skip
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Back */}
                  {currentStep > 0 && (
                    <button
                      onClick={goBack}
                      style={{
                        background: '#F2F2F7',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#3C3C43',
                        cursor: 'pointer',
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      Back
                    </button>
                  )}

                  {/* Next / Done */}
                  <button
                    onClick={isLast ? completeTour : goNext}
                    style={{
                      background: '#1C1C1E',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 20px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'white',
                      cursor: 'pointer',
                      fontFamily: "'Nunito', sans-serif",
                    }}
                  >
                    {isLast ? 'Done' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
