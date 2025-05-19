import { useState, useCallback, useMemo } from 'react';

export const useGallery = (items) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [filterMood, setFilterMood] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 9; // 3x3 그리드

  const sortedAndFilteredItems = useMemo(() => {
    let result = [...items];

    // 정렬
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'mood') {
      result.sort((a, b) => a.mood.localeCompare(b.mood));
    }

    // 필터링
    if (filterMood) {
      result = result.filter(item => item.mood === filterMood);
    }

    return result;
  }, [items, sortBy, filterMood]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredItems, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredItems.length / itemsPerPage);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilterMood) => {
    setFilterMood(newFilterMood);
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    sortBy,
    filterMood,
    selectedItem,
    paginatedItems,
    totalPages,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    setSelectedItem
  };
}; 