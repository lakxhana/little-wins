import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Card from '../common/Card';
import { theme } from '../../styles/theme';
import { useWindowSize } from '../../hooks/useWindowSize';

const MoodStatus = ({ taskFeeling, energyLevel, onUpdateTaskFeeling, onUpdateEnergyLevel }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('right');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'feeling' or 'energy'
  const [dropdownStyle, setDropdownStyle] = useState(null);
  const feelingButtonRef = useRef(null);
  const energyButtonRef = useRef(null);
  const { width } = useWindowSize();

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (!activeDropdown) {
      setDropdownStyle(null);
      return;
    }

    const calculatePosition = () => {
      const buttonRef = activeDropdown === 'feeling' ? feelingButtonRef : energyButtonRef;
      
      if (!buttonRef.current) {
        // Retry after a short delay
        setTimeout(calculatePosition, 50);
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = width <= 768 ? 280 : 320;
      const spaceOnRight = window.innerWidth - rect.right;
      const spaceOnLeft = rect.left;

      // Position on left if not enough space on right
      const position = spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth ? 'left' : 'right';
      setDropdownPosition(position);

      const baseStyle = {
        position: 'fixed',
        background: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        padding: width <= 480 ? theme.spacing.md : theme.spacing.lg,
        zIndex: 5000,
        maxHeight: '500px',
        overflowY: 'auto',
        border: `1px solid #E5E7EB`,
      };

      const dropdownTop = rect.bottom + theme.spacing.sm;
      const minWidth = width <= 768 ? '280px' : '320px';

      if (width <= 480) {
        // Mobile: full width
        setDropdownStyle({
          ...baseStyle,
          top: `${dropdownTop}px`,
          left: `${Math.max(0, rect.left)}px`,
          right: `${Math.max(0, window.innerWidth - rect.right)}px`,
          width: 'auto',
          minWidth: 'auto',
        });
      } else {
        // Desktop/Tablet: positioned relative to button
        if (position === 'left') {
          setDropdownStyle({
            ...baseStyle,
            top: `${dropdownTop}px`,
            right: `${window.innerWidth - rect.right}px`,
            left: 'auto',
            minWidth: minWidth,
          });
        } else {
          setDropdownStyle({
            ...baseStyle,
            top: `${dropdownTop}px`,
            left: `${rect.left}px`,
            right: 'auto',
            minWidth: minWidth,
          });
        }
      }
    };

    // Small delay to ensure refs are set
    const timer = setTimeout(calculatePosition, 10);
    return () => clearTimeout(timer);
  }, [activeDropdown, width]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (event) => {
      const feelingButton = feelingButtonRef.current;
      const energyButton = energyButtonRef.current;
      const dropdown = document.querySelector('[data-dropdown]');
      
      // Check if click is outside both buttons and dropdown
      const clickedFeelingButton = feelingButton && feelingButton.contains(event.target);
      const clickedEnergyButton = energyButton && energyButton.contains(event.target);
      const clickedDropdown = dropdown && dropdown.contains(event.target);

      if (!clickedFeelingButton && !clickedEnergyButton && !clickedDropdown) {
        setActiveDropdown(null);
        setIsDropdownOpen(false);
      }
    };

    // Add listener after a small delay to avoid immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
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

  const handleFeelingClick = (e) => {
    e.stopPropagation();
    const newActive = activeDropdown === 'feeling' ? null : 'feeling';
    setActiveDropdown(newActive);
    setIsDropdownOpen(newActive !== null);
  };

  const handleEnergyClick = (e) => {
    e.stopPropagation();
    const newActive = activeDropdown === 'energy' ? null : 'energy';
    setActiveDropdown(newActive);
    setIsDropdownOpen(newActive !== null);
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
    <Card style={{ overflow: 'visible', position: 'relative' }}>
      <div style={containerStyle}>
        <div style={{ position: 'relative' }}>
          <div
            ref={feelingButtonRef}
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

          {activeDropdown === 'feeling' && typeof document !== 'undefined' && createPortal(
            <div 
              data-dropdown 
              style={dropdownStyle || {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: theme.colors.white,
                borderRadius: theme.borderRadius.lg,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                padding: theme.spacing.lg,
                zIndex: 5000,
                minWidth: '300px',
                border: `1px solid #E5E7EB`,
              }}
            >
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
            </div>,
            document.body
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <div
            ref={energyButtonRef}
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

          {activeDropdown === 'energy' && typeof document !== 'undefined' && createPortal(
            <div 
              data-dropdown 
              style={dropdownStyle || {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: theme.colors.white,
                borderRadius: theme.borderRadius.lg,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                padding: theme.spacing.lg,
                zIndex: 5000,
                minWidth: '300px',
                border: `1px solid #E5E7EB`,
              }}
            >
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
            </div>,
            document.body
          )}
        </div>
      </div>
    </Card>
  );
};

export default MoodStatus;
