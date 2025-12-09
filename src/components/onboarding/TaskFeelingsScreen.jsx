import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const TaskFeelingsScreen = ({ onSelect }) => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const handleSelect = (feeling) => {
    onSelect(feeling);
    navigate('/energy');
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
    gap: theme.spacing.lg,
    maxWidth: '500px',
    width: '100%',
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);

  const getOptionCardStyle = (feeling) => ({
    cursor: 'pointer',
    transition: theme.transitions.normal,
    padding: theme.spacing.xl,
    textAlign: 'center',
    background: hoveredCard === feeling ? theme.colors.lightBlue : theme.colors.white,
    transform: hoveredCard === feeling ? 'translateY(-4px)' : 'translateY(0)',
  });

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
      <div style={contentStyle}>
        <h1 style={appTitleStyle}>Little Wins</h1>
        <h2 style={titleStyle}>Welcome! How are you feeling about your tasks today?</h2>
        <p style={subtitleStyle}>How are you feeling about your tasks today?</p>

        <div style={optionsContainerStyle}>
          <Card
            style={getOptionCardStyle('overwhelmed')}
            onClick={() => handleSelect('overwhelmed')}
            onMouseEnter={() => setHoveredCard('overwhelmed')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={optionTitleStyle}>😰 I'm getting overwhelmed</div>
            <div style={optionDescStyle}>
              I need help managing the load and breaking things down
            </div>
          </Card>

          <Card
            style={getOptionCardStyle('structure')}
            onClick={() => handleSelect('structure')}
            onMouseEnter={() => setHoveredCard('structure')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={optionTitleStyle}>📋 I just need help with structure</div>
            <div style={optionDescStyle}>
              I'm ready to tackle tasks, just need organization
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskFeelingsScreen;
