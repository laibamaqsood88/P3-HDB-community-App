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
    /* Safe-area wrapper — transparent, just handles bottom spacing */
    <div style={{ padding: '0 12px 20px', background: 'transparent' }}>
      {/* Floating pill capsule — no background */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '999px',
          background: 'transparent',
          padding: '6px 8px',
          gap: '2px',
        }}
      >
        {NAV_TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              whileTap={{ scale: 0.91 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '6px 4px 5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              {/* Active soft highlight — rounded rect behind icon + label */}
              {active && (
                <motion.div
                  layoutId="activeNavPill"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'rgba(0,0,0,0.07)',
                  }}
                />
              )}

              {/* Icon */}
              <Icon
                size={22}
                color={active ? '#1C1C1E' : '#AEAEB2'}
                strokeWidth={active ? 2.2 : 1.6}
                style={{ position: 'relative', zIndex: 1 }}
              />

              {/* Label */}
              <span
                style={{
                  fontSize: '10px',
                  lineHeight: '1.1',
                  color: active ? '#1C1C1E' : '#AEAEB2',
                  fontWeight: active ? 700 : 400,
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
