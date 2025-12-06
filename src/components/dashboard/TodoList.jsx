import React, { useState } from 'react';
import Card from '../common/Card';
import TaskInput from './TaskInput';
import { theme } from '../../styles/theme';

const TodoList = ({ tasks, onToggleTask, onAddTask, onDeleteTask, onReorderTasks }) => {
  // Get the first incomplete task
  const incompleteTasks = tasks.filter(task => !task.completed);
  const currentTask = incompleteTasks.length > 0 ? incompleteTasks[0] : null;

  // Map complexity to difficulty and time
  const getTaskInfo = (complexity) => {
    switch (complexity) {
      case 'low':
        return { difficulty: 'EASY', time: '2-5 mins', difficultyColor: theme.colors.lightGreen };
      case 'medium':
        return { difficulty: 'MEDIUM', time: '10-15 mins', difficultyColor: '#FFD700' };
      case 'high':
        return { difficulty: 'HARD', time: '20-30 mins', difficultyColor: theme.colors.primaryOrange };
      default:
        return { difficulty: 'EASY', time: '2-5 mins', difficultyColor: theme.colors.lightGreen };
    }
  };

  const handleDone = () => {
    if (currentTask) {
      onToggleTask(currentTask.id);
    }
  };

  const handleSnooze = () => {
    if (currentTask && onReorderTasks) {
      // Move current task to end of incomplete tasks
      const otherIncomplete = incompleteTasks.filter(t => t.id !== currentTask.id);
      const completedTasks = tasks.filter(t => t.completed);
      const newOrder = [...otherIncomplete, currentTask, ...completedTasks].map(t => t.id);
      onReorderTasks(newOrder);
    }
  };

  const handleSwap = () => {
    if (incompleteTasks.length > 1 && onReorderTasks) {
      // Swap first task with second task
      const [first, second, ...rest] = incompleteTasks;
      const completedTasks = tasks.filter(t => t.completed);
      const newOrder = [second, first, ...rest, ...completedTasks].map(t => t.id);
      onReorderTasks(newOrder);
    }
  };

  const handleOverwhelmed = () => {
    if (currentTask) {
      // Break down the task - for now just mark as done
      // In future, could trigger a breakdown modal
      onToggleTask(currentTask.id);
    }
  };

  const taskInfo = currentTask ? getTaskInfo(currentTask.complexity) : null;

  const taskCardStyle = {
    background: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    boxShadow: theme.shadows.md,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  };

  const topIndicatorsStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const difficultyBadgeStyle = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.full,
    backgroundColor: color,
    fontSize: '12px',
    fontWeight: '600',
    color: theme.colors.primaryText,
  });

  const timeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    fontSize: '14px',
    color: theme.colors.primaryText,
    opacity: 0.7,
  };

  const taskTextStyle = {
    fontSize: '32px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  };

  const readyTextStyle = {
    fontSize: '16px',
    color: theme.colors.primaryText,
    opacity: 0.6,
    marginBottom: theme.spacing.xl,
  };

  const doneButtonStyle = {
    width: '100%',
    padding: theme.spacing.md,
    background: theme.gradient,
    color: theme.colors.primaryText,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    transition: theme.transitions.fast,
  };

  const actionButtonsContainerStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const actionButtonStyle = {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    color: theme.colors.primaryText,
    border: `2px solid ${theme.colors.lightBlue}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    transition: theme.transitions.fast,
  };

  const overwhelmedStyle = {
    textAlign: 'center',
    color: theme.colors.primaryOrange,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    transition: theme.transitions.fast,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.primaryText,
    opacity: 0.6,
    fontSize: '16px',
  };

  // Hide TodoList component entirely when there are no tasks
  const hasNoTasks = tasks.length === 0;
  const allTasksCompleted = tasks.length > 0 && incompleteTasks.length === 0;

  // Return null if there are no tasks (hide component initially)
  if (hasNoTasks) {
    return null;
  }

  return (
    <>
      {currentTask ? (
        <Card style={taskCardStyle}>
          <div style={topIndicatorsStyle}>
            <div style={difficultyBadgeStyle(taskInfo.difficultyColor)}>
              <span>🌱</span>
              <span>{taskInfo.difficulty}</span>
            </div>
            <div style={timeStyle}>
              <span>🕐</span>
              <span>{taskInfo.time}</span>
            </div>
          </div>
          
          <div style={taskTextStyle}>{currentTask.text}</div>
          <div style={readyTextStyle}>Ready?</div>
          
          <button
            style={doneButtonStyle}
            onClick={handleDone}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <span>✓</span>
            <span>Done</span>
          </button>
          
          <div style={actionButtonsContainerStyle}>
            <button
              style={actionButtonStyle}
              onClick={handleSnooze}
              onMouseEnter={(e) => e.target.style.borderColor = theme.colors.primaryBlue}
              onMouseLeave={(e) => e.target.style.borderColor = theme.colors.lightBlue}
            >
              <span>🕐</span>
              <span>Snooze</span>
            </button>
          </div>
        </Card>
      ) : allTasksCompleted ? (
        <Card>
          <div style={emptyStateStyle}>
            🎉 All tasks completed! Great job!
          </div>
        </Card>
      ) : null}
      
      {allTasksCompleted && (
        <Card>
          <div style={{ fontSize: '20px', fontWeight: '600', color: theme.colors.primaryBlue, marginBottom: theme.spacing.lg }}>
            📝 Your Tasks
          </div>
          <TaskInput onAddTask={onAddTask} />
        </Card>
      )}
    </>
  );
};

export default TodoList;
