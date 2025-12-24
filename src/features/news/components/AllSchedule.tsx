import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

export interface ScheduleItem {
  id: string;
  date: string; // ISO 8601 format (e.g., "2026-01-09T00:00:00Z")
  title: string;
  description: string;
  type: 'birthday' | 'album' | 'concert' | 'broadcast' | 'event';
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function AllSchedule() {
  // 1. JSON 데이터 로드
  const { data: schedules } = useJsonData<ScheduleItem[]>('schedules');
  
  // 2026년 데이터가 보이도록 초기값 설정 (실제 사용시 new Date()로 변경 가능)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // 데이터 로드 시 첫 번째 이벤트를 선택 상태로 설정 (옵션)
  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules]);

  // 달력 계산 로직
  const { daysInMonth, startingDayOfWeek } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { 
      daysInMonth: lastDay.getDate(), 
      startingDayOfWeek: firstDay.getDay() 
    };
  }, [currentDate]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  // 날짜 비교 및 이벤트 찾기
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

  // UI 헬퍼 함수: 타입별 아이콘
  const getEventIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'album': return '💿'; // comeback -> album (JSON 키 기준)
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      case 'event': return '🎉';
      default: return '📅';
    }
  };

  // UI 헬퍼 함수: 타입별 색상 (파스텔톤 유지)
  const getEventColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return 'bg-pink-200 text-pink-700 ring-pink-300';
      case 'album': return 'bg-purple-200 text-purple-700 ring-purple-300';
      case 'concert': return 'bg-blue-200 text-blue-700 ring-blue-300';
      case 'broadcast': return 'bg-yellow-200 text-yellow-700 ring-yellow-300';
      case 'event': return 'bg-green-200 text-green-700 ring-green-300';
      default: return 'bg-gray-200 text-gray-700 ring-gray-300';
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto p-4">
      {/* Main Layout Grid: Left (List) - Center (Calendar) - Right (Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[580px]">
        
        {/* 1. Left Sidebar: Upcoming List (기존 하단 영역 이동) */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 flex flex-col h-full overflow-hidden">
          <h4 className="text-gray-700 font-semibold mb-3 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-purple-500" />
            Upcoming
          </h4>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-purple-100">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentDate(new Date(event.date)); // 클릭 시 해당 달로 이동
                }}
                className={`w-full p-3 rounded-xl transition-all text-left border ${
                  selectedEvent?.id === event.id
                    ? 'bg-white shadow-md border-purple-200 scale-[1.02]'
                    : 'bg-white/40 hover:bg-purple-50/50 border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">{getEventIcon(event.type)}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${selectedEvent?.id === event.id ? 'text-purple-700' : 'text-gray-700'}`}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Center: Calendar (미니멀하게 축소) */}
        <div className="lg:col-span-6 bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-purple-100 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-lg">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
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

          {/* Days Header */}
          <div className="grid grid-cols-7 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 flex-1 content-start">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const event = getEventsForDate(day);
              const isToday = 
                new Date().getDate() === day && 
                new Date().getMonth() === currentDate.getMonth() && 
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => event && setSelectedEvent(event)}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all
                    ${event 
                      ? `${getEventColor(event.type)} shadow-sm hover:scale-110 cursor-pointer` 
                      : 'hover:bg-gray-100 text-gray-600'
                    }
                    ${isToday ? 'ring-2 ring-purple-400 z-10' : ''}
                    ${selectedEvent && event?.id === selectedEvent.id ? 'ring-2 ring-offset-1 ring-gray-400' : ''}
                  `}
                >
                  <span className={`text-xs ${event ? 'font-bold' : ''}`}>{day}</span>
                  {event && <span className="text-[10px] leading-none mt-0.5">{getEventIcon(event.type)}</span>}
                </button>
              );
            })}
          </div>
          
          {/* Simple Legend */}
          <div className="mt-auto pt-4 flex justify-center gap-3 border-t border-purple-50">
            {['birthday', 'album', 'concert'].map(type => (
              <div key={type} className="flex items-center gap-1.5 opacity-70">
                <div className={`w-2 h-2 rounded-full ${getEventColor(type as ScheduleItem['type']).split(' ')[0]}`}></div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Right: Detail View (간소화) */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/50 flex flex-col justify-center text-center">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-4 border border-purple-100">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-block px-2 py-1 rounded-md bg-purple-100 text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                {selectedEvent.type}
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                {selectedEvent.title}
              </h2>
              
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="space-y-3 bg-white/50 rounded-xl p-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                    <CalendarIcon size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Date</p>
                    <p className="text-xs font-medium text-gray-700">
                      {new Date(selectedEvent.date).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
                      })}
                    </p>
                  </div>
                </div>
                
                {/* 시간 데이터가 JSON에 없으므로 임의 UI 또는 조건부 렌더링 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">Location</p>
                    <p className="text-xs font-medium text-gray-700">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <Info className="w-8 h-8 opacity-20" />
              <p className="text-xs">Select a date to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
