import React from 'react';
import { AppProvider } from './context/AppContext';
import ArtisticAppDemo from './components/ArtisticAppDemo';

function App() {
  return (
    <AppProvider>
      <ArtisticAppDemo />
    </AppProvider>
  );
}

export default App; 