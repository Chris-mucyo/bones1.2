import { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';

interface Props { children: React.ReactNode; }

export default function AppLayout({ children }: Props) {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const isDark = theme === 'dark';

  const t = {
    topbarBg:  isDark ? 'rgba(0,0,0,0.94)'    : 'rgba(245,245,245,0.95)',
    border:    isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    sidebarBg: isDark ? '#0a0a0a'              : '#f0f0f0',
    bg:        isDark ? '#000'                 : '#f5f5f5',
    text1:     isDark ? '#fff'                 : '#0f0f0f',
    text2:     isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
    hover:     isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    green:     '#22c55e',
    greenDim:  'rgba(34,197,94,0.12)',
  };

  const SidebarItem = ({
    href, icon, label, badge, active = false,
  }: { href: string; icon: React.ReactNode; label: string; badge?: number; active?: boolean }) => (
    <a href={href}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding: collapsed ? '10px 0' : '9px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius:10, cursor:'pointer', textDecoration:'none',
        color: active ? t.green : t.text2,
        background: active ? t.greenDim : 'transparent',
        transition:'all .15s', whiteSpace:'nowrap', overflow:'hidden',
        fontSize:13, fontWeight:500,
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = t.hover; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ flexShrink:0, display:'flex' }}>{icon}</span>
      {!collapsed && <span style={{ flex:1 }}>{label}</span>}
      {!collapsed && badge !== undefined && (
        <span style={{
          minWidth:18, height:18, borderRadius:99, background:t.green,
          color:'#000', fontSize:9, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px',
        }}>{badge}</span>
      )}
    </a>
  );

  const Divider = () => (
    <div style={{ height:1, background:t.border, margin: collapsed ? '8px 10px' : '8px 12px' }} />
  );

  const SectionLabel = ({ label }: { label: string }) =>
    !collapsed ? (
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:'1.8px', textTransform:'uppercase',
        color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)',
        padding:'8px 12px 4px' }}>
        {label}
      </div>
    ) : null;

  return (
    <div style={{ minHeight:'100vh', background:t.bg }}>

      {/* ── Topbar ── */}
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:56, display:'flex', alignItems:'center', gap:12, padding:'0 16px',
        background:t.topbarBg, backdropFilter:'blur(14px)',
        borderBottom:`1px solid ${t.border}`,
      }}>

        {/* Hamburger */}
        <button onClick={() => setCollapsed(c => !c)}
          style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'transparent',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color:t.text2, flexShrink:0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Logo */}
        <a href="/home" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0, marginRight:8 }}>
          <div className=" w-40  rounded-lg flex items-center justify-center">
            <img src="../src/assets/shophub-logo.svg" alt="" />
          </div>
        </a>

        {/* Search */}
        <div style={{ flex:1, maxWidth:560, height:36, display:'flex', borderRadius:20, overflow:'hidden',
          border:`1px solid ${t.border}`, background:isDark ? '#0f0f0f' : '#fff' }}>
          <input type="text" placeholder="Search listings, sellers, categories…"
            style={{ flex:1, border:'none', background:'transparent', color:t.text1,
              padding:'0 16px', fontSize:13, fontFamily:"'Outfit', sans-serif", outline:'none' }} />
          <button style={{ width:44, border:'none', background:t.green, color:'#fff', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>

        {/* Right icons */}
        <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:'auto', flexShrink:0 }}>
          {/* Notifications */}
          <button style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'transparent',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color:t.text2, position:'relative' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span style={{ position:'absolute', top:4, right:4, minWidth:14, height:14, borderRadius:99,
              background:'#ef4444', color:'#fff', fontSize:9, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px',
              border:`1.5px solid ${t.bg}` }}>3</span>
          </button>

          {/* Messages */}
          <a href="/chat" style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'transparent',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            color:t.text2, position:'relative', textDecoration:'none' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <span style={{ position:'absolute', top:4, right:4, minWidth:14, height:14, borderRadius:99,
              background:'#ef4444', color:'#fff', fontSize:9, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px',
              border:`1.5px solid ${t.bg}` }}>4</span>
          </a>

          {/* Help */}
          <button style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'transparent',
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:t.text2 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <nav style={{
        position:'fixed', left:0, top:56, bottom:0, zIndex:50,
        width: collapsed ? 64 : 220,
        background:t.sidebarBg, borderRight:`1px solid ${t.border}`,
        overflowY:'auto', overflowX:'hidden',
        padding:'8px 0 24px', transition:'width .3s',
      }}>
        <div style={{ padding:'4px 8px' }}>
          <SidebarItem href="/home"   active icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>} label="Home" />
          <SidebarItem href="/home"  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>} label="Explore" />
          <SidebarItem href="/chat"  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>} label="Messages" badge={4} />
          <SidebarItem href="/home"  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>} label="Saved" />
        </div>

        <Divider />

        <div style={{ padding:'0 8px' }}>
          <SectionLabel label="Sell" />
          <SidebarItem href="/home"         icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>} label="My Shop" />
          <SidebarItem href="/listings/new" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>} label="Post Listing" />
          <SidebarItem href="/home"         icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>} label="Analytics" />
        </div>

        <Divider />

        <div style={{ padding:'0 8px' }}>
          <SectionLabel label="Discover" />
          <SidebarItem href="/home" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} label="Trending" />
          <SidebarItem href="/home" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} label="Top Sellers" />
          <SidebarItem href="/home" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>} label="Near Me" />
        </div>

        <Divider />

        <div style={{ padding:'0 8px' }}>
          <SidebarItem href="/home" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></svg>} label="Account" />
          <SidebarItem href="/home" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 105.93 19.07"/></svg>} label="Settings" />
          <SidebarItem href="/home" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} label="Help" />
        </div>
      </nav>

      {/* ── Page content ── */}
      <main style={{
        marginLeft: collapsed ? 64 : 220,
        paddingTop: 56,
        minHeight: '100vh',
        transition: 'margin-left .3s',
      }}>
        {children}
      </main>

    </div>
  );
}
