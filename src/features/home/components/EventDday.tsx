import { Calendar, Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { ScheduleItem } from './AllSchedule'; 

export function EventDday() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');

  const getKstDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return new Date(date.getTime() + (9 * 60 * 60 * 1000));
  };

  const getUpcomingEvents = () => {
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
  };

  const upcomingEvents = getUpcomingEvents();

  if (loading) return <div className="p-4 text-center text-gray-400 text-sm">로딩 중...</div>;

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-purple-500" />
        <h4 className="text-lg font-bold text-gray-800">다가오는 일정</h4>
      </div>

      <div className="space-y-4 flex-1">
        {upcomingEvents.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex-shrink-0 pt-1">
              <div className={`w-14 py-1.5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm border bg-white text-gray-500 group-hover:text-purple-600 transition-colors`}>
                {item.dDayVal === 0 ? "D-Day" : `D-${item.dDayVal}`}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-purple-50/50 hover:border-purple-200 transition-all">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 inline-block ${
                item.type === 'birthday' ? 'text-pink-500 bg-pink-50' : 
                item.type === 'comeback' ? 'text-purple-500 bg-purple-50' : 'text-gray-400 bg-gray-50'
              }`}>{item.type}</span>
              <h5 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h5>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <Calendar className="w-3 h-3" /> {item.eventKst.toISOString().split('T')[0]} | {item.eventKst.toISOString().split('T')[1].substring(0, 5)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
