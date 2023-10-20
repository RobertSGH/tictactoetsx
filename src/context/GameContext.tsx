import React, { createContext, useReducer, useContext } from 'react';

interface GameState {
  existingGames: any[];
  currentGame: any | null;
  rankings: any[];
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  filterStatus: string | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | {
      type: 'SET_GAMES';
      payload: {
        results: any[];
        count: number;
        next: string | null;
        previous: string | null;
      };
    }
  | { type: 'SET_RANKINGS'; payload: any[] }
  | { type: 'SET_FILTER_STATUS'; payload: string | null }
  | { type: 'SET_CURRENT_GAME'; payload: any | null }
  | { type: 'CREATE_GAME'; payload: any | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: GameState = {
  existingGames: [],
  currentGame: null,
  rankings: [],
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  filterStatus: '',
  isLoading: false,
  error: null,
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'SET_GAMES':
      return {
        ...state,
        existingGames: action.payload.results,
        pagination: {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        },
      };
    case 'SET_RANKINGS':
      return { ...state, rankings: action.payload };
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_CURRENT_GAME':
      return { ...state, currentGame: action.payload };
    case 'CREATE_GAME':
      return {
        ...state,
        currentGame: action.payload,
        existingGames: [action.payload, ...state.existingGames],
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const useGame = () => {
  return useContext(GameContext);
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
