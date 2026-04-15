import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, MapPin, CheckCircle } from 'lucide-react';

// ---- Design tokens (Apple HIG) ----
const BG = '#F7F7F7';
const PRIMARY = '#FF6B47';
const TEXT = '#1C1C1E';
const TEXT2 = '#636366';
const MUTED = '#8E8E93';
const BORDER = 'rgba(60,60,67,0.12)';

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

    // Soft warm blob top-right
    const g1 = ctx.createRadialGradient(w * 0.8, h * 0.15, 0, w * 0.8, h * 0.15, w * 0.6);
    g1.addColorStop(0, 'rgba(255,107,71,0.18)');
    g1.addColorStop(0.5, 'rgba(255,144,104,0.09)');
    g1.addColorStop(1, 'rgba(255,176,138,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.ellipse(w * 0.8, h * 0.15, w * 0.6, h * 0.4, Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();

    // Softer blob bottom-left
    const g2 = ctx.createRadialGradient(w * 0.05, h * 0.75, 0, w * 0.05, h * 0.75, w * 0.4);
    g2.addColorStop(0, 'rgba(255,107,71,0.10)');
    g2.addColorStop(1, 'rgba(255,107,71,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(w * 0.05, h * 0.75, w * 0.4, h * 0.25, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '60%',
          pointerEvents: 'none',
        }}
      />

      {/* Hero area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '52px 32px 28px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* App icon */}
        <motion.div
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '26px',
            background: 'linear-gradient(145deg, #FF6B47 0%, #FF8C6B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(255,107,71,0.32), 0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '28px',
          }}
        >
          <MapPin size={44} color="white" strokeWidth={1.8} />
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ textAlign: 'center', width: '100%' }}
        >
          <div
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: TEXT,
              letterSpacing: '-0.6px',
              lineHeight: 1.1,
              marginBottom: '10px',
            }}
          >
            NeighbourHood
          </div>
          <div
            style={{
              fontSize: '16px',
              color: TEXT2,
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: '6px',
            }}
          >
            Connect with your neighbours
          </div>
          <div
            style={{
              fontSize: '13px',
              color: MUTED,
              fontWeight: 500,
              marginBottom: '40px',
            }}
          >
            Estate-verified · Singpass secured
          </div>

          {/* Singpass login button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onLogin}
            style={{
              width: '100%',
              padding: '17px 24px',
              borderRadius: '14px',
              background: '#FFFFFF',
              border: `1px solid ${BORDER}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#111111' }}>
              Log in with&nbsp;
            </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#E30613' }}>
              singpass
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom trust strip */}
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.45 }}
        style={{
          padding: '0 24px 44px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: MUTED,
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: '14px',
            lineHeight: 1.6,
          }}
        >
          Your identity is verified and no personal data is stored.
        </div>

        {/* Trust row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px 20px',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: `1px solid ${BORDER}`,
          }}
        >
          <CheckCircle size={15} color="#34C759" strokeWidth={2} />
          <span style={{ fontSize: '13px', color: TEXT2, fontWeight: 600 }}>
            MyInfo data is not accessed
          </span>
          <Shield size={14} color={MUTED} strokeWidth={1.8} />
        </div>
      </motion.div>
    </div>
  );
}
