import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const MoodStatus = ({ taskFeeling, energyLevel }) => {
  const navigate = useNavigate();

  const feelingLabels = {
    overwhelmed: '😰 Overwhelming feelings',
    structure: '📋 Structure',
  };

  const energyLabels = {
    low: '😴 Low',
    moderate: '😊 Moderate',
    high: '🚀 High',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const statusStyle = {
    flex: 1,
  };

  const labelStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    opacity: 0.7,
    marginBottom: theme.spacing.xs,
  };

  const valueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
  };

  return (
    <Card>
      <div style={containerStyle}>
        <div style={statusStyle}>
          <div style={labelStyle}>Today I need help with</div>
          <div style={valueStyle}>{feelingLabels[taskFeeling] || 'Not set'}</div>
        </div>
        <div style={statusStyle}>
          <div style={labelStyle}>My energy level is</div>
          <div style={valueStyle}>{energyLabels[energyLevel] || 'Not set'}</div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          style={{ padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: '14px' }}
        >
          It has changed
        </Button>
      </div>
    </Card>
  );
};

export default MoodStatus;
