import React, { createContext, useReducer, useContext } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'LOGIN'; payload: { username: string; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  isLoggedIn: Boolean(localStorage.getItem('token')),
  username: localStorage.getItem('username') || '',
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('username', action.payload.username);
      return {
        ...state,
        isLoggedIn: true,
        username: action.payload.username,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return { ...initialState, isLoggedIn: false, token: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
