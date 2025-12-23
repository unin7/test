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
  
  // 데이터에 맞춰 2026년 1월로 시작
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

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
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* 1. 상단 그리드 레이아웃 (달력 2 : 상세 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Calendar */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              {monthNames[currentDate.getMonth()]} 
              <span className="font-light text-gray-400">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-100">
              <button onClick={previousMonth} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-purple-600"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={nextMonth} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-purple-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-300 uppercase tracking-wider py-2">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} className="h-14 sm:h-20" />)}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const event = getEventForDate(day);
              const isSelected = selectedEvent && parseKST(selectedEvent.date).dateStr.endsWith(`-${String(day).padStart(2, '0')}`);

              return (
                <div key={day} className="h-14 sm:h-20 relative flex flex-col items-center justify-start group">
                  <button
                    onClick={() => event && setSelectedEvent(event)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative z-10 mb-1
                      ${isSelected 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-110' 
                        : event 
                          ? 'text-gray-800 hover:bg-purple-50 cursor-pointer' 
                          : 'text-gray-400 cursor-default'
                      }
                    `}
                  >
                    {day}
                    {event && !isSelected && (
                      <span className="absolute -bottom-1 w-1 h-1 bg-purple-400 rounded-full"></span>
                    )}
                  </button>

                  {/* Icon (hover or always visible if ample space) */}
                  {event && !isSelected && (
                    <div className="hidden sm:flex text-xs opacity-50 grayscale group-hover:grayscale-0 transition-all">
                      {getEventIcon(event.type)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Details Panel */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 shadow-sm border border-purple-100 flex flex-col relative overflow-hidden min-h-[400px]">
          {/* Deco Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-60 -mr-8 -mt-8 pointer-events-none"></div>

          <h4 className="text-gray-800 font-bold mb-6 flex items-center gap-2 relative z-10">Event Details</h4>

          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 relative z-10 flex-1 flex flex-col">
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                <span className="text-6xl drop-shadow-sm transform hover:scale-110 transition-transform duration-300">
                  {getEventIcon(selectedEvent.type)}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className={`inline-block text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border mb-2 ${getEventColorStyles(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight">{selectedEvent.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                   <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                     <Clock className="w-4 h-4 text-purple-400" />
                     {parseKST(selectedEvent.date).timeStr} (KST)
                   </div>
                   <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                     <MapPin className="w-4 h-4 text-purple-400" />
                     {selectedEvent.type === 'concert' ? 'Seoul' : 'Online'}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 relative z-10 opacity-60">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 stroke-1" />
              <p className="text-sm font-light text-center">날짜를 선택하면<br/>상세 정보가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. 하단 타임라인 (Upcoming Events) */}
      <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <h4 className="text-gray-800 font-bold mb-4 px-2">Upcoming Schedule</h4>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {events && events.map((event) => {
            const kst = parseKST(event.date);
            const isSelected = selectedEvent?.id === event.id;
            return (
              <button
                key={event.id}
                onClick={() => {
                   setSelectedEvent(event);
                   // 해당 월로 이동 필요시 로직 추가 가능
                   // setCurrentDate(kst.dateObj); 
                }}
                className={`
                  flex-shrink-0 w-64 p-4 rounded-2xl transition-all duration-300 border text-left group
                  ${isSelected 
                    ? 'bg-purple-50 border-purple-200 shadow-md scale-[1.02]' 
                    : 'bg-white border-gray-100 hover:border-purple-100 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold mb-0.5 truncate ${isSelected ? 'text-purple-900' : 'text-gray-800'}`}>
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-purple-500 font-medium">{kst.dateStr.slice(5)}</span>
                      <span className="w-0.5 h-2 bg-gray-300 rounded-full"></span>
                      <span className="truncate">{event.type}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
