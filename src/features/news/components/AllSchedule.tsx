import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

export interface ScheduleItem {
  id: string;
  date: string; 
  title: string;
  description: string;
  type: 'birthday' | 'comeback' | 'concert' | 'broadcast' | 'event';
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export function AllSchedule() {
  const { data: events, loading } = useJsonData<ScheduleItem[]>('schedules');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  const parseKST = (isoString: string) => {
    const utcDate = new Date(isoString);
    const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    return {
      dateStr: kstDate.toISOString().split('T')[0],
      timeStr: kstDate.toISOString().split('T')[1].substring(0, 5)
    };
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getEventForDate = (day: number) => {
    if (!events) return undefined;
    const target = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find((e) => parseKST(e.date).dateStr === target);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'comeback': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      default: return '📅';
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">일정을 불러오는 중...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h3>
        <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-50 rounded-lg"><ChevronLeft className="w-5 h-5"/></button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-50 rounded-lg"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 달력 본체 */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-7 mb-4 border-b border-gray-50 pb-2">
            {weekDays.map(d => (
              <div key={d} className={`text-center text-xs font-bold uppercase tracking-widest ${d === '일' ? 'text-red-400' : d === '토' ? 'text-blue-400' : 'text-gray-300'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={i} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const event = getEventForDate(day);
              const isSelected = selectedEvent && parseKST(selectedEvent.date).dateStr.endsWith(`-${String(day).padStart(2, '0')}`);
              return (
                <button key={day} onClick={() => event && setSelectedEvent(event)} className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${event ? 'hover:bg-purple-50 cursor-pointer' : 'cursor-default'} ${isSelected ? 'bg-purple-600 text-white shadow-lg' : ''}`}>
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>{day}</span>
                  {event && !isSelected && <div className="mt-1 text-lg">{getEventIcon(event.type)}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-purple-50 flex flex-col items-center justify-center text-center">
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center text-5xl mb-6 mx-auto">{getEventIcon(selectedEvent.type)}</div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full mb-3 inline-block">{selectedEvent.type}</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedEvent.title}</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">"{selectedEvent.description}"</p>
              <div className="flex justify-center gap-4 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5"/>{parseKST(selectedEvent.date).timeStr}</div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5"/>{selectedEvent.type === 'concert' ? '서울' : '온라인'}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300"><CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20"/><p>날짜를 선택하면 일정이 표시됩니다</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
