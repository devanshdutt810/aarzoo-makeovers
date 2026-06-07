"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SERVICES = {
  "Air Brush": [
    { title: "Bridal Makeup", inclusions: "Hairstyles, Hair Accessories, Colored Lenses, False Lashes, Draping", studioPrice: 24999, venuePrice: 30000 },
    { title: "Occasion Makeup", inclusions: "Roka, Sagan, Sangeet, Mehndi & more", studioPrice: 12999, venuePrice: 15000 },
    { title: "Party Makeup", inclusions: "Hairstyles & False Lashes", studioPrice: 4999, venuePrice: 6000 },
  ],
  "HD": [
    { title: "Bridal Makeup", inclusions: "Hairstyles, Hair Accessories, Colored Lenses, False Lashes, Draping", studioPrice: 19999, venuePrice: 25000 },
    { title: "Occasion Makeup", inclusions: "Roka, Sagan, Sangeet, Mehndi & more", studioPrice: 11999, venuePrice: 15000 },
    { title: "Party Makeup", inclusions: "Hairstyles & False Lashes", studioPrice: 3499, venuePrice: 5000 },
  ],
  "Basic": [
    { title: "Basic Makeup", inclusions: "—", studioPrice: 3499, venuePrice: null },
  ],
};

const PRE_BRIDAL = [
  { name: "Essential Glow", price: 6999, tag: "Most Popular", items: ["Face Bleach / De-Tan","Facial – Blossom Kochhar","Wax – Arms & Legs (Chocolate)","Manicure","Pedicure","Hair Spa (Loreal)","Threading","Upper Lips"] },
  { name: "Radiance Ritual", price: 9999, tag: "Bestseller", items: ["Face Bleach / De-Tan","Facial – O3+ with Power Mask","Full Body Wax (Chocolate)","Full Body Scrub","Full Body Massage","Manicure Deluxe","Pedicure Deluxe","Hair Spa (Loreal)","Threading","Upper Lips"] },
  { name: "Bridal Luxe", price: 14999, tag: "Premium", items: ["Face Bleach / De-Tan","Facial – Hydra","Full Body Wax (Rica)","Body Polishing (Gold)","Manicure De-Tan","Pedicure De-Tan","Hair Keratin","Hair Cut","Nail Extensions (Hands)","Gel Nail Paint (Feet)","Threading","Upper Lips"] },
];

const TESTIMONIALS = [
  { name: "Chitra Singh", role: "Bride", image: "/avatars/chitra.jpeg", stars: 5, quote: "Anjana was my makeup artist on my engagement day and I really liked her work. She did exactly what I wanted and made the experience really fun and memorable." },
  { name: "Mrs. Parvesh", role: "Client", image: "/avatars/parvesh.png", stars: 5, quote: "Anjana understood my skin and features perfectly. The look stayed flawless all night and photographed beautifully. I received so many compliments from everyone." },
  { name: "Prabha S.", role: "Client", image: "/avatars/prabha.png", stars: 5, quote: "From consultation to the final touch-up, the entire experience was so professional and warm. Highly recommend for bridal and party looks alike." },
];

const PORTFOLIO_CATS = ["All","Bridal","Party","Hair"];

const STATS = [
  { num:"500+", label:"Happy Brides" },
  { num:"10+",  label:"Years Experience" },
  { num:"5★",   label:"Google Rating" },
  { num:"1000+",label:"Total Clients" },
];

function fmtINR(n) {
  if (!n && n !== 0) return "N/A";
  return "₹" + n.toLocaleString("en-IN");
}

