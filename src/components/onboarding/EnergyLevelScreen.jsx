import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const EnergyLevelScreen = ({ onSelect }) => {
  const navigate = useNavigate();

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
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  };

  const appTitleStyle = {
    ...theme.typography.h1,
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.xl,
    fontWeight: '600',
    textAlign: 'center',
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
    transition: theme.transitions.normal,
    padding: theme.spacing.lg,
    textAlign: 'center',
    background: hoveredCard === level ? theme.colors.lightBlue : theme.colors.white,
    transform: hoveredCard === level ? 'translateY(-4px)' : 'translateY(0)',
  });

  const optionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.xs,
  };

  const optionDescStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    opacity: 0.7,
  };

  return (
    <div style={containerStyle}>
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
              <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>
                {option.emoji}
              </div>
              <div style={optionTitleStyle}>{option.label}</div>
              <div style={optionDescStyle}>{option.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnergyLevelScreen;
