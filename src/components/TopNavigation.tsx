// TopNavigation.tsx
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Sparkles } from 'lucide-react'; // Sparkles 아이콘 추가 (로고 데코용)

interface MenuItem {
  path: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: '/news', label: 'News' },
  { path: '/activities', label: 'Activities' },
  { path: '/goods', label: 'Goods & Membership' },
  { path: '/guide', label: 'Guide' },
  { path: '/others', label: 'Others' },
];

export function TopNavigation() {
  const location = useLocation();

  return (
    // 배경: 그라디언트는 아주 은은하게(opacity 조절), 블러 효과 강화
    <nav className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <Link
            to="/"
            className="group flex items-center gap-1.5 transition-opacity hover:opacity-80"
          >
            <Sparkles className="h-5 w-5 text-indigo-300 transition-transform duration-500 group-hover:rotate-180" />
            <h1 className="font-extrabold text-2xl tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400">
                pastel
              </span>
              <span className="text-slate-700">hub</span>
            </h1>
          </Link>

          {/* Center Menu - Pill Shape Design */}
          <div className="hidden md:flex items-center gap-1 bg-white/40 px-2 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-sm">
            {menuItems.map((menu) => {
              const isActive = location.pathname === menu.path;

              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                    isActive
                      ? 'bg-white text-indigo-500 shadow-md ring-1 ring-black/5 scale-100'
                      : 'text-slate-500 hover:text-indigo-400 hover:bg-white/60'
                  }`}
                >
                  {menu.label}
                  {/* Active Indicator Dot (Optional style choice) */}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Icons - Soft Buttons */}
          <div className="flex items-center gap-3">
            <button 
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-slate-500 transition-all duration-300 hover:bg-white hover:text-indigo-500 hover:shadow-md hover:scale-105"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-pink-50 text-slate-500 transition-all duration-300 hover:bg-white hover:text-pink-500 hover:shadow-md hover:scale-105"
              aria-label="User Profile"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}