import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const TaskInput = ({ onAddTask, energyLevel }) => { // TODO: energyLevel unused, will be used for AI task complexity analysis
  const [taskText, setTaskText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [adhdTips, setAdhdTips] = useState([]);

  // Mock ADHD tips generator - will be replaced with actual AI service later
  const generateAdhdTips = (text, difficulty) => {
    const tips = [];
    
    // Always include timer tip
    tips.push('Set timer to prevent time blindness');
    
    // Add tips based on difficulty
    if (difficulty === 'Hard') {
      tips.push('Break it down more if it feels too big');
    } else if (difficulty === 'Medium') {
      tips.push('Break it down more if it feels too big');
    }
    
    // Add additional tips based on task content
    const lowerText = text.toLowerCase();
    if (lowerText.includes('clean') || lowerText.includes('organize')) {
      tips.push('Start with one small area first');
    }
    if (lowerText.includes('study') || lowerText.includes('read') || lowerText.includes('work')) {
      tips.push('Use the Pomodoro technique');
    }
    
    // Ensure we have at least 2 tips
    if (tips.length < 2) {
      tips.push('Break it down more if it feels too big');
    }
    
    return tips.slice(0, 2); // Return max 2 tips
  };

  // Mock AI analysis function - will be replaced with actual AI service later
  const analyzeTask = (text) => {
    if (!text.trim()) {
      setAnalysisData(null);
      setAdhdTips([]);
      return;
    }

    // Simple mock analysis based on text length and content
    const textLength = text.length;
    let difficulty = 'Easy';
    let time = '5m';
    let xpReward = 10;

    if (textLength > 50 || text.toLowerCase().includes('complex') || text.toLowerCase().includes('difficult')) {
      difficulty = 'Hard';
      time = '30m';
      xpReward = 30;
    } else if (textLength > 20 || text.toLowerCase().includes('medium')) {
      difficulty = 'Medium';
      time = '15m';
      xpReward = 20;
    }

    setAnalysisData({
      difficulty,
      time,
      xpReward,
    });

    // Generate ADHD tips
    const tips = generateAdhdTips(text, difficulty);
    setAdhdTips(tips);
  };

  // Analyze task as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      analyzeTask(taskText);
    }, 300); // Debounce analysis

    return () => clearTimeout(timeoutId);
  }, [taskText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = taskText.trim();
    if (!trimmed) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis - replace with actual AI service later
      await new Promise(resolve => setTimeout(resolve, 800));
      onAddTask(trimmed);
      setTaskText('');
      setAnalysisData(null);
      setAdhdTips([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  };

  const inputContainerStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
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

  const dropdownCardStyle = {
    background: theme.gradient, // Same gradient as MotivationalQuote
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm, // Add spacing between cards
    animation: 'slideDownFadeIn 0.3s ease-out',
  };

  const tipsCardStyle = {
    backgroundColor: '#E0F2FE', // Light blue background
    padding: theme.spacing.md,
    marginTop: 0,
    marginBottom: 0, // Override Card's default marginBottom
    animation: 'slideDownFadeIn 0.3s ease-out',
  };

  // Add keyframe animation styles
  const animationStyle = `
    @keyframes slideDownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const dropdownHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
  };

  const analysisRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  };

  const analysisLabelStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    minWidth: '80px',
  };

  const analysisValueStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.primaryText,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };

  const tipItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    fontSize: '14px',
    color: theme.colors.primaryText,
  };

  return (
    <>
      <style>{animationStyle}</style>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputContainerStyle}>
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
        </div>
      </form>
      
      {taskText.trim() && analysisData && (
        <>
          <Card style={dropdownCardStyle}>
            <div style={dropdownHeaderStyle}>
              <span>✨</span>
              <span>AI Auto-Analysis</span>
            </div>
            <div style={analysisRowStyle}>
              <span style={analysisLabelStyle}>Difficulty:</span>
              <span style={analysisValueStyle}>
                {analysisData.difficulty} 🌱
              </span>
            </div>
            <div style={analysisRowStyle}>
              <span style={analysisLabelStyle}>Time:</span>
              <span style={analysisValueStyle}>
                {analysisData.time} 🕐
              </span>
            </div>
            <div style={analysisRowStyle}>
              <span style={analysisLabelStyle}>XP Reward:</span>
              <span style={analysisValueStyle}>
                +{analysisData.xpReward} ⚡
              </span>
            </div>
          </Card>
          
          {adhdTips.length > 0 && (
            <Card style={tipsCardStyle}>
              <div style={dropdownHeaderStyle}>
                <span>✨</span>
                <span>ADHD Tips for this task</span>
              </div>
              {adhdTips.map((tip, index) => (
                <div key={index} style={tipItemStyle}>
                  <span>💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default TaskInput;
