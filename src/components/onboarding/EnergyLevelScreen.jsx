import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const EnergyLevelScreen = ({ onSelect }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const handleSelect = (level) => {
    onSelect(level);
    navigate('/dashboard');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #E3F2FD 0%, #E8EAF6 50%, #FFF3E0 100%)',
    backgroundAttachment: 'fixed',
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: width <= 480 ? theme.spacing.md : theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
  };

  const appTitleStyle = {
    ...theme.typography.h1,
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.xl,
    fontWeight: '600',
    textAlign: 'center',
    animation: 'scaleIn 0.6s ease-out',
    textShadow: `0 2px 10px rgba(91, 143, 163, 0.2)`,
  };

  const titleStyle = {
    ...theme.typography.h2,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xxl,
    textAlign: 'center',
    opacity: 0.8,
  };

  const optionsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    maxWidth: '500px',
    width: '100%',
  };

  const energyOptions = [
    {
      level: 'low',
      emoji: '😴',
      label: 'Low Energy',
      description: 'I need simple, manageable tasks',
    },
    {
      level: 'moderate',
      emoji: '😊',
      label: 'Moderate Energy',
      description: 'I can handle regular tasks',
    },
    {
      level: 'high',
      emoji: '🚀',
      label: 'Ready for Challenges',
      description: 'Bring on the complex tasks!',
    },
  ];

  const [hoveredCard, setHoveredCard] = React.useState(null);

  const getCardStyle = (level) => ({
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: theme.spacing.lg,
    textAlign: 'center',
    background: hoveredCard === level 
      ? `linear-gradient(135deg, rgba(123, 168, 184, 0.15) 0%, rgba(91, 143, 163, 0.25) 100%)`
      : theme.colors.white,
    transform: hoveredCard === level ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
    boxShadow: hoveredCard === level 
      ? `0 8px 24px rgba(123, 168, 184, 0.15)`
      : theme.shadows.md,
    border: `2px solid ${hoveredCard === level ? 'rgba(123, 168, 184, 0.4)' : theme.colors.borderGray}`,
    animation: 'slideInUp 0.5s ease-out',
    animationDelay: level === 'low' ? '0.1s' : level === 'moderate' ? '0.2s' : '0.3s',
    animationFillMode: 'both',
  });

  const getOptionTitleStyle = (level) => ({
    fontSize: '18px',
    fontWeight: '600',
    color: hoveredCard === level ? theme.colors.primaryBlue : theme.colors.primaryBlue,
    marginBottom: theme.spacing.xs,
    transition: 'color 0.3s ease',
    opacity: hoveredCard === level ? 1 : 0.9,
  });

  const getOptionDescStyle = (level) => ({
    fontSize: '14px',
    color: hoveredCard === level ? theme.colors.primaryText : theme.colors.primaryText,
    opacity: hoveredCard === level ? 0.85 : 0.7,
    transition: 'all 0.3s ease',
  });

  return (
    <div style={containerStyle}>
      <div className="wave-overlay" />
      <div style={contentStyle}>
        <h1 style={appTitleStyle}>Little Wins</h1>
        <h2 style={titleStyle}>How's your energy today?</h2>
        <p style={subtitleStyle}>This helps us match tasks to your current state</p>

        <div style={optionsContainerStyle}>
          {energyOptions.map((option) => (
            <Card
              key={option.level}
              style={getCardStyle(option.level)}
              onClick={() => handleSelect(option.level)}
              onMouseEnter={() => setHoveredCard(option.level)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm, animation: 'float 3s ease-in-out infinite', animationDelay: option.level === 'low' ? '0s' : option.level === 'moderate' ? '0.5s' : '1s' }}>
                {option.emoji}
              </div>
              <div style={getOptionTitleStyle(option.level)}>{option.label}</div>
              <div style={getOptionDescStyle(option.level)}>{option.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyLevelScreen;
