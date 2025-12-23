import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

export interface ScheduleItem {
  id: string;
  date: string; // ISO String (UTC) e.g., "2025-01-15T09:00:00Z"
  title: string;
  description: string;
  type: 'birthday' | 'release' | 'concert' | 'broadcast' | 'event';
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');
  
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // ✅ UTC ISO 문자열을 KST 날짜/시간 객체로 변환하는 함수
  const parseKST = (isoString: string) => {
    const utcDate = new Date(isoString);
    // UTC 시간에 9시간(KST 오프셋)을 더함
    const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    
    return {
      dateObj: kstDate,
      dateStr: kstDate.toISOString().split('T')[0], // YYYY-MM-DD (KST 기준)
      timeStr: kstDate.toISOString().split('T')[1].substring(0, 5) // HH:mm (KST 기준)
    };
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { 
      daysInMonth: lastDay.getDate(), 
      startingDayOfWeek: firstDay.getDay() 
    };
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

  // 날짜 매칭 함수 (KST 기준으로 비교)
  const getEventForDate = (day: number) => {
    if (!schedules) return undefined;
    
    // 현재 달력의 날짜 (YYYY-MM-DD)
    const targetDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return schedules.find((event) => {
      const { dateStr } = parseKST(event.date); // 이벤트 시간을 KST 날짜로 변환
      return dateStr === targetDateStr;
    });
  };

  const getEventColorStyles = (type: string) => {
    switch (type) {
      case 'birthday': return 'bg-pink-50 text-pink-600 border-pink-200';
      case 'release': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'concert': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'broadcast': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'release': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      default: return '📅';
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          {monthNames[currentDate.getMonth()]} 
          <span className="font-light text-gray-400">{currentDate.getFullYear()}</span>
        </h3>
        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
          <button onClick={previousMonth} className="p-1.5 hover:bg-gray-50 rounded-md text-gray-500 hover:text-purple-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-50 rounded-md text-gray-500 hover:text-purple-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Calendar Grid */}
        <div className="flex-[3] bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y divide-gray-100">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50/30" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const event = getEventForDate(day);
              const isToday = day === 9 && currentDate.getMonth() === 0; // 예시 (실제 구현 시 new Date() 비교)
              const isSelected = selectedEvent?.id === event?.id;

              return (
                <div 
                  key={day} 
                  onClick={() => event && setSelectedEvent(event)}
                  className={`
                    relative group transition-all duration-200 flex flex-col items-start p-1 sm:p-2
                    ${event ? 'cursor-pointer hover:bg-purple-50/30' : ''}
                    ${isSelected ? 'bg-purple-50 ring-inset ring-2 ring-purple-200 z-10' : 'bg-white'}
                  `}
                >
                  <span className={`
                    w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium mb-1
                    ${isToday ? 'bg-purple-500 text-white shadow-md' : 'text-gray-500'}
                  `}>
                    {day}
                  </span>

                  {event && (
                    <div className={`
                      w-full mt-auto px-2 py-1 rounded text-[10px] sm:text-xs font-medium truncate border
                      ${getEventColorStyles(event.type)}
                    `}>
                      <span className="mr-1">{getEventIcon(event.type)}</span>
                      <span className="hidden sm:inline">{event.title}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Sidebar */}
        <div className="flex-1 lg:max-w-xs bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-sm p-5 flex flex-col">
          <h4 className="text-gray-800 font-bold mb-4 flex items-center gap-2">Details</h4>
          
          {selectedEvent ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4 border border-gray-100">
                <span className="text-5xl">{getEventIcon(selectedEvent.type)}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${getEventColorStyles(selectedEvent.type)}`}>
                      {selectedEvent.type.toUpperCase()}
                    </span>
                    {/* KST 날짜 표시 */}
                    <span className="text-[10px] text-gray-400">
                      {parseKST(selectedEvent.date).dateStr}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{selectedEvent.title}</h3>
                </div>
                
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {selectedEvent.description}
                </p>

                <div className="space-y-2 pt-2 text-sm text-gray-500">
                   <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4 text-purple-400" />
                     {/* KST 시간 표시 */}
                     {parseKST(selectedEvent.date).timeStr} (KST)
                   </div>
                   <div className="flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-purple-400" />
                     {selectedEvent.type === 'concert' ? 'Seoul' : 'Online / Broadcast'}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
              <CalendarIcon className="w-10 h-10 mb-2" />
              <p className="text-sm text-center">날짜를 클릭하여<br/>일정을 확인하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
