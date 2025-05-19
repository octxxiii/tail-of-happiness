import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalendarView({ year, month, memories, onDaySelect }) {
    const [currentMonth, setCurrentMonth] = useState(new Date(year, month));
    const [direction, setDirection] = useState(0);

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const getMemoriesForDay = (day) => {
        return memories.filter(memory => {
            const d = new Date(memory.date);
            return d.getFullYear() === currentMonth.getFullYear() &&
                d.getMonth() === currentMonth.getMonth() &&
                d.getDate() === day;
        });
    };

    const getMonthStats = () => {
        const monthMemories = memories.filter(memory => {
            const d = new Date(memory.date);
            return d.getFullYear() === currentMonth.getFullYear() &&
                d.getMonth() === currentMonth.getMonth();
        });

        const totalHappiness = monthMemories.reduce((sum, m) => sum + m.happiness, 0);
        const avgHappiness = monthMemories.length ? (totalHappiness / monthMemories.length).toFixed(1) : 0;
        const totalMemories = monthMemories.length;

        return { avgHappiness, totalMemories };
    };

    const { avgHappiness, totalMemories } = getMonthStats();

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* 월별 통계 */}
            <div className="mb-8 p-6 border-4 border-black rounded-lg bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                        {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                    </h2>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-500" style={{ fontFamily: 'DungGeunMo' }}>평균 행복도</div>
                            <div className="text-2xl font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                                {avgHappiness}
                                <span className="text-yellow-400 ml-1">★</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500" style={{ fontFamily: 'DungGeunMo' }}>기록 수</div>
                            <div className="text-2xl font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                                {totalMemories}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 캘린더 */}
            <div className="relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentMonth.toISOString()}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="bg-white border-4 border-black rounded-lg p-6"
                    >
                        <div className="grid grid-cols-7 gap-2">
                            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                                <div
                                    key={day}
                                    className="text-center font-bold py-2"
                                    style={{ fontFamily: 'DungGeunMo' }}
                                >
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                                <div key={`empty-${index}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, index) => {
                                const day = index + 1;
                                const dayMemories = getMemoriesForDay(day);
                                const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

                                return (
                                    <button
                                        key={day}
                                        onClick={() => dayMemories.length > 0 && onDaySelect(day)}
                                        className={`relative p-2 rounded-lg border-2 ${dayMemories.length > 0
                                            ? 'border-black bg-yellow-50 cursor-pointer hover:bg-yellow-100'
                                            : 'border-gray-200'
                                            } ${isToday ? 'ring-2 ring-black' : ''}`}
                                        disabled={dayMemories.length === 0}
                                    >
                                        <span className="block text-center" style={{ fontFamily: 'Pretendard' }}>
                                            {day}
                                        </span>
                                        {dayMemories.length > 0 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs" style={{ fontFamily: 'DungGeunMo' }}>
                                                    {dayMemories.length}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
} 