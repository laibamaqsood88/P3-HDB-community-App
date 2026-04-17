import { Home, Compass, ShoppingBag, MessageCircle, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

type ActiveTab = 'events' | 'explore' | 'marketplace' | 'requests' | 'messages';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const NAV_TABS: { id: ActiveTab; label: string; Icon: React.FC<any>; tourId?: string }[] = [
  { id: 'events',      label: 'Home',      Icon: Home },
  { id: 'explore',     label: 'Explore',   Icon: Compass,       tourId: 'explore-tab' },
  { id: 'marketplace', label: 'Market',    Icon: ShoppingBag,   tourId: 'market-tab' },
  { id: 'requests',    label: 'Requests',  Icon: ClipboardList, tourId: 'requests-tab' },
  { id: 'messages',    label: 'Messages',  Icon: MessageCircle },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    /* Safe-area wrapper */
    <div style={{ padding: '0 14px 24px', background: 'transparent' }}>

      {/* iOS system-material pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          /* iOS .systemThinMaterial — tinted white, high-saturation blur */
          background: 'rgba(248,248,250,0.78)',
          backdropFilter: 'blur(40px) saturate(2) brightness(1.06)',
          WebkitBackdropFilter: 'blur(40px) saturate(2) brightness(1.06)',
          borderRadius: '999px',
          /* Hairline outer edge + soft lift shadow */
          border: '0.5px solid rgba(0,0,0,0.09)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.10), ' +
            '0 2px 8px rgba(0,0,0,0.06), ' +
            '0 0.5px 0 rgba(255,255,255,1) inset',
          padding: '5px',
          gap: '2px',
        }}
      >
        {NAV_TABS.map(({ id, label, Icon, tourId }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              {...(tourId ? { 'data-tour': tourId } : {})}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '7px 6px 6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                position: 'relative',
                borderRadius: '999px',
                minWidth: 0,
              }}
            >
              {/* Active liquid glass highlight */}
              {active && (
                <motion.div
                  layoutId="activeNavPill"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.62)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.85)',
                    boxShadow: '0 1px 6px rgba(255,107,71,0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
                  }}
                />
              )}

              {/* Icon */}
              <Icon
                size={20}
                color={active ? '#FF6B47' : '#8E8E93'}
                strokeWidth={active ? 2.3 : 1.6}
                style={{ position: 'relative', zIndex: 1 }}
              />

              {/* Label */}
              <span
                style={{
                  fontSize: '10px',
                  lineHeight: '1.2',
                  color: active ? '#FF6B47' : '#8E8E93',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.1px',
                  position: 'relative',
                  zIndex: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
