import React from 'react';
import { theme } from '../../styles/theme';

const Header = () => {
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

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Little Wins</h1>
    </header>
  );
};

export default Header;
