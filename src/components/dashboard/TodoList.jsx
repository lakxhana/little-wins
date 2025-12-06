import React from 'react';
import Card from '../common/Card';
import TaskInput from './TaskInput';
import { theme } from '../../styles/theme';

const TodoList = ({ tasks, onToggleTask, onAddTask, onDeleteTask }) => {
  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.lg,
  };

  const taskListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  };

  const taskItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    background: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    transition: theme.transitions.fast,
  };

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: theme.colors.primaryGreen,
  };

  const taskTextStyle = (completed) => ({
    flex: 1,
    fontSize: '16px',
    color: theme.colors.primaryText,
    textDecoration: completed ? 'line-through' : 'none',
    opacity: completed ? 0.6 : 1,
  });

  const deleteButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: theme.spacing.xs,
    opacity: 0.6,
    transition: theme.transitions.fast,
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.primaryText,
    opacity: 0.6,
    fontSize: '16px',
  };

  return (
    <Card>
      <div style={titleStyle}>📝 Your Tasks</div>

      {tasks.length === 0 ? (
        <div style={emptyStateStyle}>
          No tasks yet. Add one below to get started!
        </div>
      ) : (
        <div style={taskListStyle}>
          {tasks.map((task) => (
            <div key={task.id} style={taskItemStyle}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                style={checkboxStyle}
              />
              <div style={taskTextStyle(task.completed)}>
                {task.text}
                {task.complexity && (
                  <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                    Complexity: {task.complexity}
                  </div>
                )}
              </div>
              <button
                style={deleteButtonStyle}
                onClick={() => onDeleteTask(task.id)}
                aria-label="Delete task"
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.6'}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <TaskInput onAddTask={onAddTask} />
    </Card>
  );
};

export default TodoList;
