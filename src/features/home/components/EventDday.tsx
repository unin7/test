import { Calendar, Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { ScheduleItem } from './AllSchedule'; 

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

  if (loading) return <div className="p-4 text-center text-gray-400 text-sm">로딩 중...</div>;

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-purple-500" />
        <h4 className="text-md font-bold text-gray-800">다가오는 일정</h4>
      </div>

      <div className="space-y-2 flex-1 overflow-hidden">
        {upcomingEvents.map((item) => (
          <div key={item.id} className="flex gap-3 items-center group">
            <div className="w-11 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-white border border-gray-100 text-gray-500 group-hover:text-purple-600 shadow-sm transition-all flex-shrink-0">
              {item.dDayVal === 0 ? "D-Day" : `D-${item.dDayVal}`}
            </div>

            <div className="flex-1 bg-white rounded-xl p-2.5 px-3 border border-purple-50/50 hover:border-purple-200 transition-all flex justify-between items-center overflow-hidden">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    item.type === 'birthday' ? 'text-pink-500 bg-pink-50' : 
                    item.type === 'comeback' ? 'text-purple-500 bg-purple-50' : 'text-gray-400 bg-gray-50'
                  }`}>{item.type}</span>
                  <h5 className="font-bold text-gray-800 text-xs truncate">{item.title}</h5>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-gray-400">
                  <Calendar className="w-2.5 h-2.5" /> 
                  {item.eventKst.toISOString().split('T')[0].slice(5)} | {item.eventKst.toISOString().split('T')[1].substring(0, 5)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
