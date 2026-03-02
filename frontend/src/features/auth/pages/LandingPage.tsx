import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// ── animated counter ──────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = to / 60;
      const t = setInterval(() => {
        start += step;
        if (start >= to) { setVal(to); clearInterval(t); }
        else setVal(Math.floor(start));
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ── phone mockup with animated cards ─────────────────────
function PhoneMockup() {
  const cards = [
    { name: 'Samsung A55', price: 'RWF 650k', cat: 'Electronics', emoji: '📱', color: '#0a1a0f' },
    { name: 'Kitenge Dress', price: 'RWF 45k', cat: 'Fashion', emoji: '👗', color: '#1a0a10' },
    { name: 'Coffee Beans 1kg', price: 'RWF 12k', cat: 'Food', emoji: '☕', color: '#1a1a0a' },
    { name: 'HP Laptop i5', price: 'RWF 890k', cat: 'Computers', emoji: '💻', color: '#0a101a' },
  ];
  return (
    <div className="relative" style={{ width: 280, height: 560 }}>
      {/* Phone shell */}
      <div className="absolute inset-0 rounded-[44px] border-2 border-white/10 bg-[#0a0a0a] shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]" />
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
      {/* Screen */}
      <div className="absolute inset-[3px] rounded-[42px] bg-black overflow-hidden">
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-8 pb-2">
          <span className="text-[10px] text-white/50 font-bold">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-3 h-1.5 rounded-sm bg-green-500" />
            <div className="w-3 h-1.5 rounded-sm bg-white/20" />
          </div>
        </div>
        {/* App header */}
        <div className="flex items-center gap-2 px-4 pb-3">

          <div className=" w-40  rounded-lg flex items-center justify-center">
            <img src="../src/assets/shophub-logo.svg" alt="" />
          </div>

        </div>
        {/* Category chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-hidden">
          {['All', 'Electronics', 'Fashion', 'Food'].map((c, i) => (
            <span key={c} className={`flex-shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full ${i === 0 ? 'bg-green-500 text-black' : 'bg-white/[0.08] text-white/50'}`}>{c}</span>
          ))}
        </div>
        {/* Listing cards */}
        <div className="px-3 flex flex-col gap-2">
          {cards.map((card, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white/[0.05] rounded-xl p-2.5 border border-white/[0.06]"
              style={{ animation: `fadeUp .5s ease ${i * 120}ms both` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: card.color }}>
                {card.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{card.name}</p>
                <p className="text-[9px] text-white/30">{card.cat}</p>
              </div>
              <span className="text-[11px] font-bold text-green-500 flex-shrink-0">{card.price}</span>
            </div>
          ))}
        </div>
        {/* Bottom nav */}
        <div className="absolute bottom-0 inset-x-0 flex justify-around items-center py-3 px-4 bg-[#0a0a0a] border-t border-white/[0.06]">
          {['🏠', '🔍', '💬', '👤'].map((e, i) => (
            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-xl text-base ${i === 0 ? 'bg-green-500/15' : ''}`}>{e}</div>
          ))}
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -inset-8 rounded-[60px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 70%)' }} />
    </div>
  );
}

// ── feature card ──────────────────────────────────────────
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="group p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-green-500/40 hover:bg-green-500/[0.04] transition-all duration-300 cursor-default">
      <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl mb-4 group-hover:bg-green-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
      <p className="text-[13px] text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

// ── testimonial ───────────────────────────────────────────
function Testimonial({ name, role, text, initial }: { name: string; role: string; text: string; initial: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <span key={i} className="text-green-500 text-sm">★</span>)}
      </div>
      <p className="text-[13px] text-white/60 leading-relaxed mb-5">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white">{name}</p>
          <p className="text-[11px] text-white/35">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/[0.08]' : ''}`}>
        {/* Logo */}
        <Link to="/login" className="flex items-center gap-2 no-underline">
          <div className=" w-40  rounded-lg flex items-center justify-center">
            <img src="../src/assets/shophub-logo.svg" alt="" />
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
              className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">{l}</a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden md:block text-[13px] font-semibold text-white/60 hover:text-white transition-colors no-underline">
            Sign in
          </Link>
          <Link to="/register"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold text-[13px] rounded-full transition-all hover:-translate-y-0.5 no-underline">
            Get started free
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center pt-20 pb-10 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left — copy */}
          <div className="flex-1 max-w-xl" style={{ animation: 'fadeUp .7s ease both' }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/25 bg-green-500/[0.07] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold text-green-400 tracking-widest uppercase">Rwanda's #1 Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl font-black leading-[1.05] mb-6 tracking-tight">
              Buy. Sell.{' '}
              <span className="text-green-500 relative">
                Connect.
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#22c55e" strokeWidth="2.5" fill="none" opacity=".5" />
                </svg>
              </span>
              <br />
              <span className="text-white/30">In Rwanda.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[16px] text-white/50 leading-relaxed mb-8 max-w-md">
              ShopHub connects buyers, sellers, and wholesalers across Rwanda.
              List products, chat in real time, and grow your business — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap mb-10">
              <Link to="/register"
                className="flex items-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-black font-bold text-[14px] rounded-full transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(34,197,94,0.3)] no-underline">
                Start selling free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/login"
                className="flex items-center gap-2 px-6 py-3.5 border border-white/[0.12] hover:border-green-500/40 bg-white/[0.03] hover:bg-green-500/[0.05] text-white/70 hover:text-white font-semibold text-[14px] rounded-full transition-all no-underline">
                Browse listings
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {['T', 'U', 'A', 'M', 'R'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ background: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-[12px] text-white/40">
                <span className="text-white font-bold">2,400+</span> sellers already on ShopHub
              </p>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="flex-shrink-0 flex items-center justify-center" style={{ animation: 'fadeUp .7s ease .15s both' }}>
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────── */}
      <section className="border-y border-white/[0.07] bg-white/[0.02] py-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Listings', to: 18400, suffix: '+' },
            { label: 'Verified Sellers', to: 2400, suffix: '+' },
            { label: 'Categories', to: 50, suffix: '+' },
            { label: 'Daily Messages', to: 9200, suffix: '+' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-display text-3xl md:text-4xl font-black text-green-500 mb-1">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="text-[12px] text-white/35 font-medium uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-green-500/60 mb-3">Why ShopHub</p>
            <h2 className="font-display text-4xl font-black text-white mb-4">Everything you need to trade</h2>
            <p className="text-white/40 text-[15px] max-w-lg mx-auto">
              Built for Rwandan commerce — from a single seller to wholesale distributors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard icon="💬" title="Real-time Chat" desc="Message sellers directly from any listing. Negotiate prices, ask questions, and close deals instantly." />
            <FeatureCard icon="🏪" title="Your Own Shop" desc="Create a branded storefront with all your listings, ratings, and sales history in one place." />
            <FeatureCard icon="🏭" title="Wholesale Hub" desc="Connect with bulk buyers and wholesalers. Set minimum order quantities and get volume deals." />
            <FeatureCard icon="📍" title="Near Me" desc="Find listings close to you in Kigali, Huye, Musanze, and across all Rwanda's provinces." />
            <FeatureCard icon="✅" title="Verified Sellers" desc="Every seller goes through identity verification so you know exactly who you're buying from." />
            <FeatureCard icon="📊" title="Seller Analytics" desc="Track views, messages, and sales. Understand what's working and grow your shop with data." />
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-green-500/60 mb-3">Simple process</p>
            <h2 className="font-display text-4xl font-black text-white">Up and running in minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-green-500/30 via-green-500/60 to-green-500/30" />
            {[
              { step: '01', icon: '📝', title: 'Create account', desc: 'Sign up as a buyer, seller, or wholesaler. Verify your identity with your national ID.' },
              { step: '02', icon: '📦', title: 'Post your listing', desc: 'Add photos, set your price, and go live in under 2 minutes. Buyers nearby will find you.' },
              { step: '03', icon: '💰', title: 'Start earning', desc: 'Chat with interested buyers, negotiate, and complete your sale. Money in your pocket.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-2xl">
                    {s.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 text-black text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-green-500/60 mb-3">Testimonials</p>
            <h2 className="font-display text-4xl font-black text-white">Loved by sellers across Rwanda</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Testimonial
              initial="A" name="Amina Uwase" role="Fashion Seller · Kigali"
              text="I listed my Kitenge collection on ShopHub and got 3 buyers messaging me within the first hour. The chat feature is amazing." />
            <Testimonial
              initial="J" name="Jean-Claude Nkusi" role="Electronics Wholesaler · Kigali"
              text="As a wholesaler I needed a platform that understood bulk deals. ShopHub's wholesale tier is exactly what I needed to scale." />
            <Testimonial
              initial="M" name="Marie Mukamana" role="Coffee Producer · Huye"
              text="Buyers from Kigali find my coffee easily now. ShopHub helped me reach customers I never could have found on my own." />
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.07) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-5xl font-black text-white mb-5 leading-tight">
            Ready to start<br />
            <span className="text-green-500">trading?</span>
          </h2>
          <p className="text-white/40 text-[15px] mb-10 max-w-md mx-auto">
            Join thousands of Rwandan buyers, sellers, and wholesalers already using ShopHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register"
              className="flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-bold text-[15px] rounded-full transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(34,197,94,0.35)] no-underline w-full sm:w-auto justify-center">
              Create free account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 px-8 py-4 border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white font-semibold text-[15px] rounded-full transition-all no-underline w-full sm:w-auto justify-center">
              Sign in
            </Link>
          </div>
          <p className="text-[11px] text-white/20 mt-5">Free to join · No credit card · List in 2 minutes</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className=" w-40  rounded-lg flex items-center justify-center">
            <img src="../src/assets/shophub-logo.svg" alt="" />
          </div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact', 'Help'].map(l => (
              <a key={l} href="#" className="text-[12px] text-white/30 hover:text-white transition-colors no-underline">{l}</a>
            ))}
          </div>
          <p className="text-[11px] text-white/20">© 2025 ShopHub · Made in Rwanda 🇷🇼</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>

    </div>
  );
}
