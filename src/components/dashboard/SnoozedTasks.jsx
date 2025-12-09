import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const SnoozedTasks = ({ snoozedTasks, onWakeUp, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({});

  // Update time remaining every minute
  useEffect(() => {
    const updateTimes = () => {
      const times = {};
      snoozedTasks.forEach(task => {
        if (task.snoozedUntil) {
          const now = Date.now();
          const until = new Date(task.snoozedUntil).getTime();
          const remaining = Math.max(0, until - now);
          
          if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000);
            times[task.id] = minutes;
          }
        }
      });
      setTimeRemaining(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, [snoozedTasks]);

  if (snoozedTasks.length === 0) return null;

  const formatTime = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Header style - light purple bar with dashed border
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: '#F5F3FF',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    cursor: 'pointer',
    border: '1px dashed #C4B5FD',
    transition: theme.transitions.fast,
  };

  const headerTextStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: '14px',
    fontWeight: '600',
    color: '#7C3AED',
  };

  // Card style - light purple card
  const cardStyle = {
    border: `2px solid #C4B5FD`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: '#F5F3FF',
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  };

  const cardTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    fontSize: '16px',
    fontWeight: '600',
    color: '#7C3AED',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#7C3AED',
    opacity: 0.6,
    padding: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.fast,
  };

  const sleepingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    color: '#7C3AED',
    fontSize: '14px',
    fontWeight: '500',
  };

  const taskItemStyle = {
    backgroundColor: theme.colors.white,
    border: `1px solid #E9D5FF`,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  };

  const taskNameStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  };

  const taskMetaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    fontSize: '12px',
    color: theme.colors.primaryText,
    opacity: 0.7,
    marginBottom: theme.spacing.sm,
  };

  const wakeUpButtonStyle = {
    width: '100%',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primaryBlue,
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: theme.transitions.fast,
  };

  return (
    <div>
      {/* Header - Clickable to expand */}
      <div style={headerStyle} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={headerTextStyle}>
          <span>🕐</span>
          <span>{snoozedTasks.length} Snoozed Task{snoozedTasks.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Expanded Card */}
      {isExpanded && (
        <Card style={cardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>
              <span>🔔</span>
              <span>Snoozed Tasks</span>
            </div>
            <button 
              style={closeButtonStyle} 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              ×
            </button>
          </div>

          <div style={sleepingStyle}>
            <span>🕐</span>
            <span>Sleeping</span>
          </div>

          {snoozedTasks.map(task => (
            <div key={task.id} style={taskItemStyle}>
              <div style={taskNameStyle}>{task.text}</div>
              <div style={taskMetaStyle}>
                <span>🔴 {timeRemaining[task.id] !== undefined ? formatTime(timeRemaining[task.id]) : 'Calculating...'}</span>
                <span>🌱 {task.estimatedTime || task.time || '5m'}</span>
              </div>
              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                <button 
                  style={wakeUpButtonStyle} 
                  onClick={() => onWakeUp(task.id)}
                >
                  Wake Up
                </button>
                {onDelete && (
                  <button 
                    style={{
                      ...wakeUpButtonStyle,
                      backgroundColor: 'transparent',
                      color: theme.colors.primaryText,
                      border: `1px solid ${theme.colors.borderGray}`,
                    }}
                    onClick={() => onDelete(task.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                      e.currentTarget.style.borderColor = '#EF4444';
                      e.currentTarget.style.color = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = theme.colors.borderGray;
                      e.currentTarget.style.color = theme.colors.primaryText;
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default SnoozedTasks;

