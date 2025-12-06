import React from 'react';
import { theme } from '../../styles/theme';

const Header = ({ showBackButton = false, onBack }) => {
  const headerStyle = {
    padding: theme.spacing.lg,
    background: theme.colors.white,
    boxShadow: theme.shadows.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.primaryBlue,
    margin: 0,
  };

  const backButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: theme.colors.primaryBlue,
    padding: theme.spacing.sm,
  };

  return (
    <header style={headerStyle}>
      {showBackButton && (
        <button style={backButtonStyle} onClick={onBack} aria-label="Go back">
          ←
        </button>
      )}
      <h1 style={titleStyle}>Little Wins</h1>
      <div style={{ width: showBackButton ? '32px' : '0' }} /> {/* Spacer for centering */}
    </header>
  );
};

export default Header;
