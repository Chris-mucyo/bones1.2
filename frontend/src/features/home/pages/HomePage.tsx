import { useState, useCallback } from 'react';
import AppLayout from '../../../shared/layouts/AppLayout';
import FilterChips from '../components/FilterChips';
import FeaturedRow from '../components/FeaturedRow';
import ListingGrid from '../components/ListingGrid';
import TrendingSection from '../components/TrendingSection';
import { useTheme } from '../../../shared/components/ThemeProvider';

const CATEGORIES = [
  'All', 'Electronics', 'Fashion', 'Food & Drinks',
  'Home & Living', 'Beauty', 'Wholesale', 'Health',
  'Sports', 'Books', 'Music', 'Computers',
];

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');
  const [search] = useState('');

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  return (
    <AppLayout>
      {/* Category filter chips */}
      <FilterChips
        categories={CATEGORIES}
        active={activeCategory}
        onChange={handleCategoryChange}
        isDark={isDark}
      />

      {/* Featured listings horizontal scroll row */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
            color: isDark ? '#fff' : '#0f0f0f',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
              display: 'inline-block', animation: 'pulse 2s ease-in-out infinite',
            }} />
            Featured Listings
          </h2>
          <a href="#" style={{
            fontSize: 12, fontWeight: 600, color: '#22c55e',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)'}`,
            padding: '6px 12px', borderRadius: 20, textDecoration: 'none',
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          }}>See all →</a>
        </div>
        <FeaturedRow isDark={isDark} />
      </div>

      {/* Main grid */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
            color: isDark ? '#fff' : '#0f0f0f',
          }}>
            Listings Near You
          </h2>
          <a href="#" style={{
            fontSize: 12, fontWeight: 600, color: '#22c55e',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)'}`,
            padding: '6px 12px', borderRadius: 20, textDecoration: 'none',
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          }}>See all →</a>
        </div>
        <ListingGrid category={activeCategory} search={search} isDark={isDark} />
      </div>

      {/* Trending section */}
      <div style={{ padding: '32px 20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
            color: isDark ? '#fff' : '#0f0f0f',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🇷🇼</span> Trending in Rwanda
          </h2>
          <a href="#" style={{
            fontSize: 12, fontWeight: 600, color: '#22c55e',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)'}`,
            padding: '6px 12px', borderRadius: 20, textDecoration: 'none',
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          }}>See all →</a>
        </div>
        <TrendingSection isDark={isDark} />
      </div>
    </AppLayout>
  );
}
