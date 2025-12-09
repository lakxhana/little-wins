import React from 'react';
import { theme } from '../../styles/theme';

const Card = ({ children, style, className, gradient = false, onClick, onMouseEnter, onMouseLeave }) => {
  const cardStyle = {
    background: gradient ? theme.gradient : theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.md,
    marginBottom: theme.spacing.lg,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    border: `1px solid ${theme.colors.borderGray}`,
    position: 'relative',
    overflow: 'visible',
    animation: 'slideInUp 0.4s ease-out',
    ...style,
  };

  return (
    <div
      className={`card ${className || ''} fade-in`}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default Card;
