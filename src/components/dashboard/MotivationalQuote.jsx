import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import { theme } from '../../styles/theme';

const MotivationalQuote = () => {
  // Placeholder quotes - will be replaced with AI-generated ones
  const quotes = [
    "Small steps forward are still progress. You've got this!",
    "Every completed task is a victory, no matter how small.",
    "Your pace is perfect. Keep moving forward.",
    "Breaking things down isn't weakness, it's wisdom.",
    "Today's small win is tomorrow's foundation.",
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const refreshQuote = () => {
    setIsLoading(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Simulate AI call - replace with actual AI service later
    timeoutRef.current = setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsLoading(false);
      timeoutRef.current = null;
    }, 500);
  };

  const quoteStyle = {
    fontSize: '18px',
    fontStyle: 'italic',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    lineHeight: '1.6',
    textAlign: 'center',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
  };

  const refreshButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: theme.spacing.xs,
    transition: theme.transitions.fast,
  };

  return (
    <Card gradient>
      <div style={headerStyle}>
        <div style={titleStyle}>✨ Hey! Kind reminder 💙</div>
        <button
          style={refreshButtonStyle}
          onClick={refreshQuote}
          disabled={isLoading}
          aria-label="Refresh quote"
        >
          🔄
        </button>
      </div>
      <div style={quoteStyle}>
        {isLoading ? 'Loading...' : `"${currentQuote}"`}
      </div>
    </Card>
  );
};

export default MotivationalQuote;
