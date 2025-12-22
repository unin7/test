import { NavLink, Outlet } from "react-router-dom"; // useLocation 제거
import { Image, Search, Gamepad, BarChart, Video, Star } from "lucide-react";

const otherTabs = [
  { id: "fanArt", title: "팬아트 아카이브", icon: <Image />, desc: "팬아트 쇼츠처럼 보기" },
  { id: "karaoke", title: "노래방 번호 찾기", icon: <Search />, desc: "곡별 노래방 번호 검색" },
  { id: "games", title: "팬게임", icon: <Gamepad />, desc: "앱스토어처럼 모아서 플레이" },
  { id: "stats", title: "팬덤 통계", icon: <BarChart />, desc: "전체 팬 활동 통계" },
  { id: "kirinuki", title: "키리누키 랭킹", icon: <Video />, desc: "팬 영상 채널 랭킹" },
  { id: "fortune", title: "오늘의 운세", icon: <Star />, desc: "사용자 운세 확인" },
];

export function OthersPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* 메뉴 */}
      <div className="grid grid-cols-6 gap-4">
        {otherTabs.map((tab) => (
          <NavLink
            key={tab.id}
            // ⭐️ 절대 경로 적용: /others/fanArt 등으로 안전하게 이동
            to={`/others/${tab.id}`}
            className={({ isActive }) =>
              `p-4 rounded-2xl border shadow-md transition-all flex flex-col justify-between h-[140px]
               ${isActive
                 ? "bg-white/90 shadow-xl scale-[1.03] border-indigo-200"
                 : "bg-white/70 hover:shadow-lg border-transparent"
               }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors
                    ${isActive
                      ? "bg-gradient-to-br from-[#8ab0ea] to-[#888ae1] text-white shadow-md"
                      : "bg-pink-100 text-indigo-400"
                    }`}
                >
                  {tab.icon}
                </div>
                <div>
                  <div className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                    {tab.title}
                  </div>
                  <div className={`text-xs mt-1 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}>
                    {tab.desc}
                  </div>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-6 bg-white/80 rounded-2xl shadow-lg border min-h-[500px]">
        <Outlet />
      </div>
    </div>
  );
}
