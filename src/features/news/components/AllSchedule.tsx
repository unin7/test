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
    // [1] 최상위 컨테이너: 가로 스크롤 허용 (overflow-x-auto)
    <div className="w-full h-full p-4 overflow-x-auto">
      
      {/* [2] 배치 컨테이너: Flex Row 강제 + 최소 너비 1200px 고정 
          -> 화면이 좁아도 절대 세로로 떨어지지 않고 스크롤이 생김 */}
      <div className="min-w-[1200px] h-[600px] flex flex-row gap-5">
        
        {/* 1. Left: List (고정 너비 280px) */}
        <div className="w-[280px] shrink-0 bg-white/60 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white/50 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pl-1">
            <Clock className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-sm">Upcoming</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentDate(new Date(event.date));
                }}
                className={`
                  w-full p-3 rounded-2xl transition-all text-left border relative group
                  ${selectedEvent?.id === event.id 
                    ? 'bg-white shadow-md border-purple-100 scale-[1.02] z-10' 
                    : 'bg-white/40 hover:bg-white hover:border-purple-50 border-transparent'}
                `}
              >
                {selectedEvent?.id === event.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full" />
                )}
                <div className="flex items-start gap-3 pl-2">
                   <span className="text-xl leading-none mt-0.5">{getEventIcon(event.type)}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${selectedEvent?.id === event.id ? 'text-purple-700' : 'text-gray-700'}`}>
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Center: Calendar (유연한 너비 flex-1) */}
        <div className="flex-1 bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-purple-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-xl">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-400 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="w-8 h-8 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 flex-1 content-start">
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
                    aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200
                    ${event 
                      ? `${getEventColor(event.type).split(' ')[0]} ${getEventColor(event.type).split(' ')[1]} hover:scale-110 shadow-sm cursor-pointer` 
                      : 'hover:bg-gray-50 text-gray-400'}
                    ${isToday ? 'ring-2 ring-purple-400 ring-offset-2 z-10' : ''}
                    ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 z-10' : ''}
                  `}
                >
                  <span className={`text-sm ${event ? 'font-bold' : ''}`}>{day}</span>
                  {event && <span className="text-xs mt-1">{getEventIcon(event.type)}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Right: Detail (고정 너비 300px) */}
        <div className="w-[300px] shrink-0 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-center text-center h-full relative overflow-hidden">
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-center">
               <div className="absolute -top-10 -right-10 text-[140px] opacity-5 pointer-events-none grayscale select-none">
                 {getEventIcon(selectedEvent.type)}
               </div>

               <div className="w-24 h-24 mx-auto bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-5xl mb-6 border border-purple-50 relative z-10">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 mx-auto rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                {selectedEvent.type}
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 leading-snug px-2 break-keep">
                {selectedEvent.title}
              </h2>
              
              <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-4 px-3">
                {selectedEvent.description}
              </p>

              <div className="bg-white/50 rounded-2xl p-4 text-left border border-white/60 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                    <CalendarIcon size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm font-bold text-gray-700">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold text-gray-700">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col items-center gap-4 select-none">
              <Info className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
