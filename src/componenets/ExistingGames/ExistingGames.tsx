import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import GameBoard from '../GameBoard/GameBoard';
import './ExistingGames.css';

const ExistingGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const { state: authState } = useAuth();
  const { state, dispatch } = useGame();
  const [filterStatus] = useState<string | null>(null);

  const filteredGames = filterStatus
    ? state.existingGames.filter((game) => game.status === filterStatus)
    : state.existingGames;

  const fetchGames = async () => {
    const token = authState.token;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const baseUrl = `https://tictactoe.aboutdream.io/games?limit=${limit}&offset=${offset}`;
      const filterUrl = state.filterStatus
        ? `&status=${state.filterStatus}`
        : '';
      const finalUrl = `${baseUrl}${filterUrl}`;

      const response = await fetch(finalUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server Error');
      }
      const data = await response.json();
      dispatch({ type: 'SET_GAMES', payload: data });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'An error occurred while fetching games.',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchGames();
  }, [dispatch, offset, authState.token, state.filterStatus]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_FILTER_STATUS', payload: e.target.value });
    setOffset(0);
  };

  const handleCreateNewGame = async () => {
    const token = authState.token;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('https://tictactoe.aboutdream.io/games/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors[0].message || 'Server Error');
      }
      const data = await response.json();
      dispatch({ type: 'CREATE_GAME', payload: data });
      setSelectedGame(data.id);
      fetchGameDetails(data.id);
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      console.error('Fetch error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'An error occurred while creating the game.',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchGameDetails = async (gameId: number) => {
    const token = authState.token;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(
        `https://tictactoe.aboutdream.io/games/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch({ type: 'SET_CURRENT_GAME', payload: data });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      console.error('Fetch error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'An error occurred while fetching the game.',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleGameClick = (gameId: number) => {
    setSelectedGame(gameId);
    fetchGameDetails(gameId);
  };

  const handleNextPage = () => {
    if (state.pagination.next) {
      setOffset(offset + limit);
    }
  };

  const handlePreviousPage = () => {
    if (state.pagination.previous) {
      setOffset(offset - limit);
    }
  };

  const handleBackToList = () => {
    setSelectedGame(null);
    fetchGames();
  };

  return (
    <div className='existing-games-container'>
      {!selectedGame ? (
        <>
          <button onClick={handleCreateNewGame}>Create New Game</button>
          <div>
            Filter by status:
            <select
              onChange={handleFilterChange}
              value={state.filterStatus || ''}
            >
              <option value=''>All</option>
              <option value='open'>Open</option>
              <option value='progress'>In Progress</option>
              <option value='finished'>Completed</option>
            </select>
          </div>
          <div className='game-grid'>
            {filteredGames?.map((game) => (
              <div
                key={game.id}
                className='game-card'
                onClick={() => handleGameClick(game.id)}
              >
                <p>Game ID: {game.id}</p>
                <p>Status: {game.status}</p>
                <p>
                  Participant:{' '}
                  {(game.first_player &&
                    game.first_player.username === authState.username) ||
                  (game.second_player &&
                    game.second_player.username === authState.username)
                    ? 'Yes'
                    : 'No'}
                </p>
              </div>
            ))}
          </div>
          <button
            disabled={!state.pagination.previous}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <button disabled={!state.pagination.next} onClick={handleNextPage}>
            Next
          </button>
        </>
      ) : (
        <>
          <GameBoard
            gameId={selectedGame}
            fetchGameDetails={fetchGameDetails}
          />
          <button onClick={handleBackToList}>Back to List</button>
        </>
      )}
    </div>
  );
};

export default ExistingGames;
