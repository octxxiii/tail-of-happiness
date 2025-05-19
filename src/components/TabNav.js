import React from 'react';

const TABS = ['오늘', '캘린더', '리스트', '상세'];

export default function TabNav({ current, onTabChange }) {
    return (
        <nav className="flex justify-center space-x-2 py-6">
            {TABS.map(tab => (
                <button
                    key={tab}
                    className={`px-6 py-2 border-4 border-black rounded-full font-bold text-lg shadow-md transition-all duration-200 ${current === tab ? 'bg-black text-white scale-110' : 'bg-white text-black hover:bg-gray-100'}`}
                    style={{ fontFamily: 'DungGeunMo' }}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </nav>
    );
} 