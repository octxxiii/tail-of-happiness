import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';

export default function DetailView({ memory, onEdit, onDelete, onClose }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [relatedMemories, setRelatedMemories] = useState([]);

    const handleShare = async () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1200;
            canvas.height = 630;

            // 배경
            ctx.fillStyle = '#f8f6ef';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 이미지
            if (memory.image) {
                const img = new Image();
                img.src = memory.image;
                await new Promise(resolve => img.onload = resolve);
                ctx.drawImage(img, 50, 50, 500, 500);
            }

            // 텍스트
            ctx.fillStyle = '#000';
            ctx.font = 'bold 48px DungGeunMo';
            ctx.fillText(memory.text, 600, 200);

            // 날짜
            ctx.font = '32px DungGeunMo';
            ctx.fillText(new Date(memory.date).toLocaleDateString('ko-KR'), 600, 300);

            // 행복도
            ctx.font = '48px DungGeunMo';
            ctx.fillText('★'.repeat(memory.happiness) + '☆'.repeat(5 - memory.happiness), 600, 400);

            // 태그
            ctx.font = '32px DungGeunMo';
            memory.tags.split(',').forEach((tag, i) => {
                ctx.fillText(`#${tag.trim()}`, 600, 500 + i * 50);
            });

            // 이미지를 Blob으로 변환
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'memory.png', { type: 'image/png' });

            // 공유
            if (navigator.share) {
                await navigator.share({
                    title: '나의 행복한 순간',
                    text: memory.text,
                    files: [file]
                });
            } else {
                // 공유 API를 지원하지 않는 경우 다운로드
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'memory.png';
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('공유 중 오류 발생:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-4"
        >
            <div className="bg-white border-4 border-black rounded-lg shadow-lg overflow-hidden">
                {/* 헤더 */}
                <div className="p-6 border-b-4 border-black">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold" style={{ fontFamily: 'DungGeunMo' }}>
                            {new Date(memory.date).toLocaleDateString('ko-KR')}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 컨텐츠 */}
                <div className="p-6">
                    <div className="aspect-square border-4 border-black rounded-lg overflow-hidden mb-6">
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
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg" style={{ fontFamily: 'Pretendard' }}>
                            {memory.text}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ fontFamily: 'DungGeunMo' }}>행복도:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className="text-2xl">
                                        {star <= memory.happiness ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {memory.tags.split(',').map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-sm bg-gray-100 border-2 border-black"
                                    style={{ fontFamily: 'DungGeunMo' }}
                                >
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="p-6 border-t-4 border-black flex justify-center gap-4">
                    <button
                        onClick={onEdit}
                        className="px-6 py-3 border-4 border-black rounded-full font-bold text-lg bg-black text-white hover:bg-gray-800 transition flex items-center gap-2"
                        style={{ fontFamily: 'DungGeunMo' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        수정하기
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-6 py-3 border-4 border-black rounded-full font-bold text-lg bg-white text-black hover:bg-red-200 transition flex items-center gap-2"
                        style={{ fontFamily: 'DungGeunMo' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        삭제하기
                    </button>
                </div>
            </div>

            {/* 삭제 확인 모달 */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete();
                    setIsDeleteModalOpen(false);
                }}
                title="기록 삭제"
                message="정말로 이 기록을 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다."
            />

            {/* 공유 모달 */}
            <Modal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                onConfirm={() => {
                    handleShare();
                    setIsShareModalOpen(false);
                }}
                title="기록 공유"
                message="이 기록을 이미지로 공유하시겠습니까?"
            />
        </motion.div>
    );
} 