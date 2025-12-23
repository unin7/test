import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

// JSON 데이터 타입 정의
interface ScheduleItem {
  id: string;
  date: string; // UTC ISO string
  title: string;
  description: string;
  type: 'birthday' | 'comeback' | 'concert' | 'broadcast';
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');
  
  // 2026년 1월로 고정 (데이터 확인용)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // UTC -> KST 변환 유틸
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

  const getEventForDate = (day: number) => {
    if (!schedules) return undefined;
    const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find((event) => parseKST(event.date).dateStr === targetDateStr);
  };

  // 아이콘 매핑
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'comeback': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      default: return '📅';
    }
  };

  // 색상 매핑
  const getEventColor = (type: string) => {
    switch (type) {
      case 'birthday': return 'bg-pink-300';
      case 'comeback': return 'bg-purple-300';
      case 'concert': return 'bg-blue-300';
      case 'broadcast': return 'bg-yellow-300';
      default: return 'bg-gray-300';
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6 h-full overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Section (2/3 차지) */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-800 flex items-center gap-2 font-bold text-xl">
              <CalendarIcon className="w-6 h-6 text-purple-500" />
              {monthNames[currentDate.getMonth()]} 
              <span className="font-light text-gray-400">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="w-9 h-9 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="w-9 h-9 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors text-gray-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const event = getEventForDate(day);
              const isSelected = selectedEvent && parseKST(selectedEvent.date).dateStr.endsWith(`-${String(day).padStart(2, '0')}`);

              return (
                <button
                  key={day}
                  onClick={() => event && setSelectedEvent(event)}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all relative group
                    ${event ? 'hover:bg-purple-50 cursor-pointer' : 'hover:bg-gray-50 cursor-default'}
                    ${isSelected ? 'ring-2 ring-purple-400 bg-purple-50' : ''}
                  `}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-purple-600' : 'text-gray-600'}`}>
                    {day}
                  </span>
                  {event && (
                    <span className="text-lg mt-1 transform group-hover:scale-110 transition-transform">
                      {getEventIcon(event.type)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Detail Panel (1/3 차지 - 우측) */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
          <h4 className="text-gray-800 font-bold mb-6 text-lg">Event Details</h4>
          {selectedEvent ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center py-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                <span className="text-6xl drop-shadow-sm">{getEventIcon(selectedEvent.type)}</span>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-gray-800 leading-tight">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                  {selectedEvent.description}
                </p>
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="text-gray-700 font-medium">{parseKST(selectedEvent.date).dateStr}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time</span>
                    <span className="text-gray-700 font-medium">{parseKST(selectedEvent.date).timeStr} (KST)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-300">
              <CalendarIcon className="w-12 h-12 mb-3 opacity-50 stroke-1" />
              <p className="text-sm">날짜를 선택하세요</p>
            </div>
          )}
        </div>

      </div>

      {/* Upcoming Events Timeline (하단) */}
      <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-gray-800 font-bold mb-4">Upcoming Schedule</h4>
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {schedules && schedules.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`
                flex-shrink-0 w-60 p-4 rounded-2xl transition-all text-left border
                ${selectedEvent?.id === event.id 
                  ? 'bg-purple-50 border-purple-200 shadow-sm' 
                  : 'bg-white border-gray-100 hover:border-purple-200'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getEventIcon(event.type)}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate mb-1">{event.title}</p>
                  <p className="text-xs text-purple-500 font-medium">{parseKST(event.date).dateStr}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
