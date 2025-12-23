import { Calendar, Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { ScheduleItem } from './SchedulePage'; // 인터페이스 재사용

export function EventDday() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');

  // KST 시간 변환 유틸
  const getKstDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return new Date(date.getTime() + (9 * 60 * 60 * 1000));
  };

  // D-Day 계산 및 정렬 로직
  const getUpcomingEvents = () => {
    if (!schedules) return [];
    const nowKst = getKstDate();
    nowKst.setUTCHours(0, 0, 0, 0); // 시간 제거하고 날짜만 비교

    return schedules.map(event => {
      const eventKst = getKstDate(event.date);
      const eventDateOnly = new Date(eventKst);
      eventDateOnly.setUTCHours(0, 0, 0, 0);

      const diffTime = eventDateOnly.getTime() - nowKst.getTime();
      const dDayVal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...event, dDayVal, eventKst };
    })
    .filter(e => e.dDayVal >= 0) // 이미 지난 일정 제외
    .sort((a, b) => a.dDayVal - b.dDayVal) // 가까운 날짜 순 정렬
    .slice(0, 4); // 상위 4개만
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
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-purple-500" />
        <h4 className="text-lg font-bold text-gray-800">Upcoming Events</h4>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {upcomingEvents.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            {/* 왼쪽: D-Day 뱃지 (이미지 UI 스타일) */}
            <div className="flex-shrink-0 pt-1">
              <div className={`w-14 py-1.5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border ${
                item.dDayVal === 0 
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white border-transparent animate-pulse' 
                  : 'bg-white text-gray-600 border-gray-200 group-hover:border-purple-200 group-hover:text-purple-600 transition-colors'
              }`}>
                {getDdayString(item.dDayVal)}
              </div>
            </div>

            {/* 오른쪽: 이벤트 카드 (이미지 UI 스타일) */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-50/50 hover:shadow-md hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${getTypeColor(item.type).split(' ')[0]}`}>{item.type}</span>
                  {item.dDayVal === 0 && <span className="text-[10px] font-bold text-pink-500 animate-pulse">TODAY</span>}
                </div>
                <h5 className="font-bold text-gray-800 text-base leading-tight mb-1 truncate group-hover:text-purple-700">{item.title}</h5>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                <div className="mt-2 pt-2 border-t border-gray-50 flex items-center gap-1.5 text-[10px] text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {item.eventKst.toISOString().split('T')[0]} 
                  <span className="w-0.5 h-0.5 bg-gray-300 rounded-full mx-0.5"/>
                  {item.eventKst.toISOString().split('T')[1].substring(0, 5)} (KST)
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!upcomingEvents || upcomingEvents.length === 0) && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-2 opacity-50">
            <Calendar className="w-8 h-8" /><span className="text-sm">No upcoming events</span>
          </div>
        )}
      </div>
    </div>
  );
}
