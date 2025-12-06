import React, { useState, useEffect, useRef } from 'react';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const TaskWarrior = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [focus, setFocus] = useState(50);
  const [energy, setEnergy] = useState(100);
  const [momentum, setMomentum] = useState(10);
  const [consecutiveCompletions, setConsecutiveCompletions] = useState(0);
  const [recentTaskComplexities, setRecentTaskComplexities] = useState([]);
  
  // Refs to track current values for checking reset condition
  const focusRef = useRef(focus);
  const energyRef = useRef(energy);
  const momentumRef = useRef(momentum);
  const XP_PER_LEVEL = 100;
  const FOCUS_MAX = 100;
  const FOCUS_MIN = 0;
  const ENERGY_MAX = 100;
  const ENERGY_MIN = 0;
  const MOMENTUM_MAX = 100;
  const MOMENTUM_MIN = 0;
  const RECENT_TASKS_TO_TRACK = 5; // Track last 5 tasks for consistency check

  // Load XP, level, focus, energy, and momentum from localStorage on mount
  useEffect(() => {
    try {
      const savedXp = localStorage.getItem('taskWarriorXp');
      const savedLevel = localStorage.getItem('taskWarriorLevel');
      const savedFocus = localStorage.getItem('taskWarriorFocus');
      const savedEnergy = localStorage.getItem('taskWarriorEnergy');
      const savedMomentum = localStorage.getItem('taskWarriorMomentum');
      const savedConsecutive = localStorage.getItem('taskWarriorConsecutive');
      const savedRecentComplexities = localStorage.getItem('taskWarriorRecentComplexities');
      
      if (savedXp !== null) {
        setXp(parseInt(savedXp, 10));
      }
      if (savedLevel !== null) {
        setLevel(parseInt(savedLevel, 10));
      }
      if (savedFocus !== null) {
        const focusValue = parseInt(savedFocus, 10);
        setFocus(focusValue);
        focusRef.current = focusValue;
      }
      if (savedEnergy !== null) {
        const energyValue = parseInt(savedEnergy, 10);
        setEnergy(energyValue);
        energyRef.current = energyValue;
      }
      if (savedMomentum !== null) {
        const momentumValue = parseInt(savedMomentum, 10);
        setMomentum(momentumValue);
        momentumRef.current = momentumValue;
      }
      if (savedConsecutive !== null) {
        setConsecutiveCompletions(parseInt(savedConsecutive, 10));
      }
      if (savedRecentComplexities) {
        try {
          const parsed = JSON.parse(savedRecentComplexities);
          if (Array.isArray(parsed)) {
            setRecentTaskComplexities(parsed);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error) {
      console.error('Failed to load TaskWarrior data from localStorage:', error);
    }
  }, []);

  // Update refs whenever state changes
  useEffect(() => {
    focusRef.current = focus;
    energyRef.current = energy;
    momentumRef.current = momentum;
  }, [focus, energy, momentum]);

  // Save XP, level, focus, energy, momentum, and tracking data to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('taskWarriorXp', xp.toString());
      localStorage.setItem('taskWarriorLevel', level.toString());
      localStorage.setItem('taskWarriorFocus', focus.toString());
      localStorage.setItem('taskWarriorEnergy', energy.toString());
      localStorage.setItem('taskWarriorMomentum', momentum.toString());
      localStorage.setItem('taskWarriorConsecutive', consecutiveCompletions.toString());
      localStorage.setItem('taskWarriorRecentComplexities', JSON.stringify(recentTaskComplexities));
    } catch (error) {
      console.error('Failed to save TaskWarrior data to localStorage:', error);
    }
  }, [xp, level, focus, energy, momentum, consecutiveCompletions, recentTaskComplexities]);

  // Listen for task completion events
  useEffect(() => {
    const handleTaskCompleted = (event) => {
      const taskComplexity = event.detail?.complexity || 'low';
      const taskStartTime = event.detail?.startTime || null;
      const completionTime = Date.now();
      
      // Check if all metrics are at 100 before updates using refs
      const shouldResetMetrics = focusRef.current === 100 && 
                                  energyRef.current === 100 && 
                                  momentumRef.current === 100;
      
      // Calculate expected time based on complexity (in milliseconds)
      const getExpectedTime = (complexity) => {
        switch (complexity) {
          case 'high': return 25 * 60 * 1000; // 25 minutes
          case 'medium': return 12.5 * 60 * 1000; // 12.5 minutes
          case 'low': return 3.5 * 60 * 1000; // 3.5 minutes
          default: return 3.5 * 60 * 1000;
        }
      };

      const expectedTime = getExpectedTime(taskComplexity);
      const actualTime = taskStartTime ? (completionTime - taskStartTime) : null;
      const completedEarly = actualTime && actualTime < expectedTime;
      const completedFast = actualTime && actualTime < (expectedTime * 0.7); // 30% faster than expected
      
      // Update XP - use the xpReward from the task, default to 1 if not provided
      const xpReward = event.detail?.xpReward || 1;
      setXp(prevXp => {
        const newXp = prevXp + xpReward;
        // Check if we should level up (may level up multiple times if XP reward is large)
        let remainingXp = newXp;
        let levelsGained = 0;
        while (remainingXp >= XP_PER_LEVEL) {
          levelsGained++;
          remainingXp -= XP_PER_LEVEL;
        }
        if (levelsGained > 0) {
          setLevel(prevLevel => prevLevel + levelsGained);
        }
        return remainingXp;
      });

      // Update consecutive completions and track previous value for Momentum calculation
      let previousConsecutive = 0;
      setConsecutiveCompletions(prev => {
        previousConsecutive = prev;
        const newConsecutive = prev + 1;
        
        // If two tasks completed in a row, increase Focus
        if (newConsecutive >= 2) {
          setFocus(prevFocus => {
            const newFocus = Math.min(prevFocus + 5, FOCUS_MAX);
            return newFocus;
          });
        }
        
        // Update Momentum when streak grows
        if (newConsecutive > previousConsecutive && newConsecutive > 1) {
          // Streak grew
          setMomentum(prevMomentum => {
            const newMomentum = Math.min(prevMomentum + 5, MOMENTUM_MAX);
            return newMomentum;
          });
        }
        
        return newConsecutive;
      });

      // Update Energy
      // Energy increases when: 1) Task completed early, 2) High complexity task completed
      if (completedEarly) {
        setEnergy(prevEnergy => {
          const newEnergy = Math.min(prevEnergy + 8, ENERGY_MAX);
          return newEnergy;
        });
      }
      
      if (taskComplexity === 'high') {
        setEnergy(prevEnergy => {
          const newEnergy = Math.min(prevEnergy + 10, ENERGY_MAX);
          return newEnergy;
        });
      }

      // Update Momentum when task completed faster than expected
      if (completedFast) {
        setMomentum(prevMomentum => {
          const newMomentum = Math.min(prevMomentum + 7, MOMENTUM_MAX);
          return newMomentum;
        });
      }

      // Track recent task complexities
      setRecentTaskComplexities(prev => {
        const updated = [...prev, taskComplexity];
        // Keep only the last N tasks
        const trimmed = updated.slice(-RECENT_TASKS_TO_TRACK);
        
        // Check if user is sticking to easier tasks consistently
        // If last 3+ tasks are all "low" complexity, increase Focus
        if (trimmed.length >= 3) {
          const lastThree = trimmed.slice(-3);
          const allLow = lastThree.every(complexity => complexity === 'low');
          
          if (allLow) {
            setFocus(prevFocus => {
              const newFocus = Math.min(prevFocus + 3, FOCUS_MAX);
              return newFocus;
            });
          }
        }
        
        return trimmed;
      });

      // Reset metrics to 1 if they were all at 100 before this task completion
      // Use setTimeout to ensure this happens after all state updates are processed
      if (shouldResetMetrics) {
        setTimeout(() => {
          setFocus(1);
          setEnergy(1);
          setMomentum(1);
        }, 0);
      }
    };

    // Listen for custom event dispatched when a task is completed
    window.addEventListener('taskCompleted', handleTaskCompleted);
    return () => {
      window.removeEventListener('taskCompleted', handleTaskCompleted);
    };
  }, []);

  // Reset consecutive completions when a task is uncompleted
  useEffect(() => {
    const handleTaskUncompleted = () => {
      setConsecutiveCompletions(0);
    };

    window.addEventListener('taskUncompleted', handleTaskUncompleted);
    return () => {
      window.removeEventListener('taskUncompleted', handleTaskUncompleted);
    };
  }, []);

  const currentXp = xp;
  const xpForNextLevel = XP_PER_LEVEL;
  const xpPercentage = (currentXp / xpForNextLevel) * 100;
  const xpNeeded = xpForNextLevel - currentXp;

  // Get Focus status text based on value
  const getFocusStatus = (focusValue) => {
    if (focusValue >= 90) return { text: 'Legendary', emoji: '🔥' };
    if (focusValue >= 70) return { text: 'Excellent', emoji: '⭐' };
    if (focusValue >= 50) return { text: 'Good', emoji: '✨' };
    if (focusValue >= 30) return { text: 'Fair', emoji: '💫' };
    return { text: 'Starting', emoji: '⚡' };
  };

  // Get Energy status text based on value
  const getEnergyStatus = (energyValue) => {
    if (energyValue >= 90) return { text: 'Legendary', emoji: '🔥' };
    if (energyValue >= 70) return { text: 'Excellent', emoji: '⭐' };
    if (energyValue >= 50) return { text: 'Good', emoji: '✨' };
    if (energyValue >= 30) return { text: 'Fair', emoji: '💫' };
    return { text: 'Low', emoji: '🍃' };
  };

  // Get Momentum status text based on value
  const getMomentumStatus = (momentumValue) => {
    if (momentumValue >= 90) return { text: 'Unstoppable', emoji: '🚀' };
    if (momentumValue >= 70) return { text: 'Strong', emoji: '💪' };
    if (momentumValue >= 50) return { text: 'Building', emoji: '⚡' };
    if (momentumValue >= 30) return { text: 'Growing', emoji: '📈' };
    return { text: 'Starting', emoji: '⚡' };
  };

  const focusStatus = getFocusStatus(focus);
  const focusPercentage = focus;
  const energyStatus = getEnergyStatus(energy);
  const energyPercentage = energy;
  const momentumStatus = getMomentumStatus(momentum);
  const momentumPercentage = momentum;
  const characterSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  };

  const characterIconStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.colors.primaryBlueLight} 0%, ${theme.colors.primaryBlue} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: theme.spacing.md,
    fontSize: '24px',
  };

  const levelBadgeStyle = {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    background: theme.colors.primaryBlueDark,
    color: theme.colors.white,
    borderRadius: theme.borderRadius.full,
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '600',
    border: `2px solid ${theme.colors.white}`,
  };

  const characterInfoStyle = {
    flex: 1,
  };

  const characterTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  };

  const xpBarContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const xpBarStyle = {
    flex: 1,
    height: '8px',
    background: '#E0E0E0',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  };

  const xpBarFillStyle = {
    height: '100%',
    width: `${xpPercentage}%`,
    background: `linear-gradient(90deg, ${theme.colors.primaryBlue} 0%, ${theme.colors.primaryBlueLight} 100%)`,
    borderRadius: theme.borderRadius.full,
    transition: 'width 0.3s ease-in-out',
  };

  const xpTextStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    fontWeight: '500',
    whiteSpace: 'nowrap',
  };

  const statsSectionStyle = {
    marginBottom: theme.spacing.lg,
  };

  const statsTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing.md,
  };

  const statCardStyle = (borderColor) => ({
    background: theme.colors.white,
    border: `2px solid ${borderColor}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    textAlign: 'center',
  });

  const statIconStyle = {
    fontSize: '20px',
    marginBottom: theme.spacing.xs,
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  };

  const statValueStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  };

  const statStatusStyle = {
    fontSize: '12px',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  };

  const statProgressBarStyle = {
    height: '4px',
    background: '#E0E0E0',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    marginTop: theme.spacing.xs,
  };

  const statProgressFillStyle = (percentage, color) => ({
    height: '100%',
    width: `${percentage}%`,
    background: color,
    borderRadius: theme.borderRadius.full,
  });

  const streakBannerStyle = {
    background: `linear-gradient(90deg, ${theme.colors.primaryBlue} 0%, ${theme.colors.primaryBlueLight} 100%)`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  };

  const streakItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const streakLabelStyle = {
    fontSize: '12px',
    color: theme.colors.primaryText,
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const streakValueStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.white,
  };

  const messageStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    textAlign: 'center',
    fontStyle: 'italic',
  };

  return (
    <Card>
      {/* Character Section */}
      <div style={characterSectionStyle}>
        <div style={characterIconStyle}>
          ⚔️
          <div style={levelBadgeStyle}>Lv {level}</div>
        </div>
        <div style={characterInfoStyle}>
          <div style={characterTitleStyle}>Task Warrior</div>
          <div style={xpBarContainerStyle}>
            <div style={xpBarStyle}>
              <div style={xpBarFillStyle}></div>
            </div>
            <div style={xpTextStyle}>{currentXp} / {xpForNextLevel} XP</div>
            <div style={xpTextStyle}>{xpNeeded} to Lv {level + 1}</div>
          </div>
        </div>
      </div>

      {/* Character Stats */}
      <div style={statsSectionStyle}>
        <div style={statsTitleStyle}>
          ⭐ Character Stats
        </div>
        <div style={statsGridStyle}>
          {/* Focus Stat */}
          <div style={statCardStyle('#ADD8E6')}>
            <div style={statLabelStyle}>
              ⚡ Focus
            </div>
            <div style={statValueStyle}>{focus}</div>
            <div style={statStatusStyle}>
              {focusStatus.text} {focusStatus.emoji}
            </div>
            <div style={statProgressBarStyle}>
              <div style={statProgressFillStyle(focusPercentage, '#ADD8E6')}></div>
            </div>
          </div>

          {/* Energy Stat */}
          <div style={statCardStyle('#B4EEB4')}>
            <div style={statLabelStyle}>
              🍃 Energy
            </div>
            <div style={statValueStyle}>{energy}</div>
            <div style={statStatusStyle}>
              {energyStatus.text} {energyStatus.emoji}
            </div>
            <div style={statProgressBarStyle}>
              <div style={statProgressFillStyle(energyPercentage, '#B4EEB4')}></div>
            </div>
          </div>

          {/* Momentum Stat */}
          <div style={statCardStyle(theme.colors.primaryBlue)}>
            <div style={statLabelStyle}>
              ⇄ Momentum
            </div>
            <div style={statValueStyle}>{momentum}</div>
            <div style={statStatusStyle}>
              {momentumStatus.text} {momentumStatus.emoji}
            </div>
            <div style={statProgressBarStyle}>
              <div style={statProgressFillStyle(momentumPercentage, theme.colors.primaryBlue)}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div style={messageStyle}>
        Complete daily quests to earn power-ups! 🎁
      </div>
    </Card>
  );
};

export default TaskWarrior;

