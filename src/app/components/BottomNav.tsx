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
    /* Outer wrapper — provides safe-area padding and floating positioning */
    <div
      style={{
        padding: '8px 16px 28px',
        background: 'transparent',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Liquid glass pill container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '999px',
          /* Liquid glass: layered translucency + strong blur */
          background: 'rgba(255,255,255,0.58)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
          /* Subtle rim light / border */
          border: '1px solid rgba(255,255,255,0.72)',
          /* Soft shadow for depth */
          boxShadow:
            '0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.04) inset',
          padding: '5px 6px',
          gap: '2px',
        }}
      >
        {NAV_TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: active ? '8px 4px 6px' : '8px 4px 6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              {/* Active bubble — dark filled circle behind icon */}
              {active && (
                <motion.div
                  layoutId="activeNavBubble"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#1C1C1E',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.22)',
                  }}
                />
              )}

              {/* Icon — on top of bubble */}
              <div style={{ position: 'relative', zIndex: 1, height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  size={22}
                  color={active ? '#FFFFFF' : '#6B6B72'}
                  strokeWidth={active ? 2.2 : 1.7}
                />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '10px',
                  lineHeight: '1.1',
                  color: active ? '#1C1C1E' : '#8E8E93',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.1px',
                  position: 'relative',
                  zIndex: 1,
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
