import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const MoodStatus = ({ taskFeeling, energyLevel, onUpdateTaskFeeling, onUpdateEnergyLevel }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('right');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'feeling' or 'energy'
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { width } = useWindowSize();

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 300; // minWidth from styles
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;

      // Position on left if not enough space on right
      if (spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth) {
        setDropdownPosition('left');
      } else {
        setDropdownPosition('right');
      }
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const feelingOptions = [
    { value: 'overwhelmed', label: '😰 Feeling Overwhelmed', desc: 'I need help managing the load' },
    { value: 'structure', label: '📋 Need Structure', desc: 'I need help with organization' },
  ];

  const energyOptions = [
    { value: 'low', label: '😴 Low Energy', desc: 'I need simple tasks' },
    { value: 'moderate', label: '😊 Moderate Energy', desc: 'I can handle regular tasks' },
    { value: 'high', label: '🚀 High Energy', desc: 'Ready for challenges' },
  ];

  const feelingLabels = {
    overwhelmed: '😰 Feeling Overwhelmed',
    structure: '📋 Need Structure',
  };

  const energyLabels = {
    low: '😴 Low Energy',
    moderate: '😊 Moderate Energy',
    high: '🚀 High Energy',
  };

  const handleFeelingClick = () => {
    setActiveDropdown(activeDropdown === 'feeling' ? null : 'feeling');
    setIsDropdownOpen(activeDropdown !== 'feeling');
  };

  const handleEnergyClick = () => {
    setActiveDropdown(activeDropdown === 'energy' ? null : 'energy');
    setIsDropdownOpen(activeDropdown !== 'energy');
  };

  const handleUpdateFeeling = (value) => {
    onUpdateTaskFeeling(value);
    setIsDropdownOpen(false);
    setActiveDropdown(null);
  };

  const handleUpdateEnergy = (value) => {
    onUpdateEnergyLevel(value);
    setIsDropdownOpen(false);
    setActiveDropdown(null);
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: width <= 480 ? '1fr' : '1fr 1fr',
    gap: theme.spacing.md,
  };

  const statusCardStyle = {
    position: 'relative',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#F9FAFB',
    border: `1px solid #E5E7EB`,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  };

  const statusCardHoverStyle = {
    backgroundColor: '#F3F4F6',
    borderColor: theme.colors.primaryBlue,
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows.sm,
  };

  const labelStyle = {
    fontSize: '11px',
    color: theme.colors.primaryText,
    opacity: 0.6,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    lineHeight: '1.4',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  };


  const dropdownContainerStyle = {
    position: 'relative',
  };

  const getDropdownStyle = () => {
    const baseStyle = {
      position: 'absolute',
      top: '100%',
      marginTop: theme.spacing.sm,
      background: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      padding: width <= 480 ? theme.spacing.md : theme.spacing.lg,
      zIndex: 1000,
      maxHeight: '500px',
      overflowY: 'auto',
      border: `1px solid #E5E7EB`,
    };

    // Mobile responsive
    if (width <= 480) {
      return {
        ...baseStyle,
        left: 0,
        right: 0,
        minWidth: 'auto',
        width: '100%',
      };
    }

    // Tablet and desktop
    const minWidth = width <= 768 ? '280px' : '320px';
    
    if (dropdownPosition === 'left') {
      return {
        ...baseStyle,
        right: 0,
        minWidth: minWidth,
      };
    } else {
      return {
        ...baseStyle,
        left: 0,
        minWidth: minWidth,
      };
    }
  };

  const sectionTitleStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
    letterSpacing: '0.3px',
  };

  const firstSectionTitleStyle = {
    ...sectionTitleStyle,
    marginTop: 0,
  };

  const optionStyle = (isSelected) => ({
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    marginBottom: theme.spacing.sm,
    background: isSelected ? '#E0F2FE' : theme.colors.white,
    border: isSelected ? `2px solid ${theme.colors.primaryBlue}` : '2px solid #F3F4F6',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  });

  const optionEmojiStyle = {
    fontSize: '24px',
    lineHeight: '1',
    flexShrink: 0,
  };

  const optionContentStyle = {
    flex: 1,
  };

  const optionLabelStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
    lineHeight: '1.4',
  };

  const optionDescStyle = {
    fontSize: '13px',
    color: theme.colors.primaryText,
    opacity: 0.65,
    lineHeight: '1.4',
  };

  return (
    <Card>
      <div style={containerStyle}>
        <div 
          style={dropdownContainerStyle} 
          ref={activeDropdown === 'feeling' ? dropdownRef : null}
        >
          <div
            style={statusCardStyle}
            onClick={handleFeelingClick}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, statusCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
          <div style={labelStyle}>Today I need help with</div>
            <div style={valueStyle}>
              {feelingLabels[taskFeeling] || 'Not set'}
        </div>
          </div>

          {activeDropdown === 'feeling' && (
            <div style={getDropdownStyle()}>
              <div style={firstSectionTitleStyle}>Update Task Feeling</div>
              {feelingOptions.map((option) => {
                const isSelected = taskFeeling === option.value;
                const emoji = option.label.split(' ')[0];
                const label = option.label.split(' ').slice(1).join(' ');
                return (
                <div
                  key={option.value}
                    style={optionStyle(isSelected)}
                  onClick={() => handleUpdateFeeling(option.value)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = theme.colors.white;
                        e.currentTarget.style.borderColor = '#F3F4F6';
                      }
                    }}
                  >
                    <span style={optionEmojiStyle}>{emoji}</span>
                    <div style={optionContentStyle}>
                      <div style={optionLabelStyle}>{label}</div>
                  <div style={optionDescStyle}>{option.desc}</div>
                </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div 
          style={dropdownContainerStyle} 
          ref={activeDropdown === 'energy' ? dropdownRef : null}
        >
          <div
            style={statusCardStyle}
            onClick={handleEnergyClick}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, statusCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={labelStyle}>My energy level is</div>
            <div style={valueStyle}>
              {energyLabels[energyLevel] || 'Not set'}
            </div>
          </div>

          {activeDropdown === 'energy' && (
            <div style={getDropdownStyle()}>
              <div style={firstSectionTitleStyle}>Update Energy Level</div>
              {energyOptions.map((option) => {
                const isSelected = energyLevel === option.value;
                const emoji = option.label.split(' ')[0];
                const label = option.label.split(' ').slice(1).join(' ');
                return (
                <div
                  key={option.value}
                    style={optionStyle(isSelected)}
                  onClick={() => handleUpdateEnergy(option.value)}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = theme.colors.white;
                        e.currentTarget.style.borderColor = '#F3F4F6';
                      }
                    }}
                  >
                    <span style={optionEmojiStyle}>{emoji}</span>
                    <div style={optionContentStyle}>
                      <div style={optionLabelStyle}>{label}</div>
                  <div style={optionDescStyle}>{option.desc}</div>
                </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MoodStatus;
