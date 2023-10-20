import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { state, dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className='header'>
      <span>Welcome, {state.username}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;
