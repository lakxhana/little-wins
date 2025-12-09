import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const FocusTools = () => {
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'break'
  const [brainDumpItems, setBrainDumpItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const { width } = useWindowSize();

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
    ...theme.typography.h2,
    color: theme.colors.primaryBlue,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const sectionTitleStyle = {
    ...theme.typography.h3,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const timerDisplayStyle = {
    fontSize: width <= 480 ? '36px' : '48px',
    fontWeight: '700',
    color: theme.colors.primaryBlue,
    textAlign: 'center',
    margin: `${theme.spacing.lg} 0`,
    fontVariantNumeric: 'tabular-nums',
  };

  const timerButtonsStyle = {
    display: 'flex',
    flexDirection: width <= 480 ? 'column' : 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  };

  const inputStyle = {
    width: '100%',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.borderGray}`,
    fontSize: '15px',
    fontFamily: theme.fonts.primary,
    color: theme.colors.primaryText,
    backgroundColor: theme.colors.white,
    outline: 'none',
    transition: theme.transitions.normal,
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: `${theme.spacing.lg} 0 0 0`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.borderGray}`,
    boxShadow: theme.shadows.sm,
    transition: theme.transitions.normal,
  };

  const itemTextStyle = {
    flex: 1,
    fontSize: '15px',
    fontWeight: '400',
    color: theme.colors.primaryText,
    marginRight: theme.spacing.md,
    lineHeight: '1.5',
    wordBreak: 'break-word',
  };

  const formStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  };

  const dividerStyle = {
    height: '1px',
    background: theme.colors.borderGray,
    margin: `${theme.spacing.xl} 0`,
    border: 'none',
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
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primaryBlue;
              e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primaryBlueLight}33`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.borderGray;
              e.target.style.boxShadow = 'none';
            }}
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
            {brainDumpItems.map((item, index) => (
              <li 
                key={item.id} 
                style={listItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primaryBlue;
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.borderGray;
                  e.currentTarget.style.boxShadow = theme.shadows.sm;
                }}
              >
                <span style={itemTextStyle}>{item.text}</span>
            <Button
                  onClick={() => handleCompleteItem(item.id)}
              variant="outline"
                  style={{ 
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`, 
                    fontSize: '13px',
                    fontWeight: '500',
                    minWidth: '80px',
                    whiteSpace: 'nowrap',
                  }}
            >
                  ✓ Done
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
