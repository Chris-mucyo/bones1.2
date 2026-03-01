import ListingCard from './ListingCard';
import type { Listing } from '../types';

const MOCK_LISTINGS: Listing[] = [
  { id:'1', title:'Samsung Galaxy A55 5G — Midnight Blue 256GB', description:'', price:650000, currency:'RWF', images:[], category:'Electronics', condition:'new', location:'Kigali', seller:{id:'s1',name:'TechCity Kigali',shopName:'TechCity Kigali',verified:true,rating:4.7,totalSales:1200}, badge:'new', views:340, savedCount:28, createdAt:'2d ago' },
  { id:'2', title:'Designer Kitenge Dress — Traditional Rwandan Print', description:'', price:45000, currency:'RWF', images:[], category:'Fashion', condition:'new', location:'Kigali', seller:{id:'s2',name:'Umuco Fashion',verified:true,rating:4.9,totalSales:890}, badge:'hot', views:210, savedCount:45, createdAt:'5h ago' },
  { id:'3', title:'Premium Arabica Coffee Beans 1kg — Nyungwe Origin', description:'', price:12000, currency:'RWF', images:[], category:'Food & Drinks', condition:'new', location:'Huye', seller:{id:'s3',name:'Rwanda Coffee Co.',verified:true,rating:4.8,totalSales:3400}, badge:null, views:520, savedCount:67, createdAt:'1d ago' },
  { id:'4', title:'Samsung 43" 4K Smart TV Crystal UHD Series', description:'', price:480000, currency:'RWF', images:[], category:'Electronics', condition:'new', location:'Kigali', seller:{id:'s4',name:'ElecZone RW',verified:true,rating:4.6,totalSales:654}, badge:'featured', views:180, savedCount:32, createdAt:'3d ago' },
  { id:'5', title:'Handcrafted Imigongo Art Canvas — Large 60×60cm', description:'', price:35000, currency:'RWF', images:[], category:'Home & Living', condition:'new', location:'Nyanza', seller:{id:'s5',name:'Artisan Hub RW',verified:false,rating:5.0,totalSales:210}, badge:'new', views:95, savedCount:18, createdAt:'12h ago' },
  { id:'6', title:'Wireless Earbuds Pro — 36hr Battery ANC', description:'', price:78000, currency:'RWF', images:[], category:'Electronics', condition:'new', location:'Kigali', seller:{id:'s1',name:'TechCity Kigali',shopName:'TechCity Kigali',verified:true,rating:4.5,totalSales:2100}, badge:null, views:290, savedCount:41, createdAt:'4d ago' },
  { id:'7', title:'Organic Avocado Oil — Cold Pressed 500ml', description:'', price:8500, currency:'RWF', images:[], category:'Health', condition:'new', location:'Musanze', seller:{id:'s6',name:'Green Valley Farms',verified:true,rating:4.9,totalSales:5200}, badge:null, views:670, savedCount:89, createdAt:'6h ago' },
  { id:'8', title:"Men's Running Shoes — Lightweight Mesh Series", description:'', price:55000, currency:'RWF', images:[], category:'Sports', condition:'new', location:'Kigali', seller:{id:'s7',name:'SportZone Africa',verified:true,rating:4.7,totalSales:978}, badge:'hot', views:230, savedCount:37, createdAt:'2d ago' },
  { id:'9', title:'Fresh Inyange Milk 1L × 12 Pack — Daily Delivery', description:'', price:18000, currency:'RWF', images:[], category:'Food & Drinks', condition:'new', location:'Kigali', seller:{id:'s8',name:'Inyange Industries',verified:true,rating:4.8,totalSales:12000}, badge:null, views:1240, savedCount:156, createdAt:'1h ago' },
  { id:'10', title:'Traditional Agaseke Basket — Handwoven Peace Basket', description:'', price:25000, currency:'RWF', images:[], category:'Home & Living', condition:'new', location:'Kigali', seller:{id:'s9',name:'Ibuka Crafts',verified:true,rating:4.9,totalSales:1800}, badge:'new', views:445, savedCount:72, createdAt:'3d ago' },
  { id:'11', title:'HP Laptop 15s — Intel i5 12th Gen 512GB SSD', description:'', price:890000, currency:'RWF', images:[], category:'Computers', condition:'new', location:'Kigali', seller:{id:'s10',name:'ComputerHub RW',verified:true,rating:4.6,totalSales:489}, badge:'featured', views:167, savedCount:54, createdAt:'5d ago' },
  { id:'12', title:'Shea Butter Body Lotion — 100% Pure African', description:'', price:9800, currency:'RWF', images:[], category:'Beauty', condition:'new', location:'Kigali', seller:{id:'s11',name:'Ubwiza Beauty',verified:false,rating:4.8,totalSales:7600}, badge:null, views:892, savedCount:120, createdAt:'8h ago' },
];

interface Props {
  category: string;
  search:   string;
  isDark:   boolean;
}

export default function ListingGrid({ category, search, isDark }: Props) {
  const filtered = MOCK_LISTINGS.filter(l => {
    const matchCat  = category === 'All' || l.category === category;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    return (
      <div style={{ textAlign:'center', padding:'60px 0', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <p style={{ fontSize: 14 }}>No listings found in this category yet.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 16,
    }}>
      {filtered.map((listing, i) => (
        <ListingCard key={listing.id} listing={listing} isDark={isDark} index={i} />
      ))}
    </div>
  );
}
