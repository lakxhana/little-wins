import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import MotivationalQuote from './MotivationalQuote';
import TaskWarrior from './TaskWarrior';
import MoodStatus from './MoodStatus';
import TodoList from './TodoList';
import FocusTools from './FocusTools';
import TaskInput from './TaskInput';
import SnoozedTasks from './SnoozedTasks';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const Dashboard = ({ taskFeeling, energyLevel, onUpdateTaskFeeling, onUpdateEnergyLevel }) => {
  const [tasks, setTasks] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [taskStartTimes, setTaskStartTimes] = useState(new Map());
  const { width } = useWindowSize();

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

  // Track when tasks become the current task (first incomplete task)
  useEffect(() => {
    if (!hasLoaded || tasks.length === 0) return;
    
    setTaskStartTimes(prev => {
      const incompleteTasks = tasks.filter(task => !task.completed);
      const currentTask = incompleteTasks.length > 0 ? incompleteTasks[0] : null;
      const newMap = new Map(prev);
      let hasChanges = false;
      
      // Add start time for current task if it doesn't have one
      if (currentTask && !newMap.has(currentTask.id)) {
        newMap.set(currentTask.id, Date.now());
        hasChanges = true;
      }
      
      // Clean up start times for completed tasks
      tasks.forEach(task => {
        if (task.completed && newMap.has(task.id)) {
          newMap.delete(task.id);
          hasChanges = true;
        }
      });
      
      return hasChanges ? newMap : prev;
    });
  }, [tasks, hasLoaded]);

  const handleAddTask = (taskText, xpReward = null) => {
    // Support both single task and array of tasks
    const taskTexts = Array.isArray(taskText) ? taskText : [taskText];
    
    // Generate unique IDs using timestamp + random + index to ensure uniqueness
    // Use a single timestamp base to ensure all tasks from the same batch are grouped
    const baseId = Date.now();
    const newTasks = taskTexts.map((text, index) => {
      // Calculate XP reward: use provided value, or default based on complexity
      const complexity = assessComplexity(text, energyLevel);
      let taskXpReward = xpReward;
      if (!taskXpReward) {
        // Default XP based on complexity if not provided
        switch (complexity) {
          case 'high': taskXpReward = 30; break;
          case 'medium': taskXpReward = 20; break;
          default: taskXpReward = 10; break;
        }
      }
      
      return {
        id: `${baseId}-${index}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique IDs with order preserved
        text: text,
      completed: false,
        complexity: complexity,
        xpReward: taskXpReward,
    };
    });
    
    // Use functional update to ensure we're working with the latest state
    setTasks(prevTasks => {
      // Add new tasks to the end, preserving order
      return [...prevTasks, ...newTasks];
    });
  };

  const handleToggleTask = (taskId) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const wasCompleted = task.completed;
          const newCompleted = !task.completed;
          
          // If task is being marked as completed (not uncompleted), trigger XP gain
          if (!wasCompleted && newCompleted) {
            // Get start time for this task
            const startTime = taskStartTimes.get(taskId) || null;
            
            // Dispatch custom event for TaskWarrior to listen to with task complexity, XP reward, and start time
            window.dispatchEvent(new CustomEvent('taskCompleted', {
              detail: { 
                complexity: task.complexity || 'low',
                xpReward: task.xpReward || 10, // Default to 10 if not set
                startTime: startTime
              }
            }));
            
            // Remove start time since task is completed
            setTaskStartTimes(prev => {
              const newMap = new Map(prev);
              newMap.delete(taskId);
              return newMap;
            });
          } else if (wasCompleted && !newCompleted) {
            // If task is being uncompleted, reset consecutive streak
            window.dispatchEvent(new CustomEvent('taskUncompleted'));
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return updatedTasks;
    });
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
    padding: width <= 480 ? theme.spacing.md : theme.spacing.lg,
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <Header pageTitle="Dashboard" />
      <div style={contentStyle}>
        <MotivationalQuote />
        <TaskWarrior />
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
