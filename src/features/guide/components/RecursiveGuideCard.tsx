import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// 아까 정의한 트리형 데이터 구조
export interface GuideItem {
  label: string;
  content?: string;
  children?: GuideItem[];
}

interface Props {
  item: GuideItem;
  depth?: number;
}

export function RecursiveGuideCard({ item, depth = 0 }: Props) {
  // 깊이가 0(최상위)이면 기본적으로 펼쳐두고, 아니면 접어두기 (선택 사항)
  const [isOpen, setIsOpen] = useState(depth === 0);
  const hasChildren = item.children && item.children.length > 0;

  // 깊이에 따른 배경색/테두리 스타일링
  const bgColor = depth === 0 ? 'bg-white' : 'bg-slate-50';
  const borderColor = depth === 0 ? 'border-purple-100' : 'border-slate-100';
  const paddingLeft = depth > 0 ? 'pl-4' : '';

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden mb-3 shadow-sm transition-all`}>
      {/* 1. 헤더: 클릭 시 토글 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 transition-colors"
      >
        <span className={`font-bold text-gray-800 ${depth > 0 ? 'text-sm' : 'text-base'}`}>
          {item.label}
        </span>
        
        {/* 내용이나 하위 항목이 있을 때만 화살표 표시 */}
        {(item.content || hasChildren) && (
          isOpen ? <ChevronDown className="w-5 h-5 text-purple-500" /> : <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* 2. 본문: 펼쳐졌을 때만 표시 */}
      {isOpen && (
        <div className="border-t border-gray-100 p-4 pt-2">
          {/* 텍스트 내용 */}
          {item.content && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line pl-1">
              {item.content}
            </p>
          )}

          {/* ⭐️ 재귀 호출: 자식이 있으면 자기 자신을 다시 그립니다 */}
          {hasChildren && (
            <div className={`flex flex-col gap-2 ${paddingLeft}`}>
              {item.children!.map((child, idx) => (
                <RecursiveGuideCard 
                  key={idx} 
                  item={child} 
                  depth={depth + 1} // 깊이 1 증가
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}