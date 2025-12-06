import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import MotivationalQuote from './MotivationalQuote';
import MoodStatus from './MoodStatus';
import TodoList from './TodoList';
import FocusTools from './FocusTools';
import { theme } from '../../styles/theme';

const Dashboard = ({ taskFeeling, energyLevel }) => {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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
        <MoodStatus taskFeeling={taskFeeling} energyLevel={energyLevel} />
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
