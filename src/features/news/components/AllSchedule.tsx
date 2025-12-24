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
      case 'birthday': return 'bg-pink-100 text-pink-600';
      case 'album': return 'bg-purple-100 text-purple-600';
      case 'concert': return 'bg-blue-100 text-blue-600';
      case 'broadcast': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="w-full h-full p-4">
      {/* md(768px) 이상이면 무조건 가로 3단 배치 적용 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px]">
        
        {/* 1. Left: List (3/12) */}
        <div className="md:col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pl-1">
            <Clock className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-sm">Upcoming</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-purple-100 scrollbar-track-transparent">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentDate(new Date(event.date));
                }}
                className={`
                  w-full p-2.5 rounded-xl transition-all text-left border relative
                  ${selectedEvent?.id === event.id 
                    ? 'bg-white shadow-sm border-purple-200' 
                    : 'bg-white/40 hover:bg-white hover:border-purple-100 border-transparent'}
                `}
              >
                {selectedEvent?.id === event.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-purple-500 rounded-r-md" />
                )}
                <div className="flex items-center gap-2 pl-1.5">
                   <span className="text-base leading-none">{getEventIcon(event.type)}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${selectedEvent?.id === event.id ? 'text-purple-700' : 'text-gray-700'}`}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Center: Calendar (6/12) */}
        <div className="md:col-span-6 bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-purple-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-lg">
              <CalendarIcon className="w-4 h-4 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-400 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1">
              <button onClick={previousMonth} className="w-7 h-7 hover:bg-purple-100 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="w-7 h-7 hover:bg-purple-100 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 flex-1 content-start">
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
                    aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-200
                    ${event 
                      ? `${getEventColor(event.type).split(' ')[0]} ${getEventColor(event.type).split(' ')[1]} hover:scale-105 shadow-sm cursor-pointer` 
                      : 'hover:bg-gray-50 text-gray-400'}
                    ${isToday ? 'ring-1.5 ring-purple-400 ring-offset-1 z-10' : ''}
                    ${isSelected ? 'ring-1.5 ring-gray-400 ring-offset-1 z-10' : ''}
                  `}
                >
                  <span className={`text-xs ${event ? 'font-bold' : ''}`}>{day}</span>
                  {event && <span className="text-[10px] mt-0.5">{getEventIcon(event.type)}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Right: Detail (3/12) */}
        <div className="md:col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50 flex flex-col justify-center text-center h-full relative overflow-hidden">
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full flex flex-col justify-center">
               <div className="absolute -top-6 -right-6 text-[120px] opacity-5 pointer-events-none grayscale">
                 {getEventIcon(selectedEvent.type)}
               </div>

               <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl mb-4 border border-purple-50 relative z-10">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-2 py-0.5 mb-3 mx-auto rounded-full bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-widest border border-purple-100">
                {selectedEvent.type}
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-3 leading-snug px-1 break-keep">
                {selectedEvent.title}
              </h2>
              
              <p className="text-xs text-gray-500 mb-6 leading-relaxed line-clamp-4 px-2">
                {selectedEvent.description}
              </p>

              <div className="bg-white/40 rounded-xl p-3 text-left border border-white/60 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-500">
                    <CalendarIcon size={12} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Date</p>
                    <p className="text-xs font-bold text-gray-700">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded bg-pink-100 flex items-center justify-center text-pink-500">
                    <MapPin size={12} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider">Location</p>
                    <p className="text-xs font-bold text-gray-700">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col items-center gap-2">
              <Info className="w-10 h-10 opacity-20" />
              <p className="text-xs font-medium">일정 선택</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
