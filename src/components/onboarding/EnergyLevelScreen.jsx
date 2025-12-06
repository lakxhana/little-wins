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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    background: theme.colors.background,
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
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
    gap: theme.spacing.md,
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

  const cardStyle = {
    cursor: 'pointer',
    transition: theme.transitions.normal,
    padding: theme.spacing.lg,
    textAlign: 'center',
  };

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
      <h1 style={titleStyle}>How's your energy today?</h1>
      <p style={subtitleStyle}>This helps us match tasks to your current state</p>

      <div style={optionsContainerStyle}>
        {energyOptions.map((option) => (
          <Card
            key={option.level}
            style={cardStyle}
            onClick={() => handleSelect(option.level)}
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
  );
};

export default EnergyLevelScreen;
