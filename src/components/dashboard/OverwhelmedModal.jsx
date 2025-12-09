import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { theme } from '../../styles/theme';

const OverwhelmedModal = ({ isOpen, onClose, onSnooze, onTryAnyway }) => {
  const [breathPhase, setBreathPhase] = useState('in'); // 'in', 'hold', 'out'
  const [breathScale, setBreathScale] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const breathCycle = () => {
      // Breathe in (3 seconds)
      setBreathPhase('in');
      setBreathScale(1.2);
      setTimeout(() => {
        // Hold (2 seconds)
        setBreathPhase('hold');
        setTimeout(() => {
          // Breathe out (4 seconds)
          setBreathPhase('out');
          setBreathScale(1);
        }, 2000);
      }, 3000);
    };

    breathCycle();
    const interval = setInterval(breathCycle, 9000); // Full cycle: 3s in + 2s hold + 4s out

    return () => clearInterval(interval);
  }, [isOpen]);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: theme.spacing.lg,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  };

  const modalStyle = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    zIndex: 10001,
    animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: theme.colors.primaryText,
    opacity: 0.6,
    padding: theme.spacing.xs,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  };

  const heartIconStyle = {
    fontSize: '48px',
    marginBottom: theme.spacing.md,
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.lg,
  };

  const breathingCardStyle = {
    backgroundColor: '#E0F2FE',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    boxShadow: theme.shadows.sm,
  };

  const breathingTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const breathingInstructionStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    opacity: 0.8,
    marginBottom: theme.spacing.md,
  };

  const circleContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    height: '120px',
  };

  const breathingCircleStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#B3E5FC',
    transition: 'transform 0.3s ease-in-out',
    transform: `scale(${breathScale})`,
  };

  const breathingPromptStyle = {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '500',
    color: theme.colors.primaryText,
  };

  const optionsTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
  };

  const optionButtonStyle = {
    width: '100%',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    border: `2px solid #E0E0E0`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    transition: theme.transitions.fast,
    textAlign: 'left',
  };

  const optionIconStyle = {
    fontSize: '24px',
  };

  const optionContentStyle = {
    flex: 1,
  };

  const optionMainTextStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  };

  const optionSubtextStyle = {
    fontSize: '13px',
    color: theme.colors.primaryText,
    opacity: 0.6,
  };

  const footerStyle = {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid #E0E0E0`,
    fontSize: '13px',
    fontStyle: 'italic',
    color: theme.colors.primaryText,
    opacity: 0.7,
    textAlign: 'center',
  };

  const getBreathingText = () => {
    switch (breathPhase) {
      case 'in':
        return 'Breathe in...';
      case 'hold':
        return 'Hold...';
      case 'out':
        return 'Breathe out...';
      default:
        return 'Breathe in...';
    }
  };

  const modalContent = (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          ×
        </button>

        <div style={headerStyle}>
          <div style={heartIconStyle}>💗</div>
          <div style={titleStyle}>It's okay to feel overwhelmed</div>
        </div>

        <div style={breathingCardStyle}>
          <div style={breathingTitleStyle}>
            <span>🌬️</span>
            <span>Take a moment</span>
          </div>
          <div style={breathingInstructionStyle}>Let's breathe together</div>
          <div style={circleContainerStyle}>
            <div style={breathingCircleStyle}></div>
          </div>
          <div style={breathingPromptStyle}>{getBreathingText()}</div>
        </div>

        <div style={optionsTitleStyle}>What would help right now?</div>

        <button
          style={optionButtonStyle}
          onClick={() => {
            onSnooze();
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primaryBlue;
            e.currentTarget.style.backgroundColor = '#F5F9FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E0E0E0';
            e.currentTarget.style.backgroundColor = theme.colors.white;
          }}
        >
          <span style={optionIconStyle}>🕐</span>
          <div style={optionContentStyle}>
            <div style={optionMainTextStyle}>Snooze this task</div>
            <div style={optionSubtextStyle}>Come back to it later</div>
          </div>
        </button>

        <button
          style={optionButtonStyle}
          onClick={() => {
            onTryAnyway();
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primaryBlue;
            e.currentTarget.style.backgroundColor = '#F5F9FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E0E0E0';
            e.currentTarget.style.backgroundColor = theme.colors.white;
          }}
        >
          <span style={optionIconStyle}>♡</span>
          <div style={optionContentStyle}>
            <div style={optionMainTextStyle}>I'll try anyway</div>
            <div style={optionSubtextStyle}>You've got this</div>
          </div>
        </button>

        <div style={footerStyle}>
          Remember: You don't have to be productive every moment. Rest is valid too.
        </div>
      </div>
    </div>
  );

  // Render modal using portal to ensure it's always on top
  return isOpen && typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default OverwhelmedModal;

