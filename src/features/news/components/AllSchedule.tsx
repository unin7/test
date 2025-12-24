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
  
  // 2026년 1월로 초기값 설정
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules]);

  // 달력 계산
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
      case 'birthday': return 'bg-pink-100 text-pink-600';
      case 'album': return 'bg-purple-100 text-purple-600';
      case 'concert': return 'bg-blue-100 text-blue-600';
      case 'broadcast': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto p-6">
      {/* 3단 가로 배치 Grid (List | Calendar | Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* 1. Left: Upcoming Schedule List (세로 스크롤) */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pl-1">
            <Clock className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-sm">Upcoming</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentDate(new Date(event.date));
                }}
                className={`
                  w-full p-3 rounded-xl transition-all text-left border group relative
                  ${selectedEvent?.id === event.id 
                    ? 'bg-white shadow-md border-purple-200' 
                    : 'bg-white/40 hover:bg-white hover:border-purple-100 border-transparent'}
                `}
              >
                {selectedEvent?.id === event.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-md" />
                )}
                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col items-center justify-center min-w-[40px]">
                     <span className="text-lg leading-none mb-1">{getEventIcon(event.type)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${selectedEvent?.id === event.id ? 'text-purple-700' : 'text-gray-700'}`}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Center: Calendar */}
        <div className="lg:col-span-6 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-purple-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-xl">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-400 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="w-8 h-8 hover:bg-purple-100 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 hover:bg-purple-100 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
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
                      ? `${getEventColor(event.type).split(' ')[0]} ${getEventColor(event.type).split(' ')[1]} hover:scale-105 shadow-sm cursor-pointer` 
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

        {/* 3. Right: Detail View */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 flex flex-col justify-center text-center h-full relative overflow-hidden">
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full flex flex-col justify-center">
               <div className="absolute -top-6 -right-6 text-[150px] opacity-5 pointer-events-none grayscale">
                 {getEventIcon(selectedEvent.type)}
               </div>

               <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-sm flex items-center justify-center text-5xl mb-6 border border-purple-50 relative z-10">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 mx-auto rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                {selectedEvent.type}
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-4 leading-snug px-2 break-keep">
                {selectedEvent.title}
              </h2>
              
              <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-3 px-4">
                {selectedEvent.description}
              </p>

              <div className="bg-white/40 rounded-xl p-4 text-left border border-white/60 mx-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                    <CalendarIcon size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm font-bold text-gray-700">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold text-gray-700">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col items-center gap-3">
              <Info className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">일정을 선택해 주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
