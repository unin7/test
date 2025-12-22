import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List } from 'lucide-react';
import { useJsonData } from '../../../hooks/useJsonData';
import { RecursiveGuideCard, GuideItem } from './RecursiveGuideCard';

interface GuideGroup {
  id: string;
  title: string;
  items: GuideItem[];
}

export function WikiGuideSection() {
  const { slug } = useParams();
  const { data: allGuides, loading } = useJsonData<GuideGroup[]>('guides');
  const [targetGuide, setTargetGuide] = useState<GuideGroup | null>(null);

  useEffect(() => {
    if (allGuides && slug) {
      // URL의 slug와 json의 id가 일치하는 가이드 찾기
      const found = allGuides.find(g => g.id === slug);
      setTargetGuide(found || null);
    }
  }, [allGuides, slug]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">가이드 로딩 중...</div>;
  if (!targetGuide) return <div className="text-center text-gray-400 py-10">내용을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
        
        {/* 1. 왼쪽: 메인 콘텐츠 (재귀형 카드 사용) */}
        <div className="min-w-0 space-y-4 order-1">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">{targetGuide.title}</h2>
          {targetGuide.items.map((item, idx) => (
            <div key={idx} id={`section-${idx}`} className="scroll-mt-24">
              <RecursiveGuideCard item={item} depth={0} />
            </div>
          ))}
        </div>

        {/* 2. 오른쪽: 목차 영역 */}
        <aside className="order-2 w-full lg:w-auto sticky top-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100/50">
            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
               <List className="w-4 h-4 text-purple-600"/> 
               <span>목차</span>
            </h3>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {targetGuide.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSection(idx)}
                  className="block w-full text-left px-3 py-2 rounded-lg transition-all text-sm truncate text-gray-900 font-semibold hover:bg-purple-50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
