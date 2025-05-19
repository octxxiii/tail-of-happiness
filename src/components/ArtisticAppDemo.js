import React, { useState, useEffect } from 'react';

const ArtisticAppDemo = () => {
  const [screen, setScreen] = useState('calendar');
  const [loading, setLoading] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [hoverButton, setHoverButton] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [transitionType, setTransitionType] = useState(null);
  const [fromScreen, setFromScreen] = useState(null);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const displayDay = selectedDay || today.getDate();
  const displayMonth = month + 1;

  // NEW MEMORY 입력 상태
  const [memoryText, setMemoryText] = useState("");
  const [memoryDate, setMemoryDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [happiness, setHappiness] = useState(0);
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const transition = (to, type, from = null) => {
    setTransitionType(type);
    setFromScreen(from || screen);
    setTimeout(() => {
      setScreen(to);
      setTimeout(() => {
        setTransitionType(null);
      }, 600);
    }, 400);
  };

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => {
      setGlitchActive(false);
    }, 400);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200
            border border-black text-black`}
          style={{
            animationDelay: `${i * 50}ms`,
            animation: loading ? 'none' : 'fadeInCalendar 0.5s forwards'
          }}
          onClick={() => {
            setSelectedDay(i);
            triggerGlitch();
          }}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const renderNoisePoints = (count) => {
    const points = [];

    for (let i = 0; i < count; i++) {
      points.push(
        <div
          key={i}
          className="absolute bg-black opacity-80"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      );
    }

    return points;
  };

  const renderScanlines = () => {
    const lines = [];
    for (let i = 0; i < 100; i += 4) {
      lines.push(
        <div
          key={i}
          className="absolute left-0 right-0 h-px bg-black opacity-10"
          style={{ top: `${i}%` }}
        />
      );
    }

    lines.push(
      <div
        key="active-scanline"
        className="absolute left-0 right-0 h-1 bg-black opacity-20"
        style={{ 
          top: '0%',
          animation: 'moveScanline 10s linear infinite'
        }}
      />
    );

    return lines;
  };

  // HAPPINESS INDEX 계산 (데이터 없으면 0)
  const happinessAvg = 0; // 실제 데이터 연동 시 평균값으로 대체

  // 이미지 업로드 핸들러
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

  // SAVE 버튼 클릭 시
  const handleSave = () => {
    const data = {
      text: memoryText,
      date: memoryDate,
      happiness,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      image,
    };
    console.log('NEW MEMORY:', data);
    triggerGlitch();
    setTimeout(() => {
      transition(fromScreen || 'calendar', 'noise');
    }, 300);
  };

  return (
    <div className="font-mono relative">
      <div className="w-full h-full max-w-sm mx-auto relative bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {renderScanlines()}
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
            <div className="text-white text-xl">LOADING...</div>
            <div className="absolute inset-0 opacity-30">
              {renderNoisePoints(100)}
            </div>
          </div>
        )}

        {transitionType && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            {transitionType === 'glitch' && (
              <div className="absolute inset-0 bg-black opacity-20" 
                style={{ animation: 'glitch 0.3s infinite' }}>
                {renderNoisePoints(50)}
              </div>
            )}
            {transitionType === 'noise' && (
              <div className="absolute inset-0 opacity-70">
                {renderNoisePoints(200)}
              </div>
            )}
          </div>
        )}

        <div className="h-4 bg-gray-200 repeating-text text-xs">
          <span>TRAGEDY IS NEAR LIFE FAR FROM COMEDY TRAGEDY IS NEAR LIFE FAR FROM COMEDY </span>
        </div>

        {screen === 'calendar' && (
          <div className="min-h-screen flex flex-col">
            <div className="h-24 bg-black flex justify-center items-center relative">
              <div className="flex items-center space-x-8">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-black"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-black"></div>
                </div>
              </div>
              <div className="absolute bottom-2 right-4 text-white text-xs">TRAGEDY IS NEAR</div>
            </div>

            <div className="h-4 bg-gray-200 repeating-text text-xs">
              <span>TRAGEDY IS NEAR LIFE FAR FROM COMEDY TRAGEDY IS NEAR LIFE FAR FROM COMEDY </span>
            </div>

            <div className="p-4 flex-1">
              <div className="bg-black text-white text-center py-2 mb-4 text-sm font-bold"
                style={{ 
                  opacity: loading ? 0 : 1,
                  transform: loading ? 'translateY(10px)' : 'translateY(0)',
                  transition: 'opacity 0.5s, transform 0.5s'
                }}>
                MEMORY CALENDAR
              </div>

              <div className="flex justify-between items-center mb-4"
                style={{ 
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.5s 0.2s'
                }}>
                <button 
                  className={`w-8 h-8 bg-black text-white text-center
                    ${hoverButton === 'prev' ? 'transform scale-95 opacity-80' : ''}`}
                  onMouseEnter={() => setHoverButton('prev')}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={() => { triggerGlitch(); handlePrevMonth(); }}>
                  &lt;
                </button>
                <div className="text-black font-bold">{displayMonth}월</div>
                <button 
                  className={`w-8 h-8 bg-black text-white text-center
                    ${hoverButton === 'next' ? 'transform scale-95 opacity-80' : ''}`}
                  onMouseEnter={() => setHoverButton('next')}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={() => { triggerGlitch(); handleNextMonth(); }}>
                  &gt;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1"
                style={{ 
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.5s 0.3s'
                }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="w-8 h-8 flex items-center justify-center text-black font-bold text-xs">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1"
                style={{ 
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.5s 0.4s'
                }}>
                {renderCalendarDays()}
              </div>

              <div className="border border-black p-3 mt-4"
                style={{ 
                  opacity: loading ? 0 : 1,
                  transform: loading ? 'translateY(10px)' : 'translateY(0)',
                  transition: 'opacity 0.5s 0.6s, transform 0.5s 0.6s'
                }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold">HAPPINESS INDEX</div>
                  <div className="w-4 h-4 rounded-full bg-black relative">
                    <div className="absolute inset-1 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-1 mb-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div
                      key={i}
                      className={`w-4 h-4 border border-black`}
                      style={{
                        opacity: loading ? 0 : 1,
                        transition: `opacity 0.5s ${0.6 + i * 0.05}s`,
                        backgroundColor: i <= happinessAvg ? '#000' : 'transparent'
                      }}
                    ></div>
                  ))}
                </div>
                <div className="text-center text-xs">{happinessAvg}/10</div>
              </div>

              <div className="flex justify-between mt-6"
                style={{ 
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.5s 0.8s'
                }}>
                <button 
                  className={`bg-black text-white px-3 py-2 text-xs
                    ${glitchActive ? 'animate-glitch' : ''}
                    ${hoverButton === 'list' ? 'transform scale-95 opacity-80' : ''}`}
                  onMouseEnter={() => setHoverButton('list')}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={() => {
                    triggerGlitch();
                    transition('list', 'noise');
                  }}>
                  LIST VIEW
                </button>
                <button 
                  className={`bg-black text-white px-3 py-2 text-xs
                    ${glitchActive ? 'animate-glitch' : ''}
                    ${hoverButton === 'new' ? 'transform scale-95 opacity-80' : ''}`}
                  onMouseEnter={() => setHoverButton('new')}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={() => {
                    triggerGlitch();
                    transition('record', 'noise');
                  }}>
                  NEW MEMORY
                </button>
              </div>
            </div>

            <div className="h-4 bg-gray-200 repeating-text text-xs mt-auto">
              <span>TRAGEDY IS NEAR LIFE FAR FROM COMEDY TRAGEDY IS NEAR LIFE FAR FROM COMEDY </span>
            </div>
          </div>
        )}

        {screen === 'list' && (
          <div className="vintage-container min-h-screen flex flex-col">
            <div className="grid-pattern"></div>

            <div className="registration-marks">
              <div className="registration-mark top-left-mark"></div>
              <div className="registration-mark top-right-mark"></div>
              <div className="registration-mark bottom-left-mark"></div>
              <div className="registration-mark bottom-right-mark"></div>
            </div>

            <div className="content-area flex flex-col min-h-screen">
              <div className="p-4 border-b-2 border-black flex justify-between items-center">
                <div className="text-sm font-bold">MEMORY ARCHIVE</div>
                <div className="text-xs">CREATED: 03.2025</div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="vintage-border mb-6 relative p-3">
                  <h1 className="text-xl font-bold text-center">GALLERY VIEW</h1>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[...Array(9)].map((_, i) => {
                    const isBlack = i === 5 || i === 6;
                    const borderStyle = i % 3 === 2 ? "border-dashed" : "border-solid";

                    return (
                      <div 
                        key={i} 
                        className={`vintage-border ${borderStyle} cursor-pointer overflow-hidden relative`}
                        style={{
                          animation: loading ? 'none' : 'fadeInCalendar 0.3s forwards',
                          animationDelay: `${i * 60}ms`,
                          aspectRatio: '1',
                          backgroundColor: isBlack ? '#000' : '#FFF',
                        }}
                        onClick={() => {
                          setSelectedDay(15 + (i % 4));
                          triggerGlitch();
                          setTimeout(() => {
                            transition('detail', 'glitch', 'list');
                          }, 300);
                        }}
                      >
                        {i === 5 ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2/3 h-1/2 relative">
                              {[...Array(5)].map((_, dotIndex) => (
                                <div 
                                  key={dotIndex} 
                                  className="absolute bg-white rounded-full"
                                  style={{
                                    width: `${8 + Math.random() * 10}px`,
                                    height: `${8 + Math.random() * 10}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        ) : i === 6 ? (
                          <div className="w-full h-full flex items-end justify-center pb-8">
                            <div className="w-1/2 h-8 bg-white" style={{ borderRadius: '100% 100% 0 0' }}></div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                            {i + 1}/9
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 text-xs" style={{ color: isBlack ? 'white' : 'black' }}>
                          03.{15 + (i % 15)}.25
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="vintage-border p-3 mb-6 text-xs leading-tight">
                  <p className="mb-2" style={{ fontSize: '10px' }}>
                    people with borderline traits tend to lack a sense of emotional permanence.
                    they believe, with all their hearts, that they will always be abandoned one day,
                    and they will wait, with the vigilance and the discipline of the chronically wounded,
                    for the signs that they should excise themselves from the situation immediately.
                  </p>
                  <div className="flex justify-end">
                    <div className="text-right text-xs opacity-50">printed memory archive / 03.2025</div>
                  </div>
                </div>

                <div className="flex justify-between mt-auto">
                  <button 
                    className={`vintage-button
                      ${hoverButton === 'calendar' ? 'transform scale-95' : ''}`}
                    onMouseEnter={() => setHoverButton('calendar')}
                    onMouseLeave={() => setHoverButton(null)}
                    onClick={() => {
                      triggerGlitch();
                      transition('calendar', 'glitch');
                    }}>
                    CALENDAR VIEW
                  </button>
                  <button 
                    className={`vintage-button
                      ${hoverButton === 'newFromList' ? 'transform scale-95' : ''}`}
                    onMouseEnter={() => setHoverButton('newFromList')}
                    onMouseLeave={() => setHoverButton(null)}
                    onClick={() => {
                      triggerGlitch();
                      transition('record', 'noise');
                    }}>
                    NEW MEMORY
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-black p-2 flex justify-between items-center">
                <div className="text-xs opacity-70">MEMORIES: 9</div>
                <div className="text-xs opacity-70">PAGE 01/01</div>
              </div>
            </div>
          </div>
        )}

        {screen === 'record' && (
          <div className="min-h-screen flex flex-col" style={{
            backgroundColor: '#f5f3e6',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          }}>
            <div className="h-4 bg-black text-gray-200 repeating-text text-xs">
              <span>LAYER 02 TRAGEDY IS NEAR LAYER 02 TRAGEDY IS NEAR </span>
            </div>

            <div className="h-12 bg-black flex items-center justify-around">
              <div className="w-6 h-6 border border-white grid grid-cols-3 gap-px">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white"></div>
                ))}
              </div>
              <div className="w-6 h-6 flex flex-col space-y-px">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-1 bg-white"></div>
                ))}
              </div>
              <div className="w-6 h-6 rounded-full border border-white"></div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="border-2 border-black text-black text-center py-2 mb-4 text-sm font-bold relative">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                NEW MEMORY
              </div>

              {/* 이미지 업로드/미리보기 */}
              <div className="border-2 border-black h-32 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="max-h-full max-w-full object-contain" />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span>TAP TO SELECT IMAGE</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              {/* 메모리 텍스트 입력 */}
              <div className="border-2 border-black h-24 mb-4 relative">
                <div className="absolute inset-0 bg-black opacity-5"></div>
                <textarea
                  className="w-full h-full bg-transparent outline-none resize-none text-xs p-2"
                  placeholder="ENTER MEMORY..."
                  value={memoryText}
                  onChange={e => setMemoryText(e.target.value)}
                />
              </div>

              {/* 날짜 선택 */}
              <div className="flex items-center mb-4">
                <label className="text-xs font-bold mr-2">DATE</label>
                <input
                  type="date"
                  className="border border-black rounded px-2 py-1 text-xs"
                  value={memoryDate}
                  onChange={e => setMemoryDate(e.target.value)}
                />
              </div>

              {/* 행복 지수 선택 */}
              <div className="flex items-center mb-4">
                <label className="text-xs font-bold mr-2">HAPPINESS</label>
                <div className="flex space-x-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <button
                      key={i}
                      type="button"
                      className={`w-5 h-5 border border-black text-xs flex items-center justify-center ${happiness >= i ? 'bg-black text-white' : 'bg-white text-black'}`}
                      onClick={() => setHappiness(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-xs">{happiness}/10</span>
              </div>

              {/* 태그 입력 */}
              <div className="flex items-center mb-4">
                <label className="text-xs font-bold mr-2">TAGS</label>
                <input
                  type="text"
                  className="border border-black rounded px-2 py-1 text-xs flex-1"
                  placeholder="예: 감정, 추억, 일상"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                />
              </div>

              {/* 저장/취소 버튼 */}
              <div className="flex justify-between mt-auto">
                <button 
                  className={`bg-black text-white px-3 py-2 text-xs border-2 border-black
                    ${hoverButton === 'cancel' ? 'transform scale-95 opacity-80' : ''}`}
                  onMouseEnter={() => setHoverButton('cancel')}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={() => {
                    triggerGlitch();
                    transition(fromScreen || 'calendar', 'glitch');
                  }}>
                  CANCEL
                </button>
                <button 
                  className={`bg-black text-white px-3 py-2 text-xs border-2 border-black
                    ${hoverButton === 'save' ? 'transform scale-95 opacity-80' : ''}`}
                  onMouseEnter={() => setHoverButton('save')}
                  onMouseLeave={() => setHoverButton(null)}
                  onClick={handleSave}
                >
                  SAVE
                </button>
              </div>
            </div>

            <div className="h-4 bg-black text-gray-200 repeating-text text-xs mt-auto">
              <span>LAYER 02 TRAGEDY IS NEAR LAYER 02 TRAGEDY IS NEAR </span>
            </div>
          </div>
        )}

        {screen === 'detail' && (
          <div className="vintage-container min-h-screen flex flex-col">
            <div className="grid-pattern"></div>

            <div className="registration-marks">
              <div className="registration-mark top-left-mark"></div>
              <div className="registration-mark top-right-mark"></div>
              <div className="registration-mark bottom-left-mark"></div>
              <div className="registration-mark bottom-right-mark"></div>
            </div>

            <div className="content-area flex flex-col min-h-screen">
              <div className="p-4 border-b-2 border-black flex justify-between items-center">
                <div className="text-sm font-bold">MEMORY DETAILS</div>
                <div className="text-xs">REF: #{selectedDay || 15}.03.25</div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="vintage-border mb-6 p-3">
                  <h1 className="text-xl font-bold">MEMORY #{selectedDay || 15}</h1>
                  <div className="text-xs text-black opacity-60 mt-1">CREATED: 03.{selectedDay || 15}.2025 AT 14:32</div>
                </div>

                <div className="vintage-border mb-6 relative">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="opacity-30 text-sm">IMAGE PLACEHOLDER</div>
                  </div>
                  <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-white border border-black">
                    REF-IMG-{selectedDay || 15}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="vintage-border p-3">
                    <div className="text-xs font-bold mb-1">DATE</div>
                    <div className="text-sm">03.{selectedDay || 15}.2025</div>
                  </div>
                  <div className="vintage-border p-3">
                    <div className="text-xs font-bold mb-1">TYPE</div>
                    <div className="text-sm">MEMORY</div>
                  </div>
                  <div className="vintage-border p-3">
                    <div className="text-xs font-bold mb-1">MOOD</div>
                    <div className="text-sm">NOSTALGIC</div>
                  </div>
                </div>

                <div className="vintage-border p-3 mb-6">
                  <div className="text-xs font-bold mb-2">DESCRIPTION</div>
                  <div className="text-sm mb-3">
                    TODAY I WITNESSED LIFE<br/>
                    FAR FROM COMEDY;<br/>
                    TRAGEDY WAS NEAR.<br/>
                  </div>
                  <div className="text-xs opacity-70">
                    people with borderline traits tend to lack a sense of emotional permanence.
                    they believe, with all their hearts, that they will always be abandoned one day.
                  </div>
                </div>

                <div className="vintage-border p-3 mb-6">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="font-bold mb-1">LOCATION</div>
                      <div>UNKNOWN</div>
                    </div>
                    <div>
                      <div className="font-bold mb-1">TAGS</div>
                      <div>NOSTALGIA, LIFE</div>
                    </div>
                    <div>
                      <div className="font-bold mb-1">HAPPINESS</div>
                      <div>6/10</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-auto">
                  <button 
                    className="vintage-button"
                    onClick={() => {
                      triggerGlitch();
                      transition(fromScreen || 'list', 'glitch');
                    }}>
                    BACK
                  </button>
                  <button 
                    className="vintage-button"
                    onClick={() => {
                      triggerGlitch();
                      transition('record', 'noise', 'detail');
                    }}>
                    EDIT
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-black p-2 flex justify-between items-center">
                <div className="text-xs opacity-70">MEMORY #{selectedDay || 15} OF 46</div>
                <div className="text-xs opacity-70">PRINTED ON 03.28.2025</div>
              </div>
            </div>
          </div>
        )}

        {glitchActive && (
          <div 
            className="absolute inset-0 pointer-events-none z-30" 
            style={{ animation: 'glitch 0.1s infinite' }}>
            {renderNoisePoints(30)}
            <div className="absolute w-full h-1 bg-white opacity-20" 
              style={{ top: '30%' }}></div>
            <div className="absolute w-full h-2 bg-white opacity-20" 
              style={{ top: '70%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisticAppDemo; 