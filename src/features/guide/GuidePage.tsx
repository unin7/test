import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, ShoppingBag, Ticket, Heart, PenTool, Users, Siren } from "lucide-react";

const guideSections = [
  { id: 'basic', title: '기본 활동', icon: <BookOpen />, path: 'basic' },
  { id: 'goods', title: '굿즈/포카', icon: <ShoppingBag />, path: 'goods' },
  { id: 'concert', title: '공연/티켓', icon: <Ticket />, path: 'concert' },
  { id: 'support', title: '서포트', icon: <Heart />, path: 'support' },
  { id: 'creation', title: '창작 활동', icon: <PenTool />, path: 'creation' },
  { id: 'community', title: '커뮤니티', icon: <Users />, path: 'community' },
  { id: 'report', title: '신고/문의', icon: <Siren />, path: 'report' },
];

export function GuidePage() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      {/* 상단 탭 메뉴 영역 */}
      <div className="flex-none z-20 bg-white/60 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max px-2">
              {guideSections.map((section) => (
                <NavLink
                  key={section.id}
                  to={`/guide/${section.path}`}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium
                     ${isActive 
                       ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 scale-105" 
                       : "bg-white text-slate-600 border border-slate-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                     }`
                  }
                >
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                    {/* 아이콘 크기를 확실히 제한하고 중앙으로 모음 */}
                    <div className="w-4 h-4 flex items-center justify-center">
                      {section.icon}
                    </div>
                  </div>
                  <span>{section.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
        <Outlet />
      </div>
    </div>
  );
}
