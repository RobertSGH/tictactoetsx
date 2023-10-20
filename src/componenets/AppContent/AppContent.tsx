import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import ExistingGames from '../ExistingGames/ExistingGames';
import Rankings from '../Rankings/Rankings';
import LoginRegister from '../LoginRegister/LoginRegister';
import Header from '../Header/Header';
import './AppContent.css';

const AppContent: React.FC = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'games' | 'rankings'>('games');

  if (!state.isLoggedIn) {
    return <LoginRegister />;
  }

  return (
    <>
      <Header />
      <div className='tabs'>
        <button
          onClick={() => setActiveTab('games')}
          className={activeTab === 'games' ? 'active' : ''}
        >
          Existing Games
        </button>
        <button
          onClick={() => setActiveTab('rankings')}
          className={activeTab === 'rankings' ? 'active' : ''}
        >
          Rankings
        </button>
      </div>
      {activeTab === 'games' ? <ExistingGames /> : <Rankings />}
    </>
  );
};
export default AppContent;
