import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckCircle } from 'lucide-react';
import mccyLogo from '../../imports/mccy-logo-v2.webp';
import loginImage from '../../assets/login2.png';

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

      {/* Hero area — community illustration */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative',
          zIndex: 1,
          paddingBottom: '8px',
          overflow: 'visible',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          style={{ width: '92%', maxWidth: '460px', marginBottom: '-108px', position: 'relative', zIndex: 2 }}
        >
          <img
            src={loginImage}
            alt="Community illustration"
            style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }}
          />
        </motion.div>
      </div>

      {/* White bottom panel */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          padding: '36px 28px 56px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: '28px', fontWeight: 800, color: TEXT, letterSpacing: '-0.4px', lineHeight: 1.2, marginBottom: '10px' }}>
          NeighbourLah
        </div>
        <div style={{ fontSize: '15px', color: TEXT2, fontWeight: 500, lineHeight: 1.6, marginBottom: '44px' }}>
          Connect, exchange, lend a hand and join events in your estate. Brought to you by the Ministry of Culture, Community & Youth.
        </div>

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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
          <CheckCircle size={13} color={MUTED} strokeWidth={2} />
          <span style={{ fontSize: '12px', color: MUTED, fontWeight: 500 }}>
            MyInfo data is not accessed
          </span>
        </div>
      </motion.div>
    </div>
  );
}
