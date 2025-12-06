import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const MoodStatus = ({ taskFeeling, energyLevel }) => {
  const navigate = useNavigate();

  const feelingLabels = {
    overwhelmed: '😰 Feeling Overwhelmed',
    structure: '📋 Need Structure',
  };

  const energyLabels = {
    low: '😴 Low Energy',
    moderate: '😊 Moderate Energy',
    high: '🚀 High Energy',
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
          <div style={labelStyle}>Task Approach</div>
          <div style={valueStyle}>{feelingLabels[taskFeeling] || 'Not set'}</div>
        </div>
        <div style={statusStyle}>
          <div style={labelStyle}>Energy Level</div>
          <div style={valueStyle}>{energyLabels[energyLevel] || 'Not set'}</div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          style={{ padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: '14px' }}
        >
          Update
        </Button>
      </div>
    </Card>
  );
};

export default MoodStatus;
