import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Info, Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'birthday' | 'album' | 'concert' | 'broadcast' | 'event';
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  const { data: schedules } = useJsonData<ScheduleItem[]>('schedules');
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules]);

  const { daysInMonth, startingDayOfWeek } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  }, [currentDate]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  const getEventsForDate = (day: number) => {
    if (!schedules) return null;
    return schedules.find((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === currentDate.getFullYear() &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getDate() === day
      );
    });
  };

  const getEventIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'album': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      case 'event': return '🎉';
      default: return '📅';
    }
  };

  const getEventColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return 'bg-pink-100 text-pink-600 ring-pink-200';
      case 'album': return 'bg-purple-100 text-purple-600 ring-purple-200';
      case 'concert': return 'bg-blue-100 text-blue-600 ring-blue-200';
      case 'broadcast': return 'bg-yellow-100 text-yellow-700 ring-yellow-200';
      default: return 'bg-green-100 text-green-600 ring-green-200';
    }
  };

  return (
    // [1] 최상위: 화면보다 내용이 크면 '전체 가로 스크롤' 생성 (내용물 찌그러짐 방지)
    <div className="w-full h-full p-6 overflow-x-auto bg-transparent">
      
      {/* [2] 레이아웃 고정: 최소 너비를 1400px로 강제하여 3단 구조 유지 */}
      <div className="min-w-[1400px] h-[640px] flex flex-row gap-6">
        
        {/* =========================================
            1. Left Column: List (너비 360px 고정) 
           ========================================= */}
        <div className="w-[360px] flex-shrink-0 bg-white/70 backdrop-blur-xl rounded-[32px] p-6 shadow-sm border border-white/60 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-5 pl-1">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-gray-800 font-bold text-lg">Upcoming</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentDate(new Date(event.date));
                }}
                className={`
                  w-full p-4 rounded-2xl transition-all duration-200 text-left border relative group
                  flex items-start gap-4
                  ${selectedEvent?.id === event.id 
                    ? 'bg-white shadow-md border-purple-100 translate-x-1' 
                    : 'bg-white/40 hover:bg-white hover:border-purple-50 border-transparent'}
                `}
              >
                {selectedEvent?.id === event.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-purple-400 rounded-r-full" />
                )}
                
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-purple-50 transition-colors">
                  {getEventIcon(event.type)}
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold truncate mb-0.5 ${selectedEvent?.id === event.id ? 'text-purple-700' : 'text-gray-700'}`}>
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
            2. Center Column: Calendar (유연하게 늘어남) 
           ========================================= */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-sm border border-purple-50 flex flex-col h-full">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-gray-800 font-bold flex items-center gap-3 text-2xl tracking-tight">
              <CalendarIcon className="w-6 h-6 text-purple-500" />
              {monthNames[currentDate.getMonth()]} 
              <span className="text-purple-300 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="w-10 h-10 hover:bg-purple-50 rounded-full flex items-center justify-center transition-all border border-transparent hover:border-purple-100">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="w-10 h-10 hover:bg-purple-50 rounded-full flex items-center justify-center transition-all border border-transparent hover:border-purple-100">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-3 flex-1 content-start">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const event = getEventsForDate(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
              const isSelected = selectedEvent && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

              return (
                <button
                  key={day}
                  onClick={() => event && setSelectedEvent(event)}
                  className={`
                    w-full h-full min-h-[60px] rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 group
                    ${event 
                      ? `${getEventColor(event.type).split(' ')[0]} ${getEventColor(event.type).split(' ')[1]} hover:scale-105 shadow-sm hover:shadow-md cursor-pointer` 
                      : 'hover:bg-gray-50 text-gray-400'}
                    ${isToday ? 'ring-2 ring-purple-400 ring-offset-2 z-10' : ''}
                    ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 z-10 scale-95' : ''}
                  `}
                >
                  <span className={`text-sm mb-1 ${event ? 'font-bold' : ''}`}>{day}</span>
                  {event && <span className="text-sm group-hover:-translate-y-1 transition-transform">{getEventIcon(event.type)}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================
            3. Right Column: Detail (너비 360px 고정) 
           ========================================= */}
        <div className="w-[360px] flex-shrink-0 bg-white/70 backdrop-blur-xl rounded-[32px] p-8 shadow-sm border border-white/60 flex flex-col justify-center text-center h-full relative overflow-hidden">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center justify-center">
               {/* Background Icon Effect */}
               <div className="absolute -top-12 -right-12 text-[180px] opacity-[0.03] pointer-events-none grayscale select-none rotate-12">
                 {getEventIcon(selectedEvent.type)}
               </div>

               <div className="w-28 h-28 mx-auto bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-6xl mb-8 border border-purple-50 relative z-10">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-bold uppercase tracking-widest border border-purple-100">
                {selectedEvent.type}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight break-keep px-4">
                {selectedEvent.title}
              </h2>
              
              <p className="text-sm text-gray-500 mb-10 leading-relaxed px-4 line-clamp-4">
                {selectedEvent.description}
              </p>

              <div className="w-full bg-white/60 rounded-3xl p-6 text-left border border-white/80 space-y-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Date</p>
                    <p className="text-sm font-bold text-gray-700 mt-0.5">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Location</p>
                    <p className="text-sm font-bold text-gray-700 mt-0.5">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col items-center gap-4 select-none opacity-50">
              <Info className="w-16 h-16 opacity-20" />
              <p className="text-sm font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
