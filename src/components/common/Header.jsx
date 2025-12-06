import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';

const Header = ({ showMenu = true, pageTitle }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const headerStyle = {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    background: theme.colors.white,
    boxShadow: theme.shadows.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: `1px solid ${theme.colors.borderGray}`,
  };

  const titleStyle = {
    ...theme.typography.h1,
    color: theme.colors.primaryBlue,
    margin: 0,
    fontWeight: '600', // Softer than 700 for neurodivergent-friendly
  };

  const hamburgerButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
  };

  const hamburgerLineStyle = (isOpen) => ({
    width: '24px',
    height: '3px',
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
  });

  const hamburgerLine2Style = (isOpen) => ({
    width: '24px',
    height: '3px',
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    opacity: isOpen ? 0 : 1,
  });

  const hamburgerLine3Style = (isOpen) => ({
    width: '24px',
    height: '3px',
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
  });

  const menuStyle = {
    position: 'absolute',
    top: '100%',
    right: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    minWidth: '200px',
    padding: theme.spacing.md,
    opacity: isMenuOpen ? 1 : 0,
    transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.3s ease',
    pointerEvents: isMenuOpen ? 'auto' : 'none',
    zIndex: 1000,
  };

  const menuItemStyle = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    cursor: 'pointer',
    borderRadius: theme.borderRadius.sm,
    fontSize: '16px',
    color: theme.colors.primaryText,
    transition: 'background-color 0.2s ease',
  };

  const menuItemHoverStyle = {
    backgroundColor: theme.colors.lightBlue,
  };

  const displayTitle = pageTitle ? `Little Wins - ${pageTitle}` : 'Little Wins';

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>{displayTitle}</h1>
      {showMenu && (
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            style={hamburgerButtonStyle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <div style={hamburgerLineStyle(isMenuOpen)}></div>
            <div style={hamburgerLine2Style(isMenuOpen)}></div>
            <div style={hamburgerLine3Style(isMenuOpen)}></div>
          </button>
          
          {isMenuOpen && (
            <div style={menuStyle}>
              <div
                style={menuItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.lightBlue}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/dashboard');
                }}
              >
                📊 Dashboard
              </div>
              <div
                style={menuItemStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.lightBlue}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/settings');
                }}
              >
                ⚙️ Settings
              </div>
            <div
              style={menuItemStyle}
              onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.lightBlue}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/review');
              }}
            >
              📝 Review
            </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
