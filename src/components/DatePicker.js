import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DatePicker({ date, onDateChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(date));
    const [currentMonth, setCurrentMonth] = useState(new Date(date));
    const [direction, setDirection] = useState(0);
    const [particleDay, setParticleDay] = useState(null);

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

    const handleDateSelect = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        onDateChange({ target: { value: newDate.toISOString().slice(0, 10) } });
        setIsOpen(false);
        setParticleDay(day);
        setTimeout(() => setParticleDay(null), 700);
    };

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const setToToday = () => {
        const today = new Date();
        onDateChange({ target: { value: today.toISOString().slice(0, 10) } });
        setIsOpen(false);
    };

    const setToYesterday = () => {
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        onDateChange({ target: { value: yest.toISOString().slice(0, 10) } });
        setIsOpen(false);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 400 : -400,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 400 : -400,
            opacity: 0
        })
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-left border-4 border-black rounded-lg bg-white hover:bg-gray-50 transition flex items-center justify-between"
                style={{ fontFamily: 'DungGeunMo' }}
            >
                <span>{formatDate(date)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border-4 border-black rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <span className="font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                            {currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-2 mb-2 justify-end">
                        <button onClick={setToToday} className="px-3 py-1 rounded-full border-2 border-black bg-yellow-100 hover:bg-yellow-200 text-xs font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                            오늘
                        </button>
                        <button onClick={setToYesterday} className="px-3 py-1 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 text-xs font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                            어제
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
                            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        >
                            <div className="grid grid-cols-7 gap-1">
                                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-sm font-bold py-1"
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
                                    const isSelected = selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === currentMonth.getMonth() &&
                                        selectedDate.getFullYear() === currentMonth.getFullYear();
                                    const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

                                    return (
                                        <motion.button
                                            key={day}
                                            onClick={() => handleDateSelect(day)}
                                            className={`p-1 rounded-full text-sm relative ${isSelected
                                                ? 'bg-black text-white scale-110 ring-4 ring-yellow-300 z-10'
                                                : isToday
                                                    ? 'bg-gray-100'
                                                    : 'hover:bg-yellow-50'
                                                }`}
                                            style={{ fontFamily: 'Pretendard' }}
                                            whileTap={{ scale: 1.2 }}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {day}
                                            {/* 파티클 효과 */}
                                            {particleDay === day && (
                                                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none animate-particle-burst text-yellow-400 text-lg z-20">
                                                    {'✨💥⭐️'.split('').map((p, i) => (
                                                        <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{p}</span>
                                                    ))}
                                                </span>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
} 