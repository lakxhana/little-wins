import React, { useState } from 'react';
import Header from '../common/Header';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const Settings = () => {
  const [timerSoundsEnabled, setTimerSoundsEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState('Soft Bell');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Sound generation functions using Web Audio API
  const playSoftBell = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bell-like frequency with harmonics
      oscillator.frequency.value = 784; // G5 note
      oscillator.type = 'sine';

      // Quick attack, gentle decay
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
    } catch (error) {
      console.error('Error playing Soft Bell:', error);
    }
  };

  const playGentleChime = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Play a gentle ascending chime pattern
      const frequencies = [880, 1100, 1320]; // A5, C#6, E6
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + (index * 0.15);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.2);

        oscillator.start(startTime);
        oscillator.stop(startTime + 1.2);
      });
    } catch (error) {
      console.error('Error playing Gentle Chime:', error);
    }
  };

  const playPeacefulGong = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Deep, resonant gong frequency
      oscillator.frequency.value = 147; // D3 note
      oscillator.type = 'sine';

      // Slow attack, long decay for gong effect
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2.5);
    } catch (error) {
      console.error('Error playing Peaceful Gong:', error);
    }
  };

  const playSingingBowls = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a harmonic series for singing bowl effect (Tibetan singing bowl frequencies)
      const frequencies = [220, 330, 440, 550, 660]; // A3 and harmonics
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime;

        // Lower volume for higher harmonics to create a more natural sound
        const volume = 0.2 / Math.pow(index + 1, 1.2);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 4);
      });
    } catch (error) {
      console.error('Error playing Singing Bowls:', error);
    }
  };

  const playSound = (soundType) => {
    try {
      switch (soundType) {
        case 'Soft Bell':
          playSoftBell();
          break;
        case 'Gentle Chime':
          playGentleChime();
          break;
        case 'Peaceful Gong':
          playPeacefulGong();
          break;
        case 'Singing Bowls':
          playSingingBowls();
          break;
        default:
          playSoftBell();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: theme.colors.background,
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing.lg,
  };

  const sectionCardStyle = {
    marginBottom: theme.spacing.lg,
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  };

  const sectionTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    fontSize: '16px',
    fontWeight: 'bold',
    color: theme.colors.primaryText,
    margin: 0,
  };

  const iconStyle = {
    fontSize: '20px',
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onToggle }) => {
    const toggleStyle = {
      width: '48px',
      height: '28px',
      borderRadius: theme.borderRadius.full,
      background: enabled ? theme.colors.primaryBlue : '#E0E0E0',
      position: 'relative',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      border: 'none',
      padding: 0,
    };

    const toggleCircleStyle = {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: theme.colors.white,
      position: 'absolute',
      top: '2px',
      left: enabled ? '22px' : '2px',
      transition: theme.transitions.normal,
      boxShadow: theme.shadows.sm,
    };

    return (
      <button
        style={toggleStyle}
        onClick={onToggle}
        role="switch"
        aria-checked={enabled}
      >
        <div style={toggleCircleStyle} />
      </button>
    );
  };

  // Sound Selection Component
  const SoundSelection = ({ selected, onSelect }) => {
    const sounds = [
      { id: 'Soft Bell', icon: '🔔', color: '#FFD700' },
      { id: 'Gentle Chime', icon: '🎐', color: theme.colors.lightBlue },
      { id: 'Peaceful Gong', icon: '🎵', color: theme.colors.primaryText },
      { id: 'Singing Bowls', icon: '🧘', color: theme.colors.primaryOrange },
    ];

    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    };

    const soundOptionStyle = (sound) => ({
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${selected === sound.id ? theme.colors.primaryBlue : '#E0E0E0'}`,
      background: selected === sound.id ? theme.colors.lightBlue : theme.colors.white,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.sm,
      transition: theme.transitions.normal,
    });

    const soundIconStyle = {
      fontSize: '32px',
    };

    const soundLabelStyle = {
      fontSize: '14px',
      fontWeight: '500',
      color: theme.colors.primaryText,
      textAlign: 'center',
    };

    return (
      <div>
        <div style={gridStyle}>
          {sounds.map((sound) => (
            <div
              key={sound.id}
              style={soundOptionStyle(sound)}
              onClick={() => onSelect(sound.id)}
            >
              <div style={soundIconStyle}>{sound.icon}</div>
              <div style={soundLabelStyle}>{sound.id}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const testSoundStyle = {
    marginTop: theme.spacing.md,
    display: 'flex',
    justifyContent: 'center',
  };

  const alertBoxStyle = {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    background: '#FFF9C4',
    borderRadius: theme.borderRadius.md,
    fontSize: '14px',
    color: theme.colors.primaryText,
  };

  return (
    <div style={containerStyle}>
      <Header pageTitle="Settings" />
      <div style={contentStyle}>
        {/* Timer Sounds Section */}
        <Card style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={iconStyle}>🔊</span>
              Sound
            </h2>
            <ToggleSwitch
              enabled={timerSoundsEnabled}
              onToggle={() => setTimerSoundsEnabled(!timerSoundsEnabled)}
            />
          </div>

          {timerSoundsEnabled && (
            <>
              <SoundSelection selected={selectedSound} onSelect={setSelectedSound} />
              <div style={testSoundStyle}>
                <Button
                  onClick={() => playSound(selectedSound)}
                  variant="outline"
                >
                  🔔 Test Sound
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Notifications Section */}
        <Card style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>
              <span style={iconStyle}>🔔</span>
              Notifications
            </h2>
            <ToggleSwitch
              enabled={notificationsEnabled}
              onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>

          {notificationsEnabled && (
            <div style={alertBoxStyle}>
              Enable notifications in browser settings
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Settings;

