import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { List, AlignLeft } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<number>(0);
  
  // 섹션 참조 배열
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (allGuides && slug) {
      const found = allGuides.find(g => g.id === slug);
      setTargetGuide(found || null);
    }
  }, [allGuides, slug]);

  // Scroll Spy 로직
  useEffect(() => {
    if (!targetGuide) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.id.replace('section-', ''));
            setActiveSection(index);
          }
        });
      },
      {
        root: null, 
        // 💡 [Tip] 상단 탭바 높이가 있으므로 상단 마진을 좀 더 넉넉히 음수로 줍니다.
        // 화면 상단 15% 지점을 지나가면 활성화
        rootMargin: '-15% 0px -80% 0px', 
        threshold: 0
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [targetGuide]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index); 
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">가이드 로딩 중...</div>;
  if (!targetGuide) return <div className="text-center text-gray-400 py-10">내용을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 pb-32 relative">
      {/* items-start 필수 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">
        
        {/* 왼쪽: 메인 콘텐츠 */}
        <div className="min-w-0 space-y-4">
          <div className="flex items-center gap-3 mb-6 border-b border-indigo-100 pb-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <AlignLeft className="w-6 h-6"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{targetGuide.title}</h2>
          </div>
          
          {targetGuide.items.map((item, idx) => (
            <div 
              key={idx} 
              id={`section-${idx}`} 
              ref={el => sectionRefs.current[idx] = el}
              // 💡 중요: 스크롤 시 상단 탭바에 가려지지 않도록 여백(Scroll Margin) 추가
              className="scroll-mt-28" 
            >
              <RecursiveGuideCard item={item} depth={0} />
            </div>
          ))}
        </div>

        {/* 오른쪽: 목차 영역 (Sticky) */}
        {/* GuidePage에서 스크롤이 발생하므로 top-4는 스크롤 컨테이너 기준 최상단+4px 입니다. */}
        <aside className="hidden lg:block sticky top-4 self-start z-10 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-100/60 max-h-[calc(100vh-120px)] flex flex-col">
            <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 text-sm uppercase tracking-wide">
               <List className="w-4 h-4 text-indigo-500 flex-shrink-0"/> 
               <span>목차</span>
            </h3>
            <div className="space-y-1 overflow-y-auto pr-1 custom-scrollbar">
              {targetGuide.items.map((item, idx) => {
                const isActive = activeSection === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(idx)}
                    className={`
                      group flex items-center w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className={`
                      w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-300 flex-shrink-0
                      ${isActive ? 'bg-indigo-500 scale-125' : 'bg-gray-300 group-hover:bg-indigo-300'}
                    `}></span>
                    <span className="text-sm truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
