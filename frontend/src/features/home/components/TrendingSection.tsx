const TRENDING = [
  { rank:1, name:'iPhone 15 Pro Max 256GB',      seller:'AppleZone RW',      price:'RWF 1,800,000', emoji:'📱' },
  { rank:2, name:'Kitenge Ankara Fabric 6yds',   seller:'Umuco Fashion',     price:'RWF 32,000',   emoji:'👗' },
  { rank:3, name:'Rwandan Honey 500g Raw',        seller:'Nyabihu Apiaries',  price:'RWF 6,500',    emoji:'🍯' },
  { rank:4, name:'PlayStation 5 Disc Edition',   seller:'GameZone Kigali',   price:'RWF 950,000',  emoji:'🎮' },
  { rank:5, name:'Handmade Wooden Bowl Set',      seller:'Ikirezi Crafts',    price:'RWF 28,000',   emoji:'🪵' },
  { rank:6, name:'Solar Panel 100W Mono',         seller:'GreenPower RW',     price:'RWF 85,000',   emoji:'☀️' },
];

interface Props { isDark: boolean; }

export default function TrendingSection({ isDark }: Props) {
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardBg  = isDark ? '#0f0f0f' : '#ffffff';
  const hover   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const text1   = isDark ? '#fff' : '#0f0f0f';
  const text2   = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const rankCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: 10,
    }}>
      {TRENDING.map((item, i) => (
        <div key={i}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 12, borderRadius: 12,
            border: `1px solid ${border}`, background: cardBg,
            cursor: 'pointer', transition: 'all .2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#22c55e';
            (e.currentTarget as HTMLDivElement).style.background = hover;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = border;
            (e.currentTarget as HTMLDivElement).style.background = cardBg;
          }}
        >
          {/* Rank */}
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 800,
            color: rankCol, width: 28, flexShrink: 0,
          }}>
            {String(item.rank).padStart(2, '0')}
          </span>

          {/* Thumb */}
          <div style={{
            width: 56, height: 56, borderRadius: 8, flexShrink: 0,
            background: '#111', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 24, border: `1px solid ${border}`,
          }}>
            {item.emoji}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize:12, fontWeight:600, color:text1, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {item.name}
            </p>
            <p style={{ fontSize:11, color:text2, marginBottom:4 }}>{item.seller}</p>
            <p style={{ fontSize:14, fontWeight:700, color:'#22c55e' }}>{item.price}</p>
          </div>

          {/* Arrow */}
          <svg width="16" height="16" fill="none" stroke={text2} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
