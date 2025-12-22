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
    // ✅ [문제 해결] Tailwind 클래스가 안 먹힐 때를 대비해 style 속성으로 강제 고정
    // display: 'grid' -> 그리드 사용
    // gridTemplateColumns: 'repeat(5, 1fr)' -> 무조건 5개 컬럼 생성 (10개면 2줄이 됨)
    <div 
      className="gap-3 w-full"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px' // gap-3와 동일한 간격
      }}
    >
      {buttons.map((button, index) => (
        <button
          key={index}
          // h-[90px]: 높이 고정
          className="group relative flex flex-col items-center justify-center gap-2 h-[90px] bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-purple-100/50 overflow-hidden hover:scale-[1.02]"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${button.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>

          <div className="relative z-10 text-purple-500 group-hover:text-white transition-colors duration-300 scale-110">
            {button.icon}
          </div>

          {/* 텍스트 크기 조절: text-xs (PC에서도 너무 크지 않게) */}
          <span className="relative z-10 text-xs font-medium text-gray-600 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
            {button.label}
          </span>
        </button>
      ))}
    </div>
  );
}
