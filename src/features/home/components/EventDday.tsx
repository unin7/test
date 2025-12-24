import { useMemo } from 'react';
import { Clock, MoreHorizontal } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'birthday' | 'album' | 'concert' | 'broadcast' | 'event';
}

export function EventDday() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');

  const getKstDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return new Date(date.getTime() + (9 * 60 * 60 * 1000));
  };

  const upcomingEvents = useMemo(() => {
    if (!schedules) return [];
    const nowKst = getKstDate();
    nowKst.setUTCHours(0, 0, 0, 0); 

    return schedules.map(event => {
      const eventKst = getKstDate(event.date);
      const eventDateOnly = new Date(eventKst);
      eventDateOnly.setUTCHours(0, 0, 0, 0);
      
      const dDayVal = Math.ceil((eventDateOnly.getTime() - nowKst.getTime()) / (1000 * 60 * 60 * 24));
      return { ...event, dDayVal, eventKst };
    })
    .filter(e => e.dDayVal >= 0) 
    .sort((a, b) => a.dDayVal - b.dDayVal)
    .slice(0, 4);
  }, [schedules]);

  const getTypeStyle = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return 'text-pink-600';
      case 'broadcast': return 'text-purple-600';
      case 'concert': return 'text-blue-600';
      case 'album': return 'text-indigo-600';
      default: return 'text-purple-600';
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400 text-xs">Loading...</div>;

  return (
    // 배경색 및 스타일 통일 (Glassmorphism)
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm h-full flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pl-1">
        <Clock className="w-4 h-4 text-purple-600" />
        <h4 className="text-gray-800 font-bold text-base tracking-tight">Today's Schedule</h4>
      </div>

      {/* Timeline List */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((item) => {
            const isToday = item.dDayVal === 0;
            const typeColor = getTypeStyle(item.type);

            return (
              <div key={item.id} className="flex gap-3 items-start">
                
                {/* Left: Capsule */}
                <div className="flex-shrink-0 pt-1">
                  <div className={`
                    px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border
                    flex items-center justify-center min-w-[50px]
                    ${isToday 
                      ? 'bg-gray-800 text-white border-gray-800' 
                      : 'bg-white text-gray-500 border-white/60'}
                  `}>
                    {isToday ? 'NOW' : `D-${item.dDayVal}`}
                  </div>
                </div>

                {/* Right: Content Card */}
                <div className="flex-1 bg-white rounded-xl p-3 shadow-[0_2px_10px_-5px_rgba(0,0,0,0.05)] border border-purple-50/50 hover:shadow-md hover:border-purple-100 transition-all duration-300">
                  
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider ${typeColor}`}>
                      {item.type}
                    </span>
                    {isToday && (
                      <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded animate-pulse">
                        ON AIR
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-gray-800 mb-0.5 leading-snug">
                    {item.title}
                  </h5>

                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-1">
                    {item.description || "상세 설명이 없습니다."}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-60">
             <MoreHorizontal className="w-6 h-6" />
             <p className="text-xs">일정이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
