import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { generateMotivationalQuote } from '../../services/groqService';

const MotivationalQuote = ({ taskFeeling, energyLevel }) => {
  const [currentQuote, setCurrentQuote] = useState("Small steps forward are still progress. You've got this!");
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // Get API key from environment variable
  const apiKey = process.env.REACT_APP_GROQ_API_KEY || '';

  // Load initial quote on mount and when mood/energy changes
  useEffect(() => {
    if (apiKey) {
      loadQuote();
    }
  }, [taskFeeling, energyLevel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadQuote = async () => {
    if (!apiKey) {
      return;
    }

    setIsLoading(true);
    
    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      const quote = await generateMotivationalQuote(apiKey, taskFeeling, energyLevel);
      setCurrentQuote(quote);
    } catch (error) {
      console.error('Failed to load motivational quote:', error);
      // Keep the current quote or use fallback
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const refreshQuote = () => {
    loadQuote();
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
    ...theme.typography.h3,
    color: theme.colors.primaryBlue,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
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
    <Card>
      <div style={headerStyle}>
        <div style={titleStyle}>Hey! Kind reminder 💙</div>
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
