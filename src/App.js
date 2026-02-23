import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Copy, Heart } from "lucide-react"
import { useEffect, useState } from "react"

// ── Google Sheets URL ────────────────────────────────────────────
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1fahMI_bWT6o5OzwdH2I69zRtl9v8sUuV3CFyoMpf-AQ/export?format=csv";

const cardNumber = "9860060937472029";

// ── Crescent Moon SVG ─────────────────────────────────────────────
const CrescentIcon = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" fill="currentColor" />
  </svg>
);

// ── Star SVG ──────────────────────────────────────────────────────
const StarIcon = ({ size = 4, opacity = 1 }) => (
  <svg width={size * 4} height={size * 4} viewBox="0 0 16 16" fill="none" style={{ opacity }}>
    <polygon points="8,1 9.8,6.2 15.5,6.2 11,9.4 12.8,14.7 8,11.5 3.2,14.7 5,9.4 0.5,6.2 6.2,6.2" fill="#f5c842" />
  </svg>
);

// ── Floating stars ────────────────────────────────────────────────
const FloatingStars = () => {
  const stars = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    delay: Math.random() * 4,
    dur: Math.random() * 3 + 3,
    opacity: Math.random() * 0.5 + 0.2,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity], scale: [1, 0.7, 1] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <StarIcon size={s.size} opacity={s.opacity} />
        </motion.div>
      ))}
    </div>
  );
};

// ── Ripple hook ───────────────────────────────────────────────────
const useRipple = () => {
  const [ripples, setRipples] = useState([]);
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  };
  return [ripples, addRipple];
};

