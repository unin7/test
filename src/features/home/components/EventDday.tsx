import { useMemo } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
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

  // 날짜 포맷 (MM.DD)
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  if (loading) return <div className="h-full flex items-center justify-center text-gray-400 text-xs">Loading...</div>;
  if (!upcomingEvents.length) return <div className="h-full flex items-center justify-center text-gray-400 text-xs">예정된 일정이 없습니다.</div>;

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-gray-800 font-bold text-base tracking-tight flex items-center gap-2">
          Upcoming
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
        </h4>
        <button className="text-xs text-gray-400 hover:text-purple-600 flex items-center gap-0.5 transition-colors group">
          View All <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col gap-1">
        {upcomingEvents.map((item) => {
          const isUrgent = item.dDayVal <= 3; // 3일 이내 임박

          return (
            <div 
              key={item.id} 
              className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/80 hover:shadow-sm hover:scale-[1.02] transition-all duration-300 cursor-default"
            >
              {/* D-Day Section */}
              <div className={`flex flex-col items-center justify-center w-10 text-center flex-shrink-0 ${isUrgent ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'}`}>
                <span className="text-[10px] font-medium leading-none mb-0.5 opacity-80">D-</span>
                <span className={`text-xl font-black leading-none tracking-tight ${isUrgent ? 'text-purple-600' : 'text-gray-600 group-hover:text-purple-600'}`}>
                  {item.dDayVal === 0 ? 'Day' : item.dDayVal}
                </span>
              </div>

              {/* Divider Line */}
              <div className="w-[1px] h-8 bg-gray-100 group-hover:bg-purple-100 transition-colors"></div>

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider
                    ${item.type === 'birthday' ? 'bg-pink-100 text-pink-500' : 
                      item.type === 'comeback' || item.type === 'album' ? 'bg-purple-100 text-purple-500' : 
                      item.type === 'concert' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'}
                   `}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                    {formatDate(item.eventKst)}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                  {item.title}
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
