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

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  const { data: events, loading } = useJsonData<ScheduleItem[]>('schedules');
  
  // 현재 날짜를 데이터에 맞춰 2026년 1월로 설정
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // UTC -> KST 변환
  const parseKST = (isoString: string) => {
    const utcDate = new Date(isoString);
    const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    return {
      dateObj: kstDate,
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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  const getEventForDate = (day: number) => {
    if (!events) return undefined;
    const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find((event) => parseKST(event.date).dateStr === targetDateStr);
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

  const getEventColorStyles = (type: string) => {
    switch (type) {
      case 'birthday': return 'bg-pink-50 text-pink-600 border-pink-100';
      case 'comeback': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'concert': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'broadcast': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-4 space-y-4">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          {monthNames[currentDate.getMonth()]} 
          <span className="font-light text-gray-400">{currentDate.getFullYear()}</span>
        </h3>
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
          <button onClick={previousMonth} className="p-1.5 hover:bg-gray-50 rounded-md text-gray-500 hover:text-purple-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-50 rounded-md text-gray-500 hover:text-purple-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {/* 2. Main Content (좌우 레이아웃 복구) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Calendar Grid (테두리 없는 미니멀 스타일) */}
        <div className="flex-[3] bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">{d}</div>
            ))}
          </div>
          
          <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const event = getEventForDate(day);
              const isSelected = selectedEvent && parseKST(selectedEvent.date).dateStr.endsWith(`-${String(day).padStart(2, '0')}`);

              return (
                <button
                  key={day}
                  onClick={() => event && setSelectedEvent(event)}
                  className={`
                    relative flex flex-col items-center justify-start pt-2 rounded-2xl transition-all duration-200
                    ${event ? 'hover:bg-purple-50 cursor-pointer' : 'hover:bg-gray-50/50 cursor-default'}
                    ${isSelected ? 'bg-purple-50 ring-2 ring-purple-100 z-10' : ''}
                  `}
                >
                  <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors mb-1
                    ${isSelected ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600'}
                  `}>
                    {day}
                  </span>
                  
                  {event && (
                    <div className="flex flex-col items-center w-full px-1">
                      <span className="text-lg transform group-hover:scale-110 transition-transform">{getEventIcon(event.type)}</span>
                      <span className={`text-[10px] w-full truncate text-center px-1 rounded-md mt-0.5 font-medium
                        ${event.type === 'birthday' ? 'text-pink-500 bg-pink-50' : 
                          event.type === 'broadcast' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 bg-gray-100'}
                      `}>
                        {event.title}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detail Sidebar (우측 고정) */}
        <div className="flex-1 lg:max-w-xs bg-white/80 backdrop-blur-sm rounded-3xl border border-purple-100 shadow-sm p-6 flex flex-col h-full">
          <h4 className="text-gray-800 font-bold mb-6 flex items-center gap-2">Details</h4>
          
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                <span className="text-6xl drop-shadow-sm">{getEventIcon(selectedEvent.type)}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border mb-2 ${getEventColorStyles(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">{selectedEvent.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="space-y-3 pt-2 text-sm text-gray-500">
                   <div className="flex items-center gap-3">
                     <Clock className="w-4 h-4 text-purple-400" />
                     <span className="font-medium">{parseKST(selectedEvent.date).timeStr} (KST)</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <MapPin className="w-4 h-4 text-purple-400" />
                     <span>{selectedEvent.type === 'concert' ? 'Seoul, Korea' : 'Online Broadcast'}</span>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-3">
              <CalendarIcon className="w-12 h-12 stroke-1" />
              <p className="text-sm font-light text-center">날짜를 선택하여<br/>상세 정보를 확인하세요</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
