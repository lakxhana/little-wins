import React, { useEffect, useState } from 'react';
import { theme } from '../../styles/theme';

const Celebration = ({ show, onComplete, type = 'task' }) => {
  const [particles, setParticles] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (show) {
      // Create confetti particles
      const newParticles = [];
      const colors = [
        theme.colors.primaryBlue,
        theme.colors.primaryBlueLight,
        theme.colors.sandy,
        theme.colors.peach,
        '#FFD700',
        '#FF6B6B',
        '#4ECDC4',
      ];

      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          duration: Math.random() * 2 + 2,
          delay: Math.random() * 0.5,
        });
      }
      setParticles(newParticles);
      setShowMessage(true);

      // Hide after animation
      const timer = setTimeout(() => {
        setShowMessage(false);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const messages = {
    task: ['🎉 Amazing!', '✨ You did it!', '🌟 Great job!'],
    level: ['🚀 Level Up!', '⭐ You leveled up!', '🎊 Congratulations!'],
    streak: ['🔥 On fire!', '💪 Streak!', '⚡ Keep going!'],
  };

  const message = messages[type]?.[Math.floor(Math.random() * messages[type].length)] || messages.task[0];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: `confettiFall ${particle.duration}s ease-out ${particle.delay}s forwards`,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
          }}
        />
      ))}

      {/* Celebration message */}
      {showMessage && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            fontWeight: 'bold',
            color: theme.colors.primaryBlue,
            textAlign: 'center',
            animation: 'celebratePop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            textShadow: `0 4px 20px rgba(91, 143, 163, 0.3)`,
            pointerEvents: 'none',
          }}
        >
          {message}
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes celebratePop {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Celebration;

