import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

export interface ScheduleItem {
  id: string;
  date: string; 
  title: string;
  description: string;
  type: 'birthday' | 'comeback' | 'concert' | 'broadcast' | 'event';
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export function AllSchedule() {
  const { data: events, loading } = useJsonData<ScheduleItem[]>('schedules');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 

  const parseKST = (isoString: string) => {
    const utcDate = new Date(isoString);
    const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
    return {
      dateObj: kstDate,
      dateStr: kstDate.toISOString().split('T')[0],
      timeStr: kstDate.toISOString().split('T')[1].substring(0, 5)
    };
  };

  const { daysInMonth, startingDayOfWeek } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return { 
      daysInMonth: new Date(year, month + 1, 0).getDate(), 
      startingDayOfWeek: new Date(year, month, 1).getDay() 
    };
  }, [currentDate]);

  // ✅ 이번 달 일정 필터링 및 정렬
  const monthEvents = useMemo(() => {
    if (!events) return [];
    return events
      .filter(e => {
        const kst = parseKST(e.date);
        return kst.dateObj.getFullYear() === currentDate.getFullYear() && 
               kst.dateObj.getMonth() === currentDate.getMonth();
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, currentDate]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'comeback': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      default: return '📅';
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">데이터를 불러오는 중...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-gray-400"/></button>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-5 h-5 text-gray-400"/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 달력 영역 */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-7 mb-4 border-b border-gray-50 pb-2 text-center">
            {weekDays.map(d => (
              <div key={d} className={`text-xs font-bold ${d === '일' ? 'text-red-400' : d === '토' ? 'text-blue-400' : 'text-gray-300'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={i} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const event = events?.find(e => parseKST(e.date).dateStr === dateStr);
              return (
                <div key={day} className="aspect-square flex flex-col items-center justify-center rounded-2xl relative">
                  <span className="text-sm font-medium text-gray-600">{day}</span>
                  {event && <div className="mt-1 text-lg">{getEventIcon(event.type)}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ 이번 달 일정 리스트 (비어 보이는 공간 채우기) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 h-full overflow-hidden flex flex-col">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
            이달의 일정
            <span className="text-xs font-normal text-purple-400">{monthEvents.length}건</span>
          </h4>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {monthEvents.length > 0 ? monthEvents.map(event => (
              <div key={event.id} className="p-3 bg-gray-50 rounded-xl border border-transparent hover:border-purple-200 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded uppercase">{event.type}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{parseKST(event.date).dateStr.split('-').slice(1).join('/')}</span>
                </div>
                <h5 className="text-sm font-bold text-gray-800 truncate">{event.title}</h5>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                  <Clock className="w-3 h-3" /> {parseKST(event.date).timeStr}
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20">
                <CalendarIcon className="w-12 h-12 mb-2 opacity-10" />
                <p className="text-sm font-light">이번 달 일정이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
