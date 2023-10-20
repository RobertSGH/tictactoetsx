import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import './GameBoard.css';
import { useAuth } from '../../context/AuthContext';

interface GameBoardProps {
  gameId: number;
  fetchGameDetails: (gameId: number) => Promise<void>;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameId, fetchGameDetails }) => {
  const { state, dispatch } = useGame();
  const { state: authState } = useAuth();

  useEffect(() => {
    fetchGameDetails(gameId);
  }, [gameId]);

  const makeMove = async (row: number, col: number) => {
    if (state.currentGame && state.currentGame.id) {
      const gameId = state.currentGame.id;
      const token = authState.token;
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetch(
          `https://tictactoe.aboutdream.io/games/${gameId}/move/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ row, col }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors[0].message || 'Server Error');
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error.message || 'An error occurred while making the move.',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const board = state.currentGame ? state.currentGame.board : [];
  const firstPlayer = state.currentGame ? state.currentGame.first_player : null;
  const secondPlayer = state.currentGame
    ? state.currentGame.second_player
    : null;

  console.log(state);

  const getNextPlayer = (
    board: any[][],
    firstPlayer: any,
    secondPlayer: any
  ) => {
    let moveCount = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== null) moveCount++;
      });
    });
    return moveCount % 2 === 0 ? firstPlayer : secondPlayer;
  };

  const nextPlayer = getNextPlayer(board, firstPlayer, secondPlayer);

  const handleJoinGame = async () => {
    if (state.currentGame && state.currentGame.id) {
      const gameId = state.currentGame.id;
      const token = authState.token;
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetch(
          `https://tictactoe.aboutdream.io/games/${gameId}/join/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors[0].message || 'Server Error');
        }
        fetchGameDetails(gameId);
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error: any) {
        console.error('Fetch error:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error.message || 'An error occurred while joining the game.',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  useEffect(() => {
    if (state.currentGame && state.currentGame.status !== 'finished') {
      const intervalId = setInterval(() => {
        if (state.currentGame && state.currentGame.id) {
          fetchGameDetails(state.currentGame.id);
        }
      }, 7000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [state.currentGame]);

  console.log(state.currentGame);

  return (
    <div className='game-board'>
      <h1>Game Board for Game ID: {gameId}</h1>
      {state.currentGame?.status === 'open' && (
        <button onClick={handleJoinGame}>Join Game</button>
      )}
      <div className='participants'>
        <p>
          First Player: {firstPlayer ? firstPlayer?.username : 'N/A'} (ID:
          {firstPlayer?.id})
        </p>
        <p>
          Second Player: {secondPlayer ? secondPlayer?.username : 'N/A'} (ID:
          {secondPlayer?.id})
        </p>
        {state.currentGame?.status === 'progress' && (
          <p>Current Turn: {nextPlayer ? nextPlayer.username : 'N/A'}</p>
        )}
        {state.currentGame?.status === 'finished' && (
          <p>Winner: {state.currentGame?.winner.username}</p>
        )}
        {state.isLoading && <p>Loading...</p>}
        {state.error && <p>{state.error}</p>}
      </div>
      {!secondPlayer && (
        <p>Waiting for the second player to join the game...</p>
      )}
      <div className='board'>
        {board.map((row: any[], rowIndex: number) => (
          <div key={rowIndex} className='row'>
            {row.map((cell: any, colIndex: number) => (
              <div
                key={colIndex}
                className='cell'
                onClick={() => makeMove(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
