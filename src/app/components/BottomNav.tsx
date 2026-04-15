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
    /* Transparent wrapper — no background, just safe-area spacing */
    <div style={{ padding: '6px 4px 28px', background: 'transparent', display: 'flex' }}>
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
              paddingTop: '4px',
              paddingBottom: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {/* Icon wrapper — 44×44 so the circle always fills perfectly */}
            <div
              style={{
                position: 'relative',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Dark circle behind active icon */}
              {active && (
                <motion.div
                  layoutId="activeNavBubble"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#1C1C1E',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.22)',
                  }}
                />
              )}
              <Icon
                size={22}
                color={active ? '#FFFFFF' : '#8E8E93'}
                strokeWidth={active ? 2.2 : 1.7}
                style={{ position: 'relative', zIndex: 1 }}
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
              }}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
