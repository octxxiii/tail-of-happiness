import React, { useState, useRef, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import TagInput from './TagInput';
import DatePicker from './DatePicker';
import { motion } from 'framer-motion';

const faces = [
    '😐', // 1
    '🙂', // 2
    '😀', // 3
    '😁', // 4
    '😍', // 5
];

const faceTips = ['보통', '기분 좋음', '행복', '아주 행복', '최고!'];

const PLACEHOLDERS = [
    '오늘의 작은 행복을 적어보세요',
    '기억하고 싶은 순간은?',
    '나만의 행복 노트를 채워보세요',
    '소소한 기쁨을 기록해요',
    '행복했던 이유를 남겨보세요',
    '오늘 마음에 남은 한마디',
];

export default function NoteCard({
    pageNum,
    imageUrl,
    onImageChange,
    text,
    onTextChange,
    happiness,
    onHappinessChange,
    tags,
    onTagsChange,
    date,
    onDateChange,
    editable = false,
    onSave,
    onSaved,
    onFocusAny,
    onBlurAny,
}) {
    const [hovered, setHovered] = useState(null);
    const [showParticles, setShowParticles] = useState(false);
    const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });
    const [isTurningPage, setIsTurningPage] = useState(false);
    const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef();
    const [error, setError] = useState('');

    const handleSaveClick = async () => {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(30);
        }
        setIsSaving(true);
        setIsTurningPage(true);
        await new Promise(r => setTimeout(r, 700));
        setIsTurningPage(false);
        setIsSaving(false);
        onSave && onSave();
        onSaved && onSaved();
    };

    const handleFaceClick = (face, e) => {
        if (!editable) return;
        onHappinessChange(face);
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(15);
        }
        // 파티클 효과 위치 계산
        const rect = e.target.getBoundingClientRect();
        setParticlePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 700);
    };

    // 포커스/블러 핸들러
    const handleFocus = () => { onFocusAny && onFocusAny(); };
    const handleBlur = () => { onBlurAny && onBlurAny(); };

    // 유효성 검사
    useEffect(() => {
        if (editable) {
            if (!text.trim()) {
                setError('행복한 순간을 입력해 주세요.');
            } else if (text.length > 200) {
                setError('행복 기록은 200자 이내로 작성해 주세요.');
            } else if (tags.length > 30) {
                setError('태그는 30자 이내로 입력해 주세요.');
            } else {
                setError('');
            }
        }
    }, [text, tags, editable]);

    // 텍스트 입력창 자동 높이 조절
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [text]);

    useEffect(() => {
        setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    }, []);

    return (
        <div className={`max-w-lg mx-auto relative bg-yellow-100 border-4 border-yellow-300 rounded-2xl shadow-xl ${isTurningPage ? 'animate-page-turn' : ''}`}
            style={{ maxHeight: '80vh' }}>
            {/* 만화책 테두리와 줄무늬 배경 */}
            <div className="p-6 relative overflow-y-auto" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #f8f6ef 0px, #f8f6ef 28px, #f3ecd7 28px, #f3ecd7 32px)', maxHeight: 'calc(80vh - 72px)' }}>
                {/* 페이지 넘버 + 만화책 아이콘 */}
                <div className="absolute top-4 right-6 text-lg font-extrabold text-black bg-yellow-200 border-2 border-black rounded-full px-4 py-1 shadow flex items-center gap-1" style={{ fontFamily: 'DungGeunMo', zIndex: 10 }}>
                    <span>📖</span> p.{pageNum}
                </div>
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                        {editable ? '오늘의 행복 기록' : '기록'}
                    </h2>
                </div>
                <div className="space-y-4 overflow-visible min-w-0 flex flex-col flex-wrap">
                    {/* 이미지 업로더 */}
                    <div className="aspect-square min-h-[200px] min-w-full border-4 border-black rounded-xl overflow-hidden bg-white flex items-center justify-center relative flex-grow">
                        <ImageUploader
                            imagePreview={imageUrl}
                            onImageChange={onImageChange}
                        />
                    </div>
                    {/* 텍스트 입력 */}
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={onTextChange}
                            placeholder={placeholder}
                            className="w-full p-4 border-4 border-black rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black bg-transparent text-lg min-h-[96px] transition-all duration-300"
                            rows={4}
                            style={{ fontFamily: 'Pretendard', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, #f3ecd7 28px, #f3ecd7 32px)' }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            aria-label="오늘의 행복 기록 입력"
                            maxLength={200}
                        />
                        <motion.span
                            className="absolute right-3 top-3 text-2xl text-gray-400 pointer-events-none"
                            animate={{ rotate: textareaRef.current && document.activeElement === textareaRef.current ? [0, -15, 15, 0] : 0 }}
                            transition={{ repeat: textareaRef.current && document.activeElement === textareaRef.current ? Infinity : 0, duration: 0.7 }}
                        >
                            ✏️
                        </motion.span>
                    </div>
                    {/* 행복도(별점) 입력 */}
                    <div className="flex items-center gap-2">
                        <span className="font-bold" style={{ fontFamily: 'DungGeunMo' }}>행복도:</span>
                        <div className="flex gap-1 relative">
                            {[1, 2, 3, 4, 5].map((face, idx) => (
                                <motion.button
                                    key={face}
                                    onClick={e => handleFaceClick(face, e)}
                                    whileTap={{ scale: 1.3, rotate: -10 + idx * 5 }}
                                    whileHover={{ scale: 1.15 }}
                                    animate={happiness === face ? { scale: 1.2 } : { scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className={`text-2xl md:text-3xl focus:outline-none bg-white rounded-full border-2 border-black px-1 ${happiness === face ? 'ring-2 ring-yellow-300' : ''}`}
                                    disabled={!editable}
                                    onMouseEnter={() => setHovered(face)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{ cursor: editable ? 'pointer' : 'default', position: 'relative' }}
                                    aria-label={`행복도 ${faceTips[idx]}`}
                                    tabIndex={0}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') handleFaceClick(face, e);
                                    }}
                                >
                                    {faces[idx]}
                                    {/* 툴팁 */}
                                    {hovered === face && (
                                        <span className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-black text-white text-xs rounded shadow z-20" style={{ fontFamily: 'DungGeunMo', whiteSpace: 'nowrap' }}>
                                            {faceTips[idx]}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                            {/* 파티클 효과 */}
                            {showParticles && (
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none animate-particle-burst text-2xl z-30">
                                    {'✨🎉💫'.split('').map((p, i) => (
                                        <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{p}</span>
                                    ))}
                                </span>
                            )}
                        </div>
                        {happiness ? <span className="ml-2 text-lg" style={{ fontFamily: 'DungGeunMo' }}>{faces[happiness - 1]}</span> : null}
                    </div>
                    {/* 태그/날짜 입력 한 줄 배치 */}
                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="w-full md:w-1/2">
                            <TagInput
                                tags={tags}
                                onTagsChange={onTagsChange}
                                maxLength={30}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <DatePicker
                                date={date}
                                onDateChange={onDateChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>
                    {editable && error && (
                        <div className="text-red-500 text-sm font-bold mb-2" style={{ fontFamily: 'DungGeunMo' }}>{error}</div>
                    )}
                </div>
            </div>
            {/* 저장 버튼 NoteCard 내부 하단 sticky */}
            {editable && (
                <div className="sticky bottom-0 left-0 right-0 z-20 bg-yellow-100 px-6 pb-4 pt-2">
                    <button
                        onClick={handleSaveClick}
                        aria-label="행복 기록 저장"
                        className={`w-full py-4 border-4 border-black rounded-full font-bold text-xl bg-black text-white hover:bg-gray-800 transition shadow-xl pointer-events-auto focus:ring-4 focus:ring-yellow-300 ${error ? 'opacity-50 cursor-not-allowed' : ''} ${isSaving ? 'animate-pulse' : ''}`}
                        style={{ fontFamily: 'DungGeunMo', letterSpacing: '0.05em' }}
                        tabIndex={0}
                        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !error) handleSaveClick(); }}
                        disabled={!!error || isSaving}
                    >
                        {isSaving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            )}
        </div>
    );
} 