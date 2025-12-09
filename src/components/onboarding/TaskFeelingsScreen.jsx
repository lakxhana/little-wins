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
    gap: theme.spacing.lg,
    maxWidth: '500px',
    width: '100%',
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);

  const getOptionCardStyle = (feeling) => ({
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: theme.spacing.xl,
    textAlign: 'center',
    background: hoveredCard === feeling 
      ? `linear-gradient(135deg, rgba(123, 168, 184, 0.15) 0%, rgba(91, 143, 163, 0.25) 100%)`
      : theme.colors.white,
    transform: hoveredCard === feeling ? 'translateY(-4px) scale(1.01)' : 'translateY(0)',
    boxShadow: hoveredCard === feeling 
      ? `0 8px 24px rgba(123, 168, 184, 0.15)`
      : theme.shadows.md,
    border: `2px solid ${hoveredCard === feeling ? 'rgba(123, 168, 184, 0.4)' : theme.colors.borderGray}`,
    animation: 'slideInUp 0.5s ease-out',
    animationDelay: feeling === 'overwhelmed' ? '0.1s' : '0.2s',
    animationFillMode: 'both',
  });

  const getOptionTitleStyle = (feeling) => ({
    fontSize: '20px',
    fontWeight: '600',
    color: hoveredCard === feeling ? theme.colors.primaryBlue : theme.colors.primaryBlue,
    marginBottom: theme.spacing.sm,
    transition: 'color 0.3s ease',
    opacity: hoveredCard === feeling ? 1 : 0.9,
  });

  const getOptionDescStyle = (feeling) => ({
    fontSize: '16px',
    color: hoveredCard === feeling ? theme.colors.primaryText : theme.colors.primaryText,
    opacity: hoveredCard === feeling ? 0.85 : 0.7,
    transition: 'all 0.3s ease',
  });

  return (
    <div style={containerStyle}>
      <div className="wave-overlay" />
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
            <div style={getOptionTitleStyle('overwhelmed')}>😰 I'm getting overwhelmed</div>
            <div style={getOptionDescStyle('overwhelmed')}>
              I need help managing the load and breaking things down
            </div>
          </Card>

          <Card
            style={getOptionCardStyle('structure')}
            onClick={() => handleSelect('structure')}
            onMouseEnter={() => setHoveredCard('structure')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={getOptionTitleStyle('structure')}>📋 I just need help with structure</div>
            <div style={getOptionDescStyle('structure')}>
              I'm ready to tackle tasks, just need organization
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskFeelingsScreen;
