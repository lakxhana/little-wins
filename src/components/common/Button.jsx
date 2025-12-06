import React from 'react';
import { theme } from '../../styles/theme';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
  style,
}) => {
  const variants = {
    primary: {
      background: theme.colors.primaryBlue,
      color: theme.colors.white,
      hover: theme.colors.lightBlue,
    },
    secondary: {
      background: theme.colors.primaryGreen,
      color: theme.colors.white,
      hover: theme.colors.lightBlue,
    },
    outline: {
      background: 'transparent',
      color: theme.colors.primaryBlue,
      border: `2px solid ${theme.colors.primaryBlue}`,
      hover: theme.colors.lightBlue,
    },
    alert: {
      background: theme.colors.primaryOrange,
      color: theme.colors.white,
      hover: theme.colors.lightBlue,
    },
  };

  const buttonStyle = {
    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
    borderRadius: theme.borderRadius.full,
    fontSize: '16px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: theme.transitions.normal,
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    ...variants[variant],
    ...style,
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const hoverStyle = isHovered && !disabled ? {
    background: variants[variant].hover,
    boxShadow: theme.shadows.md,
  } : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...buttonStyle, ...hoverStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
