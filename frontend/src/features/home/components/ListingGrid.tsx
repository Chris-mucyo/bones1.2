import { useNavigate } from 'react-router-dom';
import { ALL_LISTINGS } from '../data/listings';
import ListingCard from './ListingCard';

interface Props { category: string; search: string; isDark: boolean; }

export default function ListingGrid({ category, search, isDark }: Props) {
  const navigate = useNavigate();

  const filtered = ALL_LISTINGS.filter(l => {
    const matchCat    = category === 'All' || l.category === category;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!filtered.length) return (
    <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.3)' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
      <p style={{ fontSize:14 }}>No listings found.</p>
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:16 }}>
      {filtered.map((listing, i) => (
        <div key={listing.id} onClick={() => navigate(`/listing/${listing.id}`)} style={{ cursor:'pointer' }}>
          <ListingCard listing={listing} isDark={isDark} index={i} />
        </div>
      ))}
    </div>
  );
}
