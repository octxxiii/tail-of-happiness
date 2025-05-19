import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  screen: 'calendar',
  loading: true,
  glitchActive: false,
  hoverButton: null,
  selectedDay: null,
  transitionType: null,
  fromScreen: null,
  galleryItems: [],
  selectedGalleryItem: null,
  currentPage: 1,
  sortBy: 'date',
  filterMood: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_GLITCH':
      return { ...state, glitchActive: action.payload };
    case 'SET_HOVER_BUTTON':
      return { ...state, hoverButton: action.payload };
    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };
    case 'SET_TRANSITION':
      return { 
        ...state, 
        transitionType: action.payload.type,
        fromScreen: action.payload.from
      };
    case 'SET_GALLERY_ITEMS':
      return { ...state, galleryItems: action.payload };
    case 'SET_SELECTED_GALLERY_ITEM':
      return { ...state, selectedGalleryItem: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload, currentPage: 1 };
    case 'SET_FILTER_MOOD':
      return { ...state, filterMood: action.payload, currentPage: 1 };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 