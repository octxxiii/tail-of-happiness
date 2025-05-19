import React, { useState } from 'react';

const tabs = [
    { name: '오늘', color: 'bg-blue-100 text-blue-700', active: 'bg-blue-500 text-white' },
    { name: '캘린더', color: 'bg-pink-100 text-pink-700', active: 'bg-pink-500 text-white' },
    { name: '통계', color: 'bg-yellow-100 text-yellow-700', active: 'bg-yellow-500 text-white' },
    { name: '내 기록', color: 'bg-green-100 text-green-700', active: 'bg-green-500 text-white' },
];

function Star({ filled }) {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#FFD600" : "none"} stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

export default function HappyApp() {
    const [activeTab, setActiveTab] = useState('오늘');
    const [happiness, setHappiness] = useState(0);
    const [memoryText, setMemoryText] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tags, setTags] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F3E6] font-sans">
            {/* 상단 탭 네비게이션 */}
            <nav className="flex justify-center space-x-2 py-4">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        className={`px-4 py-2 rounded-full font-bold transition ${activeTab === tab.name ? tab.active : tab.color}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>

            {/* 오늘의 행복 기록 카드 */}
            {activeTab === '오늘' && (
                <section className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-200">
                    <div className="flex items-center mb-4">
                        {/* 심플 일러스트는 public 폴더에 SVG로 두고 사용 */}
                        <img src="/smile-illustration.svg" alt="행복" className="w-16 h-16 mr-4" />
                        <h1 className="text-2xl font-bold">오늘의 행복한 순간</h1>
                    </div>
                    <textarea
                        className="w-full border rounded-lg p-3 mb-4"
                        placeholder="여기에 오늘의 행복을 기록해보세요!"
                        value={memoryText}
                        onChange={e => setMemoryText(e.target.value)}
                    />
                    <div className="flex items-center space-x-4 mb-4">
                        <input type="file" accept="image/*" className="block" onChange={handleImageChange} />
                        <span className="text-gray-500">사진 추가</span>
                        {imagePreview && (
                            <img src={imagePreview} alt="미리보기" className="w-16 h-16 object-cover rounded-lg border ml-2" />
                        )}
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="font-bold">행복지수</span>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <button key={i} onClick={() => setHappiness(i)} className="focus:outline-none">
                                <Star filled={happiness >= i} />
                            </button>
                        ))}
                        <span className="ml-2 text-yellow-600 font-bold">{happiness}/10</span>
                    </div>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-2 mb-4"
                        placeholder="태그(예: #소확행 #일상)"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                    />
                    <button className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold">저장하기</button>
                </section>
            )}

            {/* 캘린더/통계/내 기록 탭도 같은 스타일로 카드 추가 예정 */}
        </div>
    );
} 