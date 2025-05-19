import React from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-4 border-black">
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'DungGeunMo' }}>{title}</h2>
                <p className="mb-6" style={{ fontFamily: 'Pretendard' }}>{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border-2 border-black rounded-full font-bold text-sm bg-white text-black hover:bg-gray-100 transition"
                        style={{ fontFamily: 'DungGeunMo' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 border-2 border-black rounded-full font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition"
                        style={{ fontFamily: 'DungGeunMo' }}
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
} 