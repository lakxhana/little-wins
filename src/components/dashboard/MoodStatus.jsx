import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { theme } from '../../styles/theme';

const MoodStatus = ({ taskFeeling, energyLevel, onUpdateTaskFeeling, onUpdateEnergyLevel }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

  const handleUpdateFeeling = (value) => {
    onUpdateTaskFeeling(value);
    setIsDropdownOpen(false);
  };

  const handleUpdateEnergy = (value) => {
    onUpdateEnergyLevel(value);
    setIsDropdownOpen(false);
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const statusStyle = {
    flex: 1,
  };

  const labelStyle = {
    fontSize: '14px',
    color: theme.colors.primaryText,
    opacity: 0.7,
    marginBottom: theme.spacing.xs,
  };

  const valueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.colors.primaryBlue,
  };

  const dropdownContainerStyle = {
    position: 'relative',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 0,
    left: '100%',
    marginLeft: theme.spacing.md,
    background: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    padding: theme.spacing.md,
    zIndex: 1000,
    minWidth: '300px',
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  };

  const firstSectionTitleStyle = {
    ...sectionTitleStyle,
    marginTop: 0,
  };

  const optionStyle = (isSelected) => ({
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    marginBottom: theme.spacing.xs,
    background: isSelected ? theme.colors.lightBlue : 'transparent',
    transition: theme.transitions.fast,
  });

  const optionLabelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: theme.colors.primaryText,
  };

  const optionDescStyle = {
    fontSize: '12px',
    color: theme.colors.primaryText,
    opacity: 0.7,
    marginTop: '2px',
  };

  return (
    <Card>
      <div style={containerStyle}>
        <div style={statusStyle}>
          <div style={labelStyle}>Today I need help with</div>
          <div style={valueStyle}>{feelingLabels[taskFeeling] || 'Not set'}</div>
        </div>
        <div style={statusStyle}>
          <div style={labelStyle}>My energy level is</div>
          <div style={valueStyle}>{energyLabels[energyLevel] || 'Not set'}</div>
        </div>
        <div style={dropdownContainerStyle} ref={dropdownRef}>
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: '14px' }}
          >
            It has changed
          </Button>

          {isDropdownOpen && (
            <div style={dropdownStyle}>
              <div style={firstSectionTitleStyle}>Update Task Feeling</div>
              {feelingOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionStyle(taskFeeling === option.value)}
                  onClick={() => handleUpdateFeeling(option.value)}
                >
                  <div style={optionLabelStyle}>{option.label}</div>
                  <div style={optionDescStyle}>{option.desc}</div>
                </div>
              ))}

              <div style={sectionTitleStyle}>Update Energy Level</div>
              {energyOptions.map((option) => (
                <div
                  key={option.value}
                  style={optionStyle(energyLevel === option.value)}
                  onClick={() => handleUpdateEnergy(option.value)}
                >
                  <div style={optionLabelStyle}>{option.label}</div>
                  <div style={optionDescStyle}>{option.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MoodStatus;
