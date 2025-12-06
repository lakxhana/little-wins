import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const Review = () => {
  const [tasksDone, setTasksDone] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const XP_PER_LEVEL = 100;

  // Load tasks and count completed ones, and get latest 5 completed tasks
  const loadCompletedTasks = () => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          const completedCount = parsed.filter(task => task.completed).length;
          setTasksDone(completedCount);
          
          // Get latest 5 completed tasks (reverse order to get most recent first)
          const completed = parsed.filter(task => task.completed);
          // Since tasks are added in order, the last completed ones are the latest
          const latestCompleted = completed.slice(-5).reverse();
          setCompletedTasks(latestCompleted);
        }
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
  };

  useEffect(() => {
    loadCompletedTasks();
  }, []);

  // Load XP and level from localStorage (same as TaskWarrior)
  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('taskWarriorXp');
      const savedLevel = localStorage.getItem('taskWarriorLevel');
      
      if (savedXp !== null) {
        setXp(parseInt(savedXp, 10));
      }
      if (savedLevel !== null) {
        setLevel(parseInt(savedLevel, 10));
      }
    } catch (error) {
      console.error('Failed to load TaskWarrior data from localStorage:', error);
    }
  }, []);

  // Listen for task completion to update tasks done count
  useEffect(() => {
    const handleTaskCompleted = () => {
      loadCompletedTasks();
    };

    // Also listen for XP/level changes
    const handleStorageChange = () => {
      try {
        const savedXp = localStorage.getItem('taskWarriorXp');
        const savedLevel = localStorage.getItem('taskWarriorLevel');
        
        if (savedXp !== null) {
          setXp(parseInt(savedXp, 10));
        }
        if (savedLevel !== null) {
          setLevel(parseInt(savedLevel, 10));
        }
      } catch (error) {
        console.error('Failed to update XP/level:', error);
      }
    };

    window.addEventListener('taskCompleted', handleTaskCompleted);
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      loadCompletedTasks();
      handleStorageChange();
    }, 1000);

    return () => {
      window.removeEventListener('taskCompleted', handleTaskCompleted);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    background: theme.colors.background,
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing.lg,
  };

  const metricsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  };

  const metricCardStyle = {
    padding: theme.spacing.xl,
    textAlign: 'center',
  };

  const metricValueStyle = {
    fontSize: '48px',
    fontWeight: '700',
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.xs,
  };

  const metricLabelStyle = {
    fontSize: '16px',
    color: theme.colors.primaryText,
    opacity: 0.7,
    fontWeight: '500',
  };

  const progressCardStyle = {
    marginBottom: theme.spacing.lg,
  };

  const progressHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
  };

  const progressBarContainerStyle = {
    width: '100%',
    height: '12px',
    backgroundColor: '#E0E0E0',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  };

  const progressBarFillStyle = {
    height: '100%',
    width: `${(xp / XP_PER_LEVEL) * 100}%`,
    background: 'linear-gradient(90deg, #9370DB 0%, #DDA0DD 100%)',
    borderRadius: theme.borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  };

  const progressTextStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    opacity: 0.7,
  };

  const completedTasksCardStyle = {
    marginBottom: theme.spacing.lg,
  };

  const completedTasksHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
  };

  const taskListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  };

  const taskItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightBlue || '#F0F4FF',
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    color: theme.colors.primaryText,
  };

  const taskCheckStyle = {
    fontSize: '18px',
    color: theme.colors.primaryGreen || '#8FBC8F',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.primaryText,
    opacity: 0.6,
    fontSize: '14px',
  };

  const nextLevel = level + 1;
  const xpPercentage = (xp / XP_PER_LEVEL) * 100;
  const xpNeeded = XP_PER_LEVEL - xp;

  return (
    <div style={containerStyle}>
      <Header pageTitle="Review" />
      <div style={contentStyle}>
        {/* Metrics Cards */}
        <div style={metricsContainerStyle}>
          <Card style={metricCardStyle}>
            <div style={metricValueStyle}>{tasksDone}</div>
            <div style={metricLabelStyle}>Tasks Done</div>
          </Card>
          <Card style={metricCardStyle}>
            <div style={metricValueStyle}>{level}</div>
            <div style={metricLabelStyle}>Level</div>
          </Card>
        </div>

        {/* Progress Card */}
        <Card style={progressCardStyle}>
          <div style={progressHeaderStyle}>
            <span>⬆️</span>
            <span>Progress to Level {nextLevel}</span>
          </div>
          <div style={progressBarContainerStyle}>
            <div style={progressBarFillStyle}></div>
          </div>
          <div style={progressTextStyle}>
            {xp}/{XP_PER_LEVEL} XP
          </div>
        </Card>

        {/* Completed Tasks Card */}
        <Card style={completedTasksCardStyle}>
          <div style={completedTasksHeaderStyle}>
            <span>📝</span>
            <span>Completed Tasks</span>
          </div>
          {completedTasks.length > 0 ? (
            <div style={taskListStyle}>
              {completedTasks.map((task) => (
                <div key={task.id} style={taskItemStyle}>
                  <span style={taskCheckStyle}>✓</span>
                  <span>{task.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyStateStyle}>
              No tasks completed yet. Complete some tasks to see your progress here.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Review;

