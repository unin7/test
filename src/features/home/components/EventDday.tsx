import { useMemo } from 'react';
import { Clock, ChevronRight, MoreHorizontal } from 'lucide-react';
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

  // 타입별 텍스트 색상 및 라벨 스타일
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
    // 전체 배경: 이미지처럼 아주 연한 배경색 위에서 흰색 카드가 돋보이도록 설정
    <div className="bg-gray-50/50 backdrop-blur-xl rounded-[32px] p-6 border border-white/60 shadow-sm h-full flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pl-1">
        <Clock className="w-5 h-5 text-purple-600" />
        <h4 className="text-gray-800 font-bold text-lg tracking-tight">Today's Schedule</h4>
      </div>

      {/* Timeline List */}
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-hide">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((item) => {
            const isToday = item.dDayVal === 0;
            const typeColor = getTypeStyle(item.type);

            return (
              <div key={item.id} className="flex gap-4 items-start">
                
                {/* Left: Time/D-Day Capsule (이미지의 시간 표시 부분) */}
                <div className="flex-shrink-0 pt-1">
                  <div className={`
                    px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border
                    flex items-center justify-center min-w-[60px]
                    ${isToday 
                      ? 'bg-gray-800 text-white border-gray-800' 
                      : 'bg-white text-gray-600 border-white/60'}
                  `}>
                    {isToday ? 'NOW' : `D-${item.dDayVal}`}
                  </div>
                </div>

                {/* Right: Content Card (이미지의 흰색 박스 부분) */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-purple-50/30 hover:shadow-md transition-shadow duration-300">
                  
                  {/* Card Header: Type & Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${typeColor}`}>
                      {item.type}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md animate-pulse">
                        ON AIR
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h5 className="text-[15px] font-bold text-gray-800 mb-1 leading-snug">
                    {item.title}
                  </h5>

                  {/* Description (이미지처럼 회색 텍스트로 설명 표시) */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description || "상세 설명이 없습니다."}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 opacity-60">
             <MoreHorizontal className="w-8 h-8" />
             <p className="text-xs">일정이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
