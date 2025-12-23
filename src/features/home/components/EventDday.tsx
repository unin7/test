import { Calendar, Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { ScheduleItem } from './AllSchedule'; 

export function EventDday() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');

  const getKstDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    // UTC to KST
    return new Date(date.getTime() + (9 * 60 * 60 * 1000));
  };

  const getUpcomingEvents = () => {
    if (!schedules) return [];
    
    // 현재 시간 (KST)
    const nowKst = getKstDate();
    nowKst.setUTCHours(0, 0, 0, 0); 

    return schedules.map(event => {
      const eventKst = getKstDate(event.date);
      const eventDateOnly = new Date(eventKst);
      eventDateOnly.setUTCHours(0, 0, 0, 0);

      const diffTime = eventDateOnly.getTime() - nowKst.getTime();
      const dDayVal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return { ...event, dDayVal, eventKst };
    })
    .filter(e => e.dDayVal >= 0) 
    .sort((a, b) => a.dDayVal - b.dDayVal)
    .slice(0, 4);
  };

  const upcomingEvents = getUpcomingEvents();
  const getDdayString = (val: number) => (val === 0 ? "D-Day" : `D-${val}`);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'birthday': return 'text-pink-600 bg-pink-50 border-pink-100';
      case 'comeback': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'concert': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading...</div>;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100/50 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-purple-500" />
        <h4 className="text-lg font-bold text-gray-800">Upcoming Events</h4>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {upcomingEvents.map((item) => (
          <div key={item.id} className="flex gap-3 group">
            {/* 왼쪽: D-Day 뱃지 */}
            <div className="flex-shrink-0 pt-1">
              <div className={`
                w-12 py-1 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm border transition-all
                ${item.dDayVal === 0 
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white border-transparent animate-pulse' 
                  : 'bg-white text-gray-600 border-gray-200 group-hover:border-purple-200 group-hover:text-purple-600'
                }
              `}>
                {getDdayString(item.dDayVal)}
              </div>
            </div>

            {/* 오른쪽: 정보 카드 */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-purple-50/50 hover:shadow-md hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  {item.dDayVal === 0 && <span className="text-[9px] font-bold text-pink-500 animate-pulse">TODAY</span>}
                </div>
                
                <h5 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate group-hover:text-purple-700">
                  {item.title}
                </h5>
                
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  {item.eventKst.toISOString().split('T')[0]}
                  <span className="text-purple-300">|</span>
                  {item.eventKst.toISOString().split('T')[1].substring(0, 5)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!upcomingEvents || upcomingEvents.length === 0) && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 opacity-60">
            <Calendar className="w-8 h-8 mb-2 stroke-1" />
            <span className="text-xs">예정된 일정이 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}
