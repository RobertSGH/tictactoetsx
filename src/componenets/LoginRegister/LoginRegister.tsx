import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginRegister.css';

const LoginRegister: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(
    null
  );
  const { state: authState, dispatch } = useAuth();

  const handleAction = async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });
    const url = isLogin
      ? 'https://tictactoe.aboutdream.io/login/'
      : 'https://tictactoe.aboutdream.io/register/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        if (isLogin) {
          const data = await response.json();
          dispatch({
            type: 'LOGIN',
            payload: { username: data.username, token: data.token },
          });
        } else {
          setRegistrationMessage('Successfully registered. Proceed to login.');
        }
      } else {
        const data = await response.json();
        dispatch({
          type: 'SET_ERROR',
          payload: data.errors[0]?.message || 'An unknown error occurred',
        });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'An unknown error occurred',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className='login-register-container'>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      {authState.error && <p className='error-message'>{authState.error}</p>}
      {authState.isLoading && <p>Loading...</p>}
      {registrationMessage && (
        <p className='success-message'>{registrationMessage}</p>
      )}

      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAction}>{isLogin ? 'Login' : 'Register'}</button>
      <p>
        {isLogin ? 'New here? ' : 'Already have an account? '}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </span>
      </p>
    </div>
  );
};

export default LoginRegister;
