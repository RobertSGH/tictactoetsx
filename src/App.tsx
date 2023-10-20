import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import AppContent from './componenets/AppContent/AppContent';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <div className='main-container'>
          <AppContent />
        </div>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
