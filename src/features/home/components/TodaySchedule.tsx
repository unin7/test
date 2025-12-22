import { Clock } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';

interface ScheduleItem {
  isoDate: string;
  title: string;
  type: string; // "FIXED", "BROADCAST" 등
  desc: string;
  isImportant: boolean;
}

export function TodaySchedule() {
  const { data: schedules, loading } = useJsonData<ScheduleItem[]>('schedules');

  // UI용 타입 변환 함수
  const getUiType = (serverType: string) => {
    if (serverType === 'BROADCAST') return 'live';
    if (serverType === 'FIXED') return 'event';
    return 'event';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live':
        return 'bg-gradient-to-r from-purple-200 to-pink-200'; // 방송
      case 'event':
        return 'bg-gradient-to-r from-blue-200 to-purple-200'; // 고정 일정
      default:
        return 'bg-gray-200';
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading...</div>;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100/50 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-purple-500" />
        <h4 className="text-gray-800">Today's Schedule</h4>
      </div>

      <div className="space-y-3">
        {schedules?.map((item, index) => {
          const uiType = getUiType(item.type);
          const timeStr = formatTime(item.isoDate);

          return (
            <div key={index} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-8 rounded-full ${getTypeColor(uiType)} flex items-center justify-center text-xs font-bold text-gray-700 flex-shrink-0 shadow-sm`}
                >
                  {timeStr}
                </div>
                {index < schedules.length - 1 && (
                  <div className="w-0.5 h-full bg-gradient-to-b from-purple-200 to-transparent mt-1.5"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-3">
                <div className="bg-white/80 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow border border-purple-100/30">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-purple-600 uppercase">{item.type}</span>
                    {uiType === 'live' && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 rounded-full text-[10px] font-bold">
                        ON AIR
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
        {(!schedules || schedules.length === 0) && (
             <div className="text-center text-gray-400 text-sm py-4">일정이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
