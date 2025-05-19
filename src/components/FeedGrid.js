import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';

export default function FeedGrid({ memories, onSelect }) {
    const [filteredMemories, setFilteredMemories] = useState(memories);
    const [sortBy, setSortBy] = useState('date');
    const [filterTag, setFilterTag] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        let result = [...memories];

        // 태그 필터링
        if (filterTag) {
            result = result.filter(memory =>
                memory.tags.split(',').some(tag => tag.trim() === filterTag)
            );
        }

        // 정렬
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'happiness') {
                return b.happiness - a.happiness;
            }
            return 0;
        });

        setFilteredMemories(result);
    }, [memories, filterTag, sortBy]);

    const allTags = Array.from(new Set(
        memories.flatMap(memory => memory.tags.split(',').map(tag => tag.trim())).filter(Boolean)
    ));

    const paginatedMemories = filteredMemories.slice(0, page * itemsPerPage);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* 필터 및 정렬 UI */}
            <div className="sticky top-0 z-10 bg-[#f8f6ef] py-4 border-b-4 border-black mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border-4 border-black rounded-lg bg-white font-bold"
                            style={{ fontFamily: 'DungGeunMo' }}
                        >
                            <option value="date">최신순</option>
                            <option value="happiness">행복도순</option>
                        </select>
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="px-4 py-2 border-4 border-black rounded-lg bg-white font-bold"
                            style={{ fontFamily: 'DungGeunMo' }}
                        >
                            <option value="">전체 태그</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                        총 {filteredMemories.length}개의 기록
                    </div>
                </div>
            </div>

            {/* 그리드 뷰 */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                onScroll={handleScroll}
                style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
            >
                <AnimatePresence>
                    {paginatedMemories.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative group cursor-pointer"
                            onClick={() => onSelect(memory.id)}
                        >
                            <div className="aspect-square border-4 border-black rounded-lg overflow-hidden bg-white transform transition-transform group-hover:scale-105">
                                {memory.image ? (
                                    <img
                                        src={memory.image}
                                        alt={memory.text}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <span className="text-gray-400" style={{ fontFamily: 'DungGeunMo' }}>No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white text-sm line-clamp-2" style={{ fontFamily: 'Pretendard' }}>
                                            {memory.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-yellow-400">
                                                {'★'.repeat(memory.happiness)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
} 