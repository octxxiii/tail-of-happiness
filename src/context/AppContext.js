import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  tab: '오늘',
  memories: [], // [{id, image, text, happiness, tags, date}]
  selectedId: null,
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, tab: action.tab };
    case 'ADD_MEMORY':
      return { ...state, memories: [action.memory, ...state.memories] };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        memories: state.memories.map(m => m.id === action.memory.id ? action.memory : m)
      };
    case 'DELETE_MEMORY':
      return {
        ...state,
        memories: state.memories.filter(m => m.id !== action.id)
      };
    case 'SELECT_MEMORY':
      return { ...state, selectedId: action.id };
    case 'SET_CALENDAR_MONTH':
      return { ...state, calendarMonth: action.month, calendarYear: action.year };
    case 'SET_MEMORIES':
      return { ...state, memories: action.memories };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // localStorage에서 불러오기 (최초 1회)
  useEffect(() => {
    const saved = localStorage.getItem('memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'SET_MEMORIES', memories: parsed });
        }
      } catch { }
    }
  }, []);

  // memories가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('memories', JSON.stringify(state.memories));
  }, [state.memories]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
} 