// ─── ANIMATED BACKGROUND ─────────────────────────────────────────────────────
function LuxuryBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Floating orbs
    const orbs = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 350 + Math.random() * 500,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.15,
      hue: i % 3 === 0 ? 38 : i % 3 === 1 ? 28 : 48,
      alpha: 0.03 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    // Petals / sparkles
    const petals = Array.from({length: 100}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 0.5 + Math.random() * 1.5,
      speed: 0.15 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.1 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep dark bg gradient
      const bg = ctx.createLinearGradient(0, 0, W * 0.3, H);
      bg.addColorStop(0, "#06030a");
      bg.addColorStop(0.5, "#080410");
      bg.addColorStop(1, "#05030c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Animated orbs
      orbs.forEach(o => {
        o.x += o.dx + Math.sin(t * 0.001 + o.phase) * 0.15;
        o.y += o.dy + Math.cos(t * 0.0013 + o.phase) * 0.12;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `hsla(${o.hue}, 70%, 55%, ${o.alpha * 0.45})`);
        grad.addColorStop(0.35, `hsla(${o.hue}, 55%, 28%, ${o.alpha * 0.18})`);
        grad.addColorStop(1, `hsla(${o.hue}, 35%, 10%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating sparkles/petals
      petals.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift + Math.sin(t * 0.002 + p.phase) * 0.5;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;

        const pulse = 0.5 + 0.5 * Math.sin(t * 0.003 + p.phase);
        ctx.save();
        ctx.globalAlpha = p.opacity * (0.6 + 0.4 * pulse);
        ctx.fillStyle = `hsla(${38 + pulse * 8}, 95%, 78%, 1)`;
        ctx.shadowColor = `hsla(42, 100%, 75%, 1)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + 0.2 * pulse), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}
    />
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function MagneticCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({x:0,y:0});
  const ring = useRef({x:0,y:0});

  useEffect(() => {
    const move = e => { pos.current = {x:e.clientX, y:e.clientY}; };
    window.addEventListener("mousemove", move);
    let raf;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px,${ring.current.y - 18}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position:"fixed",zIndex:9999,pointerEvents:"none",
        width:8,height:8,borderRadius:"50%",
        background:"rgba(232,93,131,0.9)",
        mixBlendMode:"screen",transition:"background 0.2s",
        top:0,left:0,
      }}/>
      <div ref={ringRef} style={{
        position:"fixed",zIndex:9998,pointerEvents:"none",
        width:36,height:36,borderRadius:"50%",
        border:"1px solid rgba(232,93,131,0.5)",
        top:0,left:0,
      }}/>
    </>
  );
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Navbar({ scrollTo, refs }) {
  const [active, setActive] = useState("Portfolio");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const items = ["Portfolio","About","Services","Contact"];
  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      display:"flex",justifyContent:"center",padding:"14px 24px",
    }}>
      <div style={{
        display:"flex",alignItems:"center",gap:4,
        padding:"7px 8px",borderRadius:999,
        background: scrolled ? "rgba(8,4,16,0.8)" : "rgba(8,4,16,0.5)",
        border: `1px solid ${scrolled ? "rgba(232,93,131,0.25)" : "rgba(255,255,255,0.1)"}`,
        backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",
        transition:"all 0.4s ease",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(232,93,131,0.1)" : "none",
      }}>
        {items.map((item) => (
          <button key={item} onClick={() => { setActive(item); scrollTo(refs[item]); }}
            style={{
              padding:"9px 20px",borderRadius:999,border:"none",cursor:"pointer",
              fontFamily:"inherit",fontSize:13,fontWeight: active===item ? 600 : 400,
              letterSpacing:"0.02em",
              color: active===item ? "#fff" : "rgba(255,255,255,0.6)",
              background: active===item
                ? "linear-gradient(135deg,rgba(232,93,131,0.9),rgba(180,60,100,0.8))"
                : "transparent",
              boxShadow: active===item ? "0 0 20px rgba(232,93,131,0.35),inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
              transition:"all 0.25s ease",
            }}>
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onViewWork }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section style={{
      minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      padding:"120px 24px 80px",position:"relative",overflow:"hidden",
    }}>
      {/* Decorative rings */}
      <div style={{
        position:"absolute",width:600,height:600,borderRadius:"50%",
        border:"1px solid rgba(232,93,131,0.08)",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",
        animation:"spin 25s linear infinite",pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute",width:420,height:420,borderRadius:"50%",
        border:"1px solid rgba(232,93,131,0.12)",top:"50%",left:"50%",
        transform:"translate(-50%,-50%)",
        animation:"spin 18s linear infinite reverse",pointerEvents:"none",
      }}/>

      <div style={{
        maxWidth:720,width:"100%",textAlign:"center",
        opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(40px)",
        transition:"opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
      }}>
        {/* Badge */}
        <div style={{
          display:"inline-flex",alignItems:"center",gap:8,
          padding:"7px 18px",borderRadius:999,marginBottom:32,
          background:"rgba(232,93,131,0.1)",border:"1px solid rgba(232,93,131,0.3)",
          fontSize:12,fontWeight:500,color:"rgba(232,93,131,0.9)",letterSpacing:"0.12em",
          textTransform:"uppercase",
        }}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#e85d83",display:"inline-block",animation:"pulse 2s ease infinite"}}/>
          Delhi's Premier Makeup Studio
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily:"'Playfair Display',serif",
          fontSize:"clamp(52px,9vw,110px)",
          fontWeight:700,lineHeight:0.88,
          letterSpacing:"-0.02em",color:"#fff",marginBottom:12,
        }}>
          Aarzoo
          <span style={{
            display:"block",
            background:"linear-gradient(135deg,#f093b0 0%,#e85d83 40%,#c04070 100%)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            fontStyle:"italic",
          }}>
            Makeovers
          </span>
        </h1>

        {/* Divider line with diamond */}
        <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",margin:"28px 0"}}>
          <div style={{height:1,width:80,background:"linear-gradient(to right,transparent,rgba(232,93,131,0.5))"}}/>
          <div style={{width:8,height:8,background:"#e85d83",transform:"rotate(45deg)"}}/>
          <div style={{height:1,width:80,background:"linear-gradient(to left,transparent,rgba(232,93,131,0.5))"}}/>
        </div>

        <p style={{
          fontSize:16,lineHeight:1.8,color:"rgba(255,255,255,0.6)",
          maxWidth:560,margin:"0 auto 36px",fontWeight:300,letterSpacing:"0.01em",
        }}>
          Professional makeup artistry in Delhi NCR. Creating timeless bridal looks and
          editorial-worthy transformations that photograph beautifully and feel effortlessly you.
        </p>

        {/* Chips */}
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:44}}>
          {["Bridal","Air Brush","HD Makeup","Pre-Bridal","Hair Styling"].map(c => (
            <span key={c} style={{
              padding:"7px 18px",borderRadius:999,fontSize:12,fontWeight:500,
              letterSpacing:"0.08em",textTransform:"uppercase",
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
              color:"rgba(255,255,255,0.7)",
            }}>{c}</span>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onViewWork} style={{
            padding:"15px 36px",borderRadius:999,border:"none",cursor:"pointer",
            fontFamily:"inherit",fontSize:14,fontWeight:600,letterSpacing:"0.04em",
            background:"linear-gradient(135deg,#f093b0,#e85d83,#c04070)",
            color:"#fff",
            boxShadow:"0 8px 32px rgba(232,93,131,0.45),0 1px 0 rgba(255,255,255,0.2) inset",
            transition:"all 0.25s ease",
          }}
            onMouseEnter={e=>{e.target.style.transform="translateY(-3px)";e.target.style.boxShadow="0 16px 48px rgba(232,93,131,0.55),0 1px 0 rgba(255,255,255,0.2) inset";}}
            onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 8px 32px rgba(232,93,131,0.45),0 1px 0 rgba(255,255,255,0.2) inset";}}>
            View My Work ✦
          </button>
          <a href="https://wa.me/9540686022" target="_blank" rel="noopener noreferrer" style={{
            padding:"15px 36px",borderRadius:999,
            border:"1px solid rgba(255,255,255,0.15)",
            fontFamily:"inherit",fontSize:14,fontWeight:500,letterSpacing:"0.04em",
            background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.8)",
            textDecoration:"none",backdropFilter:"blur(8px)",cursor:"pointer",
            transition:"all 0.25s ease",
          }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(232,93,131,0.4)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";}}>
            Book Now →
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{marginTop:64,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div style={{width:1,height:40,background:"linear-gradient(to bottom,transparent,rgba(232,93,131,0.6))",animation:"scrollPulse 2s ease infinite"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",letterSpacing:"0.15em",textTransform:"uppercase"}}>Scroll</span>
        </div>
      </div>
    </section>
  );
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function Portfolio({ sectionRef }) {
  const [cat, setCat] = useState("All");
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    isDragging.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    setDragOffset(touchEndX.current - touchStartX.current);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (distance > threshold && idx < maxIdx) {
      setIdx((i) => Math.min(maxIdx, i + 1));
    } else if (distance < -threshold && idx > 0) {
      setIdx((i) => Math.max(0, i - 1));
    }

    setDragOffset(0);
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => setPortfolio(data))
      .catch((err) => console.error('Failed to load portfolio images', err));
  }, []);

  const filtered = cat === "All"
    ? portfolio
    : portfolio.filter((p) => p.cat === cat);
  const visCount = isMobile ? 1 : 3;
  const maxIdx = Math.max(0, filtered.length - visCount);

  const bgMap = {
    Bridal: "linear-gradient(160deg,rgba(232,93,131,0.25) 0%,rgba(180,50,100,0.15) 100%)",
    Party: "linear-gradient(160deg,rgba(150,80,200,0.25) 0%,rgba(80,40,150,0.15) 100%)",
    Hair: "linear-gradient(160deg,rgba(200,150,60,0.25) 0%,rgba(140,80,20,0.15) 100%)",
  };
  const emojiMap = { Bridal:"💍", Party:"✨", Hair:"💇" };

  return (
    <section ref={sectionRef} style={{padding:"100px 0 80px",position:"relative"}}>
      {/* Section label */}
      <div style={{textAlign:"center",marginBottom:16}}>
        <span style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,93,131,0.7)",fontWeight:500}}>
          Our Work
        </span>
      </div>
      <Reveal>
        <h2 style={{
          fontFamily:"'Playfair Display',serif",
          textAlign:"center",fontSize:"clamp(40px,6vw,72px)",
          fontWeight:700,lineHeight:0.9,color:"#fff",marginBottom:48,
          letterSpacing:"-0.01em",
        }}>
          Signature<br/>
          <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Looks</span>
        </h2>
      </Reveal>

      {/* Category tabs */}
      <Reveal delay={100}>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:48,flexWrap:"wrap",padding:"0 24px"}}>
          {PORTFOLIO_CATS.map(c => (
            <button key={c} onClick={() => { setCat(c); setIdx(0); }}
              style={{
                padding:"10px 26px",borderRadius:999,border:"none",cursor:"pointer",
                fontFamily:"inherit",fontSize:13,fontWeight: cat===c ? 600 : 400,
                color: cat===c ? "#fff" : "rgba(255,255,255,0.55)",
                background: cat===c
                  ? "linear-gradient(135deg,rgba(232,93,131,0.85),rgba(180,60,100,0.7))"
                  : "rgba(255,255,255,0.05)",
                border: `1px solid ${cat===c ? "rgba(232,93,131,0.5)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: cat===c ? "0 4px 20px rgba(232,93,131,0.3)" : "none",
                backdropFilter:"blur(8px)",transition:"all 0.22s ease",
                letterSpacing:"0.03em",
              }}>
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Carousel */}
      <div
        style={{position:"relative",overflow:"hidden",padding:isMobile ? "0 16px" : "0 60px",touchAction:"pan-y",userSelect:"none"}}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{
          display:"flex",
          transform:`translateX(calc(-${idx * (100 / visCount)}% + ${dragOffset}px))`,
          transition:isDragging.current ? "none" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
        }}>
          {filtered.map((item, i) => {
            const isHov = hoveredId === item.id;
            const isCtr = i === idx + Math.floor(visCount/2);
            return (
              <div key={item.id} style={{
                minWidth:`${100/visCount}%`,padding:"0 10px",
                transform: isCtr ? "scale(1.04)" : "scale(0.97)",
                transition:"transform 0.5s ease",
              }}>
                <div
                  onClick={() => setLightbox(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    borderRadius:20,overflow:"hidden",cursor:"pointer",
                    position:"relative",height:isMobile ? 360 : 420,
                    background: bgMap[item.cat],
                    border:`1px solid ${isHov ? "rgba(232,93,131,0.4)" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: isHov
                      ? "0 24px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(232,93,131,0.2)"
                      : "0 8px 30px rgba(0,0,0,0.4)",
                    transition:"all 0.3s ease",
                    transform: isHov ? "translateY(-6px)" : "none",
                  }}>
                  <Image
                    src={item.src}
                    alt={item.fileName || item.cat}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />

                  {/* Bottom overlay */}
                  <div style={{
                    position:"absolute",inset:0,
                    background:"linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 50%)",
                    opacity: isHov ? 1 : 0,transition:"opacity 0.3s ease",
                    display:"flex",alignItems:"flex-end",padding:20,
                    justifyContent:"space-between",
                  }}>
                    <span style={{fontSize:13,fontWeight:600,color:"#fff",letterSpacing:"0.05em",textTransform:"uppercase"}}>{item.cat}</span>
                    <span style={{
                      fontSize:11,color:"rgba(255,255,255,0.7)",padding:"5px 12px",
                      border:"1px solid rgba(255,255,255,0.2)",borderRadius:999,
                      background:"rgba(0,0,0,0.3)",backdropFilter:"blur(8px)",
                    }}>⛶ View</span>
                  </div>

                  {/* Top shimmer */}
                  {isHov && <div style={{
                    position:"absolute",top:0,left:"-100%",width:"60%",height:"100%",
                    background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)",
                    animation:"shimmer 1s ease forwards",pointerEvents:"none",
                  }}/>}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0}
          style={{
            position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",
            width:48,height:48,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",
            background:"rgba(10,5,20,0.7)",color:"#fff",fontSize:20,cursor:"pointer",
            backdropFilter:"blur(12px)",transition:"all 0.2s",
            opacity: idx===0 ? 0.3 : 1,
            boxShadow:"0 4px 20px rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",
          }}
          onMouseEnter={e=>{if(idx!==0){e.currentTarget.style.background="rgba(232,93,131,0.3)";e.currentTarget.style.borderColor="rgba(232,93,131,0.5)";}}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(10,5,20,0.7)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
          ‹
        </button>
        <button onClick={() => setIdx(i => Math.min(maxIdx,i+1))} disabled={idx>=maxIdx}
          style={{
            position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
            width:48,height:48,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",
            background:"rgba(10,5,20,0.7)",color:"#fff",fontSize:20,cursor:"pointer",
            backdropFilter:"blur(12px)",transition:"all 0.2s",
            opacity: idx>=maxIdx ? 0.3 : 1,
            boxShadow:"0 4px 20px rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",
          }}
          onMouseEnter={e=>{if(idx<maxIdx){e.currentTarget.style.background="rgba(232,93,131,0.3)";e.currentTarget.style.borderColor="rgba(232,93,131,0.5)";}}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(10,5,20,0.7)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
          ›
        </button>
      </div>

      {/* Dots */}
      <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:28}}>
        {Array.from({length:Math.min(8,filtered.length)}).map((_,i) => {
          const step = Math.floor(i*(filtered.length/8));
          const act = Math.abs(idx-step) < 2;
          return <button key={i} onClick={() => setIdx(step)} style={{
            width: act ? 24 : 8,height:8,borderRadius:4,border:"none",cursor:"pointer",
            background: act ? "#e85d83" : "rgba(255,255,255,0.15)",
            transition:"all 0.3s ease",padding:0,
          }}/>;
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position:"fixed",inset:0,zIndex:500,
          background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",
          display:"flex",alignItems:"center",justifyContent:"center",
          animation:"fadeIn 0.2s ease",
        }}>
          <button onClick={() => setLightbox(null)} style={{
            position:"fixed",top:24,right:24,
            width:44,height:44,borderRadius:"50%",
            border:"1px solid rgba(255,255,255,0.15)",
            background:"rgba(255,255,255,0.08)",color:"#fff",
            fontSize:18,cursor:"pointer",backdropFilter:"blur(8px)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>✕</button>
          <div onClick={e=>e.stopPropagation()} style={{
            width:500,height:500,borderRadius:24,
            background:bgMap[lightbox.cat],
            border:"1px solid rgba(255,255,255,0.1)",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,
            boxShadow:"0 32px 80px rgba(0,0,0,0.8)",
          }}>
            <div style={{position:"relative",width:"100%",height:"100%"}}>
              <Image
                src={lightbox.src}
                alt={lightbox.fileName || lightbox.cat}
                fill
                sizes="90vw"
                style={{objectFit:"contain"}}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <Reveal>
      <div style={{
        margin:"0 auto 80px",maxWidth:1100,padding:"0 24px",
      }}>
        <div
          className="stat-grid"
          style={{
            display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,
            borderRadius:20,overflow:"hidden",
            border:"1px solid rgba(232,93,131,0.15)",
            background:"rgba(232,93,131,0.05)",
          }}>
          {STATS.map((s,i) => (
            <div key={i} style={{
              padding:"40px 24px",textAlign:"center",
              background:"rgba(8,4,16,0.6)",backdropFilter:"blur(12px)",
              borderRight: i<3 ? "1px solid rgba(232,93,131,0.1)" : "none",
              position:"relative",overflow:"hidden",
            }}>
              <div style={{
                position:"absolute",inset:0,
                background:"radial-gradient(ellipse at 50% 0%,rgba(232,93,131,0.06),transparent 70%)",
                pointerEvents:"none",
              }}/>
              <div style={{
                fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,4vw,52px)",
                fontWeight:700,color:"#fff",lineHeight:1,marginBottom:8,
                background:"linear-gradient(135deg,#f093b0,#e85d83)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              }}>{s.num}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About({ sectionRef }) {
  return (
    <section ref={sectionRef} style={{padding:"80px 0 100px",position:"relative"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
          {/* Image side */}
          <Reveal>
            <div style={{position:"relative"}}>
              {/* Decorative frame */}
              <div style={{
                position:"absolute",top:24,left:24,right:-24,bottom:-24,
                borderRadius:24,border:"1px solid rgba(232,93,131,0.15)",
                background:"rgba(232,93,131,0.04)",zIndex:0,
              }}/>
              <div style={{
                position:"relative",zIndex:1,borderRadius:20,overflow:"hidden",
                border:"1px solid rgba(232,93,131,0.2)",
                boxShadow:"0 24px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(232,93,131,0.1)",
              }}>
                <div className="about-image-container" style={{ position:"relative", height:520 }}>
                  <Image
                    src="/imp_files/AnjanaRajput.png"
                    alt="Anjana Rajput"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit:"cover" }}
                  />
                </div>
                {/* Bottom name plate */}
                <div style={{
                  padding:"20px 24px",
                  background:"rgba(8,4,16,0.85)",backdropFilter:"blur(16px)",
                  borderTop:"1px solid rgba(232,93,131,0.15)",
                }}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:"#fff",marginBottom:2}}>Anjana Rajput</div>
                  <div style={{fontSize:12,color:"rgba(232,93,131,0.8)",letterSpacing:"0.08em",textTransform:"uppercase"}}>Lead Makeup Artist</div>
                </div>
              </div>

              {/* Floating badge */}
              <div style={{
                position:"absolute",top:-16,right:16,zIndex:10,
                padding:"12px 18px",borderRadius:14,
                background:"linear-gradient(135deg,rgba(232,93,131,0.9),rgba(180,60,100,0.8))",
                boxShadow:"0 8px 30px rgba(232,93,131,0.4)",
                fontSize:12,fontWeight:600,color:"#fff",letterSpacing:"0.05em",
              }}>
                ✦ Certified Artist
              </div>
            </div>
          </Reveal>

          {/* Text side */}
          <div>
            <Reveal delay={100}>
              <span style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,93,131,0.7)",fontWeight:500}}>
                The Artist
              </span>
            </Reveal>
            <Reveal delay={150}>
              <h2 style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(36px,4vw,56px)",fontWeight:700,
                lineHeight:0.92,letterSpacing:"-0.01em",
                color:"#fff",margin:"16px 0 8px",
              }}>
                Meet<br/>
                <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Anjana
                </span>
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontStyle:"italic",color:"rgba(255,255,255,0.5)",marginBottom:28}}>
                Top Makeup Artist in Delhi NCR
              </p>
            </Reveal>
            {[
              "Anjana Rajput is a professional makeup artist in Delhi, with incredible expertise and knowledge in transforming a woman's beauty with a touch of her makeup brush.",
              "Pursuing her passion in this field, Anjana holds professional certifications and blends the art of makeup with tailored skincare solutions that enhance your beauty from inside out.",
              "Her sophisticated personality reflects in her makeup — resulting in marvellous beauty makeovers that make heads turn in appreciation.",
            ].map((p, i) => (
              <Reveal key={i} delay={250 + i*50}>
                <p style={{fontSize:15,lineHeight:1.85,color:"rgba(255,255,255,0.55)",marginBottom:16,fontWeight:300}}>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={400}>
              <div style={{display:"flex",gap:16,marginTop:36,flexWrap:"wrap"}}>
                <a href="https://wa.me/9540686022" target="_blank" rel="noopener noreferrer" style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"13px 28px",borderRadius:999,
                  background:"linear-gradient(135deg,#e85d83,#c04070)",
                  color:"#fff",textDecoration:"none",fontSize:14,fontWeight:600,
                  boxShadow:"0 8px 28px rgba(232,93,131,0.4)",
                  transition:"all 0.25s ease",letterSpacing:"0.02em",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(232,93,131,0.5)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 28px rgba(232,93,131,0.4)";}}>
                  Book a Session →
                </a>
                <a href="https://maps.app.goo.gl/FinWdr2gZiZuMiLF7" target="_blank" rel="noopener noreferrer" style={{
                  display:"inline-flex",alignItems:"center",gap:8,
                  padding:"13px 28px",borderRadius:999,
                  border:"1px solid rgba(255,255,255,0.12)",
                  background:"rgba(255,255,255,0.04)",
                  color:"rgba(255,255,255,0.7)",textDecoration:"none",fontSize:14,fontWeight:400,
                  backdropFilter:"blur(8px)",transition:"all 0.25s ease",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(232,93,131,0.3)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
                  ★ See Reviews
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services({ sectionRef }) {
  const [activeCat, setActiveCat] = useState("Air Brush");

  return (
    <section ref={sectionRef} style={{padding:"80px 0 100px",position:"relative"}}>
      {/* Subtle section bg */}
      <div style={{position:"absolute",inset:0,background:"rgba(232,93,131,0.02)",pointerEvents:"none"}}/>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px",position:"relative"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:60}}>
            <span style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,93,131,0.7)",fontWeight:500,display:"block",marginBottom:16}}>Services</span>
            <h2 style={{
              fontFamily:"'Playfair Display',serif",fontSize:"clamp(40px,6vw,72px)",
              fontWeight:700,lineHeight:0.9,color:"#fff",marginBottom:0,letterSpacing:"-0.01em",
            }}>
              Our <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Services</span>
            </h2>
          </div>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={100}>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:48,flexWrap:"wrap"}}>
            {Object.keys(SERVICES).map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                style={{
                  padding:"11px 28px",borderRadius:999,border:"none",cursor:"pointer",
                  fontFamily:"inherit",fontSize:13,fontWeight: activeCat===cat ? 600 : 400,
                  color: activeCat===cat ? "#fff" : "rgba(255,255,255,0.5)",
                  background: activeCat===cat
                    ? "linear-gradient(135deg,rgba(232,93,131,0.85),rgba(180,60,100,0.7))"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeCat===cat ? "rgba(232,93,131,0.4)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: activeCat===cat ? "0 4px 20px rgba(232,93,131,0.3)" : "none",
                  backdropFilter:"blur(8px)",transition:"all 0.22s ease",letterSpacing:"0.03em",
                }}>
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Service cards */}
        <div style={{display:"grid",gap:16,marginBottom:80}}>
          {SERVICES[activeCat].map((s, i) => (
            <Reveal key={s.title} delay={i*80}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>

        {/* Pre-bridal header */}
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,93,131,0.7)",fontWeight:500,display:"block",marginBottom:16}}>Packages</span>
            <h3 style={{
              fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,4vw,56px)",
              fontWeight:700,lineHeight:0.92,color:"#fff",letterSpacing:"-0.01em",
            }}>
              Pre-Bridal <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Rituals</span>
            </h3>
          </div>
        </Reveal>

        {/* Package cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
          {PRE_BRIDAL.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i*100}>
              <PackageCard pkg={pkg} featured={i===1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:"28px 32px",borderRadius:20,
        background: hov ? "rgba(232,93,131,0.06)" : "rgba(255,255,255,0.03)",
        border:`1px solid ${hov ? "rgba(232,93,131,0.25)" : "rgba(255,255,255,0.07)"}`,
        backdropFilter:"blur(12px)",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.4),0 0 0 1px rgba(232,93,131,0.1) inset" : "0 4px 20px rgba(0,0,0,0.2)",
        transition:"all 0.3s ease",display:"flex",alignItems:"center",
        justifyContent:"space-between",gap:24,flexWrap:"wrap",
        position:"relative",overflow:"hidden",
      }}>
      <div style={{
        position:"absolute",left:0,top:0,bottom:0,width:3,
        background: hov ? "linear-gradient(to bottom,#f093b0,#e85d83)" : "rgba(232,93,131,0.3)",
        transition:"all 0.3s ease",
      }}/>
      <div style={{flex:1,paddingLeft:8}}>
        <div style={{fontSize:18,fontWeight:600,color:"#fff",marginBottom:6,letterSpacing:"-0.01em"}}>{service.title}</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{service.inclusions}</div>
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        <PricePill label="Studio" price={service.studioPrice} />
        <PricePill label="Venue" price={service.venuePrice} accent />
      </div>
    </div>
  );
}

function PackageCard({ pkg, featured }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:24,overflow:"hidden",
        border:`1px solid ${featured ? "rgba(232,93,131,0.35)" : "rgba(255,255,255,0.08)"}`,
        background: featured ? "rgba(232,93,131,0.06)" : "rgba(255,255,255,0.03)",
        backdropFilter:"blur(16px)",
        boxShadow: hov ? "0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(232,93,131,0.15)" : featured ? "0 8px 40px rgba(232,93,131,0.15)" : "0 4px 20px rgba(0,0,0,0.3)",
        transform: hov ? "translateY(-4px)" : "none",
        transition:"all 0.3s ease",
      }}>
      {/* Header */}
      <div style={{
        padding:"28px 28px 20px",
        borderBottom:`1px solid ${featured ? "rgba(232,93,131,0.15)" : "rgba(255,255,255,0.06)"}`,
        position:"relative",
      }}>
        {featured && (
          <div style={{
            position:"absolute",top:16,right:16,
            padding:"4px 12px",borderRadius:999,
            background:"linear-gradient(135deg,rgba(232,93,131,0.8),rgba(180,60,100,0.7))",
            fontSize:10,fontWeight:600,color:"#fff",letterSpacing:"0.1em",textTransform:"uppercase",
          }}>{pkg.tag}</div>
        )}
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#fff",marginBottom:4}}>{pkg.name}</div>
        <div style={{display:"flex",alignItems:"baseline",gap:4}}>
          <span style={{
            fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,
            background:"linear-gradient(135deg,#f093b0,#e85d83)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          }}>{fmtINR(pkg.price)}</span>
        </div>
      </div>
      {/* Items */}
      <div style={{padding:"20px 28px 28px"}}>
        {pkg.items.map(item => (
          <div key={item} style={{
            display:"flex",alignItems:"center",gap:10,
            padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",
            fontSize:13,color:"rgba(255,255,255,0.65)",
          }}>
            <span style={{
              width:16,height:16,borderRadius:"50%",flexShrink:0,
              background:"rgba(232,93,131,0.15)",border:"1px solid rgba(232,93,131,0.3)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#e85d83",
            }}>✦</span>
            {item}
          </div>
        ))}
        <a href="https://wa.me/9540686022" target="_blank" rel="noopener noreferrer" style={{
          display:"block",marginTop:20,padding:"12px",borderRadius:12,
          textAlign:"center",textDecoration:"none",fontSize:13,fontWeight:600,
          background: featured ? "linear-gradient(135deg,rgba(232,93,131,0.8),rgba(180,60,100,0.7))" : "rgba(232,93,131,0.1)",
          border:`1px solid ${featured ? "rgba(232,93,131,0.4)" : "rgba(232,93,131,0.2)"}`,
          color: "#fff",transition:"all 0.22s ease",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background=featured?"linear-gradient(135deg,rgba(232,93,131,0.95),rgba(180,60,100,0.9))":"rgba(232,93,131,0.2)";}}
          onMouseLeave={e=>{e.currentTarget.style.background=featured?"linear-gradient(135deg,rgba(232,93,131,0.8),rgba(180,60,100,0.7))":"rgba(232,93,131,0.1)";}}>
          Book This Package →
        </a>
      </div>
    </div>
  );
}

function PricePill({ label, price, accent }) {
  return (
    <div style={{
      padding:"9px 20px",borderRadius:999,fontSize:13,fontWeight:600,
      background: !price ? "rgba(255,255,255,0.04)"
        : accent ? "linear-gradient(135deg,rgba(232,93,131,0.7),rgba(180,60,100,0.6))"
        : "rgba(255,255,255,0.08)",
      border:`1px solid ${accent ? "rgba(232,93,131,0.4)" : "rgba(255,255,255,0.1)"}`,
      color: !price ? "rgba(255,255,255,0.3)" : "#fff",
      boxShadow: accent && price ? "0 4px 16px rgba(232,93,131,0.25)" : "none",
      letterSpacing:"0.01em",whiteSpace:"nowrap",
    }}>
      {label}: {fmtINR(price)}
    </div>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0);

  return (
    <section style={{padding:"80px 0 100px",position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:64}}>
            <span style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,93,131,0.7)",fontWeight:500,display:"block",marginBottom:16}}>
              Client Love
            </span>
            <h2 style={{
              fontFamily:"'Playfair Display',serif",fontSize:"clamp(38px,5vw,64px)",
              fontWeight:700,lineHeight:0.9,color:"#fff",letterSpacing:"-0.01em",
            }}>
              What They<br/>
              <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Say</span>
            </h2>
          </div>
        </Reveal>

        {/* Card */}
        <Reveal>
          <div style={{position:"relative"}}>
            <div style={{overflow:"hidden",borderRadius:28}}>
              <div style={{
                display:"flex",
                transform:`translateX(-${idx*100}%)`,
                transition:"transform 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}>
                {TESTIMONIALS.map((t,i) => (
                  <div key={i} style={{minWidth:"100%",padding:"0 2px"}}>
                    <div style={{
                      padding:"52px 48px",borderRadius:28,
                      background:"rgba(255,255,255,0.03)",
                      border:"1px solid rgba(232,93,131,0.15)",
                      backdropFilter:"blur(20px)",textAlign:"center",
                      boxShadow:"0 8px 40px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05)",
                      position:"relative",overflow:"hidden",
                    }}>
                      {/* Huge quote mark */}
                      <div style={{
                        position:"absolute",top:-20,left:24,
                        fontFamily:"'Playfair Display',serif",fontSize:200,
                        color:"rgba(232,93,131,0.05)",lineHeight:1,
                        pointerEvents:"none",userSelect:"none",fontWeight:700,
                      }}>"</div>

                      {/* Stars */}
                      <div style={{marginBottom:24,display:"flex",gap:4,justifyContent:"center"}}>
                        {Array.from({length:t.stars}).map((_,j) => (
                          <span key={j} style={{color:"#e85d83",fontSize:16}}>★</span>
                        ))}
                      </div>

                      {/* Quote */}
                      <p style={{
                        fontFamily:"'Playfair Display',serif",
                        fontSize:"clamp(16px,2.2vw,20px)",lineHeight:1.7,
                        color:"rgba(255,255,255,0.8)",marginBottom:36,
                        fontStyle:"italic",fontWeight:400,
                        position:"relative",zIndex:1,
                      }}>"{t.quote}"</p>

                      {/* Avatar + name */}
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                        <div
  style={{
    position: "relative",
    width: 52,
    height: 52,
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid rgba(232,93,131,0.4)",
  }}
>
  <Image
    src={t.image}
    alt={t.name}
    fill
    sizes="52px"
    style={{ objectFit: "cover" }}
  />
</div>
                        <div style={{fontWeight:600,fontSize:15,color:"#fff"}}>{t.name}</div>
                        <div style={{fontSize:12,color:"rgba(232,93,131,0.7)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            {[{dir:"left",ico:"‹",action:()=>setIdx(i=>Math.max(0,i-1)),dis:idx===0},
              {dir:"right",ico:"›",action:()=>setIdx(i=>Math.min(TESTIMONIALS.length-1,i+1)),dis:idx===TESTIMONIALS.length-1}
            ].map(a => (
              <button key={a.dir} onClick={a.action} disabled={a.dis}
                style={{
                  position:"absolute",top:"50%",transform:"translateY(-50%)",
                  [a.dir]: -20,
                  width:44,height:44,borderRadius:"50%",
                  border:"1px solid rgba(255,255,255,0.1)",
                  background:"rgba(8,4,16,0.8)",color:"#fff",fontSize:20,
                  cursor:"pointer",backdropFilter:"blur(8px)",
                  opacity: a.dis ? 0.3 : 1,transition:"all 0.2s",
                  display:"flex",alignItems:"center",justifyContent:"center",
                }}>{a.ico}</button>
            ))}
          </div>
        </Reveal>

        {/* Dots */}
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:28}}>
          {TESTIMONIALS.map((_,i) => (
            <button key={i} onClick={() => setIdx(i)} style={{
              width: idx===i ? 24 : 8,height:8,borderRadius:4,border:"none",cursor:"pointer",
              background: idx===i ? "#e85d83" : "rgba(255,255,255,0.15)",
              transition:"all 0.3s ease",padding:0,
            }}/>
          ))}
        </div>

        <Reveal delay={200}>
          <div style={{textAlign:"center",marginTop:36}}>
            <a href="https://maps.app.goo.gl/FinWdr2gZiZuMiLF7" target="_blank" rel="noopener noreferrer"
              style={{
                display:"inline-flex",alignItems:"center",gap:8,
                padding:"11px 26px",borderRadius:999,
                border:"1px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.04)",
                color:"rgba(255,255,255,0.6)",textDecoration:"none",
                fontSize:13,fontWeight:500,backdropFilter:"blur(8px)",
                transition:"all 0.22s ease",
              }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(232,93,131,0.3)";e.currentTarget.style.color="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.6)";}}>
              ★ View all reviews on Google
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact({ sectionRef }) {
  const contacts = [
    { href:"tel:9540686022", label:"Call Us", sub:"+91 95406 86022", image: "/icons/telephone.png", class:"phone", c:"rgba(52,199,89,0.15)", bc:"rgba(52,199,89,0.3)", glow:"rgba(52,199,89,0.25)" },
    { href:"https://instagram.com/aarzoomakeover", label:"Instagram", sub:"@aarzoomakeover", image: "/icons/instagram.png", class:"insta", c:"rgba(232,93,131,0.15)", bc:"rgba(232,93,131,0.3)", glow:"rgba(232,93,131,0.3)" },
    { href:"https://wa.me/9540686022", label:"WhatsApp", sub:"Book Now", image: "/icons/whatsapp.png", class:"whatsapp", c:"rgba(37,211,102,0.15)", bc:"rgba(37,211,102,0.3)", glow:"rgba(37,211,102,0.25)" },
  ];

  return (
    <section ref={sectionRef} style={{padding:"80px 0 60px",position:"relative"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:64}}>
            <span style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(232,93,131,0.7)",fontWeight:500,display:"block",marginBottom:16}}>
              Get In Touch
            </span>
            <h2 style={{
              fontFamily:"'Playfair Display',serif",fontSize:"clamp(38px,5vw,64px)",
              fontWeight:700,lineHeight:0.9,color:"#fff",letterSpacing:"-0.01em",
            }}>
              Connect<br/>
              <span style={{fontStyle:"italic",background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>With Us</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="contact-grid" style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:64}}>
            {contacts.map((c, i) => (
              <ContactCard key={i} {...c} />
            ))}
          </div>
        </Reveal>

        {/* Map */}
        <Reveal delay={200}>
          <div style={{
            borderRadius:24,overflow:"hidden",
            border:"1px solid rgba(232,93,131,0.15)",
            boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4678793049834!2d77.08655177555141!3d28.61573618484314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d04b2300ad35f%3A0xaa569d1126bbd01b!2sAarzoo%20Makeover!5e0!3m2!1sen!2sin!4v1765885159017!5m2!1sen!2sin"
              width="100%" height="380" style={{border:"none",display:"block",filter:"invert(0.9) hue-rotate(180deg) saturate(0.7) brightness(0.85)"}}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Aarzoo Makeovers"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactCard({ href, label, sub, image, c, bc, glow }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "32px 40px",
        borderRadius: 24,
        textDecoration: "none",
        background: hov
          ? "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
          : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        border: `1px solid ${hov ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.10)"}`,
        boxShadow: hov
          ? `0 20px 60px rgba(0,0,0,0.45), 0 0 30px ${glow}, inset 0 1px 0 rgba(255,255,255,0.18)`
          : `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)`,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        transform: hov ? "translateY(-8px) scale(1.03)" : "none",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        minWidth: 180,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.12), transparent 45%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: glow,
          filter: "blur(40px)",
          opacity: hov ? 0.8 : 0.4,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", width: 40, height: 40 }}>
        <Image
          src={image}
          alt={label}
          fill
          sizes="40px"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
          {sub}
        </div>
      </div>
    </a>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding:"40px 24px 32px",
      borderTop:"1px solid rgba(255,255,255,0.06)",
      textAlign:"center",
    }}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,marginBottom:4,
        background:"linear-gradient(135deg,#f093b0,#e85d83)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
      }}>Aarzoo Makeovers</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",letterSpacing:"0.1em",marginBottom:20}}>
        BRIDAL · PARTY · HAIR · PRE-BRIDAL
      </div>
      <div style={{
        height:1,width:120,background:"linear-gradient(to right,transparent,rgba(232,93,131,0.4),transparent)",
        margin:"0 auto 20px",
      }}/>
      <div style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>
        © 2026 Aarzoo Makeovers — All rights reserved.
      </div>
    </footer>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AarzooMakeoversV2() {
  const portfolioRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollTo = useCallback((ref) => {
    if (ref?.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior:"smooth" });
    }
  }, []);

  const refs = { Portfolio:portfolioRef, About:aboutRef, Services:servicesRef, Contact:contactRef };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; cursor: none; }
        body { background: #010103; color: #fff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        a, button { cursor: none; }
        @keyframes spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes shimmer { from{left:-100%} to{left:200%} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        ::selection { background: rgba(232,93,131,0.35); color: #fff; }
        @media (max-width: 768px) {
          html { cursor: auto; }

          nav {
            padding: 10px 12px !important;
          }

          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }

          .about-image-container {
            height: 380px !important;
          }

          .contact-grid {
            flex-direction: column;
            align-items: stretch;
          }

          section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .stat-grid {
            grid-template-columns: repeat(2,1fr) !important;
          }

          h1 {
            line-height: 1 !important;
          }

          iframe {
            height: 280px !important;
          }
        }
      `}</style>

      <LuxuryBackground />
      <MagneticCursor />

      <div style={{position:"relative",zIndex:1}}>
        <Navbar scrollTo={scrollTo} refs={refs} />
        <Hero onViewWork={() => scrollTo(portfolioRef)} />
        <StatsBar />
        <Portfolio sectionRef={portfolioRef} />
        <About sectionRef={aboutRef} />
        <Services sectionRef={servicesRef} />
        <Testimonials />
        <Contact sectionRef={contactRef} />
        <Footer />
      </div>
    </>
  );
}