import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const Header = ({ showMenu = true, pageTitle }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { width } = useWindowSize();

  // Close menu when clicking outside or when window resizes significantly
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      // Close menu on significant resize to prevent layout issues
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const headerStyle = {
    padding: width <= 480 
      ? `${theme.spacing.md} ${theme.spacing.md}` 
      : width <= 768 
      ? `${theme.spacing.lg} ${theme.spacing.lg}` 
      : `${theme.spacing.lg} ${theme.spacing.xl}`,
    background: theme.colors.white,
    boxShadow: theme.shadows.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: `1px solid ${theme.colors.borderGray}`,
    width: '100%',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    ...theme.typography.h1,
    color: theme.colors.primaryBlue,
    margin: 0,
    fontWeight: '600',
    fontSize: width <= 480 ? '20px' : width <= 768 ? '24px' : theme.typography.h1.fontSize,
  };

  const hamburgerButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing.sm,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: theme.borderRadius.sm,
    transition: 'background-color 0.2s ease',
  };

  const hamburgerLineStyle = (isOpen) => ({
    width: '22px',
    height: '2.5px',
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    transform: isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none',
    transformOrigin: 'center',
  });

  const hamburgerLine2Style = (isOpen) => ({
    width: '22px',
    height: '2.5px',
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    opacity: isOpen ? 0 : 1,
  });

  const hamburgerLine3Style = (isOpen) => ({
    width: '22px',
    height: '2.5px',
    backgroundColor: theme.colors.primaryBlue,
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    transform: isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none',
    transformOrigin: 'center',
  });

  const getMenuStyle = () => {
    const isMobile = width <= 480;
    const isTablet = width > 480 && width <= 768;
    
    return {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: isMobile ? theme.spacing.md : isTablet ? theme.spacing.sm : 0,
      left: isMobile ? theme.spacing.md : 'auto',
      marginTop: 0,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.lg,
      minWidth: isMobile ? '200px' : '180px',
      maxWidth: isMobile ? `calc(100vw - ${theme.spacing.md * 2}px)` : 'none',
      width: isMobile ? `calc(100vw - ${theme.spacing.md * 2}px)` : 'auto',
      padding: `${theme.spacing.sm} 0`,
      opacity: isMenuOpen ? 1 : 0,
      visibility: isMenuOpen ? 'visible' : 'hidden',
      transform: isMenuOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: isMenuOpen ? 'auto' : 'none',
      zIndex: 1000,
      border: `1px solid ${theme.colors.borderGray}`,
      overflow: 'visible',
      display: isMenuOpen ? 'block' : 'none',
    };
  };

  const menuStyle = getMenuStyle();

  const menuItemStyle = {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    cursor: 'pointer',
    borderRadius: 0,
    fontSize: width <= 480 ? '16px' : '15px',
    color: theme.colors.primaryText,
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    whiteSpace: 'nowrap',
    minHeight: '44px', // Better touch target on mobile
    backgroundColor: 'transparent',
  };

  const menuItemHoverStyle = {
    backgroundColor: theme.colors.lightBlue,
  };

  const displayTitle = pageTitle ? `Little Wins - ${pageTitle}` : 'Little Wins';

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>{displayTitle}</h1>
      {showMenu && (
        <div 
          style={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }} 
          ref={menuRef}
        >
          <button
            style={hamburgerButtonStyle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.lightGray;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={hamburgerLineStyle(isMenuOpen)}></div>
            <div style={hamburgerLine2Style(isMenuOpen)}></div>
            <div style={hamburgerLine3Style(isMenuOpen)}></div>
          </button>
          
          {isMenuOpen && (
            <div style={menuStyle}>
              <div
                style={menuItemStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.lightGray}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onTouchStart={(e) => e.currentTarget.style.backgroundColor = theme.colors.lightGray}
                onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/dashboard');
                }}
              >
                📊 Dashboard
              </div>
              <div
                style={menuItemStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.lightGray}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onTouchStart={(e) => e.currentTarget.style.backgroundColor = theme.colors.lightGray}
                onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/settings');
                }}
              >
                ⚙️ Settings
              </div>
              <div
                style={menuItemStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.lightGray}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onTouchStart={(e) => e.currentTarget.style.backgroundColor = theme.colors.lightGray}
                onTouchEnd={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
