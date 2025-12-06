import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const FocusTools = () => {
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'break'
  const [brainDump, setBrainDump] = useState('');

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

  const handleBrainDumpChange = (e) => {
    const value = e.target.value;
    setBrainDump(value);
    // Auto-save to localStorage
    localStorage.setItem('brainDump', value);
  };

  const clearBrainDump = () => {
    setBrainDump('');
    localStorage.removeItem('brainDump');
  };

  // Load brain dump from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('brainDump');
    if (saved) setBrainDump(saved);
  }, []);

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

  const textareaStyle = {
    width: '100%',
    minHeight: '120px',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    border: `2px solid ${theme.colors.lightBlue}`,
    fontSize: '14px',
    fontFamily: theme.fonts.primary,
    resize: 'vertical',
    outline: 'none',
  };

  const brainDumpHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
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
        <div style={brainDumpHeaderStyle}>
          <div style={sectionTitleStyle}>💭 Brain Dump</div>
          {brainDump && (
            <Button
              onClick={clearBrainDump}
              variant="outline"
              style={{ padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: '12px' }}
            >
              Clear
            </Button>
          )}
        </div>
        <textarea
          value={brainDump}
          onChange={handleBrainDumpChange}
          placeholder="Write whatever comes to mind... it auto-saves!"
          style={textareaStyle}
        />
      </div>
    </Card>
  );
};

export default FocusTools;
