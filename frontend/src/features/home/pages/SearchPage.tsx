import { useState, useCallback, useRef, useEffect } from 'react';
import AppLayout from '../../../shared/layouts/AppLayout';
import FilterChips from '../components/FilterChips';
import ListingGrid from '../components/ListingGrid';
import { useTheme } from '../../../shared/components/ThemeProvider';

const CATEGORIES = [
  'All', 'Electronics', 'Fashion', 'Food & Drinks',
  'Home & Living', 'Beauty', 'Wholesale', 'Health',
  'Sports', 'Books', 'Music', 'Computers',
];

const SUGGESTED_PRODUCTS = [
  { id: 1, label: 'iPhone 15 Pro', category: 'Electronics', icon: '📱' },
  { id: 2, label: 'Nike Air Force 1', category: 'Fashion', icon: '👟' },
  { id: 3, label: 'Organic Honey', category: 'Food & Drinks', icon: '🍯' },
  { id: 4, label: 'Sofa Set', category: 'Home & Living', icon: '🛋️' },
  { id: 5, label: 'Face Serum', category: 'Beauty', icon: '✨' },
  { id: 6, label: 'Rice (50kg)', category: 'Wholesale', icon: '🌾' },
  { id: 7, label: 'Running Shoes', category: 'Sports', icon: '🏃' },
  { id: 8, label: 'Laptop Stand', category: 'Computers', icon: '💻' },
];

const RECENT_SEARCHES = ['Smartphone', 'Dress', 'Laptop', 'Vegetables'];

export default function SearchPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setInputValue(value);
    setHasSearched(true);
    setIsFocused(false);
    inputRef.current?.blur();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value === '') {
      setSearch('');
      setHasSearched(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearch('');
    setHasSearched(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = SUGGESTED_PRODUCTS.filter(p =>
    inputValue.length > 0
      ? p.label.toLowerCase().includes(inputValue.toLowerCase())
      : true
  );

  const showDropdown = isFocused;

  return (
    <AppLayout>
      <div style={{ padding: '20px 20px 0' }}>

        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: `1.5px solid ${isFocused
              ? '#22c55e'
              : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 14,
            padding: '0 14px',
            transition: 'border-color 0.2s',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke={isFocused ? '#22c55e' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: 'stroke 0.2s' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, categories..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                height: 48,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 15,
                fontFamily: "'DM Sans', sans-serif",
                color: isDark ? '#fff' : '#0f0f0f',
                caretColor: '#22c55e',
              }}
            />

            {inputValue.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.45)',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >✕</button>
            )}
          </div>

          {showDropdown && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: isDark ? '#1a1a1a' : '#fff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.09)'}`,
                borderRadius: 14,
                boxShadow: isDark
                  ? '0 8px 32px rgba(0,0,0,0.5)'
                  : '0 8px 32px rgba(0,0,0,0.1)',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              {inputValue.length === 0 && RECENT_SEARCHES.length > 0 && (
                <div style={{ padding: '14px 16px 6px' }}>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                    marginBottom: 8,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Recent</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {RECENT_SEARCHES.map(r => (
                      <button
                        key={r}
                        onClick={() => handleSearch(r)}
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.09)'}`,
                          borderRadius: 20,
                          padding: '5px 12px',
                          fontSize: 13,
                          fontFamily: "'DM Sans', sans-serif",
                          color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <span style={{ fontSize: 11, opacity: 0.5 }}>🕐</span> {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ padding: inputValue.length === 0 ? '6px 0 8px' : '10px 0 8px' }}>
                {inputValue.length === 0 && (
                  <p style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                    padding: '0 16px',
                    marginBottom: 6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>Suggested</p>
                )}
                {filteredSuggestions.slice(0, 6).map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSearch(item.label)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = isDark
                        ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 17,
                      flexShrink: 0,
                    }}>{item.icon}</span>
                    <div>
                      <p style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: isDark ? '#fff' : '#0f0f0f',
                        fontFamily: "'DM Sans', sans-serif",
                        margin: 0,
                      }}>{item.label}</p>
                      <p style={{
                        fontSize: 12,
                        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                        fontFamily: "'DM Sans', sans-serif",
                        margin: 0,
                      }}>{item.category}</p>
                    </div>
                    <svg
                      style={{ marginLeft: 'auto', opacity: 0.3, flexShrink: 0 }}
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </button>
                ))}
                {inputValue.length > 0 && filteredSuggestions.length === 0 && (
                  <p style={{
                    padding: '12px 16px',
                    fontSize: 14,
                    color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>No suggestions for "{inputValue}"</p>
                )}
              </div>
            </div>
          )}
        </div>

        <FilterChips
          categories={CATEGORIES}
          active={activeCategory}
          onChange={handleCategoryChange}
          isDark={isDark}
        />
      </div>

      <div style={{ padding: '24px 20px 40px' }}>
        {!hasSearched ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: isDark ? '#fff' : '#0f0f0f',
              }}>Suggested For You</h2>
              <a href="#" style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#22c55e',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.13)'}`,
                padding: '6px 12px',
                borderRadius: 20,
                textDecoration: 'none',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              }}>See all →</a>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              marginBottom: 32,
            }}>
              {SUGGESTED_PRODUCTS.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSearch(item.label)}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 14,
                    padding: '14px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#22c55e';
                    (e.currentTarget as HTMLButtonElement).style.background = isDark
                      ? 'rgba(34,197,94,0.07)' : 'rgba(34,197,94,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = isDark
                      ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.background = isDark
                      ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <p style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
                    fontFamily: "'DM Sans', sans-serif",
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.3,
                  }}>{item.label}</p>
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: isDark ? '#fff' : '#0f0f0f',
              }}>Browse All</h2>
            </div>
            <ListingGrid category={activeCategory} search="" isDark={isDark} />
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 13,
                color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Showing results for{' '}
                <span style={{ color: '#22c55e', fontWeight: 600 }}>"{search}"</span>
                {activeCategory !== 'All' && (
                  <> in <span style={{ color: isDark ? '#fff' : '#0f0f0f', fontWeight: 600 }}>{activeCategory}</span></>
                )}
              </p>
            </div>
            <ListingGrid category={activeCategory} search={search} isDark={isDark} />
          </>
        )}
      </div>
    </AppLayout>
  );
}