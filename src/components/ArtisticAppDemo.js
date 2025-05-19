import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NoteCard from './NoteCard';
import FeedGrid from './FeedGrid';
import CalendarView from './CalendarView';
import TabNav from './TabNav';
import Modal from './Modal';

export default function ArtisticAppDemo() {
  const { state, dispatch } = useApp();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState(null);
  const [draft, setDraft] = useState({
    image: null,
    imagePreview: null,
    text: '',
    happiness: 0,
    tags: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [toast, setToast] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 오늘 뷰 (신규/수정)
  const isEdit = state.selectedId && state.tab === '오늘';
  const editingMemory = isEdit ? state.memories.find(m => m.id === state.selectedId) : null;

  // 오늘 뷰에서 수정 모드 진입 시 draft 초기화
  React.useEffect(() => {
    if (isEdit && editingMemory) {
      setDraft({
        image: null,
        imagePreview: editingMemory.image,
        text: editingMemory.text,
        happiness: editingMemory.happiness,
        tags: editingMemory.tags,
        date: editingMemory.date,
      });
    }
    if (!isEdit) {
      setDraft({ image: null, imagePreview: null, text: '', happiness: 0, tags: '', date: new Date().toISOString().slice(0, 10) });
    }
    // eslint-disable-next-line
  }, [isEdit, state.selectedId]);

  // draft 상태를 localStorage에 자동 저장
  React.useEffect(() => {
    if (state.tab === '오늘') {
      localStorage.setItem('todayDraft', JSON.stringify(draft));
    }
  }, [draft, state.tab]);

  // 오늘 탭 진입 시 localStorage에서 draft 복구
  React.useEffect(() => {
    if (state.tab === '오늘') {
      const saved = localStorage.getItem('todayDraft');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDraft(d => ({ ...d, ...parsed }));
        } catch { }
      }
    }
  }, [state.tab]);

  // 저장(신규/수정)
  const handleSave = () => {
    if (!draft.text && !draft.imagePreview) return;
    if (isEdit && editingMemory) {
      dispatch({
        type: 'UPDATE_MEMORY',
        memory: {
          ...editingMemory,
          image: draft.imagePreview,
          text: draft.text,
          happiness: draft.happiness,
          tags: draft.tags,
          date: draft.date,
        },
      });
      dispatch({ type: 'SELECT_MEMORY', id: null });
    } else {
      dispatch({
        type: 'ADD_MEMORY',
        memory: {
          id: Date.now().toString(),
          image: draft.imagePreview,
          text: draft.text,
          happiness: draft.happiness,
          tags: draft.tags,
          date: draft.date,
        },
      });
    }
    setDraft({ image: null, imagePreview: null, text: '', happiness: 0, tags: '', date: new Date().toISOString().slice(0, 10) });
    localStorage.removeItem('todayDraft');
    dispatch({ type: 'SET_TAB', tab: '리스트' });
  };

  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDraft(d => ({ ...d, image: file, imagePreview: reader.result }));
      reader.readAsDataURL(file);
    } else {
      setDraft(d => ({ ...d, image: null, imagePreview: null }));
    }
  };

  // 오늘 뷰
  const renderToday = () => (
    <div className="relative z-50">
      <NoteCard
        pageNum={state.memories.length + 1}
        imageUrl={draft.imagePreview}
        onImageChange={handleImageChange}
        text={draft.text}
        onTextChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
        happiness={draft.happiness}
        onHappinessChange={h => setDraft(d => ({ ...d, happiness: h }))}
        tags={draft.tags}
        onTagsChange={e => setDraft(d => ({ ...d, tags: e.target.value }))}
        date={draft.date}
        onDateChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
        editable
        onSave={handleSave}
        onSaved={() => {
          const faces = ['😐', '🙂', '😀', '😁', '😍'];
          setToast(`오늘의 행복이 저장되었습니다! ${faces[(draft.happiness || 1) - 1]}`);
          setTimeout(() => setToast(''), 2000);
        }}
        onFocusAny={() => setIsInputFocused(true)}
        onBlurAny={() => setIsInputFocused(false)}
      />
    </div>
  );

  // 리스트 뷰
  const renderList = () => (
    <FeedGrid
      memories={state.memories}
      onSelect={id => {
        dispatch({ type: 'SELECT_MEMORY', id });
        dispatch({ type: 'SET_TAB', tab: '상세' });
      }}
    />
  );

  // 상세 뷰
  const renderDetail = () => {
    const memory = state.memories.find(m => m.id === state.selectedId);
    if (!memory) return <div className="text-center py-12 text-gray-400">기록이 없습니다.</div>;
    return (
      <div>
        <NoteCard
          pageNum={memory.id}
          imageUrl={memory.image}
          text={memory.text}
          happiness={memory.happiness}
          tags={memory.tags}
          date={memory.date}
          editable={false}
          onDateChange={() => { }}
          onImageChange={() => { }}
          onTextChange={() => { }}
          onHappinessChange={() => { }}
          onTagsChange={() => { }}
        />
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-5 py-2 border-4 border-black rounded-full font-bold text-base bg-black text-white shadow-md hover:bg-gray-800 transition flex items-center gap-2"
            style={{ fontFamily: 'DungGeunMo' }}
            onClick={() => {
              dispatch({ type: 'SELECT_MEMORY', id: memory.id });
              dispatch({ type: 'SET_TAB', tab: '오늘' });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            수정
          </button>
          <button
            className="px-5 py-2 border-4 border-black rounded-full font-bold text-base bg-white text-black shadow-md hover:bg-red-200 transition flex items-center gap-2"
            style={{ fontFamily: 'DungGeunMo' }}
            onClick={() => {
              setMemoryToDelete(memory);
              setIsDeleteModalOpen(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            삭제
          </button>
        </div>
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            if (memoryToDelete) {
              dispatch({ type: 'DELETE_MEMORY', id: memoryToDelete.id });
              dispatch({ type: 'SET_TAB', tab: '리스트' });
            }
            setIsDeleteModalOpen(false);
            setMemoryToDelete(null);
          }}
          title="기록 삭제"
          message="정말로 이 기록을 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다."
        />
      </div>
    );
  };

  // 캘린더 뷰
  const renderCalendar = () => (
    <CalendarView
      year={state.calendarYear}
      month={state.calendarMonth}
      memories={state.memories}
      onDaySelect={day => {
        // 해당 날짜의 첫 기록으로 이동
        const found = state.memories.find(m => {
          const d = new Date(m.date);
          return d.getFullYear() === state.calendarYear && d.getMonth() === state.calendarMonth && d.getDate() === day;
        });
        if (found) {
          dispatch({ type: 'SELECT_MEMORY', id: found.id });
          dispatch({ type: 'SET_TAB', tab: '상세' });
        }
      }}
    />
  );

  return (
    <div className="min-h-screen bg-[#f8f6ef] font-['DungGeunMo','Pretendard','sans-serif']">
      <TabNav current={state.tab} onTabChange={tab => dispatch({ type: 'SET_TAB', tab })} />
      {isInputFocused && (
        <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-all animate-fade-in pointer-events-none" />
      )}
      {state.tab === '오늘' && renderToday()}
      {state.tab === '캘린더' && renderCalendar()}
      {state.tab === '리스트' && renderList()}
      {state.tab === '상세' && renderDetail()}
      {toast && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 text-lg font-bold animate-fade-in-out flex items-center gap-2" style={{ fontFamily: 'DungGeunMo' }}>
          <span className="animate-bounce text-2xl">{toast.match(/[😐🙂😀😁😍]/)?.[0]}</span>
          <span>{toast.replace(/[😐🙂😀😁😍]/, '')}</span>
        </div>
      )}
    </div>
  );
} 