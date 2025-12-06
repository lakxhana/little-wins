import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const TaskFeelingsScreen = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (feeling) => {
    onSelect(feeling);
    navigate('/energy');
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
    gap: theme.spacing.lg,
    maxWidth: '500px',
    width: '100%',
  };

  const optionCardStyle = {
    cursor: 'pointer',
    transition: theme.transitions.normal,
    padding: theme.spacing.xl,
    textAlign: 'center',
  };

  const optionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.sm,
  };

  const optionDescStyle = {
    fontSize: '16px',
    color: theme.colors.primaryText,
    opacity: 0.7,
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to Little Wins!</h1>
      <p style={subtitleStyle}>How are you feeling about your tasks today?</p>

      <div style={optionsContainerStyle}>
        <Card
          style={optionCardStyle}
          onClick={() => handleSelect('overwhelmed')}
        >
          <div style={optionTitleStyle}>😰 I'm getting overwhelmed</div>
          <div style={optionDescStyle}>
            I need help managing the load and breaking things down
          </div>
        </Card>

        <Card
          style={optionCardStyle}
          onClick={() => handleSelect('structure')}
        >
          <div style={optionTitleStyle}>📋 I just need help with structure</div>
          <div style={optionDescStyle}>
            I'm ready to tackle tasks, just need organization
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskFeelingsScreen;
