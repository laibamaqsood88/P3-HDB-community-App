import { Calendar, Users, HandHelping, User } from 'lucide-react';
import { motion } from 'motion/react';

type ActiveTab = 'events' | 'neighbours' | 'help' | 'profile';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const NAV_TABS: { id: ActiveTab; label: string; Icon: React.FC<any> }[] = [
  { id: 'events',     label: 'Events',     Icon: Calendar },
  { id: 'neighbours', label: 'Connect', Icon: Users },
  { id: 'help',       label: 'Marketplace', Icon: HandHelping },
  { id: 'profile',    label: 'Profile',    Icon: User },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <div style={{
      background: 'white',
      borderTop: '1px solid #F0EFE9',
      display: 'flex',
      padding: '10px 8px 26px',
      gap: '2px',
    }}>
      {NAV_TABS.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <motion.div
              animate={{ scale: active ? 1.06 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              style={{
                width: '46px',
                height: '30px',
                borderRadius: '15px',
                background: active ? '#FFF0EC' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                size={20}
                color={active ? '#FF6B47' : '#B0B0BB'}
                strokeWidth={active ? 2.5 : 1.8}
              />
            </motion.div>
            <span style={{
              fontSize: '10px',
              lineHeight: 1,
              color: active ? '#FF6B47' : '#B0B0BB',
              fontWeight: active ? 700 : 500,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
