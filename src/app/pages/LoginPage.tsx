import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

// ---- Design tokens ----
const BG = '#F5F4F0';
const PRIMARY = '#FF6B47';
const TEXT = '#0D0D0D';
const TEXT2 = '#6B6B72';
const MUTED = '#AEAEB2';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Blob 1 — warm orange
    const g1 = ctx.createRadialGradient(w * 0.75, h * 0.2, 0, w * 0.75, h * 0.2, w * 0.65);
    g1.addColorStop(0, 'rgba(255,107,71,0.35)');
    g1.addColorStop(0.6, 'rgba(255,144,104,0.18)');
    g1.addColorStop(1, 'rgba(255,176,138,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.ellipse(w * 0.75, h * 0.2, w * 0.65, h * 0.45, Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();

    // Blob 2 — softer bottom left
    const g2 = ctx.createRadialGradient(w * 0.1, h * 0.7, 0, w * 0.1, h * 0.7, w * 0.45);
    g2.addColorStop(0, 'rgba(255,107,71,0.18)');
    g2.addColorStop(1, 'rgba(255,107,71,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(w * 0.1, h * 0.7, w * 0.45, h * 0.3, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const features = [
    { icon: '🔒', label: 'Verified Residents Only' },
    { icon: '📍', label: 'Your Estate Only' },
    { icon: '🤝', label: 'Real Connections' },
  ];

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Illustrated background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '55%',
          pointerEvents: 'none',
        }}
      />

      {/* Top hero area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 32px 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '28px',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '42px',
            boxShadow: '0 8px 32px rgba(255,107,71,0.22), 0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '20px',
          }}
        >
          🏘️
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: TEXT,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              marginBottom: '10px',
            }}
          >
            NeighbourHood
          </div>
          <div
            style={{
              fontSize: '15px',
              color: TEXT2,
              fontWeight: 500,
              lineHeight: '1.5',
              marginBottom: '8px',
            }}
          >
            Connect with neighbours in your HDB estate
          </div>
          <div
            style={{
              fontSize: '12px',
              color: MUTED,
              fontWeight: 500,
              letterSpacing: '0.1px',
            }}
          >
            Estate-verified · Privacy-first · Singpass secured
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.5 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            maxWidth: '320px',
            marginTop: '36px',
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.42 + i * 0.08, duration: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '13px 16px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{f.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: TEXT }}>{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA area */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          padding: '0 24px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Singpass button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '18px 24px',
            borderRadius: '22px',
            background: '#E30613',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 8px 28px rgba(227,6,19,0.32)',
            marginBottom: '16px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Singpass logo badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(255,255,255,0.15)',
              padding: '5px 10px',
              borderRadius: '8px',
            }}
          >
            <span style={{ fontSize: '15px', color: 'white', fontWeight: 900, letterSpacing: '0.5px' }}>
              Sing
            </span>
            <span
              style={{
                fontSize: '15px',
                color: '#FF6B6B',
                fontWeight: 900,
                letterSpacing: '0.5px',
              }}
            >
              pass
            </span>
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.1px',
            }}
          >
            Login with Singpass
          </span>
        </motion.button>

        {/* Privacy note */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: MUTED,
            fontWeight: 500,
            marginBottom: '14px',
            lineHeight: '1.6',
          }}
        >
          Your identity is verified. No personal data is stored.
        </div>

        {/* Singpass badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'white',
            borderRadius: '14px',
            border: '1px solid #EDEDEC',
          }}
        >
          <span style={{ fontSize: '16px' }}>🦁</span>
          <Shield size={13} color="#22C55E" />
          <span
            style={{
              fontSize: '12px',
              color: TEXT2,
              fontWeight: 500,
            }}
          >
            MyInfo data is not accessed
          </span>
        </div>
      </motion.div>
    </div>
  );
}
