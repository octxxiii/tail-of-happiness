import { useState, useCallback } from 'react';

export const useGlitch = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  const triggerGlitch = useCallback(() => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 500);
  }, []);

  return {
    glitchActive,
    triggerGlitch
  };
}; 