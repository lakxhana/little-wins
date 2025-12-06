import React from 'react';
import { theme } from '../../styles/theme';

const Header = () => {
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

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Little Wins</h1>
    </header>
  );
};

export default Header;
