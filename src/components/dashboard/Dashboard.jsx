import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import MotivationalQuote from './MotivationalQuote';
import MoodStatus from './MoodStatus';
import TodoList from './TodoList';
import FocusTools from './FocusTools';
import TaskInput from './TaskInput';
import SnoozedTasks from './SnoozedTasks';
import Card from '../common/Card';
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
          // Clean up any invalid or expired snoozed tasks
          const now = Date.now();
          const cleanedTasks = parsed.map(task => {
            // Remove snoozedUntil from all tasks on load to clear any hardcoded/test data
            // Users can snooze tasks again if needed
            if (task.snoozedUntil) {
              const { snoozedUntil: _, ...taskWithoutSnooze } = task;
              return taskWithoutSnooze;
            }
            return task;
          });
          
          // Save cleaned tasks back to localStorage to remove expired snoozes permanently
          const hasChanges = cleanedTasks.length !== parsed.length || 
            cleanedTasks.some((task, index) => {
              const original = parsed[index];
              return original && original.snoozedUntil && !task.snoozedUntil;
            });
          
          if (hasChanges) {
            localStorage.setItem('tasks', JSON.stringify(cleanedTasks));
          }
          
          setTasks(cleanedTasks);
        }
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('tasks');
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
    // Support both single task and array of tasks
    const taskTexts = Array.isArray(taskText) ? taskText : [taskText];
    
    // Generate unique IDs using timestamp + random + index to ensure uniqueness
    // Use a single timestamp base to ensure all tasks from the same batch are grouped
    const baseId = Date.now();
    const newTasks = taskTexts.map((text, index) => ({
      id: `${baseId}-${index}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique IDs with order preserved
      text: text,
      completed: false,
      complexity: assessComplexity(text, energyLevel),
    }));
    
    // Use functional update to ensure we're working with the latest state
    setTasks(prevTasks => {
      // Add new tasks to the end, preserving order
      return [...prevTasks, ...newTasks];
    });
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleReorderTasks = (taskIds) => {
    // Reorder tasks based on provided array of IDs
    const taskMap = new Map(tasks.map(task => [task.id, task]));
    const reorderedTasks = taskIds.map(id => taskMap.get(id)).filter(Boolean);
    // Add any tasks that weren't in the reorder list (shouldn't happen, but safety check)
    const allTaskIds = new Set(taskIds);
    const remainingTasks = tasks.filter(task => !allTaskIds.has(task.id));
    setTasks([...reorderedTasks, ...remainingTasks]);
  };

  const handleSwapTask = () => {
    // Move current task to the end of the list
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length > 1) {
      const currentTask = incompleteTasks[0];
      const otherTasks = incompleteTasks.slice(1);
      const completedTasks = tasks.filter(task => task.completed);
      const newOrder = [...otherTasks, currentTask, ...completedTasks].map(t => t.id);
      handleReorderTasks(newOrder);
    }
  };

  const handleSnoozeTask = (taskId, minutes = 60) => {
    // Snooze task for specified minutes (default 1 hour)
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, snoozedUntil } : task
    ));
  };

  const handleWakeUpTask = (taskId) => {
    // Remove snooze by clearing snoozedUntil
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, snoozedUntil: null } : task
    ));
  };

  // Auto-wake snoozed tasks when their time expires
  useEffect(() => {
    const checkSnoozedTasks = () => {
      const now = Date.now();
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.snoozedUntil) {
          const snoozedUntil = new Date(task.snoozedUntil).getTime();
          if (snoozedUntil <= now) {
            // Auto-wake if time has passed
            return { ...task, snoozedUntil: null };
          }
        }
        return task;
      }));
    };

    // Check immediately
    checkSnoozedTasks();
    
    // Check every minute
    const interval = setInterval(checkSnoozedTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter tasks into active and snoozed
  const now = Date.now();
  const activeTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.snoozedUntil) return true;
    const snoozedUntil = new Date(task.snoozedUntil).getTime();
    return snoozedUntil <= now; // Auto-wake if time has passed
  });

  const snoozedTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.snoozedUntil) return false;
    const snoozedUntil = new Date(task.snoozedUntil).getTime();
    return snoozedUntil > now; // Still snoozed
  });

  // Simple complexity assessment - will be replaced with AI later
  const assessComplexity = (taskText, energyLevel) => {
    const wordCount = taskText.split(' ').length;
    if (wordCount > 10) return 'high';
    if (wordCount > 5) return 'medium';
    return 'low';
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #E3F2FD 0%, #E8EAF6 50%, #FFF3E0 100%)',
    backgroundAttachment: 'fixed',
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
        <SnoozedTasks
          snoozedTasks={snoozedTasks}
          onWakeUp={handleWakeUpTask}
        />
        <TodoList
          tasks={activeTasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onReorderTasks={handleReorderTasks}
          onSnooze={handleSnoozeTask}
        />
        {/* Show "Add New Task" only when there are no active tasks */}
        {activeTasks.length === 0 && (
          <Card>
            <div style={{ ...theme.typography.h2, color: theme.colors.primaryText, marginBottom: theme.spacing.md, display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
              <span>➕</span>
              <span>Add New Task</span>
            </div>
            <TaskInput onAddTask={handleAddTask} energyLevel={energyLevel} />
          </Card>
        )}
        <FocusTools />
      </div>
    </div>
  );
};

export default Dashboard;
