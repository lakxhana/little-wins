import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { analyzeTaskWithGroq, breakDownTaskWithGroq } from '../../services/groqService';

const TaskInput = ({ onAddTask, energyLevel }) => {
  const [taskText, setTaskText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [adhdTips, setAdhdTips] = useState([]);
  const [isAnalyzingTask, setIsAnalyzingTask] = useState(false);
  const [breakdownSteps, setBreakdownSteps] = useState([]);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const analysisTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Get API key from environment variable
  const apiKey = process.env.REACT_APP_GROQ_API_KEY || '';

  // Helper function to parse time string to minutes
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const lower = timeStr.toLowerCase();
    if (lower.includes('h')) {
      const hours = parseFloat(lower.replace('h', '').trim());
      return hours * 60;
    } else if (lower.includes('m')) {
      return parseFloat(lower.replace('m', '').trim()) || 0;
    }
    return 0;
  };

  // Analyze task with Groq as user types
  const analyzeTask = async (text) => {
    if (!text.trim()) {
      setAnalysisData(null);
      setAdhdTips([]);
      return;
    }

    // Cancel previous analysis if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Only analyze if API key is available
    if (!apiKey) {
      setAnalysisData(null);
      setAdhdTips([]);
      setBreakdownSteps([]);
      setShowBreakdown(false);
      return;
    }

    setIsAnalyzingTask(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      console.log('🤖 AI: Analyzing task with Groq AI...', { task: text, energyLevel });
      const analysis = await analyzeTaskWithGroq(text, energyLevel, apiKey);
      console.log('✅ AI: Analysis complete', analysis);
      
      // Only update if not aborted
      if (!controller.signal.aborted) {
        // Check if time estimate indicates a hard task (30+ minutes)
        const timeMinutes = parseTimeToMinutes(analysis.time);
        const isHardTask = timeMinutes >= 30 || analysis.difficulty === 'Hard';
        
        // Override difficulty if time indicates hard task
        const finalDifficulty = isHardTask ? 'Hard' : analysis.difficulty;
        const finalXpReward = isHardTask ? 30 : analysis.xpReward;
        
        setAnalysisData({
          difficulty: finalDifficulty,
          time: analysis.time,
          xpReward: finalXpReward,
        });
        setAdhdTips(analysis.adhdTips);
        
        // If task is Hard (by difficulty or time), automatically break it down
        if (isHardTask && apiKey) {
          breakDownTask(text);
        } else {
          setBreakdownSteps([]);
          setShowBreakdown(false);
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Failed to analyze task:', error);
        setAnalysisData(null);
        setAdhdTips([]);
        setBreakdownSteps([]);
        setShowBreakdown(false);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsAnalyzingTask(false);
      }
      abortControllerRef.current = null;
    }
  };

  // Analyze task as user types (debounced)
  useEffect(() => {
    // Clear previous timeout
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    // Set new timeout for debounced analysis
    analysisTimeoutRef.current = setTimeout(() => {
      analyzeTask(taskText);
    }, 800); // Increased debounce for API calls

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
      // Abort any ongoing analysis when component unmounts or text changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [taskText, energyLevel]);

  const breakDownTask = async (text) => {
    if (!apiKey) {
      console.warn('No API key available for breakdown');
      return;
    }
    
    setIsBreakingDown(true);
    setShowBreakdown(true); // Show loading state immediately
    try {
      console.log('🤖 AI: Breaking down task with Groq AI...', { task: text, energyLevel });
      const steps = await breakDownTaskWithGroq(text, energyLevel, apiKey);
      console.log('✅ AI: Breakdown complete', { stepCount: steps?.length, steps });
      if (steps && steps.length > 0) {
        setBreakdownSteps(steps);
        setShowBreakdown(true);
      } else {
        console.warn('Breakdown returned empty steps');
        setBreakdownSteps([]);
        setShowBreakdown(false);
      }
    } catch (error) {
      console.error('Failed to break down task:', error);
      setBreakdownSteps([]);
      setShowBreakdown(false);
      // Show error to user
      alert('Failed to break down task. Please try again or check your API key.');
    } finally {
      setIsBreakingDown(false);
    }
  };

  const handleAddAllSteps = () => {
    // Add all steps including breaks as separate tasks in a single batch
    // Extract all step texts in order - preserve the exact order from breakdownSteps
    const stepTexts = breakdownSteps.map(stepItem => stepItem.step);
    
    // Verify we have steps to add
    if (stepTexts.length === 0) {
      console.warn('No steps to add');
      return;
    }
    
    // Add all tasks at once - this will add them in order
    onAddTask(stepTexts);
    
    // Clear the input and analysis
    setTaskText('');
    setAnalysisData(null);
    setAdhdTips([]);
    setBreakdownSteps([]);
    setShowBreakdown(false);
  };

  const handleAddStep = (step) => {
    onAddTask(step);
  };

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
      setBreakdownSteps([]);
      setShowBreakdown(false);
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

  const warningBoxStyle = {
    backgroundColor: '#FEF3C7',
    border: '2px solid #FCD34D',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const breakdownCardStyle = {
    border: `2px solid ${theme.colors.primaryBlue}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: '#F5F3FF',
  };

  const breakdownHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  };

  const breakdownTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
  };

  const difficultyBadgeStyle = {
    backgroundColor: theme.colors.primaryOrange,
    color: 'white',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: '12px',
    fontWeight: '600',
  };

  const stepItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: 'white',
    border: `1px solid ${theme.colors.lightBlue}`,
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    transition: theme.transitions.fast,
  };

  const stepNumberStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primaryBlue,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  };

  const breakStepStyle = {
    ...stepItemStyle,
    backgroundColor: '#FFF7ED',
    border: `1px solid #FCD34D`,
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
      
      {taskText.trim() && (analysisData || isAnalyzingTask) && (
        <>
          <Card style={dropdownCardStyle}>
            <div style={dropdownHeaderStyle}>
              <span>✨</span>
              <span>AI Auto-Analysis</span>
              {isAnalyzingTask && <span style={{ fontSize: '12px', opacity: 0.7 }}>(🤖 AI Analyzing...)</span>}
              {!isAnalyzingTask && analysisData && <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '8px', color: '#10b981' }}>✓ Powered by Groq AI</span>}
            </div>
            {analysisData ? (
              <>
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
              </>
            ) : (
              <div style={{ padding: theme.spacing.sm, textAlign: 'center', opacity: 0.7 }}>
                Analyzing task...
              </div>
            )}
          </Card>
          
          {analysisData?.difficulty === 'Hard' && !showBreakdown && !isBreakingDown && (
            <Card style={warningBoxStyle}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: theme.spacing.xs }}>
                  This looks like a BIG task!
                </div>
                <div style={{ fontSize: '14px', marginBottom: theme.spacing.sm }}>
                  I strongly recommend breaking it down into smaller steps. Ready for the breakdown?
                </div>
                <Button
                  onClick={() => breakDownTask(taskText)}
                  variant="primary"
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    fontSize: '14px',
                  }}
                >
                  Break It Down
                </Button>
              </div>
            </Card>
          )}

          {analysisData?.difficulty === 'Hard' && (showBreakdown || isBreakingDown) && (
            <Card style={breakdownCardStyle}>
              <div style={breakdownHeaderStyle}>
                <div style={breakdownTitleStyle}>
                  <span>✨</span>
                  <span>AI Task Assistant</span>
                  <span style={difficultyBadgeStyle}>HARD</span>
                  {!isBreakingDown && breakdownSteps.length > 0 && <span style={{ fontSize: '10px', opacity: 0.6, marginLeft: '8px', color: '#10b981' }}>✓ Powered by Groq AI</span>}
                </div>
              </div>
              
              {isBreakingDown ? (
                <div style={{ padding: theme.spacing.md, textAlign: 'center', opacity: 0.7 }}>
                  Breaking down task into manageable steps...
                </div>
              ) : breakdownSteps.length === 0 && !isBreakingDown ? (
                <div style={{ padding: theme.spacing.md, textAlign: 'center', opacity: 0.7 }}>
                  <div style={{ marginBottom: theme.spacing.sm }}>Breakdown failed or is empty.</div>
                  <Button
                    onClick={() => breakDownTask(taskText)}
                    variant="outline"
                    style={{ fontSize: '14px' }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : breakdownSteps.length > 0 ? (
                <>
                  <div style={{ marginBottom: theme.spacing.md, fontSize: '14px', color: theme.colors.primaryText }}>
                    I've broken this down into {breakdownSteps.length} manageable steps
                  </div>
                  {breakdownSteps.map((stepItem, index) => (
                    <div
                      key={index}
                      style={stepItem.isBreak ? breakStepStyle : stepItemStyle}
                      onClick={() => handleAddStep(stepItem.step)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = stepItem.isBreak ? '#FEF3C7' : '#F0F9FF';
                        e.currentTarget.style.borderColor = stepItem.isBreak ? '#FCD34D' : theme.colors.primaryBlue;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = stepItem.isBreak ? '#FFF7ED' : 'white';
                        e.currentTarget.style.borderColor = stepItem.isBreak ? '#FCD34D' : theme.colors.lightBlue;
                      }}
                    >
                      <div style={stepNumberStyle}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1, fontSize: '14px', color: theme.colors.primaryText }}>
                        {stepItem.step}
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={handleAddAllSteps}
                    variant="primary"
                    style={{
                      width: '100%',
                      marginTop: theme.spacing.md,
                      padding: theme.spacing.md,
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    <span>✨</span>
                    <span style={{ marginLeft: theme.spacing.xs }}>Add All Steps</span>
                  </Button>
                  <div style={{ marginTop: theme.spacing.sm, fontSize: '12px', color: theme.colors.primaryText, opacity: 0.7, display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                    <span>✨</span>
                    <span>AI suggestions based on neurodivergent-friendly task management</span>
                  </div>
                </>
              ) : null}
            </Card>
          )}

          {adhdTips.length > 0 && (
            <Card style={tipsCardStyle}>
              <div style={dropdownHeaderStyle}>
                <span>💡</span>
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
