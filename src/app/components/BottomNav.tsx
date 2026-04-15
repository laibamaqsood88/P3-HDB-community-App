import { Home, Compass, ShoppingBag, MessageCircle, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

type ActiveTab = 'events' | 'explore' | 'marketplace' | 'requests' | 'messages';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const NAV_TABS: { id: ActiveTab; label: string; Icon: React.FC<any> }[] = [
  { id: 'events',      label: 'Home',      Icon: Home },
  { id: 'explore',     label: 'Explore',   Icon: Compass },
  { id: 'marketplace', label: 'Market',    Icon: ShoppingBag },
  { id: 'requests',    label: 'Requests',  Icon: ClipboardList },
  { id: 'messages',    label: 'Messages',  Icon: MessageCircle },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    /* Safe-area wrapper */
    <div style={{ padding: '0 14px 24px', background: 'transparent' }}>

      {/* Frosted glass floating pill — content visible through it */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
          borderRadius: '999px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset',
          border: '1px solid rgba(255,255,255,0.6)',
          padding: '5px',
          gap: '2px',
        }}
      >
        {NAV_TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
