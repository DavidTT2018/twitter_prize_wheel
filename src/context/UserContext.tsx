import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the state interface
interface UserState {
  isAgeVerified: boolean;
  isTwitterFollowed: boolean;
  hasSpunWheel: boolean;
  isPrizeAwarded: boolean;
  prize: string | null;
  twitterUsername: string | null;
  sessionId: string | null;
}

// Define action types
type UserAction =
  | { type: 'VERIFY_AGE' }
  | { type: 'VERIFY_TWITTER_FOLLOW' }
  | { type: 'SPIN_WHEEL' }
  | { type: 'AWARD_PRIZE'; payload: string }
  | { type: 'SET_TWITTER_USERNAME'; payload: string }
  | { type: 'SET_SESSION_ID'; payload: string }
  | { type: 'RESET' };

// Define initial state
const initialState: UserState = {
  isAgeVerified: false,
  isTwitterFollowed: false,
  hasSpunWheel: false,
  isPrizeAwarded: false,
  prize: null,
  twitterUsername: null,
  sessionId: null,
};

// Create context
const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'VERIFY_AGE':
      return { ...state, isAgeVerified: true };
    case 'VERIFY_TWITTER_FOLLOW':
      return { ...state, isTwitterFollowed: true };
    case 'SPIN_WHEEL':
      return { ...state, hasSpunWheel: true };
    case 'AWARD_PRIZE':
      return {
        ...state,
        isPrizeAwarded: true,
        prize: action.payload,
      };
    case 'SET_TWITTER_USERNAME':
      return {
        ...state,
        twitterUsername: action.payload,
      };
    case 'SET_SESSION_ID':
      return {
        ...state,
        sessionId: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => useContext(UserContext);