import React, { useState } from 'react';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const TaskInput = ({ onAddTask, energyLevel }) => {
  const [taskText, setTaskText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      setIsAnalyzing(true);
      // Simulate AI analysis - replace with actual AI service later
      await new Promise(resolve => setTimeout(resolve, 800));
      onAddTask(taskText);
      setTaskText('');
      setIsAnalyzing(false);
    }
  };

  const formStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  };

  const inputStyle = {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `2px solid ${theme.colors.lightBlue}`,
    fontSize: '16px',
    outline: 'none',
    transition: theme.transitions.fast,
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Add a new task..."
        style={inputStyle}
        disabled={isAnalyzing}
        onFocus={(e) => e.target.style.borderColor = theme.colors.primaryBlue}
        onBlur={(e) => e.target.style.borderColor = theme.colors.lightBlue}
      />
      <Button
        type="submit"
        disabled={!taskText.trim() || isAnalyzing}
        style={{ whiteSpace: 'nowrap' }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Add Task'}
      </Button>
    </form>
  );
};

export default TaskInput;