// ── Main ──────────────────────────────────────────────────────────
export default function App() {
  const [copied, setCopied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ripples, addRipple] = useRipple();
  const [collected, setCollected] = useState(null);
  const [sheetDate, setSheetDate] = useState("");

  useEffect(() => {
    fetch(SHEET_URL)
      .then((r) => r.text())
      .then((text) => {
        const rows = text.trim().split("\n");
        const num = parseInt((rows[0] || "").replace(/\D/g, ""), 10);
        if (!isNaN(num)) setCollected(num);
        const date = (rows[1] || "").trim().replace(/^"|"$/g, "");
        if (date) setSheetDate(date);
      })
      .catch(() => {});
  }, []);

  const carouselImages = [
    "/images/gazo-1.jpg",
    "/images/gazo-2.jpg",
    "/images/gazo-3.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % 3), 3800);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setCurrentSlide((p) => (p - 1 + 3) % 3);
  const goNext = () => setCurrentSlide((p) => (p + 1) % 3);

  const handleCopy = async (e) => {
    addRipple(e);
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const stagger = (i) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.15 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0d1b2a;
          --gold: #c9a96e;
          --gold2: #f5c842;
          --cream: #fdf6e3;
          --text: #f0e6d0;
          --muted: #9a8e7a;
          --card-bg: rgba(18, 34, 54, 0.85);
          --border: rgba(201, 169, 110, 0.25);
          --shadow: 0 8px 48px rgba(0,0,0,0.55);
        }

        body { background: var(--bg); font-family: 'Nunito', sans-serif; color: var(--text); }

        .page {
          min-height: 100svh;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, #1a3a5c 0%, #0d1b2a 70%);
          position: relative; overflow: hidden; display: flex; flex-direction: column;
        }

        .blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .blob1 { width: 400px; height: 400px; top: -100px; left: -100px; background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%); }
        .blob2 { width: 500px; height: 500px; top: 30%; right: -150px; background: radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%); }
        .blob3 { width: 350px; height: 350px; bottom: 0; left: 30%; background: radial-gradient(circle, rgba(245,200,66,0.10) 0%, transparent 70%); }

        .geo-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='rgba(201,169,110,0.05)' stroke-width='0.5'/%3E%3Cpath d='M0 0 L30 30 M60 0 L30 30 M0 60 L30 30 M60 60 L30 30' stroke='rgba(201,169,110,0.04)' stroke-width='0.5'/%3E%3C/svg%3E");
        }

        .main { position: relative; z-index: 10; max-width: 760px; margin: 0 auto; width: 100%; padding: 24px 16px 40px; }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.06));
          border: 1px solid rgba(201,169,110,0.35); border-radius: 100px;
          padding: 6px 18px; font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
        }

        .title {
          font-family: 'Amiri', serif; font-size: clamp(2.2rem, 7vw, 4rem);
          font-weight: 700; line-height: 1.1; color: var(--cream);
          text-shadow: 0 2px 24px rgba(201,169,110,0.35); margin-bottom: 8px;
        }

        .subtitle {
          font-size: clamp(1rem, 3vw, 1.3rem); color: var(--gold);
          font-style: italic; font-family: 'Amiri', serif; margin-bottom: 28px;
        }

        .divider { display: flex; align-items: center; gap: 12px; margin: 28px 0; opacity: 0.55; }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
        .divider-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold2); flex-shrink: 0; }

        .card {
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 24px; padding: 28px 24px; backdrop-filter: blur(16px);
          box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,0.06); margin-bottom: 20px;
        }

        /* ── Funding card ── */
        .funding-card {
          background: linear-gradient(135deg, rgba(245,200,66,0.08), rgba(201,169,110,0.05));
          border: 1px solid rgba(245,200,66,0.25);
          border-radius: 24px; padding: 24px 28px;
          backdrop-filter: blur(16px);
          box-shadow: var(--shadow), 0 0 40px rgba(245,200,66,0.06);
          margin-bottom: 20px; text-align: center;
        }
        .funding-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
        }
        .funding-amount {
          font-family: 'Amiri', serif;
          font-size: clamp(2.2rem, 8vw, 3.8rem);
          font-weight: 700; color: var(--gold2); line-height: 1;
          text-shadow: 0 0 32px rgba(245,200,66,0.3);
        }
        .funding-currency {
          font-size: clamp(1rem, 3vw, 1.4rem);
          color: var(--gold); margin-left: 6px; font-family: 'Amiri', serif;
        }

        .carousel-wrap {
          border-radius: 20px; overflow: hidden; position: relative;
          aspect-ratio: 16/10; background: #0a1828;
          border: 1px solid rgba(201,169,110,0.2);
        }
        .carousel-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .carousel-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,24,40,0.7) 0%, transparent 50%);
          pointer-events: none;
        }

        .nav-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.45);
          background: rgba(13,27,42,0.75); color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; backdrop-filter: blur(8px); transition: all 0.2s ease; z-index: 5;
        }
        .nav-btn:hover { background: rgba(201,169,110,0.2); transform: translateY(-50%) scale(1.1); }
        .nav-btn:active { transform: translateY(-50%) scale(0.95); }
        .nav-btn.left { left: 12px; }
        .nav-btn.right { right: 12px; }

        .dots { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(201,169,110,0.25); border: 1px solid rgba(201,169,110,0.4);
          transition: all 0.3s ease; cursor: pointer;
        }
        .dot.active { background: var(--gold2); border-color: var(--gold2); transform: scale(1.3); }

        .info-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
        .info-icon {
          width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(249,115,22,0.2), rgba(201,169,110,0.1));
          border: 1px solid rgba(249,115,22,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .info-label { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); margin-bottom: 3px; }
        .info-text { font-size: clamp(0.9rem, 2.5vw, 1.05rem); font-weight: 600; color: var(--text); }

        .card-box {
          background: rgba(10,20,36,0.7); border: 1px solid rgba(201,169,110,0.3);
          border-radius: 16px; padding: 16px 18px; margin-top: 20px;
        }
        .card-label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
        .card-number-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .card-num {
          flex: 1; font-family: 'Courier New', monospace;
          font-size: clamp(0.95rem, 3vw, 1.25rem); font-weight: 700;
          letter-spacing: 0.12em; color: var(--gold2);
          background: rgba(245,200,66,0.06); border: 1px solid rgba(245,200,66,0.15);
          border-radius: 10px; padding: 10px 14px; min-width: 0; word-break: break-all;
        }

        .copy-btn {
          position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px;
          transition: all 0.25s ease; white-space: nowrap;
          background: linear-gradient(135deg, #c9a96e, #f5c842);
          color: #0d1b2a; box-shadow: 0 4px 20px rgba(201,169,110,0.35);
        }
        .copy-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(201,169,110,0.5); }
        .copy-btn:active { transform: scale(0.97); }
        .copy-btn.copied { background: linear-gradient(135deg, #22c55e, #16a34a); box-shadow: 0 4px 20px rgba(34,197,94,0.35); }

        .ripple {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.35);
          animation: ripple-anim 0.7s ease-out forwards;
          pointer-events: none; transform: translate(-50%,-50%);
        }
        @keyframes ripple-anim {
          from { width: 0; height: 0; opacity: 1; }
          to { width: 200px; height: 200px; opacity: 0; }
        }

        .date-card {
          text-align: center; padding: 24px;
          background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(201,169,110,0.08));
          border: 1px solid rgba(249,115,22,0.2); border-radius: 20px;
        }
        .date-main { font-family: 'Amiri', serif; font-size: clamp(1.6rem, 5vw, 2.5rem); font-weight: 700; color: var(--cream); line-height: 1.2; }
        .date-sub { font-size: 14px; color: var(--gold); font-style: italic; margin-top: 6px; }

        .founder-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.2);
          border-radius: 100px; padding: 8px 20px; font-size: 14px; color: var(--text);
        }

        .footer {
          position: relative; z-index: 10; text-align: center; padding: 16px;
          border-top: 1px solid rgba(201,169,110,0.12);
          background: rgba(13,27,42,0.4); font-size: 13px; color: var(--muted);
          font-size: 16px; font-weight: 500;
        }
        .footer a { color: var(--gold); text-decoration: none; font-weight: 700; }
        .footer a:hover { text-decoration: underline; }

        @media (max-width: 500px) {
          .main { padding: 16px 12px 32px; }
          .card { padding: 20px 16px; }
          .card-number-row { flex-direction: column; }
          .copy-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="page">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />
        <div className="geo-pattern" />
        <FloatingStars />

        <main className="main">

          {/* ── Header ── */}
          <motion.div style={{ textAlign: "center", marginBottom: 32 }} {...stagger(0)}>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              <span className="badge">
                <CrescentIcon style={{ width: 15, height: 15, color: "#f5c842" }} />
                Ramazon 2025 · 2-Mavsum
                <CrescentIcon style={{ width: 15, height: 15, color: "#f5c842" }} />
              </span>
            </motion.div>
            <motion.h1 className="title" {...stagger(1)}>G'azo uchun Umid</motion.h1>
            <motion.p className="subtitle" {...stagger(2)}>Birgalikda yordam uzatamiz</motion.p>
          </motion.div>

          {/* ── Yig'ilgan summa ── */}
          <motion.div className="funding-card" {...stagger(3)}>
            <div className="funding-label">Yig'ilgan mablag'</div>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {collected === null ? (
                <span className="funding-amount" style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", opacity: 0.4 }}>Yuklanmoqda...</span>
              ) : (
                <>
                  <span className="funding-amount">{collected.toLocaleString("uz-UZ")}</span>
                  <span className="funding-currency">so'm</span>
                </>
              )}
            </motion.div>
            {sheetDate && (
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
                {sheetDate} holatiga ko'ra
              </div>
            )}
          </motion.div>

          {/* ── Intro ── */}
          <motion.div className="card" {...stagger(4)}>
            <p style={{ fontSize: "clamp(1rem, 3vw, 1.15rem)", lineHeight: 1.7, color: "var(--text)", marginBottom: 20, textAlign: "center" }}>
              Mazkur dastur <strong style={{ color: "var(--gold2)" }}>G'azodagi odamlarga</strong> yordam qo'lini cho'zish uchun tashkil etildi. Sizning kichik hissangiz katta umid olib keladi.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.span className="founder-tag" whileHover={{ scale: 1.03 }}>
                <Heart style={{ width: 15, height: 15, color: "#f97316" }} />
                Asoschisi: <strong>Nafosatxon Farhodova</strong>
              </motion.span>
            </div>
          </motion.div>

          {/* ── Carousel ── */}
          <motion.div className="card" {...stagger(5)} style={{ padding: "20px" }}>
            <div className="carousel-wrap">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={carouselImages[currentSlide]}
                  alt={`slide ${currentSlide + 1}`}
                  className="carousel-img"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
              <div className="carousel-gradient" />
              <motion.button className="nav-btn left" onClick={goPrev} whileTap={{ scale: 0.88 }}>
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button className="nav-btn right" onClick={goNext} whileTap={{ scale: 0.88 }}>
                <ChevronRight size={20} />
              </motion.button>
            </div>
            <div className="dots">
              {carouselImages.map((_, i) => (
                <motion.div
                  key={i}
                  className={`dot ${i === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(i)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Donation ── */}
          <motion.div className="card" {...stagger(6)}>
            <p style={{ fontWeight: 800, fontSize: "clamp(1rem, 3vw, 1.15rem)", color: "var(--gold)", marginBottom: 20, textAlign: "center", letterSpacing: "0.02em" }}>
              ✦ Xayr-ehson qilish usullari ✦
            </p>
            <div className="divider">
              <div className="divider-line" /><div className="divider-dot" /><div className="divider-line" />
            </div>
            <motion.div className="info-row" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <div className="info-icon">💵</div>
              <div>
                <div className="info-label">Naqd pul</div>
                <div className="info-text">Maktabda bevosita topshirish mumkin</div>
              </div>
            </motion.div>
            <motion.div className="info-row" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <div className="info-icon">💳</div>
              <div>
                <div className="info-label">Plastik karta</div>
                <div className="info-text">Quyidagi karta raqamiga o'tkazma qiling</div>
              </div>
            </motion.div>
            <div className="card-box">
              <div className="card-label">Karta raqami</div>
              <div className="card-number-row">
                <div className="card-num">{cardNumber.match(/.{1,4}/g)?.join(" ")}</div>
                <motion.button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {ripples.map((r) => (
                    <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
                  ))}
                  {copied ? <><Check size={16} /> Nusxalandi!</> : <><Copy size={16} /> Nusxalash</>}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Date ── */}
          <motion.div {...stagger(7)}>
            <div className="date-card">
              <div className="date-main">18-fevral — 20-mart</div>
              <div className="date-sub">Ramazon oyi davomida</div>
            </div>
          </motion.div>

        </main>

        <motion.footer
          className="footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          created by{" "}
          <a href="https://t.me/bahodir_husainov" target="_blank" rel="noreferrer">
            Bahodir Husainov
          </a>
        </motion.footer>
      </div>
    </>
  );
}
