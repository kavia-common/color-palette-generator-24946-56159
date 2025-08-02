import React, { useState, useEffect } from 'react';
import './App.css';

// Helper to generate random hex color
const getRandomColor = () =>
  '#' +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0');

// Generate a palette of 5 random colors
function getRandomPalette() {
  return Array.from({ length: 5 }, () => getRandomColor());
}

// Get favorites from localStorage
function getFavoritesFromStorage() {
  try {
    const data = localStorage.getItem('palettes_favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save favorites to localStorage
function setFavoritesToStorage(favorites) {
  localStorage.setItem('palettes_favorites', JSON.stringify(favorites));
}

// PUBLIC_INTERFACE
function App() {
  // States
  const [palette, setPalette] = useState(getRandomPalette());
  const [favorites, setFavorites] = useState([]);
  const [copiedHex, setCopiedHex] = useState(null);

  // Load favorites from storage on mount
  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  // Save favorites to storage if they change
  useEffect(() => {
    setFavoritesToStorage(favorites);
  }, [favorites]);

  // Generate a new random palette
  // PUBLIC_INTERFACE
  const handleNewPalette = () => {
    setPalette(getRandomPalette());
    setCopiedHex(null);
  };

  // Copy color code to clipboard and show feedback
  // PUBLIC_INTERFACE
  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1000);
  };

  // Save current palette to favorites (if not duplicate)
  // PUBLIC_INTERFACE
  const handleSaveFavorite = () => {
    if (favorites.find((fav) => fav.join(',') === palette.join(','))) return;
    setFavorites([palette.slice(), ...favorites]);
  };

  // Remove favorite palette by index
  // PUBLIC_INTERFACE
  const handleRemoveFavorite = (idx) => {
    setFavorites(favorites.filter((_, i) => i !== idx));
  };

  // UI Colors (matching requirements)
  const brandColors = {
    primary: '#5C6BC0',
    secondary: '#FFB300',
    accent: '#FF5252',
  };

  return (
    <div
      className="main-bg"
      style={{
        background: '#fff',
        minHeight: '100vh',
        padding: 0,
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        color: '#222',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: 700,
          padding: '36px 16px 0 16px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 0.2,
            marginBottom: 12,
            color: brandColors.primary,
            textAlign: 'center',
            textShadow: '0 1px 0 #fafafa',
          }}
        >
          Color Palette Generator
        </h1>
        <div
          style={{
            color: '#555',
            fontSize: 17,
            maxWidth: 480,
            margin: '0 auto 32px auto',
            textAlign: 'center',
          }}
        >
          Instantly generate a row of 5 random color palettes. <br />
          Copy color hex codes or save your favorites!
        </div>

        {/* Palette row */}
        <div
          className="palette-row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 18,
            marginBottom: 18,
            width: '100%',
            maxWidth: 650,
            alignSelf: 'center',
            userSelect: 'none',
          }}
        >
          {palette.map((color, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 14,
                overflow: 'hidden',
                border: `1.5px solid #ececec`,
                background: '#fbfbfb',
                boxShadow:
                  '0 1px 3px rgba(44,56,63,.11), 0 1.5px 12px rgba(80,93,104,.07)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 80,
                  background: color,
                  transition: 'background .35s',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e3e3e3',
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}
                title={color}
                tabIndex={0}
                aria-label={`Copy color ${color}`}
                onClick={() => handleCopy(color)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCopy(color);
                }}
              />
              <button
                onClick={() => handleCopy(color)}
                aria-label={`Copy color ${color}`}
                style={{
                  padding: '4px 0 6px 0',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: 15,
                  color:
                    copiedHex === color
                      ? brandColors.accent
                      : brandColors.primary,
                  letterSpacing: 0.04,
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'color .25s',
                  position: 'relative',
                  backgroundColor:
                    copiedHex === color
                      ? 'rgba(255,148,148,0.08)'
                      : 'transparent',
                }}
              >
                {copiedHex === color ? 'Copied!' : color}
              </button>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 14,
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={handleNewPalette}
            style={{
              background: brandColors.primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              borderRadius: 7,
              padding: '11px 26px',
              boxShadow: '0 1.5px 9px 0 rgba(80,93,104,.11)',
              letterSpacing: 0.04,
              cursor: 'pointer',
              transition: 'background .18s',
            }}
            aria-label="Generate New Palette"
          >
            Generate New Palette
          </button>
          <button
            onClick={handleSaveFavorite}
            style={{
              background: favorites.find(
                (fav) => fav.join(',') === palette.join(',')
              )
                ? 'rgba(255, 183, 0, 0.10)'
                : brandColors.secondary,
              color: favorites.find(
                (fav) => fav.join(',') === palette.join(',')
              )
                ? brandColors.primary
                : '#fff',
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              borderRadius: 7,
              padding: '11px 22px',
              letterSpacing: 0.04,
              boxShadow: '0 1.5px 9px 0 rgba(255,179,0,0.08)',
              cursor: favorites.find(
                (fav) => fav.join(',') === palette.join(',')
              )
                ? 'not-allowed'
                : 'pointer',
              transition: 'background .18s',
              opacity: favorites.find(
                (fav) => fav.join(',') === palette.join(',')
              )
                ? 0.85
                : 1,
            }}
            aria-label="Save as Favorite"
            disabled={favorites.find((fav) => fav.join(',') === palette.join(','))}
          >
            {favorites.find((fav) => fav.join(',') === palette.join(','))
              ? 'Saved'
              : 'Save as Favorite'}
          </button>
        </div>

        {/* Favorites */}
        <div style={{ margin: '35px auto 12px auto', maxWidth: 430 }}>
          <div
            style={{
              fontWeight: 600,
              letterSpacing: 0.04,
              fontSize: 18,
              color: '#222',
              marginBottom: 9,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span role="img" aria-label="star" style={{ color: '#FFB300' }}>
              ★
            </span>
            Favorites
            <span style={{ color: '#bbb', marginLeft: 6, fontWeight: 400, fontSize: 13 }}>
              {favorites.length === 0 ? '(none saved)' : ''}
            </span>
          </div>
          {/* Favorites list */}
          <div
            className="favorites-list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
              gap: '11px',
              width: '100%',
            }}
          >
            {favorites.length === 0 && (
              <div
                style={{
                  color: '#aaa',
                  fontSize: 15,
                  padding: '16px 0',
                  textAlign: 'center',
                  gridColumn: '1/-1',
                }}
              >
                No favorites yet. Save a palette!
              </div>
            )}
            {favorites.map((favPalette, idx) => (
              <div
                key={idx}
                className="favorite-palette"
                style={{
                  background: '#f8f8fc',
                  border: `1.1px solid #ececec`,
                  borderRadius: 10,
                  padding: '10px 10px 7px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  position: 'relative',
                }}
                tabIndex={0}
                aria-label={`Favorite palette ${idx + 1}`}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    position: 'absolute',
                    top: 6,
                    right: 9,
                    cursor: 'pointer',
                    color: brandColors.accent,
                    fontSize: 17,
                    opacity: 0.72,
                    transition: 'opacity .17s',
                  }}
                  aria-label="Remove favorite"
                  title="Remove favorite palette"
                  onClick={() => handleRemoveFavorite(idx)}
                >
                  ×
                </button>
                <div
                  style={{
                    display: 'flex',
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  {favPalette.map((color, j) => (
                    <div
                      key={j}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 7,
                        background: color,
                        border: '1px solid #e3e3e3',
                        marginRight: j !== favPalette.length - 1 ? 2 : 0,
                      }}
                      title={color}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 7,
                  }}
                >
                  {favPalette.map((color, j) => (
                    <button
                      key={j}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 13.2,
                        color: brandColors.primary,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        borderRadius: 5,
                        padding: '0 3px',
                        fontWeight: 500,
                        outline: 'none',
                        transition: 'background .13s',
                        backgroundColor:
                          copiedHex === color
                            ? 'rgba(255,82,82,0.055)'
                            : 'transparent',
                      }}
                      tabIndex={0}
                      aria-label={`Copy hex ${color}`}
                      title="Click to copy hex"
                      onClick={() => handleCopy(color)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleCopy(color);
                      }}
                    >
                      {copiedHex === color ? 'Copied!' : color}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer
          style={{
            fontSize: 13.5,
            color: '#bbb',
            margin: '48px auto 12px auto',
            paddingBottom: 14,
            fontWeight: 400,
            textAlign: 'center',
            letterSpacing: 0.01,
          }}
        >
          A minimal Color Palette Generator –{' '}
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: brandColors.primary,
              textDecoration: 'none',
              borderBottom: `1.5px solid ${brandColors.primary}55`,
            }}
          >
            Built with React
          </a>
        </footer>
      </div>
      <style>
        {`
        @media (max-width: 600px) {
          .palette-row {
            gap: 11px !important;
          }
          .main-bg > div {
            padding-top: 13px !important;
          }
        }
        `}
      </style>
    </div>
  );
}

export default App;
