import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import MotivationalQuote from './MotivationalQuote';
import MoodStatus from './MoodStatus';
import TodoList from './TodoList';
import FocusTools from './FocusTools';
import { theme } from '../../styles/theme';

const Dashboard = ({ taskFeeling, energyLevel, onUpdateTaskFeeling, onUpdateEnergyLevel }) => {
  const [tasks, setTasks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        // Validate that parsed data is an array
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  // Save tasks to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (hasLoaded) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
    }
  }, [tasks, hasLoaded]);

  const handleAddTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      complexity: assessComplexity(taskText, energyLevel),
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Simple complexity assessment - will be replaced with AI later
  const assessComplexity = (taskText, energyLevel) => {
    const wordCount = taskText.split(' ').length;
    if (wordCount > 10) return 'high';
    if (wordCount > 5) return 'medium';
    return 'low';
  };

  const containerStyle = {
    minHeight: '100vh',
    background: theme.colors.background,
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing.lg,
  };

  return (
    <div style={containerStyle}>
      <Header />
      <div style={contentStyle}>
        <MotivationalQuote />
        <MoodStatus
          taskFeeling={taskFeeling}
          energyLevel={energyLevel}
          onUpdateTaskFeeling={onUpdateTaskFeeling}
          onUpdateEnergyLevel={onUpdateEnergyLevel}
        />
        <TodoList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
        <FocusTools />
      </div>
    </div>
  );
};

export default Dashboard;
