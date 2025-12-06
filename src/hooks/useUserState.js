import { useState, useEffect } from 'react';

const useUserState = () => {
  const [taskFeeling, setTaskFeeling] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load user state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('userState');
    if (savedState) {
      const { taskFeeling, energyLevel, lastUpdated } = JSON.parse(savedState);
      setTaskFeeling(taskFeeling);
      setEnergyLevel(energyLevel);
      setIsOnboarded(true);
    }
  }, []);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    if (taskFeeling && energyLevel) {
      const userState = {
        taskFeeling,
        energyLevel,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('userState', JSON.stringify(userState));
      setIsOnboarded(true);
    }
  }, [taskFeeling, energyLevel]);

  const updateTaskFeeling = (feeling) => {
    setTaskFeeling(feeling);
  };

  const updateEnergyLevel = (level) => {
    setEnergyLevel(level);
  };

  const resetOnboarding = () => {
    setTaskFeeling(null);
    setEnergyLevel(null);
    setIsOnboarded(false);
    localStorage.removeItem('userState');
  };

  return {
    taskFeeling,
    energyLevel,
    isOnboarded,
    updateTaskFeeling,
    updateEnergyLevel,
    resetOnboarding,
  };
};

export default useUserState;
