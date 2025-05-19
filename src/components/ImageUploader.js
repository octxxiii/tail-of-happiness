import React, { useRef, useState } from 'react';

const FILTERS = [
    { name: '기본', value: 'none' },
    { name: '흑백', value: 'grayscale(1)' },
    { name: '세피아', value: 'sepia(0.7)' },
    { name: '만화', value: 'grayscale(1) contrast(1.8) brightness(1.2)' },
];

export default function ImageUploader({ imagePreview, onImageChange }) {
    const fileInputRef = useRef(null);
    const [filter, setFilter] = useState('none');
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    };

    const handleImageFile = (file) => {
        if (file.size > 1024 * 1024) {
            // 1MB 이상이면 리사이즈
            const img = new window.Image();
            const reader = new FileReader();
            reader.onload = (e) => {
                img.onload = () => {
                    const maxDim = 1024;
                    let { width, height } = img;
                    if (width > height) {
                        if (width > maxDim) {
                            height = Math.round(height * (maxDim / width));
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width = Math.round(width * (maxDim / height));
                            height = maxDim;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        const resizedFile = new File([blob], file.name, { type: blob.type });
                        onImageChange({ target: { files: [resizedFile] } });
                    }, file.type, 0.85);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange({ target: { files: [file] } });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={`relative w-full aspect-square border-4 border-black rounded-2xl overflow-hidden bg-gray-50 hover:bg-yellow-50 transition cursor-pointer shadow-xl ${isDragOver ? 'ring-4 ring-yellow-300' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            {/* 만화책 구름/별 스티커 */}
            <div className="absolute z-10 top-2 left-2">
                <span className="text-2xl">⭐️</span>
            </div>
            <div className="absolute z-10 bottom-2 right-2">
                <span className="text-2xl">☁️</span>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onImageChange}
                className="hidden"
            />
            {imagePreview ? (
                <div className="relative w-full h-full flex flex-col">
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover border-4 border-black rounded-xl shadow-lg"
                        style={{ filter }}
                    />
                    {/* 필터 선택 버튼 */}
                    <div className="flex justify-center gap-2 mt-2 absolute left-0 right-0 bottom-2 z-20">
                        {FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={e => { e.stopPropagation(); setFilter(f.value); }}
                                className={`px-3 py-1 rounded-full border-2 border-black bg-white text-xs font-bold shadow ${filter === f.value ? 'bg-yellow-200' : ''}`}
                                style={{ fontFamily: 'DungGeunMo' }}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition flex items-center justify-center rounded-xl">
                        <span className="text-white opacity-0 hover:opacity-100 transition" style={{ fontFamily: 'DungGeunMo' }}>
                            이미지 변경
                        </span>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-gray-500" style={{ fontFamily: 'DungGeunMo' }}>
                        이미지를 드래그하거나 클릭하세요
                    </span>
                    {isDragOver && (
                        <div className="absolute inset-0 bg-yellow-100 bg-opacity-60 flex items-center justify-center z-20 rounded-xl border-4 border-yellow-300 border-dashed animate-pulse">
                            <span className="text-xl font-bold text-yellow-700" style={{ fontFamily: 'DungGeunMo' }}>이미지 드롭!</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 