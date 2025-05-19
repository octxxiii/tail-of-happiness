export const getTransitionClass = (type, from) => {
  if (!type || !from) return '';
  
  const transitions = {
    fade: {
      calendar: 'fade-out-up',
      gallery: 'fade-out-down',
      record: 'fade-out-left',
      detail: 'fade-out-right'
    },
    slide: {
      calendar: 'slide-out-up',
      gallery: 'slide-out-down',
      record: 'slide-out-left',
      detail: 'slide-out-right'
    }
  };

  return transitions[type]?.[from] || '';
};

export const getGlitchClass = (active) => {
  return active ? 'glitch-effect' : '';
};

export const getHoverClass = (buttonId, hoverButton) => {
  return buttonId === hoverButton ? 'hover-effect' : '';
}; 