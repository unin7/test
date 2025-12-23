import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

// 인터페이스 정의
export interface ScheduleItem {
  id: string;
  date: string; // ISO String (UTC)
  title: string;
  description: string;
  type: 'birthday' | 'comeback' | 'concert' | 'broadcast' | 'event';
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  const { data: events, loading } = useJsonData<ScheduleItem[]>('schedules');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // UTC -> KST 변환 유틸리티
  const parseKST = (isoString: string) => {
    const utcDate = new Date(isoString);
    const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    return {
      dateObj: kstDate,
      dateStr: kstDate.toISOString().split('T')[0], // YYYY-MM-DD
      timeStr: kstDate.toISOString().split('T')[1].substring(0, 5) // HH:mm
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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  // 날짜 매칭 (KST 기준)
  const getEventForDate = (day: number) => {
    if (!events) return undefined;
    const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find((event) => parseKST(event.date).dateStr === targetDateStr);
  };

  // 스타일 헬퍼
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'comeback': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      default: return '📅';
    }
  };

  const getEventColorStyles = (type: string) => {
    switch (type) {
      case 'birthday': return 'bg-pink-50 text-pink-600 border-pink-200';
      case 'comeback': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'concert': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'broadcast': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 1. Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          {monthNames[currentDate.getMonth()]} 
          <span className="font-light text-gray-400">{currentDate.getFullYear()}</span>
        </h3>
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
          <button onClick={previousMonth} className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-50 hover:text-purple-600 rounded-md transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {/* 2. Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* 달력 그리드 */}
        <div className="flex-[3] bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-2 gap-y-4">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const event = getEventForDate(day);
              const isToday = day === 9; // 오늘 날짜 예시
              const isSelected = selectedEvent && parseKST(selectedEvent.date).dateStr.endsWith(`-${String(day).padStart(2, '0')}`);

              return (
                <button
                  key={day}
                  onClick={() => event && setSelectedEvent(event)}
                  className={`
                    group relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 min-h-[80px]
                    ${event ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}
                    ${isSelected ? 'bg-purple-50 ring-1 ring-purple-200' : ''}
                  `}
                >
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 transition-colors ${isToday ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 group-hover:text-purple-600'}`}>{day}</span>
                  {event && (
                    <div className="flex flex-col items-center gap-0.5 w-full">
                      <span className="text-lg transform group-hover:scale-110 transition-transform">{getEventIcon(event.type)}</span>
                      <span className="text-[10px] w-full truncate text-center px-1 text-gray-500 bg-gray-100/50 rounded-md">{event.title}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 상세 정보 사이드바 */}
        <div className="flex-1 lg:max-w-xs bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-sm p-6 flex flex-col h-fit">
          <h4 className="text-gray-800 font-bold mb-6 flex items-center gap-2">Details</h4>
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4 border border-gray-100">
                <span className="text-5xl drop-shadow-sm">{getEventIcon(selectedEvent.type)}</span>
              </div>
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getEventColorStyles(selectedEvent.type)}`}>{selectedEvent.type.toUpperCase()}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{selectedEvent.title}</h3>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{selectedEvent.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-purple-400" />{parseKST(selectedEvent.date).timeStr} (KST)</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" />{selectedEvent.type === 'concert' ? 'Seoul' : 'Online / Broadcast'}</div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 opacity-60"><CalendarIcon className="w-12 h-12 mx-auto mb-2 stroke-1" /><p className="text-sm">Select a date</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
