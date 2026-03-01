const FEATURED = [
  { name:'AirPods Pro Clone',  price:'RWF 28,000', color:['#100a1a','#a855f7'], emoji:'🎧' },
  { name:'Silk Hijab Set ×3',  price:'RWF 15,000', color:['#1a100a','#f97316'], emoji:'👗' },
  { name:'Rice Cooker 1.8L',   price:'RWF 22,000', color:['#0a101a','#3b82f6'], emoji:'🍚' },
  { name:'USB-C Hub 7-in-1',   price:'RWF 18,500', color:['#1a0a10','#ec4899'], emoji:'🔌' },
  { name:'Yoga Mat Premium',   price:'RWF 12,000', color:['#101a0a','#84cc16'], emoji:'🧘' },
  { name:'Ceramic Mug Set ×4', price:'RWF 9,500',  color:['#1a1a0a','#eab308'], emoji:'☕' },
  { name:'LED Desk Lamp',      price:'RWF 14,000', color:['#0a1a1a','#06b6d4'], emoji:'💡' },
];

interface Props { isDark: boolean; }

export default function FeaturedRow({ isDark }: Props) {
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const cardBg = isDark ? '#0f0f0f' : '#ffffff';
  const text1  = isDark ? '#fff' : '#0f0f0f';
  const text2  = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';

  return (
    <div style={{
      display: 'flex', gap: 12,
      overflowX: 'auto', paddingBottom: 6,
      scrollbarWidth: 'none',
    }}>
      {FEATURED.map((item, i) => (
        <div key={i}
          style={{
            flexShrink: 0, width: 160, borderRadius: 12, overflow: 'hidden',
            border: `1px solid ${border}`, background: cardBg,
            cursor: 'pointer', transition: 'all .2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#22c55e';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(34,197,94,0.12)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = border;
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          }}
        >
          {/* Thumb */}
          <div style={{ position: 'relative', height: 120, background: item.color[0] }}>
            <svg width="100%" height="100%" viewBox="0 0 160 120" style={{ position:'absolute', inset:0 }}>
              <rect width="160" height="120" fill={item.color[0]}/>
              <circle cx="80" cy="55" r="40" fill={item.color[1]} opacity=".08"/>
              <text x="80" y="64" textAnchor="middle" fontSize="32" fill={item.color[1]} opacity=".55">{item.emoji}</text>
            </svg>
            <span style={{
              position:'absolute', top:6, right:6,
              background:'rgba(34,197,94,0.9)', color:'#fff',
              fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:6,
            }}>New</span>
          </div>

          {/* Info */}
          <div style={{ padding:'10px 10px 12px' }}>
            <p style={{
              fontSize:11, fontWeight:600, color:text1, lineHeight:1.4, marginBottom:4,
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
            }}>{item.name}</p>
            <p style={{ fontSize:14, fontWeight:700, color:'#22c55e' }}>{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
