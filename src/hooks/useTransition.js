import { useState, useCallback } from 'react';

export const useTransition = () => {
  const [transitionType, setTransitionType] = useState(null);
  const [fromScreen, setFromScreen] = useState(null);

  const transition = useCallback((type, from) => {
    setTransitionType(type);
    setFromScreen(from);
    
    // 전환 효과가 끝나면 상태 초기화
    setTimeout(() => {
      setTransitionType(null);
      setFromScreen(null);
    }, 500);
  }, []);

  return {
    transitionType,
    fromScreen,
    transition
  };
}; 