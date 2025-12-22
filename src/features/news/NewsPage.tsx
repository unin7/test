// features/news/NewsPage.tsx
import { NavLink, Outlet } from "react-router-dom";
import { Calendar, FileText, Twitter, Radio, Music, Youtube } from "lucide-react";

const newsSections = [
  { id: "schedule", icon: <Calendar className="w-5 h-5" />, title: "일정 · D-DAY", path: "schedule" },
  { id: "broadcast", icon: <Radio className="w-5 h-5" />, title: "방송 현황", path: "broadcast" },
  { id: "cafe", icon: <FileText className="w-5 h-5" />, title: "팬카페 공지", path: "cafe" },
  { id: "twitter", icon: <Twitter className="w-5 h-5" />, title: "X 트윗", path: "twitter" },
  { id: "videos", icon: <Youtube className="w-5 h-5" />, title: "YouTube 영상", path: "videos" },
  { id: "songs", icon: <Music className="w-5 h-5" />, title: "최근 노래", path: "songs" },
];

export function NewsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="grid grid-cols-6 gap-4">
        {newsSections.map((section) => (
          <NavLink
            key={section.id}
            to={`/news/${section.path}`}
            className={({ isActive }) => 
              `p-4 rounded-2xl border shadow-md transition flex flex-col items-center justify-center text-center
               ${isActive 
                 ? "bg-white shadow-xl scale-[1.03] border-blue-200 text-blue-600" 
                 : "bg-white/70 hover:shadow-lg hover:bg-white/90 border-transparent text-gray-600"
               }`
            }
          >
            <div className="mb-2">{section.icon}</div>
            <div className="font-medium">{section.title}</div>
          </NavLink>
        ))}
      </div>

      {/* 여기가 갈아끼워지는 액자 영역입니다 */}
      <div className="p-6 bg-white/80 rounded-2xl shadow-lg min-h-[500px]">
        <Outlet />
      </div>
    </div>
  );
}
