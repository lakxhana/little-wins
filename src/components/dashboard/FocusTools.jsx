import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const FocusTools = () => {
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'break'
  const [brainDumpItems, setBrainDumpItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            // Timer finished
            setIsTimerRunning(false);
            if (timerMode === 'work') {
              setTimerMode('break');
              setTimerMinutes(5);
            } else {
              setTimerMode('work');
              setTimerMinutes(25);
            }
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(timerSeconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(timerMode === 'work' ? 25 : 5);
    setTimerSeconds(0);
  };

  // Load brain dump items from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brainDumpItems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBrainDumpItems(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load brain dump items:', error);
    }
  }, []);

  // Save brain dump items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('brainDumpItems', JSON.stringify(brainDumpItems));
    } catch (error) {
      console.error('Failed to save brain dump items:', error);
    }
  }, [brainDumpItems]);

  const handleAddItem = (e) => {
    e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;

    const newItem = {
      id: Date.now(),
      text: trimmed,
    };
    setBrainDumpItems([...brainDumpItems, newItem]);
    setNewItemText('');
  };

  const handleCompleteItem = (itemId) => {
    setBrainDumpItems(brainDumpItems.filter(item => item.id !== itemId));
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.lg,
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.sm,
  };

  const timerDisplayStyle = {
    fontSize: '48px',
    fontWeight: '700',
    color: theme.colors.primaryBlue,
    textAlign: 'center',
    margin: `${theme.spacing.lg} 0`,
    fontVariantNumeric: 'tabular-nums',
  };

  const timerButtonsStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  };

  const inputStyle = {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    border: `2px solid ${theme.colors.lightBlue}`,
    fontSize: '14px',
    fontFamily: theme.fonts.primary,
    outline: 'none',
    transition: theme.transitions.fast,
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: `${theme.spacing.md} 0`,
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    background: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${theme.colors.lightBlue}`,
  };

  const itemTextStyle = {
    flex: 1,
    fontSize: '14px',
    color: theme.colors.primaryText,
    marginRight: theme.spacing.md,
  };

  const formStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  };

  const dividerStyle = {
    height: '2px',
    background: theme.colors.lightBlue,
    margin: `${theme.spacing.xl} 0`,
  };

  return (
    <Card>
      <div style={titleStyle}>🧠 ADHD Focus Tools</div>

      {/* Pomodoro Timer */}
      <div>
        <div style={sectionTitleStyle}>
          ⏱️ Pomodoro Timer {timerMode === 'work' ? '(Work)' : '(Break)'}
        </div>
        <div style={timerDisplayStyle}>
          {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
        </div>
        <div style={timerButtonsStyle}>
          <Button onClick={toggleTimer} variant="primary">
            {isTimerRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* Brain Dump */}
      <div>
        <div style={sectionTitleStyle}>💭 Brain Dump</div>
        <form onSubmit={handleAddItem} style={formStyle}>
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a thought or task..."
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primaryBlue}
            onBlur={(e) => e.target.style.borderColor = theme.colors.lightBlue}
          />
          <Button
            type="submit"
            disabled={!newItemText.trim()}
            style={{ whiteSpace: 'nowrap' }}
          >
            Add
          </Button>
        </form>
        {brainDumpItems.length > 0 && (
          <ul style={listStyle}>
            {brainDumpItems.map((item) => (
              <li key={item.id} style={listItemStyle}>
                <span style={itemTextStyle}>{item.text}</span>
                <Button
                  onClick={() => handleCompleteItem(item.id)}
                  variant="outline"
                  style={{ padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: '12px' }}
                >
                  Complete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default FocusTools;
