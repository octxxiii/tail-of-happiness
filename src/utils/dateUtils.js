export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const hasMemory = (date, memories) => {
  return memories.some(memory => {
    const memoryDate = new Date(memory.date);
    return memoryDate.getDate() === date.getDate() &&
      memoryDate.getMonth() === date.getMonth() &&
      memoryDate.getFullYear() === date.getFullYear();
  });
}; 