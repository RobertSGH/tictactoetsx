import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import './Rankings.css';

const Rankings: React.FC = () => {
  const { state, dispatch } = useGame();
  const { state: authState } = useAuth();
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchRankings = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const token = authState.token;
      const url = `https://tictactoe.aboutdream.io/users?limit=${limit}&offset=${offset}`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          dispatch({ type: 'SET_RANKINGS', payload: data.results });
        } else {
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

    fetchRankings();
  }, [dispatch, offset, authState.token]);

  const handleNextPage = () => {
    setOffset(offset + limit);
  };

  const handlePreviousPage = () => {
    setOffset(offset - limit);
  };

  return (
    <div className='rankings-container'>
      <h1>Player Rankings</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Games Played</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {state.rankings.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
              <td>{player.game_count}</td>
              <td>{player.win_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button disabled={offset === 0} onClick={handlePreviousPage}>
        Previous
      </button>
      <button onClick={handleNextPage}>Next</button>
    </div>
  );
};

export default Rankings;
