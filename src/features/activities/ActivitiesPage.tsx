// features/activities/ActivitiesPage.tsx
import { NavLink, Outlet } from 'react-router-dom';
import { CheckSquare, Trophy, Calendar, TrendingUp, Music, Wrench } from 'lucide-react';

const activityTabs = [
  { id: 'todo', title: '할 일 목록', icon: <CheckSquare />, path: 'todo' },
  { id: 'voting', title: '투표 · Hype', icon: <Trophy />, path: 'voting' },
  { id: 'events', title: '이벤트 링크', icon: <Calendar />, path: 'events' },
  { id: 'trending', title: '트렌딩 툴', icon: <TrendingUp />, path: 'trending' },
  { id: 'streaming', title: '음원 스트리밍', icon: <Music />, path: 'streaming' },
  { id: 'youtubeFix', title: 'YouTube Fix', icon: <Wrench />, path: 'youtube-fix' },
];

export function ActivitiesPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-6 gap-4">
        {activityTabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`/activities/${tab.path}`}
            className={({ isActive }) =>
              `p-4 rounded-2xl border shadow-md transition-all flex flex-col items-center justify-center text-center
               ${isActive 
                 ? 'bg-white shadow-xl scale-[1.03] border-orange-200' 
                 : 'bg-white/70 hover:shadow-lg hover:bg-white/90 border-transparent'}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors
                    ${isActive 
                      ? 'bg-orange-300 text-white' 
                      : 'bg-yellow-100 text-orange-300'}`
                  }
                >
                  {tab.icon}
                </div>
                <div className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {tab.title}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="p-6 bg-white/80 rounded-2xl shadow-lg border min-h-[500px]">
        <Outlet />
      </div>
    </div>
  );
}
