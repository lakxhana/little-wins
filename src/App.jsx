import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskFeelingsScreen from './components/onboarding/TaskFeelingsScreen';
import EnergyLevelScreen from './components/onboarding/EnergyLevelScreen';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import Review from './components/review/Review';
import useUserState from './hooks/useUserState';

function App() {
  const {
    taskFeeling,
    energyLevel,
    isOnboarded,
    updateTaskFeeling,
    updateEnergyLevel,
  } = useUserState();

  return (
    <Router>
      <Routes>
        {/* Onboarding Flow */}
        <Route
          path="/"
          element={<TaskFeelingsScreen onSelect={updateTaskFeeling} />}
        />
        <Route
          path="/energy"
          element={<EnergyLevelScreen onSelect={updateEnergyLevel} />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isOnboarded ? (
              <Dashboard
                taskFeeling={taskFeeling}
                energyLevel={energyLevel}
                onUpdateTaskFeeling={updateTaskFeeling}
                onUpdateEnergyLevel={updateEnergyLevel}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            isOnboarded ? (
              <Settings />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Review */}
        <Route
          path="/review"
          element={
            isOnboarded ? (
              <Review />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch all - redirect to appropriate page */}
        <Route
          path="*"
          element={<Navigate to={isOnboarded ? '/dashboard' : '/'} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;