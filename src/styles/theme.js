export const theme = {
  colors: {
    // Neurodivergent-friendly color palette with blue and sandy theme
    background: 'linear-gradient(180deg, #E3F2FD 0%, #E8EAF6 50%, #FFF3E0 100%)', // Soft blue → lavender → sandy peach
    backgroundRadial: 'radial-gradient(ellipse at center, #E3F2FD 0%, #E8EAF6 40%, #FFF3E0 100%)', // Round gradient variant
    backgroundSolid: '#FAF5F0', // Fallback sandy color
    
    primaryText: '#2C3E50', // Soft dark blue-gray
    secondaryText: '#5A6C7D',
    mutedText: '#7F8C9A',
    
    // Primary colors - Blue and Sandy theme
    primaryBlue: '#5B8FA3', // Soft blue (keeping current)
    primaryBlueLight: '#7BA8B8',
    primaryBlueDark: '#4A7282',
    
    // Sandy/peach colors
    sandy: '#E8D5C4', // Soft sandy beige
    sandyLight: '#F5E6D3',
    sandyDark: '#D4C4B0',
    peach: '#FFE5D4', // Soft peach
    
    // Legacy support
    primaryGreen: '#8FBC8F',
    lightBlue: '#ADD8E6',
    lightGreen: '#B4EEB4',
    primaryOrange: '#E8D5C4', // Map to sandy
    
    white: '#FFFFFF',
    offWhite: '#FAFBFC',
    lightGray: '#F5F7FA',
    borderGray: '#E1E8ED',
    cardBackground: '#FFFFFF',
    shadow: 'rgba(44, 62, 80, 0.08)',
  },
  gradient: 'linear-gradient(135deg, #ADD8E6 0%, #E8D5C4 100%)', // Blue to sandy gradient
  fonts: {
    primary: "'Roboto', sans-serif",
  },
  typography: {
    h1: {
      fontSize: '28px',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.3px',
    },
    h2: {
      fontSize: '22px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '-0.2px',
    },
    h3: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0px',
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    small: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 4px rgba(38, 50, 56, 0.1)',
    md: '0 4px 12px rgba(38, 50, 56, 0.12)',
    lg: '0 8px 24px rgba(38, 50, 56, 0.15)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
};
