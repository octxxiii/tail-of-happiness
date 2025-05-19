import React, { useState, useRef, useEffect } from 'react';

const SUGGESTED_TAGS = ['행복', '즐거움', '감사', '사랑', '성취', '휴식', '여행', '음식', '가족', '친구'];

const getUserTags = () => {
    try {
        return JSON.parse(localStorage.getItem('userTags') || '[]');
    } catch { return []; }
};
const saveUserTags = (tags) => {
    localStorage.setItem('userTags', JSON.stringify(tags));
};

export default function TagInput({ tags, onTagsChange }) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const tagList = tags.split(',').filter(tag => tag.trim());
    const [userTags, setUserTags] = useState(getUserTags());

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && tagList.length > 0) {
            removeTag(tagList[tagList.length - 1]);
        }
    };

    const addTag = (tag) => {
        if (!tagList.includes(tag)) {
            onTagsChange({ target: { value: [...tagList, tag].join(',') } });
            const updated = Array.from(new Set([tag, ...userTags])).slice(0, 20);
            setUserTags(updated);
            saveUserTags(updated);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove) => {
        onTagsChange({ target: { value: tagList.filter(tag => tag !== tagToRemove).join(',') } });
    };

    const allSuggestions = Array.from(new Set([...userTags, ...SUGGESTED_TAGS]));
    const filteredSuggestions = allSuggestions.filter(
        tag => tag.toLowerCase().includes(inputValue.toLowerCase()) && !tagList.includes(tag)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={inputRef}>
            <div className="flex flex-wrap gap-2 p-2 border-4 border-black rounded-lg bg-white">
                {tagList.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 border-2 border-black"
                        style={{ fontFamily: 'DungGeunMo' }}
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={tagList.length === 0 ? "태그를 입력하세요" : ""}
                    className="flex-1 min-w-[120px] outline-none bg-transparent"
                    style={{ fontFamily: 'Pretendard' }}
                />
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border-4 border-black rounded-lg shadow-lg">
                    {filteredSuggestions.map((tag, index) => (
                        <button
                            key={index}
                            onClick={() => addTag(tag)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                            style={{ fontFamily: 'Pretendard' }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 