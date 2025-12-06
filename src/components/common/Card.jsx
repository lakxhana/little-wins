import React from 'react';
import { theme } from '../../styles/theme';

const Card = ({ children, style, className, gradient = false, onClick, onMouseEnter, onMouseLeave }) => {
  const cardStyle = {
    background: gradient ? theme.gradient : theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.md,
    marginBottom: theme.spacing.lg,
    transition: theme.transitions.normal,
    cursor: onClick ? 'pointer' : 'default',
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
