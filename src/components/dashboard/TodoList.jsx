import React, { useState } from 'react';
import Card from '../common/Card';
import OverwhelmedModal from './OverwhelmedModal';
import { theme } from '../../styles/theme';

const TodoList = ({ tasks, onToggleTask, onAddTask, onDeleteTask, onReorderTasks, onSnooze }) => {
  const [isOverwhelmedModalOpen, setIsOverwhelmedModalOpen] = useState(false);
  const incompleteTasks = tasks.filter(task => !task.completed);
  const currentTask = incompleteTasks.length > 0 ? incompleteTasks[0] : null;

  const getTaskInfo = (complexity) => {
    switch (complexity) {
      case 'low':
        return { difficulty: 'EASY', time: '2–5 mins', difficultyColor: theme.colors.lightGreen };
      case 'medium':
        return { difficulty: 'MEDIUM', time: '10–15 mins', difficultyColor: '#FFD700' };
      case 'high':
        return { difficulty: 'HARD', time: '20–30 mins', difficultyColor: theme.colors.primaryOrange };
      default:
        return { difficulty: 'EASY', time: '2–5 mins', difficultyColor: theme.colors.lightGreen };
    }
  };

  const handleDone = () => currentTask && onToggleTask(currentTask.id);

  const handleSnooze = () => {
    if (currentTask && onSnooze) {
      onSnooze(currentTask.id, 60); // Default to 1 hour
    }
  };

  const handleTryAnyway = () => {
    // Just close the modal, user wants to continue
  };

  const taskInfo = currentTask ? getTaskInfo(currentTask.complexity) : null;

  const emptyStateStyle = {
    textAlign: 'center',
    padding: theme.spacing.xl,
    color: theme.colors.primaryText,
    opacity: 0.6,
    fontSize: '16px',
  };

  const hasNoTasks = tasks.length === 0;
  const allTasksCompleted = tasks.length > 0 && incompleteTasks.length === 0;

  // Hide entire component if no tasks
  if (hasNoTasks) return null;

  return (
    <div>
      {/* SECTION: SHOW CURRENT TASK */}
      {!allTasksCompleted && currentTask && (
        <Card>
          {/* Current Task UI */}
          <div style={{ fontSize: 32, fontWeight: 600, marginTop: theme.spacing.lg, textAlign: 'center' }}>
            {currentTask.text}
          </div>

          <div style={{ opacity: 0.6, marginBottom: theme.spacing.lg, textAlign: 'center' }}>
            Ready?
          </div>

          {/* Done button */}
          <button
            style={{
              width: "100%",
              padding: theme.spacing.md,
              background: theme.gradient,
              color: theme.colors.white,
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: 18,
              fontWeight: 600,
            }}
            onClick={handleDone}
          >
            ✓ Done
          </button>

          {/* I feel overwhelmed button */}
          <button
            style={{
              marginTop: theme.spacing.md,
              width: "100%",
              padding: theme.spacing.md,
              backgroundColor: '#F0F4FF',
              border: `2px solid ${theme.colors.primaryBlue}`,
              borderRadius: theme.borderRadius.md,
              fontSize: 16,
              fontWeight: 500,
              color: theme.colors.primaryText,
              cursor: 'pointer',
            }}
            onClick={() => setIsOverwhelmedModalOpen(true)}
          >
            💗 I feel overwhelmed
          </button>

          <OverwhelmedModal
            isOpen={isOverwhelmedModalOpen}
            onClose={() => setIsOverwhelmedModalOpen(false)}
            onSnooze={handleSnooze}
            onTryAnyway={handleTryAnyway}
          />
        </Card>
      )}

      {/* SECTION: ALL TASKS COMPLETED */}
      {allTasksCompleted && (
        <Card>
          <div style={emptyStateStyle}>
            🎉 All tasks completed! Great job!
          </div>
        </Card>
      )}
    </div>
  );
};

export default TodoList;
