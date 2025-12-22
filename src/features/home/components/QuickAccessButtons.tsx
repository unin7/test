import { Calendar, Clock, CheckSquare, Coffee, Youtube, Trophy, Info, Sparkles, ShoppingBag, Music } from 'lucide-react';

interface QuickButton {
  icon: React.ReactNode;
  label: string;
  gradient: string;
}

const buttons: QuickButton[] = [
  { icon: <Calendar className="w-5 h-5" />, label: 'Schedule', gradient: 'from-blue-300 to-purple-300' },
  { icon: <Clock className="w-5 h-5" />, label: 'D-DAY', gradient: 'from-purple-300 to-pink-300' },
  { icon: <CheckSquare className="w-5 h-5" />, label: 'TODO', gradient: 'from-pink-300 to-peach-300' },
  { icon: <Coffee className="w-5 h-5" />, label: 'Fan Cafe', gradient: 'from-peach-300 to-yellow-300' },
  { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', gradient: 'from-pink-300 to-purple-300' },
  { icon: <Trophy className="w-5 h-5" />, label: 'Voting', gradient: 'from-purple-300 to-blue-300' },
  { icon: <Info className="w-5 h-5" />, label: "Today's Info", gradient: 'from-blue-300 to-pink-300' },
  { icon: <Sparkles className="w-5 h-5" />, label: 'Events', gradient: 'from-yellow-300 to-pink-300' },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Shop', gradient: 'from-green-300 to-teal-300' },
  { icon: <Music className="w-5 h-5" />, label: 'Music', gradient: 'from-indigo-300 to-blue-300' },
];

export function QuickAccessButtons() {
  return (
    // ✅ grid-cols-5: 화면 크기 상관없이 무조건 한 줄에 5개씩 배치 (PC 우선)
    // gap-3: 버튼 사이 간격
    <div className="grid grid-cols-5 gap-3">
      {buttons.map((button, index) => (
        <button
          key={index}
          // h-[90px]: 정사각형에 가까운 안정적인 비율
          className="group relative flex flex-col items-center justify-center gap-2 h-[90px] bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100/50 overflow-hidden hover:scale-[1.02]"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${button.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10 text-purple-500 group-hover:text-white transition-colors duration-300 scale-110">
            {button.icon}
          </div>

          <span className="relative z-10 text-xs font-medium text-gray-600 group-hover:text-white transition-colors duration-300">
            {button.label}
          </span>
        </button>
      ))}
    </div>
  );
}
